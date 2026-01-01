"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  MapPin,
  Users,
  Star,
  Clock,
  ChevronLeft,
  Check,
  Calendar,
  Phone,
  Mail,
  Bookmark,
  Share2
} from "lucide-react"
import { seedStadiums, seedReviews, getSeedReviewsByStadiumId, seedUsers } from "@/lib/seedData"

const StadiumDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const [stadium, setStadium] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

  useEffect(() => {
    // Use seed data
    const stadiumId = parseInt(id || "1")
    const foundStadium = seedStadiums.find(s => s.stadium_id === stadiumId)
    const stadiumReviews = getSeedReviewsByStadiumId(stadiumId).map(review => ({
      ...review,
      username: seedUsers.find(u => u.user_id === review.user_id)?.username || "Anonymous"
    }))

    setStadium(foundStadium)
    setReviews(stadiumReviews)
    setLoading(false)
  }, [id])

  const timeSlots = [
    "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"
  ]

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select a date and time slot",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Booking Request Sent",
      description: `Your booking for ${stadium.stadium_name} on ${selectedDate} at ${selectedTime} has been submitted.`
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link Copied",
      description: "Stadium link copied to clipboard"
    })
  }

  const handleSave = () => {
    toast({
      title: "Saved",
      description: "Stadium added to your favorites"
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-bold">Loading...</p>
      </div>
    )
  }

  if (!stadium) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 text-center py-16">
            <h1 className="text-3xl font-black uppercase mb-4">Stadium Not Found</h1>
            <p className="mb-6">The stadium you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/stadiums">Browse Stadiums</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            to="/stadiums"
            className="inline-flex items-center gap-2 font-bold text-foreground/70 hover:text-foreground mb-6 transition-colors"
          >
            <ChevronLeft className="size-5" strokeWidth={2.5} />
            Back to Stadiums
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stadium Image */}
              <div className="relative overflow-hidden rounded-xl border-2 border-foreground shadow-neo-lg">
                <img
                  src={stadium.imageUrl}
                  alt={stadium.stadium_name}
                  className="w-full h-64 lg:h-96 object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSave}
                    className="bg-background/90 backdrop-blur-sm"
                  >
                    <Bookmark className="size-4" strokeWidth={2.5} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="bg-background/90 backdrop-blur-sm"
                  >
                    <Share2 className="size-4" strokeWidth={2.5} />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge variant="primary" className="text-sm">
                    <Star className="size-4 mr-1 fill-current" strokeWidth={2.5} />
                    {stadium.rating.toFixed(1)}
                  </Badge>
                </div>
              </div>

              {/* Stadium Info */}
              <Card className="border-2 border-foreground">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl lg:text-3xl mb-2">{stadium.stadium_name}</CardTitle>
                      <div className="flex items-center gap-2 text-foreground/70">
                        <MapPin className="size-5" strokeWidth={2.5} />
                        <span className="font-bold">{stadium.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-primary">{stadium.price_per_hour} DZD</p>
                      <p className="text-sm font-bold text-foreground/60">per hour</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-secondary/50 rounded-lg border border-foreground/20">
                      <Users className="size-6 mx-auto mb-2" strokeWidth={2.5} />
                      <p className="text-2xl font-black">{stadium.capacity}</p>
                      <p className="text-xs font-bold uppercase text-foreground/60">Capacity</p>
                    </div>
                    <div className="text-center p-4 bg-secondary/50 rounded-lg border border-foreground/20">
                      <Star className="size-6 mx-auto mb-2 text-yellow-500" strokeWidth={2.5} />
                      <p className="text-2xl font-black">{stadium.rating}</p>
                      <p className="text-xs font-bold uppercase text-foreground/60">Rating</p>
                    </div>
                    <div className="text-center p-4 bg-secondary/50 rounded-lg border border-foreground/20">
                      <Badge className="mb-2">{stadium.surface_type}</Badge>
                      <p className="text-xs font-bold uppercase text-foreground/60 mt-2">Surface</p>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h3 className="font-black uppercase text-sm mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {stadium.amenities.map((amenity: string) => (
                        <Badge key={amenity} variant="outline" className="gap-1">
                          <Check className="size-3" strokeWidth={3} />
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card className="border-2 border-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="size-5" strokeWidth={2.5} />
                    Reviews ({reviews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review.review_id}
                          className="p-4 bg-secondary/30 rounded-lg border border-foreground/20"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center border-2 border-foreground">
                                <span className="text-primary-foreground font-black text-sm">
                                  {review.username.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-bold">{review.username}</p>
                                <p className="text-xs text-foreground/60">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="size-4 fill-yellow-500 text-yellow-500" strokeWidth={2.5} />
                              ))}
                            </div>
                          </div>
                          <p className="font-medium">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-foreground/60">No reviews yet</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Booking Sidebar */}
            <div className="space-y-6">
              <Card className="border-2 border-foreground shadow-neo-lg sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="size-5" strokeWidth={2.5} />
                    Book This Stadium
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-black uppercase tracking-tight mb-2">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full h-12 px-4 rounded-lg border-2 border-foreground font-bold shadow-neo-sm focus:shadow-neo focus:translate-y-[-2px] transition-all"
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-black uppercase tracking-tight mb-2">
                      Select Time
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-3 rounded-lg border-2 font-bold text-sm transition-all ${
                            selectedTime === time
                              ? "bg-primary text-primary-foreground border-foreground shadow-neo-sm"
                              : "bg-secondary border-foreground hover:bg-secondary/80"
                          }`}
                        >
                          <Clock className="size-3 inline mr-1" strokeWidth={2.5} />
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="p-4 bg-secondary/50 rounded-lg border border-foreground/20">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Price per hour</span>
                      <span className="font-black">{stadium.price_per_hour} DZD</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Duration</span>
                      <span className="font-black">2 hours</span>
                    </div>
                    <div className="border-t-2 border-foreground pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-black uppercase">Total</span>
                        <span className="text-xl font-black text-primary">
                          {stadium.price_per_hour * 2} DZD
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleBooking} className="w-full h-12" size="lg">
                    Book Now
                  </Button>

                  <p className="text-xs text-center text-foreground/60">
                    No payment required now. Pay at the stadium.
                  </p>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card className="border-2 border-foreground">
                <CardHeader>
                  <CardTitle className="text-lg">Contact Stadium</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Phone className="size-4" strokeWidth={2.5} />
                    +213 555 123 456
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Mail className="size-4" strokeWidth={2.5} />
                    contact@stadium.dz
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default StadiumDetail
