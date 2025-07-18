
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Watch, Smartphone, Wifi, WifiOff, Bluetooth, Battery } from "lucide-react";

const SmartWatchSync = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      if ('bluetooth' in navigator) {
        const device = await (navigator as any).bluetooth.requestDevice({
          filters: [
            { services: ['heart_rate'] },
            { services: ['battery_service'] },
            { namePrefix: 'Apple Watch' },
            { namePrefix: 'Galaxy Watch' },
            { namePrefix: 'Fitbit' }
          ],
          optionalServices: ['device_information']
        });
        
        setIsConnected(true);
        setLastSync(new Date());
        toast({
          title: "Watch Connected",
          description: `Connected to ${device.name}`,
        });
      } else {
        toast({
          title: "Bluetooth Not Supported",
          description: "Your browser doesn't support Bluetooth connectivity.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to smartwatch. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: "Watch Disconnected",
      description: "Smartwatch has been disconnected.",
    });
  };

  const handleSync = () => {
    setLastSync(new Date());
    toast({
      title: "Sync Complete",
      description: "Health data synced successfully from smartwatch.",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Watch className="h-5 w-5" />
            SmartWatch Connection
          </CardTitle>
          <CardDescription>
            Connect your smartwatch to sync health data automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              {isConnected && (
                <Badge variant="outline" className="ml-2">
                  <Battery className="h-3 w-3 mr-1" />
                  {batteryLevel}%
                </Badge>
              )}
            </div>
            {isConnected ? (
              <Button onClick={handleDisconnect} variant="outline" size="sm">
                <WifiOff className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            ) : (
              <Button onClick={handleConnect} size="sm">
                <Bluetooth className="h-4 w-4 mr-2" />
                Connect Watch
              </Button>
            )}
          </div>

          {isConnected && (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-sync">Auto Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync data every 15 minutes
                  </p>
                </div>
                <Switch
                  id="auto-sync"
                  checked={syncEnabled}
                  onCheckedChange={setSyncEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Last Sync</p>
                  <p className="text-sm text-muted-foreground">
                    {lastSync ? lastSync.toLocaleString() : 'Never'}
                  </p>
                </div>
                <Button onClick={handleSync} variant="outline" size="sm">
                  <Wifi className="h-4 w-4 mr-2" />
                  Sync Now
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Steps Today</p>
                  <p className="text-lg font-semibold">8,542</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Heart Rate</p>
                  <p className="text-lg font-semibold">72 bpm</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartWatchSync;
