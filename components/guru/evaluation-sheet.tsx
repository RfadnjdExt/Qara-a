"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Trophy } from "lucide-react"

type EvalLevel = "belum_hafal" | "hafal_tidak_lancar" | "hafal_lancar" | "hafal_sangat_lancar"

const QURAN_SURAHS = [
    "Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa'", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
    "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra'", "Al-Kahf", "Maryam", "Taha",
    "Al-Anbiya'", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Asy-Syu'ara'", "An-Naml", "Al-Qasas", "Al-'Ankabut", "Ar-Rum",
    "Luqman", "As-Sajdah", "Al-Ahzab", "Saba'", "Fatir", "Yasin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
    "Fussilat", "Asy-Syura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jasiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
    "Ad-Zariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadilah", "Al-Hasyr", "Al-Mumtahanah",
    "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
    "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddassir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba'", "An-Nazi'at", "'Abasa",
    "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Insyiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghasyiyah", "Al-Fajr", "Al-Balad",
    "Asy-Syams", "Al-Layl", "Ad-Duha", "Asy-Syarh", "At-Tin", "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat",
    "Al-Qari'ah", "At-Takasur", "Al-'Asr", "Al-Humazah", "Al-Fil", "Quraisy", "Al-Ma'un", "Al-Kausar", "Al-Kafirun", "An-Nasr",
    "Al-Lahab", "Al-Ikhlas", "Al-Falaq", "An-Nas"
]

interface Student {
    id: string
    full_name: string
}

interface EvaluationRecord {
    user_id: string
    subject_id: string | null
    surah_name: string
    tajweed_level: EvalLevel
    hafalan_level: EvalLevel
    tartil_level: EvalLevel
    additional_notes: string
}

interface EvaluationSheetProps {
    isOpen: boolean
    onClose: () => void
    sessionId: string
    classId: string
    guruId: string
    sessionDate: string
}

export function EvaluationSheet({
    isOpen,
    onClose,
    sessionId,
    classId,
    guruId,
    sessionDate,
}: EvaluationSheetProps) {
    const [students, setStudents] = useState<Student[]>([])
    const [subjects, setSubjects] = useState<any[]>([])
    const [evaluations, setEvaluations] = useState<Record<string, EvaluationRecord>>({})
    const [templateId, setTemplateId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        if (isOpen) {
            fetchData()
        }
    }, [isOpen, sessionId])

    async function fetchData() {
        setLoading(true)
        try {
            // 1. Fetch Students & Subjects for Class
            const [enrollRes, subjectsRes] = await Promise.all([
                supabase
                    .from("class_enrollments")
                    .select("user:users(id, full_name, institution_id)")
                    .eq("class_id", classId),
                supabase
                    .from("subjects")
                    .select("*")
                    .eq("class_id", classId)
                    .order("order_index", { ascending: true })
            ])

            if (enrollRes.error) throw enrollRes.error

            const studentList = enrollRes.data?.map((e: any) => e.user).filter(Boolean) || []
            studentList.sort((a: any, b: any) => a.full_name.localeCompare(b.full_name))
            setStudents(studentList)
            setSubjects(subjectsRes.data || [])

            // 2. Fetch/Confirm Template
            if (studentList.length > 0) {
                const instId = studentList[0].institution_id
                const { data: templates } = await supabase
                    .from("evaluation_templates")
                    .select("id")
                    .eq("institution_id", instId)
                    .limit(1)
                    .single()

                if (templates) setTemplateId(templates.id)
            }

            // 3. Fetch Existing Evaluations
            const { data: evalData, error: evalError } = await supabase
                .from("evaluations")
                .select("*")
                .eq("session_id", sessionId)

            if (evalError) throw evalError

            const initialEvals: Record<string, EvaluationRecord> = {}
            evalData?.forEach((record: any) => {
                initialEvals[record.user_id] = {
                    user_id: record.user_id,
                    subject_id: record.subject_id,
                    surah_name: record.surah_name || "",
                    tajweed_level: record.tajweed_level as EvalLevel,
                    hafalan_level: record.hafalan_level as EvalLevel,
                    tartil_level: record.tartil_level as EvalLevel,
                    additional_notes: record.additional_notes || "",
                }
            })

            setEvaluations(initialEvals)
        } catch (err) {
            console.error("Error fetching evaluations:", err)
            toast.error("Gagal memuat data evaluasi")
        } finally {
            setLoading(false)
        }
    }

    function handleFieldChange(studentId: string, field: keyof EvaluationRecord, value: any) {
        setEvaluations((prev) => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || {
                    user_id: studentId,
                    subject_id: null,
                    surah_name: "",
                    tajweed_level: "belum_hafal",
                    hafalan_level: "belum_hafal",
                    tartil_level: "belum_hafal",
                    additional_notes: "",
                }),
                [field]: value,
            },
        }))
    }

    async function handleSave() {
        if (!templateId) {
            toast.error("Template evaluasi tidak ditemukan. Harap hubungi Admin.")
            return
        }

        setSaving(true)
        try {
            const upsertData = Object.entries(evaluations).map(([userId, record]) => ({
                session_id: sessionId,
                evaluator_id: guruId,
                template_id: templateId,
                ...record,
            }))

            if (upsertData.length === 0) {
                onClose()
                return
            }

            const { error } = await supabase
                .from("evaluations")
                .upsert(upsertData, { onConflict: "session_id,user_id" })

            if (error) throw error

            toast.success("Evaluasi berhasil disimpan")
            onClose()
        } catch (err: any) {
            console.error("Error saving evaluation:", err)
            toast.error("Gagal menyimpan evaluasi: " + err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[95vw] w-[1400px] max-h-[95vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Input Nilai Hafalan</DialogTitle>
                    <DialogDescription>
                        Sesi: {new Date(sessionDate).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-x-auto overflow-y-auto p-0">
                    {loading ? (
                        <div className="text-center py-10">Memuat data...</div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">Tidak ada santri di kelas ini</div>
                    ) : (
                        <table className="w-full text-sm min-w-[1000px]">
                            <thead className="bg-muted text-muted-foreground sticky top-0 z-10 border-b">
                                <tr>
                                    <th className="text-left py-3 px-6 font-medium w-48">Nama Santri</th>
                                    <th className="text-left py-3 px-4 font-medium w-40">Materi (Juz)</th>
                                    <th className="text-left py-3 px-4 font-medium w-48">Surah / Ayat</th>
                                    <th className="text-left py-3 px-2 font-medium w-36">Tajwid</th>
                                    <th className="text-left py-3 px-2 font-medium w-36">Hafalan</th>
                                    <th className="text-left py-3 px-2 font-medium w-36">Tartil</th>
                                    <th className="text-left py-3 px-6 font-medium">Catatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-muted/30">
                                        <td className="py-4 px-6 font-medium">{student.full_name}</td>
                                        <td className="py-4 px-2">
                                            <select
                                                value={evaluations[student.id]?.subject_id || ""}
                                                onChange={(e) => handleFieldChange(student.id, "subject_id", e.target.value || null)}
                                                className="w-full px-2 py-1.5 rounded text-xs border bg-background"
                                            >
                                                <option value="">-- Pilih --</option>
                                                {subjects.map(s => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="flex flex-col gap-1">
                                                <select
                                                    value={evaluations[student.id]?.surah_name || ""}
                                                    onChange={(e) => handleFieldChange(student.id, "surah_name", e.target.value)}
                                                    className="w-full px-2 py-1.5 rounded text-xs border bg-background"
                                                >
                                                    <option value="">-- Cari Surah --</option>
                                                    {QURAN_SURAHS.map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                <Input
                                                    placeholder="Atau ketik manual/ayat..."
                                                    className="h-8 text-xs"
                                                    value={evaluations[student.id]?.surah_name || ""}
                                                    onChange={(e) => handleFieldChange(student.id, "surah_name", e.target.value)}
                                                />
                                            </div>
                                        </td>
                                        <td className="py-4 px-1">
                                            <LevelSelect
                                                value={evaluations[student.id]?.tajweed_level}
                                                onChange={(val) => handleFieldChange(student.id, "tajweed_level", val)}
                                            />
                                        </td>
                                        <td className="py-4 px-1">
                                            <LevelSelect
                                                value={evaluations[student.id]?.hafalan_level}
                                                onChange={(val) => handleFieldChange(student.id, "hafalan_level", val)}
                                            />
                                        </td>
                                        <td className="py-4 px-1">
                                            <LevelSelect
                                                value={evaluations[student.id]?.tartil_level}
                                                onChange={(val) => handleFieldChange(student.id, "tartil_level", val)}
                                            />
                                        </td>
                                        <td className="py-4 px-6">
                                            <Input
                                                placeholder="..."
                                                className="h-9"
                                                value={evaluations[student.id]?.additional_notes || ""}
                                                onChange={(e) => handleFieldChange(student.id, "additional_notes", e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <DialogFooter className="p-6 pt-4 border-t gap-2">
                    <div className="mr-auto text-sm text-muted-foreground">
                        {Object.keys(evaluations).length} / {students.length} santri dinilai
                    </div>
                    <Button variant="outline" onClick={onClose} disabled={saving}>Tutup</Button>
                    <Button onClick={handleSave} disabled={saving || loading}>
                        <Trophy className="mr-2 h-4 w-4" />
                        {saving ? "Menyimpan..." : "Simpan Nilai"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function LevelSelect({ value, onChange }: { value?: EvalLevel, onChange: (val: EvalLevel) => void }) {
    return (
        <select
            value={value || "belum_hafal"}
            onChange={(e) => onChange(e.target.value as EvalLevel)}
            className={`w-full px-2 py-1.5 rounded text-xs font-medium border transition-all bg-background cursor-pointer ${!value ? "text-muted-foreground" : "text-foreground font-semibold"
                }`}
        >
            <option value="belum_hafal">Belum Hafal</option>
            <option value="hafal_tidak_lancar">K. Lancar</option>
            <option value="hafal_lancar">Lancar</option>
            <option value="hafal_sangat_lancar">S. Lancar</option>
        </select>
    )
}
