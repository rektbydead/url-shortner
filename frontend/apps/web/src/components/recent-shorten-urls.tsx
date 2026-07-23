import { UrlResultCardItem } from "@/components/url-result-card/url-result-card-item.tsx"
import { UrlResultCard } from "@/components/url-result-card/url-result-card.tsx"
import type { ShortenUrlResponseType } from "@/schemas/dto/shorten-url-response-schema.tsx"
import { useShortenUrlHook } from "@/hooks/use-shorten-url-hook.ts"
import { useEffect } from "react"

export function RecentShortenedUrls() {
  const { result, isLoading, getRandomShortenUrl } =
    useShortenUrlHook<ShortenUrlResponseType[]>()

  useEffect(() => {
    getRandomShortenUrl(10)
  }, [getRandomShortenUrl])

  return (
    <UrlResultCard>
      {isLoading
        ? "Loading..."
        : result?.map((item: ShortenUrlResponseType) => (
        <UrlResultCardItem result={item} key={item.uuid} />
      ))}
    </UrlResultCard>
  )
}
