import { z } from "zod"

export const K6ErrorDataSchema = z.object({
  error: z.string(),
})

export type K6ErrorDataType = z.infer<typeof K6ErrorDataSchema>
