// Comprehensive seed data for testing all platform functionalities

export interface SeedUser {
  user_id: number
  username: string
  age: number
  positions: string[]
  initial_level: number
  current_level: number
  wallet_balance: number
  matches_played: number
  latitude: number
  longitude: number
  created_at: string
}

export interface SeedStadium {
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

export interface SeedTeam {
  team_id: number
  team_name: string
  stadium_id: number
  status: string
  avg_skill: number
  avg_age: number
  player_count: number
}

export interface SeedSchedule {
  schedule_id: number
  stadium_id: number
  team_id: number
  match_date: string
  start_time: string
  end_time: string
  status: string
}

export interface SeedMatch {
  match_id: number
  schedule_id: number
  team1_id: number
  team2_id: number
  status: string
  entry_fee: number
  total_prize_pool: number
  winner_team_id: number | null
}

export interface SeedTransaction {
  transaction_id: number
  user_id: number
  type: string
  amount: number
  description: string
  created_at: string
  balance_after: number
}

export interface SeedTeamMember {
  id: number
  team_id: number
  user_id: number
  assigned_position: string
  has_paid: boolean
}

export interface SeedReview {
  review_id: number
  stadium_id: number
  user_id: number
  rating: number
  comment: string
  created_at: string
}

// Seed Users
export const seedUsers: SeedUser[] = [
  {
    user_id: 1,
    username: "Ahmed_Pro",
    age: 25,
    positions: ["FWD", "MID"],
    initial_level: 7,
    current_level: 8,
    wallet_balance: 15000,
    matches_played: 45,
    latitude: 36.7538,
    longitude: 3.0588,
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    user_id: 2,
    username: "Karim_Striker",
    age: 22,
    positions: ["FWD"],
    initial_level: 6,
    current_level: 7,
    wallet_balance: 8500,
    matches_played: 32,
    latitude: 36.7650,
    longitude: 3.0750,
    created_at: "2024-02-20T14:30:00Z"
  },
  {
    user_id: 3,
    username: "Yassine_GK",
    age: 28,
    positions: ["GK"],
    initial_level: 8,
    current_level: 9,
    wallet_balance: 22000,
    matches_played: 78,
    latitude: 36.7400,
    longitude: 3.0400,
    created_at: "2023-11-10T09:00:00Z"
  },
  {
    user_id: 4,
    username: "Mehdi_Defender",
    age: 26,
    positions: ["DEF"],
    initial_level: 7,
    current_level: 7,
    wallet_balance: 5000,
    matches_played: 55,
    latitude: 36.7800,
    longitude: 3.0900,
    created_at: "2024-03-05T16:00:00Z"
  },
  {
    user_id: 5,
    username: "Omar_Midfield",
    age: 24,
    positions: ["MID", "DEF"],
    initial_level: 5,
    current_level: 6,
    wallet_balance: 3500,
    matches_played: 28,
    latitude: 36.7200,
    longitude: 3.0200,
    created_at: "2024-04-12T11:00:00Z"
  },
  {
    user_id: 6,
    username: "Rachid_Wings",
    age: 21,
    positions: ["FWD", "MID"],
    initial_level: 6,
    current_level: 6,
    wallet_balance: 12000,
    matches_played: 19,
    latitude: 36.7600,
    longitude: 3.0650,
    created_at: "2024-05-01T08:00:00Z"
  }
]

// Seed Stadiums
export const seedStadiums: SeedStadium[] = [
  {
    stadium_id: 1,
    stadium_name: "Stade 5 Juillet 1962",
    location: "Algiers, Caroubier",
    latitude: 36.7538,
    longitude: 3.0588,
    capacity: 11,
    surface_type: "Natural Grass",
    amenities: ["Parking", "Locker Rooms", "Lighting", "VIP Areas", "Cafeteria"],
    price_per_hour: 5000,
    rating: 4.9,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&auto=format&fit=crop"
  },
  {
    stadium_id: 2,
    stadium_name: "Complexe Sportif Bab Ezzouar",
    location: "Algiers, Bab Ezzouar",
    latitude: 36.7200,
    longitude: 3.1800,
    capacity: 11,
    surface_type: "Artificial Turf",
    amenities: ["Parking", "Locker Rooms", "Lighting", "Sound System"],
    price_per_hour: 3500,
    rating: 4.7,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop"
  },
  {
    stadium_id: 3,
    stadium_name: "Terrain El Harrach",
    location: "Algiers, El Harrach",
    latitude: 36.7150,
    longitude: 3.1350,
    capacity: 11,
    surface_type: "Artificial Turf",
    amenities: ["Parking", "Lighting", "Showers"],
    price_per_hour: 2500,
    rating: 4.3,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop"
  },
  {
    stadium_id: 4,
    stadium_name: "Mini Stade Hussein Dey",
    location: "Algiers, Hussein Dey",
    latitude: 36.7450,
    longitude: 3.1000,
    capacity: 7,
    surface_type: "Artificial Turf",
    amenities: ["Lighting", "Showers"],
    price_per_hour: 2000,
    rating: 4.1,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800&auto=format&fit=crop"
  },
  {
    stadium_id: 5,
    stadium_name: "Complexe Riadhi Bir Mourad Rais",
    location: "Algiers, Bir Mourad Rais",
    latitude: 36.7350,
    longitude: 3.0400,
    capacity: 11,
    surface_type: "Natural Grass",
    amenities: ["Parking", "Locker Rooms", "Lighting", "VIP Areas", "Cafeteria", "Medical Room"],
    price_per_hour: 4500,
    rating: 4.8,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1587384474964-3a06ce1ce699?w=800&auto=format&fit=crop"
  },
  {
    stadium_id: 6,
    stadium_name: "Terrain Kouba",
    location: "Algiers, Kouba",
    latitude: 36.7280,
    longitude: 3.0650,
    capacity: 7,
    surface_type: "Hybrid",
    amenities: ["Parking", "Lighting"],
    price_per_hour: 1800,
    rating: 4.0,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop"
  },
  {
    stadium_id: 7,
    stadium_name: "Stade Mustapha Tchaker",
    location: "Blida, Centre",
    latitude: 36.4700,
    longitude: 2.8300,
    capacity: 11,
    surface_type: "Natural Grass",
    amenities: ["Parking", "Locker Rooms", "Lighting", "VIP Areas", "Medical Room", "Press Room"],
    price_per_hour: 6000,
    rating: 4.9,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&auto=format&fit=crop"
  },
  {
    stadium_id: 8,
    stadium_name: "Terrain Sidi Moussa",
    location: "Algiers, Sidi Moussa",
    latitude: 36.6200,
    longitude: 3.0800,
    capacity: 11,
    surface_type: "Artificial Turf",
    amenities: ["Parking", "Lighting", "Showers"],
    price_per_hour: 2200,
    rating: 4.2,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop"
  }
]

// Seed Teams
export const seedTeams: SeedTeam[] = [
  {
    team_id: 1,
    team_name: "FC Algiers United",
    stadium_id: 1,
    status: "full",
    avg_skill: 7.5,
    avg_age: 24,
    player_count: 11
  },
  {
    team_id: 2,
    team_name: "Bab Ezzouar FC",
    stadium_id: 2,
    status: "need player",
    avg_skill: 6.8,
    avg_age: 23,
    player_count: 9
  },
  {
    team_id: 3,
    team_name: "El Harrach Stars",
    stadium_id: 3,
    status: "need player",
    avg_skill: 6.2,
    avg_age: 25,
    player_count: 7
  },
  {
    team_id: 4,
    team_name: "Hussein Dey Warriors",
    stadium_id: 4,
    status: "full",
    avg_skill: 7.0,
    avg_age: 26,
    player_count: 7
  },
  {
    team_id: 5,
    team_name: "BMR Eagles",
    stadium_id: 5,
    status: "need player",
    avg_skill: 8.0,
    avg_age: 27,
    player_count: 8
  },
  {
    team_id: 6,
    team_name: "Kouba FC",
    stadium_id: 6,
    status: "need player",
    avg_skill: 5.5,
    avg_age: 22,
    player_count: 5
  }
]

// Seed Schedules
export const seedSchedules: SeedSchedule[] = [
  {
    schedule_id: 1,
    stadium_id: 1,
    team_id: 1,
    match_date: "2026-01-05",
    start_time: "18:00",
    end_time: "20:00",
    status: "scheduled"
  },
  {
    schedule_id: 2,
    stadium_id: 2,
    team_id: 2,
    match_date: "2026-01-06",
    start_time: "16:00",
    end_time: "18:00",
    status: "scheduled"
  },
  {
    schedule_id: 3,
    stadium_id: 3,
    team_id: 3,
    match_date: "2026-01-07",
    start_time: "19:00",
    end_time: "21:00",
    status: "scheduled"
  },
  {
    schedule_id: 4,
    stadium_id: 5,
    team_id: 5,
    match_date: "2026-01-08",
    start_time: "17:00",
    end_time: "19:00",
    status: "scheduled"
  },
  {
    schedule_id: 5,
    stadium_id: 1,
    team_id: 1,
    match_date: "2025-12-20",
    start_time: "18:00",
    end_time: "20:00",
    status: "completed"
  },
  {
    schedule_id: 6,
    stadium_id: 2,
    team_id: 4,
    match_date: "2025-12-22",
    start_time: "16:00",
    end_time: "18:00",
    status: "completed"
  }
]

// Seed Matches
export const seedMatches: SeedMatch[] = [
  {
    match_id: 1,
    schedule_id: 5,
    team1_id: 1,
    team2_id: 2,
    status: "completed",
    entry_fee: 500,
    total_prize_pool: 5500,
    winner_team_id: 1
  },
  {
    match_id: 2,
    schedule_id: 6,
    team1_id: 4,
    team2_id: 3,
    status: "completed",
    entry_fee: 400,
    total_prize_pool: 2800,
    winner_team_id: 4
  },
  {
    match_id: 3,
    schedule_id: 1,
    team1_id: 1,
    team2_id: 5,
    status: "scheduled",
    entry_fee: 600,
    total_prize_pool: 6600,
    winner_team_id: null
  },
  {
    match_id: 4,
    schedule_id: 2,
    team1_id: 2,
    team2_id: 6,
    status: "scheduled",
    entry_fee: 350,
    total_prize_pool: 3150,
    winner_team_id: null
  }
]

// Seed Transactions
export const seedTransactions: SeedTransaction[] = [
  {
    transaction_id: 1,
    user_id: 1,
    type: "deposit",
    amount: 10000,
    description: "Initial wallet deposit",
    created_at: "2024-01-20T10:00:00Z",
    balance_after: 10000
  },
  {
    transaction_id: 2,
    user_id: 1,
    type: "entry_fee",
    amount: -500,
    description: "Match entry fee - FC Algiers United vs Bab Ezzouar FC",
    created_at: "2024-12-19T15:00:00Z",
    balance_after: 9500
  },
  {
    transaction_id: 3,
    user_id: 1,
    type: "prize",
    amount: 2500,
    description: "Match prize - Victory against Bab Ezzouar FC",
    created_at: "2024-12-20T20:30:00Z",
    balance_after: 12000
  },
  {
    transaction_id: 4,
    user_id: 1,
    type: "deposit",
    amount: 5000,
    description: "Wallet top-up",
    created_at: "2024-12-25T11:00:00Z",
    balance_after: 17000
  },
  {
    transaction_id: 5,
    user_id: 1,
    type: "entry_fee",
    amount: -600,
    description: "Match entry fee - FC Algiers United vs BMR Eagles",
    created_at: "2025-01-02T14:00:00Z",
    balance_after: 16400
  },
  {
    transaction_id: 6,
    user_id: 1,
    type: "withdrawal",
    amount: -1400,
    description: "Withdrawal to bank account",
    created_at: "2025-01-03T09:00:00Z",
    balance_after: 15000
  },
  {
    transaction_id: 7,
    user_id: 2,
    type: "deposit",
    amount: 5000,
    description: "Initial wallet deposit",
    created_at: "2024-02-25T12:00:00Z",
    balance_after: 5000
  },
  {
    transaction_id: 8,
    user_id: 2,
    type: "entry_fee",
    amount: -500,
    description: "Match entry fee",
    created_at: "2024-12-19T15:00:00Z",
    balance_after: 4500
  },
  {
    transaction_id: 9,
    user_id: 2,
    type: "deposit",
    amount: 4000,
    description: "Wallet top-up",
    created_at: "2024-12-28T10:00:00Z",
    balance_after: 8500
  },
  {
    transaction_id: 10,
    user_id: 3,
    type: "deposit",
    amount: 15000,
    description: "Initial wallet deposit",
    created_at: "2023-11-15T09:00:00Z",
    balance_after: 15000
  },
  {
    transaction_id: 11,
    user_id: 3,
    type: "prize",
    amount: 8000,
    description: "Multiple match winnings",
    created_at: "2024-12-30T18:00:00Z",
    balance_after: 23000
  },
  {
    transaction_id: 12,
    user_id: 3,
    type: "withdrawal",
    amount: -1000,
    description: "Partial withdrawal",
    created_at: "2025-01-01T10:00:00Z",
    balance_after: 22000
  }
]

// Seed Team Members
export const seedTeamMembers: SeedTeamMember[] = [
  { id: 1, team_id: 1, user_id: 1, assigned_position: "FWD", has_paid: true },
  { id: 2, team_id: 1, user_id: 3, assigned_position: "GK", has_paid: true },
  { id: 3, team_id: 1, user_id: 4, assigned_position: "DEF", has_paid: true },
  { id: 4, team_id: 2, user_id: 2, assigned_position: "FWD", has_paid: true },
  { id: 5, team_id: 2, user_id: 5, assigned_position: "MID", has_paid: true },
  { id: 6, team_id: 3, user_id: 6, assigned_position: "MID", has_paid: false },
  { id: 7, team_id: 5, user_id: 1, assigned_position: "MID", has_paid: true }
]

// Seed Reviews
export const seedReviews: SeedReview[] = [
  {
    review_id: 1,
    stadium_id: 1,
    user_id: 1,
    rating: 5,
    comment: "Excellent pitch quality and facilities. Best stadium in Algiers!",
    created_at: "2024-12-21T21:00:00Z"
  },
  {
    review_id: 2,
    stadium_id: 1,
    user_id: 3,
    rating: 5,
    comment: "Professional level pitch. The lighting is perfect for evening matches.",
    created_at: "2024-12-22T19:00:00Z"
  },
  {
    review_id: 3,
    stadium_id: 2,
    user_id: 2,
    rating: 4,
    comment: "Great artificial turf, very well maintained. Good parking facilities.",
    created_at: "2024-12-23T20:00:00Z"
  },
  {
    review_id: 4,
    stadium_id: 3,
    user_id: 5,
    rating: 4,
    comment: "Affordable and decent quality. Good for casual matches.",
    created_at: "2024-12-24T18:00:00Z"
  },
  {
    review_id: 5,
    stadium_id: 5,
    user_id: 4,
    rating: 5,
    comment: "Top-notch facilities. The medical room and VIP areas are a great plus.",
    created_at: "2024-12-26T17:00:00Z"
  },
  {
    review_id: 6,
    stadium_id: 7,
    user_id: 1,
    rating: 5,
    comment: "Historic stadium with amazing atmosphere. Worth the trip to Blida!",
    created_at: "2024-12-28T16:00:00Z"
  }
]

// Helper function to get user by ID
export const getSeedUserById = (userId: number): SeedUser | undefined => {
  return seedUsers.find(u => u.user_id === userId)
}

// Helper function to get stadium by ID
export const getSeedStadiumById = (stadiumId: number): SeedStadium | undefined => {
  return seedStadiums.find(s => s.stadium_id === stadiumId)
}

// Helper function to get teams by user ID
export const getSeedTeamsByUserId = (userId: number): SeedTeam[] => {
  const memberTeamIds = seedTeamMembers.filter(m => m.user_id === userId).map(m => m.team_id)
  return seedTeams.filter(t => memberTeamIds.includes(t.team_id))
}

// Helper function to get transactions by user ID
export const getSeedTransactionsByUserId = (userId: number): SeedTransaction[] => {
  return seedTransactions.filter(t => t.user_id === userId).sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

// Helper function to get reviews by stadium ID
export const getSeedReviewsByStadiumId = (stadiumId: number): SeedReview[] => {
  return seedReviews.filter(r => r.stadium_id === stadiumId)
}
