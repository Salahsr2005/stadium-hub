"use client"

// Team Balance Analysis Component
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Users, AlertCircle } from "lucide-react"
import type { BalancedTeamFormation } from "@/lib/enhancedMatchmaking"

interface BalanceAnalysisProps {
  team: BalancedTeamFormation
  compact?: boolean
}

export const BalanceAnalysis = ({ team, compact = false }: BalanceAnalysisProps) => {
  const [scoreColor, setScoreColor] = useState<"green" | "yellow" | "red">("green")

  useEffect(() => {
    if (team.overall_balance_score >= 80) {
      setScoreColor("green")
    } else if (team.overall_balance_score >= 60) {
      setScoreColor("yellow")
    } else {
      setScoreColor("red")
    }
  }, [team.overall_balance_score])

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg border border-foreground/20">
        <Trophy className="size-4" strokeWidth={2.5} />
        <span className="font-bold text-sm">Balance: {team.overall_balance_score}/100</span>
        <Badge variant={scoreColor === "green" ? "default" : "outline"}>
          {scoreColor === "green" ? "Optimal" : scoreColor === "yellow" ? "Good" : "Needs Work"}
        </Badge>
      </div>
    )
  }

  return (
    <Card className="border-2 border-foreground">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Team Balance Analysis</span>
          <Badge variant={scoreColor === "green" ? "default" : scoreColor === "yellow" ? "outline" : "destructive"}>
            {scoreColor === "green" ? "Optimal" : scoreColor === "yellow" ? "Good" : "Needs Work"}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Balance Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-black uppercase text-sm">Overall Balance Score</p>
            <p className="text-2xl font-black">{team.overall_balance_score}/100</p>
          </div>
          <Progress value={team.overall_balance_score} className="h-3" />
        </div>

        {/* Skill Variance */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="size-4" strokeWidth={2.5} />
            <p className="font-black uppercase text-sm">Skill Distribution</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-secondary/30 rounded text-center">
              <p className="text-xs font-bold text-foreground/60">Average</p>
              <p className="font-black">{team.avg_skill}</p>
            </div>
            <div className="p-2 bg-secondary/30 rounded text-center">
              <p className="text-xs font-bold text-foreground/60">Variance</p>
              <p className="font-black">{team.skill_variance}</p>
            </div>
            <div className="p-2 bg-secondary/30 rounded text-center">
              <p className="text-xs font-bold text-foreground/60">Members</p>
              <p className="font-black">{team.members.length}</p>
            </div>
          </div>
        </div>

        {/* Position Balance */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="size-4" strokeWidth={2.5} />
            <p className="font-black uppercase text-sm">Position Balance</p>
          </div>
          <Progress value={team.position_balance} className="h-3" />
          <p className="text-xs font-medium text-foreground/60 mt-1">{team.position_balance}% of ideal formation</p>
        </div>

        {/* Member List */}
        <div className="space-y-2">
          <p className="font-black uppercase text-sm">Team Members</p>
          <div className="space-y-1">
            {team.members.map((member) => (
              <div
                key={member.user_id}
                className="flex items-center justify-between p-2 bg-secondary/30 rounded text-sm"
              >
                <span className="font-bold">{member.position}</span>
                <span className="flex-1 ml-2 text-foreground/60">{member.user_id}</span>
                <Badge variant="outline">{member.skill_level}/10</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {team.overall_balance_score < 75 && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex gap-2">
            <AlertCircle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
            <div className="text-sm">
              <p className="font-bold text-yellow-700 mb-1">Balance Improvement Needed</p>
              <p className="text-xs text-yellow-600">
                Consider adjusting player positions or finding better skill matches
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
