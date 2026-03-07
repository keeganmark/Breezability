"""
Stage 2: FastAPI Backend for Smart Window Opener
This script runs a backend server that:
1. Reads Arduino serial data in a background thread
2. Stores the latest values in memory
3. Exposes REST API endpoints for the frontend

Usage:
    uv run backend.py

API Endpoints:
    GET /api/data      - Get latest sensor data
    GET /api/history   - Get recent history (last 100 readings)
    POST /api/target   - Set target temperature
    GET /              - Health check

The server runs on http://localhost:8000
"""

import serial
import threading
import time
from datetime import datetime
from collections import deque
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configuration
SERIAL_PORT = "/dev/ttyUSB0"  # Update for your system
BAUD_RATE = 9600
TIMEOUT = 1
HISTORY_SIZE = 100

# Global state
sensor_data = {
    "temperature": None,
    "servo_position": None,
    "target_temperature": 22.0,
    "window_status": "closed",
    "last_updated": None,
    "connected": False
}

# History buffer (deque for efficient append/pop)
history = deque(maxlen=HISTORY_SIZE)

# Lock for thread-safe updates
data_lock = threading.Lock()

# Serial reading thread
serial_thread: Optional[threading.Thread] = None
stop_serial = threading.Event()


class TargetTemperature(BaseModel):
    temperature: float


class SensorReading(BaseModel):
    temperature: Optional[float]
    servo_position: Optional[int]
    target_temperature: float
    window_status: str
    last_updated: Optional[str]
    connected: bool


def parse_arduino_data(line: str) -> dict:
    """Parse data from Arduino serial output."""
    data = {"temperature": None, "servo_position": None}
    
    try:
        if "," in line:
            parts = line.split(",")
            for part in parts:
                part = part.strip()
                if part.startswith("TEMP:"):
                    data["temperature"] = float(part.replace("TEMP:", ""))
                elif part.startswith("SERVO:"):
                    data["servo_position"] = int(part.replace("SERVO:", ""))
        elif line.startswith("TEMP:"):
            data["temperature"] = float(line.replace("TEMP:", ""))
        elif line.startswith("SERVO:"):
            data["servo_position"] = int(line.replace("SERVO:", ""))
        else:
            # Try parsing as plain number
            try:
                data["temperature"] = float(line.strip())
            except ValueError:
                pass
    except (ValueError, IndexError):
        pass
    
    return data


def calculate_window_status(servo_position: Optional[int]) -> str:
    """Determine window status based on servo position."""
    if servo_position is None:
        return "unknown"
    if servo_position <= 10:
        return "closed"
    elif servo_position <= 45:
        return "25% open"
    elif servo_position <= 90:
        return "50% open"
    elif servo_position <= 135:
        return "75% open"
    else:
        return "fully open"


def serial_reader_thread():
    """Background thread that reads from Arduino serial port."""
    global sensor_data
    
    print(f"Serial thread: Connecting to {SERIAL_PORT}...")
    
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=TIMEOUT)
        time.sleep(2)  # Wait for Arduino reset
        
        with data_lock:
            sensor_data["connected"] = True
        
        print(f"Serial thread: Connected to {SERIAL_PORT}")
        
        while not stop_serial.is_set():
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8', errors='ignore').strip()
                if line:
                    parsed = parse_arduino_data(line)
                    timestamp = datetime.now().isoformat()
                    
                    with data_lock:
                        if parsed["temperature"] is not None:
                            sensor_data["temperature"] = parsed["temperature"]
                        if parsed["servo_position"] is not None:
                            sensor_data["servo_position"] = parsed["servo_position"]
                            sensor_data["window_status"] = calculate_window_status(parsed["servo_position"])
                        sensor_data["last_updated"] = timestamp
                        
                        # Add to history
                        history.append({
                            "temperature": sensor_data["temperature"],
                            "servo_position": sensor_data["servo_position"],
                            "timestamp": timestamp
                        })
            
            time.sleep(0.1)
        
        ser.close()
        
    except serial.SerialException as e:
        print(f"Serial thread error: {e}")
        with data_lock:
            sensor_data["connected"] = False
    
    print("Serial thread: Stopped")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    global serial_thread
    
    # Start serial reader thread
    stop_serial.clear()
    serial_thread = threading.Thread(target=serial_reader_thread, daemon=True)
    serial_thread.start()
    print("Backend started - Serial reader thread running")
    
    yield
    
    # Shutdown
    stop_serial.set()
    if serial_thread:
        serial_thread.join(timeout=2)
    print("Backend shutdown complete")


# Create FastAPI app
app = FastAPI(
    title="Smart Window Opener API",
    description="API for Smart Window Opener - reads Arduino sensor data",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "smart-window-backend"}


@app.get("/api/data", response_model=SensorReading)
async def get_sensor_data():
    """Get the latest sensor data."""
    with data_lock:
        return SensorReading(**sensor_data)


@app.get("/api/history")
async def get_history():
    """Get recent sensor history."""
    with data_lock:
        return {"history": list(history), "count": len(history)}


@app.post("/api/target")
async def set_target_temperature(target: TargetTemperature):
    """Set the target temperature."""
    with data_lock:
        sensor_data["target_temperature"] = target.temperature
    return {"success": True, "target_temperature": target.temperature}


@app.get("/api/status")
async def get_connection_status():
    """Get Arduino connection status."""
    with data_lock:
        return {
            "connected": sensor_data["connected"],
            "last_updated": sensor_data["last_updated"]
        }


# For development/testing without Arduino
@app.post("/api/mock")
async def mock_data(temperature: float, servo_position: int):
    """Mock endpoint for testing without Arduino (development only)."""
    timestamp = datetime.now().isoformat()
    
    with data_lock:
        sensor_data["temperature"] = temperature
        sensor_data["servo_position"] = servo_position
        sensor_data["window_status"] = calculate_window_status(servo_position)
        sensor_data["last_updated"] = timestamp
        sensor_data["connected"] = True
        
        history.append({
            "temperature": temperature,
            "servo_position": servo_position,
            "timestamp": timestamp
        })
    
    return {"success": True, "data": sensor_data}


if __name__ == "__main__":
    import uvicorn
    print("Starting Smart Window Opener Backend...")
    print("API will be available at http://localhost:8000")
    print("API docs at http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
