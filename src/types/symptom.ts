import { Symptom, Solution } from './supabase-types';

export type SymptomCard = Omit<Symptom, 'description' | 'severity'> & {
  symptom: string; // alias for name
  childId: string; // alias for child_id
  createdAt: string; // alias for created_at
  solutions: Solution[];
  severity?: number; // Make severity optional and non-nullable
};

// Helper type to convert between SymptomCard and SymptomInput
export type SymptomCardToInput = Omit<SymptomCard, 'id' | 'createdAt' | 'symptom' | 'childId'> & {
  name: string;
  child_id: string;
};
