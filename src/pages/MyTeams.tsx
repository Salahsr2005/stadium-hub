"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Users, Trophy, Calendar, MapPin, Trash2, CheckCircle, Clock } from "lucide-react"
import DashboardLayout from "@/components/DashboardLayout"

const MyTeams = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [teams, setTeams] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const fetchTeams = async () => {
      if (!user?.user_id) return

      try {
        const { data, error } = await supabase
          .from("team_members")
          .select(
            `
            id,
            assigned_position,
            has_paid,
            teams (
              team_id,
              team_name,
              status,
              avg_skill,
              avg_age,
              player_count,
              stadiums (
                stadium_name,
                location,
                capacity
              ),
              schedules (
                match_date,
                start_time
              )
            )
          `,
          )
          .eq("user_id", user.user_id)
          .order("teams(schedules->match_date)", { ascending: true })

        if (error) throw error
        setTeams(data || [])
      } catch (error) {
        console.error("[v0] Error fetching teams:", error)
        toast({
          title: "Error",
          description: "Failed to load teams",
          variant: "destructive",
        })
      } finally {
        setDataLoading(false)
      }
    }

    fetchTeams()
  }, [user, toast])

  const handleLeaveTeam = async (teamId: number, membershipId: number) => {
    try {
      const { error } = await supabase.from("team_members").delete().eq("id", membershipId)

      if (error) throw error

      setTeams(teams.filter((t) => t.teams.team_id !== teamId))
      toast({
        title: "Success",
        description: "You left the team",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave team",
        variant: "destructive",
      })
    }
  }

  const handlePayEntry = async (teamId: number, membershipId: number) => {
    try {
      const { error: payError } = await supabase.from("team_members").update({ has_paid: true }).eq("id", membershipId)

      if (payError) throw payError

      // Deduct from wallet
      const { error: walletError } = await supabase.rpc("deduct_wallet", {
        p_user_id: user?.user_id,
        p_amount: 50,
      })

      if (!walletError) {
        setTeams(teams.map((t) => (t.teams.team_id === teamId ? { ...t, has_paid: true } : t)))
        toast({
          title: "Success",
          description: "Entry fee paid successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-bold">Loading...</p>
      </div>
    )
  }

  return (
    <DashboardLayout title="My Teams">
      {dataLoading ? (
        <p className="text-center text-foreground/60">Loading teams...</p>
      ) : teams.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teams.map((membership) => (
            <Card
              key={membership.id}
              className="border-2 border-foreground shadow-neo-lg hover:shadow-neo-xl transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{membership.teams.team_name}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={membership.teams.status === "full" ? "primary" : "default"}>
                        {membership.teams.status}
                      </Badge>
                      <Badge variant="outline">Position: {membership.assigned_position}</Badge>
                      {membership.has_paid ? (
                        <Badge variant="default" className="bg-green-600 text-white">
                          <CheckCircle className="size-3 mr-1" strokeWidth={2.5} />
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-orange-500 text-orange-600">
                          <Clock className="size-3 mr-1" strokeWidth={2.5} />
                          Payment Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 border-t-2 border-foreground pt-4">
                {/* Stadium Info */}
                {membership.teams.stadiums && (
                  <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                    <MapPin className="size-5 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <div className="flex-1">
                      <p className="font-black text-sm uppercase">{membership.teams.stadiums.stadium_name}</p>
                      <p className="text-xs text-foreground/60">{membership.teams.stadiums.location}</p>
                      <p className="text-xs text-foreground/60 mt-1">Capacity: {membership.teams.stadiums.capacity}</p>
                    </div>
                  </div>
                )}

                {/* Match Schedule */}
                {membership.teams.schedules && (
                  <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                    <Calendar className="size-5 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <div className="flex-1">
                      <p className="font-black text-sm uppercase">
                        {new Date(membership.teams.schedules.match_date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-foreground/60">{membership.teams.schedules.start_time}</p>
                    </div>
                  </div>
                )}

                {/* Team Stats */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-foreground/20">
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase text-foreground/60">Players</p>
                    <p className="text-xl font-black flex items-center justify-center gap-1">
                      <Users className="size-4" strokeWidth={2.5} />
                      {membership.teams.player_count}/11
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase text-foreground/60">Avg Skill</p>
                    <p className="text-xl font-black flex items-center justify-center gap-1">
                      <Trophy className="size-4" strokeWidth={2.5} />
                      {membership.teams.avg_skill?.toFixed(1)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase text-foreground/60">Avg Age</p>
                    <p className="text-xl font-black">{membership.teams.avg_age?.toFixed(1)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  {!membership.has_paid && (
                    <Button
                      onClick={() => handlePayEntry(membership.teams.team_id, membership.id)}
                      className="flex-1 gap-2"
                    >
                      <CheckCircle className="size-4" strokeWidth={2.5} />
                      Pay Entry Fee (50 DZD)
                    </Button>
                  )}
                  <Button
                    onClick={() => handleLeaveTeam(membership.teams.team_id, membership.id)}
                    variant="outline"
                    className="flex-1 gap-2 bg-transparent hover:bg-red-500/10"
                  >
                    <Trash2 className="size-4" strokeWidth={2.5} />
                    Leave Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-foreground">
          <CardContent className="p-12 text-center">
            <Users className="size-12 mx-auto mb-4 text-foreground/40" strokeWidth={1.5} />
            <p className="text-lg font-black mb-4">No Teams Yet</p>
            <p className="text-foreground/60 mb-6">Join a team to get started playing football matches</p>
            <Button onClick={() => navigate("/dashboard/browse")} className="gap-2">
              <Users className="size-4" strokeWidth={2.5} />
              Find Teams
            </Button>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}

export default MyTeams
