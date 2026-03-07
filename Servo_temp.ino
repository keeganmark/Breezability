#include <Servo.h>

Servo Window;
int position = 0;
int tempPin = A0;
int x = 0;

void setup() {

  Window.attach(3);
  Serial.begin(9600);
  Window.write(0);
  delay(5000);
}

void loop() {
  
  int measure = analogRead(tempPin); 
  float voltage = measure * (4.4 / 1023.0);
  float temperatureC = (voltage - 0.5) * 100;
  position = ((temperatureC-23)*100);
  if(position >= 0){
    Window.write(position); 
  }             
  Serial.print("Temperature: ");
  Serial.print(temperatureC);
  Serial.println("°C");

  delay(2000);
}