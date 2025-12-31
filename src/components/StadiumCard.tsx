import { MapPin, Users, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface StadiumCardProps {
  id: string;
  name: string;
  location: string;
  capacity: number;
  pricePerHour: number;
  rating: number;
  imageUrl: string;
  featured?: boolean;
}

export const StadiumCard = ({
  id,
  name,
  location,
  capacity,
  pricePerHour,
  rating,
  imageUrl,
  featured = false,
}: StadiumCardProps) => {
  return (
    <Card className="overflow-visible group">
      <div className="relative">
        <div className="overflow-hidden rounded-lg border-2 border-foreground mb-4">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {featured && (
          <Badge variant="primary" className="absolute top-2 left-2">
            Featured
          </Badge>
        )}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-background border-2 border-foreground rounded-md px-2 py-1 shadow-neo-sm">
          <Star className="size-4 fill-primary text-foreground" strokeWidth={2.5} />
          <span className="text-sm font-black">{rating.toFixed(1)}</span>
        </div>
      </div>
      
      <CardContent className="p-0">
        <h3 className="text-xl font-black uppercase tracking-tight mb-2">{name}</h3>
        
        <div className="flex items-center gap-2 mb-2 text-foreground/80">
          <MapPin className="size-5" strokeWidth={2.5} />
          <span className="font-bold">{location}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-4 text-foreground/80">
          <Users className="size-5" strokeWidth={2.5} />
          <span className="font-bold">{capacity.toLocaleString()} capacity</span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-2xl font-black">${pricePerHour}</span>
            <span className="font-bold text-sm text-foreground/70"> / hour</span>
          </div>
        </div>
        
        <Button variant="outline" className="w-full" asChild>
          <Link to={`/stadium/${id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
