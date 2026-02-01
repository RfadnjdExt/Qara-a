import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MuridDashboardContent } from "@/components/murid/dashboard-content"
import { StudentProgressChart } from "@/components/analytics/student-progress-chart"
import { redirect } from "next/navigation"

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
    const { userData } = await getCurrentUserWithRole()
    const supabase = await createClient()

    const studentId = params.id

    // Security: Verify parent is linked to this student
    const { data: link } = await supabase
        .from("parent_student_links")
        .select("*")
        .eq("parent_id", userData.id)
        .eq("student_id", studentId)
        .single()

    if (!link) {
        redirect("/orang_tua/dashboard")
    }

    // Fetch student details
    const { data: student } = await supabase
        .from("users")
        .select("*")
        .eq("id", studentId)
        .single()

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{student?.full_name}</h1>
                <p className="text-muted-foreground">Detail perkembangan dan riwayat mutabaah</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <StudentProgressChart userId={studentId} />
                <MuridDashboardContent userId={studentId} />
            </div>
        </div>
    )
}
