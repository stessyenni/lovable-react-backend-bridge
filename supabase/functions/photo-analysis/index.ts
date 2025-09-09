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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { imageUrl, userId } = await req.json();

    if (!imageUrl || !userId) {
      throw new Error('Image URL and userId are required');
    }

    console.log('Analyzing image:', imageUrl, 'for user:', userId);

    // Call OpenAI Vision API to analyze the image
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this image and provide a detailed description of what you see. Focus on identifying:
                1. Objects, people, animals, or scenes in the image
                2. Colors, lighting, and composition
                3. Any text or writing visible
                4. The setting or environment
                5. Activities or actions taking place
                
                If this is a food/meal image, also provide nutritional estimates. But analyze ALL content, not just food.
                
                Format your response as JSON with these fields:
                {
                  "description": "Detailed description of the image",
                  "detectedItems": ["list of main items/objects seen"],
                  "colors": ["dominant colors"],
                  "setting": "description of environment/setting",
                  "activities": ["any activities or actions visible"],
                  "textContent": "any text visible in the image",
                  "isFood": true/false,
                  "nutritionalInfo": {
                    "estimatedCalories": 0,
                    "protein": "0g",
                    "carbs": "0g",
                    "fat": "0g",
                    "fiber": "0g"
                  },
                  "suggestions": ["relevant suggestions based on content"]
                }`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_completion_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    console.log('OpenAI analysis result:', analysisText);

    // Try to parse as JSON, fallback to structured format
    let analysisResult;
    try {
      analysisResult = JSON.parse(analysisText);
    } catch (parseError) {
      // Fallback: create structured result from text
      analysisResult = {
        description: analysisText,
        detectedItems: ["Image content analysis"],
        colors: ["Various colors"],
        setting: "Unknown setting",
        activities: ["Various activities"],
        textContent: "",
        isFood: analysisText.toLowerCase().includes('food') || analysisText.toLowerCase().includes('meal'),
        nutritionalInfo: {
          estimatedCalories: 0,
          protein: "0g",
          carbs: "0g", 
          fat: "0g",
          fiber: "0g"
        },
        suggestions: ["Analysis completed"]
      };
    }

    // Save analysis result to database
    const { error: insertError } = await supabase
      .from('diet_uploads')
      .insert({
        user_id: userId,
        image_url: imageUrl,
        analysis_result: analysisResult,
        ai_suggestions: analysisResult.suggestions || []
      });

    if (insertError) {
      console.error('Error saving analysis result:', insertError);
      throw insertError;
    }

    console.log('Analysis saved successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      analysis: analysisResult 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in photo analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});