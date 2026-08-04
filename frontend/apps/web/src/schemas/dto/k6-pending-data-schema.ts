import { z } from "zod"
import { K6StatusOption } from "@/constants/k6-status-option.ts"

export const K6PendingDataSchema = z.object({
  status: z.literal(K6StatusOption.PENDING),
  test: z.string(),
})

export type K6PendingDataType = z.infer<typeof K6PendingDataSchema>
