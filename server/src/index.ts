import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { cors } from "hono/cors";
import { Hono } from "hono";
import dotenv from "dotenv";
import { handleGenerate } from "./handlers/generateHandler.js";

dotenv.config();

const app = new Hono();
const PORT = process.env.PORT || 3001;
const OPEN_READY_STATE = 1;

app.use("/health", cors());

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

function toRawMessage(data: unknown): string {
  if (typeof data === "string") {
    return data;
  }

  if (data instanceof ArrayBuffer) {
    return Buffer.from(data).toString("utf-8");
  }

  if (ArrayBuffer.isView(data)) {
    return Buffer.from(data.buffer, data.byteOffset, data.byteLength).toString("utf-8");
  }

  if (typeof SharedArrayBuffer !== "undefined" && data instanceof SharedArrayBuffer) {
    return Buffer.from(data).toString("utf-8");
  }

  throw new Error("Unsupported WebSocket message format");
}

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.get(
  "/",
  upgradeWebSocket(() => {
    console.log("Client connected");

    return {
      onClose: () => {
        console.log("Client disconnected");
      },
      onError: (event) => {
        console.error("WebSocket error:", event);
      },
      onMessage: (event, ws) => {
        void (async () => {
          try {
            const raw = toRawMessage(event.data);
            const parsed = JSON.parse(raw);
            console.log("Received:", parsed);

            if (parsed.type === "generate_screens") {
              for await (const msg of handleGenerate(parsed)) {
                if (ws.readyState === OPEN_READY_STATE) {
                  console.log("Sending:", msg);
                  ws.send(JSON.stringify(msg));
                } else {
                  break;
                }
              }
            } else {
              console.warn("Unknown message type:", parsed.type);
            }
          } catch (error) {
            console.error("Failed to parse message:", error);
            if (ws.readyState === OPEN_READY_STATE) {
              ws.send(JSON.stringify({ type: "error", message: "Invalid JSON format" }));
            }
          }
        })();
      },
    };
  }),
);

const server = serve(
  {
    fetch: app.fetch,
    port: Number(PORT),
  },
  () => {
    console.log(`MCP Server running on http://localhost:${PORT}`);
  },
);

injectWebSocket(server);
