import type React from "react"
import { requireRole } from "@/lib/auth-utils"
import { MuridSidebar } from "@/components/murid/murid-sidebar"

export default async function MuridLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["murid"])

  return (
    <div className="flex h-screen bg-background">
      <MuridSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
