"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Thermometer, 
  Wind, 
  Activity, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  Minus,
  Plus,
  ArrowLeft,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

// Backend API URL - change this to your Python backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface SensorData {
  temperature: number | null
  servo_position: number | null
  target_temperature: number
  window_status: string
  last_updated: string | null
  connected: boolean
}

interface HistoryEntry {
  temperature: number | null
  servo_position: number | null
  timestamp: string
}

export default function DashboardPage() {
  const [data, setData] = useState<SensorData>({
    temperature: null,
    servo_position: null,
    target_temperature: 22,
    window_status: "unknown",
    last_updated: null,
    connected: false,
  })
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/data`)
      if (!response.ok) throw new Error("Failed to fetch data")
      const result = await response.json()
      setData(result)
      setError(null)
      setLastFetchTime(new Date())
    } catch (err) {
      setError("Cannot connect to backend. Make sure the Python server is running.")
      setData(prev => ({ ...prev, connected: false }))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/history`)
      if (!response.ok) throw new Error("Failed to fetch history")
      const result = await response.json()
      setHistory(result.history || [])
    } catch {
      // Silently fail for history
    }
  }, [])

  const updateTargetTemperature = async (newTarget: number) => {
    try {
      await fetch(`${API_BASE_URL}/api/target`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ temperature: newTarget }),
      })
      setData(prev => ({ ...prev, target_temperature: newTarget }))
    } catch {
      setError("Failed to update target temperature")
    }
  }

  // Poll for data every 2 seconds
  useEffect(() => {
    fetchData()
    fetchHistory()
    
    const dataInterval = setInterval(fetchData, 2000)
    const historyInterval = setInterval(fetchHistory, 5000)
    
    return () => {
      clearInterval(dataInterval)
      clearInterval(historyInterval)
    }
  }, [fetchData, fetchHistory])

  const getWindowOpenPercentage = () => {
    if (data.servo_position === null) return 0
    // Assuming servo range 0-180 maps to 0-100% open
    return Math.min(100, Math.round((data.servo_position / 180) * 100))
  }

  const formatTime = (isoString: string | null) => {
    if (!isoString) return "Never"
    return new Date(isoString).toLocaleTimeString()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">Live Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Real-time sensor data from your window
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge 
                variant={data.connected ? "default" : "destructive"}
                className="flex items-center gap-1"
              >
                {data.connected ? (
                  <>
                    <Wifi className="h-3 w-3" />
                    Connected
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3" />
                    Disconnected
                  </>
                )}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => { fetchData(); fetchHistory(); }}
                disabled={isLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-medium">Connection Error</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Current Temperature */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Temperature
              </CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tabular-nums">
                {data.temperature !== null ? `${data.temperature.toFixed(1)}°C` : "--"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {formatTime(data.last_updated)}
              </p>
            </CardContent>
          </Card>

          {/* Target Temperature */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Target Temperature
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateTargetTemperature(Math.max(16, data.target_temperature - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-3xl font-bold tabular-nums">
                  {data.target_temperature}°C
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateTargetTemperature(Math.min(30, data.target_temperature + 1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Window Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Window Status
              </CardTitle>
              <Wind className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold capitalize">
                {data.window_status}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Servo: {data.servo_position !== null ? `${data.servo_position}°` : "--"}
              </p>
            </CardContent>
          </Card>

          {/* Window Open % */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Window Open
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tabular-nums">
                {getWindowOpenPercentage()}%
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${getWindowOpenPercentage()}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Window Visualization */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Window Visualization</CardTitle>
              <CardDescription>
                Live representation of your window position
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <div className="relative h-64 w-48 rounded-lg border-4 border-muted-foreground/30 bg-secondary/50">
                <div className="absolute inset-1 overflow-hidden rounded bg-background/20">
                  {/* Open area (air flow indicator) */}
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-primary/20 transition-all duration-700 ease-out"
                    style={{ height: `${getWindowOpenPercentage()}%` }}
                  />
                  {/* Window pane */}
                  <div
                    className="absolute left-0 right-0 border-b-2 border-primary bg-card transition-all duration-700 ease-out"
                    style={{ top: `${100 - getWindowOpenPercentage()}%`, height: "50%" }}
                  >
                    <div className="absolute left-1/2 top-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/50" />
                  </div>
                </div>
                
                {/* Status indicator */}
                <div className="absolute -right-16 top-1/2 -translate-y-1/2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      data.connected && getWindowOpenPercentage() > 0 
                        ? "bg-primary animate-pulse" 
                        : "bg-muted-foreground/30"
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Readings</CardTitle>
              <CardDescription>
                Last {history.length} temperature readings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No readings yet. Connect Arduino and start the backend.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {history.slice(-10).reverse().map((entry, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2 text-sm"
                      >
                        <span className="text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                        <div className="flex gap-4">
                          <span className="tabular-nums">
                            {entry.temperature !== null ? `${entry.temperature.toFixed(1)}°C` : "--"}
                          </span>
                          <span className="tabular-nums text-muted-foreground">
                            Servo: {entry.servo_position ?? "--"}°
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connection Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
            <CardDescription>
              How to connect your Arduino to this dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
              <li>Upload <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">servo_temp.ino</code> to your Arduino</li>
              <li>Connect Arduino via USB to your computer</li>
              <li>Update <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">SERIAL_PORT</code> in <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">backend.py</code> to match your port</li>
              <li>Run the backend: <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">cd scripts && uv run backend.py</code></li>
              <li>Data will appear automatically once connected</li>
            </ol>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
