const steps = [
  {
    number: "01",
    title: "Set Your Target",
    description:
      "Use the app or voice commands to set your ideal indoor temperature. Breezability remembers your preferences.",
  },
  {
    number: "02",
    title: "Continuous Monitoring",
    description:
      "Precision sensors constantly track indoor temperature, outdoor conditions, humidity, and air quality.",
  },
  {
    number: "03",
    title: "Smart Decisions",
    description:
      "Our algorithm determines if opening the window will help reach your target temperature efficiently.",
  },
  {
    number: "04",
    title: "Automatic Adjustment",
    description:
      "The window opens or closes silently to the optimal position, maintaining your perfect climate.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-secondary/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-medium tracking-tight md:text-5xl text-balance">
            How Breezability works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Simple setup, intelligent operation, perfect comfort.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden h-px w-full bg-border lg:block" />
              )}
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background text-xl font-semibold text-primary">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
