import Link from "next/link"
import { Droplet } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Droplet className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">LifeLink</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Connecting blood donors with those in need. 
              Every donation can save up to three lives.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
            <ul className="mt-4 flex flex-col gap-2">
              <li>
                <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/register/donor" className="text-sm text-muted-foreground hover:text-foreground">
                  Become a Donor
                </Link>
              </li>
              <li>
                <Link href="/register/requester" className="text-sm text-muted-foreground hover:text-foreground">
                  Request Blood
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Account</h3>
            <ul className="mt-4 flex flex-col gap-2">
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/register/donor" className="text-sm text-muted-foreground hover:text-foreground">
                  Register as Donor
                </Link>
              </li>
              <li>
                <Link href="/register/requester" className="text-sm text-muted-foreground hover:text-foreground">
                  Register as Requester
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <ul className="mt-4 flex flex-col gap-2">
              <li className="text-sm text-muted-foreground">
                support@lifelink.com
              </li>
              <li className="text-sm text-muted-foreground">
                +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LifeLink. All rights reserved. 
            A school project for demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  )
}
