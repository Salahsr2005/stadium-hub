"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { findOptimalMatches, joinTeam } from "@/lib/matchmaking"
import { MatchmakingCard } from "./MatchmakingCard"
import { useToast } from "@/hooks/use-toast"
import { Loader, Zap } from "lucide-react"

interface MatchmakingSectionProps {
  userId: number
  skillLevel: number
  positions: string[]
  age: number
}

export const MatchmakingSection = ({ userId, skillLevel, positions, age }: MatchmakingSectionProps) => {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [joiningTeamId, setJoiningTeamId] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        const optimalMatches = await findOptimalMatches(userId, skillLevel, positions, age)
        setMatches(optimalMatches)
      } catch (error) {
        console.error("[v0] Error finding matches:", error)
        toast({
          title: "Error",
          description: "Failed to load matches",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [userId, skillLevel, positions, age, toast])

  const handleJoinTeam = async (teamId: number, position: string) => {
    try {
      setJoiningTeamId(teamId)
      await joinTeam(userId, teamId, position)
      toast({
        title: "Success",
        description: "Successfully joined team!",
      })
      // Refresh matches
      const optimalMatches = await findOptimalMatches(userId, skillLevel, positions, age)
      setMatches(optimalMatches)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join team",
        variant: "destructive",
      })
    } finally {
      setJoiningTeamId(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center gap-3">
          <Loader className="size-5 animate-spin" strokeWidth={2.5} />
          <p className="font-medium">Finding perfect matches for you...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="size-6 text-primary" strokeWidth={2.5} />
            <CardTitle>Smart Matchmaking</CardTitle>
          </div>
          <p className="text-sm text-foreground/70 font-medium mt-1">
            AI-powered algorithm finds the best teams based on skill, position, and age compatibility
          </p>
        </CardHeader>
      </Card>

      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <MatchmakingCard
              key={match.team_id}
              team={match}
              onJoin={handleJoinTeam}
              loading={joiningTeamId === match.team_id}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-foreground/60 font-medium">No matches found. Check back later!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
