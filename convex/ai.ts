import { v } from "convex/values";
import { action } from "./_generated/server";

export const generateSteps = action({
  args: { text: v.string() },
  handler: async (ctx, args): Promise<string[]> => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY not set");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Break down tasks into a short list of concise steps.",
          },
          { role: "user", content: `Task: ${args.text}` },
        ],
        temperature: 0.2,
      }),
    });
    if (!response.ok) {
      throw new Error(`OpenAI request failed: ${response.status}`);
    }

    const data = await response.json();
    const text: string = data.choices?.[0]?.message?.content || "";
    return text
      .split(/\n+/)
      .map((s) => s.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);
  },
});
