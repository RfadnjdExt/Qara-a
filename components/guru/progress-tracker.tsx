"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, TrendingUp, Award } from "lucide-react"

interface ProgressTrackerProps {
    classId?: string
    guruId: string
}

export function ProgressTracker({ classId, guruId }: ProgressTrackerProps) {
    const [data, setData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchProgress()
    }, [classId, guruId])

    async function fetchProgress() {
        setIsLoading(true)
        try {
            // 1. Fetch Students
            let query = supabase
                .from("class_enrollments")
                .select("user:users(id, full_name)")

            if (classId) {
                query = query.eq("class_id", classId)
            }

            const { data: studentsData } = await query
            const studentList = studentsData?.map((e: any) => e.user).filter(Boolean) || []

            if (studentList.length === 0) {
                setData([])
                return
            }

            const studentIds = studentList.map((s: any) => s.id)

            // 2. Fetch Latest Evaluation for each student
            const { data: evalData } = await supabase
                .from("evaluations")
                .select("*, subject:subjects(name)")
                .in("user_id", studentIds)
                .order("created_at", { ascending: false })

            // 3. Process data
            const processed = studentList.map(student => {
                const studentEvals = evalData?.filter(e => e.user_id === student.id) || []
                const latest = studentEvals[0] || null

                // Simple progress metric: count of evaluations where level is "hafal_lancar" or better
                const proficientCount = studentEvals.filter(e =>
                    e.hafalan_level === "hafal_lancar" || e.hafalan_level === "hafal_sangat_lancar"
                ).length

                const totalEvals = studentEvals.length
                const progressPercentage = totalEvals > 0 ? (proficientCount / totalEvals) * 100 : 0

                return {
                    id: student.id,
                    name: student.full_name,
                    latestSurah: latest?.surah_name || "Belum ada data",
                    latestMateri: latest?.subject?.name || "—",
                    latestLevel: latest?.hafalan_level?.replace(/_/g, " ") || "—",
                    totalEvals,
                    progressPercentage
                }
            })

            setData(processed)
        } catch (err) {
            console.error("Error fetching progress:", err)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) return <div className="text-center py-10">Memuat progres...</div>

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((student) => (
                    <Card key={student.id} className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg font-bold">{student.name}</CardTitle>
                                <div className="bg-blue-50 text-blue-700 p-1.5 rounded-full">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                            </div>
                            <CardDescription className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                {student.latestMateri} • {student.latestSurah}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-medium">
                                    <span>Tingkat Kelancaran</span>
                                    <span>{Math.round(student.progressPercentage)}%</span>
                                </div>
                                <Progress value={student.progressPercentage} className="h-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
                                <div>
                                    <p className="text-muted-foreground">Status Terakhir</p>
                                    <p className="font-semibold capitalize text-primary">{student.latestLevel}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-muted-foreground">Total Setoran</p>
                                    <p className="font-semibold">{student.totalEvals} Sesi</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {data.length === 0 && (
                <Card className="p-8 text-center text-muted-foreground">
                    <Award className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Belum ada data progres untuk kelas ini.</p>
                </Card>
            )}
        </div>
    )
}
