"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

export function ReportView({ userId, userName }: { userId: string; userName: string }) {
  const [evaluations, setEvaluations] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [userId])

  async function fetchData() {
    const { data } = await supabase
      .from("evaluations")
      .select("*, session:sessions(session_date)")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })

    setEvaluations(data || [])
    calculateStats(data || [])
    setIsLoading(false)
  }

  function calculateStats(evals: any[]) {
    if (evals.length === 0) {
      setStats(null)
      return
    }

    const levels = {
      belum_hafal: 0,
      hafal_tidak_lancar: 0,
      hafal_lancar: 0,
      hafal_sangat_lancar: 0,
    }

    evals.forEach((item) => {
      if (item.hafalan_level && levels.hasOwnProperty(item.hafalan_level)) {
        levels[item.hafalan_level as keyof typeof levels]++
      }
    })

    const mostCommon = Object.entries(levels).reduce(([prevKey, prevVal], [key, val]) => {
      return (val as number) > (prevVal as number) ? [key, val] : [prevKey, prevVal]
    })

    setStats({
      totalEvaluations: evals.length,
      levels,
      mostCommon: mostCommon[0],
      dateRange: {
        start: evals[0]?.session?.session_date,
        end: evals[evals.length - 1]?.session?.session_date,
      },
    })
  }

  function generatePDFReport() {
    // Generate simple text-based report that can be printed
    let reportContent = `MUTABAAH EVALUATION REPORT\n`
    reportContent += `${"=".repeat(60)}\n\n`
    reportContent += `Student: ${userName}\n`
    reportContent += `Generated: ${new Date().toLocaleDateString()}\n\n`

    if (stats) {
      reportContent += `SUMMARY STATISTICS\n${"-".repeat(60)}\n`
      reportContent += `Total Evaluations: ${stats.totalEvaluations}\n`
      reportContent += `Date Range: ${new Date(stats.dateRange.start).toLocaleDateString()} - ${new Date(stats.dateRange.end).toLocaleDateString()}\n\n`

      reportContent += `LEVEL DISTRIBUTION\n${"-".repeat(60)}\n`
      reportContent += `Belum Hafal: ${stats.levels.belum_hafal}\n`
      reportContent += `Hafal Tidak Lancar: ${stats.levels.hafal_tidak_lancar}\n`
      reportContent += `Hafal Lancar: ${stats.levels.hafal_lancar}\n`
      reportContent += `Hafal Sangat Lancar: ${stats.levels.hafal_sangat_lancar}\n\n`
    }

    reportContent += `DETAILED EVALUATIONS\n${"-".repeat(60)}\n\n`
    evaluations.forEach((eval, index) => {
      reportContent += `Evaluation ${index + 1}\n`
      reportContent += `Date: ${new Date(eval.session?.session_date).toLocaleDateString()}\n`
      reportContent += `Hafalan: ${eval.hafalan_level}\n`
      reportContent += `Tajweed: ${eval.tajweed_level}\n`
      reportContent += `Tartil: ${eval.tartil_level}\n`
      if (eval.additional_notes) {
        reportContent += `Notes: ${eval.additional_notes}\n`
      }
      reportContent += `\n`
    })

    // Create blob and download
    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${userName}-report-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {evaluations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No evaluations available for report generation</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Report Summary</CardTitle>
              <CardDescription>Overview of your evaluation records</CardDescription>
            </CardHeader>
            <CardContent>
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="p-4 bg-muted rounded">
                    <p className="text-xs text-muted-foreground mb-1">Total Evaluations</p>
                    <p className="text-2xl font-bold">{stats.totalEvaluations}</p>
                  </div>

                  <div className="p-4 bg-muted rounded">
                    <p className="text-xs text-muted-foreground mb-1">Sangat Lancar</p>
                    <p className="text-2xl font-bold text-green-600">{stats.levels.hafal_sangat_lancar}</p>
                  </div>

                  <div className="p-4 bg-muted rounded">
                    <p className="text-xs text-muted-foreground mb-1">Lancar</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.levels.hafal_lancar}</p>
                  </div>

                  <div className="p-4 bg-muted rounded">
                    <p className="text-xs text-muted-foreground mb-1">Tidak Lancar</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.levels.hafal_tidak_lancar}</p>
                  </div>

                  <div className="p-4 bg-muted rounded">
                    <p className="text-xs text-muted-foreground mb-1">Belum Hafal</p>
                    <p className="text-2xl font-bold text-red-600">{stats.levels.belum_hafal}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Download Button */}
          <div className="flex justify-end">
            <Button onClick={generatePDFReport} size="lg">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>

          {/* Evaluation Details */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Details</CardTitle>
              <CardDescription>All recorded evaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {evaluations.map((evaluation, index) => (
                  <div key={evaluation.id} className="p-4 border border-border rounded">
                    <div className="flex justify-between items-start mb-3">
                      <p className="font-semibold">Evaluation {evaluations.length - index}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(evaluation.session?.session_date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Hafalan</p>
                        <p className="font-semibold text-sm capitalize">{evaluation.hafalan_level}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tajweed</p>
                        <p className="font-semibold text-sm capitalize">{evaluation.tajweed_level}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tartil</p>
                        <p className="font-semibold text-sm capitalize">{evaluation.tartil_level}</p>
                      </div>
                    </div>

                    {evaluation.additional_notes && (
                      <div className="text-sm text-muted-foreground">
                        <p className="text-xs font-medium mb-1">Notes:</p>
                        <p>{evaluation.additional_notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
