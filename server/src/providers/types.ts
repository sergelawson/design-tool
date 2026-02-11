export interface LLMProvider {
  generateScreen(
    screenName: string,
    description: string,
    systemPrompt: string
  ): Promise<string>;
}
