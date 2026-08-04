import { z } from "zod"
import { K6StatusOption } from "@/constants/k6-status-option.ts"

export const K6EndedDataSchema = z.object({
  status: z.literal(K6StatusOption.ENDED),
  exit_code: z.number(),
})

export type K6EndedData = z.infer<typeof K6EndedDataSchema>
