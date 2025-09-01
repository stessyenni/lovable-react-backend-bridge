export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
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
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_group: boolean
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_group?: boolean
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_group?: boolean
          name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      hembot_messages: {
        Row: {
          created_at: string
          id: string
          is_user_message: boolean
          message: string
          session_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_user_message?: boolean
          message: string
          session_id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_user_message?: boolean
          message?: string
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      meal_categories: {
        Row: {
          color_class: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color_class?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color_class?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meal_items: {
        Row: {
          ai_analysis_data: Json | null
          calories_per_serving: number | null
          carbs_per_serving: number | null
          category_id: string
          created_at: string
          fat_per_serving: number | null
          fiber_per_serving: number | null
          id: string
          image_url: string | null
          name: string
          protein_per_serving: number | null
          serving_size: string | null
          updated_at: string
        }
        Insert: {
          ai_analysis_data?: Json | null
          calories_per_serving?: number | null
          carbs_per_serving?: number | null
          category_id: string
          created_at?: string
          fat_per_serving?: number | null
          fiber_per_serving?: number | null
          id?: string
          image_url?: string | null
          name: string
          protein_per_serving?: number | null
          serving_size?: string | null
          updated_at?: string
        }
        Update: {
          ai_analysis_data?: Json | null
          calories_per_serving?: number | null
          carbs_per_serving?: number | null
          category_id?: string
          created_at?: string
          fat_per_serving?: number | null
          fiber_per_serving?: number | null
          id?: string
          image_url?: string | null
          name?: string
          protein_per_serving?: number | null
          serving_size?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "meal_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          message_type: string
          read_at: string | null
          recipient_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          message_type?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_type?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
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
          username: string | null
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
          username?: string | null
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
          username?: string | null
          weight?: string | null
        }
        Relationships: []
      }
      sample_health_goals: {
        Row: {
          category: string
          created_at: string
          default_current_value: string | null
          default_target_value: string | null
          description: string | null
          difficulty_level: string | null
          estimated_timeframe: string | null
          icon_name: string | null
          id: string
          is_popular: boolean | null
          target_type: string
          tips: string[] | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          default_current_value?: string | null
          default_target_value?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_timeframe?: string | null
          icon_name?: string | null
          id?: string
          is_popular?: boolean | null
          target_type: string
          tips?: string[] | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          default_current_value?: string | null
          default_target_value?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_timeframe?: string | null
          icon_name?: string | null
          id?: string
          is_popular?: boolean | null
          target_type?: string
          tips?: string[] | null
          title?: string
        }
        Relationships: []
      }
      user_connections: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_connections_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_connections_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      get_unread_message_count: {
        Args: { user_uuid: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
