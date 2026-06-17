# Component Design System

The project uses **shadcn/ui** primitives (Radix UI + Tailwind CSS 4 + CVA). Below are module-specific patterns and additions beyond the existing library.

---

## 1. Navigation & Layout

### Sidebar (Existing — `app-sidebar.tsx`)
**Variant:** `inset` with `collapsible="icon"`.
- **Group 1 — Platform:** Dashboard, My Courses, Attendance, Internship, Portfolio
- **Group 2 — Community:** Forum, Chat, News
- **Group 3 — Admin Only:** User Management, System Config
- **Footer:** User menu (avatar + dropdown) + external links

**Active state:** `bg-sidebar-accent` + font-medium. Use `isCurrentUrl()` from `useCurrentUrl` hook.

### Breadcrumbs (Existing — `breadcrumb.tsx`)
Standardized across all pages except auth. Each page declares breadcrumbs as a static layout property.

### App Header
Contains: breadcrumbs (left), notification bell (right), optional page-level action button (rightmost).

---

## 2. Data Display

### DataTable (Custom)
A reusable table component wrapping Radix-like patterns:

```
┌─────────────────────────────────────────────┐
│ [Search...]          [Filter ▼] [+ Add New] │
├────────┬──────┬──────────┬────────┬─────────┤
│ Name   │ Role │ Status   │ Joined │ Actions │
├────────┼──────┼──────────┼────────┼─────────┤
│ ...    │ ...  │ Badge    │ ...    │ [⋮]     │
└────────┴──────┴──────────┴────────┴─────────┘
  Showing 1-10 of 45    [1] [2] [3] ... [5]
```

**Patterns:**
- Row actions use a dropdown menu (`⋮`). Never inline icon buttons unless single-action.
- Status column always uses `Badge` component (variant: default/success/warning/destructive).
- Search filters client-side for small datasets (<200 rows); server-side (Laravel pagination + query params) for larger sets.
- Empty state: centered illustration + "No data yet" + CTA button.

### StatCard
```
┌─────────────────┐
│ [Icon]    ▲ 12% │
│ Total Courses   │
│      24         │
└─────────────────┘
```
Used on dashboards. Variants: default (neutral), success (green trend), warning (yellow trend), destructive (red trend).

### Timeline (for Logbook & Activity)
```
● 17 Jun 2026, 08:00 — Daily duty at office (Verified by Mr.Andi)
├─ Photo attached
● 16 Jun 2026, 16:30 — Project review session
├─ Pending verification
```
Used in Internship module and Notification history.

---

## 3. Form Patterns

### Attendance Grid
```
┌──────────┬──────────────┬──────────────┐
│ Student  │ 16 Jun 2026  │ 17 Jun 2026  │
├──────────┼──────────────┼──────────────┤
│ Adi      │ [Present ▼]  │ [Present ▼]  │
│ Budi     │ [Sick ▼]     │ [Alpa ▼]     │
└──────────┴──────────────┴──────────────┘
```
- Date picker at top allows backdating (past dates styled with calendar icon indicator).
- Dropdown values: Present (success), Late (warning), Sick (info), Permit (info), Alpa (destructive).
- Optional Notes column expanded inline on click.

### Markdown Editor (LMS Topics)
- Use a split-pane: raw Markdown on left, rendered preview on right.
- Toolbar: Bold, Italic, Heading, Link, Bullet List, Code Block.
- Embedded link field (separate input below editor) for YouTube/Drive URLs.

### Portfolio Upload
- Drag-and-drop zone with `react-dropzone` (or native input).
- Client-side compression via `browser-image-compression` to ≤200KB.
- Preview thumbnail before submit.
- Progress bar during upload.

### Logbook Entry
- Date (auto-set to today, editable).
- Textarea: "What did you do today?" (min 20 characters).
- Optional photo upload (single file, ≤5MB).
- Submit → status becomes "Pending".

---

## 4. Feedback & Status

### Toast Notifications (Existing — Sonner)
- `success`: Green checkmark — "Attendance saved"
- `error`: Red X — "Failed to save. Please try again."
- `info`: Blue i — "Your logbook has been verified"
- Stack up to 3 toasts. Auto-dismiss success/info after 4s. Error requires manual dismiss.

### Inline Validation
- Error message appears below the field (not as a toast).
- Red border on the input itself. Message in `text-destructive text-sm`.

### Loading States
- Primary button shows `Spinner` component + "Saving…" text during submission.
- Table rows show `Skeleton` (pulsing gray bars) during initial load.
- Full-page load: existing Inertia progress bar at viewport top.

---

## 5. Empty & Error States

### Empty State
```
┌──────────────────────────┐
│                          │
│      [Illustration]      │
│                          │
│   No courses yet         │
│   Join a course using    │
│   the code from your     │
│   teacher.               │
│                          │
│   [Enter Join Code]      │
│                          │
└──────────────────────────┘
```

### Error State
```
┌──────────────────────────┐
│  ⚠️ Something went wrong │
│  We couldn't load your   │
│  courses. Please try     │
│  again.                  │
│                          │
│  [Try Again] [Go Back]   │
└──────────────────────────┘
```

---

## 6. New Components to Build

| Component       | Purpose                              | Priority |
| --------------- | ------------------------------------ | -------- |
| `DataTable`     | Reusable sortable/filterable table   | High     |
| `StatCard`      | Dashboard metric card                | High     |
| `Timeline`      | Logbook & activity feed              | High     |
| `MarkdownEditor`| LMS topic creation                   | High     |
| `AttendanceGrid`| Teacher attendance sheet             | High     |
| `FileUpload`    | Portfolio image + logbook photo      | High     |
| `JoinCodeInput` | Course enrollment by code            | Medium   |
| `NotificationBell`| Reverb-powered bell icon + dropdown| Medium   |
| `ChatBubble`    | DM message component                 | Medium   |
| `ForumThread`   | Forum post card with comments        | Medium   |
