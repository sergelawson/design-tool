export type ScreenDescription = {
  id: string;
  name: string;
  description: string;
  deviceType: "mobile" | "desktop";
};

export type GenerateScreenRequest = {
  type: "generate_screens";
  prompt: string;
  model: "gpt-5.2" | "gemini-3-pro";
  screens: ScreenDescription[];
};

export type ScreenUpdateStatus = "loading" | "ready" | "error";

export type ScreenUpdateMessage = {
  type: "screen_update";
  screenId: string;
  status: ScreenUpdateStatus;
  html?: string;
  designWidth?: 375 | 1440;
};

export type ErrorMessage = {
  type: "error";
  message: string;
};

export type ClientMessage = GenerateScreenRequest;

export type ServerMessage = ScreenUpdateMessage | ErrorMessage;
