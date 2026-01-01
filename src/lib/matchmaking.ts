import { supabase } from "./supabase"

export interface MatchCandidate {
  team_id: number
  team_name: string
  player_count: number
  avg_skill: number
  avg_age: number
  current_members?: any[]
  compatibility_score: number
  skill_match: number
  position_match: number
  position_gap: string[]
}

export const findOptimalMatches = async (
  userId: number,
  userSkillLevel: number,
  userPositions: string[],
  userAge: number,
): Promise<MatchCandidate[]> => {
  // Get all open teams
  const { data: teams, error } = await supabase
    .from("teams")
    .select(
      `
      team_id,
      team_name,
      player_count,
      avg_skill,
      avg_age,
      team_members (
        user_id,
        assigned_position,
        users (positions)
      )
    `,
    )
    .eq("status", "need player")
    .lt("player_count", 11) // Max 11 players in a team

  if (error) throw error

  // Calculate compatibility scores using weighted algorithm
  const candidates = (teams || [])
    .filter((team) => !team.team_members?.some((member: any) => member.user_id === userId))
    .map((team) => {
      // 1. Skill level matching (weighted 35%)
      const skillDifference = Math.abs(userSkillLevel - team.avg_skill)
      const skillMatch = Math.max(0, 10 - skillDifference) / 10

      // 2. Position matching (weighted 30%) - derive from team members instead of required_positions
      const teamMemberPositions = team.team_members?.map((m: any) => m.assigned_position).filter(Boolean) || []
      const positionOverlap = userPositions.filter((pos) => teamMemberPositions.includes(pos)).length
      const positionMatch = positionOverlap > 0 ? Math.min(positionOverlap / userPositions.length, 1) : 0.5
      const positionGap = teamMemberPositions.filter((pos: string) => !userPositions.includes(pos))

      // 3. Age group matching (weighted 20%)
      const ageDifference = Math.abs(userAge - team.avg_age)
      const ageMatch = Math.max(0, 1 - ageDifference / 20)

      // 4. Team completeness (weighted 15%)
      const slotsAvailable = 11 - team.player_count
      const completenessScore = slotsAvailable > 0 ? Math.min(slotsAvailable / 5, 1) : 0

      // Calculate weighted compatibility score
      const compatibilityScore = skillMatch * 0.35 + positionMatch * 0.3 + ageMatch * 0.2 + completenessScore * 0.15

      return {
        ...team,
        compatibility_score: Number((compatibilityScore * 100).toFixed(1)),
        skill_match: Number((skillMatch * 100).toFixed(1)),
        position_match: Number((positionMatch * 100).toFixed(1)),
        position_gap: positionGap,
      }
    })
    .sort((a, b) => b.compatibility_score - a.compatibility_score)

  return candidates
}

// Calculate individual match compatibility percentage
export const calculateMatchCompatibility = (
  userSkillLevel: number,
  userPositions: string[],
  userAge: number,
  teamAvgSkill: number,
  teamMemberPositions: string[],
  teamAvgAge: number,
): number => {
  const skillMatch = Math.max(0, 10 - Math.abs(userSkillLevel - teamAvgSkill)) / 10
  const positionOverlap = userPositions.filter((pos) => teamMemberPositions.includes(pos)).length
  const positionMatch = positionOverlap > 0 ? Math.min(positionOverlap / userPositions.length, 1) : 0.5
  const ageMatch = Math.max(0, 1 - Math.abs(userAge - teamAvgAge) / 20)

  return Math.round((skillMatch * 0.4 + positionMatch * 0.35 + ageMatch * 0.25) * 100)
}

export const joinTeam = async (userId: number, teamId: number, assignedPosition: string) => {
  const { data, error } = await supabase
    .from("team_members")
    .insert({
      user_id: userId,
      team_id: teamId,
      assigned_position: assignedPosition,
      has_paid: false,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
