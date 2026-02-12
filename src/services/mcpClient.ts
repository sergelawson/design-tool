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
        console.log("Received screen update:", data);
        this.handleScreenUpdate(data as ScreenUpdateMessage);
      } else if (data.type === "error") {
        console.log("Received error message:", data);
        this.handleError(data as ErrorMessage);
      }
    });
  }

  public generateScreens(
    prompt: string,
    screens: (ParsedScreen & { id: string })[],
    model: "gpt-5.2" | "gemini-3-pro",
  ) {
    wsClient.send({
      type: "generate_screens",
      prompt,
      model,
      screens,
    });
  }

  private handleScreenUpdate(data: ScreenUpdateMessage) {
    const { screenId, status, html, designWidth } = data;
    console.log("[MCPClient] Handling screen update:", {
      screenId,
      status,
      hasHtml: !!html,
      designWidth,
    });
    const store = useCanvasStore.getState();
    const existingScreen = store.screens.find((s) => s.id === screenId);
    console.log(
      "[MCPClient] Screen exists:",
      !!existingScreen,
      "Current screens:",
      store.screens.map((s) => s.id),
    );

    if (existingScreen) {
      store.updateScreen(screenId, {
        status,
        ...(html !== undefined ? { html } : {}),
        ...(designWidth !== undefined ? { designWidth } : {}),
      });
      console.log("[MCPClient] Updated existing screen:", screenId);
    } else {
      store.addScreen({
        id: screenId,
        name: `Screen ${store.screens.length + 1}`,
        status,
        html: html || "",
        position: { x: 50 + store.screens.length * 420, y: 50 },
        designWidth: designWidth || 375,
      });
      console.log("[MCPClient] Added new screen:", screenId);
    }
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
  html?: string;
  designWidth?: 375 | 1440;
}

interface ErrorMessage extends ServerMessage {
  type: "error";
  message: string;
}

export const mcpClient = MCPClient.getInstance();
