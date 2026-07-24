import { useCallback, useState } from "react"
import { UrlShortenService } from "@/services/url-shorten-service.ts"
import type { ApiErrorSchemaType } from "@/schemas/dto/api-error-schema.ts"
import type { ShortenUrlRequestType } from "@/schemas/dto/shorten-url-request-schema.ts"

export function useShortenUrlHook<T>() {
  const [result, setResult] = useState<T | null>(null)
  const [error, setError] = useState<ApiErrorSchemaType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getRandomShortenUrl = useCallback((numberOfShortenUrls: number) => {
    setError(null)
    setIsLoading(true)

    return UrlShortenService.list(numberOfShortenUrls)
      .then((data) => setResult(data as T))
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false))
  }, [])

  const createShortenUrl = useCallback((payload: ShortenUrlRequestType) => {
    setError(null)
    setIsLoading(true)

    return UrlShortenService.create({
      original_url: payload.original_url,
      duration: payload.duration,
    })
      .then((data) => setResult(data as T))
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false))
  }, [])

  return { result, error, isLoading, getRandomShortenUrl, createShortenUrl }
}
