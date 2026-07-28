import {Minimize, Moon, Sun} from "lucide-react"
import {Link, useLocation} from "react-router-dom"
import {useTheme} from "@/components/theme-provider"
import {SocialLink} from "@/components/icons/social-link.tsx";
import {GitHubIcon} from "@/components/icons/github-icon.tsx";
import {LinkedInIcon} from "@/components/icons/linkedin-icon.tsx";

function ThemeToggle() {
  const {theme, setTheme} = useTheme()

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark")

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <Sun className="size-[18px] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"/>
      <Moon className="absolute size-[18px] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"/>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

export function Header() {
  const {pathname} = useLocation()

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 sm:px-6">
        <a
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Minimize className="size-3.5" strokeWidth={2.5} />
          </div>
          <span className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Lousada's
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              URL Shortener
            </span>
          </span>
        </a>

        <nav className="flex items-center gap-0.5">
          <Link
            to="/"
            className={`inline-flex h-8 items-center rounded-lg px-3 text-sm transition-colors hover:bg-accent hover:text-foreground ${pathname === "/" ? "text-foreground" : "text-muted-foreground"}`}
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            className={`inline-flex h-8 items-center rounded-lg px-3 text-sm transition-colors hover:bg-accent hover:text-foreground ${pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground"}`}
          >
            Dashboard
          </Link>

          <div className="mx-1 h-4 w-px bg-border" />

          <SocialLink
            href="https://github.com/rektbydead/url-shortner"
            label="GitHub"
          >
            <GitHubIcon className="size-[18px]" />
          </SocialLink>

          <SocialLink
            href="https://www.linkedin.com/in/rubenlousada/"
            label="LinkedIn"
          >
            <LinkedInIcon className="size-[18px]" />
          </SocialLink>

          <div className="mx-1 h-4 w-px bg-border" />

          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
