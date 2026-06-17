# Brand Identity

## Color Palette

The palette derives from the existing Tailwind CSS 4 theme in `resources/css/app.css`. Below are the **recommended anchored values** for the Professional & Clean direction:

### Neutral Core (Primary Interaction)
| Token               | Light            | Dark             | Usage                              |
| ------------------- | ---------------- | ---------------- | ---------------------------------- |
| `--background`      | oklch(1 0 0)     | oklch(0.145 0 0) | Page background                    |
| `--foreground`      | oklch(0.145 0 0) | oklch(0.985 0 0) | Body text                          |
| `--card`            | oklch(1 0 0)     | oklch(0.145 0 0) | Card, sheet, dropdown surfaces     |
| `--primary`         | oklch(0.35 0.02 260) | oklch(0.85 0.01 260) | Buttons, active links, key actions |
| `--primary-foreground` | oklch(0.98 0 0) | oklch(0.15 0 0) | Text on primary bg                 |

**Rationale:** A very subtle blue undertone (`260` hue) keeps the palette cool and professional without drifting into obvious "blue theme" territory. The near-gray appearance works for education while retaining a slight personality.

### Semantic Accents
| Token           | Light                                | Dark                                 | Usage                       |
| --------------- | ------------------------------------ | ------------------------------------ | --------------------------- |
| `--success`     | oklch(0.55 0.13 150) / emerald-600   | oklch(0.65 0.12 150) / emerald-400   | Verified, Present, Saved    |
| `--warning`     | oklch(0.7 0.15 80) / amber-500       | oklch(0.75 0.14 80) / amber-400      | Pending, Late               |
| `--destructive` | oklch(0.55 0.20 30) / red-600        | oklch(0.65 0.20 30) / red-400        | Alpa, Rejected, Delete      |
| `--info`        | oklch(0.55 0.10 240) / blue-600      | oklch(0.65 0.10 240) / blue-400      | Announcements, Notifications |

### Surface Hierarchy
| Surface         | Light              | Dark               |
| --------------- | ------------------ | ------------------ |
| Page background | white              | neutral-900        |
| Card            | white + subtle border | neutral-800 + border |
| Sidebar         | neutral-50         | neutral-950        |
| Hover state     | neutral-100        | neutral-800        |
| Border          | neutral-200        | neutral-700        |

## Typography

**Font Stack** (already configured via Vite):
```
Instrument Sans (400, 500, 600) — Primary UI
ui-sans-serif, system-ui, sans-serif — Fallback
```

### Type Scale
| Level          | Size     | Weight | Line Height | Usage                    |
| -------------- | -------- | ------ | ----------- | ------------------------ |
| Page Title     | text-2xl | 600    | 1.25        | Top-level page heading   |
| Section Title  | text-xl  | 600    | 1.3         | Card headers, sections   |
| Subsection     | text-base| 500    | 1.4         | Form labels, group titles|
| Body           | text-sm  | 400    | 1.5         | Paragraphs, descriptions |
| Caption        | text-xs  | 400    | 1.4         | Metadata, timestamps     |
| Data Value     | text-lg  | 500    | 1.3         | KPIs, scores, counters   |

### Code / Markdown (LMS Topics)
Use a monospace font for inline code blocks within Markdown-rendered course topics. The system should load a fallback monospace via `font-mono`.

## Logo & App Icon

Already present: `resources/js/components/app-logo-icon.tsx` (SVG-based). Keep the logomark minimal — a geometric emblem (e.g., interlocking H/A shapes or an open-book abstraction). The logotype should read "HubAcademy" in Instrument Sans 600.

## Spacing System

Base unit: `4px` (Tailwind spacing scale). Apply consistently:
- **Card padding:** `p-6` (24px)
- **Section gap:** `gap-6` (24px)
- **Form field spacing:** `space-y-4` (16px)
- **List/table cell padding:** `px-4 py-3`
- **Sidebar width:** `16rem` (desktop expanded), `3rem` (collapsed)

## Border Radius

Maintain the existing `--radius: 0.625rem` (10px) for cards, dialogs, and sheets. Use `rounded-md` (8px) for inputs, buttons, and small surfaces. Use `rounded-full` only for avatars, badges, and status indicators.
