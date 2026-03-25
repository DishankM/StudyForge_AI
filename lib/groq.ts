import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY environment variable");
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper function for standard Groq calls
export async function callGroq(
  prompt: string,
  systemPrompt?: string,
  maxTokens: number = 4000,
  model: string = "llama-3.3-70b-versatile"
) {
  try {
    const messages = systemPrompt
      ? [
          { role: "system" as const, content: systemPrompt },
          { role: "user" as const, content: prompt },
        ]
      : [{ role: "user" as const, content: prompt }];

    const response = await groq.chat.completions.create({
      model,
      max_tokens: maxTokens,
      messages,
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Groq response did not include message content");
    }

    return content;
  } catch (error) {
    console.error("Groq API error:", error);
    throw new Error("Failed to generate content with Groq AI");
  }
}
