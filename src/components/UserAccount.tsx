import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, Edit } from "lucide-react";
import EditProfileDialog from "./EditProfileDialog";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  age: number | null;
  gender: string | null;
  height: string | null;
  weight: string | null;
  medical_conditions: string[] | null;
  allergies: string[] | null;
  emergency_contact: string | null;
  profile_image_url: string | null;
  username: string | null;
}

const UserAccount = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user?.id,
  });

  const handleEditSuccess = () => {
    refetch(); // Refresh profile data
    setShowEditDialog(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">{t('userAccount.title')}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{t('userAccount.subtitle')}</p>
        </div>
        <Button onClick={() => setShowEditDialog(true)} className="w-full sm:w-auto">
          <Edit className="h-4 w-4 mr-2" />
          {t('userAccount.editProfile')}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">First Name</p>
                <p className="text-sm">{profile.first_name || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                <p className="text-sm">{profile.last_name || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Username</p>
                <p className="text-sm">{profile.username || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{profile.email || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-sm">{profile.phone_number || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Age</p>
                <p className="text-sm">{profile.age || "Not set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Health Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gender</p>
                <p className="text-sm">{profile.gender || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Height</p>
                <p className="text-sm">{profile.height || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weight (KG)</p>
                <p className="text-sm">{profile.weight || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                <p className="text-sm">{profile.emergency_contact || "Not set"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Medical Conditions</p>
              <div className="flex flex-wrap gap-2">
                {profile.medical_conditions && profile.medical_conditions.length > 0 ? (
                  profile.medical_conditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {condition}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">None specified</p>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Allergies</p>
              <div className="flex flex-wrap gap-2">
                {profile.allergies && profile.allergies.length > 0 ? (
                  profile.allergies.map((allergy, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {allergy}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">None specified</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <EditProfileDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        profile={profile}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default UserAccount;
