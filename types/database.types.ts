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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      adoptee: {
        Row: {
          adopted: boolean | null
          age: number | null
          bio: string
          facility: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          offense: string | null
          state: string | null
          veteran_status: boolean | null
        }
        Insert: {
          adopted?: boolean | null
          age?: number | null
          bio: string
          facility?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          offense?: string | null
          state?: string | null
          veteran_status?: boolean | null
        }
        Update: {
          adopted?: boolean | null
          age?: number | null
          bio?: string
          facility?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          offense?: string | null
          state?: string | null
          veteran_status?: boolean | null
        }
        Relationships: []
      }
      adoptee_vector: {
        Row: {
          age: number | null
          bio: string | null
          embedding: string | null
          gender: string | null
          id: string
          offense: string | null
          state: string | null
          veteran_status: boolean | null
        }
        Insert: {
          age?: number | null
          bio?: string | null
          embedding?: string | null
          gender?: string | null
          id: string
          offense?: string | null
          state?: string | null
          veteran_status?: boolean | null
        }
        Update: {
          age?: number | null
          bio?: string | null
          embedding?: string | null
          gender?: string | null
          id?: string
          offense?: string | null
          state?: string | null
          veteran_status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "adoptee_vector1_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "adoptee"
            referencedColumns: ["id"]
          },
        ]
      }
      adoptee_vector_test: {
        Row: {
          bio: string | null
          dob: string | null
          embedding: string | null
          facility: string | null
          first_name: string | null
          formerly_adopted: boolean
          gender: string | null
          id: string
          inmate_id: string
          last_name: string | null
          offense: string | null
          state: string | null
          status: Database["public"]["Enums"]["adoptee_status"]
          veteran_status: string | null
        }
        Insert: {
          bio?: string | null
          dob?: string | null
          embedding?: string | null
          facility?: string | null
          first_name?: string | null
          formerly_adopted?: boolean
          gender?: string | null
          id: string
          inmate_id: string
          last_name?: string | null
          offense?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["adoptee_status"]
          veteran_status?: string | null
        }
        Update: {
          bio?: string | null
          dob?: string | null
          embedding?: string | null
          facility?: string | null
          first_name?: string | null
          formerly_adopted?: boolean
          gender?: string | null
          id?: string
          inmate_id?: string
          last_name?: string | null
          offense?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["adoptee_status"]
          veteran_status?: string | null
        }
        Relationships: []
      }
      adopter_applications_dummy: {
        Row: {
          adoptee_name: string | null
          adopter_uuid: string
          age_pref: number[] | null
          app_num: number
          app_uuid: string
          ended_reason: string | null
          exported_to_monday: boolean
          gender_pref: string | null
          matched_adoptee: string | null
          monday_id: string | null
          personal_bio: string | null
          ranked_cards: string[] | null
          status: Database["public"]["Enums"]["status_vals"]
          time_confirmation_due: string | null
          time_created: string
          time_ended: string | null
          time_started: string | null
          time_submitted: string | null
          waiting_confirmation: boolean
        }
        Insert: {
          adoptee_name?: string | null
          adopter_uuid: string
          age_pref?: number[] | null
          app_num?: number
          app_uuid?: string
          ended_reason?: string | null
          exported_to_monday?: boolean
          gender_pref?: string | null
          matched_adoptee?: string | null
          monday_id?: string | null
          personal_bio?: string | null
          ranked_cards?: string[] | null
          status?: Database["public"]["Enums"]["status_vals"]
          time_confirmation_due?: string | null
          time_created?: string
          time_ended?: string | null
          time_started?: string | null
          time_submitted?: string | null
          waiting_confirmation?: boolean
        }
        Update: {
          adoptee_name?: string | null
          adopter_uuid?: string
          age_pref?: number[] | null
          app_num?: number
          app_uuid?: string
          ended_reason?: string | null
          exported_to_monday?: boolean
          gender_pref?: string | null
          matched_adoptee?: string | null
          monday_id?: string | null
          personal_bio?: string | null
          ranked_cards?: string[] | null
          status?: Database["public"]["Enums"]["status_vals"]
          time_confirmation_due?: string | null
          time_created?: string
          time_ended?: string | null
          time_started?: string | null
          time_submitted?: string | null
          waiting_confirmation?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "adopter_applications_dummy_adopter_uuid_fkey"
            columns: ["adopter_uuid"]
            isOneToOne: false
            referencedRelation: "adopter_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      adopter_monday_ids: {
        Row: {
          adopter_email: string
          date_added: string
          group: string
          monday_id: string
        }
        Insert: {
          adopter_email: string
          date_added: string
          group: string
          monday_id: string
        }
        Update: {
          adopter_email?: string
          date_added?: string
          group?: string
          monday_id?: string
        }
        Relationships: []
      }
      adopter_profiles: {
        Row: {
          date_of_birth: string
          first_name: string
          last_name: string
          monday_id: string | null
          num_past_active: number | null
          past_inactive_reason:
            | Database["public"]["Enums"]["inactive_reason"]
            | null
          pronouns: string
          state: string
          user_id: string
          veteran_status: boolean
        }
        Insert: {
          date_of_birth: string
          first_name: string
          last_name: string
          monday_id?: string | null
          num_past_active?: number | null
          past_inactive_reason?:
            | Database["public"]["Enums"]["inactive_reason"]
            | null
          pronouns: string
          state: string
          user_id?: string
          veteran_status: boolean
        }
        Update: {
          date_of_birth?: string
          first_name?: string
          last_name?: string
          monday_id?: string | null
          num_past_active?: number | null
          past_inactive_reason?:
            | Database["public"]["Enums"]["inactive_reason"]
            | null
          pronouns?: string
          state?: string
          user_id?: string
          veteran_status?: boolean
        }
        Relationships: []
      }
      app_counter: {
        Row: {
          adopter_uuid: string
          last_app_num: number
        }
        Insert: {
          adopter_uuid?: string
          last_app_num?: number
        }
        Update: {
          adopter_uuid?: string
          last_app_num?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_top_k: {
        Args: { k: number; query_embedding: string }
        Returns: {
          bio: string
          dob: string
          embedding: string
          first_name: string
          gender: string
          id: string
          last_name: string
          similarity: number
          state: string
        }[]
      }
      find_top_k_filtered: {
        Args: {
          adopter_gender?: string
          adopter_offense?: string[]
          adopter_state?: string
          adopter_veteran_status?: string
          k: number
          query_embedding: string
        }
        Returns: {
          age: number
          bio: string
          embedding: string
          first_name: string
          gender: string
          id: string
          last_name: string
          similarity: number
          state: string
          veteran_status: string
        }[]
      }
      get_dnr_applications: {
        Args: never
        Returns: {
          app_monday_id: string
          app_uuid: string
          formerly_adopted: boolean
          matched_adoptee: string
        }[]
      }
      get_user_and_application: {
        Args: { app_id: string }
        Returns: {
          adopter_monday_id: string
          date_of_birth: string
          exported_to_monday: boolean
          first_name: string
          gender_pref: string
          last_name: string
          personal_bio: string
          pronouns: string
          ranked_cards: string[]
          state: string
          user_id: string
          veteran_status: string
        }[]
      }
      transfer_tables: { Args: never; Returns: undefined }
    }
    Enums: {
      adoptee_status: "WAIT_LISTED" | "OUT_FOR_CONSIDERATION" | "ADOPTED"
      app_status:
        | "INCOMPLETE"
        | "PENDING"
        | "PENDING_CONFIRMATION"
        | "ACTIVE"
        | "ENDED"
        | "REAPPLY"
        | "REJECTED"
      inactive_reason: "ENDED" | "INMATE_CANCELLED" | "NPO_CANCELLED" | "OTHER"
      status_vals:
        | "INCOMPLETE"
        | "PENDING"
        | "ACCEPTED"
        | "REJECTED"
        | "ENDED"
        | "PENDING_CONFIRMATION"
        | "REAPPLY"
        | "ACTIVE"
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
    Enums: {
      adoptee_status: ["WAIT_LISTED", "OUT_FOR_CONSIDERATION", "ADOPTED"],
      app_status: [
        "INCOMPLETE",
        "PENDING",
        "PENDING_CONFIRMATION",
        "ACTIVE",
        "ENDED",
        "REAPPLY",
        "REJECTED",
      ],
      inactive_reason: ["ENDED", "INMATE_CANCELLED", "NPO_CANCELLED", "OTHER"],
      status_vals: [
        "INCOMPLETE",
        "PENDING",
        "ACCEPTED",
        "REJECTED",
        "ENDED",
        "PENDING_CONFIRMATION",
        "REAPPLY",
        "ACTIVE",
      ],
    },
  },
} as const
