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

// Base interface for common symptom fields
interface BaseSymptom {
  name: string;
  child_id?: string;
  severity?: number | null;
  age_group?: string | null;
}

export interface Symptom extends BaseSymptom {
  id: string;
  created_at: string;
  solutions?: Solution[];
}

// Base interface for common child fields
interface BaseChild {
  name: string;
  date_of_birth?: string | null;
}

export interface Child extends BaseChild {
  id: string;
}

// Make SymptomInput compatible with Record<string, unknown>
export interface SymptomInput extends BaseSymptom, Record<string, unknown> {
  solutions?: Solution[];
}

// Make ChildInput compatible with Record<string, unknown>
export interface ChildInput extends BaseChild, Record<string, unknown> {}
