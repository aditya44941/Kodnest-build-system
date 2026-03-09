# KodNest Premium Build System

## Design Philosophy
Calm, intentional, coherent, confident. The system prioritizes clarity over visual spectacle and avoids gradients, glass effects, neon palettes, and noisy motion.

## Core Tokens
- Background: `#F7F6F3`
- Primary text: `#111111`
- Accent: `#8B0000`
- Success: `#5F7556` (muted green)
- Warning: `#A07A33` (muted amber)

### Spacing Scale
Only these spacing tokens are used for layout rhythm:
- `8px`
- `16px`
- `24px`
- `40px`
- `64px`

## Typography
- Heading family: classic serif stack
- Body family: clean sans-serif stack
- Body size: base `16px`
- Body line-height: `1.7`
- Max text width: `720px`

## Mandatory Page Structure
`[Top Bar] -> [Context Header] -> [Primary Workspace + Secondary Panel] -> [Proof Footer]`

### Top Bar
- Left: Project name
- Center: Progress indicator (`Step X / Y`)
- Right: Status badge (`Not Started / In Progress / Shipped`)

### Context Header
- Large serif headline
- One-line supporting subtext
- Clear purpose language

### Workspace Grid
- Primary Workspace: `70%`
- Secondary Panel: `30%`

### Secondary Panel Content
- Step explanation
- Copyable prompt area
- Action set: `Copy`, `Build in Lovable`, `It Worked`, `Error`, `Add Screenshot`

### Proof Footer
Persistent footer containing:
- `UI Built`
- `Logic Working`
- `Test Passed`
- `Deployed`

Each row requires both a checkbox and a proof input.

## Component Rules
- Primary button: solid deep red
- Secondary button: outlined
- Shared hover behavior and border radius across all buttons
- Inputs: clean borders, clear focus, no heavy shadows
- Cards: subtle border, balanced padding, no drop shadows

## Interaction Rules
- Transitions: `180ms ease-in-out`
- No bounce, no parallax, no decorative motion

## State Rules
- Error: clear explanation + concrete fix path
- Empty: always provide the next action

## Deliverables
- `/Users/sunny100/Documents/KodNest Premium /index.html`
- `/Users/sunny100/Documents/KodNest Premium /styles.css`
- `/Users/sunny100/Documents/KodNest Premium /DESIGN_SYSTEM.md`
