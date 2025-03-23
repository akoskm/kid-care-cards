// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Hello from Functions!")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Received request");

    // Get the audio data from the request
    const body = await req.json();
    console.log("Request body received:", { hasAudio: !!body.audio, bodyKeys: Object.keys(body) });

    const { audio } = body;
    if (!audio) {
      throw new Error('No audio data provided')
    }

    // Initialize OpenAI client
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // Convert base64 audio to buffer
    console.log("Converting audio to buffer...");
    const audioBuffer = Uint8Array.from(atob(audio), c => c.charCodeAt(0))
    console.log("Audio buffer created, size:", audioBuffer.length);

    // Transcribe audio using OpenAI Whisper
    console.log("Starting transcription...");
    const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' });

    // Create form data according to OpenAI's documentation
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'json');
    formData.append('temperature', '0');
    formData.append('language', 'en');

    // Make the request directly to OpenAI's API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const transcription = await response.json();
    console.log("Transcription received:", transcription.text);

    // Process the transcription to extract symptoms and solutions
    const prompt = `Extract symptoms and solutions from this medical transcription. Format the response as JSON with the following structure:
    {
      "symptoms": [
        {
          "name": "symptom name",
          "severity": number (1-5),
          "age_group": "all" or specific age group,
          "notes": "additional details"
        }
      ],
      "solutions": [
        {
          "description": "solution description",
          "effectiveness_rating": number (1-5),
          "time_to_relief": "estimated time",
          "precautions": "any precautions"
        }
      ]
    }

    Transcription: ${transcription.text}`

    console.log("Sending prompt to GPT...");

    // Make the request directly to OpenAI's chat completion API
    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!chatResponse.ok) {
      const errorData = await chatResponse.json();
      throw new Error(`OpenAI Chat API error: ${errorData.error?.message || chatResponse.statusText}`);
    }

    const chatCompletion = await chatResponse.json();
    console.log("GPT response received");

    const extractedData = JSON.parse(chatCompletion.choices[0].message?.content || '{}')
    console.log("Extracted data:", JSON.stringify(extractedData, null, 2));

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Insert symptoms and solutions into the database
    for (const symptom of extractedData.symptoms) {
      console.log("Inserting symptom:", symptom.name);
      const { data: symptomData, error: symptomError } = await supabaseClient
        .from('symptoms')
        .insert({
          name: symptom.name,
          severity: symptom.severity,
          age_group: symptom.age_group,
          notes: symptom.notes,
          child_id: req.headers.get('x-child-id') || null,
        })
        .select()
        .single()

      if (symptomError) {
        console.error("Error inserting symptom:", symptomError);
        throw symptomError;
      }

      // Insert solutions for this symptom
      if (extractedData.solutions && symptomData) {
        console.log("Inserting solutions for symptom:", symptom.name);
        const solutionsToInsert = extractedData.solutions.map(solution => ({
          symptom_id: symptomData.id,
          description: solution.description,
          effectiveness_rating: solution.effectiveness_rating,
          time_to_relief: solution.time_to_relief,
          precautions: solution.precautions,
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
