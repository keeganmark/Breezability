const specs = [
  { label: "Dimensions", value: "300 × 80 × 45 mm" },
  { label: "Weight", value: "1.2 kg" },
  { label: "Motor Force", value: "400N" },
  { label: "Noise Level", value: "<25 dB" },
  { label: "Connectivity", value: "WiFi, Bluetooth, Matter" },
  { label: "Power", value: "DC 24V (adapter included)" },
  { label: "Temperature Range", value: "-20°C to 50°C" },
  { label: "Sensor Accuracy", value: "±0.1°C" },
]

const compatibility = [
  "Apple HomeKit",
  "Google Home",
  "Amazon Alexa",
  "Samsung SmartThings",
  "Matter",
  "IFTTT",
]

export function SpecsSection() {
  return (
    <section id="specs" className="bg-secondary/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16">
          <h2 className="font-serif text-4xl font-medium tracking-tight md:text-5xl text-balance">
            Technical specifications
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built with precision engineering for lasting performance.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-6 text-xl font-semibold">Device Specs</h3>
            <div className="grid gap-4">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-6 text-xl font-semibold">Smart Home Compatibility</h3>
            <div className="flex flex-wrap gap-3">
              {compatibility.map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-border bg-secondary px-4 py-2 text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-xl bg-primary/10 p-4">
              <p className="text-sm text-muted-foreground">
                Breezability is designed to work with your existing smart home setup. 
                No hub required for basic operation - just connect to your WiFi 
                and you&apos;re ready to go.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
