import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GuruDashboardContent } from "@/components/guru/dashboard-content"

export default async function GuruDashboardPage() {
  const { userData } = await getCurrentUserWithRole()
  const supabase = await createClient()

  // Fetch guru's classes
  const { data: classes } = await supabase
    .from("classes")
    .select("*, semester:semesters(name)")
    .eq("guru_id", userData.id)

  // Fetch today's sessions
  const today = new Date().toISOString().split("T")[0]
  const { data: todaySessions } = await supabase
    .from("sessions")
    .select("*, class:classes(name)")
    .eq("guru_id", userData.id)
    .eq("session_date", today)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {userData.full_name}</h1>
        <p className="text-muted-foreground">Manage your classes, sessions, and student evaluations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">My Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaySessions?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">Ready to teach</p>
          </CardContent>
        </Card>
      </div>

      <GuruDashboardContent guruId={userData.id} />
    </div>
  )
}
