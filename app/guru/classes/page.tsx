import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { GuruClasses } from "@/components/guru/guru-classes"

export default async function GuruClassesPage() {
  const { userData } = await getCurrentUserWithRole()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kelas Saya</h1>
        <p className="text-muted-foreground">Lihat dan kelola kelas Anda</p>
      </div>

      <GuruClasses guruId={userData.id} />
    </div>
  )
}
