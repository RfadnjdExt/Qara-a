import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { EvaluationTemplates } from "@/components/admin/evaluation-templates"

export default async function AdminTemplatesPage() {
  const { userData } = await getCurrentUserWithRole()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Evaluation Templates</h1>
        <p className="text-muted-foreground">Configure Mutabaah evaluation templates</p>
      </div>

      <EvaluationTemplates institutionId={userData.institution_id} />
    </div>
  )
}
