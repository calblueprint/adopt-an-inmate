export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      adoptee: {
        Row: {
          adopted: boolean | null;
          age: number | null;
          bio: string;
          facility: string | null;
          first_name: string;
          gender: string | null;
          id: string;
          last_name: string;
          offense: string | null;
          state: string | null;
          veteran_status: boolean | null;
        };
        Insert: {
          adopted?: boolean | null;
          age?: number | null;
          bio: string;
          facility?: string | null;
          first_name: string;
          gender?: string | null;
          id?: string;
          last_name: string;
          offense?: string | null;
          state?: string | null;
          veteran_status?: boolean | null;
        };
        Update: {
          adopted?: boolean | null;
          age?: number | null;
          bio?: string;
          facility?: string | null;
          first_name?: string;
          gender?: string | null;
          id?: string;
          last_name?: string;
          offense?: string | null;
          state?: string | null;
          veteran_status?: boolean | null;
        };
        Relationships: [];
      };
      adoptee_vector: {
        Row: {
          age: number | null;
          bio: string | null;
          embedding: string | null;
          gender: string | null;
          id: string;
          offense: string | null;
          state: string | null;
          veteran_status: boolean | null;
        };
        Insert: {
          age?: number | null;
          bio?: string | null;
          embedding?: string | null;
          gender?: string | null;
          id: string;
          offense?: string | null;
          state?: string | null;
          veteran_status?: boolean | null;
        };
        Update: {
          age?: number | null;
          bio?: string | null;
          embedding?: string | null;
          gender?: string | null;
          id?: string;
          offense?: string | null;
          state?: string | null;
          veteran_status?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'adoptee_vector1_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'adoptee';
            referencedColumns: ['id'];
          },
        ];
      };
      adoptee_vector_test: {
        Row: {
          adopted: boolean | null;
          bio: string | null;
          dob: string | null;
          embedding: string | null;
          facility: string | null;
          first_name: string | null;
          gender: string | null;
          id: string;
          last_name: string | null;
          offense: string | null;
          state: string | null;
          veteran_status: string | null;
        };
        Insert: {
          adopted?: boolean | null;
          bio?: string | null;
          dob?: string | null;
          embedding?: string | null;
          facility?: string | null;
          first_name?: string | null;
          gender?: string | null;
          id: string;
          last_name?: string | null;
          offense?: string | null;
          state?: string | null;
          veteran_status?: string | null;
        };
        Update: {
          adopted?: boolean | null;
          bio?: string | null;
          dob?: string | null;
          embedding?: string | null;
          facility?: string | null;
          first_name?: string | null;
          gender?: string | null;
          id?: string;
          last_name?: string | null;
          offense?: string | null;
          state?: string | null;
          veteran_status?: string | null;
        };
        Relationships: [];
      };
      adopter_applications_dummy: {
        Row: {
          accepted: boolean | null;
          adopter_UUID: string;
          app_UUID: string;
          gender_pref: string;
          in_complete: boolean | null;
          personal_bio: string;
          rejected: boolean | null;
          return_explanation: string | null;
        };
        Insert: {
          accepted?: boolean | null;
          adopter_UUID: string;
          app_UUID?: string;
          gender_pref: string;
          in_complete?: boolean | null;
          personal_bio: string;
          rejected?: boolean | null;
          return_explanation?: string | null;
        };
        Update: {
          accepted?: boolean | null;
          adopter_UUID?: string;
          app_UUID?: string;
          gender_pref?: string;
          in_complete?: boolean | null;
          personal_bio?: string;
          rejected?: boolean | null;
          return_explanation?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'adopter_applications_dummy_adopter_UUID_fkey';
            columns: ['adopter_UUID'];
            isOneToOne: false;
            referencedRelation: 'adopter_profiles';
            referencedColumns: ['user_id'];
          },
        ];
      };
      adopter_profiles: {
        Row: {
          date_of_birth: string;
          first_name: string;
          last_name: string;
          pronouns: string;
          state: string;
          user_id: string;
          veteran_status: boolean;
        };
        Insert: {
          date_of_birth: string;
          first_name: string;
          last_name: string;
          pronouns: string;
          state: string;
          user_id?: string;
          veteran_status: boolean;
        };
        Update: {
          date_of_birth?: string;
          first_name?: string;
          last_name?: string;
          pronouns?: string;
          state?: string;
          user_id?: string;
          veteran_status?: boolean;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      find_top_k: {
        Args: { k: number; query_embedding: string };
        Returns: {
          bio: string;
          embedding: string;
          id: string;
          similarity: number;
        }[];
      };
      find_top_k_filtered: {
        Args: {
          query_embedding: number[];
          k: number;
          adopter_gender: string | null;
          adopter_veteran_status: string | null;
          adopter_offense: string | null;
          adopter_state: string | null;
          num_filters: number;
        };
        Returns: {
          id: string;
          embedding: number[];
          bio: string;
          gender: string;
          veteran_status: string;
          offense: string;
          state: string;
          first_name: string;
          last_name: string;
          facility: string;
          adopted: boolean;
          dob: string | null; // Postgres date comes as string
          similarity: number;
        }[];
      };
      transfer_tables: { Args: never; Returns: undefined };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
