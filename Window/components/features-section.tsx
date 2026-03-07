import {
  Thermometer,
  Smartphone,
  Volume2,
  Shield,
  Wifi,
  Leaf,
} from "lucide-react"

const features = [
  {
    icon: Thermometer,
    title: "Precision Temperature Sensing",
    description:
      "High-accuracy sensors monitor indoor and outdoor temperatures in real-time to make intelligent decisions.",
  },
  {
    icon: Wifi,
    title: "Smart Home Integration",
    description:
      "Works seamlessly with Apple HomeKit, Google Home, Amazon Alexa, and Matter-compatible systems.",
  },
  {
    icon: Volume2,
    title: "Whisper-Quiet Operation",
    description:
      "Our precision-engineered motor operates at under 25dB, quieter than a library.",
  },
  {
    icon: Shield,
    title: "Safety First",
    description:
      "Built-in obstacle detection, rain sensors, and security locks keep your home safe.",
  },
  {
    icon: Smartphone,
    title: "Intuitive App Control",
    description:
      "Set schedules, adjust preferences, and monitor your home climate from anywhere in the world.",
  },
  {
    icon: Leaf,
    title: "Energy Efficient",
    description:
      "Reduce HVAC usage by up to 40% through intelligent natural ventilation management.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="font-serif text-4xl font-medium tracking-tight md:text-5xl text-balance">
            Intelligent features for effortless comfort
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every detail designed to make your home smarter and more comfortable.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
