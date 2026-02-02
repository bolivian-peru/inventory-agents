import { Store, Brain, TrendingUp } from "lucide-react"

export function HowItWorks() {
  return (
    <div className="p-6 lg:p-12">
      <h2 className="mb-12 text-center font-sans text-3xl font-bold uppercase md:text-4xl">
        From Store to Sales Agent in 3 Clicks
      </h2>

      <div className="relative">
        {/* Connection Line (Desktop) */}
        <div className="absolute top-1/2 left-0 hidden h-0.5 w-full -translate-y-1/2 bg-border lg:block" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Step 1 */}
          <div className="relative bg-background p-4">
            <div className="mb-4 flex h-16 w-16 items-center justify-center border border-border bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Store className="h-8 w-8" />
            </div>
            <div className="mb-2 font-sans text-xl font-bold">1. Connect Your Store</div>
            <p className="font-mono text-sm text-muted-foreground">
              Install the IFA plugin from the Shopify or Etsy app store. No code, no complex setup. It just works.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative bg-background p-4">
            <div className="mb-4 flex h-16 w-16 items-center justify-center border border-border bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Brain className="h-8 w-8" />
            </div>
            <div className="mb-2 font-sans text-xl font-bold">2. Awaken Your Agent</div>
            <p className="font-mono text-sm text-muted-foreground">
              Your dedicated AI agent comes to life. It instantly learns your products, brand voice, and mission.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative bg-background p-4">
            <div className="mb-4 flex h-16 w-16 items-center justify-center border border-border bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <TrendingUp className="h-8 w-8" />
            </div>
            <div className="mb-2 font-sans text-xl font-bold">3. Watch It Work</div>
            <p className="font-mono text-sm text-muted-foreground">
              Your agent begins scouting the internet for customers. See new sales and detailed activity reports from
              your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
