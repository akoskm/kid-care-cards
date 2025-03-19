// Types for the supabase.ts file

// Make Solution compatible with Record<string, unknown>
export interface Solution extends Record<string, unknown> {
  id: string;
  symptom_id: string;
  description: string;
  effectiveness_rating?: number | null;
  time_to_relief?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Symptom {
  id: string;
  name: string;
  notes?: string | null;
  description?: string | null;
  child_id: string;
  severity?: number | null;
  age_group?: string | null;
  created_at: string;
  solutions?: Solution[];
}

export interface Child {
  id: string;
  name: string;
  date_of_birth?: string | null;
}

// Make SymptomInput compatible with Record<string, unknown>
export interface SymptomInput extends Record<string, unknown> {
  name: string;
  child_id: string;
  severity?: number;
  age_group?: string;
  notes?: string | null;
  solutions?: Solution[];
}

// Make ChildInput compatible with Record<string, unknown>
export interface ChildInput extends Record<string, unknown> {
  name: string;
  date_of_birth?: string | null;
}
