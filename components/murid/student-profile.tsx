"use client"

import { useState } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function StudentProfile({ userData }: { userData: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: userData.full_name,
    email: userData.email,
    phone: userData.phone || "",
    address: userData.address || "",
  })

  const handleSave = async () => {
    // In production, this would call a server action to update user data
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Informasi Pribadi</CardTitle>
              <CardDescription>Detail profil Anda</CardDescription>
            </div>
            {!isEditing && <Button onClick={() => setIsEditing(true)}>Edit Profil</Button>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Nama Lengkap</label>
            {isEditing ? (
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            ) : (
              <p className="p-2 bg-muted rounded">{formData.full_name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            {isEditing ? (
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            ) : (
              <p className="p-2 bg-muted rounded">{formData.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Telepon (Opsional)</label>
            {isEditing ? (
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            ) : (
              <p className="p-2 bg-muted rounded">{formData.phone || "—"}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Alamat (Opsional)</label>
            {isEditing ? (
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                rows={3}
              />
            ) : (
              <p className="p-2 bg-muted rounded">{formData.address || "—"}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave}>Simpan Perubahan</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Batal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Akun</CardTitle>
          <CardDescription>Informasi sistem tentang akun Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">Peran</p>
            <p className="font-semibold capitalize">Santri (Murid)</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="font-mono text-sm">{userData.id.substring(0, 8)}...</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">Bergabung Sejak</p>
            <p className="font-semibold">{new Date(userData.created_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
