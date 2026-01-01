import { supabase } from "./supabase"

export const getUserTeamMemberships = async (userId: number) => {
  const { data, error } = await supabase
    .from("team_members")
    .select(`
      id,
      team_id,
      assigned_position,
      has_paid,
      teams (
        team_id,
        team_name,
        status,
        avg_skill,
        avg_age,
        player_count,
        stadiums (
          stadium_id,
          stadium_name,
          location,
          capacity
        ),
        schedules (
          schedule_id,
          match_date,
          start_time
        )
      )
    `)
    .eq("user_id", userId)
    .order("teams(schedules->match_date)", { ascending: false })

  if (error) throw error
  return data
}

export const getUserMatchHistory = async (userId: number) => {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      match_id,
      status,
      entry_fee,
      total_prize_pool,
      winner_team_id,
      team1: teams!team1_id (
        team_id,
        team_name,
        avg_skill
      ),
      team2: teams!team2_id (
        team_id,
        team_name,
        avg_skill
      ),
      schedules (
        match_date,
        start_time,
        stadiums (
          stadium_name,
          location
        )
      )
    `)
    .order("schedules->match_date", { ascending: false })

  if (error) throw error
  return data
}

export const getUserTransactions = async (userId: number) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) throw error
  return data
}

export const getRecommendedTeams = async (userId: number, _stadiumId?: number) => {
  const { data: userPositions, error: userError } = await supabase
    .from("users")
    .select("positions")
    .eq("user_id", userId)
    .single()

  if (userError) throw userError

  const positions = userPositions?.positions || []

  const { data, error } = await supabase
    .from("teams")
    .select(
      `
      team_id,
      team_name,
      status,
      avg_skill,
      avg_age,
      player_count,
      stadiums (
        stadium_id,
        stadium_name,
        location,
        capacity
      )
    `,
    )
    .eq("status", "need player")
    .gt("player_count", 0)
    .order("avg_skill", { ascending: false })
    .limit(6)

  if (error) throw error

  return (data || []).filter((team) => positions.length > 0 && team.avg_skill > 0)
}

export const getUserStats = async (userId: number) => {
  const { data, error } = await supabase
    .from("users")
    .select("user_id, username, current_level, matches_played, wallet_balance, age, positions, latitude, longitude")
    .eq("user_id", userId)
    .single()

  if (error) throw error
  return data
}

export const getNearbyStadiums = async (userLatitude?: number, userLongitude?: number) => {
  const { data, error } = await supabase
    .from("stadiums")
    .select(
      `
      stadium_id,
      stadium_name,
      location,
      latitude,
      longitude,
      capacity,
      surface_type,
      amenities,
      price_per_hour,
      rating,
      status
    `,
    )
    .eq("status", "active")
    .order("rating", { ascending: false })

  if (error) throw error

  // Calculate distance if user location is available
  if (userLatitude && userLongitude && data) {
    return data.map((stadium) => ({
      ...stadium,
      distance: calculateDistance(userLatitude, userLongitude, stadium.latitude, stadium.longitude),
    }))
  }

  return data
}

export const getStadiumDetails = async (stadiumId: number) => {
  const { data, error } = await supabase
    .from("stadiums")
    .select(
      `
      stadium_id,
      stadium_name,
      location,
      latitude,
      longitude,
      capacity,
      surface_type,
      amenities,
      price_per_hour,
      rating,
      status,
      reviews (
        review_id,
        rating,
        comment,
        users (username)
      )
    `,
    )
    .eq("stadium_id", stadiumId)
    .single()

  if (error) throw error
  return data
}

// Haversine formula for distance calculation
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10 // Round to 1 decimal place
}
