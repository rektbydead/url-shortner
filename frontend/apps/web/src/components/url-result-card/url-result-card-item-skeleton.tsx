import { Skeleton } from "@workspace/ui/components/skeleton"

export function UrlResultCardItemSkeleton() {
  return (
    <div className="flex flex-row" style={{ height: "36.8px" }}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-row items-center gap-2">
          <Skeleton className="h-4 w-2/5 rounded-sm" />
          <Skeleton className="size-1.5 rounded-full" />
        </div>
        <Skeleton className="mt-0.5 h-2.5 w-3/5 rounded-sm" />
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <Skeleton className="h-5 w-14 rounded-full" style={{ width: "72px" }} />
        <Skeleton className="h-6 w-14 rounded-md" style={{ width: "66px" }}/>
      </div>
    </div>
  )
}
