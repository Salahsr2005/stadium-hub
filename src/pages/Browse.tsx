"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Users, Trophy, Calendar, MapPin, Plus, Zap } from "lucide-react"
import DashboardLayout from "@/components/DashboardLayout"

const Browse = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [teams, setTeams] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("skill")

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        let query = supabase.from("teams").select(`
          team_id,
          team_name,
          status,
          avg_skill,
          avg_age,
          player_count,
          stadiums (
            stadium_id,
            stadium_name,
            location
          ),
          schedules (
            match_date,
            start_time
          )
        `)

        if (filterStatus !== "all") {
          query = query.eq("status", filterStatus)
        }

        const { data, error } = await query

        if (error) throw error

        const sortedData = data || []
        if (sortBy === "skill") {
          sortedData.sort((a, b) => (b.avg_skill || 0) - (a.avg_skill || 0))
        } else if (sortBy === "open") {
          sortedData.sort((a, b) => (a.player_count || 0) - (b.player_count || 0))
        }

        setTeams(sortedData)
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
  }, [filterStatus, sortBy, toast])

  const handleJoinTeam = async (teamId: number) => {
    if (!user?.user_id) return

    try {
      // Check if already a member
      const { data: existing } = await supabase
        .from("team_members")
        .select("id")
        .eq("team_id", teamId)
        .eq("user_id", user.user_id)
        .single()

      if (existing) {
        toast({
          title: "Error",
          description: "You are already in this team",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("team_members").insert({
        team_id: teamId,
        user_id: user.user_id,
        assigned_position: user.positions?.[0] || "MID",
        has_paid: false,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "You joined the team! Please pay the entry fee.",
      })

      // Refresh teams
      const { data } = await supabase.from("teams").select("*")
      setTeams(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join team",
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
    <DashboardLayout title="Browse Teams">
      {/* Filters */}
      <Card className="border-2 border-foreground mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-black uppercase mb-2">Filter by Status</label>
              <div className="flex gap-2 flex-wrap">
                {["all", "need player", "full"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`py-2 px-4 rounded-lg border-2 font-bold uppercase text-sm transition-all ${
                      filterStatus === status
                        ? "bg-primary text-primary-foreground border-foreground"
                        : "bg-secondary border-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-black uppercase mb-2">Sort By</label>
              <div className="flex gap-2 flex-wrap">
                {["skill", "open"].map((sort) => (
                  <button
                    key={sort}
                    onClick={() => setSortBy(sort)}
                    className={`py-2 px-4 rounded-lg border-2 font-bold uppercase text-sm transition-all ${
                      sortBy === sort
                        ? "bg-primary text-primary-foreground border-foreground"
                        : "bg-secondary border-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {sort === "skill" ? "Highest Skill" : "Most Open Spots"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teams Grid */}
      {dataLoading ? (
        <p className="text-center text-foreground/60">Loading teams...</p>
      ) : teams.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teams.map((team) => (
            <Card
              key={team.team_id}
              className="border-2 border-foreground shadow-neo-lg hover:shadow-neo-xl transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{team.team_name}</CardTitle>
                    <Badge variant={team.status === "full" ? "primary" : "default"}>{team.status}</Badge>
                  </div>
                  {team.status === "need player" && <Zap className="size-5 text-yellow-500" strokeWidth={2.5} />}
                </div>
              </CardHeader>

              <CardContent className="space-y-4 border-t-2 border-foreground pt-4">
                {/* Stadium Info */}
                {team.stadiums && (
                  <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                    <MapPin className="size-5 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <div className="flex-1">
                      <p className="font-black text-sm uppercase">{team.stadiums.stadium_name}</p>
                      <p className="text-xs text-foreground/60">{team.stadiums.location}</p>
                    </div>
                  </div>
                )}

                {/* Match Date */}
                {team.schedules && (
                  <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                    <Calendar className="size-5 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <div className="flex-1">
                      <p className="font-black text-sm uppercase">
                        {new Date(team.schedules.match_date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-foreground/60">{team.schedules.start_time}</p>
                    </div>
                  </div>
                )}

                {/* Team Stats */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-foreground/20">
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase text-foreground/60">Players</p>
                    <p className="text-xl font-black">{team.player_count}/11</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase text-foreground/60">Avg Skill</p>
                    <p className="text-xl font-black flex items-center justify-center gap-1">
                      <Trophy className="size-4" strokeWidth={2.5} />
                      {team.avg_skill?.toFixed(1)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase text-foreground/60">Avg Age</p>
                    <p className="text-xl font-black">{team.avg_age?.toFixed(1)}</p>
                  </div>
                </div>

                {/* Join Button */}
                {team.status === "need player" && (
                  <Button onClick={() => handleJoinTeam(team.team_id)} className="w-full gap-2">
                    <Plus className="size-4" strokeWidth={2.5} />
                    Join Team
                  </Button>
                )}

                {team.status === "full" && (
                  <div className="w-full py-2 px-4 bg-secondary/50 rounded-lg border-2 border-foreground text-center font-black text-sm uppercase">
                    Team is Full
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-foreground">
          <CardContent className="p-12 text-center">
            <Users className="size-12 mx-auto mb-4 text-foreground/40" strokeWidth={1.5} />
            <p className="text-lg font-black mb-4">No Teams Available</p>
            <p className="text-foreground/60">Check back later for new teams</p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}

export default Browse
