// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.28.0'
import { encryptObjectFields } from './encryption.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id',
}

// Fields that should be encrypted in each table
const encryptedFields = {
  symptoms: ['name'] as const,
  solutions: ['description', 'time_to_relief', 'notes'] as const,
}

console.log("Hello from Functions!")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Received request");

    // Get the user ID from the request headers
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

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
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the audio data from the request
    const body = await req.json();
    console.log("Request body received:", { hasAudio: !!body.audio, bodyKeys: Object.keys(body) });

    const { audio } = body;
    if (!audio) {
      throw new Error('No audio data provided')
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    // Convert base64 audio to buffer
    console.log("Converting audio to buffer...");
    const audioBuffer = Uint8Array.from(atob(audio), c => c.charCodeAt(0))
    console.log("Audio buffer created, size:", audioBuffer.length);

    // Transcribe audio using OpenAI Whisper
    console.log("Starting transcription...");
    const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' });
    const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "json",
      temperature: 0,
      language: "en"
    });
    console.log("Transcription received:", transcription.text);

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

    console.log("Sending prompt to GPT...");
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });
    console.log("GPT response received");

    const extractedData = JSON.parse(completion.choices[0].message?.content || '{}')
    console.log("Extracted data:", JSON.stringify(extractedData, null, 2));

    // Insert symptoms and solutions into the database
    for (const symptom of extractedData.symptoms) {
      console.log("Inserting symptom:", symptom.name);

      // Encrypt the symptom data
      const encryptedSymptom = await encryptObjectFields(symptom, encryptedFields.symptoms, userId);

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
        console.error("Error inserting symptom:", symptomError);
        throw symptomError;
      }

      if (extractedData.solutions && symptomData) {
        console.log("Inserting solutions for symptom:", symptom.name);

        // Encrypt the solutions data
        const encryptedSolutions = await Promise.all(
          extractedData.solutions.map(solution =>
            encryptObjectFields(solution, encryptedFields.solutions, userId)
          )
        );

        console.log("Encrypted solutions:", encryptedSolutions);

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
          console.error("Error inserting solutions:", solutionsError);
          throw solutionsError;
        }
      }
    }

    // Decrement credits only after successful processing
    const { error: updateError } = await supabaseClient.rpc('decrement_credits', {
      p_user_id: userId
    });

    if (updateError) {
      console.error("Error decrementing credits:", updateError);
      throw updateError;
    }

    console.log("Successfully processed voice recording");
    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Error in process-voice function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/process-voice' \
    --header 'Authorization: Bearer ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
