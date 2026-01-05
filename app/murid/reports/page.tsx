import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { ReportViewWithPDF } from "@/components/murid/report-view-with-pdf"

export default async function MuridReportsPage() {
  const { userData } = await getCurrentUserWithRole()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Reports</h1>
        <p className="text-muted-foreground">Generate and download official evaluation reports</p>
      </div>

      <ReportViewWithPDF userId={userData.id} userName={userData.full_name} institutionId={userData.institution_id} />
    </div>
  )
}
