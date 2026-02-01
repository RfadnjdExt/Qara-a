import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, BookOpen, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function ParentDashboardPage() {
    const { userData } = await getCurrentUserWithRole()
    const supabase = await createClient()

    // Fetch linked students
    const { data: links } = await supabase
        .from("parent_student_links")
        .select("student:users(*)")
        .eq("parent_id", userData.id)

    const students = links?.map((l: any) => l.student) || []

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Assalamu'alaikum, {userData.full_name}</h1>
                    <p className="text-muted-foreground">Monitoring perkembangan hafalan dan mutabaah anak Anda</p>
                </div>
            </div>

            {students.length === 0 ? (
                <Card className="bg-muted/30 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">Belum Ada Santri Terhubung</h3>
                        <p className="text-sm text-muted-foreground max-w-sm text-center mt-2 mb-6">
                            Akun Anda belum terhubung dengan data santri manapun. Silakan hubungi admin sekolah untuk menautkan akun Anda dengan anak Anda.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {students.map(async (student: any) => {
                        // Fetch stats for each student
                        const [evalsRes, attendanceRes] = await Promise.all([
                            supabase
                                .from("evaluations")
                                .select("*, session:sessions(session_date)")
                                .eq("user_id", student.id)
                                .order("created_at", { ascending: false })
                                .limit(1),
                            supabase
                                .from("attendance_records")
                                .select("status")
                                .eq("user_id", student.id)
                                .eq("status", "hadir")
                        ])

                        const latestEval = evalsRes.data?.[0]
                        const attendanceCount = attendanceRes.data?.length || 0

                        return (
                            <Card key={student.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardHeader className="bg-primary/5 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{student.full_name}</CardTitle>
                                            <CardDescription>{student.email}</CardDescription>
                                        </div>
                                        <div className="bg-primary/10 p-2 rounded-full">
                                            <Trophy className="w-5 h-5 text-primary" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Trophy className="w-3 h-3" /> Poin
                                            </p>
                                            <p className="text-xl font-bold">{student.points || 0}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> Kehadiran
                                            </p>
                                            <p className="text-xl font-bold text-green-600">{attendanceCount}</p>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Evaluasi Terakhir</p>
                                        {latestEval ? (
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Hafalan:</span>
                                                    <span className="font-medium capitalize">{latestEval.hafalan_level.replace(/_/g, " ")}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Tanggal:</span>
                                                    <span>{latestEval.session?.session_date ? new Date(latestEval.session.session_date).toLocaleDateString("id-ID") : "-"}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">Belum ada evaluasi tercatat</p>
                                        )}
                                    </div>

                                    <Link href={`/orang_tua/children/${student.id}`} className="block">
                                        <Button variant="outline" className="w-full group">
                                            Lihat Detail <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
