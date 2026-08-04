import { z } from "zod"
import { K6StatusOption } from "@/constants/k6-status-option.ts"

export const K6RunningDataSchema = z.object({
  status: z.literal(K6StatusOption.RUNNING),
  test: z.string(),
  started_at: z.string(),
  running_time: z.number(),
  metrics: z.object({
    progress_percentage: z.number(),
    vus: z.number(),
    max_vus: z.number(),
    total_requests: z.number(),
  }),
})

export type K6RunningDataType = z.infer<typeof K6RunningDataSchema>
