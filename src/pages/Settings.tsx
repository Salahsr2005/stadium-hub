"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Lock, Bell, Trash2, LogOut, Shield } from "lucide-react"
import DashboardLayout from "@/components/DashboardLayout"

const Settings = () => {
  const { user, loading, logout } = useAuth()
  const { toast } = useToast()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [notifications, setNotifications] = useState({
    matches: true,
    teamInvites: true,
    teamUpdates: true,
  })

  const handleChangePassword = async () => {
    if (!newPassword || !currentPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)
      toast({
        title: "Success",
        description: "Password changed successfully",
      })
      setCurrentPassword("")
      setNewPassword("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    try {
      const { error } = await supabase.from("users").delete().eq("user_id", user?.user_id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Account deleted",
      })

      logout()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      })
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-bold">Loading...</p>
      </div>
    )
  }

  return (
    <DashboardLayout title="Settings">
      {/* Account Info */}
      <Card className="border-2 border-foreground mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5" strokeWidth={2.5} />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase text-foreground/60 mb-2">Username</p>
            <p className="text-lg font-black">{user.username}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-foreground/60 mb-2">Member Since</p>
            <p className="text-sm font-bold">
              {new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-2 border-foreground mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="size-5" strokeWidth={2.5} />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-black uppercase tracking-tight mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              className="w-full px-4 py-2 border-2 border-foreground rounded-lg font-bold"
            />
          </div>

          <div>
            <label className="block text-sm font-black uppercase tracking-tight mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className="w-full px-4 py-2 border-2 border-foreground rounded-lg font-bold"
            />
          </div>

          <Button onClick={handleChangePassword} disabled={isSaving} className="w-full gap-2">
            <Lock className="size-4" strokeWidth={2.5} />
            {isSaving ? "Saving..." : "Update Password"}
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-2 border-foreground mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="size-5" strokeWidth={2.5} />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-foreground/20"
            >
              <label className="font-bold uppercase text-sm capitalize cursor-pointer">
                {key === "matches" ? "Match Updates" : key === "teamInvites" ? "Team Invites" : "Team Updates"}
              </label>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    [key]: !value,
                  })
                }
                className={`relative inline-flex h-8 w-14 items-center rounded-full border-2 border-foreground transition-all ${
                  value ? "bg-green-600" : "bg-secondary"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    value ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-2 border-red-600 bg-red-500/5 mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground/60 mb-3">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
              onClick={handleDeleteAccount}
              variant="outline"
              className="w-full gap-2 bg-red-500/10 border-red-600 text-red-600 hover:bg-red-500/20"
            >
              <Trash2 className="size-4" strokeWidth={2.5} />
              Delete My Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Button
        onClick={logout}
        className="w-full gap-2 h-12 bg-secondary border-2 border-foreground text-foreground hover:bg-secondary/80"
      >
        <LogOut className="size-5" strokeWidth={2.5} />
        Log Out
      </Button>
    </DashboardLayout>
  )
}

export default Settings
