
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Search, Phone, Clock, Star } from "lucide-react";

const Maps = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Mock data for nearby health facilities
  const nearbyFacilities = [
    {
      id: 1,
      name: "City General Hospital",
      type: "Hospital",
      address: "123 Main St, Downtown",
      distance: "0.5 miles",
      rating: 4.8,
      isOpen: true,
      phone: "(555) 123-4567",
      specialties: ["Emergency", "Cardiology", "Internal Medicine"]
    },
    {
      id: 2,
      name: "HealthFirst Clinic",
      type: "Clinic",
      address: "456 Oak Ave, Midtown",
      distance: "1.2 miles",
      rating: 4.6,
      isOpen: true,
      phone: "(555) 987-6543",
      specialties: ["Primary Care", "Pediatrics"]
    },
    {
      id: 3,
      name: "Central Pharmacy",
      type: "Pharmacy",
      address: "321 Cedar St, Central",
      distance: "0.8 miles",
      rating: 4.5,
      isOpen: false,
      phone: "(555) 234-5678",
      specialties: ["Prescriptions", "Vaccines"]
    }
  ];

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const getDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="gradient-hemapp rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Health Facility Maps</h2>
        <p className="text-white/90">Find nearby hospitals, clinics, and pharmacies with real-time navigation.</p>
      </div>

      {/* Location & Search */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-royal-blue">
            <MapPin className="h-5 w-5" />
            <span>Find Health Facilities</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Search for hospitals, clinics, pharmacies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-royal-blue/30"
              />
            </div>
            <Button variant="outline" className="border-royal-blue text-royal-blue">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={getCurrentLocation}
            className="w-full bg-hemapp-green hover:bg-hemapp-green/90"
          >
            <Navigation className="mr-2 h-4 w-4" />
            Use Current Location
          </Button>
          
          {currentLocation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                📍 Location detected: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map Placeholder */}
      <Card>
        <CardContent className="p-0">
          <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-royal-blue mx-auto mb-4" />
              <p className="text-lg font-semibold text-dark-purple">Interactive Map</p>
              <p className="text-sm text-muted-foreground">
                Map integration will show real-time locations and navigation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Facilities */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-dark-purple">Nearby Facilities</h3>
        <div className="grid gap-4">
          {nearbyFacilities.map((facility) => (
            <Card key={facility.id} className="hover:shadow-lg transition-shadow">
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
                    onClick={() => getDirections(facility.address)}
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
          ))}
        </div>
      </div>

      {/* Integration Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Google Maps Integration</p>
              <p>Real-time navigation, traffic updates, and location services will be available once Google Maps API is configured.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Maps;
