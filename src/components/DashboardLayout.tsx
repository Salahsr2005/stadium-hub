"use client"

import type React from "react"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Calendar,
  Search,
  Heart,
  Settings,
  Menu,
  X,
  Bell,
  Users,
  MapPin,
  TrendingUp,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  showTabs?: boolean
}

const navSections = [
  {
    label: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
      { icon: Users, label: "My Teams", href: "/dashboard/teams" },
      { icon: Search, label: "Browse", href: "/dashboard/browse" },
    ],
  },
  {
    label: "Venues & Scheduling",
    items: [
      { icon: MapPin, label: "Stadiums", href: "/dashboard/stadiums" },
      { icon: Calendar, label: "Scheduling", href: "/dashboard/scheduling" },
    ],
  },
  {
    label: "Management",
    items: [
      { icon: TrendingUp, label: "Balance", href: "/dashboard/balance" },
      { icon: Heart, label: "Favorites", href: "/dashboard/favorites" },
      { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    ],
  },
]

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r-4 border-foreground transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b-4 border-foreground">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary border-2 border-foreground rounded-lg shadow-neo-sm flex items-center justify-center">
                <span className="text-primary-foreground font-black text-xl">S</span>
              </div>
              <span className="font-black text-xl uppercase tracking-tighter">StadiumHub</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
            {navSections.map((section) => (
              <div key={section.label}>
                <p className="text-xs font-black uppercase text-foreground/50 px-2 mb-2">{section.label}</p>
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 py-3 px-4 rounded-lg font-bold uppercase text-sm transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground border-2 border-foreground shadow-neo-sm"
                            : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        <item.icon className="size-5" strokeWidth={2.5} />
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}

            <Link
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg font-bold uppercase text-sm transition-all ${
                location.pathname === "/profile"
                  ? "bg-primary text-primary-foreground border-2 border-foreground shadow-neo-sm"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <Users className="size-5" strokeWidth={2.5} />
              Profile
            </Link>
          </nav>

          <div className="p-4 border-t-4 border-foreground">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-secondary border-2 border-foreground rounded-full flex items-center justify-center shadow-neo-sm">
                <span className="font-black">{user?.username?.substring(0, 2).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <p className="font-black text-sm">{user?.username}</p>
                <p className="text-xs font-medium text-foreground/60">Level {user?.current_level}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full text-xs bg-transparent" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 bg-background border-b-4 border-foreground px-4 lg:px-6 py-4 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 border-2 border-foreground rounded-lg shadow-neo-sm active:translate-y-0.5 active:shadow-none transition-all"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <X className="size-6" strokeWidth={2.5} />
                ) : (
                  <Menu className="size-6" strokeWidth={2.5} />
                )}
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-black uppercase tracking-tight">{title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 bg-secondary border-2 border-foreground rounded-lg shadow-neo-sm hover:shadow-neo transition-all">
                <Bell className="size-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  )
}

export default DashboardLayout
