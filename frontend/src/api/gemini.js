import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is not set in .env file");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const getKidneyAdvice = async (disease) => {
  if (!disease) throw new Error("No disease provided");
  
  if (!apiKey) {
    throw new Error("API key not configured");
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
You are a medical education assistant.

A patient has: ${disease}

Give:
- Simple explanation
- Diet advice
- Lifestyle tips
- Warning signs

Rules:
- Do NOT diagnose
- Always say consult doctor
- Keep it simple
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(`Failed to generate advice: ${error.message}`);
  }
};