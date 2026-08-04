export const K6StatusOption = {
  IDLE: "idle",
  PENDING: "pending",
  RUNNING: "running",
  ENDED: "ended",
} as const

export type K6StatusOptionType =
  (typeof K6StatusOption)[keyof typeof K6StatusOption]