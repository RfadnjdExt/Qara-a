import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { EvaluationView } from "@/components/murid/evaluation-view"

export default async function MuridEvaluationsPage() {
  const { userData } = await getCurrentUserWithRole()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Evaluasi Saya</h1>
        <p className="text-muted-foreground">Lihat semua catatan evaluasi Mutabaah Anda</p>
      </div>

      <EvaluationView userId={userData.id} />
    </div>
  )
}
