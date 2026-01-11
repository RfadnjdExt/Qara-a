import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { StudentProfile } from "@/components/murid/student-profile"

export default async function MuridProfilePage() {
  const { userData } = await getCurrentUserWithRole()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profil Saya</h1>
        <p className="text-muted-foreground">Lihat dan kelola informasi profil Anda</p>
      </div>

      <StudentProfile userData={userData} />
    </div>
  )
}
