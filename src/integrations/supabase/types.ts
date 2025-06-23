export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_consultations: {
        Row: {
          ai_recommendation: string | null
          created_at: string
          id: string
          recommended_action: string | null
          severity_level: string | null
          symptoms: string[] | null
          user_id: string
        }
        Insert: {
          ai_recommendation?: string | null
          created_at?: string
          id?: string
          recommended_action?: string | null
          severity_level?: string | null
          symptoms?: string[] | null
          user_id: string
        }
        Update: {
          ai_recommendation?: string | null
          created_at?: string
          id?: string
          recommended_action?: string | null
          severity_level?: string | null
          symptoms?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_user_message: boolean | null
          message: string
          response: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_user_message?: boolean | null
          message: string
          response?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_user_message?: boolean | null
          message?: string
          response?: string | null
          user_id?: string
        }
        Relationships: []
      }
      diet_entries: {
        Row: {
          calories: number | null
          created_at: string
          fiber: string | null
          id: string
          logged_at: string
          meal_name: string
          meal_type: string | null
          protein: string | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          created_at?: string
          fiber?: string | null
          id?: string
          logged_at?: string
          meal_name: string
          meal_type?: string | null
          protein?: string | null
          user_id: string
        }
        Update: {
          calories?: number | null
          created_at?: string
          fiber?: string | null
          id?: string
          logged_at?: string
          meal_name?: string
          meal_type?: string | null
          protein?: string | null
          user_id?: string
        }
        Relationships: []
      }
      diet_uploads: {
        Row: {
          ai_suggestions: string[] | null
          analysis_result: Json | null
          created_at: string
          id: string
          image_url: string
          user_id: string
        }
        Insert: {
          ai_suggestions?: string[] | null
          analysis_result?: Json | null
          created_at?: string
          id?: string
          image_url: string
          user_id: string
        }
        Update: {
          ai_suggestions?: string[] | null
          analysis_result?: Json | null
          created_at?: string
          id?: string
          image_url?: string
          user_id?: string
        }
        Relationships: []
      }
      facilities: {
        Row: {
          address: string
          created_at: string
          distance: string | null
          hours: string | null
          id: string
          name: string
          phone: string | null
          rating: number | null
          specialties: string[] | null
          type: string
        }
        Insert: {
          address: string
          created_at?: string
          distance?: string | null
          hours?: string | null
          id?: string
          name: string
          phone?: string | null
          rating?: number | null
          specialties?: string[] | null
          type: string
        }
        Update: {
          address?: string
          created_at?: string
          distance?: string | null
          hours?: string | null
          id?: string
          name?: string
          phone?: string | null
          rating?: number | null
          specialties?: string[] | null
          type?: string
        }
        Relationships: []
      }
      health_goals: {
        Row: {
          created_at: string
          current_value: string | null
          deadline: string | null
          description: string | null
          id: string
          progress: number | null
          status: string | null
          target_value: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          target_value?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          target_value?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      offline_sync: {
        Row: {
          created_at: string
          data_payload: Json
          data_type: string
          id: string
          sync_status: string | null
          synced_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          data_payload: Json
          data_type: string
          id?: string
          sync_status?: string | null
          synced_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          data_payload?: Json
          data_type?: string
          id?: string
          sync_status?: string | null
          synced_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          allergies: string[] | null
          created_at: string
          email: string | null
          emergency_contact: string | null
          first_name: string | null
          gender: string | null
          height: string | null
          id: string
          last_name: string | null
          medical_conditions: string[] | null
          phone_number: string | null
          profile_image_url: string | null
          updated_at: string
          weight: string | null
        }
        Insert: {
          age?: number | null
          allergies?: string[] | null
          created_at?: string
          email?: string | null
          emergency_contact?: string | null
          first_name?: string | null
          gender?: string | null
          height?: string | null
          id: string
          last_name?: string | null
          medical_conditions?: string[] | null
          phone_number?: string | null
          profile_image_url?: string | null
          updated_at?: string
          weight?: string | null
        }
        Update: {
          age?: number | null
          allergies?: string[] | null
          created_at?: string
          email?: string | null
          emergency_contact?: string | null
          first_name?: string | null
          gender?: string | null
          height?: string | null
          id?: string
          last_name?: string | null
          medical_conditions?: string[] | null
          phone_number?: string | null
          profile_image_url?: string | null
          updated_at?: string
          weight?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          enable_braille: boolean | null
          enable_screen_reader: boolean | null
          enable_speech_to_text: boolean | null
          enable_text_to_speech: boolean | null
          id: string
          language_preference: string | null
          profile_image_url: string | null
          updated_at: string
          user_id: string
          voice_preference: string | null
        }
        Insert: {
          created_at?: string
          enable_braille?: boolean | null
          enable_screen_reader?: boolean | null
          enable_speech_to_text?: boolean | null
          enable_text_to_speech?: boolean | null
          id?: string
          language_preference?: string | null
          profile_image_url?: string | null
          updated_at?: string
          user_id: string
          voice_preference?: string | null
        }
        Update: {
          created_at?: string
          enable_braille?: boolean | null
          enable_screen_reader?: boolean | null
          enable_speech_to_text?: boolean | null
          enable_text_to_speech?: boolean | null
          id?: string
          language_preference?: string | null
          profile_image_url?: string | null
          updated_at?: string
          user_id?: string
          voice_preference?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
