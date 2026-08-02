import { useState, useEffect, useCallback } from "react"
import { Play, Square } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Button } from "@workspace/ui/components/button"
import { DashboardTitle } from "@/components/dashboard-title.tsx"
import { subscribeK6, startTest, stopTest } from "@/services/k6-service.ts"
import type { K6StatusData } from "@/services/k6-service.ts"

const K6_TESTS = [
  {
    value: "stress.js",
    label: "Stress Test",
    description: "Find breaking point, 200→30k VUs, 10min",
  },
  {
    value: "rps-1000vu-20w-80r.js",
    label: "RPS 20/80",
    description: "Max RPS, 1000 VUs, read-heavy, 3min",
  },
  {
    value: "rps-1000vu-50w-50r.js",
    label: "RPS 50/50",
    description: "Max RPS, 1000 VUs, balanced, 3min",
  },
  {
    value: "db_stress.js",
    label: "Database Stress Test",
    description: "Max RPS, 1000 VUs, random-read-only, super-read-heavy, 5min",
  },
]

type K6State = {
  status: K6StatusData["status"]
  test: string | null
  error: string | null
  startedAt: string | null
  exitCode: number | null
}

export default function DashboardK6Section() {
  const [selectedTest, setSelectedTest] = useState<string>(K6_TESTS[0].value)
  const [state, setState] = useState<K6State>({
    status: "idle",
    test: null,
    error: null,
    startedAt: null,
    exitCode: null,
  })

  useEffect(() => {
    const unsubscribe = subscribeK6((data: K6StatusData) => {
      console.log(data)
      if (data.error) {
        setState((prev) => ({ ...prev, status: "idle", error: data.error! }))
        return
      }
      setState({
        status: data.status,
        test: data.test ?? null,
        error: null,
        startedAt: data.started_at ?? null,
        exitCode: data.exit_code ?? null,
      })
    })
    return unsubscribe
  }, [])

  const isRunning = state.status === "starting" || state.status === "running"

  const handleRun = useCallback(() => {
    startTest(selectedTest)
    setState((prev) => ({ ...prev, error: null }))
  }, [selectedTest])

  const handleStop = useCallback(() => {
    stopTest()
  }, [])

  return (
    <section className="flex flex-col gap-2">
      <DashboardTitle
        title={"K6"}
        subtitle={"Performance pre-defined k6 tests."}
      />

      <div className="flex flex-row gap-2">
        <Select
          value={selectedTest}
          onValueChange={(v) => setSelectedTest(v ?? K6_TESTS[0].value)}
          disabled={isRunning}
        >
          <SelectTrigger
            className={`w-full max-w-xs ${isRunning ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Test script</SelectLabel>
              {K6_TESTS.map((test) => (
                <SelectItem
                  key={test.value}
                  value={test.value}
                  className="cursor-pointer"
                >
                  <span className="flex flex-col">
                    <span>{test.label}</span>
                    <span className="text-[0.65rem] text-muted-foreground">
                      {test.description}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {isRunning ? (
          <Button variant="destructive" onClick={handleStop} className="cursor-pointer">
            <Square className="size-3.5" />
            Stop
          </Button>
        ) : (
          <Button onClick={handleRun} className="cursor-pointer">
            <Play className="size-3.5" />
            Run
          </Button>
        )}
      </div>

      {state.status !== "idle" && (
        <p className="text-sm text-muted-foreground">
          {state.status === "starting" && `Starting ${state.test}…`}
          {state.status === "running" && `Running ${state.test}…`}
          {state.status === "ended" && `Completed ${state.test} (exit ${state.exitCode ?? "—"})`}
          {state.status === "stopped" && "Test stopped"}
        </p>
      )}

      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
    </section>
  )
}
