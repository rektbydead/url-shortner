import { z } from "zod"

export const ShortenUrlRequestSchema = z.object({
  original_url: z.url(),
  duration: z.number().min(1),
})

export type ShortenUrlRequestType = z.infer<typeof ShortenUrlRequestSchema>
