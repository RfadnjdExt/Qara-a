"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const LEVEL_MAP: Record<string, number> = {
    "hafal_sangat_lancar": 4,
    "hafal_lancar": 3,
    "hafal_tidak_lancar": 2,
    "belum_hafal": 1
}

const LEVEL_LABELS: Record<number, string> = {
    4: "S. Lancar",
    3: "Lancar",
    2: "K. Lancar",
    1: "B. Hafal"
}

export function StudentProgressChart({ userId }: { userId: string }) {
    const [data, setData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchData() {
            const { data: evals } = await supabase
                .from("evaluations")
                .select("hafalan_level, verses_count, created_at, session:sessions(session_date)")
                .eq("user_id", userId)
                .order("created_at", { ascending: true })
                .limit(10)

            if (evals) {
                const chartData = evals.map((e: any) => ({
                    date: new Date(e.session?.session_date || e.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }),
                    score: LEVEL_MAP[e.hafalan_level] || 0,
                    verses: e.verses_count || 0
                }))
                setData(chartData)
            }
            setIsLoading(false)
        }

        fetchData()
    }, [userId])

    if (isLoading) return <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">Memuat data grafik...</div>
    if (data.length < 2) return null

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-lg">Tren Kemajuan Hafalan</CardTitle>
                <CardDescription>Grafik perkembangan 10 sesi terakhir</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                domain={[0, 4]}
                                ticks={[1, 2, 3, 4]}
                                tickFormatter={(val) => LEVEL_LABELS[val] || ""}
                                stroke="#888888"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                                formatter={(value: number, name: string) => {
                                    if (name === "score") return [LEVEL_LABELS[value], "Kualitas"]
                                    return [value, "Jumlah Ayat"]
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorScore)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
