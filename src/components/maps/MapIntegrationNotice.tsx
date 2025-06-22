
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const MapIntegrationNotice = () => {
  return (
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
  );
};

export default MapIntegrationNotice;
