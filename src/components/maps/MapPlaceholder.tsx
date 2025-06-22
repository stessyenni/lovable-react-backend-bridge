
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const MapPlaceholder = () => {
  return (
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
  );
};

export default MapPlaceholder;
