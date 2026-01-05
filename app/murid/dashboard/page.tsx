import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MuridDashboardContent } from "@/components/murid/dashboard-content"

export default async function MuridDashboardPage() {
  const { userData } = await getCurrentUserWithRole()
  const supabase = await createClient()

  // Fetch student's classes
  const { data: enrollments } = await supabase
    .from("class_enrollments")
    .select("class:classes(*, semester:semesters(name))")
    .eq("user_id", userData.id)

  // Fetch recent evaluations
  const { data: recentEvals } = await supabase
    .from("evaluations")
    .select("*")
    .eq("user_id", userData.id)
    .order("created_at", { ascending: false })
    .limit(1)

  const latestEval = recentEvals?.[0]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {userData.full_name}</h1>
        <p className="text-muted-foreground">View your evaluations and learning progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">My Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Enrolled classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Latest Evaluation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestEval ? "Recorded" : "—"}</div>
            <p className="text-xs text-muted-foreground">
              {latestEval ? new Date(latestEval.created_at).toLocaleDateString() : "No evaluations yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">Learning in progress</p>
          </CardContent>
        </Card>
      </div>

      <MuridDashboardContent userId={userData.id} />
    </div>
  )
}
