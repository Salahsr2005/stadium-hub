import { supabase } from "./supabase"

export interface MatchSchedule {
  schedule_id: number
  team1_id: number
  team2_id: number
  stadium_id: number
  match_date: string
  start_time: string
  entry_fee: number
  total_prize_pool: number
  status: "scheduled" | "completed" | "cancelled"
  winner_team_id?: number
  created_at?: string
}

export interface TeamFormation {
  team_id: number
  team_name: string
  stadium_id: number
  schedule_id?: number
  player_count: number
  avg_skill: number
  avg_age: number
  members: Array<{
    user_id: number
    username: string
    position: string
    skill_level: number
    age: number
  }>
  balance_score?: number
  overall_balance_score?: number
  skill_variance?: number
  position_balance?: number
  status: "forming" | "ready" | "scheduled"
}

export const createMatchSchedule = async (
  team1Id: number,
  team2Id: number,
  stadiumId: number,
  matchDate: string,
  startTime: string,
  entryFee: number,
): Promise<MatchSchedule> => {
  const { data, error } = await supabase
    .from("schedules")
    .insert({
      team1_id: team1Id,
      team2_id: team2Id,
      stadium_id: stadiumId,
      match_date: matchDate,
      start_time: startTime,
      entry_fee: entryFee,
      total_prize_pool: entryFee * 2 * 11,
      status: "scheduled",
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating match schedule:", error)
    throw error
  }

  return data
}

// Calculate end time (2 hours after start)
const calculateEndTime = (startTime: string): string => {
  const [hours, minutes] = startTime.split(":").map(Number)
  const endHours = (hours + 2) % 24
  return `${endHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}

export const getAvailableOpponents = async (teamId: number, stadiumId: number): Promise<TeamFormation[]> => {
  const { data, error } = await supabase
    .from("teams")
    .select(
      `
      team_id,
      team_name,
      stadium_id,
      player_count,
      avg_skill,
      avg_age,
      status,
      team_members (
        user_id,
        users (username, skill_level, age),
        assigned_position
      )
    `,
    )
    .neq("team_id", teamId)
    .eq("stadium_id", stadiumId)
    .eq("status", "need player")
    .lt("player_count", 11)

  if (error) {
    console.error("[v0] Error fetching opponents:", error)
    return []
  }

  return (data || []).map((team) => ({
    team_id: team.team_id,
    team_name: team.team_name,
    stadium_id: team.stadium_id,
    player_count: team.player_count,
    avg_skill: team.avg_skill,
    avg_age: team.avg_age,
    members: team.team_members.map((tm: any) => ({
      user_id: tm.user_id,
      username: tm.users?.username || "Unknown",
      position: tm.assigned_position,
      skill_level: tm.users?.skill_level || 5,
      age: tm.users?.age || 25,
    })),
    status: team.player_count >= 11 ? "ready" : "forming",
  }))
}

export const getScheduledMatches = async (filters?: {
  status?: "scheduled" | "completed" | "cancelled"
  stadiumId?: number
  fromDate?: string
  toDate?: string
  teamId?: number
  limit?: number
}): Promise<MatchSchedule[]> => {
  let query = supabase.from("schedules").select(
    `
      schedule_id,
      team1_id,
      team2_id,
      stadium_id,
      match_date,
      start_time,
      entry_fee,
      total_prize_pool,
      status,
      winner_team_id,
      created_at
    `,
  )

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.stadiumId) {
    query = query.eq("stadium_id", filters.stadiumId)
  }

  if (filters?.fromDate) {
    query = query.gte("match_date", filters.fromDate)
  }

  if (filters?.toDate) {
    query = query.lte("match_date", filters.toDate)
  }

  if (filters?.teamId) {
    query = query.or(`team1_id.eq.${filters.teamId},team2_id.eq.${filters.teamId}`)
  }

  const limit = filters?.limit || 50

  const { data, error } = await query.order("match_date", { ascending: true }).limit(limit)

  if (error) {
    console.error("[v0] Error fetching schedules:", error)
    return []
  }

  return data || []
}

export const getUpcomingMatches = async (
  days = 30,
): Promise<(MatchSchedule & { team1?: any; team2?: any; stadium?: any })[]> => {
  const today = new Date()
  const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)

  const { data, error } = await supabase
    .from("schedules")
    .select(
      `
      schedule_id,
      team1_id,
      team2_id,
      stadium_id,
      match_date,
      start_time,
      entry_fee,
      total_prize_pool,
      status,
      winner_team_id,
      teams!schedules_team1_id_fkey (team_id, team_name, avg_skill),
      teams!schedules_team2_id_fkey (team_id, team_name, avg_skill),
      stadiums (stadium_id, stadium_name, location)
    `,
    )
    .eq("status", "scheduled")
    .gte("match_date", today.toISOString().split("T")[0])
    .lte("match_date", futureDate.toISOString().split("T")[0])
    .order("match_date", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching upcoming matches:", error)
    return []
  }

  return data || []
}

export const getTeamDetails = async (teamId: number): Promise<TeamFormation | null> => {
  const { data, error } = await supabase
    .from("teams")
    .select(
      `
      team_id,
      team_name,
      stadium_id,
      player_count,
      avg_skill,
      avg_age,
      status,
      team_members (
        user_id,
        users (user_id, username, skill_level, age, positions),
        assigned_position
      )
    `,
    )
    .eq("team_id", teamId)
    .single()

  if (error) {
    console.error("[v0] Error fetching team details:", error)
    return null
  }

  return {
    team_id: data.team_id,
    team_name: data.team_name,
    stadium_id: data.stadium_id,
    player_count: data.player_count,
    avg_skill: data.avg_skill,
    avg_age: data.avg_age,
    members: data.team_members.map((tm: any) => ({
      user_id: tm.user_id,
      username: tm.users?.username || "Unknown",
      position: tm.assigned_position,
      skill_level: tm.users?.skill_level || 5,
      age: tm.users?.age || 25,
    })),
    status: data.status,
  }
}

export const calculateTeamBalance = (team: TeamFormation): number => {
  if (team.members.length === 0) return 0

  const avgSkill = team.members.reduce((sum, p) => sum + p.skill_level, 0) / team.members.length
  const variance = team.members.reduce((sum, p) => sum + Math.pow(p.skill_level - avgSkill, 2), 0) / team.members.length
  const stdDev = Math.sqrt(variance)

  const balanceScore = Math.max(0, 100 - stdDev * 20)

  return Math.round(balanceScore)
}

export const getMatchRecommendations = async (userId: number, userTeamIds: number[] = []): Promise<MatchSchedule[]> => {
  const today = new Date()
  const futureDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

  const query = supabase
    .from("schedules")
    .select(
      `
      schedule_id,
      team1_id,
      team2_id,
      stadium_id,
      match_date,
      start_time,
      entry_fee,
      total_prize_pool,
      status,
      winner_team_id
    `,
    )
    .eq("status", "scheduled")
    .gte("match_date", today.toISOString().split("T")[0])
    .lte("match_date", futureDate.toISOString().split("T")[0])

  const { data, error } = await query.order("match_date", { ascending: true }).limit(10)

  if (error) {
    console.error("[v0] Error fetching recommendations:", error)
    return []
  }

  return data || []
}

export const updateMatchStatus = async (
  scheduleId: number,
  status: "scheduled" | "completed" | "cancelled",
  winnerTeamId?: number,
): Promise<boolean> => {
  const updateData: any = { status }
  if (status === "completed" && winnerTeamId) {
    updateData.winner_team_id = winnerTeamId
  }

  const { error } = await supabase.from("schedules").update(updateData).eq("schedule_id", scheduleId)

  if (error) {
    console.error("[v0] Error updating match status:", error)
    return false
  }

  return true
}

// Suggest best match time based on availability
export const suggestBestMatchTime = (userPreferences: {
  preferredDays: number[]
  preferredTimes: string[]
  timezone: string
}): { date: string; time: string }[] => {
  const suggestions: { date: string; time: string }[] = []
  const today = new Date()

  for (let i = 1; i <= 7; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(today.getDate() + i)
    const dayOfWeek = checkDate.getDay()

    if (userPreferences.preferredDays.includes(dayOfWeek)) {
      userPreferences.preferredTimes.forEach((time) => {
        suggestions.push({
          date: checkDate.toISOString().split("T")[0],
          time: time,
        })
      })
    }
  }

  return suggestions.slice(0, 5)
}
