
import { useState } from "react";
import MapHeader from "./maps/MapHeader";
import LocationSearch from "./maps/LocationSearch";
import MapPlaceholder from "./maps/MapPlaceholder";
import FacilityList from "./maps/FacilityList";
import MapIntegrationNotice from "./maps/MapIntegrationNotice";
import { Facility } from "./maps/FacilityCard";

const Maps = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Mock data for nearby health facilities
  const nearbyFacilities: Facility[] = [
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

  const getDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <MapHeader />
      
      <LocationSearch 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentLocation={currentLocation}
        setCurrentLocation={setCurrentLocation}
      />

      <MapPlaceholder />

      <FacilityList 
        facilities={nearbyFacilities}
        onGetDirections={getDirections}
      />

      <MapIntegrationNotice />
    </div>
  );
};

export default Maps;
