import { UserPlus, Search, MessageCircle } from "lucide-react"

const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    description: "Sign up as a donor or requester. Provide your blood type, location, and contact details to get started.",
    icon: UserPlus,
  },
  {
    step: "02",
    title: "Find a Match",
    description: "Our system automatically matches donors with compatible blood requests based on blood type and location.",
    icon: Search,
  },
  {
    step: "03",
    title: "Connect & Donate",
    description: "Chat directly with your match to coordinate the donation. Safe, secure, and simple communication.",
    icon: MessageCircle,
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-card px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Getting started with LifeLink is simple. Follow these three steps to save a life.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative rounded-2xl border border-border bg-background p-8 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-semibold text-primary">{item.step}</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
