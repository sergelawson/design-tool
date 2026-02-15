import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { LLMProvider } from "./types.js";

export class LangChainProvider implements LLMProvider {
  private modelName: string;

  constructor(modelName: string) {
    this.modelName = modelName;
  }

  async generateScreen(
    screenName: string,
    description: string,
    systemPrompt: string,
    deviceType: "mobile" | "desktop",
  ): Promise<string> {
    let model: BaseChatModel;

    if (this.modelName === "gpt-5.2") {
      model = new ChatOpenAI({
        modelName: "gpt-5.2", // Placeholder for gpt-5.2
        temperature: 0.7,
      });
    } else if (this.modelName === "gemini-3-pro") {
      model = new ChatGoogleGenerativeAI({
        model: "gemini-3-pro-preview", // Placeholder for gemini-3-pro
        temperature: 1,
      });
    } else {
      throw new Error(`Unsupported model: ${this.modelName}`);
    }

    const deviceInstruction =
      deviceType === "desktop"
        ? "Design this for desktop with max-width 1280px."
        : "Design this for mobile with fixed width 375px centered.";

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(
        `Create a screen named "${screenName}". Description: ${description}. ${deviceInstruction}`,
      ),
    ];

    const response = await model.invoke(messages);
    const content = typeof response.content === "string" ? response.content : "";

    // Strip markdown code blocks if present
    let cleanContent = content.trim();
    // Remove the opening ```html or ```
    cleanContent = cleanContent.replace(/^```(?:html)?\s*/i, "");
    // Remove the closing ```
    cleanContent = cleanContent.replace(/\s*```$/, "");

    console.log(`Generated screen "${screenName}" with ${this.modelName}:`, cleanContent);

    return cleanContent;
  }
}
