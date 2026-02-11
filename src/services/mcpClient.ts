import { wsClient, ServerMessage } from "./wsClient";
import { ParsedScreen } from "@/utils/promptParser";
import { useCanvasStore, ScreenStatus } from "@/stores/canvasStore";

export class MCPClient {
  private static instance: MCPClient;

  private constructor() {
    this.setupListeners();
  }

  public static getInstance(): MCPClient {
    if (!MCPClient.instance) {
      MCPClient.instance = new MCPClient();
    }
    return MCPClient.instance;
  }

  private setupListeners() {
    wsClient.onMessage((data: ServerMessage) => {
      if (data.type === "screen_update") {
        this.handleScreenUpdate(data as ScreenUpdateMessage);
      } else if (data.type === "error") {
        this.handleError(data as ErrorMessage);
      }
    });
  }

  public generateScreens(prompt: string, screens: (ParsedScreen & { id: string })[]) {
    wsClient.send({
      type: "generate_screens",
      prompt,
      screens,
    });
  }

  private handleScreenUpdate(data: ScreenUpdateMessage) {
    const { screenId, status, html } = data;
    useCanvasStore.getState().updateScreen(screenId, { status, html });
  }

  private handleError(data: ErrorMessage) {
    console.error("MCP Error:", data.message);
    // TODO: Add toast notification
  }
}

interface ScreenUpdateMessage extends ServerMessage {
  type: "screen_update";
  screenId: string;
  status: ScreenStatus;
  html: string;
}

interface ErrorMessage extends ServerMessage {
  type: "error";
  message: string;
}

export const mcpClient = MCPClient.getInstance();
