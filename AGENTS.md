# AGENTS.md — AI UI/UX Canvas Designer

## Project Overview

A web-based UI/UX design tool (Figma-like) where users enter screen descriptions and an
AI generates HTML + Tailwind UI screens rendered on a draggable canvas. Architecture:
Browser (React/Vite) → MCP Server (Node.js/TypeScript) → LLM Provider (OpenAI/Claude/Ollama).

## Tech Stack

- **Language**: TypeScript (strict mode) everywhere
- **Frontend**: React 18+ with Vite; **Styling**: Tailwind CSS (no MUI/Bootstrap/Chakra)
- **State**: Zustand; **Transport**: WebSocket (primary), HTTP (fallback)
- **Backend**: MCP server on Node.js; **Package manager**: pnpm

## Build / Dev / Lint / Test Commands

```bash
pnpm install                  # Install dependencies
pnpm dev                      # Dev server (frontend)
pnpm build                    # Production build
pnpm tsc --noEmit             # Type-check only
pnpm lint                     # ESLint
pnpm lint --fix               # ESLint auto-fix
pnpm format                   # Prettier write
pnpm format:check             # Prettier check

# Test (Vitest)
pnpm test                     # All tests (watch mode)
pnpm test --run               # All tests once (CI)
pnpm test -- src/components/Canvas.test.tsx    # Single file
pnpm test -- -t "renders screen frames"        # Single test by name

# MCP server workspace
pnpm --filter server dev
pnpm --filter server build
pnpm --filter server test
```

## Project Structure

- `src/components/` — React components (`canvas/`, `panels/`, `ui/`)
- `src/hooks/` — Custom React hooks
- `src/stores/` — Zustand stores
- `src/services/` — WebSocket client, MCP client, API layer
- `src/types/` — Shared TypeScript types
- `src/utils/` — Pure utility functions
- `src/lib/` — Third-party wrappers and adapters
- `server/src/` — MCP server (handlers, LLM providers, validation)

## Code Style

### TypeScript

- `strict: true`. Never use `any` — use `unknown` and narrow.
- Prefer `type` over `interface` unless declaration merging is needed.
- Explicit return types on exported and non-trivial functions.
- Discriminated unions for state variants (`status: "loading" | "ready" | "error"`).
- Prefer `as const` over enums. Use `satisfies` for type-safe object literals.

### Imports

- Path alias: `@/` maps to `src/`.
- Order (enforced by ESLint): (1) node builtins, (2) external packages,
  (3) `@/` aliases, (4) relative imports. Blank line between groups.
- Named imports only (exception: React lazy imports).
- Barrel files (`index.ts`) only in `components/ui/`.

### Naming Conventions

| Item                 | Convention        | Example                    |
|----------------------|-------------------|----------------------------|
| Files (components)   | PascalCase        | `ScreenFrame.tsx`          |
| Files (non-component)| camelCase         | `canvasStore.ts`           |
| Variables/functions  | camelCase         | `screenFrames`, `getById`  |
| Types                | PascalCase        | `ScreenFrame`, `Position`  |
| Constants            | UPPER_SNAKE_CASE  | `MAX_CANVAS_ZOOM`          |
| Hooks                | `use` prefix      | `useDragHandler`           |
| Event handlers       | `handle` prefix   | `handleDragEnd`            |
| Booleans             | `is/has/should`   | `isDragging`, `hasError`   |
| Zustand stores       | `use___Store`     | `useCanvasStore`           |
| Test files           | `*.test.tsx`      | `Canvas.test.tsx`          |

### React Components

- Function declarations, not arrow functions: `export function Foo(props: FooProps) {}`
- Co-locate component and test: `Canvas.tsx` + `Canvas.test.tsx`.
- Props type named `ComponentNameProps`, defined above the component in the same file.
- No `React.FC`. Use `React.memo` / `useCallback` / `useMemo` only when measured need.

### Error Handling

- Result-style returns for services/utilities (not exceptions for control flow):
  `type Result<T, E = string> = { ok: true; data: T } | { ok: false; error: E };`
- try/catch only at boundaries (event handlers, API routes, top-level hooks).
- Log errors with structured context before rethrowing.
- MCP server: handle LLM timeouts and malformed responses on every call.
- Sanitize all LLM HTML: strip `<script>` tags, whitelist elements.

### State Management (Zustand)

- One store per domain (`useCanvasStore`, `useProjectStore`).
- Keep stores flat. Use slices pattern if a store grows beyond ~10 actions.
- Derive computed values via selectors, not stored duplicates.

### Tailwind CSS

- Tailwind utilities only. Custom CSS only for: drag behavior, canvas mechanics.
- Use `cn()` (clsx + tailwind-merge) for conditional class merging.
- Design language: rounded corners, soft shadows, accessible contrast, mobile-first.

### Testing (Vitest + React Testing Library)

- Co-located `*.test.tsx` / `*.test.ts` files next to source.
- `describe` / `it` blocks with descriptive names.
- Test behavior, not implementation — query by role/label, not class/test-id.
- Mock external services (WebSocket, LLM) at the service boundary.

### Formatting (Prettier)

- Print width: 100, double quotes, semicolons, trailing commas: all
- Tab width: 2 (spaces), no JSX single quotes

### Git Conventions

- Commit messages: `type: short description` — types: `feat`, `fix`, `refactor`,
  `test`, `docs`, `chore`, `style`.
- Branch names: `feat/canvas-drag`, `fix/html-sanitization`.
- Atomic commits — one logical change per commit.

## Key Domain Concepts

- **Canvas**: Infinite scrollable workspace holding all screen frames.
- **ScreenFrame**: Draggable container rendering AI-generated HTML for one screen.
- **MCP Server**: Orchestrator receiving screen requests, calling LLMs, streaming results.
- **System Prompt**: At `system-prompt.md` — enforces Tailwind-only, semantic HTML output.
- **PRD**: Full product spec at `PRD.md`.
