"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { getStadiumSchedules } from "@/lib/schedulingService"
import type { ScheduleWithStadium } from "@/lib/schedulingService"

interface SchedulingDashboardProps {
  stadiumId?: number
  onBookSchedule?: (schedule: ScheduleWithStadium) => void
}

export const SchedulingDashboard = ({ stadiumId, onBookSchedule }: SchedulingDashboardProps) => {
  const [schedules, setSchedules] = useState<ScheduleWithStadium[]>([])
  const [selectedFilter, setSelectedFilter] = useState<"all" | "available" | "booked">("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!stadiumId) return

      try {
        setLoading(true)
        const allSchedules = await getStadiumSchedules(stadiumId)
        setSchedules(allSchedules)
      } catch (error) {
        console.error("[v0] Error fetching schedules:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSchedules()
  }, [stadiumId])

  const filteredSchedules = schedules.filter((schedule) => {
    if (selectedFilter === "available") return !schedule.is_booked
    if (selectedFilter === "booked") return schedule.is_booked
    return true
  })

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-2">
        {(["all", "available", "booked"] as const).map((filter) => (
          <Button
            key={filter}
            variant={selectedFilter === filter ? "default" : "outline"}
            onClick={() => setSelectedFilter(filter)}
            className="capitalize"
          >
            {filter === "available" && "🟢 Available"}
            {filter === "booked" && "🔴 Booked"}
            {filter === "all" && "All Slots"}
          </Button>
        ))}
      </div>

      {/* Schedules Grid */}
      {loading ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-foreground/60">Loading schedules...</p>
          </CardContent>
        </Card>
      ) : filteredSchedules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchedules.map((schedule) => (
            <Card
              key={schedule.schedule_id}
              className={`border-2 ${schedule.is_booked ? "border-red-500 opacity-60" : "border-green-500"}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{schedule.stadium?.stadium_name || "Stadium"}</CardTitle>
                  </div>
                  <Badge variant={schedule.is_booked ? "destructive" : "default"}>
                    {schedule.is_booked ? "Booked" : "Available"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Date & Time */}
                <div className="flex items-center gap-3 p-2 bg-secondary/30 rounded">
                  <Calendar className="size-4" strokeWidth={2.5} />
                  <span className="font-bold text-sm">{new Date(schedule.match_date).toLocaleDateString()}</span>
                  <Clock className="size-4" strokeWidth={2.5} />
                  <span className="font-bold text-sm">{schedule.start_time}</span>
                </div>

                {/* Price Info */}
                {schedule.stadium?.price_per_hour && (
                  <div className="p-2 bg-secondary/30 rounded text-center">
                    <p className="text-xs font-bold uppercase text-foreground/60">Price per Hour</p>
                    <p className="font-black">{schedule.stadium.price_per_hour} DZD</p>
                  </div>
                )}

                {!schedule.is_booked && (
                  <Button onClick={() => onBookSchedule?.(schedule)} className="w-full gap-2">
                    <Calendar className="size-4" strokeWidth={2.5} />
                    Book Slot
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-foreground">
          <CardContent className="p-8 text-center">
            <Calendar className="size-12 mx-auto mb-4 text-foreground/40" strokeWidth={1.5} />
            <p className="text-lg font-black mb-2">No Schedules Found</p>
            <p className="text-foreground/60">Check back later for available time slots</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
