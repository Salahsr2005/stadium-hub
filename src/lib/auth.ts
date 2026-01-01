import { supabase } from "./supabase"
import { setAuthToken, removeAuthToken } from "./supabase"
import bcryptjs from "bcryptjs"

export interface AuthUser {
  user_id: number
  username: string
  age: number
  positions: string[]
  initial_level: number
  current_level: number
  wallet_balance: number
  matches_played: number
  latitude?: number
  longitude?: number
}

// Helper to generate a simple JWT-like token
const generateToken = (userId: number, username: string): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      username: username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    }),
  )
  const signature = btoa(`${header}.${payload}`)
  return `${header}.${payload}.${signature}`
}

const hashPassword = async (password: string): Promise<string> => {
  return await bcryptjs.hash(password, 10)
}

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcryptjs.compare(password, hash)
}

export const register = async (
  username: string,
  password: string,
  age: number,
  positions: string[],
  skillLevel: number,
  latitude?: number | null,
  longitude?: number | null,
): Promise<{ token: string; user: AuthUser }> => {
  const { data: existingUser, error: checkError } = await supabase
    .from("users")
    .select("user_id")
    .eq("username", username)
    .single()

  if (!checkError && existingUser) {
    throw new Error("Username already taken")
  }

  const hashedPassword = await hashPassword(password)

  const { data, error } = await supabase
    .from("users")
    .insert({
      username,
      password_hash: hashedPassword,
      age,
      positions,
      initial_level: skillLevel,
      current_level: skillLevel,
      wallet_balance: 0,
      matches_played: 0,
      latitude: latitude || null,
      longitude: longitude || null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const token = generateToken(data.user_id, data.username)
  setAuthToken(token)

  const user: AuthUser = {
    user_id: data.user_id,
    username: data.username,
    age: data.age,
    positions: data.positions,
    initial_level: data.initial_level,
    current_level: data.current_level,
    wallet_balance: data.wallet_balance,
    matches_played: data.matches_played,
    latitude: data.latitude,
    longitude: data.longitude,
  }

  return { token, user }
}

export const login = async (username: string, password: string): Promise<{ token: string; user: AuthUser }> => {
  const { data, error } = await supabase.from("users").select("*").eq("username", username).single()

  if (error || !data) {
    throw new Error("Invalid username or password")
  }

  const passwordValid = await comparePassword(password, data.password_hash)
  if (!passwordValid) {
    throw new Error("Invalid username or password")
  }

  const token = generateToken(data.user_id, data.username)
  setAuthToken(token)

  const user: AuthUser = {
    user_id: data.user_id,
    username: data.username,
    age: data.age,
    positions: data.positions,
    initial_level: data.initial_level,
    current_level: data.current_level,
    wallet_balance: data.wallet_balance,
    matches_played: data.matches_played,
    latitude: data.latitude,
    longitude: data.longitude,
  }

  return { token, user }
}

export const logout = (): void => {
  removeAuthToken()
}

export const getCurrentUser = async (userId: number): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("user_id", userId).single()

    if (error || !data) {
      return null
    }

    return {
      user_id: data.user_id,
      username: data.username,
      age: data.age,
      positions: data.positions,
      initial_level: data.initial_level,
      current_level: data.current_level,
      wallet_balance: data.wallet_balance,
      matches_played: data.matches_played,
      latitude: data.latitude,
      longitude: data.longitude,
    }
  } catch {
    return null
  }
}

export const getUserIdFromToken = (token: string): number | null => {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1]))
    return payload.sub
  } catch {
    return null
  }
}
