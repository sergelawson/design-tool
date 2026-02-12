import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { GenerateScreenSchema } from "../types/schemas.js";
import { ServerMessage } from "../types/messages.js";
import { OpenAIProvider } from "../providers/openai.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function* handleGenerate(payload: unknown) {
  // Validate payload
  const result = GenerateScreenSchema.safeParse(payload);

  if (!result.success) {
    const errorMsg: ServerMessage = {
      type: "error",
      message: `Invalid payload: ${result.error.message}`,
    };
    yield errorMsg;
    return;
  }

  const { screens } = result.data;

  // Read system-prompt.md from project root
  // handler is in server/src/handlers/
  // prompt is in project root
  // path: ../../../system-prompt.md
  const promptPath = resolve(__dirname, "../../../system-prompt.md");

  let systemPrompt: string;
  try {
    systemPrompt = await fs.readFile(promptPath, "utf-8");
  } catch (error) {
    console.error(`Failed to read system prompt at ${promptPath}:`, error);
    const errorMsg: ServerMessage = {
      type: "error",
      message: "Failed to load system prompt configuration.",
    };
    yield errorMsg;
    return;
  }

  const provider = new OpenAIProvider();

  // Process screens sequentially
  for (const screen of screens) {
    // Send loading update
    const loadingMsg: ServerMessage = {
      type: "screen_update",
      screenId: screen.id,
      status: "loading",
    };
    yield loadingMsg;

    try {
      const html = await provider.generateScreen(screen.name, screen.description, systemPrompt);

      // Send success update
      const successMsg: ServerMessage = {
        type: "screen_update",
        screenId: screen.id,
        status: "ready",
        html,
      };
      yield successMsg;
    } catch (error) {
      console.error(`Error generating screen ${screen.name}:`, error);

      // Send error update
      const errorMsg: ServerMessage = {
        type: "screen_update",
        screenId: screen.id,
        status: "error",
      };
      yield errorMsg;
    }
  }
}
