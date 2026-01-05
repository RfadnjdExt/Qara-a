"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"

// tipe data
type Class = { id: string; name: string }
type Student = { id: string; full_name: string }
type Session = { id: string; session_date: string }
type Template = { id: string; name: string }

type EvalFormData = {
  template_id: string
  tajweed_level: string
  hafalan_level: string
  tartil_level: string
  additional_notes: string
}

export function StudentEvaluation({
  guruId,
  institutionId,
}: {
  guruId: string
  institutionId: string
}) {
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [showEvalForm, setShowEvalForm] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [evalFormData, setEvalFormData] = useState<EvalFormData>({
    template_id: "",
    tajweed_level: "",
    hafalan_level: "",
    tartil_level: "",
    additional_notes: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchInitialData()
  }, [guruId, institutionId]) // fix dependency

  async function fetchInitialData() {
    setIsLoading(true)
    try {
      const [classesRes, templatesRes] = await Promise.all([
        supabase.from("classes").select("*").eq("guru_id", guruId),
        supabase.from("evaluation_templates").select("*").eq("institution_id", institutionId),
      ])

      if (classesRes.error) throw classesRes.error
      if (templatesRes.error) throw templatesRes.error

      const classData = classesRes.data || []
      const templateData = templatesRes.data || []

      setClasses(classData)
      setTemplates(templateData)
      setIsLoading(false)

      if (classData.length > 0) {
        const firstClassId = classData[0].id
        setSelectedClass(firstClassId)
        await fetchClassData(firstClassId)
      }
    } catch (err) {
      console.error("Error fetching initial data:", err)
      setIsLoading(false)
    }
  }

  async function fetchClassData(classId: string) {
    try {
      const [studentsRes, sessionsRes] = await Promise.all([
        supabase
          .from("class_enrollments")
          .select("user:users(*)")
          .eq("class_id", classId),
        supabase
          .from("sessions")
          .select("*")
          .eq("class_id", classId)
          .order("session_date", { ascending: false }),
      ])

      if (studentsRes.error) throw studentsRes.error
      if (sessionsRes.error) throw sessionsRes.error

      setStudents(studentsRes.data?.map((e: any) => e.user) || [])
      setSessions(sessionsRes.data || [])
    } catch (err) {
      console.error("Error fetching class data:", err)
    }
  }

  async function handleAddEvaluation(e: React.FormEvent) {
    e.preventDefault()

    if (!selectedStudent || !selectedSession || !evalFormData.template_id) return

    try {
      const { error } = await supabase.from("evaluations").insert({
        session_id: selectedSession,
        user_id: selectedStudent,
        evaluator_id: guruId,
        ...evalFormData, // fix duplicate template_id
      })

      if (error) throw error

      // reset form
      setEvalFormData({
        template_id: "",
        tajweed_level: "",
        hafalan_level: "",
        tartil_level: "",
        additional_notes: "",
      })
      setShowEvalForm(false)
      setSelectedStudent(null)
      setSelectedSession(null)
      // TODO: fetch evaluations again untuk render list
    } catch (err) {
      console.error("Error adding evaluation:", err)
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div className="space-y-4">
      {classes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No classes assigned</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex gap-2 mb-4">
            {classes.map((cls) => (
              <Button
                key={cls.id}
                variant={selectedClass === cls.id ? "default" : "outline"}
                onClick={() => {
                  setSelectedClass(cls.id)
                  fetchClassData(cls.id)
                }}
              >
                {cls.name}
              </Button>
            ))}
          </div>

          <Tabs defaultValue="evaluation" className="space-y-4">
            <TabsList>
              <TabsTrigger value="evaluation">Evaluations</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>

            <TabsContent value="evaluation">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Mutabaah Evaluations</CardTitle>
                      <CardDescription>Record daily student evaluations</CardDescription>
                    </div>
                    <Button onClick={() => setShowEvalForm(!showEvalForm)} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Evaluation
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {showEvalForm && (
                    <form onSubmit={handleAddEvaluation} className="space-y-4 p-4 bg-muted rounded-lg">
                      <select
                        value={selectedSession || ""}
                        onChange={(e) => setSelectedSession(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        required
                      >
                        <option value="">Select Session</option>
                        {sessions.map((s) => (
                          <option key={s.id} value={s.id}>
                            {new Date(s.session_date).toLocaleDateString()}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedStudent || ""}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        required
                      >
                        <option value="">Select Student</option>
                        {students.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.full_name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={evalFormData.template_id}
                        onChange={(e) =>
                          setEvalFormData({ ...evalFormData, template_id: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        required
                      >
                        <option value="">Select Template</option>
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>

                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={evalFormData.tajweed_level}
                          onChange={(e) =>
                            setEvalFormData({ ...evalFormData, tajweed_level: e.target.value })
                          }
                          className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                        >
                          <option value="">Tajweed</option>
                          <option value="belum_hafal">Belum Hafal</option>
                          <option value="hafal_tidak_lancar">Tidak Lancar</option>
                          <option value="hafal_lancar">Lancar</option>
                          <option value="hafal_sangat_lancar">Sangat Lancar</option>
                        </select>

                        <select
                          value={evalFormData.hafalan_level}
                          onChange={(e) =>
                            setEvalFormData({ ...evalFormData, hafalan_level: e.target.value })
                          }
                          className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                        >
                          <option value="">Hafalan</option>
                          <option value="belum_hafal">Belum Hafal</option>
                          <option value="hafal_tidak_lancar">Tidak Lancar</option>
                          <option value="hafal_lancar">Lancar</option>
                          <option value="hafal_sangat_lancar">Sangat Lancar</option>
                        </select>

                        <select
                          value={evalFormData.tartil_level}
                          onChange={(e) =>
                            setEvalFormData({ ...evalFormData, tartil_level: e.target.value })
                          }
                          className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                        >
                          <option value="">Tartil</option>
                          <option value="belum_hafal">Belum Hafal</option>
                          <option value="hafal_tidak_lancar">Tidak Lancar</option>
                          <option value="hafal_lancar">Lancar</option>
                          <option value="hafal_sangat_lancar">Sangat Lancar</option>
                        </select>
                      </div>

                      <textarea
                        placeholder="Additional notes..."
                        value={evalFormData.additional_notes}
                        onChange={(e) =>
                          setEvalFormData({ ...evalFormData, additional_notes: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        rows={3}
                      />

                      <div className="flex gap-2">
                        <Button type="submit">Save Evaluation</Button>
                        <Button type="button" variant="outline" onClick={() => setShowEvalForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}

                  <div className="text-center py-10 text-muted-foreground">
                    Evaluations for this class will appear here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance</CardTitle>
                  <CardDescription>Track student attendance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10 text-muted-foreground">
                    Attendance tracking coming soon
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
