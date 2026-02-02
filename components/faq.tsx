import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4">
      <div className="col-span-1 border-b border-border p-6 lg:border-b-0 lg:border-r lg:p-12">
        <h2 className="font-sans text-3xl font-bold uppercase md:text-4xl">FAQ</h2>
        <p className="mt-2 font-mono text-sm text-muted-foreground">Common questions about IFA.</p>
      </div>

      <div className="col-span-1 p-6 lg:col-span-3 lg:p-12">
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="item-1" className="border-border">
            <AccordionTrigger className="font-sans text-lg font-bold hover:no-underline">
              Is this just another chatbot?
            </AccordionTrigger>
            <AccordionContent className="font-mono text-muted-foreground">
              No. A chatbot is reactive—it waits for customers to come to you. An IFA Agent is proactive—it goes out
              onto the internet and finds customers for you.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-border">
            <AccordionTrigger className="font-sans text-lg font-bold hover:no-underline">
              Is this safe for my brand?
            </AccordionTrigger>
            <AccordionContent className="font-mono text-muted-foreground">
              Absolutely. Your agent is trained on your specific brand voice. You set the rules of engagement and can
              review all its interactions. It's your brand, your agent, your rules.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-border">
            <AccordionTrigger className="font-sans text-lg font-bold hover:no-underline">
              Do I need to know crypto?
            </AccordionTrigger>
            <AccordionContent className="font-mono text-muted-foreground">
              No. The core product will work without any crypto knowledge. $IFA is a community token for those who want
              to be part of the journey—totally optional.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-border">
            <AccordionTrigger className="font-sans text-lg font-bold hover:no-underline">
              What is OpenClaw?
            </AccordionTrigger>
            <AccordionContent className="font-mono text-muted-foreground">
              OpenClaw is the powerful, open-source AI agent framework that serves as the "engine" for our agents. We've
              built a secure, scalable platform on top of it so you get all the power without any technical headaches.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
