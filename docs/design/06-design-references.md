# Design References & Inspiration

## Visual Tone References

| Aspect | Reference | Why |
|--------|-----------|-----|
| **Overall UI Polish** | [Linear](https://linear.app) | Clean, neutral interface with subtle blue primary; excellent use of whitespace and typographic hierarchy |
| **Typography & Data Dense Layouts** | [Notion](https://notion.so) | Handles long-form content (Markdown) alongside structured data; sidebar navigation pattern |
| **Education Dashboard** | [Canvas LMS](https://canvas.instructure.com) | Industry standard for LMS UX: course card grid, module structure, clean data tables |
| **Attendance/Logbook Tables** | [Airtable](https://airtable.com) | Spreadsheet-like data grid with inline editing, status badges, and rich cell types |
| **Form Design** | [Tailwind UI](https://tailwindui.com) | Already aligned with the shadcn/ui ecosystem; form layout, validation, and input group patterns |
| **Auth & Onboarding** | [Stripe Dashboard](https://dashboard.stripe.com) | Split-layout auth, clean error handling, progressive disclosure of complexity |
| **Dark Mode** | [GitHub Dark](https://github.com) | Reference for neutral dark mode that doesn't strain the eyes; good contrast ratios for code and text |
| **Component Library** | [shadcn/ui](https://ui.shadcn.com) | Already integrated. Follow their latest patterns for dialog, dropdown, select, and sheet |

## Color Palette Inspiration

- **Base neutral**: [Tailwind CSS Neutral palette](https://tailwindcss.com/docs/customizing-colors#neutral) — Already in use.
- **Subtle blue primary**: [Radix UI Colors - Slate + Blue](https://www.radix-ui.com/colors) — Professional and accessible.
- **Semantic colors**: [Tailwind CSS Emerald/Amber/Red/Blue](https://tailwindcss.com/docs/customizing-colors) — Standard status mapping.

## UI Animation References

- **Micro-interactions**: [Linear's pull-to-refresh](https://linear.app), [Raycast](https://raycast.com) for smooth transitions.
- **Sidebar collapse**: [VS Code sidebar animation](https://code.visualstudio.com) — smooth width transition, icon-only mode.
- **Page transitions**: Inertia.js provides progress bar; use subtle fade between routes via CSS transitions.
- **Real-time indicators**: [Slack](https://slack.com) for typing indicators and online dots.

## Layout References

- **Admin dashboard**: [Vercel Dashboard](https://vercel.com/dashboard) — sidebar + top bar + content grid layout.
- **Learning platform**: [Duolingo](https://www.duolingo.com) for progress tracking patterns, [Khan Academy](https://www.khanacademy.org) for course structure.
- **Forum/community**: [Discourse](https://www.discourse.org) — category-based forum, threaded replies, badge system.

## Icon Style

- **Library**: [Lucide Icons](https://lucide.dev) — Already installed. Use consistent 16px/20px sizing.
- **Stroke width**: 2px (default for Lucide). Do not mix with filled icons.
- **Custom icons**: Create minimal SVG icons for school-specific concepts (Logbook, Joincode, etc.) matching Lucide's geometric style.

---

## Mood Board Summary

```
Professional & Clean Mood Board:
─────────────────────────────────
Colors:    Neutral base (#fafafa → #0a0a0a) + Subtle blue primary
Typography: Instrument Sans (UI) + System Monospace (code)
Shapes:    rounded-md (8px) surfaces, rounded-xl (12px) cards
Spacing:   Generous whitespace, 4px grid system
Icons:     Lucide outline, 16-20px, 2px stroke
Components: Radix + shadcn/ui patterns
```

## Tools for Design Handoff

| Tool | Purpose |
|------|---------|
| [Figma](https://figma.com) | Design system components, page mockups, prototyping |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first CSS framework (already configured) |
| [shadcn/ui](https://ui.shadcn.com) | Component source of truth (already installed) |
| [Lucide Icons](https://lucide.dev) | Icon library (already installed) |
| [Coolors](https://coolors.co) | Palette exploration and contrast checking |
| [Contrast Grid](https://contrast-grid.eightshapes.com) | WCAG contrast verification for all token combinations |
