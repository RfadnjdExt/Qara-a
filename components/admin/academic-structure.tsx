"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { toast } from "sonner"


export function AcademicStructure({ institutionId }: { institutionId: string }) {
  const [semesters, setSemesters] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSemesterForm, setShowSemesterForm] = useState(false)
  const [showClassForm, setShowClassForm] = useState(false)
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null)
  const [teachers, setTeachers] = useState<any[]>([])

  const [semesterForm, setSemesterForm] = useState({ name: "", start_date: "", end_date: "" })
  const [classForm, setClassForm] = useState({ name: "", guru_id: "", description: "" })

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [institutionId])

  async function fetchData() {
    const [semestersRes, classesRes, teachersRes] = await Promise.all([
      supabase.from("semesters").select("*").eq("institution_id", institutionId),
      supabase.from("classes").select("*").eq("institution_id", institutionId),
      supabase.from("users").select("*").eq("institution_id", institutionId).eq("role", "guru"),
    ])

    setSemesters(semestersRes.data || [])
    setClasses(classesRes.data || [])
    setTeachers(teachersRes.data || [])
    setIsLoading(false)
  }

  async function handleAddSemester(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from("semesters").insert({
      institution_id: institutionId,
      ...semesterForm,
    })

    if (error) {
      toast.error("Failed to add semester: " + error.message)
      return
    }

    toast.success("Semester added successfully")
    setSemesterForm({ name: "", start_date: "", end_date: "" })
    setShowSemesterForm(false)
    fetchData()
  }

  async function handleAddClass(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSemester) return

    const { error } = await supabase.from("classes").insert({
      institution_id: institutionId,
      semester_id: selectedSemester,
      ...classForm,
    })

    if (error) {
      toast.error("Failed to add class: " + error.message)
      return
    }

    toast.success("Class added successfully")
    setClassForm({ name: "", guru_id: "", description: "" })
    setShowClassForm(false)
    fetchData()
  }

  if (isLoading) return <div className="text-center py-10">Loading...</div>

  return (
    <Tabs defaultValue="semesters" className="space-y-4">
      <TabsList>
        <TabsTrigger value="semesters">Semesters</TabsTrigger>
        <TabsTrigger value="classes">Classes</TabsTrigger>
      </TabsList>

      <TabsContent value="semesters">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Semesters</CardTitle>
                <CardDescription>Academic periods</CardDescription>
              </div>
              <Button onClick={() => setShowSemesterForm(!showSemesterForm)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Semester
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showSemesterForm && (
              <form onSubmit={handleAddSemester} className="space-y-4 p-4 bg-muted rounded-lg">
                <Input
                  placeholder="Semester name (e.g., Semester 1 2024)"
                  value={semesterForm.name}
                  onChange={(e) => setSemesterForm({ ...semesterForm, name: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={semesterForm.start_date}
                    onChange={(e) => setSemesterForm({ ...semesterForm, start_date: e.target.value })}
                  />
                  <Input
                    type="date"
                    value={semesterForm.end_date}
                    onChange={(e) => setSemesterForm({ ...semesterForm, end_date: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Add Semester</Button>
                  <Button type="button" variant="outline" onClick={() => setShowSemesterForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {semesters.map((semester) => (
                <Card key={semester.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{semester.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(semester.start_date).toLocaleDateString()} -{" "}
                        {new Date(semester.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${semester.is_active ? "bg-green-100 text-green-700" : "bg-gray-100"}`}
                    >
                      {semester.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="classes">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Classes</CardTitle>
                <CardDescription>Class sections and assignments</CardDescription>
              </div>
              <Button
                onClick={() => {
                  setShowClassForm(!showClassForm)
                  if (!selectedSemester && semesters.length > 0) {
                    setSelectedSemester(semesters[0].id)
                  }
                }}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Class
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showClassForm && (
              <form onSubmit={handleAddClass} className="space-y-4 p-4 bg-muted rounded-lg">
                <select
                  value={selectedSemester || ""}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Select Semester</option>
                  {semesters.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Class name (e.g., Kelas A)"
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                />
                <Input
                  placeholder="Description (optional)"
                  value={classForm.description}
                  onChange={(e) => setClassForm({ ...classForm, description: e.target.value })}
                />
                <select
                  value={classForm.guru_id}
                  onChange={(e) => setClassForm({ ...classForm, guru_id: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.full_name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <Button type="submit">Add Class</Button>
                  <Button type="button" variant="outline" onClick={() => setShowClassForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {classes.map((cls) => (
                <Card key={cls.id} className="p-4">
                  <p className="font-medium">{cls.name}</p>
                  <p className="text-sm text-muted-foreground">{cls.description || "No description"}</p>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
