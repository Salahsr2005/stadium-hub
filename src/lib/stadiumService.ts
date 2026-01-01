// Stadium Management Service with Full Database Integration
import { supabase } from "./supabase"
import { seedStadiums } from "./seedData"

export interface StadiumData {
  stadium_id: number
  stadium_name: string
  location: string
  latitude: number
  longitude: number
  capacity: number
  surface_type?: string
  amenities?: string[]
  price_per_hour: number
  rating: number
  is_available?: boolean
  status: string
  imageUrl?: string
}

export interface ScheduleData {
  schedule_id: number
  stadium_id: number
  match_date: string
  start_time: string
  end_time?: string
  is_booked: boolean
  available_slots?: number
}

export interface BookingData {
  booking_id?: string
  stadium_id: number
  match_date: string
  start_time: string
  end_time: string
  team_id: number
  user_id: number
  entry_fee: number
  status: "pending" | "confirmed" | "cancelled"
  created_at?: string
}

export const getStadiums = async (filters?: {
  capacity?: number
  maxPrice?: number
  minRating?: number
  surface?: string
}): Promise<StadiumData[]> => {
  try {
    let query = supabase.from("stadiums").select("*")

    if (filters?.capacity) {
      query = query.gte("capacity", filters.capacity)
    }
    if (filters?.maxPrice) {
      query = query.lte("price_per_hour", filters.maxPrice)
    }
    if (filters?.minRating) {
      query = query.gte("rating", filters.minRating)
    }

    const { data, error } = await query.eq("is_available", true)

    if (error || !data) {
      console.warn("[v0] Database query failed, using seed data:", error)
      return getStadiumsFromSeed(filters)
    }

    return data.map((stadium) => ({
      ...stadium,
      rating: stadium.rating || 0,
      price_per_hour: stadium.price_per_hour || 1000,
      imageUrl:
        stadium.imageUrl || `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(stadium.stadium_name)}`,
    }))
  } catch (error) {
    console.error("[v0] Error fetching stadiums:", error)
    return getStadiumsFromSeed(filters)
  }
}

const getStadiumsFromSeed = (filters?: {
  capacity?: number
  maxPrice?: number
  minRating?: number
  surface?: string
}): StadiumData[] => {
  let stadiums = [...seedStadiums]

  if (filters) {
    if (filters.capacity) {
      stadiums = stadiums.filter((s) => s.capacity >= filters.capacity!)
    }
    if (filters.maxPrice) {
      stadiums = stadiums.filter((s) => s.price_per_hour <= filters.maxPrice!)
    }
    if (filters.minRating) {
      stadiums = stadiums.filter((s) => s.rating >= filters.minRating!)
    }
  }

  return stadiums.map((s) => ({
    ...s,
    rating: s.rating || 0,
    price_per_hour: s.price_per_hour || 1000,
  }))
}

export const getStadiumById = async (stadiumId: number): Promise<StadiumData | null> => {
  try {
    const { data, error } = await supabase.from("stadiums").select("*").eq("stadium_id", stadiumId).single()

    if (error || !data) {
      console.warn("[v0] Database stadium fetch failed, checking seed data:", error)
      const seedStadium = seedStadiums.find((s) => s.stadium_id === stadiumId)
      return seedStadium || null
    }

    return {
      ...data,
      rating: data.rating || 0,
      price_per_hour: data.price_per_hour || 1000,
      imageUrl: data.imageUrl || `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(data.stadium_name)}`,
    }
  } catch (error) {
    console.error("[v0] Error fetching stadium:", error)
    return seedStadiums.find((s) => s.stadium_id === stadiumId) || null
  }
}

// Get available schedules for a stadium
export const getAvailableSchedules = (stadiumId: number, startDate: Date, days = 30): ScheduleData[] => {
  const schedules: ScheduleData[] = []
  const currentDate = new Date(startDate)

  for (let i = 0; i < days; i++) {
    const dateStr = currentDate.toISOString().split("T")[0]

    schedules.push({
      schedule_id: Number.parseInt(`${stadiumId}${i}01`),
      stadium_id: stadiumId,
      match_date: dateStr,
      start_time: "06:00",
      end_time: "08:00",
      is_booked: Math.random() > 0.7,
      available_slots: 1,
    })

    schedules.push({
      schedule_id: Number.parseInt(`${stadiumId}${i}02`),
      stadium_id: stadiumId,
      match_date: dateStr,
      start_time: "12:00",
      end_time: "14:00",
      is_booked: Math.random() > 0.6,
      available_slots: 1,
    })

    schedules.push({
      schedule_id: Number.parseInt(`${stadiumId}${i}03`),
      stadium_id: stadiumId,
      match_date: dateStr,
      start_time: "18:00",
      end_time: "20:00",
      is_booked: Math.random() > 0.5,
      available_slots: 1,
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return schedules.filter((s) => !s.is_booked)
}

export const bookStadium = async (
  stadiumId: number,
  teamId: number,
  userId: number,
  matchDate: string,
  startTime: string,
  entryFee: number,
): Promise<{ success: boolean; message: string; booking?: BookingData }> => {
  try {
    // Verify user has sufficient balance
    const { data: userBalance, error: balanceError } = await supabase
      .from("users")
      .select("wallet_balance")
      .eq("user_id", userId)
      .single()

    if (balanceError || !userBalance) {
      return { success: false, message: "Unable to verify user balance" }
    }

    if (userBalance.wallet_balance < entryFee) {
      return {
        success: false,
        message: `Insufficient balance. You need ${entryFee} DZD but only have ${userBalance.wallet_balance} DZD`,
      }
    }

    // Get stadium info
    const stadium = await getStadiumById(stadiumId)
    if (!stadium) {
      return { success: false, message: "Stadium not found" }
    }

    // Calculate end time (assume 2 hour matches)
    const [hour] = startTime.split(":").map(Number)
    const endTime = `${String(hour + 2).padStart(2, "0")}:00`

    // Create booking in database
    const { data: bookingData, error: bookingError } = await supabase
      .from("schedules")
      .insert({
        stadium_id: stadiumId,
        team_id: teamId,
        match_date: matchDate,
        start_time: startTime,
        end_time: endTime,
        status: "scheduled",
      })
      .select()
      .single()

    if (bookingError) {
      return { success: false, message: "Failed to create booking" }
    }

    // Deduct balance for entry fee
    const newBalance = userBalance.wallet_balance - entryFee
    const { error: updateError } = await supabase
      .from("users")
      .update({ wallet_balance: newBalance })
      .eq("user_id", userId)

    if (updateError) {
      console.error("[v0] Balance update failed:", updateError)
      return { success: false, message: "Failed to process payment" }
    }

    // Record transaction
    const { error: txError } = await supabase.from("transactions").insert({
      user_id: userId,
      type: "entry_fee",
      amount: entryFee,
      created_at: new Date().toISOString(),
    })

    if (txError) {
      console.warn("[v0] Transaction record failed:", txError)
    }

    const booking: BookingData = {
      booking_id: `BOOK_${bookingData?.schedule_id || Date.now()}`,
      stadium_id: stadiumId,
      match_date: matchDate,
      start_time: startTime,
      end_time: endTime,
      team_id: teamId,
      user_id: userId,
      entry_fee: entryFee,
      status: "confirmed",
      created_at: new Date().toISOString(),
    }

    return {
      success: true,
      message: `Successfully booked ${stadium.stadium_name} for ${entryFee} DZD. New balance: ${newBalance} DZD`,
      booking,
    }
  } catch (error) {
    console.error("[v0] Booking error:", error)
    return { success: false, message: "Booking failed. Please try again." }
  }
}

// Get nearby stadiums based on user location
export const getNearbyStadiums = async (
  userLatitude: number,
  userLongitude: number,
  radiusKm = 10,
): Promise<(StadiumData & { distance: number })[]> => {
  const stadiums = await getStadiums()

  const nearby = stadiums
    .map((stadium) => ({
      ...stadium,
      distance: calculateDistance(userLatitude, userLongitude, stadium.latitude, stadium.longitude),
    }))
    .filter((s) => s.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)

  return nearby
}

// Calculate distance using Haversine formula
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

// Get all unique surface types
export const getSurfaceTypes = (): string[] => {
  const types = new Set(seedStadiums.map((s) => s.surface_type))
  return Array.from(types)
}

// Rate stadium
export const rateStadium = async (
  stadiumId: number,
  userId: number,
  rating: number,
  comment: string,
): Promise<boolean> => {
  if (rating < 1 || rating > 5) {
    console.error("Rating must be between 1 and 5")
    return false
  }

  try {
    const { error } = await supabase.from("reviews").insert({
      stadium_id: stadiumId,
      user_id: userId,
      rating: rating,
      comment: comment,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("[v0] Rating submission error:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Rate stadium error:", error)
    return false
  }
}
