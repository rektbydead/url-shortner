import type { UrlResultCardContextType } from "@/schemas/components/url-result-card-context-type.ts"

export function UrlResultCard({ children }: UrlResultCardContextType) {
  return (
    <>
      <div className="flex flex-col animate-in rounded-sm border bg-card p-2 shadow-sm duration-300 fade-in slide-in-from-bottom-2 gap-4">
        {children}
      </div>
    </>
  )
}
