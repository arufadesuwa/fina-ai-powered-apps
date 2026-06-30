"use server";

import { Conversation } from "@/app/types/ai";
import { createAI } from "./instance";
import z, { describe } from "zod";

export async function handleChat(
  conversation: Conversation[],
  isThinking: boolean,
) {
  const ai = createAI();
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [...conversation],
    config: {
      thinkingConfig: {
        includeThoughts: isThinking,
      },
    },
  });

  const result = {
    thought: "",
    answer: "",
  };

  if (isThinking) {
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      return;
    }

    for (const part of parts) {
      if (!part.text) {
        continue;
      } else if (part.thought) {
        result.thought += part.text;
      } else {
        result.answer += part.text;
      }
    }
  } else {
    result.answer = `${response.text}`;
  }

  return result;
}

// In zed editor it got error, but the app stil running tho
export async function* handleChatStreaming(
  conversation: Conversation[],
  isThinking: boolean,
) {
  const ai = createAI();

  const response = await ai.models.generateContentStream({
    model: "gemini-3.5-flash",
    contents: [...conversation],
    config: {
      thinkingConfig: {
        includeThoughts: isThinking,
        // thinkingLevel: isThinking ? ThinkingLevel.HIGH : ThinkingLevel.MINIMAL,
        // thinkingBudget: isThinking ? -1 : 0,
      },
      systemInstruction: `
      [Role]
      Kamu adalah Fina! Financial advisor yang punya gaya bahasa sopan dan suka memberikan analogi sehari-hari agar penjelasan rumit menjadi lebih mudah dipahami.

      [Instruction]
      - Jawab semua pertanyaan yang sesuai dengan bidang finance.

      [Context]
      Kamu bekerja untuk Fina, platform financial tracker yang target utamanya adalah Gen Z di Indonesia (Usia 18-30 tahun) dengan penghasilan yang beragam, dibawah 6 juta. Kebanyakan dari mereka mengalami FOMO, gaya hidup konsumtif dan tidak memikirkan dana darurat maupun investasi.

      [input]
      pengguna akan menanyakan seputar menabung, investasi, pengelolaan utang, dana darurat, atau pertanyaan lain seputar finance.

      [Constraints]
      - Jawab dengan bahasa Indonesia yang santai, sopan namun tetap profesional.
      - Jangan membuat asumsi tentang data dari pengguna jika mereka tidak menyebutkannya.
      - Jika ada pertanyaan diluar konteks terkait finance, maka kamu jawab bahwa kamu hanya bisa menjawab pertanyaan terkait finance.

      [Workflow Steps]
      -Langkah 1 (Information Extraction): Identifikasi pengguna, tanyakan usia, penghasilan/budget, tujuan keuangannya.
      -Langkah 2 (Thought): Analisis masalah utama pengguna dan data apa yang kurang.
      -Langkah 3 (Action): Tentukan rencana yang harus dijalankan.
      -Langkah 4 (Evaluation): Periksa kembali hasil dari action.
      -Langkah 5 (Response Generation): Keluarkan jawaban akhir ke pengguna

      [Response Format]
      Struktur jawab kamu harus seperti ini:
      1. Analisis singkat masalah pengguna dalam 1 kalimat.
      2. Langkah solusi

      [Example]
      Ikuti gaya jawaban dari contoh berikut:
      [Contoh 1]
      User: "Gaji saya 5 juta, gimana cara nabung dana darurat"
      Model: "Mengumpulkan dana darurat dengan gaji 5 juta itu sangat mungkin asalkan konsisten.
      Berikut langkah awalnya:
      - sisihkan minimal 10% di awal bulan.
      - Simpan di instrumen rendah resiko seperti RDPU"

      [Contoh 2]
      User: "Mending bayar hutang paylater atau mulai investasi"
      Model: "Prioritas utama yang sehat adalah melunasi utang konsumtuf dengan bunga tinggi.
      Ini saran untukmu:
      - Stop penggunaan paylater untuk sementara waktu.
      - Dana berlebih pakai untuk melunasi paylater tersebut karena bunga jauh lebih tinggi dari imbal hasil investasi.
      -Setelah lunas baru mulai rutin investasi"
      `,
      temperature: 0.2,
      topK: 5,
      topP: 0.1,
      maxOutputTokens: 2048,
      stopSequences: ["\n\n\n", "###", "User:", "Pengguna:"],
      // presencePenalty: 1.5, Some model doesnt support penalti
      // frequencyPenalty: 1.5,
    },
  });

  if (isThinking) {
    for await (const chunk of response) {
      const parts = chunk.candidates?.[0].content?.parts;
      if (parts) {
        for (const part of parts) {
          if (!part.text) {
            continue;
          } else if (part.thought) {
            yield `[thought]${part.text}`;
          } else {
            yield part.text;
          }
        }
      }
    }
  } else {
    for await (const chunk of response) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  }
}

const transactionSchema = z.object({
  amount: z.number().default(0).describe("Transaction nominal"),
  type: z.enum(["income", "expense"]).describe("Type of Transaction"),
  category: z
    .enum([
      "Food & Drink",
      "Shopping",
      "Housing",
      "Transportation",
      "Entertainment",
      "Salary",
      "Others",
    ])
    .describe("category of transaction"),
  description: z.string().describe("short text for describing transaction"),
  date: z.string().describe("date of transaction in YYYY-MM-DD format"),
});

export async function handleWizardInput(message: string) {
  const ai = createAI();

  const contents = `
    <role>
      You are an AI Wizard finance assistant, who can extract transaction details from text.
    </role>
    <instruction>
      Extract the transaction details from the followind text and return it as a structure JSON object.
      The JSON object must have exactly these fields:
      - "amount": a number representing the cost(positive). Use 0 if not provided
      - "type": type of transaction, either 'income' or 'expense'.
      - "category": choose the most appropriate category from this exact list:
          'Food & Drink','Shopping','Housing','Transportation','Entertainment','Salary','Others'.
      - "description": a short string describing the transaction, first letter capitalized.
      - "date": date of transaction in YYYY-MM-DD format.
          Assume the current date if relative terms like 'today' or 'just now'. if not define use current date.
    </instruction>

    <context>
      Current Date: ${new Date().toISOString()}
    </context>

    <input>
      Text to extract: ${message}
    </input>

    <outputFormat>
      Respond with only the raw JSON object, no markdown blocks, no text before of after.
    </outputFormat>
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: z.toJSONSchema(transactionSchema),
    },
  });

  const transaction = transactionSchema.parse(JSON.parse(`${response.text}`));
  if (transaction.amount <= 0) {
    throw new Error("Cannot create transaction with invalid amount");
  }
  return transaction;
}
