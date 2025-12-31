import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register attempt:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { label: "Contains number", met: /[0-9]/.test(formData.password) },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
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
                <label className="block text-sm font-black uppercase tracking-tight mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-tight mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-tight mb-2">
                  Password
                </label>
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
                {/* Password requirements */}
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
                <label className="block text-sm font-black uppercase tracking-tight mb-2">
                  Confirm Password
                </label>
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

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 mt-0.5 border-2 border-foreground rounded accent-primary"
                  required
                />
                <span className="font-medium text-sm text-foreground/80">
                  I agree to the{" "}
                  <Link to="/terms" className="font-bold text-primary underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="font-bold text-primary underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <Button type="submit" size="lg" className="w-full">
                Create Account
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-foreground" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-4 font-bold text-foreground/60 uppercase">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <svg className="size-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="size-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>

            {/* Sign In Link */}
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
  );
};

export default Register;
