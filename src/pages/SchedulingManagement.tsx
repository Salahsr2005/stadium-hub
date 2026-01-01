"use client"

import type React from "react"
import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { SchedulingDashboard } from "@/components/SchedulingDashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { Calendar, Plus, Loader2 } from "lucide-react"
import { createMatchSchedule } from "@/lib/schedulingService"
import { getAllStadiums } from "@/lib/api"
import { getUserTeamMemberships } from "@/lib/api"
import { calculateTeamBalanceMetrics } from "@/lib/balanceService"
import type { MatchSchedule, TeamFormation } from "@/lib/schedulingService"

const SchedulingManagement = () => {
  const { user, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<"schedule" | "create">("schedule")
  const [userTeams, setUserTeams] = useState<any[]>([])
  const [stadiums, setStadiums] = useState<any[]>([])
  const [selectedTeam, setSelectedTeam] = useState<TeamFormation | null>(null)
  const [balanceMetrics, setBalanceMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const [formData, setFormData] = useState({
    team1Id: "",
    team2Id: "",
    matchDate: "",
    startTime: "18:00",
    stadiumId: "",
    entryFee: "500",
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.user_id) return

      try {
        setLoading(true)
        const [teams, stadiumList] = await Promise.all([getUserTeamMemberships(user.user_id), getAllStadiums()])

        setUserTeams(teams || [])
        setStadiums(stadiumList || [])

        // Set first team as default and fetch balance
        if (teams && teams.length > 0) {
          const teamId = teams[0].teams?.team_id
          if (teamId) {
            setFormData((prev) => ({ ...prev, team1Id: teamId.toString() }))
            const balance = await calculateTeamBalanceMetrics(teamId)
            setBalanceMetrics(balance)
          }
        }
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  useEffect(() => {
    const updateBalance = async () => {
      if (formData.team1Id) {
        try {
          const balance = await calculateTeamBalanceMetrics(Number.parseInt(formData.team1Id))
          setBalanceMetrics(balance)
        } catch (error) {
          console.error("[v0] Error fetching balance:", error)
        }
      }
    }

    updateBalance()
  }, [formData.team1Id])

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.matchDate || !formData.startTime || !formData.stadiumId || !formData.team1Id || !formData.team2Id) {
      alert("Please fill in all fields")
      return
    }

    try {
      setCreating(true)
      const schedule = await createMatchSchedule(
        Number.parseInt(formData.team1Id),
        Number.parseInt(formData.team2Id),
        Number.parseInt(formData.stadiumId),
        formData.matchDate,
        formData.startTime,
        Number.parseInt(formData.entryFee),
      )

      console.log("[v0] Match created successfully:", schedule)
      alert("Match created successfully!")

      // Reset form
      setFormData({
        team1Id: formData.team1Id,
        team2Id: "",
        matchDate: "",
        startTime: "18:00",
        stadiumId: "",
        entryFee: "500",
      })
      setActiveTab("schedule")
    } catch (error) {
      console.error("[v0] Error creating match:", error)
      alert("Failed to create match. Please try again.")
    } finally {
      setCreating(false)
    }
  }

  const handleScheduleMatch = (match: MatchSchedule) => {
    console.log("[v0] Scheduled match:", match)
    alert("Successfully joined the match!")
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-bold">Loading...</p>
      </div>
    )
  }

  return (
    <DashboardLayout title="Match Scheduling">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === "schedule" ? "default" : "outline"}
            onClick={() => setActiveTab("schedule")}
            className="gap-2"
          >
            <Calendar className="size-4" strokeWidth={2.5} />
            View Schedules
          </Button>
          <Button
            variant={activeTab === "create" ? "default" : "outline"}
            onClick={() => setActiveTab("create")}
            className="gap-2"
          >
            <Plus className="size-4" strokeWidth={2.5} />
            Create Match
          </Button>
        </div>

        {activeTab === "schedule" ? (
          <SchedulingDashboard onScheduleMatch={handleScheduleMatch} />
        ) : (
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle>Create New Match</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateMatch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-black uppercase mb-2">Your Team</label>
                    <select
                      value={formData.team1Id}
                      onChange={(e) => setFormData({ ...formData, team1Id: e.target.value })}
                      className="w-full p-2 border-2 border-foreground rounded-lg"
                      required
                    >
                      <option value="">Select your team</option>
                      {userTeams.map((membership: any) => (
                        <option key={membership.teams?.team_id} value={membership.teams?.team_id}>
                          {membership.teams?.team_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-black uppercase mb-2">Opponent Team</label>
                    <select
                      value={formData.team2Id}
                      onChange={(e) => setFormData({ ...formData, team2Id: e.target.value })}
                      className="w-full p-2 border-2 border-foreground rounded-lg"
                      required
                    >
                      <option value="">Select opponent team</option>
                      {userTeams.map((membership: any) => (
                        <option key={membership.teams?.team_id} value={membership.teams?.team_id}>
                          {membership.teams?.team_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-black uppercase mb-2">Stadium</label>
                    <select
                      value={formData.stadiumId}
                      onChange={(e) => setFormData({ ...formData, stadiumId: e.target.value })}
                      className="w-full p-2 border-2 border-foreground rounded-lg"
                      required
                    >
                      <option value="">Select stadium</option>
                      {stadiums.map((stadium) => (
                        <option key={stadium.stadium_id} value={stadium.stadium_id}>
                          {stadium.stadium_name} - {stadium.price_per_hour} DZD/hr
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-black uppercase mb-2">Entry Fee (DZD)</label>
                    <Input
                      type="number"
                      value={formData.entryFee}
                      onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                      className="border-2 border-foreground"
                      required
                      min="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black uppercase mb-2">Match Date</label>
                    <Input
                      type="date"
                      value={formData.matchDate}
                      onChange={(e) => setFormData({ ...formData, matchDate: e.target.value })}
                      className="border-2 border-foreground"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black uppercase mb-2">Start Time</label>
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="border-2 border-foreground"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={creating}>
                  {creating ? (
                    <>
                      <Loader2 className="size-4 animate-spin" strokeWidth={2.5} />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" strokeWidth={2.5} />
                      Create Match
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Team Balance Analysis */}
        {activeTab === "create" && balanceMetrics && (
          <div className="mt-8">
            <h3 className="text-xl font-black uppercase mb-4">Team Balance Analysis</h3>
            <Card className="border-2 border-foreground">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 bg-secondary/30 rounded border border-foreground/20">
                    <p className="text-xs font-bold uppercase text-foreground/60">Team Name</p>
                    <p className="text-lg font-black">{balanceMetrics.team_name}</p>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded border border-foreground/20">
                    <p className="text-xs font-bold uppercase text-foreground/60">Players</p>
                    <p className="text-lg font-black">{balanceMetrics.player_count}/11</p>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded border border-foreground/20">
                    <p className="text-xs font-bold uppercase text-foreground/60">Balance Score</p>
                    <p className="text-lg font-black text-green-600">{balanceMetrics.overall_balance_score}/100</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-secondary/30 rounded text-center">
                    <p className="text-xs font-bold uppercase text-foreground/60">Avg Skill</p>
                    <p className="font-black">{balanceMetrics.avg_skill?.toFixed(1)}</p>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded text-center">
                    <p className="text-xs font-bold uppercase text-foreground/60">Skill Variance</p>
                    <p className="font-black">{balanceMetrics.skill_variance?.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded text-center">
                    <p className="text-xs font-bold uppercase text-foreground/60">Position Balance</p>
                    <p className="font-black">{balanceMetrics.position_balance?.toFixed(0)}%</p>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded text-center">
                    <p className="text-xs font-bold uppercase text-foreground/60">Avg Age</p>
                    <p className="font-black">{balanceMetrics.avg_age?.toFixed(1)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default SchedulingManagement
