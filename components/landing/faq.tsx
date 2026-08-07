import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How do I register as a blood donor?",
    answer: "Click on 'Become a Donor' button, fill in your personal details including your blood type, location, and contact information. Once submitted, our admin team will verify your profile before you can start receiving donation requests.",
  },
  {
    question: "Is my personal information safe?",
    answer: "Yes, your privacy is our priority. Your personal details are only shared with matched requesters, and all communications happen through our secure platform. We never share your information with third parties.",
  },
  {
    question: "How does the matching system work?",
    answer: "When a requester posts a blood request, our system automatically finds compatible donors based on blood type and geographic location. Matched donors receive a notification and can choose to accept or decline the request.",
  },
  {
    question: "Can I request blood for someone else?",
    answer: "Yes, you can register as a requester on behalf of a family member or friend. Simply provide the patient's blood type requirement and hospital details when creating a request.",
  },
  {
    question: "How quickly will I find a donor?",
    answer: "Response times vary depending on blood type and location. Common blood types typically find matches within hours, while rare blood types may take longer. We prioritize urgent requests to ensure faster matching.",
  },
  {
    question: "Is there any cost to use LifeLink?",
    answer: "LifeLink is completely free for both donors and requesters. Our mission is to save lives by connecting people, not to make a profit from blood donations.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="bg-card px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Have questions? We have answers. If you don&apos;t find what you&apos;re looking for, 
            feel free to contact us.
          </p>
        </div>

        <div className="mt-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
