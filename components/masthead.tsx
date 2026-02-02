import { Bot } from "lucide-react"
import Link from "next/link"

export function Masthead() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center bg-foreground text-background">
              <Bot className="h-6 w-6" />
            </div>
            <span className="font-sans text-xl font-bold tracking-tight">IFA</span>
          </Link>

          {/* Masthead Text */}
          <div className="text-center">
            <h1 className="font-sans text-2xl font-bold uppercase tracking-tight md:text-4xl">Inventory for Agents</h1>
            <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground md:text-sm">
              Your First AI Employee · 24/7 Sales Agent for Shopify & Etsy
            </p>
          </div>

          {/* Ticker / Status */}
          <div className="flex flex-col items-end gap-1 font-mono text-xs md:w-[240px]">
            <a
              href="https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-opacity hover:opacity-70"
            >
              <span className="bg-accent px-1.5 py-0.5 font-bold text-accent-foreground">$IFA</span>
              <span>LIVE on Pump.fun</span>
            </a>
            <div className="hidden text-[9px] text-muted-foreground md:block">
              CA: GdRFrMAUF6J4e4FrogFu...pump
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <a
                href="https://t.me/inventoryforagents"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                TG
              </a>
              <a
                href="https://x.com/agentinventory"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                X
              </a>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-accent"></span>
                Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-border py-2">
        <nav className="container mx-auto flex items-center justify-center gap-6 font-mono text-xs font-bold uppercase tracking-wider md:gap-8 md:text-sm">
          <Link href="/" className="transition-colors hover:text-accent">
            Home
          </Link>
          <Link href="/etsy" className="flex items-center gap-1.5 text-orange-500 transition-colors hover:text-orange-600">
            For Etsy
          </Link>
          <Link href="/get-started" className="text-green-500 font-bold transition-colors hover:text-green-600">
            🚀 Deploy Your Own
          </Link>
          <Link
            href="/docs"
            className="group flex items-center gap-1.5 border border-accent bg-accent/10 px-3 py-1 text-accent transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75 group-hover:bg-accent-foreground"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent group-hover:bg-accent-foreground"></span>
            </span>
            Read Thesis
          </Link>
          <Link href="/blog" className="transition-colors hover:text-accent">
            Blog
          </Link>
          <a
            href="https://github.com/bolivian-peru/agents-inventory"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
