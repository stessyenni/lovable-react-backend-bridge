
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Search, RefreshCw } from "lucide-react";

interface LocationSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentLocation: { lat: number; lng: number } | null;
  setCurrentLocation: (location: { lat: number; lng: number } | null) => void;
  onSearch?: () => void;
  onRefresh?: () => void;
}

const LocationSearch = ({ 
  searchQuery, 
  setSearchQuery, 
  currentLocation, 
  setCurrentLocation,
  onSearch,
  onRefresh
}: LocationSearchProps) => {
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
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
              onKeyPress={handleKeyPress}
              className="border-royal-blue/30"
            />
          </div>
          <Button 
            variant="outline" 
            className="border-royal-blue text-royal-blue"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="border-royal-blue text-royal-blue"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <Button 
          onClick={getCurrentLocation}
          disabled={loading}
          className="w-full bg-hemapp-green hover:bg-hemapp-green/90"
        >
          <Navigation className="mr-2 h-4 w-4" />
          {loading ? "Getting Location..." : "Use Current Location"}
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
  );
};

export default LocationSearch;
