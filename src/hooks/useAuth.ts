"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCurrentUser, getUserIdFromToken, logout as logoutAuth } from "@/lib/auth"
import type { AuthUser } from "@/lib/auth"

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true)

        // Get token from localStorage
        const token = localStorage.getItem("auth_token")
        if (!token) {
          setUser(null)
          navigate("/login")
          return
        }

        // Extract user ID from token
        const userId = getUserIdFromToken(token)
        if (!userId) {
          setUser(null)
          navigate("/login")
          return
        }

        // Fetch user data from database
        const currentUser = await getCurrentUser(userId)
        if (currentUser) {
          setUser(currentUser)
        } else {
          setUser(null)
          navigate("/login")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Auth error")
        setUser(null)
        navigate("/login")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [navigate])

  const handleLogout = () => {
    logoutAuth()
    setUser(null)
    navigate("/login")
  }

  return {
    user,
    loading,
    error,
    logout: handleLogout,
    isAuthenticated: !!user,
  }
}
