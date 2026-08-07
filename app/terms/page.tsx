import type { Metadata } from "next"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { AlertTriangle } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service | LifeLink",
  description:
    "The terms governing use of the LifeLink blood donor matching and locator service.",
}

const LAST_UPDATED = "January 2026"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  )
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-10 border-b border-border pb-8">
          <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Terms of Service</h1>
          <p className="mt-3 text-muted-foreground">
            Last updated {LAST_UPDATED}. By creating an account you agree to these terms. Please
            read the medical notice below carefully.
          </p>
        </header>

        <div className="mb-10 flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="space-y-2">
            <p className="font-medium text-foreground">Medical notice</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              LifeLink helps you find a compatible donor. It does not provide medical advice and it
              does not carry out any part of the transfusion process. Blood grouping,
              cross-matching, screening for transfusion-transmissible infection, donor health
              assessment and the transfusion itself remain the sole responsibility of a licensed
              medical facility. Never rely on a blood group shown in this service in place of a
              laboratory test.
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <Section title="1. Who may use the service">
            <p>
              You must be at least 18 years old and capable of entering a binding agreement. Donor
              accounts are for individuals. Requester accounts may be held by an individual patient
              or their representative, or by a hospital, clinic, blood bank or non-governmental
              organisation. You may hold only one account, and you must not share your login
              credentials.
            </p>
          </Section>

          <Section title="2. Accuracy of the information you provide">
            <p>
              You are responsible for the accuracy of everything you enter, and in particular your
              blood group, your locality, your availability and the date of your last donation. The
              matching engine ranks donors using exactly this information, so an inaccurate entry
              can send the wrong person to a hospital during an emergency. Keep your profile current
              and switch your availability off whenever you are unable to donate.
            </p>
          </Section>

          <Section title="3. Donation must be voluntary and unpaid">
            <p>
              LifeLink exists to support voluntary, non-remunerated blood donation, which is the
              safest source of blood. You must not offer, solicit, demand or accept payment or any
              other reward in exchange for donating blood through this service. Accounts used to
              buy or sell blood will be closed and may be reported to the relevant authorities.
            </p>
          </Section>

          <Section title="4. Eligibility to donate">
            <p>
              Donation carries medical requirements that this service cannot assess. You should not
              respond to a request if you are unwell, if you are within the minimum interval since
              your last donation, or if you have any condition that makes donation unsafe for you or
              for the recipient. The treating facility will screen you on arrival and may decline
              your donation. The service records the conventional interval between whole blood
              donations and will rank you lower while you are within it, but this is an aid, not a
              medical clearance.
            </p>
          </Section>

          <Section title="5. Conduct">
            <p>You agree not to:</p>
            <ul className="ml-5 list-disc space-y-2">
              <li>create false blood requests or impersonate a patient, clinician or institution;</li>
              <li>harass, threaten or repeatedly contact another user through the messaging feature;</li>
              <li>
                use another user&apos;s details for any purpose other than arranging the donation
                you were matched for;
              </li>
              <li>publish another user&apos;s personal information outside the service;</li>
              <li>
                attempt to gain access to accounts, records or parts of the system you are not
                authorised to reach.
              </li>
            </ul>
          </Section>

          <Section title="6. Matching is a best-effort service">
            <p>
              The service identifies and ranks donors who appear compatible, available and nearby.
              It cannot guarantee that any donor will respond, attend, or prove eligible on
              screening, and it cannot guarantee that blood will be found in time. Do not use
              LifeLink as your only route to obtaining blood in an emergency. Always work through
              the treating hospital and the established transfusion service in parallel.
            </p>
          </Section>

          <Section title="7. Availability of the service">
            <p>
              We aim to keep the service running continuously but cannot promise uninterrupted
              availability. Access depends on your internet connection, and alerts may be delayed by
              network conditions outside our control. The service may be suspended for maintenance.
            </p>
          </Section>

          <Section title="8. Suspension and closure of accounts">
            <p>
              An administrator may deactivate an account that breaches these terms, that is used
              fraudulently, or that puts other users at risk. You may close your own account at any
              time. Records of past requests and matches may be retained for audit as described in
              the Privacy Policy.
            </p>
          </Section>

          <Section title="9. Limitation of liability">
            <p>
              The service is provided as-is. To the extent permitted by law, LifeLink is not liable
              for clinical outcomes, for the conduct of any user, for a donor failing to attend, or
              for any loss arising from reliance on information supplied by another user. Nothing in
              these terms limits liability that cannot lawfully be limited.
            </p>
          </Section>

          <Section title="10. Governing law and changes">
            <p>
              These terms are governed by the laws of the Federal Republic of Nigeria. We may update
              them from time to time; material changes will be notified to registered users, and
              continued use after a change constitutes acceptance of the revised terms.
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
