import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { encryptFields } from '@/lib/encryption';

// Fields that should be encrypted in each table
const encryptedFields = {
  symptoms: ['name'] as const,
  solutions: ['description', 'time_to_relief', 'notes'] as const,
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export async function POST(req: Request) {
  try {
    // Get the user ID from the request headers
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get the user's salt
    const salt = await getUserSalt(userId);

    // Check credit balance
    const { data: creditData } = await supabaseClient
      .from('credits')
      .select('credits')
      .eq('user_id', userId)
      .single();

    if (!creditData || creditData.credits <= 0) {
      return new Response(
        JSON.stringify({ error: 'Insufficient credits. Please purchase more credits to continue using dictation.' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the audio data from the request
    const body = await req.json();
    const { audio } = body;
    if (!audio) {
      throw new Error('No audio data provided');
    }

    // Convert base64 audio to buffer
    const audioBuffer = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
    const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' });
    const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });

    // Transcribe audio using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "json",
      temperature: 0,
      language: "en"
    });

    // Process the transcription to extract symptoms and solutions
    const prompt = `Extract symptoms and solutions from this medical transcription. Format the response as JSON with the following structure:
    {
      "symptoms": [
        {
          "name": "symptom name",
          "severity": number (1-5),
          "age_group": "all" or specific age group,
        }
      ],
      "solutions": [
        {
          "description": "solution description",
          "effectiveness_rating": number (1-5),
          "time_to_relief": "estimated time",
          "notes": "additional details"
        }
      ]
    }

    Transcription: ${transcription.text}`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const extractedData = JSON.parse(completion.choices[0].message?.content || '{}');

    // Insert symptoms and solutions into the database
    for (const symptom of extractedData.symptoms) {
      // Encrypt the symptom data using the salt
      const encryptedSymptom = await encryptFields(symptom, encryptedFields.symptoms, userId, salt);

      const { data: symptomData, error: symptomError } = await supabaseClient
        .from('symptoms')
        .insert({
          name: encryptedSymptom.name,
          severity: symptom.severity,
          age_group: symptom.age_group,
          child_id: null,
          user_id: userId,
        })
        .select()
        .single()

      if (symptomError) {
        throw symptomError;
      }

      if (extractedData.solutions && symptomData) {
        // Encrypt the solutions data using the salt
        const encryptedSolutions = await Promise.all(
          extractedData.solutions.map((solution: {
            description: string;
            effectiveness_rating: number;
            time_to_relief: string;
            notes: string;
          }) =>
            encryptFields(solution, encryptedFields.solutions, userId, salt)
          )
        );

        const solutionsToInsert = encryptedSolutions.map(solution => ({
          symptom_id: symptomData.id,
          description: solution.description,
          effectiveness_rating: solution.effectiveness_rating,
          time_to_relief: solution.time_to_relief,
          notes: solution.notes,
        }))

        const { error: solutionsError } = await supabaseClient
          .from('solutions')
          .insert(solutionsToInsert)

        if (solutionsError) {
          throw solutionsError;
        }
      }
    }

    // Decrement credits only after successful processing
    const { error: updateError } = await supabaseClient.rpc('decrement_credits', {
      p_user_id: userId
    });

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in process-voice function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}