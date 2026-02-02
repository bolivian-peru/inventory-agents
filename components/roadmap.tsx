export function Roadmap() {
  return (
    <div className="p-6 lg:p-12">
      <h2 className="mb-8 font-sans text-3xl font-bold uppercase md:text-4xl">The Path Forward</h2>

      <div className="relative border-l border-border pl-8 md:pl-12">
        {/* Item 1 */}
        <div className="relative mb-10 last:mb-0">
          <div className="absolute -left-[41px] top-2 h-5 w-5 rounded-full border-2 border-foreground bg-background md:-left-[57px]"></div>
          <div className="mb-2 font-sans text-xl font-bold">Q4 2025</div>
          <div className="inline-block border border-border bg-muted/30 px-3 py-1 font-mono text-sm font-bold">
            Shopify plugin beta, first 10 merchant partners, $IFA launch on Pump.fun
          </div>
        </div>

        {/* Item 2 */}
        <div className="relative mb-10 last:mb-0">
          <div className="absolute -left-[41px] top-2 h-5 w-5 rounded-full border-2 border-accent bg-accent md:-left-[57px]"></div>
          <div className="mb-2 font-sans text-xl font-bold text-accent">Q1 2026</div>
          <div className="inline-block border border-accent bg-accent/20 px-3 py-1 font-mono text-sm font-bold text-foreground">
            Etsy integration, agent skill expansion, open-source release
          </div>
        </div>

        {/* Item 3 */}
        <div className="relative mb-10 last:mb-0">
          <div className="absolute -left-[41px] top-2 h-5 w-5 rounded-full border-2 border-foreground bg-background md:-left-[57px]"></div>
          <div className="mb-2 font-sans text-xl font-bold">Q2 2026</div>
          <div className="inline-block border border-border bg-muted/30 px-3 py-1 font-mono text-sm font-bold">
            Multi-platform agents (Reddit, Discord, Twitter), advanced analytics
          </div>
        </div>

        {/* Item 4 */}
        <div className="relative mb-10 last:mb-0">
          <div className="absolute -left-[41px] top-2 h-5 w-5 rounded-full border-2 border-foreground bg-background md:-left-[57px]"></div>
          <div className="mb-2 font-sans text-xl font-bold">Future</div>
          <div className="inline-block border border-border bg-muted/30 px-3 py-1 font-mono text-sm font-bold">
            Autonomous ad management, customer service agents, cross-store collaboration
          </div>
        </div>
      </div>

      <p className="mt-8 font-mono text-sm italic text-muted-foreground">
        "We're building the first AI employee for every creator. The future of commerce is autonomous."
      </p>
    </div>
  )
}
