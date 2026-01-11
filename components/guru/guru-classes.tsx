"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function GuruClasses({ guruId }: { guruId: string }) {
  const [classes, setClasses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchClasses() {
      const { data } = await supabase
        .from("classes")
        .select("*, semester:semesters(name), enrollments:class_enrollments(count)")
        .eq("guru_id", guruId)

      setClasses(data || [])
      setIsLoading(false)
    }

    fetchClasses()
  }, [guruId, supabase])

  if (isLoading) {
    return <div className="text-center py-10">Memuat...</div>
  }

  return (
    <div className="space-y-4">
      {classes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Belum ada kelas yang ditugaskan</p>
          </CardContent>
        </Card>
      ) : (
        classes.map((cls) => (
          <Card key={cls.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{cls.name}</CardTitle>
                  <CardDescription>{cls.semester?.name}</CardDescription>
                </div>
                <Link href={`/guru/classes/${cls.id}`}>
                  <Button size="sm">Kelola</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{cls.description || "Tidak ada deskripsi"}</p>
              <p className="text-sm mt-2">
                <strong>Santri:</strong> {cls.enrollments?.[0]?.count || 0}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
