export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      children: {
        Row: {
          id: string
          name: string
          date_of_birth: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          date_of_birth: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          date_of_birth?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      symptoms: {
        Row: {
          id: string
          child_id: string
          name: string
          description: string | null
          severity: number
          age_group: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          child_id: string
          name: string
          description?: string | null
          severity?: number
          age_group?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          name?: string
          description?: string | null
          severity?: number
          age_group?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      solutions: {
        Row: {
          id: string
          symptom_id: string
          description: string
          effectiveness_rating: number | null
          time_to_relief: string | null
          precautions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          symptom_id: string
          description: string
          effectiveness_rating?: number | null
          time_to_relief?: string | null
          precautions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          symptom_id?: string
          description?: string
          effectiveness_rating?: number | null
          time_to_relief?: string | null
          precautions?: string | null
          created_at?: string
          updated_at?: string
        }
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
