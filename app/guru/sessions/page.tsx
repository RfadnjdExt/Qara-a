import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { SessionManagement } from "@/components/guru/session-management"

export default async function GuruSessionsPage() {
  const { userData } = await getCurrentUserWithRole()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sessions</h1>
        <p className="text-muted-foreground">Create and manage teaching sessions</p>
      </div>

      <SessionManagement guruId={userData.id} institutionId={userData.institution_id} />
    </div>
  )
}
