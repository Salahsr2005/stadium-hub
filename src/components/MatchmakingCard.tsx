"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Users, Zap, Target, AlertCircle } from "lucide-react"

interface MatchmakingCardProps {
  team: {
    team_id: number
    team_name: string
    player_count: number
    avg_skill: number
    avg_age: number
    required_positions: string[]
    compatibility_score: number
    skill_match: number
    position_match: number
    position_gap: string[]
  }
  onJoin: (teamId: number, position: string) => void
  loading?: boolean
}

export const MatchmakingCard = ({ team, onJoin, loading }: MatchmakingCardProps) => {
  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-300"
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-300"
    return "bg-orange-100 text-orange-800 border-orange-300"
  }

  const getCompatibilityLabel = (score: number) => {
    if (score >= 80) return "Excellent Match"
    if (score >= 60) return "Good Match"
    return "Possible Match"
  }

  return (
    <Card className="hover:shadow-neo-xl transition-all border-2 border-foreground group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary">{team.team_name}</CardTitle>
            <p className="text-xs font-medium text-foreground/60 mt-1">
              Avg. Skill: {team.avg_skill.toFixed(1)} | Avg. Age: {team.avg_age.toFixed(0)}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full border text-sm font-black ${getCompatibilityColor(team.compatibility_score)}`}
          >
            {team.compatibility_score}%
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Compatibility Label */}
        <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg border border-primary/20">
          <Zap className="size-4 text-primary" strokeWidth={2.5} />
          <span className="text-sm font-bold">{getCompatibilityLabel(team.compatibility_score)}</span>
        </div>

        {/* Match Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded border border-foreground/20">
            <Trophy className="size-4 text-yellow-500" strokeWidth={2.5} />
            <div>
              <p className="text-xs text-foreground/60">Skill</p>
              <p className="font-bold">{team.skill_match}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded border border-foreground/20">
            <Target className="size-4 text-primary" strokeWidth={2.5} />
            <div>
              <p className="text-xs text-foreground/60">Position</p>
              <p className="font-bold">{team.position_match}%</p>
            </div>
          </div>
          <div className="col-span-2 flex items-center gap-2 p-2 bg-secondary/30 rounded border border-foreground/20">
            <Users className="size-4 text-primary" strokeWidth={2.5} />
            <div className="flex-1">
              <p className="text-xs text-foreground/60">Available Slots</p>
              <p className="font-bold">{11 - team.player_count} / 11</p>
            </div>
          </div>
        </div>

        {/* Position Gap Alert */}
        {team.position_gap.length > 0 && (
          <div className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
            <AlertCircle className="size-4 text-orange-600 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
            <div className="text-xs">
              <p className="font-bold text-orange-900">Team member positions:</p>
              <div className="flex gap-1 mt-1 flex-wrap">
                {team.position_gap.map((pos) => (
                  <Badge key={pos} variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                    {pos}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <Button onClick={() => onJoin(team.team_id, "MID")} disabled={loading} className="w-full">
          {loading ? "Joining..." : "Join Team"}
        </Button>
      </CardContent>
    </Card>
  )
}
