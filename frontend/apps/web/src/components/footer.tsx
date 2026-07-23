export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div
        className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-6">
        <div className="flex flex-col gap-1">
          <span className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Lousada's
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              URL Shortener
            </span>
          </span>
        </div>

        <div className="flex items-center gap-5">
          <span className="text-[0.65rem] text-muted-foreground/50">
            Built with React, Tailwind & shadcn/ui
          </span>
        </div>
      </div>
    </footer>
  )
}
