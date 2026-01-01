import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { StadiumCard } from "@/components/StadiumCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Search, Calendar, CheckCircle, Shield, Clock, Award, Headphones } from "lucide-react";

const featuredStadiums = [
  {
    id: "1",
    name: "Riverside Arena",
    location: "Downtown District",
    capacity: 5000,
    pricePerHour: 500,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "2",
    name: "Olympic Complex",
    location: "Sports Quarter",
    capacity: 15000,
    pricePerHour: 1200,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop",
    featured: false,
  },
  {
    id: "3",
    name: "City Central Field",
    location: "City Center",
    capacity: 8000,
    pricePerHour: 750,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop",
    featured: true,
  },
];

const howItWorks = [
  {
    icon: Search,
    title: "Search & Explore",
    description: "Browse our curated collection of premium stadiums with detailed amenities and availability.",
    step: 1,
  },
  {
    icon: Calendar,
    title: "Book Your Slot",
    description: "Select your preferred date, time, and duration. Review pricing and confirm your booking.",
    step: 2,
  },
  {
    icon: CheckCircle,
    title: "Enjoy Your Event",
    description: "Show up and enjoy your event! Our team ensures everything is ready for you.",
    step: 3,
  },
];

const features = [
  {
    icon: Shield,
    title: "Secure Bookings",
    description: "All transactions are encrypted and protected. Your booking is guaranteed.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Book anytime, anywhere. Our platform is available round the clock.",
  },
  {
    icon: Award,
    title: "Verified Venues",
    description: "Every stadium is verified for quality, safety, and amenities before listing.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Our team is here to help with any questions or issues during your booking.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-foreground mb-6 animate-fade-in">
              Book Premium Stadiums
              <br />
              <span className="text-primary">For Your Events</span>
            </h1>
            <p className="text-lg md:text-xl font-bold text-foreground/70 max-w-2xl mx-auto mb-8" style={{ animationDelay: "0.1s" }}>
              From corporate gatherings to sports tournaments, find the perfect venue for any occasion. Easy booking, transparent pricing.
            </p>

            <div className="max-w-2xl mx-auto mb-8" style={{ animationDelay: "0.2s" }}>
              <SearchBar />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: "0.3s" }}>
              <Button variant="hero" size="lg" asChild>
                <Link to="/stadiums">Browse Stadiums</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
              { value: "500+", label: "Stadiums" },
              { value: "10K+", label: "Bookings" },
              { value: "3", label: "Cities" },
              { value: "4.9", label: "Rating" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-secondary border-2 border-foreground rounded-lg p-4 text-center shadow-neo"
              >
                <div className="text-3xl md:text-4xl font-black text-foreground">{stat.value}</div>
                <div className="font-bold uppercase text-sm text-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stadiums */}
      <section className="py-20 px-4 bg-secondary/50 border-y-4 border-foreground">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              Featured Stadiums
            </h2>
            <Button variant="outline" asChild>
              <Link to="/stadiums">View All Stadiums</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStadiums.map((stadium) => (
              <StadiumCard key={stadium.id} {...stadium} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-center mb-16">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection lines (desktop only) */}
            <div className="hidden md:block absolute top-20 left-1/4 right-1/4 border-t-2 border-dashed border-foreground" />

            {howItWorks.map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="w-20 h-20 rounded-full border-4 border-foreground bg-background shadow-neo-lg flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl font-black text-primary">{item.step}</span>
                </div>
                <div className="bg-secondary p-4 rounded-lg border-2 border-foreground inline-flex mb-4">
                  <item.icon className="size-8 text-foreground" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-3">{item.title}</h3>
                <p className="font-medium text-foreground/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-secondary/50 border-y-4 border-foreground">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-center mb-16">
            Why Choose Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-neo-xl">
                <CardContent className="flex gap-4 p-6">
                  <div className="bg-secondary p-4 rounded-lg border-2 border-foreground h-fit">
                    <feature.icon className="size-6 text-foreground" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight mb-2">{feature.title}</h3>
                    <p className="font-medium text-foreground/70">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-primary text-primary-foreground border-foreground">
            <CardContent className="text-center py-12 px-6">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 text-primary-foreground">
                Ready to Book Your Stadium?
              </h2>
              <p className="font-bold text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Join thousands of event organizers who trust Matiko for their venue needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-background text-foreground border-foreground hover:bg-secondary"
                  asChild
                >
                  <Link to="/register">Get Started Free</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
