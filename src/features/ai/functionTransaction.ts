import { FunctionDeclaration, Type } from "@google/genai";

export const transactionProperties = {
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

export const createTransactionDeclaration: FunctionDeclaration = {
  name: "createTransaction",
  description:
    "Create a new transaction in the user financial history based on the provided details.",
  parameters: {
    type: Type.OBJECT,
    properties: transactionProperties,
    required: ["amount", "description", "type", "category", "date"],
  },
};

export const deleteTransactionDeclaration: FunctionDeclaration = {
  name: "deleteTransaction",
  description:
    "Delete an existing transaction from user's financial history based on provided data.",
  parameters: {
    type: Type.OBJECT,
    properties: transactionProperties,
  },
};

export const updateTransactionDeclaration: FunctionDeclaration = {
  name: "updateTransaction",
  description:
    "Update an existing transaction from user's financial history based on provided data.",
  parameters: {
    type: Type.OBJECT,
    properties: transactionProperties,
  },
};

export const getTransactionDeclaration: FunctionDeclaration = {
  name: "getTransaction",
  description:
    "Get transactions from the user financial history. Can be filtered by type, category, or date range.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      type: {
        type: Type.STRING,
        enum: ["income", "expense"],
        description: "Filter by type of transaction",
      },
      category: {
        type: Type.STRING,
        description: "Filter by transaction category",
      },
      startDate: {
        type: Type.STRING,
        description:
          "Filter start date in format YYYY-MM-DD (e.g., 2026-06-01 for June start)",
      },
      endDate: {
        type: Type.STRING,
        description:
          "Filter end date in format YYYY-MM-DD (e.g., 2026-06-30 for June end)",
      },
    },
  },
};
