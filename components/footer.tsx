import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8 text-center md:text-left">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 md:flex-row md:px-8">
        {/* Left */}
        <div className="space-y-1 font-mono text-xs text-muted-foreground">
          <div>inventoryforagents.xyz © {new Date().getFullYear()}</div>
          <div className="hidden text-[9px] md:block">
            CA:{" "}
            <a
              href="https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump
            </a>
          </div>
        </div>

        {/* Center Links */}
        <div className="flex gap-6 font-mono text-xs font-bold uppercase tracking-wider">
          <Link href="/" className="hover:text-accent hover:underline">
            Home
          </Link>
          <Link href="/merchants" className="hover:text-accent hover:underline">
            Get Agent
          </Link>
          <Link href="/docs" className="hover:text-accent hover:underline">
            Thesis
          </Link>
          <Link href="/blog" className="hover:text-accent hover:underline">
            Blog
          </Link>
        </div>

        {/* Right Social Links */}
        <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
          <a
            href="https://t.me/inventoryforagents"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer underline decoration-dotted hover:text-accent"
          >
            Telegram
          </a>
          <span>/</span>
          <a
            href="https://x.com/agentinventory"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer underline decoration-dotted hover:text-accent"
          >
            Twitter
          </a>
          <span>/</span>
          <a
            href="https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer underline decoration-dotted hover:text-accent"
          >
            $IFA
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="container mx-auto mt-6 border-t border-border px-6 pt-4 md:px-8">
        <p className="mx-auto max-w-3xl text-center font-mono text-[10px] leading-relaxed text-muted-foreground/70">
          Experimental hobby project. $IFA is a community meme token—no promises, no guarantees. Not financial advice.
          DYOR. Code going open-source soon. Have fun, stay safe.
        </p>
      </div>
    </footer>
  )
}
