import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PredictionResult {
  plantName: string;
  diseaseName: string;
  confidence: number;
  description: string;
  remedies: string[];
  pesticides: string[];
}

export async function predictPlantDisease(base64Image: string): Promise<PredictionResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze this plant leaf image. 
  1. Identify the plant species.
  2. Detect if there is any disease.
  3. If diseased, provide the disease name, a brief description, remedies, and recommended pesticides.
  4. If healthy, state it clearly.
  Return the result in JSON format.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1] || base64Image,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          plantName: { type: Type.STRING },
          diseaseName: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          description: { type: Type.STRING },
          remedies: { type: Type.ARRAY, items: { type: Type.STRING } },
          pesticides: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["plantName", "diseaseName", "confidence", "description", "remedies", "pesticides"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function chatWithAssistant(message: string, history: any[] = []) {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are a helpful plant care assistant. Provide expert advice on gardening, farming, and plant health.",
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text;
}
