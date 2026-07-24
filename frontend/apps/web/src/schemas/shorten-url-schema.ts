import { z } from "zod"

export const ShortenUrlSchema = z.object({
  original_url: z.url({ error: "Please enter a valid URL" }),
  duration: z.number().min(1, "Please select a duration"),
})

export type ShortenUrlSchemaType = z.infer<typeof ShortenUrlSchema>
