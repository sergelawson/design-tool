export type ScreenDescription = {
  id: string;
  name: string;
  description: string;
};

export type GenerateScreenRequest = {
  type: "generate_screens";
  prompt: string;
  screens: ScreenDescription[];
};

export type ScreenUpdateStatus = "loading" | "ready" | "error";

export type ScreenUpdateMessage = {
  type: "screen_update";
  screenId: string;
  status: ScreenUpdateStatus;
  html?: string;
};

export type ErrorMessage = {
  type: "error";
  message: string;
};

export type ClientMessage = GenerateScreenRequest;

export type ServerMessage = ScreenUpdateMessage | ErrorMessage;
