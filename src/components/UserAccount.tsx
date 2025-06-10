
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar, Edit, Shield, Bell } from "lucide-react";

const UserAccount = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Account</h2>
          <p className="text-muted-foreground">Manage your profile and account settings</p>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal details and health information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">John Doe</h3>
                <p className="text-muted-foreground">Premium Member</p>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value="john.doe@example.com" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value="+1 (555) 123-4567" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" value="32" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" value="Male" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input id="height" value="5'10&quot;" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input id="weight" value="175 lbs" readOnly />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Member Since</span>
                <span className="font-medium">Jan 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Goals Completed</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Streak</span>
                <span className="font-medium">15 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Health Score</span>
                <span className="font-medium">85%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Privacy Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Conditions & Allergies</CardTitle>
          <CardDescription>Important medical information for healthcare providers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Medical Conditions</h4>
              <div className="space-y-1">
                <Badge variant="outline">Hypertension</Badge>
                <Badge variant="outline">Type 2 Diabetes</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Allergies</h4>
              <div className="space-y-1">
                <Badge variant="destructive">Peanuts</Badge>
                <Badge variant="destructive">Shellfish</Badge>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Emergency Contact</h4>
            <p className="text-sm text-muted-foreground">Jane Doe - (555) 987-6543</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccount;
