"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText } from "lucide-react"

export function ReportViewWithPDF({
  userId,
  userName,
  institutionId,
}: { userId: string; userName: string; institutionId: string }) {
  const [evaluations, setEvaluations] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
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

    setStats({
      totalEvaluations: evals.length,
      levels,
      dateRange: {
        start: evals[0]?.session?.session_date,
        end: evals[evals.length - 1]?.session?.session_date,
      },
    })
  }

  async function generatePDFReport() {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/reports/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          institutionId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate report")
      }

      // Create a blob from the response
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `laporan-evaluasi-${userName}-${new Date().toISOString().split("T")[0]}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Gagal membuat laporan. Silakan coba lagi.")
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Memuat...</div>
  }

  return (
    <div className="space-y-6">
      {evaluations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Tidak ada data evaluasi untuk laporan</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* PDF Download Card */}
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Laporan Evaluasi Resmi</CardTitle>
                  <CardDescription>Buat laporan PDF resmi dengan kop institusi</CardDescription>
                </div>
                <FileText className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Unduh laporan evaluasi profesional yang dapat dicetak atau dibagikan. Laporan mencakup riwayat evaluasi,
                statistik ringkasan, dan branding institusi.
              </p>
              <Button onClick={generatePDFReport} disabled={isGenerating} size="lg" className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? "Sedang Membuat..." : "Buat & Unduh PDF"}
              </Button>
            </CardContent>
          </Card>

          {/* Summary Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Laporan</CardTitle>
              <CardDescription>Gambaran umum catatan evaluasi Anda</CardDescription>
            </CardHeader>
            <CardContent>
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="p-4 bg-muted rounded">
                    <p className="text-xs text-muted-foreground mb-1">Total Evaluasi</p>
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
        </>
      )}
    </div>
  )
}
