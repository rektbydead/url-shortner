import { Header } from "@/components/header.tsx"
import { Separator } from "@workspace/ui/components/separator"
import DashboardK6Section from "@/components/dashboard/dashboard-k6-section.tsx"
import DashboardGrafanaSection from "@/components/dashboard/dashboard-grafana-section.tsx"
import { Footer } from "@/components/footer.tsx"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto space-y-8 py-8">
        <DashboardK6Section />
        <Separator />
        <DashboardGrafanaSection />
      </main>

      <Footer/>
    </div>
  )
}
