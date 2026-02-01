"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Crown } from "lucide-react"

type LeaderboardEntry = {
    user_id: string
    full_name: string
    points: number
    rank: number
}

export function Leaderboard({ classId }: { classId: string }) {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [isEnabled, setIsEnabled] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        fetchLeaderboard()
    }, [classId])

    async function fetchLeaderboard() {
        try {
            // 1. Check if enabled for this class
            const { data: classData } = await supabase
                .from("classes")
                .select("enable_leaderboard")
                .eq("id", classId)
                .single()

            if (classData && classData.enable_leaderboard === false) {
                setIsEnabled(false)
                setLoading(false)
                return
            }

            // 2. Fetch users and their points for this class
            const { data: enrollments, error } = await supabase
                .from("class_enrollments")
                .select("user_id, user:users(full_name, points)")
                .eq("class_id", classId)

            if (error || !enrollments || enrollments.length === 0) {
                setLeaderboard([])
                setLoading(false)
                return
            }

            // Map and sort by points
            const entries: LeaderboardEntry[] = enrollments.map((e: any, i) => ({
                user_id: e.user_id,
                full_name: e.user?.full_name || "Unknown",
                points: e.user?.points || 0,
                rank: 0
            }))
                .filter(e => e.points > 0)
                .sort((a, b) => b.points - a.points)
                .slice(0, 5)

            // Assign ranks
            entries.forEach((e, i) => e.rank = i + 1)

            setLeaderboard(entries)
            setLoading(false)

        } catch (err) {
            console.error("Error fetching leaderboard", err)
            setLoading(false)
        }
    }

    if (!isEnabled) return null

    if (loading) return <div className="text-center py-4 text-sm text-muted-foreground">Memuat Papan Peringkat...</div>

    return (
        <Card className="h-full border-2 border-yellow-100 dark:border-yellow-900/20 bg-linear-to-b from-white to-yellow-50/20 dark:from-background dark:to-yellow-900/5">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            Papan Peringkat
                        </CardTitle>
                        <CardDescription>Top Santri Minggu Ini</CardDescription>
                    </div>
                    <Crown className="w-8 h-8 text-yellow-200 rotate-12" />
                </div>
            </CardHeader>
            <CardContent>
                {leaderboard.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                        Belum ada setoran minggu ini.
                        <p className="text-xs mt-1">Jadilah yang pertama!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {leaderboard.map((entry, index) => (
                            <div key={entry.user_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className={`
                            flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                            ${index === 0 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                        index === 1 ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                                            index === 2 ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                                'bg-muted text-muted-foreground'}
                        `}>
                                    {index === 0 ? <Crown className="w-4 h-4" /> : entry.rank}
                                </div>

                                <div className="flex-1">
                                    <p className="font-medium text-sm truncate">{entry.full_name}</p>
                                    <p className="text-xs text-muted-foreground">{entry.points} Poin</p>
                                </div>

                                {index < 3 && (
                                    <Medal className={`w-4 h-4 
                                ${index === 0 ? 'text-yellow-500' :
                                            index === 1 ? 'text-slate-400' :
                                                'text-orange-400'}
                            `} />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
