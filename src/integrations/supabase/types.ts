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
      accounts: {
        Row: {
          account_number: string
          created_at: string
          description: string | null
          id: string
          user_id: string
        }
        Insert: {
          account_number: string
          created_at?: string
          description?: string | null
          id?: string
          user_id: string
        }
        Update: {
          account_number?: string
          created_at?: string
          description?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      incoming_balances: {
        Row: {
          account_number: string
          amount: number
          balance_date: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_number: string
          amount: number
          balance_date: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_number?: string
          amount?: number
          balance_date?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "incoming_balances_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_number"]
          },
        ]
      }
      meeting_invites: {
        Row: {
          available_slots: Json
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          inviter_name: string
          title: string
        }
        Insert: {
          available_slots: Json
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          inviter_name: string
          title: string
        }
        Update: {
          available_slots?: Json
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          inviter_name?: string
          title?: string
        }
        Relationships: []
      }
      migraine_entries: {
        Row: {
          amount: string
          cause: string
          created_at: string
          id: string
          timestamp: string
          user_id: string
          when: string
          where: string
        }
        Insert: {
          amount: string
          cause: string
          created_at?: string
          id?: string
          timestamp?: string
          user_id: string
          when: string
          where: string
        }
        Update: {
          amount?: string
          cause?: string
          created_at?: string
          id?: string
          timestamp?: string
          user_id?: string
          when?: string
          where?: string
        }
        Relationships: []
      }
      participant_responses: {
        Row: {
          created_at: string
          id: string
          invite_id: string
          participant_initials: string
          participant_name: string
          selected_slots: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          invite_id: string
          participant_initials: string
          participant_name: string
          selected_slots: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          invite_id?: string
          participant_initials?: string
          participant_name?: string
          selected_slots?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "participant_responses_invite_id_fkey"
            columns: ["invite_id"]
            isOneToOne: false
            referencedRelation: "meeting_invites"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      scenes: {
        Row: {
          created_at: string
          generation_job_id: string | null
          id: string
          prompt: string
          scene_order: number
          settings: Json
          speech: string | null
          status: string
          story_id: string
          title: string
          updated_at: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          generation_job_id?: string | null
          id?: string
          prompt: string
          scene_order: number
          settings: Json
          speech?: string | null
          status?: string
          story_id: string
          title?: string
          updated_at?: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          generation_job_id?: string | null
          id?: string
          prompt?: string
          scene_order?: number
          settings?: Json
          speech?: string | null
          status?: string
          story_id?: string
          title?: string
          updated_at?: string
          user_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scenes_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      signed_diplomas: {
        Row: {
          blockchain_id: string
          content_hash: string
          created_at: string
          diploma_css: string
          diploma_html: string
          diploma_url: string | null
          diplomator_seal: string
          id: string
          institution_name: string
          issuer_id: string
          recipient_name: string
          signature: string
          updated_at: string
          verification_url: string
        }
        Insert: {
          blockchain_id: string
          content_hash: string
          created_at?: string
          diploma_css: string
          diploma_html: string
          diploma_url?: string | null
          diplomator_seal: string
          id?: string
          institution_name: string
          issuer_id: string
          recipient_name: string
          signature: string
          updated_at?: string
          verification_url: string
        }
        Update: {
          blockchain_id?: string
          content_hash?: string
          created_at?: string
          diploma_css?: string
          diploma_html?: string
          diploma_url?: string | null
          diplomator_seal?: string
          id?: string
          institution_name?: string
          issuer_id?: string
          recipient_name?: string
          signature?: string
          updated_at?: string
          verification_url?: string
        }
        Relationships: []
      }
      standard_accounts: {
        Row: {
          account_number: string
          account_type: string | null
          created_at: string | null
          name: string
        }
        Insert: {
          account_number: string
          account_type?: string | null
          created_at?: string | null
          name: string
        }
        Update: {
          account_number?: string
          account_type?: string | null
          created_at?: string | null
          name?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transaction_entries: {
        Row: {
          account_number: string
          amount: number
          created_at: string
          entry_number: number
          id: string
          transaction_date: string
          transaction_number: number
          user_id: string
        }
        Insert: {
          account_number: string
          amount: number
          created_at?: string
          entry_number: number
          id?: string
          transaction_date: string
          transaction_number: number
          user_id: string
        }
        Update: {
          account_number?: string
          amount?: number
          created_at?: string
          entry_number?: number
          id?: string
          transaction_date?: string
          transaction_number?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_entries_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_number"]
          },
        ]
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
