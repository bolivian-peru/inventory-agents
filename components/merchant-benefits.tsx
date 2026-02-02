import { Lightbulb, Users, Code } from "lucide-react"

export function MerchantBenefits() {
  const benefits = [
    {
      icon: Lightbulb,
      title: "Early Experiment",
      description:
        "This is R&D, not a finished product. We're exploring what's possible when small sellers get AI representation in agent networks.",
    },
    {
      icon: Users,
      title: "Community-Driven",
      description:
        "We're building based on feedback from the Telegram group. Tell us what problems you actually have—we'll try to solve them.",
    },
    {
      icon: Code,
      title: "Open Source Soon",
      description:
        "Core code going open-source. If you're technical, you'll be able to run and modify your own agent. Transparency first.",
    },
  ]

  return (
    <section className="border-b border-border py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative border border-border bg-card p-6 transition-colors hover:border-accent hover:bg-accent/5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground group-hover:border-accent group-hover:text-accent">
                <benefit.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-sans text-xl font-bold">{benefit.title}</h3>
              <p className="font-mono text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
