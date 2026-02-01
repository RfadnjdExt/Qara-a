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
import { toast } from "sonner"

type AttendanceStatus = "hadir" | "izin" | "sakit" | "alpa"

interface Student {
  id: string
  full_name: string
}

interface AttendanceSheetProps {
  isOpen: boolean
  onClose: () => void
  sessionId: string
  classId: string
  sessionDate: string
}

export function AttendanceSheet({
  isOpen,
  onClose,
  sessionId,
  classId,
  sessionDate,
}: AttendanceSheetProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({})
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
      // 1. Fetch Students in Class
      const { data: enrollmentData, error: enrollError } = await supabase
        .from("class_enrollments")
        .select("user:users(id, full_name)")
        .eq("class_id", classId)

      if (enrollError) throw enrollError

      const studentList = enrollmentData?.map((e: any) => e.user).filter(Boolean) || []
      
      // Sort alphabetically
      studentList.sort((a: any, b: any) => a.full_name.localeCompare(b.full_name))
      setStudents(studentList)

      // 2. Fetch Existing Attendance
      const { data: attendanceData, error: attError } = await supabase
        .from("attendance_records")
        .select("user_id, status")
        .eq("session_id", sessionId)

      if (attError) throw attError

      // Map to state
      const initialAttendance: Record<string, AttendanceStatus> = {}
      attendanceData?.forEach((record: any) => {
        initialAttendance[record.user_id] = record.status as AttendanceStatus
      })

      setAttendance(initialAttendance)
    } catch (err) {
      console.error("Error fetching attendance:", err)
      toast.error("Gagal memuat data absensi")
    } finally {
      setLoading(false)
    }
  }

  function handleStatusChange(studentId: string, status: AttendanceStatus) {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }))
  }

  function handleMarkAll(status: AttendanceStatus) {
    const newAttendance: Record<string, AttendanceStatus> = {}
    students.forEach((s) => {
      newAttendance[s.id] = status
    })
    setAttendance(newAttendance)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const upsertData = Object.entries(attendance).map(([userId, status]) => ({
        session_id: sessionId,
        user_id: userId,
        status: status,
      }))

      if (upsertData.length === 0) {
        onClose()
        return
      }

      const { error } = await supabase
        .from("attendance_records")
        .upsert(upsertData, { onConflict: "session_id,user_id" })

      if (error) throw error

      toast.success("Absensi berhasil disimpan")
      onClose()
    } catch (err: any) {
      console.error("Error saving attendance:", err)
      toast.error("Gagal menyimpan absensi: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Absensi Santri</DialogTitle>
          <DialogDescription>
            Sesi: {new Date(sessionDate).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-2 flex gap-2 border-b bg-muted/20">
          <span className="text-sm text-muted-foreground self-center mr-2">Set Semua:</span>
          <Button variant="outline" size="sm" onClick={() => handleMarkAll("hadir")} className="h-7 text-xs border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800">
            Hadir Semua
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleMarkAll("izin")} className="h-7 text-xs border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800">
            Izin Semua
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-0">
          {loading ? (
            <div className="text-center py-10">Memuat data...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">Tidak ada santri di kelas ini</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground sticky top-0 z-10">
                <tr>
                  <th className="text-left py-3 px-6 font-medium">Nama Santri</th>
                  <th className="text-center py-3 px-2 font-medium w-[320px]">Status Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/30">
                    <td className="py-3 px-6 font-medium">{student.full_name}</td>
                    <td className="py-3 px-2">
                      <div className="flex justify-center gap-1">
                        <StatusButton 
                          current={attendance[student.id]} 
                          value="hadir" 
                          label="Hadir" 
                          color="bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                          activeColor="bg-green-600 text-white border-green-600"
                          onClick={() => handleStatusChange(student.id, "hadir")} 
                        />
                        <StatusButton 
                          current={attendance[student.id]} 
                          value="izin" 
                          label="Izin" 
                          color="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                          activeColor="bg-blue-600 text-white border-blue-600"
                          onClick={() => handleStatusChange(student.id, "izin")} 
                        />
                        <StatusButton 
                          current={attendance[student.id]} 
                          value="sakit" 
                          label="Sakit" 
                          color="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200"
                          activeColor="bg-orange-600 text-white border-orange-600"
                          onClick={() => handleStatusChange(student.id, "sakit")} 
                        />
                        <StatusButton 
                          current={attendance[student.id]} 
                          value="alpa" 
                          label="Alpa" 
                          color="bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
                          activeColor="bg-red-600 text-white border-red-600"
                          onClick={() => handleStatusChange(student.id, "alpa")} 
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <DialogFooter className="p-6 pt-4 border-t gap-2">
          <div className="mr-auto text-sm text-muted-foreground">
             {Object.keys(attendance).length} / {students.length} ditandai
          </div>
          <Button variant="outline" onClick={onClose} disabled={saving}>Tutup</Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? "Menyimpan..." : "Simpan Absensi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StatusButton({ 
  current, 
  value, 
  label, 
  color, 
  activeColor, 
  onClick 
}: { 
  current: string | undefined, 
  value: string, 
  label: string, 
  color: string, 
  activeColor: string, 
  onClick: () => void 
}) {
  const isActive = current === value
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-xs font-medium border transition-all ${
        isActive ? activeColor : color
      }`}
    >
      {label}
    </button>
  )
}
