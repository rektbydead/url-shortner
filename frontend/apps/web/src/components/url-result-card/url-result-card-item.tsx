import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { Badge } from "@workspace/ui/components/badge"
import { Check, Copy, ExternalLink } from "lucide-react"
import type { UrlResultCardItemContextType } from "@/schemas/components/url-result-card-item-context-type.ts"
import { Button } from "@workspace/ui/components/button";
import { useCallback, useState } from "react"

export function UrlResultCardItem({ result }: UrlResultCardItemContextType) {
  const shortLink = `${window.location.origin}/${result?.uuid}`.replace(
    /^https?:\/\//,
    ""
  )

  const expireDate = result?.expires_at.split("T")[0]

  const [copied, setCopied] = useState<boolean>(false)
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(shortLink)

    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }, [shortLink])

  return (
    <div className="flex flex-row">
      <div className="min-w-0 flex-1 flex-col">
        <div className="flex flex-row items-center gap-2">
          <a
            href={`${shortLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            {shortLink}
          </a>
          <a
            href={`${shortLink}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open link"
            className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:text-foreground"
          >
            <ExternalLink className="size-1" />
          </a>
        </div>

        <p className="truncate text-[0.7rem] text-muted-foreground">
          {result?.original_url}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <Tooltip>
          <TooltipTrigger render={
            <Badge variant="secondary" className="text-[0.6rem] font-normal">
              {expireDate}
            </Badge>
          }/>
          <TooltipContent>Expire date</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="size-3.5" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
          }/>
          <TooltipContent>Copy link</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
