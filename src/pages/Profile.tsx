"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Trophy, Users, Calendar, MapPin, Edit2, Check, X, Target, TrendingUp, Zap, Activity } from "lucide-react"
import DashboardLayout from "@/components/DashboardLayout"

const Profile = () => {
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [teams, setTeams] = useState<any[]>([])
  const [recentMatches, setRecentMatches] = useState<any[]>([])

  const [formData, setFormData] = useState({
    age: 0,
    positions: [] as string[],
    current_level: 0,
  })

  const positions = ["GK", "DEF", "MID", "FWD"]

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || !user.user_id) return

      try {
        // Get user stats
        const { data: statsData } = await supabase.from("users").select("*").eq("user_id", user.user_id).single()

        setStats(statsData)
        setFormData({
          age: statsData?.age || 0,
          positions: statsData?.positions || [],
          current_level: statsData?.current_level || 0,
        })

        // Get user teams
        const { data: teamsData } = await supabase
          .from("team_members")
          .select(
            `
            id,
            assigned_position,
            teams (
              team_id,
              team_name,
              status,
              avg_skill
            )
          `,
          )
          .eq("user_id", user.user_id)
          .limit(5)

        setTeams(teamsData || [])

        // Get recent matches
        const { data: matchesData } = await supabase
          .from("matches")
          .select(
            `
            match_id,
            status,
            entry_fee,
            total_prize_pool,
            winner_team_id,
            team1: teams!team1_id (team_name),
            team2: teams!team2_id (team_name),
            schedules (match_date)
          `,
          )
          .order("schedules->match_date", { ascending: false })
          .limit(5)

        setRecentMatches(matchesData || [])
      } catch (error) {
        console.error("[v0] Error fetching profile:", error)
      }
    }

    fetchProfileData()
  }, [user])

  const handleSaveProfile = async () => {
    if (!user?.user_id) return

    try {
      setIsSaving(true)
      const { error } = await supabase
        .from("users")
        .update({
          age: formData.age,
          positions: formData.positions,
          current_level: formData.current_level,
        })
        .eq("user_id", user.user_id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      setIsEditing(false)

      // Refresh stats
      const { data: updatedStats } = await supabase.from("users").select("*").eq("user_id", user.user_id).single()
      setStats(updatedStats)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const togglePosition = (pos: string) => {
    setFormData({
      ...formData,
      positions: formData.positions.includes(pos)
        ? formData.positions.filter((p) => p !== pos)
        : [...formData.positions, pos],
    })
  }

  if (loading || !user || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-bold">Loading...</p>
      </div>
    )
  }

  return (
    <DashboardLayout title="User Profile">
      {/* Profile Header Card */}
      <Card className="border-2 border-foreground shadow-neo-xl mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-primary border-4 border-foreground rounded-full flex items-center justify-center shadow-neo">
                <span className="text-primary-foreground font-black text-3xl">
                  {user.username.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase">{user.username}</h2>
                <p className="text-foreground/60 font-medium">Level {stats.current_level} Player</p>
                {stats.latitude && stats.longitude && (
                  <p className="text-xs font-medium text-foreground/60 mt-1 flex items-center gap-1">
                    <MapPin className="size-3" strokeWidth={2.5} />
                    {stats.latitude.toFixed(2)}, {stats.longitude.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
              disabled={isSaving}
              className="gap-2"
            >
              {isEditing ? (
                <>
                  <Check className="size-4" strokeWidth={2.5} />
                  Save Profile
                </>
              ) : (
                <>
                  <Edit2 className="size-4" strokeWidth={2.5} />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        {isEditing && (
          <CardContent className="space-y-4 border-t-2 border-foreground pt-4">
            <div>
              <label className="block text-sm font-black uppercase tracking-tight mb-2">Age</label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                min={10}
                max={100}
              />
            </div>

            <div>
              <label className="block text-sm font-black uppercase tracking-tight mb-2">Current Level</label>
              <div className="flex items-center gap-2">
                <Input
                  type="range"
                  value={formData.current_level}
                  onChange={(e) => setFormData({ ...formData, current_level: Number(e.target.value) })}
                  min={1}
                  max={10}
                  className="flex-1"
                />
                <span className="font-bold w-8">{formData.current_level}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-black uppercase tracking-tight mb-2">Playing Positions</label>
              <div className="grid grid-cols-2 gap-2">
                {positions.map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => togglePosition(pos)}
                    className={`py-2 px-3 rounded-lg border-2 font-bold uppercase text-sm transition-all ${
                      formData.positions.includes(pos)
                        ? "bg-primary text-primary-foreground border-foreground"
                        : "bg-secondary border-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveProfile} disabled={isSaving} className="flex-1 gap-2">
                <Check className="size-4" strokeWidth={2.5} />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1 gap-2 bg-transparent">
                <X className="size-4" strokeWidth={2.5} />
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="size-5 text-yellow-500" strokeWidth={2.5} />
              <span className="text-2xl font-black">{stats.current_level}</span>
            </div>
            <p className="text-xs font-bold uppercase text-foreground/60">Current Level</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="size-5 text-green-600" strokeWidth={2.5} />
              <span className="text-2xl font-black">{stats.matches_played}</span>
            </div>
            <p className="text-xs font-bold uppercase text-foreground/60">Matches Played</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="size-5 text-blue-600" strokeWidth={2.5} />
              <span className="text-2xl font-black">{teams.length}</span>
            </div>
            <p className="text-xs font-bold uppercase text-foreground/60">Active Teams</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-2">
              <Zap className="size-5 text-orange-500" strokeWidth={2.5} />
              <span className="text-2xl font-black">{stats.wallet_balance} DZD</span>
            </div>
            <p className="text-xs font-bold uppercase text-foreground/60">Wallet Balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Player Info */}
      <Card className="border-2 border-foreground mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="size-5" strokeWidth={2.5} />
            Player Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-bold uppercase text-foreground/60 mb-2">Playing Positions</p>
            <div className="flex flex-wrap gap-2">
              {stats.positions && stats.positions.length > 0 ? (
                stats.positions.map((pos: string) => (
                  <Badge key={pos} variant="default">
                    {pos}
                  </Badge>
                ))
              ) : (
                <p className="text-foreground/60">No positions selected</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-foreground">
            <div>
              <p className="text-sm font-bold uppercase text-foreground/60 mb-1">Age</p>
              <p className="text-2xl font-black">{stats.age}</p>
            </div>
            <div>
              <p className="text-sm font-bold uppercase text-foreground/60 mb-1">Initial Level</p>
              <p className="text-2xl font-black">{stats.initial_level}</p>
            </div>
            <div>
              <p className="text-sm font-bold uppercase text-foreground/60 mb-1">Join Date</p>
              <p className="text-sm font-bold">
                {new Date(stats.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Teams */}
      {teams.length > 0 && (
        <Card className="border-2 border-foreground mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" strokeWidth={2.5} />
              Your Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teams.map((membership) => (
                <div
                  key={membership.id}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border-2 border-foreground hover:bg-secondary transition-colors"
                >
                  <div>
                    <h4 className="font-black uppercase">{membership.teams?.team_name}</h4>
                    <p className="text-xs font-medium text-foreground/60 mt-1">
                      Position: <span className="font-bold">{membership.assigned_position}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={membership.teams?.status === "full" ? "primary" : "default"}>
                      {membership.teams?.status}
                    </Badge>
                    <p className="text-xs font-medium text-foreground/60 mt-2">
                      Avg Skill: {membership.teams?.avg_skill?.toFixed(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Matches */}
      {recentMatches.length > 0 && (
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5" strokeWidth={2.5} />
              Recent Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMatches.map((match) => (
                <div
                  key={match.match_id}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-foreground/20"
                >
                  <div>
                    <p className="font-black uppercase text-sm">
                      {match.team1?.team_name} vs {match.team2?.team_name}
                    </p>
                    <p className="text-xs font-medium text-foreground/60 mt-1">
                      <Calendar className="inline size-3 mr-1" strokeWidth={2.5} />
                      {new Date(match.schedules?.match_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={match.status === "completed" ? "default" : "primary"}>{match.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}

export default Profile
