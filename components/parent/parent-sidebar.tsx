import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut, LayoutDashboard, Users, User } from "lucide-react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

async function LogoutButton() {
    async function handleLogout() {
        "use server"
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect("/auth/login")
    }

    return (
        <form action={handleLogout} className="w-full">
            <Button variant="ghost" className="w-full justify-start" type="submit">
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
            </Button>
        </form>
    )
}

export async function ParentSidebar() {
    const { userData } = await getCurrentUserWithRole()

    return (
        <div className="w-64 border-r border-border bg-sidebar flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-sidebar-border">
                <Link href="/" className="block hover:opacity-80 transition-opacity">
                    <h1 className="text-xl font-bold text-sidebar-foreground">Mutabaah</h1>
                    <p className="text-xs text-sidebar-accent-foreground/70">Portal Orang Tua</p>
                </Link>
            </div>

            <div className="p-4 border-b border-sidebar-border">
                <p className="text-sm font-medium text-sidebar-foreground">{userData.full_name}</p>
                <p className="text-xs text-sidebar-accent-foreground/70">{userData.email}</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link href="/orang_tua/dashboard">
                    <Button variant="ghost" className="w-full justify-start">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                    </Button>
                </Link>

                {/* Since parents link to students, maybe a "My Children" menu */}
                <Link href="/orang_tua/children">
                    <Button variant="ghost" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Anak Saya
                    </Button>
                </Link>

                <Link href="/orang_tua/profile">
                    <Button variant="ghost" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Profil
                    </Button>
                </Link>
            </nav>

            <div className="p-4 border-t border-sidebar-border">
                <LogoutButton />
            </div>
        </div>
    )
}
