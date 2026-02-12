import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import cors from "cors";
import dotenv from "dotenv";
import { handleGenerate } from "./handlers/generateHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const server = app.listen(PORT, () => {
  console.log(`MCP Server running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });

  ws.on("message", async (message) => {
    try {
      const raw = message.toString();
      const parsed = JSON.parse(raw);
      console.log("Received:", parsed);

      if (parsed.type === "generate_screens") {
        for await (const msg of handleGenerate(parsed)) {
          if (ws.readyState === WebSocket.OPEN) {
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
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "error", message: "Invalid JSON format" }));
      }
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
