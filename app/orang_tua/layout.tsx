import type React from "react"
import { requireRole } from "@/lib/auth-utils"
import { ParentSidebar } from "@/components/parent/parent-sidebar"

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
    await requireRole(["orang_tua"])

    return (
        <div className="flex h-screen bg-background">
            <ParentSidebar />
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    )
}
