"use client"

import type React from "react"

import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { login } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("") // Added state for password
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(username, password) // Updated to include password
      toast({
        title: "Success",
        description: `Welcome back, ${result.user.username}!`,
      })
      navigate("/dashboard")
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <p className="font-medium text-foreground/70">Sign in to continue to your account</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-black uppercase tracking-tight mb-2">Username</label>
                <Input
                  type="text"
                  placeholder="your-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-tight mb-2">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password} // Updated to use password state
                    onChange={(e) => setPassword(e.target.value)} // Updated to set password state
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
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-center mt-6 font-medium">
              Don't have an account?{" "}
              <Link to="/register" className="font-bold text-primary underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login
