"use client"

import type React from "react"
import SchedulingManagement from "./pages/SchedulingManagement"
import Balance from "./pages/Balance"

import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Index from "./pages/Index"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/Profile"
import Stadiums from "./pages/Stadiums"
import StadiumDetail from "./pages/StadiumDetail"
import MyTeams from "./pages/MyTeams"
import Browse from "./pages/Browse"
import Favorites from "./pages/Favorites"
import Settings from "./pages/Settings"
import Wallet from "./pages/Wallet"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient()

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token")
      setIsAuthenticated(!!token)
    }
    checkAuth()
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-bold">Loading...</p>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/teams"
            element={
              <ProtectedRoute>
                <MyTeams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/browse"
            element={
              <ProtectedRoute>
                <Browse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/stadiums"
            element={
              <ProtectedRoute>
                <Stadiums />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/scheduling"
            element={
              <ProtectedRoute>
                <SchedulingManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/balance"
            element={
              <ProtectedRoute>
                <Balance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/stadiums" element={<Stadiums />} />
          <Route path="/stadium/:id" element={<StadiumDetail />} />
          <Route
            path="/dashboard/wallet"
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
