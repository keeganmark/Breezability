import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorks } from "@/components/how-it-works"
import { DemoSection } from "@/components/demo-section"
import { SpecsSection } from "@/components/specs-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <DemoSection />
      <SpecsSection />
      <Footer />
    </main>
  )
}
