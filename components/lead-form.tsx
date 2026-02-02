import { ArrowRight } from "lucide-react"

export function LeadForm() {
  return (
    <div className="w-full max-w-xl border border-border bg-card p-6 md:p-8">
      <div className="mb-6 border-b border-border pb-4">
        <h3 className="font-sans text-2xl font-bold uppercase">Activate Your Agent</h3>
        <p className="mt-2 font-mono text-sm text-muted-foreground">
          Join the waitlist. Be first to get your AI sales employee.
        </p>
      </div>

      <form className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="firstName" className="font-mono text-xs uppercase tracking-wider">
              First Name
            </label>
            <input
              id="firstName"
              className="w-full border border-border bg-background px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Sarah"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="font-mono text-xs uppercase tracking-wider">
              Last Name
            </label>
            <input
              id="lastName"
              className="w-full border border-border bg-background px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Chen"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="storeName" className="font-mono text-xs uppercase tracking-wider">
            Store Name
          </label>
          <input
            id="storeName"
            className="w-full border border-border bg-background px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Sarah's Handmade Jewelry"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="font-mono text-xs uppercase tracking-wider">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full border border-border bg-background px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="sarah@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="platform" className="font-mono text-xs uppercase tracking-wider">
            Where Do You Sell?
          </label>
          <select
            id="platform"
            className="w-full border border-border bg-background px-3 py-2 font-mono text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option>Shopify</option>
            <option>Etsy</option>
            <option>Both Shopify & Etsy</option>
            <option>WooCommerce</option>
            <option>Other Platform</option>
          </select>
        </div>

        <div className="pt-4">
          <div className="flex w-full cursor-not-allowed items-center justify-between border border-muted-foreground/50 bg-muted px-4 py-3">
            <span className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Coming Soon
            </span>
            <span className="rounded-full border border-accent bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
              Q1 2026
            </span>
          </div>
        </div>
      </form>

      <div className="mt-4 border-t border-border pt-4 text-center">
        <p className="font-mono text-[10px] uppercase text-muted-foreground">
          Join our{" "}
          <a
            href="https://t.me/inventoryforagents"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted hover:text-accent"
          >
            Telegram
          </a>{" "}
          for updates
        </p>
      </div>
    </div>
  )
}
