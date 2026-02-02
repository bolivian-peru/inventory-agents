export function Explainer() {
  return (
    <div className="p-6 lg:p-12">
      <h2 className="mb-4 font-sans text-3xl font-bold uppercase tracking-tight md:text-4xl">
        You can't be everywhere at once.
      </h2>
      <h3 className="mb-8 font-sans text-2xl font-bold text-accent md:text-3xl">Your AI agent can.</h3>

      <div className="mb-12 max-w-3xl">
        <p className="font-mono text-lg leading-relaxed text-muted-foreground">
          As a creator, your time is your most valuable asset. You should be creating, not spending 12 hours a day
          searching Reddit threads and Discord channels for someone who might need your product. IFA handles the
          outreach, so you can get back to your craft.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Column 1 */}
        <div className="space-y-4">
          <h3 className="border-b border-border pb-2 font-sans text-xl font-bold">Tireless Outreach</h3>
          <div className="space-y-4 font-mono text-sm leading-relaxed text-muted-foreground">
            <p>Your AI agent monitors Reddit, Twitter, Discord, and forums around the clock.</p>
            <p>It finds conversations where your product is the perfect solution and joins them naturally.</p>
            <p>No more manual prospecting. Your agent does the legwork while you sleep.</p>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <h3 className="border-b border-border pb-2 font-sans text-xl font-bold">Your Brand, Your Voice</h3>
          <div className="space-y-4 font-mono text-sm leading-relaxed text-muted-foreground">
            <p>The agent learns your unique brand story, tone, and product details.</p>
            <p>Every interaction feels authentic because it's trained on YOUR business.</p>
            <p>You set the rules of engagement and can review all its activities.</p>
          </div>
        </div>

        {/* Column 3 */}
        <div className="space-y-4">
          <h3 className="border-b border-border pb-2 font-sans text-xl font-bold">Real Sales, Real Growth</h3>
          <div className="space-y-4 font-mono text-sm leading-relaxed text-muted-foreground">
            <p>This isn't a chatbot waiting for customers. It's a proactive sales associate.</p>
            <p>See detailed reports of every lead generated and every sale closed.</p>
            <p>A force multiplier for solo artisans and small DTC brands.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
