import { supabase } from "./supabase"

export interface Schedule {
  schedule_id: number
  stadium_id: number
  match_date: string
  start_time: string
  is_booked: boolean
  created_at?: string
}

export interface ScheduleWithStadium extends Schedule {
  stadium?: {
    stadium_id: number
    stadium_name: string
    location: string
    capacity: number
    price_per_hour?: number
  }
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
  stadiumId: number,
  matchDate: string,
  startTime: string,
): Promise<Schedule | null> => {
  const { data, error } = await supabase
    .from("schedules")
    .insert({
      stadium_id: stadiumId,
      match_date: matchDate,
      start_time: startTime,
      is_booked: false,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating match schedule:", error)
    return null
  }

  return data
}

// Get all schedules for a specific stadium
export const getStadiumSchedules = async (stadiumId: number): Promise<ScheduleWithStadium[]> => {
  const { data, error } = await supabase
    .from("schedules")
    .select(
      `
      schedule_id,
      stadium_id,
      match_date,
      start_time,
      is_booked,
      created_at,
      stadiums (stadium_id, stadium_name, location, capacity, price_per_hour)
    `,
    )
    .eq("stadium_id", stadiumId)
    .order("match_date", { ascending: true })
    .order("start_time", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching stadium schedules:", error)
    return []
  }

  return data || []
}

// Get available time slots for a specific date and stadium
export const getAvailableSlots = async (
  stadiumId: number,
  matchDate: string,
): Promise<{ time: string; available: boolean }[]> => {
  const { data, error } = await supabase
    .from("schedules")
    .select("start_time, is_booked")
    .eq("stadium_id", stadiumId)
    .eq("match_date", matchDate)

  if (error) {
    console.error("[v0] Error fetching available slots:", error)
    return []
  }

  const bookedTimes = new Set((data || []).filter((s) => s.is_booked).map((s) => s.start_time))

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
  ]

  return timeSlots.map((time) => ({
    time,
    available: !bookedTimes.has(time),
  }))
}

// Create a new schedule entry
export const createSchedule = async (
  stadiumId: number,
  matchDate: string,
  startTime: string,
): Promise<Schedule | null> => {
  const { data, error } = await supabase
    .from("schedules")
    .insert({
      stadium_id: stadiumId,
      match_date: matchDate,
      start_time: startTime,
      is_booked: false,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating schedule:", error)
    return null
  }

  return data
}

// Book a schedule (mark as_booked)
export const bookSchedule = async (scheduleId: number): Promise<boolean> => {
  const { error } = await supabase.from("schedules").update({ is_booked: true }).eq("schedule_id", scheduleId)

  if (error) {
    console.error("[v0] Error booking schedule:", error)
    return false
  }

  return true
}

// Cancel a booking (mark as not booked)
export const cancelSchedule = async (scheduleId: number): Promise<boolean> => {
  const { error } = await supabase.from("schedules").update({ is_booked: false }).eq("schedule_id", scheduleId)

  if (error) {
    console.error("[v0] Error cancelling schedule:", error)
    return false
  }

  return true
}

// Get upcoming available schedules
export const getUpcomingAvailable = async (days = 30): Promise<ScheduleWithStadium[]> => {
  const today = new Date()
  const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)

  const { data, error } = await supabase
    .from("schedules")
    .select(
      `
      schedule_id,
      stadium_id,
      match_date,
      start_time,
      is_booked,
      created_at,
      stadiums (stadium_id, stadium_name, location, capacity, price_per_hour)
    `,
    )
    .eq("is_booked", false)
    .gte("match_date", today.toISOString().split("T")[0])
    .lte("match_date", futureDate.toISOString().split("T")[0])
    .order("match_date", { ascending: true })
    .order("start_time", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching upcoming available schedules:", error)
    return []
  }

  return data || []
}

// Get schedules by date range
export const getSchedulesByDateRange = async (
  startDate: string,
  endDate: string,
  stadiumId?: number,
): Promise<ScheduleWithStadium[]> => {
  let query = supabase
    .from("schedules")
    .select(
      `
      schedule_id,
      stadium_id,
      match_date,
      start_time,
      is_booked,
      created_at,
      stadiums (stadium_id, stadium_name, location, capacity, price_per_hour)
    `,
    )
    .gte("match_date", startDate)
    .lte("match_date", endDate)

  if (stadiumId) {
    query = query.eq("stadium_id", stadiumId)
  }

  const { data, error } = await query.order("match_date", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching schedules by date range:", error)
    return []
  }

  return data || []
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
  is_booked?: boolean
  stadiumId?: number
  fromDate?: string
  toDate?: string
}): Promise<ScheduleWithStadium[]> => {
  let query = supabase.from("schedules").select(
    `
      schedule_id,
      stadium_id,
      match_date,
      start_time,
      is_booked,
      created_at,
      stadiums (stadium_id, stadium_name, location, capacity, price_per_hour)
    `,
  )

  if (filters?.is_booked !== undefined) {
    query = query.eq("is_booked", filters.is_booked)
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

  const { data, error } = await query.order("match_date", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching schedules:", error)
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

export const getMatchRecommendations = async (
  userId: number,
  userTeamIds: number[] = [],
): Promise<ScheduleWithStadium[]> => {
  const today = new Date()
  const futureDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

  const query = supabase
    .from("schedules")
    .select(
      `
      schedule_id,
      stadium_id,
      match_date,
      start_time,
      is_booked,
      created_at,
      stadiums (stadium_id, stadium_name, location, capacity, price_per_hour)
    `,
    )
    .eq("is_booked", false)
    .gte("match_date", today.toISOString().split("T")[0])
    .lte("match_date", futureDate.toISOString().split("T")[0])

  const { data, error } = await query.order("match_date", { ascending: true }).limit(10)

  if (error) {
    console.error("[v0] Error fetching recommendations:", error)
    return []
  }

  return data || []
}
