"use server";

import z from "zod";
import { createAI } from "./instance";
import { FunctionDeclaration, Type } from "@google/genai";
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "../transaction/action";
import { findEmbedding } from "./embedding";

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

const transactionProperties = {
  id: {
    type: Type.STRING,
    description: "The unique identifier of the transaction",
  },
  amount: {
    type: Type.NUMBER,
    description: "The amount of the transaction",
  },
  type: {
    type: Type.STRING,
    enum: ["income", "expense"],
    description: "The type of the transaction, either 'income' or 'expense'",
  },
  category: {
    type: Type.STRING,
    enum: [
      "Food & Drink",
      "Shopping",
      "Housing",
      "Transportation",
      "Entertainment",
      "Salary",
      "Others",
    ],
    description: "The category of the transaction",
  },
  description: {
    type: Type.STRING,
    description:
      "A brief description of the transaction, first letter capitalized.",
  },
  date: {
    type: Type.STRING,
    description: "The date of transaction in the format YYYY-MM-DD",
  },
};

const createTransactionDeclaration: FunctionDeclaration = {
  name: "createTransaction",
  description:
    "Create a new transaction in the user financial history based on the provided details.",
  parameters: {
    type: Type.OBJECT,
    properties: transactionProperties,
    required: ["amount", "description", "type", "category", "date"],
  },
};

const deleteTransactionDeclaration: FunctionDeclaration = {
  name: "deleteTransaction",
  description:
    "Delete an existing transaction from user's financial history based on provided data.",
  parameters: {
    type: Type.OBJECT,
    properties: transactionProperties,
  },
};

const updateTransactionDeclaration: FunctionDeclaration = {
  name: "updateTransaction",
  description:
    "Update an existing transaction from user's financial history based on provided data.",
  parameters: {
    type: Type.OBJECT,
    properties: transactionProperties,
  },
};

export async function handleWizardTools(message: string) {
  const contents = `
      <role>
          You are an AI Wizard finance assitant, who can extract transaction details from text.
      </role>
      <instruction>
          Extract the transaction details from the following text.
      </instruction>
      <context>
          Current Date : ${new Date().toISOString()}
      </context>
      <input>
          Text to extract: ${message}
      </input>
    `;

  const ai = createAI();
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents,
    config: {
      tools: [
        {
          functionDeclarations: [
            createTransactionDeclaration,
            deleteTransactionDeclaration,
            updateTransactionDeclaration,
          ],
        },
      ],
    },
  });

  if (response.functionCalls && response.functionCalls.length > 0) {
    await Promise.all(
      response.functionCalls.map(async (functionCall) => {
        const args = functionCall.args;
        if (!args) {
          throw new Error("No arguments provided for action desuwa");
        }
        switch (functionCall.name) {
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
            const data = await findEmbedding(JSON.stringify(args), 0.3, 1);
            const deletedData = data[0];
            await deleteTransaction(deletedData.id);
            break;
          case "updateTransaction":
            const dataFindForUpdate = await findEmbedding(
              JSON.stringify(args),
              0.3,
              1,
            );
            const updateData = dataFindForUpdate[0];

            const newData = transactionSchema.parse(args);
            if (newData.amount <= 0) {
              throw new Error("Cant update transaction with invalid amount");
            }

            await updateTransaction(updateData.id, newData);
            break;
          default:
            throw new Error(`Unknown function call desuwa`);
        }
      }),
    );

    return "Function executed successfully desuwa";
  } else {
    throw new Error("AI did not call any function desuwa");
  }
}
