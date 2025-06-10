
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Star, Search, Navigation } from "lucide-react";

const Facilities = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const facilities = [
    {
      id: 1,
      name: "City General Hospital",
      type: "Hospital",
      address: "123 Main St, Downtown",
      phone: "(555) 123-4567",
      distance: "0.5 miles",
      rating: 4.8,
      hours: "24/7",
      specialties: ["Emergency", "Cardiology", "Internal Medicine"]
    },
    {
      id: 2,
      name: "HealthFirst Clinic",
      type: "Clinic",
      address: "456 Oak Ave, Midtown",
      phone: "(555) 987-6543",
      distance: "1.2 miles",
      rating: 4.6,
      hours: "8 AM - 6 PM",
      specialties: ["Primary Care", "Pediatrics", "Women's Health"]
    },
    {
      id: 3,
      name: "FitLife Wellness Center",
      type: "Fitness",
      address: "789 Pine Rd, Northside",
      phone: "(555) 456-7890",
      distance: "2.1 miles",
      rating: 4.7,
      hours: "5 AM - 11 PM",
      specialties: ["Gym", "Yoga", "Physical Therapy"]
    },
    {
      id: 4,
      name: "Central Pharmacy",
      type: "Pharmacy",
      address: "321 Cedar St, Central",
      phone: "(555) 234-5678",
      distance: "0.8 miles",
      rating: 4.5,
      hours: "7 AM - 10 PM",
      specialties: ["Prescriptions", "Vaccines", "Health Screening"]
    }
  ];

  const facilityTypes = ["All", "Hospital", "Clinic", "Pharmacy", "Fitness", "Emergency"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Healthcare Facilities</h2>
        <p className="text-muted-foreground">Find healthcare providers and wellness facilities near you</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search facilities, doctors, or services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button>
              <Navigation className="h-4 w-4 mr-2" />
              Use My Location
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {facilityTypes.map((type) => (
              <Badge
                key={type}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                {type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {facilities.map((facility) => (
          <Card key={facility.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{facility.name}</h3>
                    <Badge variant="secondary">{facility.type}</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{facility.address}</span>
                      <span className="text-primary font-medium">• {facility.distance}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{facility.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{facility.hours}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{facility.rating}/5.0</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {facility.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 md:min-w-[120px]">
                  <Button variant="outline" size="sm">
                    <Navigation className="h-4 w-4 mr-1" />
                    Directions
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button size="sm">
                    Book Appointment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Information</CardTitle>
          <CardDescription>Important numbers and quick access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <Button variant="destructive" className="h-12">
              <Phone className="h-5 w-5 mr-2" />
              Emergency: 911
            </Button>
            <Button variant="outline" className="h-12">
              <Phone className="h-5 w-5 mr-2" />
              Poison Control: (800) 222-1222
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Facilities;
