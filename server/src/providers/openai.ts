import OpenAI from "openai";
import { LLMProvider } from "./types.js";

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateScreen(
    screenName: string,
    description: string,
    systemPrompt: string,
  ): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Create a screen named "${screenName}". Description: ${description}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content || "";

    // Strip markdown code blocks if present
    let cleanContent = content.trim();
    // Remove the opening ```html or ```
    cleanContent = cleanContent.replace(/^```(?:html)?\s*/i, "");
    // Remove the closing ```
    cleanContent = cleanContent.replace(/\s*```$/, "");

    console.log(`Generated screen "${screenName}":`, cleanContent);

    return cleanContent;
  }
}
