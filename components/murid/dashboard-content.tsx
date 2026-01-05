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
        supabase.from("class_enrollments").select("class:classes(name, guru:users(full_name))").eq("user_id", userId),
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
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>My Classes</CardTitle>
          <CardDescription>Classes you are enrolled in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {enrollments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No classes yet</p>
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
          <CardTitle>Recent Evaluations</CardTitle>
          <CardDescription>Your latest Mutabaah records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEvaluations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No evaluations yet</p>
            ) : (
              recentEvaluations.map((evaluation: any) => (
                <div key={evaluation.id} className="flex justify-between items-start p-3 bg-muted rounded">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(evaluation.session?.session_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-medium capitalize">{evaluation.hafalan_level || "—"}</p>
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
