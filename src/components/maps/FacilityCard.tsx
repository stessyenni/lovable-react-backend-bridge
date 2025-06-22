
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Phone, Star } from "lucide-react";

interface Facility {
  id: number;
  name: string;
  type: string;
  address: string;
  distance: string;
  rating: number;
  isOpen: boolean;
  phone: string;
  specialties: string[];
}

interface FacilityCardProps {
  facility: Facility;
  onGetDirections: (address: string) => void;
}

const FacilityCard = ({ facility, onGetDirections }: FacilityCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>{facility.name}</span>
              {facility.isOpen ? (
                <Badge className="bg-hemapp-green text-white">Open</Badge>
              ) : (
                <Badge variant="destructive">Closed</Badge>
              )}
            </CardTitle>
            <CardDescription className="flex items-center space-x-4 mt-1">
              <span>{facility.type}</span>
              <span className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                {facility.rating}
              </span>
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-royal-blue">{facility.distance}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span>{facility.address}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{facility.phone}</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Specialties:</p>
          <div className="flex flex-wrap gap-1">
            {facility.specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onGetDirections(facility.address)}
          >
            <Navigation className="h-4 w-4 mr-1" />
            Directions
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-royal-blue hover:bg-royal-blue/90"
            onClick={() => window.open(`tel:${facility.phone}`, '_self')}
          >
            <Phone className="h-4 w-4 mr-1" />
            Call
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacilityCard;
export type { Facility };
