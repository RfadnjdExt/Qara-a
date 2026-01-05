import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { StudentEvaluation } from "@/components/guru/student-evaluation"

export default async function GuruStudentsPage() {
  const { userData } = await getCurrentUserWithRole()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Students & Evaluations</h1>
        <p className="text-muted-foreground">Record Mutabaah evaluations and attendance</p>
      </div>

      <StudentEvaluation guruId={userData.id} institutionId={userData.institution_id} />
    </div>
  )
}
