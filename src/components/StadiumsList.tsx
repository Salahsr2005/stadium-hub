"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getNearbyStadiums } from "@/lib/api"
import { MapPin, Star, Users, Clock, TrendingUp } from "lucide-react"

interface Stadium {
  stadium_id: number
  stadium_name: string
  location: string
  latitude: number
  longitude: number
  capacity: number
  price_per_hour: number
  rating: number
  distance?: number
  image_url?: string
}

interface StadiumsListProps {
  userLatitude?: number
  userLongitude?: number
  onStadiumSelect?: (stadium: Stadium) => void
}

export const StadiumsList = ({ userLatitude, userLongitude, onStadiumSelect }: StadiumsListProps) => {
  const [stadiums, setStadiums] = useState<Stadium[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "price">("distance")

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        setLoading(true)
        const data = await getNearbyStadiums(userLatitude, userLongitude)
        setStadiums(data || [])
      } catch (error) {
        console.error("[v0] Error fetching stadiums:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStadiums()
  }, [userLatitude, userLongitude])

  const sortedStadiums = [...stadiums].sort((a, b) => {
    switch (sortBy) {
      case "distance":
        return (a.distance || 999) - (b.distance || 999)
      case "rating":
        return b.rating - a.rating
      case "price":
        return a.price_per_hour - b.price_per_hour
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="font-medium text-foreground/60">Loading stadiums...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-bold uppercase text-foreground/60">Sort by:</span>
        {(["distance", "rating", "price"] as const).map((option) => (
          <Button
            key={option}
            variant={sortBy === option ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy(option)}
            className="capitalize"
          >
            {option}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedStadiums.length > 0 ? (
          sortedStadiums.map((stadium) => (
            <Card
              key={stadium.stadium_id}
              className="hover:shadow-neo-xl cursor-pointer transition-all group border-2 border-foreground overflow-hidden flex flex-col"
              onClick={() => onStadiumSelect?.(stadium)}
            >
              <div className="w-full h-40 bg-secondary/50 overflow-hidden border-b-2 border-foreground">
                <img
                  src={stadium.image_url || `/placeholder.svg?height=160&width=400&query=${stadium.stadium_name}`}
                  alt={stadium.stadium_name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <CardHeader className="pb-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {stadium.stadium_name}
                    </CardTitle>
                    <p className="text-xs font-medium text-foreground/60 mt-1 flex items-center gap-1">
                      <MapPin className="size-3" strokeWidth={2.5} />
                      {stadium.location}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {stadium.distance !== undefined && (
                    <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded border border-foreground/20">
                      <MapPin className="size-4 text-primary" strokeWidth={2.5} />
                      <span className="font-bold">{stadium.distance}km</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded border border-foreground/20">
                    <Users className="size-4 text-primary" strokeWidth={2.5} />
                    <span className="font-bold">{stadium.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded border border-foreground/20">
                    <Star className="size-4 text-yellow-500 fill-yellow-500" strokeWidth={2.5} />
                    <span className="font-bold">{(stadium.rating || 4.5).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded border border-foreground/20">
                    <Clock className="size-4 text-primary" strokeWidth={2.5} />
                    <span className="font-bold">{stadium.price_per_hour || 2500} DZD</span>
                  </div>
                </div>

                <Link to={`/stadium/${stadium.stadium_id}`} className="block w-full">
                  <Button
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground bg-transparent"
                    variant="outline"
                    size="sm"
                  >
                    View Details
                    <TrendingUp
                      className="size-3 ml-1 group-hover:translate-x-1 transition-transform"
                      strokeWidth={2.5}
                    />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center p-6">
            <p className="font-medium text-foreground/60">No stadiums found</p>
          </div>
        )}
      </div>
    </div>
  )
}
