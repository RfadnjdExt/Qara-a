"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function MuridDashboardContent({ userId }: { userId: string }) {
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [recentEvaluations, setRecentEvaluations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const [enrollmentsRes, evaluationsRes] = await Promise.all([
        supabase.from("class_enrollments").select("id, class:classes(name, guru:users(full_name))").eq("user_id", userId),
        supabase
          .from("evaluations")
          .select("*, session:sessions(session_date)")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(5),
      ])

      setEnrollments(enrollmentsRes.data || [])
      setRecentEvaluations(evaluationsRes.data || [])
      setIsLoading(false)
    }

    fetchData()
  }, [userId, supabase])

  if (isLoading) {
    return <div className="text-center py-10">Memuat...</div>
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Tanggal tidak tersedia"
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (e) {
      return "Format tanggal salah"
    }
  }

  const formatLevel = (level: string) => {
    return level ? level.replace(/_/g, " ") : "—"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Kelas Saya</CardTitle>
          <CardDescription>Kelas yang Anda ikuti</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {enrollments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada kelas</p>
            ) : (
              enrollments.map((enrollment: any) => (
                <div key={enrollment.id} className="flex justify-between items-start p-3 bg-muted rounded">
                  <div>
                    <p className="font-medium text-sm">{enrollment.class?.name}</p>
                    <p className="text-xs text-muted-foreground">{enrollment.class?.guru?.full_name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evaluasi Terakhir</CardTitle>
          <CardDescription>Catatan Mutabaah terbaru Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEvaluations.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada evaluasi</p>
            ) : (
              recentEvaluations.map((evaluation: any) => (
                <div key={evaluation.id} className="flex justify-between items-start p-3 bg-muted rounded">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {formatDate(evaluation.session?.session_date)}
                    </p>
                    <div className="flex gap-2">
                      <span className="text-sm font-medium capitalize bg-blue-100/50 px-2 py-0.5 rounded text-blue-700">
                        Hafalan: {formatLevel(evaluation.hafalan_level)}
                      </span>
                    </div>
                    {evaluation.additional_notes && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        "{evaluation.additional_notes}"
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
