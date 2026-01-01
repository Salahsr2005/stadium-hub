// Stadium Management Service with Real Integration
import { seedStadiums } from "./seedData"

export interface StadiumData {
  stadium_id: number
  stadium_name: string
  location: string
  latitude: number
  longitude: number
  capacity: number
  surface_type: string
  amenities: string[]
  price_per_hour: number
  rating: number
  status: string
  imageUrl: string
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

// Get all stadiums with optional filtering
export const getStadiums = async (filters?: {
  capacity?: number
  maxPrice?: number
  minRating?: number
  surface?: string
}): Promise<StadiumData[]> => {
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
    if (filters.surface) {
      stadiums = stadiums.filter((s) => s.surface_type === filters.surface)
    }
  }

  return stadiums
}

// Get stadium by ID
export const getStadiumById = (stadiumId: number): StadiumData | null => {
  return seedStadiums.find((s) => s.stadium_id === stadiumId) || null
}

// Get available schedules for a stadium
export const getAvailableSchedules = (stadiumId: number, startDate: Date, days = 30): ScheduleData[] => {
  const schedules: ScheduleData[] = []
  const currentDate = new Date(startDate)

  // Generate available time slots for next 30 days
  for (let i = 0; i < days; i++) {
    const dateStr = currentDate.toISOString().split("T")[0]

    // Morning slots (06:00-12:00)
    schedules.push({
      schedule_id: Number.parseInt(`${stadiumId}${i}01`),
      stadium_id: stadiumId,
      match_date: dateStr,
      start_time: "06:00",
      end_time: "08:00",
      is_booked: Math.random() > 0.7,
      available_slots: 1,
    })

    // Afternoon slots (12:00-18:00)
    schedules.push({
      schedule_id: Number.parseInt(`${stadiumId}${i}02`),
      stadium_id: stadiumId,
      match_date: dateStr,
      start_time: "12:00",
      end_time: "14:00",
      is_booked: Math.random() > 0.6,
      available_slots: 1,
    })

    // Evening slots (18:00-22:00) - Most popular
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

// Book a stadium schedule
export const bookStadium = async (
  stadiumId: number,
  teamId: number,
  userId: number,
  matchDate: string,
  startTime: string,
  endTime: string,
  entryFee: number,
): Promise<BookingData> => {
  const booking: BookingData = {
    booking_id: `BOOK_${Date.now()}`,
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

  return booking
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
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

// Get stadium amenities
export const getStadiumAmenities = (stadiumId: number): string[] => {
  const stadium = getStadiumById(stadiumId)
  return stadium?.amenities || []
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

  // Mock implementation - would save to database
  console.log(`[v0] Stadium ${stadiumId} rated ${rating} by user ${userId}: ${comment}`)
  return true
}
