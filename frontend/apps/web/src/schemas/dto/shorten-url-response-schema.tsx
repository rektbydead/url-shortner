import { z } from "zod"

export const ShortenUrlResponseSchema = z.object({
  uuid: z.uuidv4(),
  original_url: z.url(),
  expires_at: z.iso.datetime(),
})

export type ShortenUrlResponseType = z.infer<typeof ShortenUrlResponseSchema>
