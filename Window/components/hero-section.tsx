"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Thermometer } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-24">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute left-1/4 bottom-1/4 h-64 w-64 rounded-full bg-primary/5 blur-2xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="flex flex-col gap-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Now accepting pre-orders
            </div>

            <h1 className="font-serif text-5xl font-medium leading-tight tracking-tight md:text-6xl lg:text-7xl text-balance">
              The window that{" "}
              <span className="text-primary">thinks</span> for you
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              Breeze is an intelligent window automation system that senses your
              desired indoor temperature and opens windows accordingly. Set your
              comfort, let nature do the rest.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" className="gap-2">
                Pre-order Now
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-semibold">24/7</div>
                <div className="text-sm text-muted-foreground">
                  Climate monitoring
                </div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-semibold">-40%</div>
                <div className="text-sm text-muted-foreground">
                  Energy savings
                </div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-semibold">Silent</div>
                <div className="text-sm text-muted-foreground">
                  Operation
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-lg">
              <div className="absolute inset-0 rounded-3xl border border-border bg-card/50 backdrop-blur-sm" />
              
              <div className="absolute inset-4 flex flex-col items-center justify-center gap-6">
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary/30 bg-secondary">
                  <Thermometer className="h-16 w-16 text-primary" />
                </div>

                <div className="flex w-full max-w-xs justify-between px-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Current</div>
                    <div className="text-4xl font-semibold">26°C</div>
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Target</div>
                    <div className="text-4xl font-semibold text-primary">22°C</div>
                  </div>
                </div>

                <div className="flex w-full max-w-xs flex-col gap-2 rounded-xl bg-secondary/50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Window Status</span>
                    <span className="text-primary font-medium">Opening</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-background">
                    <div className="h-full w-3/4 rounded-full bg-primary transition-all duration-1000" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
