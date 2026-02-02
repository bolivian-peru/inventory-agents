export function Audience() {
  return (
    <div className="p-6 lg:p-12">
      <h2 className="mb-8 font-sans text-3xl font-bold uppercase md:text-4xl">Who Is This For?</h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Group 1 */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 border-b border-border pb-2 font-sans text-lg font-bold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[10px] text-background">
              1
            </span>
            Solo Creators & Artisans
          </h3>
          <ul className="space-y-2 font-mono text-sm text-muted-foreground">
            <li>Etsy sellers with unique handmade products</li>
            <li>Independent artists and designers</li>
            <li>Craftspeople who'd rather create than market</li>
            <li>Anyone who needs more hours in the day</li>
          </ul>
        </div>

        {/* Group 2 */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 border-b border-border pb-2 font-sans text-lg font-bold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[10px] text-background">
              2
            </span>
            Small DTC Brands
          </h3>
          <ul className="space-y-2 font-mono text-sm text-muted-foreground">
            <li>Shopify stores looking to scale outreach</li>
            <li>Brands without big marketing budgets</li>
            <li>E-commerce teams of 1-10 people</li>
            <li>Anyone tired of paying for ads that don't convert</li>
          </ul>
        </div>

        {/* Group 3 */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 border-b border-border pb-2 font-sans text-lg font-bold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[10px] text-background">
              3
            </span>
            Early Adopters
          </h3>
          <ul className="space-y-2 font-mono text-sm text-muted-foreground">
            <li>Believers in the AI-first future</li>
            <li>$IFA token holders shaping the roadmap</li>
            <li>Community members who want to build with us</li>
            <li>Anyone who wants their first AI employee</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
