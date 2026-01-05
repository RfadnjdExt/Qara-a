import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminDashboardContent } from "@/components/admin/dashboard-content"

// 1. Perbaikan Metadata & Viewport (Menghilangkan Warning)
export const metadata = {
  title: "Admin Dashboard",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default async function AdminDashboardPage() {
  // Ambil user + role + institution
  const { userData } = await getCurrentUserWithRole()
  const supabase = await createClient()

  // 2. Optimasi: Menjalankan semua query secara paralel (Promise.all)
  // Ini akan mempercepat render time secara signifikan
  const [
    institutionRes,
    usersRes,
    classesRes,
    semesterRes
  ] = await Promise.all([
    // Query Institution
    supabase
      .from("institutions")
      .select("*")
      .eq("id", userData.institution_id)
      .maybeSingle(),

    // Query Users Count
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("institution_id", userData.institution_id),

    // Query Classes Count
    supabase
      .from("classes")
      .select("id", { count: "exact", head: true })
      .eq("institution_id", userData.institution_id),

    // Query Active Semester
    supabase
      .from("semesters")
      .select("*")
      .eq("institution_id", userData.institution_id)
      .eq("is_active", true)
      .maybeSingle()
  ])

  // Destructure hasil query
  const institution = institutionRes.data
  const usersCount = usersRes.count
  const classesCount = classesRes.count
  const activeSemester = semesterRes.data

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          {institution?.name || "Dashboard"}
        </h1>
        <p className="text-muted-foreground">
          {institution?.code || "Institution Code"}
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usersCount ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classesCount ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Active classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Semester
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeSemester?.name || "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              Current period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Active
            </div>
            <p className="text-xs text-muted-foreground">
              System operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* DETAIL CONTENT */}
      <AdminDashboardContent institutionId={userData.institution_id} />
    </div>
  )
}