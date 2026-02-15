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

- Define a **project plan** (logo, palette, inspiration, style, aesthetics)
- Generate a **project-global mini design system** from that plan
- Enter a **list of screens + content**
- An AI generates **HTML + Tailwind UI screens** using the active plan
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

- Three-step workflow: **Plan Project** -> **Review Screen Checklist** -> **Generate Screens**
- User provides planning inputs:
  - Logo upload (optional, persisted)
  - Color palette (manual + extracted suggestions)
  - Inspiration images (optional, analyzed transiently)
  - Design style and aesthetics controls
- User provides generation inputs:
  - Screen list
  - Content per screen

- System derives a screen checklist from parsed screens
- All checklist items are checked by default
- User can uncheck any screen before generation
- Generation is blocked when no screen is selected

- Generation is blocked until plan status is `ready`
- Any change to planning-relevant inputs marks the plan as `stale`
- Stale plans must be regenerated before each new generation

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
  "type": "plan_project",
  "projectId": "uuid",
  "inputs": {
    "style": "minimal fintech",
    "aesthetics": ["clean", "trustworthy"],
    "palette": ["#0F172A", "#2563EB", "#E2E8F0"],
    "logo": {
      "logoAssetId": "asset_123",
      "logoUrl": "https://cdn.example.com/logo.png"
    },
    "inspirations": [{ "mimeType": "image/jpeg", "data": "<base64>" }]
  },
  "screens": [
    {
      "name": "Login",
      "description": "Email, password, login button"
    }
  ]
}
```

```json
{
  "type": "generate_screens",
  "projectId": "uuid",
  "planVersion": 3,
  "selectedScreenIds": ["login", "signup"],
  "screens": [
    {
      "id": "login",
      "name": "Login",
      "description": "Email, password, login button"
    },
    {
      "id": "signup",
      "name": "Signup",
      "description": "Name, email, password, submit"
    }
  ],
  "model": "gpt-5.2"
}
```

---

### 3.5 Canvas Rendering Flow

1. User submits/updates planning inputs
2. Frontend sends `plan_project`
3. MCP returns `project_plan_update` with mini design system and `planVersion`
4. Frontend shows checklist of parsed screens (all pre-selected)
5. User deselects screens they do not want generated
6. User submits selected screens for generation
7. Frontend sends `generate_screens` with required `planVersion` and selected subset
8. MCP streams screen-by-screen HTML for selected screens
9. Each screen:
   - Appears as loading skeleton
   - Replaced with rendered HTML

10. User can drag, rearrange, inspect

---

### 3.6 Project Planning Workflow (Required)

Before any screen generation, the user must complete project planning.

#### Planning Inputs

- Logo upload (optional, persisted)
- Color palette controls
- Inspiration images (optional, non-persistent)
- Design style and aesthetics controls

#### Planning Output

A project-global **Mini Design System** used by all generated screens:

- Brand intent and tone
- Color tokens and semantic usage
- Typography guidance
- Spacing, radius, and shadow rules
- Component patterns (buttons, inputs, cards, nav, forms)
- Layout and density rules
- Accessibility guardrails
- Screen mappings (how each requested screen applies the global system)

#### Enforcement Rules

- Generation is blocked unless plan status is `ready`
- Plan is project-global
- Changes to prompt/style/palette/logo/inspiration mark plan as `stale`
- Stale plan must be regenerated before each new generation run
- User must confirm a screen checklist before generation
- Only checked screens are generated
- At least one screen must remain checked to enable generation

---

### 3.7 Screen Checklist (Required Before Generation)

- The frontend parses screen candidates from the user prompt and renders a checklist
- Every candidate is checked by default
- Users can uncheck any screen to exclude it from generation
- `generate_screens` must include only the selected screen subset
- If prompt parsing changes the checklist, current plan is marked stale and must be regenerated

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

- Plan-first orchestration (required planning before generation)
- Vision analysis for planning inputs
- Strict mini design system schema validation
- Plan versioning and stale-plan enforcement
- Screen checklist validation (non-empty selected subset)
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
Receive `plan_project`
↓
Validate planning inputs
↓
Run vision + planner model
↓
Validate Mini Design System schema
↓
Emit `project_plan_update` with `planVersion`
↓
Receive `generate_screens`
↓
Validate screens + required planVersion + selectedScreenIds
↓
For each selected screen:
  - Build screen-specific prompt with plan context
  - Call LLM
  - Validate HTML
  - Stream result
↓
Done
```

---

### 4.6 MCP → LLM Prompt Structure

```txt
PLANNER SYSTEM:
[Planning Agent Prompt]

PLANNER USER:
- Project style and aesthetics
- Palette inputs
- Logo reference
- Inspiration images
- Screen list

PLANNER OUTPUT:
- Strict JSON Mini Design System

---

SYSTEM:
[Canvas Design Agent Prompt]

CONTEXT:
- Active Mini Design System (project-global)
- planVersion: 3

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

Planning update:

```json
{
  "type": "project_plan_update",
  "status": "ready",
  "planVersion": 3,
  "miniDesignSystem": {
    "brand": { "tone": "clean" },
    "colors": { "primary": "#2563EB" }
  }
}
```

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
  "type": "error",
  "message": "At least one screen must be selected"
}
```

---

## 5. LLM Responsibilities

Planner model must:

- Analyze logo + inspiration visuals
- Produce strict JSON Mini Design System
- Define reusable tokens/rules for all screens
- Avoid free-form prose output

Generator model must:

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

### Asset Handling

- Persist only the latest project logo in object storage
- Store `logoAssetId` and URL (or signed URL strategy) in DB
- Replacing logo invalidates previous active logo reference
- Do not persist inspiration images server-side
- Persist only derived plan/tokens and compact metadata from inspiration analysis
- Delete transient inspiration buffers immediately after plan derivation

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
- No per-screen design system overrides (plan remains project-global)
- No raw inspiration image persistence

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

- User completes required project planning before generation
- System produces a validated project-global mini design system
- User enters screens
- User can review and deselect screens in checklist before generation
- AI generates draggable UI screens using the active plan
- All screens render on one canvas
- Exportable HTML works standalone
