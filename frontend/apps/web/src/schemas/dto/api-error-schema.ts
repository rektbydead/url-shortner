import { z } from "zod"

export const ApiResponseSchema = z.object({
  details: z.string(),
})

export type ApiErrorSchemaType = z.infer<typeof ApiResponseSchema>
