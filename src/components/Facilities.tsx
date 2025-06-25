
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Phone, Clock, MapPin, Star, Navigation, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Facilities = () => {
  const { toast } = useToast();
  
  const { data: facilities = [], isLoading } = useQuery({
    queryKey: ["facilities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facilities")
        .select("*")
        .order("rating", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleGetDirections = (address: string, name: string) => {
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
    
    toast({
      title: "Opening Directions",
      description: `Getting directions to ${name}`,
    });
  };

  const handleContact = (facility: any) => {
    if (facility.phone) {
      window.open(`tel:${facility.phone}`, '_self');
      toast({
        title: "Calling Facility",
        description: `Calling ${facility.name}`,
      });
    } else {
      toast({
        title: "Contact Information",
        description: "Phone number not available for this facility",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Healthcare Facilities</h2>
        <p className="text-muted-foreground">Find nearby hospitals, clinics, and health services</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {facilities.map((facility) => (
          <Card key={facility.id} className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>{facility.name}</span>
                  </CardTitle>
                  <CardDescription>{facility.type}</CardDescription>
                </div>
                {facility.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{facility.rating}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{facility.address}</span>
                </div>
                
                {facility.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{facility.phone}</span>
                  </div>
                )}
                
                {facility.hours && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{facility.hours}</span>
                  </div>
                )}
                
                {facility.distance && (
                  <div className="text-blue-600 font-medium">
                    {facility.distance}
                  </div>
                )}
              </div>

              {facility.specialties && facility.specialties.length > 0 && (
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
              )}

              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleGetDirections(facility.address, facility.name)}
                >
                  <Navigation className="h-4 w-4 mr-1" />
                  Directions
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleContact(facility)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {facilities.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No facilities found</h3>
            <p className="text-muted-foreground">
              We couldn't find any healthcare facilities in your area.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Facilities;
