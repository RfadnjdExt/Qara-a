"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function GuruDashboardContent({ guruId }: { guruId: string }) {
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
  const [recentEvaluations, setRecentEvaluations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const today = new Date().toISOString().split("T")[0]

      const [sessionsRes, evaluationsRes] = await Promise.all([
        supabase
          .from("sessions")
          .select("*, class:classes(name)")
          .eq("guru_id", guruId)
          .gte("session_date", today)
          .limit(5)
          .order("session_date", { ascending: true }),
        supabase
          .from("evaluations")
          .select("*, user:users(full_name), session:sessions(session_date)")
          .eq("evaluator_id", guruId)
          .limit(5)
          .order("created_at", { ascending: false }),
      ])

      setUpcomingSessions(sessionsRes.data || [])
      setRecentEvaluations(evaluationsRes.data || [])
      setIsLoading(false)
    }

    fetchData()
  }, [guruId, supabase])

  if (isLoading) {
    return <div className="text-center py-10">Memuat...</div>
  }

  return (
    <Tabs defaultValue="sessions" className="space-y-4">
      <TabsList>
        <TabsTrigger value="sessions">Sesi Mendatang</TabsTrigger>
        <TabsTrigger value="evaluations">Evaluasi Terakhir</TabsTrigger>
      </TabsList>

      <TabsContent value="sessions">
        <Card>
          <CardHeader>
            <CardTitle>Sesi Mendatang</CardTitle>
            <CardDescription>Jadwal mengajar Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingSessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tidak ada sesi mendatang</p>
              ) : (
                upcomingSessions.map((session) => (
                  <Card key={session.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{session.class?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.session_date).toLocaleDateString()} {session.start_time || "—"}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Terjadwal</span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="evaluations">
        <Card>
          <CardHeader>
            <CardTitle>Evaluasi Terakhir</CardTitle>
            <CardDescription>Evaluasi Mutabaah terbaru Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Santri</th>
                    <th className="text-left py-2 px-4">Tanggal</th>
                    <th className="text-left py-2 px-4">Hafalan</th>
                    <th className="text-left py-2 px-4">Tajwid</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvaluations.map((evaluation) => (
                    <tr key={evaluation.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4">{evaluation.user?.full_name}</td>
                      <td className="py-2 px-4">{new Date(evaluation.session?.session_date).toLocaleDateString()}</td>
                      <td className="py-2 px-4 text-xs capitalize">{evaluation.hafalan_level || "—"}</td>
                      <td className="py-2 px-4 text-xs capitalize">{evaluation.tajweed_level || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
