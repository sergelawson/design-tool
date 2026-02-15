# TODO

## Top Priorities

- [ ] Reliable generation lifecycle
  - [ ] Track generation per screen/request instead of resetting `isGenerating` immediately
  - [ ] Add clear completion states (success/error)
  - [ ] Add retry action for failed screens

- [ ] Security + HTML sanitization
  - [ ] Sanitize LLM HTML on the server before streaming
  - [ ] Strip scripts and inline event handlers
  - [ ] Allowlist safe tags/attributes

- [ ] Streaming + resilience
  - [ ] Add request IDs to generation flows
  - [ ] Make WebSocket reconnect handling idempotent
  - [ ] Prevent duplicate screen updates after reconnect

- [ ] Prompting + output quality controls
  - [ ] Add structured generation settings (theme/style/density/layout)
  - [ ] Validate generated HTML shape before marking screen as `ready`
  - [ ] Improve consistency checks/fallback handling

- [ ] Testing baseline
  - [ ] Add unit tests for `promptParser`
  - [ ] Add tests for `generateHandler` schema/error paths
  - [ ] Add one RTL test for end-to-end generate flow in frontend/store

## Next Wave

- [ ] Canvas UX improvements
  - [ ] Pan (space + drag)
  - [ ] Snap/alignment guides
  - [ ] Multi-select and keyboard nudging

- [ ] Project persistence
  - [ ] Save/load boards
  - [ ] Autosave
  - [ ] Export project bundle

- [ ] Model abstraction
  - [ ] Provider capability map
  - [ ] Timeout/retry policies
  - [ ] Per-model prompt tuning

- [ ] Performance
  - [ ] Virtualization for many frames
  - [ ] Optimize iframe lifecycle/rendering

- [ ] Docs + dev UX
  - [ ] Align README dev commands with actual scripts
  - [ ] Add one-command local start for frontend + server

## Planning Workflow (Required Before Generation)

- [ ] Add a required project planning step before every generation
  - [ ] Block `Generate Screens` until project plan status is `ready`
  - [ ] Mark plan as `stale` when prompt/style/logo/palette/inspiration changes
  - [ ] Require re-planning when plan is stale

- [ ] Build planning inputs UI (form-controls only)
  - [ ] Add logo upload input (optional)
  - [ ] Add inspiration image uploads (optional, multiple)
  - [ ] Add color palette controls (manual + extracted suggestions)
  - [ ] Add design style + aesthetics selectors
  - [ ] Add project-global plan summary/tweak controls
  - [ ] Add screen checklist UI with all screens checked by default
  - [ ] Allow unchecking screens before generation
  - [ ] Disable generation when no screen is selected

- [ ] Add vision-based planning backend flow
  - [ ] Create `plan_project` request/response contracts
  - [ ] Implement planner handler using a vision-capable model
  - [ ] Validate planner output against strict mini design system schema
  - [ ] Return structured errors for invalid planning output

- [ ] Generate and enforce a mini design system
  - [ ] Produce global tokens/rules (colors, type, spacing, components, layout, a11y)
  - [ ] Include logo and inspiration-derived guidance
  - [ ] Persist single project-global plan (no per-screen overrides)

- [ ] Inject project plan into screen generation
  - [ ] Require valid plan payload/version in `generate_screens`
  - [ ] Send only selected screens (or `selectedScreenIds`) in `generate_screens`
  - [ ] Validate non-empty selected screen subset on backend
  - [ ] Enrich generation prompt with global plan + per-screen mappings
  - [ ] Keep fallback disabled (plan required)

- [ ] Testing for planning workflow
  - [ ] Backend tests for planner schema validation and error paths
  - [ ] Backend tests that generation fails without a plan
  - [ ] Frontend tests for disabled generate state before plan ready
  - [ ] Frontend tests for stale-plan invalidation + replan flow
