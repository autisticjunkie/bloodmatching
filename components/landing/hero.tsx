import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, Users, ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          {/* Left Content */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Trusted by hospitals nationwide
            </div>
            
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Every Drop Counts.{" "}
              <span className="text-primary">Save a Life Today.</span>
            </h1>
            
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              LifeLink connects blood donors with patients in need, quickly and securely. 
              Whether you want to donate or need blood urgently, we make the process simple, 
              safe, and reliable.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="gap-2">
                <Link href="/register/requester">
                  <Heart className="h-5 w-5" />
                  Request Blood
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2">
                <Link href="/register/donor">
                  <Users className="h-5 w-5" />
                  Become a Donor
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-border pt-8 sm:gap-8">
              <div>
                <p className="text-2xl font-bold text-foreground sm:text-3xl">2,500+</p>
                <p className="text-xs text-muted-foreground sm:text-sm">Registered Donors</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground sm:text-3xl">850+</p>
                <p className="text-xs text-muted-foreground sm:text-sm">Lives Saved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground sm:text-3xl">98%</p>
                <p className="text-xs text-muted-foreground sm:text-sm">Match Success</p>
              </div>
            </div>
          </div>

          {/* Right Image Grid */}
          <div className="relative">
            {/* Mobile: Single image */}
            <div className="overflow-hidden rounded-2xl lg:hidden">
              <Image
                src="/images/hero-donation.jpg"
                alt="Blood donation in progress"
                width={600}
                height={400}
                className="h-64 w-full object-cover sm:h-80"
              />
            </div>
            
            {/* Desktop: Image grid */}
            <div className="hidden grid-cols-2 gap-4 lg:grid">
              {/* Main large image */}
              <div className="col-span-2 overflow-hidden rounded-2xl">
                <Image
                  src="/images/hero-donation.jpg"
                  alt="Blood donation in progress"
                  width={600}
                  height={300}
                  className="h-48 w-full object-cover"
                />
              </div>
              {/* Two smaller images */}
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/images/hero-blood-bag.jpg"
                  alt="Blood bag for transfusion"
                  width={300}
                  height={200}
                  className="h-40 w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/images/hero-laboratory.jpg"
                  alt="Medical professional taking blood sample"
                  width={300}
                  height={200}
                  className="h-40 w-full object-cover"
                />
              </div>
            </div>

            {/* Floating card - hidden on mobile */}
            <div className="absolute -left-8 bottom-8 hidden rounded-xl border border-border bg-card p-4 shadow-lg lg:block">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <Image
                    src="/images/donor-portrait-2.jpg"
                    alt="Donor"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full border-2 border-card object-cover"
                  />
                  <Image
                    src="/images/donor-portrait-1.jpg"
                    alt="Donor"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full border-2 border-card object-cover"
                  />
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary text-xs font-medium text-primary-foreground">
                    +99
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Active Donors</p>
                  <p className="text-xs text-muted-foreground">Ready to help now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute -top-40 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute -bottom-40 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl"></div>
    </section>
  )
}
