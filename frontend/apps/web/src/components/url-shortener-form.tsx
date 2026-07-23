import {Controller, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {ArrowRight, Loader2, RotateCcw, XCircle} from "lucide-react"

import {Input} from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

import {DEFAULT_EXPIRATION} from "@/constants/default-expiration-option.ts"
import {EXPIRATION_OPTIONS} from "@/constants/expiration-options.ts"
import {ShortenUrlSchema, type ShortenUrlSchemaType,} from "@/schemas/shorten-url-schema.tsx"

import {Button} from "@workspace/ui/components/button"
import {UrlResultCard} from "@/components/url-result-card/url-result-card.tsx"
import {UrlResultCardItem} from "@/components/url-result-card/url-result-card-item.tsx"
import {useShortenUrlHook} from "@/hooks/use-shorten-url-hook.ts"
import type {ShortenUrlResponseType} from "@/schemas/dto/shorten-url-response-schema.tsx"
import {useCallback, useState} from "react";
import {cn} from "@workspace/ui/lib/utils";

export function UrlShortenerForm() {
  const {result, isLoading, createShortenUrl} = useShortenUrlHook<ShortenUrlResponseType>()
  const [isClearing, setIsClearing] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    resetField,
    formState: {errors},
  } = useForm<ShortenUrlSchemaType>({
    resolver: zodResolver(ShortenUrlSchema),
    defaultValues: {original_url: "", duration: DEFAULT_EXPIRATION},
  })

  const hasError = !!errors.original_url

  const handleClear = useCallback(() => {
    setIsClearing(true)

    setTimeout(() => {
      resetField("original_url", {defaultValue: ""})
      setIsClearing(false)
    }, 150)
  }, [resetField])

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => createShortenUrl(data))}
        className="space-y-3"
      >
        <div className="relative">
          <Input
            id="original_url"
            type="url"
            aria-label="Paste your long URL here..."
            placeholder="Paste your long URL here..."
            autoFocus
            className="h-12 rounded-sm bg-background pr-9 text-sm placeholder:text-muted-foreground/40 focus-visible:border-primary/40 focus-visible:ring-primary/10"
            {...register("original_url")}
          />

          {(hasError || isClearing) && (
            <XCircle
              onClick={handleClear}
              className={cn(
                "absolute top-1/2 right-3 size-4 -translate-y-1/2 text-destructive cursor-pointer transition-all duration-150 ease-in",
                isClearing && "scale-50 opacity-0 rotate-90"
              )}
            />
          )}
        </div>

        <div className="flex items-stretch gap-2">
          <Controller
            name="duration"
            control={control}
            render={({field}) => (
              <Select
                items={EXPIRATION_OPTIONS}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full max-w-48 text-sm cursor-pointer">
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel> Expires after </SelectLabel>
                    {EXPIRATION_OPTIONS.map((item) => (
                      <SelectItem className="cursor-pointer" key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <Button type="submit" disabled={isLoading} className="h-auto! cursor-pointer max-[600px]:flex-1">
            {isLoading ? (
              <Loader2 className="size-4 animate-spin"/>
            ) : (
              <ArrowRight className="size-4"/>
            )}
            Shorten
          </Button>

          {result && (
            <div className="ms-auto flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleSubmit((data) =>
                    createShortenUrl({
                      original_url: result.original_url,
                      duration: data.duration,
                    })
                  )()
                }
                className="h-7 gap-1.5 text-xs text-muted-foreground cursor-pointer"
              >
                <RotateCcw className="size-3"/>
                Reshorten URL
              </Button>
            </div>
          )}
        </div>

        {hasError && (
          <p className="text-xs text-destructive">
            {errors.original_url?.message}
          </p>
        )}

        {result && (
          <UrlResultCard>
            <UrlResultCardItem result={result}/>
          </UrlResultCard>
        )}
      </form>
    </>
  )
}
