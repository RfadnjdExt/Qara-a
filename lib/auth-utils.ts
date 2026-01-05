import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function getCurrentUserWithRole() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    console.log("[Auth-Utils] getUser failed:", error?.message || "No user found");
    redirect("/auth/login")
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (userError || !userData) {
    console.log("[Auth-Utils] DB Lookup failed for user:", user.id, userError?.message);
    redirect("/auth/login")
  }

  return {
    user,
    role: userData.role,
    userData,
  }
}

export async function requireRole(roles: string[]) {
  const { role } = await getCurrentUserWithRole()

  if (!roles.includes(role)) {
    redirect("/unauthorized")
  }

  return role
}
