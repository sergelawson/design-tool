Nice, this is getting into **real product architecture** territory. Below is a **clear, end-to-end technical specification** for:

1. **Frontend app (UI/UX design tool)**
2. **MCP server** that connects to an **LLM** to generate screens
3. **Interaction flow between frontend ↔ MCP ↔ LLM**

This is written like a **real PRD + technical spec** you could hand to engineers or use to build it yourself.

---

# Full App Specification

**AI UI/UX Canvas Designer with MCP + LLM**

---

## 1. Product Overview

A **web-based UI/UX design tool** similar to Figma, where users:

- Enter a **list of screens + content**
- An AI generates **HTML + Tailwind UI screens**
- Screens appear **one by one** on a **single draggable canvas**
- All UI is exportable as clean frontend code

---

## 2. High-Level Architecture

```
Browser (Frontend App)
   ↓ WebSocket / HTTP
MCP Server (Orchestrator)
   ↓
LLM Provider (OpenAI / Claude / Local LLM)
```

---

## 3. Frontend Application Specification

### 3.1 Tech Stack

- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Canvas Logic**: HTML div-based canvas (not <canvas>)
- **State Management**: Zustand or Redux Toolkit
- **Transport**:
  - WebSocket (preferred for streaming UI)
  - HTTP fallback

- **Language**: TypeScript

---

### 3.2 Core UI Components

#### 1. Canvas Workspace

- Infinite vertical scroll
- Neutral background (design-board style)
- Zoom (future)
- Pan (future)

#### 2. Screen Frames

- Fixed width (375px or 1440px)
- Draggable
- Soft shadow + rounded corners
- Optional screen title header
- Hover outline

```ts
type ScreenFrame = {
  id: string;
  name: string;
  html: string;
  position: { x: number; y: number };
  status: "loading" | "ready" | "error";
};
```

---

### 3.3 User Input Panel

- Textarea / structured form
- User provides:
  - Screen list
  - Content per screen
  - Design preference (optional)

Example:

```
Screens:
- Login
- Signup
- Home

Login:
Email input
Password input
Login button
```

---

### 3.4 Frontend → MCP Request Payload

```json
{
  "projectId": "uuid",
  "designWidth": 375,
  "screens": [
    {
      "name": "Login",
      "description": "Email, password, login button"
    },
    {
      "name": "Signup",
      "description": "Name, email, password, submit"
    }
  ],
  "style": {
    "theme": "light",
    "radius": "rounded-xl",
    "primaryColor": "blue"
  }
}
```

---

### 3.5 Canvas Rendering Flow

1. User submits screens
2. Frontend opens WebSocket
3. MCP streams screen-by-screen HTML
4. Each screen:
   - Appears as loading skeleton
   - Replaced with rendered HTML

5. User can drag, rearrange, inspect

---

## 4. MCP Server Specification

### 4.1 Purpose

The MCP server:

- Acts as **LLM orchestrator**
- Applies **system prompt**
- Splits screen generation into steps
- Streams results to frontend

---

### 4.2 Tech Stack

- **Runtime**: Node.js / Bun / Deno
- **Language**: TypeScript
- **Protocol**: MCP
- **Transport**:
  - WebSocket (streaming)
  - HTTP (fallback)

- **LLM Providers**:
  - OpenAI
  - Claude
  - Local (Ollama)

---

### 4.3 MCP Capabilities

- Screen-by-screen generation
- Partial streaming
- Error recovery
- Retry per screen
- Token budget control

---

### 4.4 MCP System Prompt (Injected)

- Uses the **Canvas Design Agent system prompt**
- Enforces:
  - Tailwind-only styling
  - Draggable screen frames
  - Interaction states
  - No explanations

---

### 4.5 MCP Internal Flow

```
Receive request
↓
Validate screens
↓
For each screen:
  - Build screen-specific prompt
  - Call LLM
  - Validate HTML
  - Stream result
↓
Done
```

---

### 4.6 MCP → LLM Prompt Structure

```txt
SYSTEM:
[Canvas Design Agent Prompt]

USER:
Generate the screen:
Name: Login
Content:
- Email input
- Password input
- Login button

Constraints:
- Fixed width 375px
- Include hover, focus, loading states
- Output only HTML
```

---

### 4.7 MCP Streaming Message Format

```json
{
  "type": "screen_update",
  "screenId": "login",
  "status": "ready",
  "html": "<section class='screen-frame'>...</section>"
}
```

Error case:

```json
{
  "type": "screen_error",
  "screenId": "login",
  "message": "Invalid HTML structure"
}
```

---

## 5. LLM Responsibilities

The LLM must:

- Generate **valid semantic HTML**
- Use **Tailwind CSS**
- Include:
  - Hover
  - Focus
  - Active
  - Loading

- Avoid explanations
- Output **code only**

---

## 6. Security & Stability

### Rate Limiting

- Per project
- Per screen

### Validation

- Strip `<script>` tags from LLM output
- Whitelist HTML elements
- Sanitize attributes

---

## 7. Export Features (Phase 2)

- Export:
  - Single HTML
  - React components
  - Tailwind config

- Copy screen HTML
- Download ZIP

---

## 8. Non-Goals (For Now)

- No real-time collaboration
- No backend data wiring
- No auth flows
- No persistence (initial MVP)

---

## 9. Future Extensions

- Component reuse detection
- Design tokens extraction
- Dark mode toggle
- Multi-device canvas
- AI refactor existing screens
- Voice-driven UI generation

---

## 10. MVP Definition

**MVP is complete when:**

- User enters screens
- AI generates draggable UI screens
- All screens render on one canvas
- Exportable HTML works standalone
