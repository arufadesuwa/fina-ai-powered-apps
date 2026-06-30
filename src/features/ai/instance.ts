import { environment } from "@/config/environment";
import { GoogleGenAI } from "@google/genai";

export function createAI() {
  if (!environment.googleApiKey) {
    throw new Error("AI API Key is missing desuwa");
  }
  const ai = new GoogleGenAI({ apiKey: environment.googleApiKey });

  return ai;
}
