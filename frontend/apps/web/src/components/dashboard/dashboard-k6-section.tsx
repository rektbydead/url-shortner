import { useCallback, useEffect, useState } from "react"
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
import { startTest, stopTest, subscribeK6 } from "@/services/k6-service.ts"
import {
  K6StatusOption,
  type K6StatusOptionType,
} from "@/constants/k6-status-option.ts"
import { K6_TESTS } from "@/constants/k6-tests.ts"
import type { K6StatusDataType } from "@/schemas/dto/k6-status-data-schema.ts"
import type { K6RunningDataType } from "@/schemas/dto/k6-running-data-schema.ts"

type K6State = {
  status: K6StatusOptionType
  test: string | null
  error: string | null
  started_at: string | null
  exit_code: number | null
  running_time: number | null
  metrics: K6RunningDataType["metrics"] | null
}

export default function DashboardK6Section() {
  const [selectedTest, setSelectedTest] = useState<string>(K6_TESTS[0].value)
  const [state, setState] = useState<K6State>({
    status: K6StatusOption.IDLE,
    test: null,
    error: null,
    started_at: null,
    exit_code: null,
    running_time: null,
    metrics: null,
  })

  useEffect(() => {
    return subscribeK6((data: K6StatusDataType) => {
      if ("error" in data) {
        setState((prev) => ({
          ...prev,
          status: K6StatusOption.IDLE,
          error: data.error!,
        }))
        return
      }

      setState(prev => ({
        status: data.status,
        test: "test" in data ? data.test : prev.test,
        error: null,
        started_at: "started_at" in data ? data.started_at : prev.started_at,
        exit_code: "exit_code" in data ? data.exit_code : prev.exit_code,
        running_time: "running_time" in data ? data.running_time : prev.running_time,
        metrics: "metrics" in data ? data.metrics : prev.metrics,
      }))
    })
  }, [])

  const isRunning =
    state.status === K6StatusOption.PENDING ||
    state.status === K6StatusOption.RUNNING

  const handleRun = useCallback(() => {
    startTest(selectedTest)
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
          <Button
            variant="destructive"
            onClick={handleStop}
            className="cursor-pointer"
          >
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

      {state.status !== K6StatusOption.IDLE && (
        <div className="text-sm text-muted-foreground">
          {state.status === K6StatusOption.PENDING && (
            <p>Starting {state.test}…</p>
          )}

          {state.status === K6StatusOption.RUNNING && state.metrics && (
            <>
              <p>Running {state.test}…</p>
              <p>
                {(state.metrics.progress_percentage * 100).toFixed(2)}% ·
                {" "}VUs {state.metrics.vus}/{state.metrics.max_vus} ·
                {" "}Requests {state.metrics.total_requests}
              </p>
            </>
          )}

          {state.status === K6StatusOption.ENDED && (
            <p>Completed (exit {state.exit_code})</p>
          )}
        </div>
      )}

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </section>
  )
}
