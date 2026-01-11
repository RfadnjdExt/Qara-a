import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { ReportViewWithPDF } from "@/components/murid/report-view-with-pdf"

export default async function MuridReportsPage() {
  const { userData } = await getCurrentUserWithRole()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Laporan Saya</h1>
        <p className="text-muted-foreground">Buat dan unduh laporan evaluasi resmi</p>
      </div>

      <ReportViewWithPDF userId={userData.id} userName={userData.full_name} institutionId={userData.institution_id} />
    </div>
  )
}
