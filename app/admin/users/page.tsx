import { createAdminClient } from "@/lib/supabase/admin"
import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { UserManagement } from "@/components/admin/user-management"

export default async function AdminUsersPage() {
  // 🔐 cek login + role (tetap pakai RLS auth)
  const { userData } = await getCurrentUserWithRole()

  // 🛠 admin client (bypass RLS)
  const supabase = createAdminClient()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, roles, and permissions
        </p>
      </div>

      <UserManagement institutionId={userData.institution_id} />
    </div>
  )
}
