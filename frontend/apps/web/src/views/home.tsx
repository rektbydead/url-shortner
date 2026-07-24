import { UrlShortenerForm } from "@/components/url-shortener-form"
import { RecentShortenedUrls } from "@/components/recent-shorten-urls.tsx"
import { TooltipProvider } from "@workspace/ui/components/tooltip.tsx"
import { Header } from "@/components/header.tsx"
import { Footer } from "@/components/footer.tsx"

export default function Home() {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />

        <main>
          <section className="mx-auto my-32 max-w-lg max-[600px]:px-4">
            <div className="space-y-0">
              <div className="-space-y-1">
                <p className="text-xs font-medium tracking-widest text-primary uppercase">
                  Lousada's
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  URL Shortener
                </h1>
              </div>

              <p className="pt-1 text-sm text-muted-foreground">
                Paste a long URL -&gt; get a not so short one -&gt; UUID cries
                :(
              </p>
            </div>

            <div className="mx-auto max-w-lg space-y-6">
              <UrlShortenerForm />
            </div>
          </section>

          <section className="border-t border-border bg-muted/30 px-4 py-12 sm:py-16">
            <div className="mx-auto max-w-2xl">
              <RecentShortenedUrls />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </TooltipProvider>
  )
}
