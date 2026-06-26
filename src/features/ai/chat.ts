"use server";

import { environment } from "@/config/environment";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: environment.googleApiKey });

export async function handleChat(message: string) {
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: "Why the sky is blue?",
    config: {},
  });

  console.log(res);
  return res.text;
}
