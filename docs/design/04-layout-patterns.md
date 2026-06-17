# Layout Patterns

## Auth Layouts

Three variants (existing):
- **Split** (default): Left panel = dark brand zone with logo + tagline. Right panel = centered form card (`sm:w-[350px]`).
- **Card:** Single centered card on plain background. Used for simple flows (password reset, 2FA challenge).
- **Simple:** Minimal header + centered content. Used for email verification interstitial.

All auth layouts share:
- Max-width form container: `sm:w-[350px]`
- Form spacing: `space-y-6`
- Submit button: full-width (`w-full`)

## App Layout (Authenticated)

### Sidebar Variant (Default)
```
┌────────┬──────────────────────────────────────┐
│        │  [Breadcrumbs]          🔔 [Avatar] │
│ Sidebar│──────────────────────────────────────┤
│  (16rem│                                      │
│   →    │          Page Content                │
│  3rem) │        (flex-1, gap-6)              │
│        │                                      │
│        │  ┌──────────┐ ┌──────────┐          │
│        │  │ StatCard │ │ StatCard │          │
│        │  └──────────┘ └──────────┘          │
│        │                                      │
└────────┴──────────────────────────────────────┘
```

- Sidebar is `inset` variant: content area gets rounded corners and a subtle shadow when sidebar is expanded.
- On mobile: sidebar becomes a Sheet overlay.
- Content area: `p-4` (desktop), `p-2` (mobile).

### Header Variant (Alternative)
For simple pages (News public view, Welcome): top navigation bar with logo + minimal nav links. No sidebar.

## Page Content Structure

Standard page template:
```tsx
<Head title="Page Title" />
// Optional: page-level action button
<div className="mb-6 flex items-center justify-between">
    <Heading title="Page Title" description="Optional description" />
    <Button>[+ Create New]</Button>
</div>
// Content area
<div className="space-y-6">
    ...cards, tables, forms...
</div>
```

## Dashboard Layout

```
┌──────────────────────────────────────────────┐
│  Heading: Dashboard                          │
├──────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│ │  Courses │ │ Students │ │ Pending  │      │
│ │    12    │ │   240    │ │    5     │      │
│ └──────────┘ └──────────┘ └──────────┘      │
├──────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Recent Activity Timeline              │  │
│  │  ● Adi joined "Math 101" — 2m ago      │  │
│  │  ● Logbook verified for Budi — 15m ago │  │
│  │  ● New forum post in #General — 1h ago │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌──────────────┐  ┌──────────────────────┐  │
│  │ My Courses   │  │ Upcoming Deadlines   │  │
│  │ (compact     │  │ (compact list)       │  │
│  │  list)       │  │                      │  │
│  └──────────────┘  └──────────────────────┘  │
└──────────────────────────────────────────────┘
```

Role-based dashboard variants:
- **Admin:** System-wide stats (total users, courses, active mentors).
- **Teacher:** Their courses, today's attendance reminder, pending verifications.
- **Student:** Enrolled courses, join code input, recent logbook entries.
- **Mentor:** Assigned students list, pending logbook verifications.
