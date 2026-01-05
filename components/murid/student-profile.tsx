"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your profile details</CardDescription>
            </div>
            {!isEditing && <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Full Name</label>
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
            <label className="text-sm font-medium mb-2 block">Phone (Optional)</label>
            {isEditing ? (
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            ) : (
              <p className="p-2 bg-muted rounded">{formData.phone || "—"}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Address (Optional)</label>
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
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>System information about your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-semibold capitalize">Student (Murid)</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="font-mono text-sm">{userData.id.substring(0, 8)}...</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">Member Since</p>
            <p className="font-semibold">{new Date(userData.created_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
