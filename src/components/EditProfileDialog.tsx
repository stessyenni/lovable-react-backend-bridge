
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Edit, X } from "lucide-react";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  email: string | null;
  phone_number: string | null;
  age: number | null;
  gender: string | null;
  height: string | null;
  weight: string | null;
  medical_conditions: string[] | null;
  allergies: string[] | null;
  emergency_contact: string | null;
}

const EditProfileDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [newCondition, setNewCondition] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && open) {
      fetchProfile();
    }
  }, [user, open]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          username: profile.username,
          phone_number: profile.phone_number,
          age: profile.age,
          gender: profile.gender,
          height: profile.height,
          weight: profile.weight,
          medical_conditions: profile.medical_conditions,
          allergies: profile.allergies,
          emergency_contact: profile.emergency_contact,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setOpen(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCondition = () => {
    if (!newCondition.trim() || !profile) return;
    
    const conditions = profile.medical_conditions || [];
    if (!conditions.includes(newCondition.trim())) {
      setProfile({
        ...profile,
        medical_conditions: [...conditions, newCondition.trim()]
      });
    }
    setNewCondition("");
  };

  const removeCondition = (condition: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      medical_conditions: (profile.medical_conditions || []).filter(c => c !== condition)
    });
  };

  const addAllergy = () => {
    if (!newAllergy.trim() || !profile) return;
    
    const allergies = profile.allergies || [];
    if (!allergies.includes(newAllergy.trim())) {
      setProfile({
        ...profile,
        allergies: [...allergies, newAllergy.trim()]
      });
    }
    setNewAllergy("");
  };

  const removeAllergy = (allergy: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      allergies: (profile.allergies || []).filter(a => a !== allergy)
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information and health details
          </DialogDescription>
        </DialogHeader>

        {profile && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.first_name || ""}
                  onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.last_name || ""}
                  onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username || ""}
                  onChange={(e) => setProfile({...profile, username: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone_number || ""}
                  onChange={(e) => setProfile({...profile, phone_number: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age || ""}
                  onChange={(e) => setProfile({...profile, age: e.target.value ? parseInt(e.target.value) : null})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={profile.gender || ""}
                  onValueChange={(value) => setProfile({...profile, gender: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  placeholder="e.g., 5'10&quot;"
                  value={profile.height || ""}
                  onChange={(e) => setProfile({...profile, height: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  placeholder="e.g., 175 lbs"
                  value={profile.weight || ""}
                  onChange={(e) => setProfile({...profile, weight: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency">Emergency Contact</Label>
                <Input
                  id="emergency"
                  placeholder="Name - Phone"
                  value={profile.emergency_contact || ""}
                  onChange={(e) => setProfile({...profile, emergency_contact: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Medical Conditions</Label>
                <div className="flex gap-2 mt-2 mb-2">
                  <Input
                    placeholder="Add condition"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCondition()}
                  />
                  <Button type="button" onClick={addCondition}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(profile.medical_conditions || []).map((condition, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {condition}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeCondition(condition)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Allergies</Label>
                <div className="flex gap-2 mt-2 mb-2">
                  <Input
                    placeholder="Add allergy"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                  />
                  <Button type="button" onClick={addAllergy}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(profile.allergies || []).map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="flex items-center gap-1">
                      {allergy}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeAllergy(allergy)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
