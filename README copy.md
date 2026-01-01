# Stadium Booking & Team Management Platform

A comprehensive full-stack web application for managing stadium bookings, team formations, and player matchmaking in Algeria. Built with React, Vite, and Supabase for real-time data synchronization.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Installation & Setup](#installation--setup)
- [Key Features Guide](#key-features-guide)
- [API Reference](#api-reference)
- [Contributing](#contributing)

## ✨ Features

### Stadium Management
- **Browse Stadiums**: Discover available stadiums with detailed information
- **Stadium Details**: View capacity, pricing, location, and customer reviews
- **Image Gallery**: High-quality images for each stadium
- **Ratings & Reviews**: Community-driven feedback system

### Scheduling System
- **Time Slot Management**: Reserve specific dates and times
- **Real-time Availability**: See booked vs available slots instantly
- **Smart Booking**: Automatic balance deduction upon confirmation
- **Schedule History**: Track all past and upcoming bookings

### Team Management
- **Team Creation**: Form teams with player profiles and skill levels
- **Player Matching**: Find opponents based on skill balance
- **Team Analytics**: View team statistics and performance metrics
- **Roster Management**: Add/remove players and adjust formations

### Financial System
- **Wallet Management**: Top-up and track balance
- **Entry Fees**: Automatic deduction when booking stadiums or teams
- **Transaction History**: Complete audit trail of all financial activities
- **Balance Display**: Real-time balance across all pages

### User System
- **Authentication**: Secure login/registration
- **User Profiles**: Manage personal information and skill levels
- **Favorites**: Save preferred stadiums and teams
- **Statistics**: Track bookings, team performance, and spending

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL via Supabase
- **Real-time**: Supabase Real-time subscriptions
- **Routing**: React Router
- **State Management**: React Hooks + Context API
- **Forms**: React Hook Form with validation
- **Notifications**: Custom Toast system

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── StadiumCard.tsx
│   ├── StadiumsList.tsx
│   ├── SchedulingDashboard.tsx
│   ├── MatchmakingCard.tsx
│   ├── MatchmakingSection.tsx
│   ├── TeamCard.tsx
│   ├── BalanceCard.tsx
│   └── ui/              # shadcn/ui components
├── pages/               # Page components (routes)
│   ├── Dashboard.tsx
│   ├── Stadiums.tsx
│   ├── StadiumDetail.tsx
│   ├── MyTeams.tsx
│   ├── Balance.tsx
│   ├── Wallet.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── lib/                 # Utility functions & services
│   ├── supabase.ts          # Supabase client initialization
│   ├── api.ts               # API endpoints wrapper
│   ├── stadiumService.ts    # Stadium operations
│   ├── schedulingService.ts # Schedule operations
│   ├── balanceService.ts    # Balance & wallet operations
│   ├── seedData.ts          # Seed data for development
│   └── utils.ts             # Helper functions
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication state
│   ├── use-toast.ts     # Toast notifications
│   └── use-mobile.ts    # Mobile detection
├── App.tsx              # Root component
├── main.tsx             # Entry point
├── App.css              # Global styles
└── index.css            # Tailwind imports
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  skill_level INTEGER DEFAULT 5,
  age INTEGER,
  positions TEXT[],
  wallet_balance NUMERIC(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Stadiums Table
```sql
CREATE TABLE stadiums (
  stadium_id SERIAL PRIMARY KEY,
  stadium_name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude NUMERIC(10, 8) NOT NULL,
  longitude NUMERIC(11, 8) NOT NULL,
  capacity INTEGER NOT NULL,
  price_per_hour NUMERIC(10, 2) DEFAULT 2500,
  rating NUMERIC(3, 2) DEFAULT 4.5,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Schedules Table
```sql
CREATE TABLE schedules (
  schedule_id SERIAL PRIMARY KEY,
  stadium_id INTEGER REFERENCES stadiums(stadium_id) ON DELETE CASCADE,
  match_date DATE NOT NULL,
  start_time TIME WITHOUT TIME ZONE NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  UNIQUE(stadium_id, match_date, start_time)
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  transaction_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  type trans_type NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Teams Table
```sql
CREATE TABLE teams (
  team_id SERIAL PRIMARY KEY,
  team_name TEXT NOT NULL,
  stadium_id INTEGER REFERENCES stadiums(stadium_id),
  leader_id INTEGER REFERENCES users(user_id),
  player_count INTEGER DEFAULT 0,
  avg_skill NUMERIC(3, 2) DEFAULT 5,
  avg_age INTEGER,
  status TEXT DEFAULT 'forming',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Team Members Table
```sql
CREATE TABLE team_members (
  member_id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(team_id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(user_id),
  assigned_position TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  stadium_id INTEGER REFERENCES stadiums(stadium_id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(user_id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Supabase account
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stadium-booking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:5173
   ```

4. **Database Setup**
   - Create a new Supabase project
   - Run the SQL scripts from the Database Schema section
   - Enable Row Level Security (RLS) on all tables
   - Set up RLS policies for user data isolation

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

## 📖 Key Features Guide

### Stadium Browsing & Booking
1. Navigate to `/stadiums` to see all available stadiums
2. Click on a stadium card to view details
3. Select date and time from available slots
4. Review the total cost (price_per_hour × 2 hours)
5. Click "Book Now" - balance is automatically deducted
6. Confirmation toast shows booking status

### Team Management
1. Create a team from `/my-teams`
2. Add players from the player pool
3. View team balance score (skill variance analysis)
4. Find matching opponents automatically
5. Pay entry fee to finalize team registration
6. Balance updates in real-time

### Wallet & Balance
1. Go to `/balance` to see current wallet balance
2. Click "Top Up" to add funds
3. Track all transactions with timestamps
4. View entry fees and deposits
5. Balance displays across all booking pages

### Matchmaking System
1. View available opponents on dashboard
2. Filter by skill level and team size
3. Compare team compositions
4. Select opponent and choose stadium/time
5. System validates balance before booking

## 🔌 API Reference

### Stadium Service (`lib/stadiumService.ts`)

```typescript
// Get all stadiums
getStadiumsFromDB(): Promise<Stadium[]>

// Get stadium by ID
getStadiumById(id: number): Promise<Stadium | null>

// Book a stadium
bookStadium(
  stadiumId: number,
  teamId: number,
  userId: number,
  date: string,
  time: string,
  fee: number
): Promise<{ success: boolean; message: string }>
```

### Schedule Service (`lib/schedulingService.ts`)

```typescript
// Get stadium schedules
getStadiumSchedules(stadiumId: number): Promise<ScheduleWithStadium[]>

// Get available time slots
getAvailableSlots(
  stadiumId: number,
  matchDate: string
): Promise<{ time: string; available: boolean }[]>

// Book a schedule
bookSchedule(scheduleId: number): Promise<boolean>

// Get upcoming available schedules
getUpcomingAvailable(days?: number): Promise<ScheduleWithStadium[]>
```

### Balance Service (`lib/balanceService.ts`)

```typescript
// Get user balance
getUserBalance(userId: number): Promise<number>

// Deduct from balance
deductBalance(userId: number, amount: number, type: string): Promise<boolean>

// Add to balance (top-up)
addBalance(userId: number, amount: number): Promise<boolean>

// Get transaction history
getTransactionHistory(userId: number): Promise<Transaction[]>
```

## 🔐 Security & Best Practices

- **Row Level Security**: All tables enforce RLS policies
- **Password Hashing**: Bcrypt for user authentication
- **API Validation**: Input validation on all endpoints
- **Error Handling**: Comprehensive error messages and logging
- **Rate Limiting**: Built-in protection against abuse
- **CORS**: Properly configured for cross-origin requests

## 📝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a Pull Request with description

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🤝 Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact: support@stadium-booking.dz
- Documentation: https://docs.stadium-booking.dz

## 🎯 Future Enhancements

- [ ] Real-time notifications for booking updates
- [ ] In-app messaging between teams
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Video replay integration
- [ ] AI-powered opponent matching
- [ ] Payment gateway integration (Stripe/Paypal)
- [ ] Admin dashboard for stadium management

---

**Last Updated**: 2026-01-01
**Version**: 1.0.0
