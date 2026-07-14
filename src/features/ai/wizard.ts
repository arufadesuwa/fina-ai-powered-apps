"use server";

import z from "zod";
import { createAI } from "./instance";
import { Content } from "@google/genai";
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "../transaction/action";
import { findEmbedding } from "./embedding";
import {
  createTransactionDeclaration,
  deleteTransactionDeclaration,
  getTransactionDeclaration,
  updateTransactionDeclaration,
} from "./functionTransaction";

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
      - "category": choose the most appropriate category from this exact list and you can only use this category; you are not allowed to create other categories.:
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

export async function handleWizardTools(message: string) {
  const contents: Content[] = [
    {
      role: "user",
      parts: [
        {
          text: `
          <role>
            You are an AI Wizard finance assitant, who can extract transaction details from text.
          </role>
          <instruction>
            Extract the transaction details from the following text.
            - If request is to update or delete data. you must call function get_transaction first which transaction will be updated or deleted.
            - When update transaction, args must return from get_transaction before with fully like in schema.
            - The final response if there are no more functions being called is as simple as possible.
          </instruction>
          <context>
            Current Date : ${new Date().toISOString()}
          </context>
          <input>
            Text to extract: ${message}
          </input>
          `,
        },
      ],
    },
  ];

  const ai = createAI();
  let running = true;
  while (running) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        tools: [
          {
            functionDeclarations: [
              getTransactionDeclaration,
              createTransactionDeclaration,
              updateTransactionDeclaration,
              deleteTransactionDeclaration,
            ],
          },
        ],
      },
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      if (response.candidates && response.candidates[0]?.content) {
        contents.push(response.candidates[0].content);
      }
      const functionResponseParts = await Promise.all(
        response.functionCalls.map(async (functionCall) => {
          const { name, args, id } = functionCall;
          if (!args) {
            throw new Error("No arguments provided for action desuwa");
          }

          let resultData = {};

          switch (name) {
            case "getTransaction":
              const dataFind = await findEmbedding(
                JSON.stringify(args),
                0.3,
                3,
              );
              resultData = dataFind || {}; // Ketika meminta mendelete data > 1, agent hanya menghapus data jamak contohnya data duplikat , saat ini saya mengganti dataFind[0]. Saya berencana redefine instruction. Jika tetap ingin menggunakan dataFind[0] berarti harus mendefenisikan dengan lengkap data yang ingin dihapus
              break;
            case "createTransaction":
              const transaction = transactionSchema.parse(args);
              if (transaction.amount < 0) {
                throw new Error(
                  "Cant create transaction with invalid amount desuwa",
                );
              }
              await createTransaction(transaction);
              break;
            case "deleteTransaction":
              await deleteTransaction(`${args.id}`);
              break;
            case "updateTransaction":
              const newData = transactionSchema.parse(args);
              if (newData.amount <= 0) {
                throw new Error("Cant update transaction with invalid amount");
              }

              await updateTransaction(`${args.id}`, newData);
              break;
            default:
              throw new Error(`Unknown function call desuwa`);
          }

          return {
            functionResponse: {
              name,
              response: { result: resultData },
              id,
            },
          };
        }),
      );

      contents.push({
        role: "user",
        parts: functionResponseParts,
      });
    } else {
      running = false;
      return response.text;
    }
  }
}
