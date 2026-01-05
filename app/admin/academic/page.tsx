import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { AcademicStructure } from "@/components/admin/academic-structure"

export default async function AdminAcademicPage() {
  const { userData } = await getCurrentUserWithRole()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Academic Structure</h1>
        <p className="text-muted-foreground">Manage semesters, classes, and subjects</p>
      </div>

      <AcademicStructure institutionId={userData.institution_id} />
    </div>
  )
}
