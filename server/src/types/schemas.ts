import { z } from "zod";

export const ScreenDescriptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export const GenerateScreenSchema = z.object({
  type: z.literal("generate_screens"),
  prompt: z.string(),
  screens: z.array(ScreenDescriptionSchema),
});
