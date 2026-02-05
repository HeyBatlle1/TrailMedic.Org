import { GoogleGenerativeAI } from '@google/generative-ai';
import { TraumaAssessmentRequest, TraumaAssessmentResponse } from '../types';

// Use environment variable or fallback to a placeholder
// This will be replaced with the actual API key in production
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyA-zFHIXpULagi0bLM2AM-Gmt3my5UK_Us';
const MODEL_NAME = 'gemini-2.0-flash';

// Initialize the API client conditionally
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

try {
  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ model: MODEL_NAME });
} catch (error) {
  console.error('Failed to initialize Google AI:', error);
}

const SYSTEM_PROMPT = `You are an emergency medical AI assistant. Analyze the provided injury information and provide structured guidance.
Focus on immediate survival actions and assessment steps. Be clear and concise.
Format your response as a JSON object with these fields:
- severity_level: "critical" | "serious" | "moderate" | "minor"
- immediate_actions: string[] of urgent steps
- assessment_steps: string[] of evaluation steps
- red_flags: string[] of warning signs
- next_steps: string[] of follow-up actions`;

const CHAT_PROMPT = `You are an emergency medical AI assistant providing guidance in a wilderness survival situation. 
Keep responses clear, direct, and focused on practical actions.
Consider the full context of the injury and previous assessment when answering.
If you're unsure about anything, err on the side of caution and recommend seeking professional medical care when available.`;

export async function getTraumaAssessment(request: TraumaAssessmentRequest): Promise<TraumaAssessmentResponse> {
  try {
    // Check if API is properly initialized
    if (!genAI || !model) {
      console.error('Google AI not initialized');
      throw new Error('AI service unavailable');
    }

    const prompt = `
Patient Information:
- Age: ${request.age || 'Unknown'}
- Gender: ${request.gender || 'Not specified'}
- Conscious: ${request.conscious ? 'Yes' : 'No'}
- Mechanism of Injury: ${request.mechanismOfInjury}
- Reported Symptoms: ${request.reportedSymptoms.join(', ')}
- Obvious Bleeding: ${request.obviousBleeding ? 'Yes' : 'No'}

Provide emergency medical guidance for this situation.`;

    const result = await model.generateContent([SYSTEM_PROMPT, prompt]);
    const response = result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }
    
    try {
      const parsedResponse = JSON.parse(jsonMatch[0]) as TraumaAssessmentResponse;
      
      if (!parsedResponse.severity_level || !parsedResponse.immediate_actions) {
        throw new Error('Incomplete AI response');
      }
      
      return parsedResponse;
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('AI Assessment Error:', error);
    throw error;
  }
}

export async function getChatResponse(injuryContext: string, userMessage: string): Promise<string> {
  try {
    // Check if API is properly initialized
    if (!genAI || !model) {
      console.error('Google AI not initialized');
      throw new Error('AI service unavailable');
    }

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [`Context: ${injuryContext}`],
        },
        {
          role: 'assistant',
          parts: [CHAT_PROMPT],
        },
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Chat response error:', error);
    throw error;
  }
}
