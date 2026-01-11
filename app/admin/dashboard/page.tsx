import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminDashboardContent } from "@/components/admin/dashboard-content"
import { DashboardCharts } from "@/components/admin/dashboard-charts"

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
          {institution?.code || "Kode Institusi"}
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usersCount ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Pengguna terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Kelas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classesCount ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Kelas aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Semester Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeSemester?.name || "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              Periode saat ini
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
              Aktif
            </div>
            <p className="text-xs text-muted-foreground">
              Sistem berjalan normal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS */}
      <DashboardCharts />

      {/* DETAIL CONTENT */}
      <AdminDashboardContent institutionId={userData.institution_id} />
    </div>
  )
}