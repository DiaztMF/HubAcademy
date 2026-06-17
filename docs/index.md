# HubAcademy Design Guide

Seluruh dokumen design guide untuk HubAcademy — All-in-One School Ecosystem.

| File | Isi |
|------|-----|
| `01-design-principles.md` | 6 prinsip desain yang mendasari seluruh keputusan UI/UX |
| `02-brand-identity.md` | Color palette, typography, spacing, logo, border radius |
| `03-component-design-system.md` | Pattern komponen: DataTable, StatCard, Timeline, Form patterns, etc. |
| `04-layout-patterns.md` | Layout structure: auth, app (sidebar/header), dashboard per-role |
| `05-module-design-patterns.md` | Design detail per modul: LMS, Attendance, Portfolio, Internship, Forum, Chat, News, Notifications |
| `06-design-references.md` | Referensi visual, inspirasi dari produk lain, mood board, tools |
| `07-implementation-roadmap.md` | Tahapan implementasi design ke codebase |

## Tech Stack yang Sudah Terintegrasi
- **React 19** + **Inertia.js 3** — SPA frontend
- **Tailwind CSS 4** — Utility-first styling via `@tailwindcss/vite`
- **Radix UI** — Headless component primitives (dialog, select, dropdown, etc.)
- **shadcn/ui** — Component pattern source of truth (button, card, badge, sidebar, etc.)
- **Lucide React** — Icon library
- **class-variance-authority** — Component variant management
- **Instrument Sans** — Font (via Bunny CDN)
- **Sonner** — Toast notifications
- **Laravel Reverb** — Real-time WebSocket (chat, notifications)

## Design Direction
**Professional & Clean** — minimalis, netral, fokus ke readability, warna kalem. Palet cool-neutral dengan aksen biru subtle (`oklch` color space). Mengikuti pattern enterprise/edukasi modern seperti Linear dan Notion.
