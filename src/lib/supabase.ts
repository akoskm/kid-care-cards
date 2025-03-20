import { createClient } from '@supabase/supabase-js';
import { encryptFields, decryptFields } from './encryption';
import { Database } from '../types/supabase';
import { Solution, SymptomInput, ChildInput } from '../types/supabase-types';

// Use environment variables for Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'supabase-auth',
    storage: {
      getItem: (key) => {
        if (typeof window === 'undefined') return null;
        return JSON.parse(window.localStorage.getItem(key) || 'null');
      },
      setItem: (key, value) => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      },
      removeItem: (key) => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
      },
    },
  },
});

// Fields that should be encrypted in each table
const encryptedFields = {
  symptoms: ['name', 'description', 'notes'] as const,
  solutions: ['description', 'notes', 'time_to_relief'] as const,
  children: ['name'] as const,
};

// Secure data operations with encryption
export const secureDataOperations = {
  async insertSymptom(data: SymptomInput) {
    try {
      const encryptedData = await encryptFields(data, encryptedFields.symptoms);

      // First, insert the symptom
      const { data: symptom, error: symptomError } = await supabase
        .from('symptoms')
        .insert({
          name: encryptedData.name,
          child_id: data.child_id,
          severity: data.severity || 1,
          age_group: data.age_group || 'all',
          notes: encryptedData.notes || null,
        })
        .select('id, name, description, notes, child_id, severity, age_group, created_at')
        .single();

      if (symptomError) throw symptomError;

      // Then, insert the solutions if any
      if (data.solutions && data.solutions.length > 0) {
        const solutionsToInsert = await Promise.all(
          data.solutions.map(async (solution: Solution) => {
            const encryptedSolution = await encryptFields(solution, encryptedFields.solutions);
            return {
              ...encryptedSolution,
              symptom_id: symptom.id,
            };
          })
        );

        const { error: solutionsError } = await supabase
          .from('solutions')
          .insert(solutionsToInsert);

        if (solutionsError) throw solutionsError;
      }

      // Finally, fetch the complete symptom with solutions
      const { data: result, error: fetchError } = await supabase
        .from('symptoms')
        .select(`
          id,
          name,
          notes,
          description,
          child_id,
          severity,
          age_group,
          created_at,
          solutions (
            id,
            description,
            notes,
            effectiveness_rating,
            time_to_relief
          )
        `)
        .eq('id', symptom.id)
        .single();

      if (fetchError) throw fetchError;

      // Decrypt the data before returning
      const decryptedSymptom = await decryptFields(result, encryptedFields.symptoms);

      if (result.solutions) {
        decryptedSymptom.solutions = await Promise.all(
          result.solutions.map(async (solution) =>
            await decryptFields(solution, encryptedFields.solutions)
          )
        );
      }

      return decryptedSymptom;
    } catch (error) {
      console.error('Insert symptom failed:', error);
      throw new Error('Failed to insert symptom');
    }
  },

  async updateSymptom(id: string, data: SymptomInput) {
    try {
      const encryptedData = await encryptFields(data, encryptedFields.symptoms);

      // First update the symptom
      const { error: symptomError } = await supabase
        .from('symptoms')
        .update({
          name: encryptedData.name,
          child_id: data.child_id,
          severity: data.severity || 1,
          age_group: data.age_group || 'all',
          notes: encryptedData.notes || null,
        })
        .eq('id', id);

      if (symptomError) throw symptomError;

      // Handle solutions
      if (data.solutions && data.solutions.length > 0) {
        // Separate new and existing solutions
        const existingSolutions = data.solutions.filter(s => s.id);
        const newSolutions = data.solutions.filter(s => !s.id);

        // Get the IDs of existing solutions that should remain
        const existingSolutionIds = existingSolutions.map(s => s.id as string);

        if (existingSolutionIds.length > 0) {
          // Delete solutions that are no longer present
          const { error: deleteError } = await supabase
            .from('solutions')
            .delete()
            .eq('symptom_id', id)
            .not('id', 'in', existingSolutionIds);

          if (deleteError) throw deleteError;
        } else {
          // If there are no existing solutions to keep, delete all solutions for this symptom
          const { error: deleteError } = await supabase
            .from('solutions')
            .delete()
            .eq('symptom_id', id);

          if (deleteError) throw deleteError;
        }

        // Update existing solutions
        if (existingSolutions.length > 0) {
          const existingSolutionsToUpdate = await Promise.all(
            existingSolutions.map(async (solution) => {
              const encryptedSolution = await encryptFields(solution, encryptedFields.solutions);
              return {
                ...encryptedSolution,
                symptom_id: id,
              };
            })
          );

          const { error: updateError } = await supabase
            .from('solutions')
            .upsert(existingSolutionsToUpdate);

          if (updateError) throw updateError;
        }

        // Insert new solutions
        if (newSolutions.length > 0) {
          const newSolutionsToInsert = await Promise.all(
            newSolutions.map(async (solution) => {
              const encryptedSolution = await encryptFields(solution, encryptedFields.solutions);
              return {
                ...encryptedSolution,
                symptom_id: id,
              };
            })
          );

          const { error: insertError } = await supabase
            .from('solutions')
            .insert(newSolutionsToInsert);

          if (insertError) throw insertError;
        }
      }

      // Fetch updated symptom with solutions
      const { data: result, error: fetchError } = await supabase
        .from('symptoms')
        .select(`
          id,
          name,
          notes,
          description,
          child_id,
          severity,
          age_group,
          created_at,
          solutions (
            id,
            description,
            notes,
            effectiveness_rating,
            time_to_relief
          )
        `)
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Decrypt the data before returning
      const decryptedSymptom = await decryptFields(result, encryptedFields.symptoms);

      if (result.solutions) {
        decryptedSymptom.solutions = await Promise.all(
          result.solutions.map(async (solution) =>
            await decryptFields(solution, encryptedFields.solutions)
          )
        );
      }

      return decryptedSymptom;
    } catch (error) {
      console.error('Update symptom failed:', error);
      throw new Error('Failed to update symptom');
    }
  },

  async deleteSymptom(id: string) {
    try {
      const { error } = await supabase
        .from('symptoms')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Delete symptom failed:', error);
      throw new Error('Failed to delete symptom');
    }
  },

  async getSymptoms() {
    try {
      const { data, error } = await supabase
        .from('symptoms')
        .select(`
          id,
          name,
          notes,
          description,
          child_id,
          severity,
          age_group,
          created_at,
          solutions (
            id,
            symptom_id,
            description,
            notes,
            effectiveness_rating,
            time_to_relief
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) return [];

      // Decrypt all symptoms and their solutions
      const decryptedSymptoms = await Promise.all(
        data.map(async (symptom) => {
          const decryptedSymptom = await decryptFields(symptom, encryptedFields.symptoms);

          if (symptom.solutions && symptom.solutions.length > 0) {
            decryptedSymptom.solutions = await Promise.all(
              symptom.solutions.map(async (solution) =>
                await decryptFields(solution, encryptedFields.solutions)
              )
            );
          }

          return decryptedSymptom;
        })
      );

      return decryptedSymptoms;
    } catch (error) {
      console.error('Get symptoms failed:', error);
      throw new Error('Failed to get symptoms');
    }
  },

  async insertChild(data: ChildInput) {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be logged in to add a child');
      }

      const encryptedData = await encryptFields(data, encryptedFields.children);

      const { data: child, error } = await supabase
        .from('children')
        .insert({
          name: encryptedData.name,
          date_of_birth: data.date_of_birth,
          user_id: user.id, // Associate the child with the current user
        })
        .select('id, name, date_of_birth')
        .single();

      if (error) throw error;

      const decryptedChild = await decryptFields(child, encryptedFields.children);
      return decryptedChild;
    } catch (error) {
      console.error('Insert child failed:', error);
      throw new Error('Failed to insert child');
    }
  },

  async updateChild(id: string, data: ChildInput) {
    try {
      const encryptedData = await encryptFields(data, encryptedFields.children);

      const { data: child, error } = await supabase
        .from('children')
        .update({
          name: encryptedData.name,
          date_of_birth: data.date_of_birth,
        })
        .eq('id', id)
        .select('id, name, date_of_birth')
        .single();

      if (error) throw error;

      const decryptedChild = await decryptFields(child, encryptedFields.children);
      return decryptedChild;
    } catch (error) {
      console.error('Update child failed:', error);
      throw new Error('Failed to update child');
    }
  },

  async deleteChild(id: string) {
    try {
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Delete child failed:', error);
      throw new Error('Failed to delete child');
    }
  },

  async getChildren() {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('id, name, date_of_birth')
        .order('name');

      if (error) throw error;

      if (!data || data.length === 0) return [];

      // Decrypt all children names
      const decryptedChildren = await Promise.all(
        data.map(child => decryptFields(child, encryptedFields.children))
      );

      return decryptedChildren;
    } catch (error) {
      console.error('Get children failed:', error);
      throw new Error('Failed to get children');
    }
  },

  async searchSymptoms(searchTerm: string) {
    try {
      // Get all symptoms with their solutions
      const { data, error } = await supabase
        .from('symptoms')
        .select(`
          id,
          name,
          notes,
          description,
          child_id,
          severity,
          age_group,
          created_at,
          solutions (
            id,
            symptom_id,
            description,
            notes,
            effectiveness_rating,
            time_to_relief
          )
        `);

      if (error) throw error;

      // Decrypt all the data
      const decryptedData = await Promise.all(
        data.map(async (symptom) => {
          const decryptedSymptom = await decryptFields(symptom, encryptedFields.symptoms);

          if (symptom.solutions) {
            decryptedSymptom.solutions = await Promise.all(
              symptom.solutions.map(async (solution) =>
                await decryptFields(solution, encryptedFields.solutions)
              )
            );
          }

          return decryptedSymptom;
        })
      );

      // Filter the decrypted data based on the search term
      const searchTermLower = searchTerm.toLowerCase();
      const filteredData = decryptedData.filter(symptom => {
        // Search in symptom name
        if (symptom.name && symptom.name.toLowerCase().includes(searchTermLower)) {
          return true;
        }

        // Search in notes
        if (symptom.notes && symptom.notes.toLowerCase().includes(searchTermLower)) {
          return true;
        }

        // Search in solutions
        if (symptom.solutions && symptom.solutions.length > 0) {
          return symptom.solutions.some(solution =>
            solution.description && solution.description.toLowerCase().includes(searchTermLower) ||
            solution.notes && solution.notes.toLowerCase().includes(searchTermLower)
          );
        }

        return false;
      });

      return filteredData;
    } catch (error) {
      console.error('Search symptoms failed:', error);
      throw new Error('Failed to search symptoms');
    }
  }
};

// Input validation helpers
export const validateSymptom = (symptom: string): boolean => {
  return !!symptom && symptom.trim().length > 0 && symptom.trim().length <= 200;
};

export const validateSolutions = (solutions: Array<{description: string; effectiveness_rating?: number; time_to_relief?: string; notes?: string;}>): boolean => {
  if (!solutions || solutions.length === 0) return true;
  return solutions.every(s => !!s.description && s.description.trim().length > 0 && s.description.trim().length <= 500);
};
