"use client"

import type React from "react"

import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Eye, EyeOff, Check, MapPin, Loader } from "lucide-react"
import { register } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    username: "",
    age: 18,
    positions: [] as string[],
    skillLevel: 5,
    password: "",
    confirmPassword: "",
    latitude: null as number | null,
    longitude: null as number | null,
    locationName: "",
  })

  const positions = ["GK", "DEF", "MID", "FWD"]

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      })
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
        }))

        // Reverse geocoding to get location name (optional, using free API)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          )
          const data = await response.json()
          setFormData((prev) => ({
            ...prev,
            locationName: data.address?.city || data.address?.town || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          }))
        } catch {
          setFormData((prev) => ({
            ...prev,
            locationName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          }))
        }

        toast({
          title: "Location Found",
          description: "Your location has been captured successfully",
        })
        setLocating(false)
      },
      (error) => {
        setLocating(false)
        toast({
          title: "Location Error",
          description:
            error.code === 1 ? "Permission denied. Please enable location access." : "Failed to get your location",
          variant: "destructive",
        })
      },
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (formData.positions.length === 0) {
        throw new Error("Select at least one position")
      }

      const result = await register(
        formData.username,
        formData.password,
        formData.age,
        formData.positions,
        formData.skillLevel,
        formData.latitude,
        formData.longitude,
      )

      toast({
        title: "Success",
        description: `Welcome, ${result.user.username}!`,
      })
      navigate("/dashboard")
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "number" ? (value ? Number.parseInt(value) : 0) : value,
    })
  }

  const togglePosition = (pos: string) => {
    setFormData({
      ...formData,
      positions: formData.positions.includes(pos)
        ? formData.positions.filter((p) => p !== pos)
        : [...formData.positions, pos],
    })
  }

  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    {
      label: "Contains uppercase letter",
      met: /[A-Z]/.test(formData.password),
    },
    { label: "Contains number", met: /[0-9]/.test(formData.password) },
  ]

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-primary border-2 border-foreground rounded-lg shadow-neo flex items-center justify-center">
            <span className="text-primary-foreground font-black text-2xl">S</span>
          </div>
          <span className="font-black text-2xl uppercase tracking-tighter">StadiumHub</span>
        </Link>

        <Card className="shadow-neo-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <p className="font-medium text-foreground/70">Start booking premium stadiums today</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-black uppercase tracking-tight mb-2">Username</label>
                <Input
                  type="text"
                  name="username"
                  placeholder="choose-username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black uppercase tracking-tight mb-2">Age</label>
                  <Input
                    type="number"
                    name="age"
                    min={10}
                    max={100}
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-black uppercase tracking-tight mb-2">Skill Level</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="range"
                      min={1}
                      max={10}
                      name="skillLevel"
                      value={formData.skillLevel}
                      onChange={handleChange}
                      className="flex-1"
                    />
                    <span className="font-bold w-6">{formData.skillLevel}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-tight mb-2">Playing Positions</label>
                <div className="grid grid-cols-2 gap-2">
                  {positions.map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => togglePosition(pos)}
                      className={`py-2 px-3 rounded-lg border-2 font-bold uppercase text-sm transition-all ${
                        formData.positions.includes(pos)
                          ? "bg-primary text-primary-foreground border-foreground"
                          : "bg-secondary border-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-tight mb-2">Your Location</label>
                <Button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locating}
                  className="w-full gap-2 flex items-center justify-center bg-transparent"
                  variant="outline"
                >
                  {locating ? (
                    <>
                      <Loader className="size-4 animate-spin" strokeWidth={2.5} />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <MapPin className="size-4" strokeWidth={2.5} />
                      {formData.latitude ? "Location Captured" : "Enable Location"}
                    </>
                  )}
                </Button>
                {formData.locationName && (
                  <p className="text-xs font-medium text-foreground/70 mt-2 p-2 bg-secondary/50 rounded-lg border border-foreground/20">
                    📍 {formData.locationName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-tight mb-2">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" strokeWidth={2.5} />
                    ) : (
                      <Eye className="size-5" strokeWidth={2.5} />
                    )}
                  </button>
                </div>
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req) => (
                    <div
                      key={req.label}
                      className={`flex items-center gap-2 text-xs font-medium ${
                        req.met ? "text-green-600" : "text-foreground/50"
                      }`}
                    >
                      <Check className={`size-4 ${req.met ? "opacity-100" : "opacity-30"}`} strokeWidth={3} />
                      {req.label}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-tight mb-2">Confirm Password</label>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-600 font-bold text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center mt-6 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-primary underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Register
