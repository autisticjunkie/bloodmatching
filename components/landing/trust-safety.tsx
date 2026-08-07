import { Shield, Lock, CheckCircle, Clock } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Verified Donors",
    description: "All donors are verified by our admin team before they can respond to requests.",
  },
  {
    icon: Lock,
    title: "Secure Messaging",
    description: "Your conversations are private and secure. Personal details are protected.",
  },
  {
    icon: CheckCircle,
    title: "Quality Assurance",
    description: "We follow standard blood donation guidelines to ensure safety for everyone.",
  },
  {
    icon: Clock,
    title: "Fast Response",
    description: "Our matching system works quickly to connect urgent requests with available donors.",
  },
]

export function TrustSafety() {
  return (
    <section className="bg-background px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Your Safety is Our Priority
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              We understand that blood donation involves trust. That&apos;s why we&apos;ve built 
              LifeLink with safety and security at its core. Every donor is verified, 
              every conversation is protected, and every match is made with care.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
              <img
                src="/images/trust-safety.jpg"
                alt="Healthcare professional preparing for blood donation"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-4 rounded-xl border border-border bg-card p-4 shadow-lg sm:-left-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">100% Verified</p>
                  <p className="text-xs text-muted-foreground">All donors checked</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
