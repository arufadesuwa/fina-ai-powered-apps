"use server";

import { Transaction } from "@/app/types/transaction";
import { findEmbedding } from "./embedding";
import { createAI } from "./instance";
import { Type } from "@google/genai";

export async function generateChart(req: string) {
  const ai = createAI();

  const data = await findEmbedding(req, 0.5, 50);

  let contextData = "";

  if (!data || data.length === 0) {
    contextData =
      "no Transaction found that are similar or relevant to the request";
  } else {
    contextData = data
      .map((transaction: Transaction) => {
        return JSON.stringify(transaction);
      })
      .join("\n");
  }

  const contents = {
    role: "user",
    parts: [
      {
        text: `
        <role>
          You are an AI Financial Analyst and Data Engineering specialist. Your task is to analyze transaction in <context> and generate a structured JSON configuration to render charts that directly response the user request.
        </role>
        <input>
          User request: "${req}"
        </input>
        <instruction>
          1. Analyze and filter the user's request and extract only the relevant transaction from the provided context,
          2. Grouping and summarization:
            - If the query is about expand type, group by category name.
            - If its about time trend, group by date, day, or month.
            - If its comparing income and expanse, group by type.
            - Limit the data to the top 10 most significant group to ensure chart is clean on the dashboard, Group smaller items into "Others" if necessary.
          3. Values and calculation: Ensure all currency values are aggregated correctly. Use positive number for visual chart representation.
          4. Chart type selection:
            - Use 'chartType: "Pie"' if the users asks for proportions, ratios, percentage, or category composition.
            - use 'chartType: "Bar"' if the users asks for comparisons, over-time trends, chronologcal analysis, or comparing individual entities.
        </instruction>
        <context>
          Current Date : ${new Date().toISOString()}
          Data transaction: ${contextData}
        </context>
        <constraints>
          - Respond strictly with a raw and valid JSON object matching the requested schema.
          - Do NOT include markdown code blocks, backticks, or any conversational text.
        </constraints>
        `,
      },
    ],
  };
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          chartType: {
            type: Type.STRING,
            enum: ["bar", "pie"],
            description: "Chart type to render",
          },
          data: {
            type: Type.ARRAY,
            description: "Array of object for data chart",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                value: { type: Type.NUMBER },
              },
            },
          },
        },
      },
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate chart");
  }

  const chartData = JSON.parse(response.text);

  return chartData;
}
