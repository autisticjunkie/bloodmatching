import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { TrustSafety } from "@/components/landing/trust-safety"
import { Testimonials } from "@/components/landing/testimonials"
import { FAQ } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <TrustSafety />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
