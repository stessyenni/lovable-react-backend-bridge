import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not set');
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { message, userId } = await req.json();

    if (!message || !userId) {
      throw new Error('Message and userId are required');
    }

    console.log('HemBot received message:', message, 'from user:', userId);

    // Get user profile for personalized responses
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, age, medical_conditions, allergies')
      .eq('id', userId)
      .single();

    const userName = profile?.first_name || 'there';
    const medicalConditions = profile?.medical_conditions || [];
    const allergies = profile?.allergies || [];

    // Create context-aware system prompt
    const systemPrompt = `You are HemBot, a friendly and knowledgeable AI health assistant for the Hemapp application. 

    User Information:
    - Name: ${userName}
    - Medical Conditions: ${medicalConditions.length > 0 ? medicalConditions.join(', ') : 'None reported'}
    - Allergies: ${allergies.length > 0 ? allergies.join(', ') : 'None reported'}

    Your role:
    - Provide helpful health advice and information
    - Answer questions about diet, nutrition, exercise, and general wellness
    - Be supportive and encouraging
    - Always recommend consulting healthcare professionals for serious concerns
    - Keep responses concise but informative (2-3 sentences max)
    - Use a friendly, caring tone
    - Never provide specific medical diagnoses or treatment plans

    EMERGENCY PROTOCOL:
    If the user describes symptoms that could indicate a medical emergency (chest pain, difficulty breathing, severe bleeding, loss of consciousness, stroke symptoms, severe allergic reactions, suicidal thoughts, etc.), you MUST:
    1. Immediately advise them to call emergency services (911/999/112) or go to the nearest emergency room
    2. Do NOT provide treatment advice for emergency situations
    3. Emphasize the urgency and importance of seeking immediate medical care
    4. Be supportive but firm about the need for professional emergency care

    IMPORTANT: Always include appropriate medical disclaimers in your responses, especially emphasizing that you cannot replace professional medical advice.

    Current conversation context: The user is using the Hemapp mobile health application.`;

    // Call Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.statusText}`);
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    console.log('HemBot generated response:', botResponse);

    // Save HemBot's response to the database
    const HEMBOT_ID = '99999999-9999-9999-9999-999999999999';
    
    const { error: insertError } = await supabase
      .from('messages')
      .insert({
        sender_id: HEMBOT_ID,
        recipient_id: userId,
        content: botResponse,
        message_type: 'text'
      });

    if (insertError) {
      console.error('Error saving HemBot response:', insertError);
      throw insertError;
    }

    console.log('HemBot response saved successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      response: botResponse 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in HemBot function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});