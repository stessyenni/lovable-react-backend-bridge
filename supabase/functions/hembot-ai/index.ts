import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const jsonResponse = (body: Record<string, unknown>, status: number) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const authHeader = req.headers.get('Authorization');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not set');
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase configuration missing');
    }

    if (!authHeader?.startsWith('Bearer ')) {
      return jsonResponse({ error: 'Unauthorized', success: false }, 401);
    }

    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
    const authenticatedUserId = claimsData?.claims?.sub;

    if (claimsError || !authenticatedUserId) {
      console.error('HemBot auth validation failed:', claimsError);
      return jsonResponse({ error: 'Unauthorized', success: false }, 401);
    }

    const requestBody = await req.json();
    const message = typeof requestBody?.message === 'string' ? requestBody.message.trim() : '';
    const requestedUserId = typeof requestBody?.userId === 'string' ? requestBody.userId : null;

    if (!message) {
      return jsonResponse({ error: 'Message is required', success: false }, 400);
    }

    if (message.length > 2000) {
      return jsonResponse({ error: 'Message is too long', success: false }, 400);
    }

    if (requestedUserId && requestedUserId !== authenticatedUserId) {
      return jsonResponse({ error: 'Forbidden', success: false }, 403);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log('HemBot received message from authenticated user:', authenticatedUserId);

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, age, medical_conditions, allergies')
      .eq('id', authenticatedUserId)
      .single();

    const userName = profile?.first_name || 'there';
    const medicalConditions = profile?.medical_conditions || [];
    const allergies = profile?.allergies || [];

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

    const HEMBOT_ID = '99999999-9999-9999-9999-999999999999';

    const { error: insertError } = await supabase
      .from('messages')
      .insert({
        sender_id: HEMBOT_ID,
        recipient_id: authenticatedUserId,
        content: botResponse,
        message_type: 'text'
      });

    if (insertError) {
      console.error('Error saving HemBot response:', insertError);
      throw insertError;
    }

    return jsonResponse({ success: true, response: botResponse }, 200);
  } catch (error) {
    console.error('Error in HemBot function:', error);
    return jsonResponse({
      error: 'Unable to process HemBot request',
      success: false,
    }, 500);
  }
});