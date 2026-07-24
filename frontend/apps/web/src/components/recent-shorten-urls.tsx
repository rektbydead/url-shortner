import {UrlResultCardItem} from "@/components/url-result-card/url-result-card-item.tsx"
import {UrlResultCard} from "@/components/url-result-card/url-result-card.tsx"
import {useShortenUrlHook} from "@/hooks/use-shorten-url-hook.ts"
import {useCallback, useEffect, useState} from "react"
import {Button} from "@workspace/ui/components/button"
import {RotateCcw} from "lucide-react"
import {cn} from "@workspace/ui/lib/utils"
import {UrlResultCardItemSkeleton} from "@/components/url-result-card/url-result-card-item-skeleton.tsx";
import type { ShortenUrlResponseType } from "@/schemas/dto/shorten-url-response-schema.ts"

export function RecentShortenedUrls() {
  const {result, isLoading, getRandomShortenUrl} =
    useShortenUrlHook<ShortenUrlResponseType[]>()

  const [showSkeleton, setShowSkeleton] = useState(true)

  const getRandomShortenUrlWithDelay = useCallback(() => {
    setShowSkeleton(true)

    setTimeout(() => {
      getRandomShortenUrl(10).then(() => {
        setShowSkeleton(false)
      })
    }, 500)
  }, [getRandomShortenUrl])


  useEffect(() => {
    getRandomShortenUrl(10).then(() => {
      setShowSkeleton(false)
    })
  }, [getRandomShortenUrl])

  return (
    <div className="space-y-4">

      <div className="flex items-end justify-between">
        <div className="-space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Previously generated short URLs
          </h2>
          <p className="text-sm text-muted-foreground">
            Randomly obtained from the pool of shortened links.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={getRandomShortenUrlWithDelay}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <RotateCcw className={cn("size-3.5", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <UrlResultCard>
        {showSkeleton
          ? Array.from({length: 10}).map((_, i) => (
            <UrlResultCardItemSkeleton key={i}/>
          ))
          : result?.map((item) => (
            <UrlResultCardItem result={item} key={item.uuid}/>
          ))}
      </UrlResultCard>
    </div>
  )
}
