import { supabase } from "@/integrations/supabase/client";

export interface PublicProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  profile_image_url: string | null;
  created_at?: string;
}

export const PUBLIC_PROFILE_SELECT = "id, first_name, last_name, username, profile_image_url, created_at";

export const fetchPublicProfilesByIds = async (userIds: string[]) => {
  const uniqueUserIds = [...new Set(userIds.filter(Boolean))];

  if (uniqueUserIds.length === 0) {
    return [] as PublicProfile[];
  }

  const { data, error } = await supabase
    .from("public_profiles")
    .select(PUBLIC_PROFILE_SELECT)
    .in("id", uniqueUserIds);

  if (error) throw error;
  return (data ?? []) as PublicProfile[];
};

export const searchPublicProfiles = async (searchTerm: string, currentUserId: string, limit = 10) => {
  const trimmedSearchTerm = searchTerm.trim();

  if (!trimmedSearchTerm) {
    return [] as PublicProfile[];
  }

  const escapedSearchTerm = trimmedSearchTerm.replace(/[%_,]/g, (char) => `\\${char}`);
  const likeQuery = `%${escapedSearchTerm}%`;

  const { data, error } = await supabase
    .from("public_profiles")
    .select(PUBLIC_PROFILE_SELECT)
    .or(`first_name.ilike.${likeQuery},last_name.ilike.${likeQuery},username.ilike.${likeQuery}`)
    .neq("id", currentUserId)
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as PublicProfile[];
};

export const fetchRecentPublicProfiles = async (currentUserId: string, limit = 8) => {
  const { data, error } = await supabase
    .from("public_profiles")
    .select(PUBLIC_PROFILE_SELECT)
    .neq("id", currentUserId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as PublicProfile[];
};
