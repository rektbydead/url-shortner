import { z } from "zod"
import { K6PendingDataSchema } from "@/schemas/dto/k6-pending-data-schema.ts"
import { K6RunningDataSchema } from "@/schemas/dto/k6-running-data-schema.ts"
import { K6EndedDataSchema } from "@/schemas/dto/k6-ended-data-schema.ts"
import { K6ErrorDataSchema } from "@/schemas/dto/k6-error-data-schema.ts"

export const K6StatusDataSchema = z.union([
  K6PendingDataSchema,
  K6RunningDataSchema,
  K6EndedDataSchema,
  K6ErrorDataSchema,
])

export type K6StatusDataType = z.infer<typeof K6StatusDataSchema>
