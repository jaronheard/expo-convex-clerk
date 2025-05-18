import { internalAction } from "./_generated/server";
import { v } from "convex/values";

export const generateSteps = internalAction({
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
        model: "gpt-3.5-turbo",
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

    const data = await response.json();
    const text: string = data.choices?.[0]?.message?.content || "";
    return text
      .split(/\n+/)
      .map((s) => s.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);
  },
});
