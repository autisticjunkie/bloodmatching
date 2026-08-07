import type { Metadata } from "next"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export const metadata: Metadata = {
  title: "Privacy Policy | LifeLink",
  description:
    "How LifeLink collects, uses, discloses and protects the personal data of donors and requesters.",
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

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-10 border-b border-border pb-8">
          <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Privacy Policy</h1>
          <p className="mt-3 text-muted-foreground">
            Last updated {LAST_UPDATED}. This policy explains what personal data LifeLink collects,
            why it is collected, and the control you retain over it.
          </p>
        </header>

        <div className="space-y-10">
          <Section title="1. Who we are">
            <p>
              LifeLink is a blood donor matching and locator service operating in Nigeria. It
              connects voluntary blood donors with patients, hospitals, clinics, blood banks and
              non-governmental organisations that need blood during medical emergencies. This
              policy is issued in accordance with the Nigeria Data Protection Act, 2023.
            </p>
          </Section>

          <Section title="2. The data we collect">
            <p>We collect only what the matching process requires.</p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <span className="font-medium text-foreground">Account details</span> — your name,
                email address, telephone number and a one-way hash of your password. We never
                store your password in a readable form.
              </li>
              <li>
                <span className="font-medium text-foreground">Donor profile</span> — your blood
                group, state and city of residence, gender, availability status, date of your last
                donation and cumulative number of donations.
              </li>
              <li>
                <span className="font-medium text-foreground">Requester profile</span> — the type
                of requester you are, your organisation name where applicable, and your state and
                city.
              </li>
              <li>
                <span className="font-medium text-foreground">Blood requests</span> — the patient
                name you supply, blood group required, units needed, urgency, treating facility and
                its location, contact number and the date the blood is required.
              </li>
              <li>
                <span className="font-medium text-foreground">Messages</span> — the content of
                conversations you exchange with a matched donor or requester.
              </li>
            </ul>
            <p>
              We record your state and city rather than your precise position. LifeLink does not
              track your live location, and it does not ask for or store your satellite coordinates.
            </p>
          </Section>

          <Section title="3. Why we use it">
            <p>
              Your blood group and locality are used to determine which donors are serologically
              compatible with a given patient and close enough to the treating facility to attend
              in time. Your availability status and date of last donation are used to respect the
              minimum interval between donations and to avoid contacting you when you have said you
              are unavailable. Your contact details are used to alert you when you are matched to a
              request. Aggregate, non-identifying counts are used to report which blood groups are
              scarce and where demand is going unmet.
            </p>
            <p>
              We do not sell your data, we do not use it for advertising, and we do not share it
              with third parties for their own purposes.
            </p>
          </Section>

          <Section title="4. Who can see your details">
            <p>
              Your name and locality become visible to a requester only after the system has matched
              you to one of their specific blood requests. Until that point you are counted in
              search results but not identified.
            </p>
            <p>
              Your email address and telephone number are never displayed to another user. All
              contact between a donor and a requester is carried through the in-application
              conversation attached to that match, so that neither party needs to publish personal
              contact details.
            </p>
            <p>
              System administrators can view account records in order to verify donors and to
              investigate misuse. They see aggregate reports rather than routine access to
              individual clinical records.
            </p>
          </Section>

          <Section title="5. How we protect it">
            <p>
              Passwords are stored as adaptive one-way hashes with a per-password salt and are never
              recoverable, even by us. Sessions are identified by a random token held on the server
              and transmitted in an HTTP-only cookie, so it cannot be read by scripts in your
              browser. All traffic between your device and the service is encrypted in transit.
              Database access is parameterised throughout, and every request is checked both for
              your role and for your ownership of the record you are asking for.
            </p>
          </Section>

          <Section title="6. How long we keep it">
            <p>
              Account and profile data are retained while your account remains open. Blood requests,
              matches and conversations are retained after a request is closed so that a record of
              the donation arrangement exists for clinical governance and audit. If you close your
              account, your profile and personal identifiers are removed; where a record must be
              retained for audit it is retained without information that identifies you.
            </p>
          </Section>

          <Section title="7. Your rights">
            <p>
              Under the Nigeria Data Protection Act, 2023 you may request access to the personal
              data we hold about you, ask for inaccurate data to be corrected, ask for your data to
              be deleted, object to particular uses of it, and withdraw consent at any time. You can
              correct most of your details yourself from your profile page, and you can remove
              yourself from matching immediately by switching your availability off.
            </p>
          </Section>

          <Section title="8. Cookies">
            <p>
              LifeLink sets a single cookie, which holds your session token and keeps you signed in.
              It is essential to the operation of the service. We do not use advertising or
              third-party tracking cookies.
            </p>
          </Section>

          <Section title="9. Children">
            <p>
              LifeLink is not intended for anyone under 18. We do not knowingly collect data from
              children, and an account found to belong to a minor will be closed.
            </p>
          </Section>

          <Section title="10. Changes and contact">
            <p>
              If this policy changes materially we will notify registered users. For any question
              about your data, or to exercise any of the rights above, contact the service
              administrator through the address published on the site.
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
