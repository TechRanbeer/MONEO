import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the API client
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are MONEO, an empathetic and intelligent personal finance coach for Indian users.
Your currency is Indian Rupee (₹).
You help users with budgeting, saving, investing, and debt management.
Keep answers concise, encouraging, and actionable.
Do not give specific legal or tax advice, but provide general guidelines based on Indian financial context (e.g., FD, Mutual Funds, UPI, PPF).
`;

export const getFinancialAdvice = async (
  prompt: string, 
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  if (!apiKey) {
    // Fallback for demo purposes if no key is provided in environment
    return "I am ready to help! However, the system administrator needs to configure the API Key to enable my real-time AI brain. For now, I can tell you that saving consistently is key!";
  }

  try {
    const model = 'gemini-2.5-flash';
    
    // Convert history format if needed, or just use generateContent for single turn if history isn't maintained by the Chat object state in the component
    // For this implementation, we will use a stateless approach for the service wrapper or assume the component manages history string context.
    // To make it simple and robust for this snippet, we'll use generateContent with the system instruction.

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 0 } // Low latency for chat
      }
    });

    return response.text || "I couldn't process that right now. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the financial knowledge base right now. Please try again later.";
  }
};