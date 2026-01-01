"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/DashboardLayout"
import {
  LayoutDashboard,
  Calendar,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Wallet,
  Trophy,
  Users,
  MapPin,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { getUserStats, getUserTeamMemberships, getUserMatchHistory, getUserTransactions } from "@/lib/api"
import { StadiumsList } from "@/components/StadiumsList"
import { SchedulingDashboard } from "@/components/SchedulingDashboard"
import { Button } from "@/components/ui/button"

const Dashboard = () => {
  const { user, loading } = useAuth()

  const [stats, setStats] = useState<any>(null)
  const [teams, setTeams] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "stadiums" | "scheduling">("overview")

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.user_id) return

      try {
        setDataLoading(true)
        const [userStats, userTeams, , userTransactions] = await Promise.all([
          getUserStats(user.user_id),
          getUserTeamMemberships(user.user_id),
          getUserMatchHistory(user.user_id),
          getUserTransactions(user.user_id),
        ])

        setStats(userStats)
        setTeams(userTeams || [])
        setTransactions(userTransactions || [])
      } catch (error) {
        console.error("[v0] Error fetching user data:", error)
      } finally {
        setDataLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  const dashboardStats = [
    {
      label: "Current Level",
      value: stats?.current_level || "0",
      trend: "+0.5",
      up: true,
      icon: Trophy,
    },
    {
      label: "Matches Played",
      value: stats?.matches_played || "0",
      trend: "This season",
      up: true,
      icon: Calendar,
    },
    {
      label: "Active Teams",
      value: teams.length,
      trend: `+${teams.length > 0 ? 1 : 0} new`,
      up: true,
      icon: Users,
    },
    {
      label: "Wallet Balance",
      value: `${stats?.wallet_balance || 0} DZD`,
      trend: `+${transactions.length} transactions`,
      up: true,
      icon: Wallet,
    },
  ]

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-bold">Loading...</p>
      </div>
    )
  }

  return (
    <DashboardLayout title={`Welcome Back, ${user.username}`}>
      <div className="space-y-6">
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
            className="gap-2"
          >
            <LayoutDashboard className="size-4" strokeWidth={2.5} />
            Overview
          </Button>
          <Button
            variant={activeTab === "stadiums" ? "default" : "outline"}
            onClick={() => setActiveTab("stadiums")}
            className="gap-2"
          >
            <MapPin className="size-4" strokeWidth={2.5} />
            Nearby Stadiums
          </Button>
          <Button
            variant={activeTab === "scheduling" ? "default" : "outline"}
            onClick={() => setActiveTab("scheduling")}
            className="gap-2"
          >
            <Calendar className="size-4" strokeWidth={2.5} />
            Scheduling
          </Button>
        </div>

        {activeTab === "overview" ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardStats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs lg:text-sm font-black uppercase tracking-tight text-foreground/60 mb-1">
                          {stat.label}
                        </p>
                        <p className="text-2xl lg:text-4xl font-black">{dataLoading ? "-" : stat.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {stat.up ? (
                            <TrendingUp className="size-4 text-green-600" strokeWidth={2.5} />
                          ) : (
                            <TrendingDown className="size-4 text-red-600" strokeWidth={2.5} />
                          )}
                          <span className="text-xs font-bold text-foreground/60">{stat.trend}</span>
                        </div>
                      </div>
                      <div className="p-2 lg:p-3 bg-secondary rounded-lg border-2 border-foreground">
                        <stat.icon className="size-5 lg:size-6" strokeWidth={2.5} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/dashboard/stadiums"
                className="hover:shadow-neo-xl cursor-pointer group col-span-1 md:col-span-2"
              >
                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-primary rounded-lg border-2 border-foreground">
                      <MapPin className="size-6 text-primary-foreground" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black uppercase text-sm">Browse & Book Stadiums</h3>
                      <p className="text-xs font-medium text-foreground/60">Find available venues near you</p>
                    </div>
                    <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                  </CardContent>
                </Card>
              </Link>
              <Link to="/dashboard/browse" className="hover:shadow-neo-xl cursor-pointer group">
                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-secondary rounded-lg border-2 border-foreground">
                      <Users className="size-6" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black uppercase text-sm">Find Matches</h3>
                      <p className="text-xs font-medium text-foreground/60">Join a team</p>
                    </div>
                    <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                  </CardContent>
                </Card>
              </Link>
            </div>

            <Card className="border-2 border-foreground">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl lg:text-2xl flex items-center gap-2">
                    <MapPin className="size-5" strokeWidth={2.5} />
                    Featured Stadiums Near You
                  </CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/dashboard/stadiums">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <StadiumsList userLatitude={stats?.latitude} userLongitude={stats?.longitude} />
              </CardContent>
            </Card>

            {teams.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl lg:text-2xl">Your Active Teams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teams.slice(0, 3).map((membership: any) => (
                      <div
                        key={membership.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-secondary/50 rounded-lg border-2 border-foreground hover:bg-secondary transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-black uppercase">{membership.teams?.team_name}</h4>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm font-medium text-foreground/70">
                            <span className="flex items-center gap-1">
                              <Users className="size-4" strokeWidth={2.5} />
                              {membership.teams?.player_count} players
                            </span>
                            <span className="flex items-center gap-1">
                              <Trophy className="size-4" strokeWidth={2.5} />
                              Skill: {membership.teams?.avg_skill?.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={membership.teams?.status === "full" ? "primary" : "default"}>
                            {membership.teams?.status}
                          </Badge>
                          <span className="font-black text-sm">{membership.assigned_position}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl lg:text-2xl">Recent Transactions</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dataLoading ? (
                    <p className="text-center text-foreground/60">Loading transactions...</p>
                  ) : transactions.length > 0 ? (
                    transactions.map((transaction: any) => (
                      <div
                        key={transaction.transaction_id}
                        className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-foreground/20"
                      >
                        <div className="flex-1">
                          <p className="font-black uppercase text-sm">{transaction.type}</p>
                          <p className="text-xs text-foreground/60">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="font-black text-lg">{transaction.amount} DZD</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-foreground/60">No transactions yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        ) : activeTab === "stadiums" ? (
          <StadiumsList userLatitude={stats?.latitude} userLongitude={stats?.longitude} />
        ) : (
          <SchedulingDashboard />
        )}
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
