"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { SearchBar } from "@/components/SearchBar"
import { StadiumCard } from "@/components/StadiumCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SlidersHorizontal, X, Loader2 } from "lucide-react"
import { getAllStadiums, searchStadiums } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

interface Stadium {
  stadium_id: number
  stadium_name: string
  location: string
  latitude: number
  longitude: number
  capacity: number
  
  
  price_per_hour: number
  rating: number
  status: string
  distance?: number
}

const Stadiums = () => {
  const { user } = useAuth()
  const [stadiums, setStadiums] = useState<Stadium[]>([])
  const [filteredStadiums, setFilteredStadiums] = useState<Stadium[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"recommended" | "distance" | "rating" | "price">("recommended")

  const [filters, setFilters] = useState({
    capacity: "all",
    priceRange: "all",
  
  })

  const capacityFilters = [
    { label: "Any Size", value: "all" },
    { label: "< 5,000", value: "small" },
    { label: "5,000 - 10,000", value: "medium" },
    { label: "10,000+", value: "large" },
  ]

  const priceFilters = [
    { label: "Any Price", value: "all" },
    { label: "Under 500 DZD", value: "budget" },
    { label: "500 DZD - 1,000 DZD", value: "mid" },
    { label: "1,000 DZD+", value: "premium" },
  ]

  const amenityOptions = ["Parking", "Locker Rooms", "Lighting", "Sound System", "VIP Areas"]

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        setLoading(true)

        const filterObj: any = {}
        if (filters.capacity !== "all") {
          filterObj.capacity = filters.capacity
        }
        if (filters.priceRange !== "all") {
          filterObj.priceRange = filters.priceRange
        }

        const data = await getAllStadiums(filterObj)

        if (user && user.latitude && user.longitude) {
          const stadiumsWithDistance = data.map((stadium) => ({
            ...stadium,
            distance: calculateDistance(user.latitude, user.longitude, stadium.latitude, stadium.longitude),
          }))
          setStadiums(stadiumsWithDistance)
        } else {
          setStadiums(data)
        }
      } catch (error) {
        console.error("[v0] Error fetching stadiums:", error)
        setStadiums([])
      } finally {
        setLoading(false)
      }
    }

    fetchStadiums()
  }, [filters, user])

  useEffect(() => {
    let result = [...stadiums]

    if (searchQuery) {
      result = result.filter(
        (stadium) =>
          stadium.stadium_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stadium.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return (a.distance || 999) - (b.distance || 999)
        case "rating":
          return b.rating - a.rating
        case "price":
          return a.price_per_hour - b.price_per_hour
        case "recommended":
        default:
          return b.rating - a.rating
      }
    })

    setFilteredStadiums(result)
  }, [stadiums, searchQuery, sortBy])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      try {
        const results = await searchStadiums(query)
        setStadiums(results)
      } catch (error) {
        console.error("[v0] Search error:", error)
      }
    }
  }





  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c * 10) / 10
  }

  return (
    <DashboardLayout title="Browse Stadiums">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">Find the Perfect Venue</h2>
          <p className="font-medium text-foreground/70">Discover and book stadiums for your next match</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <aside className={`lg:w-72 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card className="sticky top-24">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Filters</CardTitle>
                <button className="lg:hidden" onClick={() => setShowFilters(false)}>
                  <X className="size-5" strokeWidth={2.5} />
                </button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Capacity Filter */}
                <div>
                  <h4 className="font-black uppercase text-sm mb-3">Capacity</h4>
                  <div className="space-y-2">
                    {capacityFilters.map((filter) => (
                      <label key={filter.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="capacity"
                          value={filter.value}
                          checked={filters.capacity === filter.value}
                          onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
                          className="w-5 h-5 border-2 border-foreground accent-primary"
                        />
                        <span className="font-medium">{filter.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h4 className="font-black uppercase text-sm mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {priceFilters.map((filter) => (
                      <label key={filter.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="price"
                          value={filter.value}
                          checked={filters.priceRange === filter.value}
                          onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                          className="w-5 h-5 border-2 border-foreground accent-primary"
                        />
                        <span className="font-medium">{filter.label}</span>
                      </label>
                    ))}
                  </div>
                </div>


                <Button className="w-full">Apply Filters</Button>
                
              </CardContent>
            </Card>
          </aside>

          {/* Stadium Grid */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar onSearch={handleSearch} onFilter={() => setShowFilters(!showFilters)} />
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeFilters.map((filter) => (
                  <Badge key={filter} className="flex items-center gap-1">
                    {filter}
                    <button onClick={() => setActiveFilters(activeFilters.filter((f) => f !== filter))}>
                      <X className="size-3" strokeWidth={3} />
                    </button>
                  </Badge>
                ))}
              
              </div>
            )}

            {/* Results Count & Sort */}
            <div className="flex items-center justify-between mb-6">
              <p className="font-bold">
                <span className="font-black">{loading ? 0 : filteredStadiums.length}</span> stadiums found
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border-2 border-foreground rounded-lg text-sm font-medium"
                >
                  <option value="recommended">Recommended</option>
                  <option value="distance">Nearest</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price">Lowest Price</option>
                </select>
              </div>
            </div>

            {/* Stadium Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="size-8 animate-spin mx-auto mb-2 text-primary" strokeWidth={2} />
                  <p className="font-bold">Loading stadiums...</p>
                </div>
              </div>
            ) : filteredStadiums.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredStadiums.map((stadium) => (
                  <StadiumCard
                    key={stadium.stadium_id}
                    id={stadium.stadium_id.toString()}
                    name={stadium.stadium_name}
                    location={stadium.location}
                    capacity={stadium.capacity}
                    pricePerHour={stadium.price_per_hour}
                    rating={stadium.rating}
                    imageUrl={`/placeholder.svg?height=300&width=400&query=${encodeURIComponent(stadium.stadium_name)}`}
                    featured={stadium.rating >= 4.7}
                    distance={stadium.distance}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-secondary border-2 border-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal className="size-8" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black uppercase mb-2">No Stadiums Found</h3>
                <p className="font-medium text-foreground/70 mb-4">Try adjusting your search or filters</p>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Stadiums
