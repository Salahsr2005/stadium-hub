"use client"

// Scheduling Management Component
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Zap } from "lucide-react"
import { getScheduledMatches } from "@/lib/schedulingService"
import type { MatchSchedule } from "@/lib/schedulingService"

interface SchedulingDashboardProps {
  teamId?: number
  stadiumId?: number
  onScheduleMatch?: (schedule: MatchSchedule) => void
}

export const SchedulingDashboard = ({ teamId, stadiumId, onScheduleMatch }: SchedulingDashboardProps) => {
  const [matches, setMatches] = useState<MatchSchedule[]>([])
  const [selectedFilter, setSelectedFilter] = useState<"all" | "upcoming" | "completed">("upcoming")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        const allMatches = getScheduledMatches({
          status: selectedFilter === "all" ? undefined : selectedFilter === "upcoming" ? "scheduled" : "completed",
          stadiumId: stadiumId,
        })
        setMatches(allMatches)
      } catch (error) {
        console.error("[v0] Error fetching matches:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [selectedFilter, stadiumId])

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-2">
        {(["all", "upcoming", "completed"] as const).map((filter) => (
          <Button
            key={filter}
            variant={selectedFilter === filter ? "default" : "outline"}
            onClick={() => setSelectedFilter(filter)}
            className="capitalize"
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Matches Grid */}
      {loading ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-foreground/60">Loading matches...</p>
          </CardContent>
        </Card>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => (
            <Card key={match.schedule_id} className="border-2 border-foreground">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">Match {match.schedule_id}</CardTitle>
                  </div>
                  <Badge variant={match.status === "scheduled" ? "default" : "primary"}>{match.status}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Date & Time */}
                <div className="flex items-center gap-3 p-2 bg-secondary/30 rounded">
                  <Calendar className="size-4" strokeWidth={2.5} />
                  <span className="font-bold text-sm">{new Date(match.match_date).toLocaleDateString()}</span>
                  <Clock className="size-4" strokeWidth={2.5} />
                  <span className="font-bold text-sm">{match.start_time}</span>
                </div>

                {/* Prize Info */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-secondary/30 rounded text-center">
                    <p className="text-xs font-bold uppercase text-foreground/60">Entry Fee</p>
                    <p className="font-black">{match.entry_fee} DZD</p>
                  </div>
                  <div className="p-2 bg-secondary/30 rounded text-center">
                    <p className="text-xs font-bold uppercase text-foreground/60">Prize Pool</p>
                    <p className="font-black">{match.total_prize_pool} DZD</p>
                  </div>
                </div>

                {match.status === "scheduled" && (
                  <Button onClick={() => onScheduleMatch?.(match)} className="w-full gap-2">
                    <Zap className="size-4" strokeWidth={2.5} />
                    Join Match
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-foreground">
          <CardContent className="p-8 text-center">
            <Calendar className="size-12 mx-auto mb-4 text-foreground/40" strokeWidth={1.5} />
            <p className="text-lg font-black mb-2">No Matches Found</p>
            <p className="text-foreground/60">Check back later for scheduled matches</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
