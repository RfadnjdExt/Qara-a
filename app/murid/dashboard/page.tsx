import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MuridDashboardContent } from "@/components/murid/dashboard-content"
import { BadgeList } from "@/components/gamification/badge-list"
import { getEarnedBadges, getAllBadges } from "@/lib/gamification"
import { Leaderboard } from "@/components/leaderboard"
import { StudentProgressChart } from "@/components/analytics/student-progress-chart"
import Link from "next/link"
import { ArrowRight, Trophy } from "lucide-react"

async function LatestBadges({ userId }: { userId: string }) {
  const [allBadges, earnedBadges] = await Promise.all([
    getAllBadges(),
    getEarnedBadges(userId)
  ])

  return (
    <div className="space-y-4">
      <BadgeList allBadges={allBadges} userBadges={earnedBadges} compact />

      <Link href="/murid/achievements" className="flex items-center text-primary text-sm hover:underline">
        Lihat semua pencapaian <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    </div>
  )
}

export default async function MuridDashboardPage() {
  const { userData } = await getCurrentUserWithRole()
  const supabase = await createClient()

  // Fetch student's classes
  const { data: enrollments } = await supabase
    .from("class_enrollments")
    .select("class_id, class:classes(*, semester:semesters(name))")
    .eq("user_id", userData.id)

  // Fetch recent evaluations
  const { data: recentEvals } = await supabase
    .from("evaluations")
    .select("*")
    .eq("user_id", userData.id)
    .order("created_at", { ascending: false })
    .limit(1)

  const latestEval = recentEvals?.[0]
  const activeClassId = enrollments && enrollments.length > 0 ? enrollments[0].class_id : null

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Selamat Datang, {userData.full_name}</h1>
        <p className="text-muted-foreground">Lihat evaluasi dan perkembangan belajar Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Kelas Saya</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Kelas diikuti</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Evaluasi Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestEval ? "Tercatat" : "—"}</div>
            <p className="text-xs text-muted-foreground">
              {latestEval ? new Date(latestEval.created_at).toLocaleDateString() : "Belum ada evaluasi"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border-yellow-200 dark:border-yellow-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-600" />
              Poin Saya
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-500">
              {userData.points || 0}
            </div>
            <p className="text-xs text-muted-foreground">Kumpulkan poin dari setoran & kehadiran</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StudentProgressChart userId={userData.id} />
          <MuridDashboardContent userId={userData.id} />
        </div>
        <div className="space-y-6">
          {/* Leaderboard Widget */}
          {activeClassId && (
            <div className="h-[400px]">
              <Leaderboard classId={activeClassId} />
            </div>
          )}

          {/* Badges Widget */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-lg">
                Pencapaian Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LatestBadges userId={userData.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
