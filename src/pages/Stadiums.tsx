import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { StadiumCard } from "@/components/StadiumCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

const allStadiums = [
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
  {
    id: "4",
    name: "Metro Sports Arena",
    location: "East Side",
    capacity: 3000,
    pricePerHour: 350,
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800&auto=format&fit=crop",
    featured: false,
  },
  {
    id: "5",
    name: "Grand Stadium",
    location: "North District",
    capacity: 25000,
    pricePerHour: 2000,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1587384474964-3a06ce1ce699?w=800&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "6",
    name: "Community Field",
    location: "Suburb Area",
    capacity: 1500,
    pricePerHour: 200,
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop",
    featured: false,
  },
];

const capacityFilters = [
  { label: "Any Size", value: "all" },
  { label: "< 5,000", value: "small" },
  { label: "5,000 - 10,000", value: "medium" },
  { label: "10,000+", value: "large" },
];

const priceFilters = [
  { label: "Any Price", value: "all" },
  { label: "Under 500 DZD", value: "budget" },
  { label: "500 DZD - 1,000 DZD", value: "mid" },
  { label: "1,000 DZD+", value: "premium" },
];

const Stadiums = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filteredStadiums = allStadiums.filter((stadium) =>
    stadium.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stadium.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">
              Browse Stadiums
            </h1>
            <p className="font-medium text-foreground/70">
              Find the perfect venue for your next event
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Sidebar */}
            <aside
              className={`lg:w-72 ${
                showFilters ? "block" : "hidden lg:block"
              }`}
            >
              <Card className="sticky top-24">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <button
                    className="lg:hidden"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="size-5" strokeWidth={2.5} />
                  </button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Capacity Filter */}
                  <div>
                    <h4 className="font-black uppercase text-sm mb-3">Capacity</h4>
                    <div className="space-y-2">
                      {capacityFilters.map((filter) => (
                        <label
                          key={filter.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="capacity"
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
                        <label
                          key={filter.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="price"
                            className="w-5 h-5 border-2 border-foreground accent-primary"
                          />
                          <span className="font-medium">{filter.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h4 className="font-black uppercase text-sm mb-3">Amenities</h4>
                    <div className="space-y-2">
                      {["Parking", "Locker Rooms", "Lighting", "Sound System", "VIP Areas"].map(
                        (amenity) => (
                          <label
                            key={amenity}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="w-5 h-5 border-2 border-foreground rounded accent-primary"
                            />
                            <span className="font-medium">{amenity}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <Button className="w-full">Apply Filters</Button>
                  <Button variant="outline" className="w-full" onClick={clearFilters}>
                    Clear All
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* Stadium Grid */}
            <div className="flex-1">
              {/* Search Bar */}
              <div className="mb-6">
                <SearchBar
                  onSearch={setSearchQuery}
                  onFilter={() => setShowFilters(!showFilters)}
                />
              </div>

              {/* Active Filters */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {activeFilters.map((filter) => (
                    <Badge key={filter} className="flex items-center gap-1">
                      {filter}
                      <button
                        onClick={() =>
                          setActiveFilters(activeFilters.filter((f) => f !== filter))
                        }
                      >
                        <X className="size-3" strokeWidth={3} />
                      </button>
                    </Badge>
                  ))}
                  <button
                    className="text-sm font-bold text-primary underline"
                    onClick={clearFilters}
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="font-bold">
                  <span className="font-black">{filteredStadiums.length}</span> stadiums found
                </p>
                <Button variant="ghost" size="sm" className="gap-2">
                  Sort by: Recommended
                  <ChevronDown className="size-4" strokeWidth={2.5} />
                </Button>
              </div>

              {/* Stadium Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredStadiums.map((stadium) => (
                  <StadiumCard key={stadium.id} {...stadium} />
                ))}
              </div>

              {/* Load More */}
              {filteredStadiums.length > 0 && (
                <div className="mt-12 text-center">
                  <Button variant="outline" size="lg">
                    Load More Stadiums
                  </Button>
                </div>
              )}

              {/* No Results */}
              {filteredStadiums.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-secondary border-2 border-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                    <SlidersHorizontal className="size-8" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-black uppercase mb-2">No Stadiums Found</h3>
                  <p className="font-medium text-foreground/70 mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Stadiums;
