"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

export function SessionManagement({ guruId, institutionId }: { guruId: string; institutionId: string }) {
  const [sessions, setSessions] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    class_id: "",
    session_date: "",
    start_time: "",
    end_time: "",
    notes: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [guruId])

  async function fetchData() {
    const [classesRes, sessionsRes] = await Promise.all([
      supabase.from("classes").select("*").eq("guru_id", guruId),
      supabase
        .from("sessions")
        .select("*, class:classes(name)")
        .eq("guru_id", guruId)
        .order("session_date", { ascending: false }),
    ])

    setClasses(classesRes.data || [])
    setSessions(sessionsRes.data || [])
    setIsLoading(false)
  }

  async function handleAddSession(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.class_id || !formData.session_date) return

    const { error } = await supabase.from("sessions").insert({
      guru_id: guruId,
      ...formData,
    })

    if (!error) {
      setFormData({ class_id: "", session_date: "", start_time: "", end_time: "", notes: "" })
      setShowForm(false)
      fetchData()
    }
  }

  async function handleDeleteSession(sessionId: string) {
    if (confirm("Delete this session?")) {
      await supabase.from("sessions").delete().eq("id", sessionId)
      fetchData()
    }
  }

  if (isLoading) return <div className="text-center py-10">Loading...</div>

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Teaching Sessions</CardTitle>
            <CardDescription>Create and manage your teaching sessions</CardDescription>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleAddSession} className="space-y-4 p-4 bg-muted rounded-lg">
            <select
              value={formData.class_id}
              onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              required
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>

            <Input
              type="date"
              value={formData.session_date}
              onChange={(e) => setFormData({ ...formData, session_date: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-2">
              <Input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                placeholder="Start time"
              />
              <Input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                placeholder="End time"
              />
            </div>

            <Input
              placeholder="Notes (optional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />

            <div className="flex gap-2">
              <Button type="submit">Create Session</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions created yet</p>
          ) : (
            sessions.map((session) => (
              <Card key={session.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{session.class?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.session_date).toLocaleDateString()} {session.start_time || ""} -{" "}
                      {session.end_time || ""}
                    </p>
                    {session.notes && <p className="text-sm mt-2">{session.notes}</p>}
                  </div>
                  <button onClick={() => handleDeleteSession(session.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
