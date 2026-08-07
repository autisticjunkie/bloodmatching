import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "LifeLink helped us find a donor within hours when my father needed an emergency transfusion. The platform is truly life-saving.",
    name: "Chioma Eze",
    role: "Family Member",
    image: "/images/testimonial-1.jpg",
  },
  {
    quote: "As a regular donor, I love how easy it is to see requests in my area. The app notifies me when someone with my blood type needs help.",
    name: "Olumide Bakare",
    role: "Regular Donor",
    image: "/images/donor-portrait-2.jpg",
  },
  {
    quote: "Our hospital has partnered with LifeLink to manage blood requests. The matching system is efficient and the response times are excellent.",
    name: "Dr. Abubakar",
    role: "Hospital Administrator",
    image: "/images/testimonial-2.jpg",
  },
]

export function Testimonials() {
  return (
    <section className="bg-card px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Stories That Inspire
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real people, real impact. Hear from our community of donors and recipients.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative border-border bg-background">
              <CardContent className="pt-6">
                <Quote className="mb-4 h-8 w-8 text-primary/20" />
                <p className="text-muted-foreground leading-relaxed">
                  {`"${testimonial.quote}"`}
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
