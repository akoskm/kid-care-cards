import { createClient } from '@supabase/supabase-js';
import { decryptFields } from '@/lib/encryption';
import { Solution } from '@/types/supabase-types';

// Initialize Supabase client with service role
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to get user's salt
async function getUserSalt(userId: string): Promise<string> {
  const { data: saltData, error } = await supabaseClient
    .from('user_salts')
    .select('salt')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Failed to retrieve encryption salt:', error);
    throw new Error('Failed to retrieve encryption salt');
  }

  if (!saltData) {
    throw new Error('No salt data found');
  }

  return saltData.salt;
}

export async function GET(req: Request) {
  try {
    // Get the user ID from the request headers
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get the user's salt for decryption
    const salt = await getUserSalt(userId);

    // Fetch all symptoms and their related solutions
    const { data: symptoms, error: symptomsError } = await supabaseClient
      .from('symptoms')
      .select(`
        *,
        solutions (*),
        children (name)
      `)
      .eq('user_id', userId);

    if (symptomsError) {
      throw symptomsError;
    }

    // Decrypt the data
    const decryptedSymptoms = await Promise.all(
      symptoms.map(async (symptom) => {
        const decryptedSymptom = await decryptFields(symptom, ['name'], userId, salt);
        const decryptedSolutions = await Promise.all(
          symptom.solutions.map((solution: Solution) =>
            decryptFields(solution, ['description', 'time_to_relief', 'notes'], userId, salt)
          )
        );
        let decryptedChildName = '';
        if (symptom.children) {
          const decryptedChild = await decryptFields(symptom.children, ['name'], userId, salt);
          decryptedChildName = decryptedChild.name as string;
        }
        return {
          ...symptom,
          name: decryptedSymptom.name,
          solutions: decryptedSolutions,
          children: { name: decryptedChildName }
        };
      })
    );

    // Convert to CSV format
    const csvRows = [
      // Header row
      [
        'Symptom Name',
        'Severity',
        'Age Group',
        'Child Name',
        'Solution Description',
        'Effectiveness Rating',
        'Time to Relief',
        'Notes'
      ].join(',')
    ];

    // Add data rows
    for (const symptom of decryptedSymptoms) {
      if (symptom.solutions.length === 0) {
        // If no solutions, add a row with just the symptom data
        csvRows.push([
          symptom.name,
          symptom.severity,
          symptom.age_group,
          symptom.children?.name || '',
          '',
          '',
          '',
          ''
        ].map(field => `"${field?.toString().replace(/"/g, '""') || ''}"`).join(','));
      } else {
        // Add a row for each solution
        for (const solution of symptom.solutions) {
          csvRows.push([
            symptom.name,
            symptom.severity,
            symptom.age_group,
            symptom.children?.name || '',
            solution.description,
            solution.effectiveness_rating,
            solution.time_to_relief,
            solution.notes
          ].map(field => `"${field?.toString().replace(/"/g, '""') || ''}"`).join(','));
        }
      }
    }

    const csvContent = csvRows.join('\n');

    // Get current date in ISO format (YYYY-MM-DD)
    const currentDate = new Date().toISOString().split('T')[0];

    // Return the CSV file
    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="kid-care-cards-${currentDate}.csv"`
      }
    });
  } catch (error) {
    console.error("Error in export-data function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}