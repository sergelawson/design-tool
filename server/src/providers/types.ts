export interface LLMProvider {
  generateScreen(
    screenName: string,
    description: string,
    systemPrompt: string,
    deviceType: "mobile" | "desktop",
  ): Promise<string>;
}
