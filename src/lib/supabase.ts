import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// JWT Token Management
export const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token")
}

export const setAuthToken = (token: string): void => {
  localStorage.setItem("auth_token", token)
}

export const removeAuthToken = (): void => {
  localStorage.removeItem("auth_token")
}

export const getAuthHeaders = () => {
  const token = getAuthToken()
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  }
}
