export interface SymptomCard {
  id: string;
  symptom: string;
  solutions: Array<{
    description: string;
    effectiveness_rating?: number;
    time_to_relief?: string;
    precautions?: string;
  }>;
  notes?: string;
  createdAt: string;
  childId: string;
}
