# AI Design Tool

A Figma-like AI design tool that generates Tailwind UI screens from text prompts.

## Features
- **AI Generation**: Powered by OpenAI (GPT-4) and MCP.
- **Infinite Canvas**: Draggable, scrollable workspace.
- **Drag & Drop**: Arrange screens freely.
- **Export**: Download HTML code for any screen.

## Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Configure Environment:
   - Create `server/.env`
   - Add `OPENAI_API_KEY=sk-...`
3. Run Development Server:
   ```bash
   pnpm dev
   ```
   This starts both the React frontend (localhost:5173) and MCP server (localhost:3001).

## Tech Stack
- **Frontend**: React, Vite, Tailwind, Zustand
- **Backend**: Node.js, Express, WebSocket, OpenAI SDK

## Project Structure
- `src/`: Frontend source
- `server/`: Backend MCP server source
