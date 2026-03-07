"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

export function DemoSection() {
  const [targetTemp, setTargetTemp] = useState(22)
  const [currentTemp, setCurrentTemp] = useState(26)
  const [windowPosition, setWindowPosition] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemp((prev) => {
        if (windowPosition > 0 && prev > targetTemp) {
          return Math.max(targetTemp, prev - 0.2)
        } else if (windowPosition === 0 && prev < 28) {
          return Math.min(28, prev + 0.1)
        }
        return prev
      })
    }, 500)

    return () => clearInterval(interval)
  }, [windowPosition, targetTemp])

  useEffect(() => {
    const diff = currentTemp - targetTemp
    if (diff > 2) {
      setWindowPosition(100)
    } else if (diff > 1) {
      setWindowPosition(75)
    } else if (diff > 0.5) {
      setWindowPosition(50)
    } else if (diff > 0) {
      setWindowPosition(25)
    } else {
      setWindowPosition(0)
    }
  }, [currentTemp, targetTemp])

  return (
    <section id="demo" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-medium tracking-tight md:text-5xl text-balance">
            See it in action
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Adjust the target temperature and watch how Breezability responds in real-time.
          </p>
        </div>

        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-card p-8 md:p-12">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="flex flex-col gap-8">
              <div>
                <div className="mb-2 text-sm text-muted-foreground">
                  Target Temperature
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTargetTemp((t) => Math.max(16, t - 1))}
                    aria-label="Decrease temperature"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-5xl font-semibold tabular-nums text-primary">
                    {targetTemp}°C
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTargetTemp((t) => Math.min(30, t + 1))}
                    aria-label="Increase temperature"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm text-muted-foreground">
                  Current Indoor Temperature
                </div>
                <div className="text-5xl font-semibold tabular-nums">
                  {currentTemp.toFixed(1)}°C
                </div>
              </div>

              <div className="rounded-xl bg-secondary p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">System Status</span>
                  <span
                    className={`font-medium ${
                      windowPosition > 0 ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {windowPosition > 0 ? "Active" : "Standby"}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {windowPosition > 0
                    ? `Cooling room - window ${windowPosition}% open`
                    : "Target temperature reached"}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative h-64 w-48 rounded-lg border-4 border-muted-foreground/30 bg-secondary/50">
                <div className="absolute inset-1 overflow-hidden rounded bg-background/20">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-primary/20 transition-all duration-700 ease-out"
                    style={{ height: `${windowPosition}%` }}
                  />
                  <div
                    className="absolute left-0 right-0 border-b-2 border-primary bg-card transition-all duration-700 ease-out"
                    style={{ top: `${100 - windowPosition}%`, height: "50%" }}
                  >
                    <div className="absolute left-1/2 top-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/50" />
                  </div>
                </div>
                
                <div className="absolute -right-16 top-1/2 -translate-y-1/2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      windowPosition > 0 ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
