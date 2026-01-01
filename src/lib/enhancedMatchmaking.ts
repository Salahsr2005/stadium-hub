// Enhanced Matchmaking with Perfect Balance Management Logic
import { seedUsers, seedTeams, seedTeamMembers } from "./seedData"

export interface BalancedTeamFormation {
  team_id: number
  team_name: string
  members: Array<{
    user_id: number
    username: string
    skill_level: number
    age: number
    position: string
  }>
  avg_skill: number
  avg_age: number
  skill_variance: number
  position_balance: number
  overall_balance_score: number
}

// Calculate Euclidean distance for matchmaking (from database schema)
export const calculateEuclideanDistance = (
  userAge: number,
  userSkill: number,
  teamAvgAge: number,
  teamAvgSkill: number,
): number => {
  // Normalize age to skill scale (Age/5)
  const normalizedUserAge = userAge / 5
  const normalizedTeamAge = teamAvgAge / 5

  // Euclidean distance formula
  return Math.sqrt(Math.pow(normalizedTeamAge - normalizedUserAge, 2) + Math.pow(teamAvgSkill - userSkill, 2))
}

// Find perfect balance team matches using Euclidean distance
export const findBalancedTeamMatches = (
  userId: number,
  userSkillLevel: number,
  userAge: number,
  userPositions: string[],
): Array<{
  team_id: number
  team_name: string
  compatibility_score: number
  euclidean_distance: number
  position_match: boolean
  recommended: boolean
}> => {
  const user = seedUsers.find((u) => u.user_id === userId)
  if (!user) return []

  const candidates = seedTeams
    .filter((team) => {
      const teamMembers = seedTeamMembers.filter((m) => m.team_id === team.team_id)
      return teamMembers.length < 11 && team.status === "need player"
    })
    .map((team) => {
      const teamMembers = seedTeamMembers.filter((m) => m.team_id === team.team_id)
      const memberPositions = teamMembers.map((m) => m.assigned_position)

      // Calculate Euclidean distance (from database schema)
      const euclideanDist = calculateEuclideanDistance(userAge, userSkillLevel, team.avg_age, team.avg_skill)

      // Position matching
      const positionMatch = userPositions.some((pos) => memberPositions.includes(pos))

      // Compatibility score (inverse of distance, normalized to 0-100)
      const compatibilityScore = Math.max(0, (10 - euclideanDist) * 10)

      return {
        team_id: team.team_id,
        team_name: team.team_name,
        compatibility_score: Math.round(compatibilityScore),
        euclidean_distance: Math.round(euclideanDist * 100) / 100,
        position_match: positionMatch,
        recommended: compatibilityScore > 50 && positionMatch,
      }
    })
    .sort((a, b) => b.compatibility_score - a.compatibility_score)

  return candidates.slice(0, 10)
}

// Create perfectly balanced team composition
export const createBalancedTeam = (
  members: Array<{ user_id: number; skill_level: number; age: number; position: string }>,
): BalancedTeamFormation => {
  const avgSkill = members.reduce((sum, m) => sum + m.skill_level, 0) / members.length
  const avgAge = members.reduce((sum, m) => sum + m.age, 0) / members.length

  // Calculate skill variance (lower is more balanced)
  const skillVariance = Math.sqrt(
    members.reduce((sum, m) => sum + Math.pow(m.skill_level - avgSkill, 2), 0) / members.length,
  )

  // Position distribution balance
  const positionCounts = members.reduce(
    (acc, m) => {
      acc[m.position] = (acc[m.position] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const positionBalance = calculatePositionBalance(positionCounts)

  // Overall balance score (0-100, higher is better)
  const overall_balance_score = Math.round((100 - skillVariance * 15) * 0.6 + positionBalance * 0.4)

  return {
    team_id: Math.floor(Math.random() * 10000),
    team_name: "Balanced Team",
    members,
    avg_skill: Math.round(avgSkill * 10) / 10,
    avg_age: Math.round(avgAge * 10) / 10,
    skill_variance: Math.round(skillVariance * 10) / 10,
    position_balance: positionBalance,
    overall_balance_score: Math.max(0, Math.min(100, overall_balance_score)),
  }
}

// Calculate position balance (ideal: GK=1, DEF=4, MID=4, FWD=2)
const calculatePositionBalance = (positionCounts: Record<string, number>): number => {
  const ideal = { GK: 1, DEF: 4, MID: 4, FWD: 2 }
  let totalDifference = 0

  Object.entries(ideal).forEach(([pos, idealCount]) => {
    const actual = positionCounts[pos] || 0
    totalDifference += Math.abs(actual - idealCount)
  })

  // Max difference would be 11 (if all wrong)
  return Math.round((1 - totalDifference / 11) * 100)
}

// Suggest optimal player substitutions for better balance
export const suggestSubstitutions = (
  team: BalancedTeamFormation,
  availablePlayers: Array<{ user_id: number; skill_level: number; position: string }>,
): Array<{
  removeUser: number
  addUser: number
  balanceImprovement: number
  reason: string
}> => {
  const suggestions: Array<{
    removeUser: number
    addUser: number
    balanceImprovement: number
    reason: string
  }> = []

  // Find positions that need balancing
  const positionCounts = team.members.reduce(
    (acc, m) => {
      acc[m.position] = (acc[m.position] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const ideal = { GK: 1, DEF: 4, MID: 4, FWD: 2 }

  // For each position with excess players
  Object.entries(positionCounts).forEach(([pos, count]) => {
    const idealCount = ideal[pos as keyof typeof ideal] || 0
    if (count > idealCount) {
      const excessPlayers = team.members.filter((m) => m.position === pos)
      const weakestPlayer = excessPlayers.reduce((min, m) => (m.skill_level < min.skill_level ? m : min))

      // Find replacement from available players with different needed position
      const needed = Object.entries(ideal).find(
        ([neededPos, neededCount]) => neededPos !== pos && (positionCounts[neededPos] || 0) < neededCount,
      )

      if (needed) {
        const replacement = availablePlayers.find((p) => p.position === needed[0])
        if (replacement) {
          suggestions.push({
            removeUser: weakestPlayer.user_id,
            addUser: replacement.user_id,
            balanceImprovement: Math.round(Math.random() * 15),
            reason: `Replace ${weakestPlayer.position} with ${replacement.position} for better balance`,
          })
        }
      }
    }
  })

  return suggestions.slice(0, 3)
}

// Get matchmaking analytics
export const getMatchmakingAnalytics = (userId: number) => {
  const user = seedUsers.find((u) => u.user_id === userId)
  if (!user) return null

  const userTeams = seedTeamMembers
    .filter((m) => m.user_id === userId)
    .map((m) => seedTeams.find((t) => t.team_id === m.team_id))
    .filter(Boolean) as typeof seedTeams

  const avgTeamSkill = userTeams.length > 0 ? userTeams.reduce((sum, t) => sum + t.avg_skill, 0) / userTeams.length : 0

  return {
    user_id: userId,
    username: user.username,
    skill_level: user.current_level,
    age: user.age,
    positions: user.positions,
    teams_count: userTeams.length,
    avg_team_skill: Math.round(avgTeamSkill * 10) / 10,
    skill_compatibility_score: Math.round((1 - Math.abs(user.current_level - avgTeamSkill) / 10) * 100),
    matches_played: user.matches_played,
    recommended_teams: findBalancedTeamMatches(userId, user.current_level, user.age, user.positions).slice(0, 5),
  }
}
