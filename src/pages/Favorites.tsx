"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Heart, MapPin, Users, Star, Trash2 } from "lucide-react"
import DashboardLayout from "@/components/DashboardLayout"

const Favorites = () => {
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const [favorites, setFavorites] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [sortBy, setSortBy] = useState<string>("rating")

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.user_id) return

      try {
        // Get favorites from localStorage or create custom table
        const savedFavorites = localStorage.getItem(`favorites_${user.user_id}`)
        if (savedFavorites) {
          const favIds = JSON.parse(savedFavorites)

          const { data, error } = await supabase
            .from("stadiums")
            .select(
              `
              stadium_id,
              stadium_name,
              location,
              latitude,
              longitude,
              capacity,
              surface_type,
              amenities,
              price_per_hour,
              rating,
              status
            `,
            )
            .in("stadium_id", favIds)

          if (error) throw error

          const sortedData = data || []
          if (sortBy === "rating") {
            sortedData.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          } else if (sortBy === "price") {
            sortedData.sort((a, b) => (a.price_per_hour || 0) - (b.price_per_hour || 0))
          }

          setFavorites(sortedData)
        } else {
          setFavorites([])
        }
      } catch (error) {
        console.error("[v0] Error fetching favorites:", error)
        toast({
          title: "Error",
          description: "Failed to load favorites",
          variant: "destructive",
        })
      } finally {
        setDataLoading(false)
      }
    }

    fetchFavorites()
  }, [user, sortBy, toast])

  const removeFavorite = (stadiumId: number) => {
    const savedFavorites = localStorage.getItem(`favorites_${user?.user_id}`)
    if (savedFavorites) {
      const favIds = JSON.parse(savedFavorites).filter((id: number) => id !== stadiumId)
      localStorage.setItem(`favorites_${user?.user_id}`, JSON.stringify(favIds))
      setFavorites(favorites.filter((f) => f.stadium_id !== stadiumId))
      toast({
        title: "Success",
        description: "Removed from favorites",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-bold">Loading...</p>
      </div>
    )
  }

  return (
    <DashboardLayout title="Saved Stadiums">
      {/* Sort Options */}
      {favorites.length > 0 && (
        <Card className="border-2 border-foreground mb-6">
          <CardContent className="p-4">
            <label className="block text-sm font-black uppercase mb-2">Sort By</label>
            <div className="flex gap-2 flex-wrap">
              {["rating", "price"].map((sort) => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`py-2 px-4 rounded-lg border-2 font-bold uppercase text-sm transition-all ${
                    sortBy === sort
                      ? "bg-primary text-primary-foreground border-foreground"
                      : "bg-secondary border-foreground hover:bg-secondary/80"
                  }`}
                >
                  {sort === "rating" ? "Highest Rated" : "Lowest Price"}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stadiums Grid */}
      {dataLoading ? (
        <p className="text-center text-foreground/60">Loading stadiums...</p>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {favorites.map((stadium) => (
            <Card
              key={stadium.stadium_id}
              className="border-2 border-foreground shadow-neo-lg hover:shadow-neo-xl transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{stadium.stadium_name}</CardTitle>
                    <Badge variant={stadium.status === "active" ? "default" : "secondary"}>{stadium.status}</Badge>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Star className="size-5 text-yellow-500 fill-yellow-500" strokeWidth={2.5} />
                      <span className="font-black">{stadium.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 border-t-2 border-foreground pt-4">
                {/* Location */}
                <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                  <MapPin className="size-5 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <div className="flex-1">
                    <p className="font-black text-sm uppercase">{stadium.location}</p>
                    <p className="text-xs text-foreground/60 mt-1">
                      {stadium.latitude.toFixed(2)}, {stadium.longitude.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-foreground/20">
                  <div>
                    <p className="text-xs font-bold uppercase text-foreground/60">Capacity</p>
                    <p className="text-lg font-black flex items-center gap-1">
                      <Users className="size-4" strokeWidth={2.5} />
                      {stadium.capacity}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-foreground/60">Price/Hour</p>
                    <p className="text-lg font-black">{stadium.price_per_hour} DZD</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-bold uppercase text-foreground/60">Surface Type</p>
                    <p className="text-sm font-bold mt-1">{stadium.surface_type}</p>
                  </div>
                </div>

                {/* Amenities */}
                {stadium.amenities && stadium.amenities.length > 0 && (
                  <div className="pt-2 border-t border-foreground/20">
                    <p className="text-xs font-bold uppercase text-foreground/60 mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {stadium.amenities.map((amenity: string, idx: number) => (
                        <Badge key={idx} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Remove Button */}
                <Button
                  onClick={() => removeFavorite(stadium.stadium_id)}
                  variant="outline"
                  className="w-full gap-2 bg-transparent hover:bg-red-500/10"
                >
                  <Trash2 className="size-4" strokeWidth={2.5} />
                  Remove from Favorites
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-foreground">
          <CardContent className="p-12 text-center">
            <Heart className="size-12 mx-auto mb-4 text-foreground/40" strokeWidth={1.5} />
            <p className="text-lg font-black mb-4">No Saved Stadiums</p>
            <p className="text-foreground/60 mb-6">Save your favorite stadiums to access them quickly</p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}

export default Favorites
