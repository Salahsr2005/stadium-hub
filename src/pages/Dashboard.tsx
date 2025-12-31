import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Calendar,
  Search,
  Heart,
  Settings,
  Menu,
  X,
  Bell,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "My Bookings", href: "/dashboard/bookings" },
  { icon: Search, label: "Browse", href: "/stadiums" },
  { icon: Heart, label: "Favorites", href: "/dashboard/favorites" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const stats = [
  { label: "Total Bookings", value: "24", trend: "+12%", up: true, icon: Calendar },
  { label: "Upcoming", value: "3", trend: "This week", up: true, icon: Clock },
  { label: "Favorites", value: "8", trend: "+2 new", up: true, icon: Heart },
  { label: "Total Spent", value: "$4,250", trend: "+8%", up: true, icon: TrendingUp },
];

const recentBookings = [
  {
    id: "1",
    stadium: "Riverside Arena",
    date: "Jan 15, 2025",
    time: "2:00 PM - 5:00 PM",
    status: "upcoming",
    price: "$1,500",
  },
  {
    id: "2",
    stadium: "Olympic Complex",
    date: "Jan 10, 2025",
    time: "10:00 AM - 2:00 PM",
    status: "completed",
    price: "$4,800",
  },
  {
    id: "3",
    stadium: "City Central Field",
    date: "Jan 5, 2025",
    time: "6:00 PM - 9:00 PM",
    status: "completed",
    price: "$2,250",
  },
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r-4 border-foreground transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b-4 border-foreground">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary border-2 border-foreground rounded-lg shadow-neo-sm flex items-center justify-center">
                <span className="text-primary-foreground font-black text-xl">S</span>
              </div>
              <span className="font-black text-xl uppercase tracking-tighter">StadiumHub</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center gap-3 py-3 px-4 rounded-lg font-bold uppercase text-sm transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground border-2 border-foreground shadow-neo-sm"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon className="size-5" strokeWidth={2.5} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t-4 border-foreground">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary border-2 border-foreground rounded-full flex items-center justify-center shadow-neo-sm">
                <span className="font-black">JD</span>
              </div>
              <div>
                <p className="font-black text-sm">John Doe</p>
                <p className="text-xs font-medium text-foreground/60">john@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
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
                <h1 className="text-xl lg:text-2xl font-black uppercase tracking-tight">
                  Welcome Back, John
                </h1>
                <p className="text-sm font-medium text-foreground/60 hidden sm:block">
                  Here's what's happening with your bookings
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 bg-secondary border-2 border-foreground rounded-lg shadow-neo-sm hover:shadow-neo transition-all">
                <Bell className="size-5" strokeWidth={2.5} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs font-black rounded-full flex items-center justify-center border border-foreground">
                  3
                </span>
              </button>
              <div className="hidden sm:flex w-10 h-10 bg-primary border-2 border-foreground rounded-full items-center justify-center shadow-neo-sm">
                <span className="font-black text-primary-foreground">JD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs lg:text-sm font-black uppercase tracking-tight text-foreground/60 mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl lg:text-4xl font-black">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {stat.up ? (
                          <TrendingUp className="size-4 text-green-600" strokeWidth={2.5} />
                        ) : (
                          <TrendingDown className="size-4 text-red-600" strokeWidth={2.5} />
                        )}
                        <span className="text-xs font-bold text-foreground/60">{stat.trend}</span>
                      </div>
                    </div>
                    <div className="p-2 lg:p-3 bg-secondary rounded-lg border-2 border-foreground">
                      <stat.icon className="size-5 lg:size-6" strokeWidth={2.5} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-neo-xl cursor-pointer group" onClick={() => {}}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary rounded-lg border-2 border-foreground">
                  <Search className="size-6 text-primary-foreground" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-black uppercase text-sm">Browse Stadiums</h3>
                  <p className="text-xs font-medium text-foreground/60">Find your next venue</p>
                </div>
                <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
              </CardContent>
            </Card>
            <Card className="hover:shadow-neo-xl cursor-pointer group" onClick={() => {}}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-secondary rounded-lg border-2 border-foreground">
                  <Calendar className="size-6" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-black uppercase text-sm">New Booking</h3>
                  <p className="text-xs font-medium text-foreground/60">Schedule an event</p>
                </div>
                <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
              </CardContent>
            </Card>
            <Card className="hover:shadow-neo-xl cursor-pointer group" onClick={() => {}}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-secondary rounded-lg border-2 border-foreground">
                  <Heart className="size-6" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-black uppercase text-sm">My Favorites</h3>
                  <p className="text-xs font-medium text-foreground/60">View saved venues</p>
                </div>
                <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl lg:text-2xl">Recent Bookings</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/bookings">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-secondary/50 rounded-lg border-2 border-foreground hover:bg-secondary transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-black uppercase">{booking.stadium}</h4>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm font-medium text-foreground/70">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-4" strokeWidth={2.5} />
                          {booking.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-4" strokeWidth={2.5} />
                          {booking.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={booking.status === "upcoming" ? "primary" : "default"}
                      >
                        {booking.status}
                      </Badge>
                      <span className="font-black text-lg">{booking.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
