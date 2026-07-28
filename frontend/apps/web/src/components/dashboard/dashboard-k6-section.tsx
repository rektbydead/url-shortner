import { useState } from "react"
import { Play } from "lucide-react"
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

export default function DashboardK6Section() {
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
  const [selectedTest, setSelectedTest] = useState<string>(K6_TESTS[0].value)

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
        >
          <SelectTrigger className="w-full max-w-xs cursor-pointer">
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

        <Button className="cursor-pointer">
          <Play className="size-3.5" />
          Run
        </Button>
      </div>
    </section>
  )
}
