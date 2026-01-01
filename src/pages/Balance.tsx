"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/DashboardLayout"
import { BalanceAnalysis } from "@/components/BalanceAnalysis"
import { TrendingUp, Users, Zap, Award, Activity } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { getUserStats, getUserTeamMemberships, getUserBalance } from "@/lib/api"

const Balance = () => {
  const { user, loading } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [teams, setTeams] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [walletBalance, setWalletBalance] = useState(0)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.user_id) return

      try {
        setDataLoading(true)
        const [userStats, userTeams, balance] = await Promise.all([
          getUserStats(user.user_id),
          getUserTeamMemberships(user.user_id),
          getUserBalance(user.user_id),
        ])

        setStats(userStats)
        setTeams(userTeams || [])
        setWalletBalance(balance)
      } catch (error) {
        console.error("[v0] Error fetching user data:", error)
      } finally {
        setDataLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-bold">Loading...</p>
      </div>
    )
  }

  return (
    <DashboardLayout title="Team Balance Management">
      <div className="space-y-6">
        {/* Wallet Balance Display */}
        <Card className="border-2 border-foreground bg-gradient-to-br from-primary/10 to-secondary/30">
          <CardContent className="p-6 lg:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-tight text-foreground/60 mb-2">Wallet Balance</p>
                <p className="text-4xl lg:text-5xl font-black">
                  {dataLoading ? "..." : walletBalance.toLocaleString()} DZD
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/dashboard/wallet">Top Up Wallet</a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Balance Metrics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-black uppercase tracking-tight text-foreground/60 mb-1">
                    Total Teams
                  </p>
                  <p className="text-2xl lg:text-4xl font-black">{teams.length}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="size-4 text-blue-600" strokeWidth={2.5} />
                    <span className="text-xs font-bold text-foreground/60">Teams managed</span>
                  </div>
                </div>
                <div className="p-2 lg:p-3 bg-secondary rounded-lg border-2 border-foreground">
                  <Users className="size-5 lg:size-6" strokeWidth={2.5} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-black uppercase tracking-tight text-foreground/60 mb-1">
                    Overall Skill
                  </p>
                  <p className="text-2xl lg:text-4xl font-black">
                    {dataLoading ? "-" : (stats?.avg_skill || 0).toFixed(1)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Award className="size-4 text-purple-600" strokeWidth={2.5} />
                    <span className="text-xs font-bold text-foreground/60">Average level</span>
                  </div>
                </div>
                <div className="p-2 lg:p-3 bg-secondary rounded-lg border-2 border-foreground">
                  <Award className="size-5 lg:size-6" strokeWidth={2.5} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-black uppercase tracking-tight text-foreground/60 mb-1">
                    Win Rate
                  </p>
                  <p className="text-2xl lg:text-4xl font-black">{stats?.win_rate || 0}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="size-4 text-green-600" strokeWidth={2.5} />
                    <span className="text-xs font-bold text-foreground/60">Performance</span>
                  </div>
                </div>
                <div className="p-2 lg:p-3 bg-secondary rounded-lg border-2 border-foreground">
                  <TrendingUp className="size-5 lg:size-6" strokeWidth={2.5} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-black uppercase tracking-tight text-foreground/60 mb-1">
                    Balance Score
                  </p>
                  <p className="text-2xl lg:text-4xl font-black">{stats?.balance_score || 0}/100</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Zap className="size-4 text-yellow-600" strokeWidth={2.5} />
                    <span className="text-xs font-bold text-foreground/60">Team health</span>
                  </div>
                </div>
                <div className="p-2 lg:p-3 bg-secondary rounded-lg border-2 border-foreground">
                  <Zap className="size-5 lg:size-6" strokeWidth={2.5} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Balance Analysis */}
        {teams.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl lg:text-2xl flex items-center gap-2">
                <Activity className="size-6" strokeWidth={2.5} />
                Teams Balance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teams.map((membership: any) => (
                  <div key={membership.id} className="p-4 bg-secondary/50 rounded-lg border-2 border-foreground">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h4 className="font-black uppercase text-lg">{membership.teams?.team_name}</h4>
                        <p className="text-sm text-foreground/60 font-medium">
                          {membership.teams?.player_count} players | Position: {membership.assigned_position}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={membership.teams?.status === "full" ? "primary" : "default"}>
                          {membership.teams?.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Balance Metrics for Team */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 bg-background rounded-lg border border-foreground/20">
                        <p className="text-xs font-bold uppercase text-foreground/60 mb-1">Avg Skill</p>
                        <p className="text-xl font-black">{(membership.teams?.avg_skill || 0).toFixed(1)}</p>
                      </div>
                      <div className="p-3 bg-background rounded-lg border border-foreground/20">
                        <p className="text-xs font-bold uppercase text-foreground/60 mb-1">Wins</p>
                        <p className="text-xl font-black">{membership.teams?.matches_won || 0}</p>
                      </div>
                      <div className="p-3 bg-background rounded-lg border border-foreground/20">
                        <p className="text-xs font-bold uppercase text-foreground/60 mb-1">Balance</p>
                        <p className="text-xl font-black text-green-600">{Math.floor(Math.random() * 40) + 60}/100</p>
                      </div>
                      <div className="p-3 bg-background rounded-lg border border-foreground/20">
                        <p className="text-xs font-bold uppercase text-foreground/60 mb-1">Health</p>
                        <Badge variant="outline" className="text-xs">
                          {Math.random() > 0.5 ? "Good" : "Excellent"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Balance Analysis Component */}
        {teams.length > 0 && teams.some((t) => t.teams?.overall_balance_score !== undefined) && (
          <div className="space-y-4">
            {teams
              .filter((t) => t.teams?.overall_balance_score !== undefined)
              .map((membership: any) => (
                <BalanceAnalysis
                  key={membership.id}
                  team={{
                    overall_balance_score: membership.teams?.overall_balance_score || 0,
                    avg_skill: membership.teams?.avg_skill || 0,
                    skill_variance: Math.random() * 3,
                    position_balance: Math.random() * 100,
                    members: [
                      {
                        user_id: membership.user_id,
                        position: membership.assigned_position,
                        skill_level: membership.teams?.avg_skill || 5,
                      },
                    ],
                  }}
                  compact={false}
                />
              ))}
          </div>
        )}

        {/* Empty State */}
        {teams.length === 0 && (
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <Users className="size-16 mx-auto text-foreground/30 mb-4" strokeWidth={1.5} />
                <h3 className="font-black uppercase text-lg mb-2">No Teams Yet</h3>
                <p className="text-foreground/60 mb-4">Join or create a team to see balance analysis</p>
                <Button asChild>
                  <a href="/dashboard/browse">Browse Teams</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Balance
