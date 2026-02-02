export function TokenSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      {/* Header */}
      <div className="col-span-1 border-b border-border p-6 lg:col-span-3 lg:p-8">
        <h2 className="font-sans text-3xl font-bold uppercase md:text-4xl">Join the Experiment</h2>
        <p className="mt-2 font-mono text-muted-foreground">
          $IFA is a community token for those who believe in AI-powered commerce. We're building in public—come along
          for the ride.
        </p>
      </div>

      {/* Left Details */}
      <div className="col-span-1 border-b border-border p-6 lg:col-span-2 lg:border-b-0 lg:border-r lg:p-12">
        <div className="space-y-8">
          <div>
            <h3 className="mb-2 font-sans text-xl font-bold">Community First</h3>
            <p className="font-mono text-muted-foreground">
              $IFA holders are early believers in autonomous commerce. Join a community of creators, degens, and
              builders shaping what AI employees could become.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-sans text-xl font-bold">Shape the Future</h3>
            <p className="font-mono text-muted-foreground">
              We're exploring ways for the community to influence development—which features get built, which platforms
              to target, how the project evolves. Your input matters.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-sans text-xl font-bold">Open Source Soon</h3>
            <p className="font-mono text-muted-foreground">
              Core code going open-source. We're figuring out sustainable models that might include community benefits.
              Nothing promised, everything possible.
            </p>
          </div>
        </div>
      </div>

      {/* Right Token Card */}
      <div className="col-span-1 bg-muted/20 p-6 lg:p-12">
        <div className="flex h-full flex-col justify-between border border-border bg-background p-6 shadow-sm">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-bold text-accent-foreground">$IFA</span>
              <span className="rounded-full border border-accent bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                LIVE NOW
              </span>
            </div>
            <div className="mb-2 text-4xl font-extrabold tracking-tighter text-accent-foreground md:text-5xl">
              PUMP.FUN
            </div>
            <div className="mb-6 font-mono text-xs text-muted-foreground">
              CA:{" "}
              <span className="bg-muted px-1 py-0.5 font-bold break-all">GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump</span>
            </div>
            <a
              href="https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-none border-2 border-accent-foreground bg-accent px-4 py-3 text-center text-lg font-bold text-accent-foreground transition-colors hover:bg-accent-foreground hover:text-accent"
            >
              Buy $IFA
            </a>
          </div>

          <div className="mt-8 border-t border-border pt-4">
            <p className="font-mono text-xs leading-relaxed text-muted-foreground">
              DISCLAIMER: Experimental token. No promises, no guarantees. Read, think, then act.
            </p>
          </div>
        </div>
      </div>

      {/* Ticker Bar */}
      <div className="col-span-1 flex flex-wrap items-center justify-center gap-4 overflow-hidden border-t border-border bg-accent px-4 py-2 font-mono text-xs font-bold uppercase text-accent-foreground md:gap-8 lg:col-span-3">
        <span>Chain: Solana</span>
        <span>•</span>
        <span>Status: LIVE</span>
        <span>•</span>
        <a
          href="https://t.me/inventoryforagents"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted transition-opacity hover:opacity-70"
        >
          Telegram
        </a>
        <span>•</span>
        <a
          href="https://x.com/agentinventory"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted transition-opacity hover:opacity-70"
        >
          Twitter
        </a>
      </div>
    </div>
  )
}
