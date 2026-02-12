import { z } from "zod";

export const ScreenDescriptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  deviceType: z.enum(["mobile", "desktop"]).default("mobile"),
});

export const GenerateScreenSchema = z.object({
  type: z.literal("generate_screens"),
  prompt: z.string(),
  model: z.enum(["gpt-5.2", "gemini-3-pro"]).optional().default("gpt-5.2"),
  screens: z.array(ScreenDescriptionSchema),
});
