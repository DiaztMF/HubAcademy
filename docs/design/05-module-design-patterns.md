# Module-Specific Design Patterns

## LMS (Course → Section → Topic)

### Course Card (Grid View)
```
┌──────────────────────┐
│  [Thumbnail]         │
│                      │
│  Mathematics 101     │
│  Mr. Andi            │
│                      │
│  🔢 ABC123  [Enter] │  ← Join Code
│  👥 24 students      │
│  📅 Updated 2d ago   │
└──────────────────────┘
```
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` with `gap-6`.
- Each card: thumbnail (generated gradient if no image), title, teacher name, code badge.
- Click card → navigates to Course Detail page.

### Course Detail (Section List)
```
┌────────────────────────────────────────────┐
│ ← Back to Courses                           │
│ Mathematics 101                             │
│ Join Code: ABC123    [Copy]                 │
├────────────────────────────────────────────┤
│                                            │
│ Section 1: Algebra Basics                  │
│ ├─ Introduction to Variables   [Read] 📄   │
│ ├─ Linear Equations           [Read] 📄    │
│ └─ Quiz: Algebra Basics       [Take] ✍️    │
│                                            │
│ Section 2: Geometry                        │
│ ├─ Shapes & Angles            [Read] 📄    │
│ └─ Video: Pythagoras Theorem  [Watch] ▶️   │
│                                            │
└────────────────────────────────────────────┘
```
- Sections are collapsible (`Collapsible` from Radix).
- "Read" icon is `FileText`, "Watch" is `Video`, "Quiz" is `ClipboardCheck`.

### Topic Reader
```
┌────────────────────────────────────────────┐
│ ← Section 1: Algebra Basics                │
│                                            │
│ Introduction to Variables                  │
│ ─────────────────────────────────────      │
│                                            │
│ # Variables                                │
│                                            │
│ A **variable** is a symbol that...         │
│ (Markdown rendered content)                │
│                                            │
│ 📺 External Video: [Embedded YouTube]      │
│                                            │
└────────────────────────────────────────────┘
```
- Rendered Markdown with `react-markdown` + `remark-gfm`.
- Embedded videos: responsive iframe container (`aspect-video`).
- Navigation: Previous Topic / Next Topic buttons at bottom.

---

## Attendance

```
┌──────────────────────────────────────────────┐
│  Attendance                                   │
│  [Class ▼]  [Subject ▼]  [Date ▼]  [Save]   │
├──────────────────────────────────────────────┤
│ ┌────────┬──────┬──────────────┬───────────┐ │
│ │  #     │ Name │  Status      │ Notes     │ │
│ ├────────┼──────┼──────────────┼───────────┤ │
│ │  1     │ Adi  │ [Present ▼]  │           │ │
│ │  2     │ Budi │ [Sick ▼]     │ Dr.note   │ │
│ │  3     │ Citra│ [Alpa ▼]     │           │ │
│ └────────┴──────┴──────────────┴───────────┘ │
│                                              │
│  Summary: 15 Present, 2 Late, 1 Sick, 1 Alpa │
└──────────────────────────────────────────────┘
```

- Date picker: opens a calendar. Past dates highlighted with a subtle dot. Backdating allowed.
- "Save Attendance" button at top-right; shows loading spinner during queue dispatch.
- Summary bar below table updates live as statuses change.
- Notes column: inline editable text field (appears on focus).

---

## Portfolio

```
┌──────────────────────────────────────────────┐
│  My Portfolio                                 │
│                                    [+ New]   │
├──────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│ │ Web Dev  │ │ Mobile   │ │ Design   │      │
│ │    5     │ │    3     │ │    7     │      │
│ └──────────┘ └──────────┘ └──────────┘      │
├──────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────┐ │
│ │ [Thumb] E-Commerce App                    │ │
│ │ Full-stack React + Laravel project        │ │
│ │ 🔗 GitHub  🏷️ Web Dev                    │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ [Thumb] School Dashboard UI              │ │
│ │ Figma prototype for admin panel          │ │
│ │ 🔗 Figma   🏷️ Design                     │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

- Project cards: masonry or uniform grid.
- Category filter as horizontal pill group.
- Modal form for create/edit: Title, Description (textarea), Category (select), Link (URL input), Image (dropzone).

---

## Internship (PKL Logbook)

### Student View
```
┌──────────────────────────────────────────────┐
│  Internship Logbook                    [+New] │
├──────────────────────────────────────────────┤
│                                              │
│ ● 17 Jun 2026 — Software Engineering         │
│   Today I worked on API integration...     │
│   [Photo] ✅ Verified by Mr.Andi             │
│   "Good progress, keep it up!"               │
│                                              │
│ ● 16 Jun 2026 — Bug Fixing                   │
│   Fixed login issue...                      │
│   ⏳ Pending verification                    │
│                                              │
│ ● 15 Jun 2026 — Documentation                │
│   Wrote API docs...                         │
│   ❌ Revision needed: "Add auth section"     │
│                                              │
└──────────────────────────────────────────────┘
```

- Timeline component (vertically stacked).
- Each entry: date, title (auto-generated or manual), text summary, optional photo thumbnail, verification badge.
- Verified = green check, Pending = amber clock, Revision = red edit icon.

### Mentor/Teacher View
Same timeline but with an additional column for action:
- [Verify] [Request Revision] buttons on pending entries.
- Feedback textarea that appears inline when clicking "Request Revision".

---

## Community Forum

### Thread List
```
┌──────────────────────────────────────────────┐
│  Forum                           [+New Post] │
│                                              │
│  #General    #Programming    #Announcements  │
│  ─────────────────────────────────────────   │
│                                              │
│ 💬 How to use Laravel Queues?                │
│   by Adi · 2h ago · 5 replies · #Programming │
│                                              │
│ 📢 School Holiday Schedule                   │
│   by Admin · 1d ago · 12 replies · pinned 📌 │
│                                              │
│ 💬 Best practice for API design?             │
│   by Budi · 3d ago · 3 replies · #General    │
│                                              │
└──────────────────────────────────────────────┘
```

- Category filter: horizontal scrollable chips.
- Pinned posts have a `📌` badge and slightly different background.
- Thread card: icon (generic 💬 or use emoji from title), title, author, timestamp, reply count, hashtags.

### Thread Detail (Comments)
```
┌──────────────────────────────────────────────┐
│ ← Back to Forum                               │
│                                              │
│ How to use Laravel Queues?                    │
│ by Adi · 2h ago                              │
│                                              │
│ I'm trying to dispatch jobs...               │
│                                              │
│ ──── Replies ────                            │
│                                              │
│ Budi · 1h ago                                │
│ Have you configured the queue driver?        │
│                                              │
│ Adi · 30m ago                                │
│ Yes, using database driver...                │
│                                              │
│ ──── Write a reply ────                      │
│ [Textarea]                           [Send]  │
└──────────────────────────────────────────────┘
```

- Nested comments (2 levels max).
- Reply textarea at bottom with character count.
- Mentions: `@username` autocomplete.

---

## Real-Time Chat (DM)

```
┌──────────────┬──────────────────────────────────┐
│  Chats       │  Andi Susanto                     │
│──────────────│──────────────────────────────────│
│ ● Andi       │                                   │
│   Ok, see you│  Hey, can you review my PR?     │
│              │                       10:30 AM   │
│ ○ Budi       │  ┌──────────────────────┐       │
│   Sure!      │  │ Sure, send me the    │       │
│              │  │ link                 │       │
│ ○ Citra      │  └──────────────────────┘       │
│   Thanks!    │                       10:32 AM   │
│              │                                   │
│              │  ┌──────────────────┐            │
│              │  │ Here it is:      │            │
│              │  │ github.com/...   │            │
│              │  └──────────────────┘            │
│              │                       10:33 AM   │
│              │                                   │
│              │  [Input]                  [Send]  │
└──────────────┴──────────────────────────────────┘
```

- Left panel: contact list with online indicator (green dot).
- Right panel: chat messages.
- Messages from self: right-aligned, primary background.
- Messages from others: left-aligned, muted background.
- Timestamps: show time if today, date + time if older.
- Reverb-powered: messages appear instantly without refresh.
- Admin has a "Delete" option on message context menu and "Block User" in contact sidebar.

---

## Public News

```
┌──────────────────────────────────────────────┐
│  News & Announcements                         │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ 📰 School Holiday Announcement           │ │
│ │ Admin · 1 Jun 2026                       │ │
│ │ The school will be closed from...        │ │
│ │                             [Read More]  │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ 🏆 Science Fair Winners                 │ │
│ │ Teacher · 28 May 2026                    │ │
│ │ Congratulations to our winners...        │ │
│ │                             [Read More]  │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

- Public route (no auth required).
- Card-based layout with featured image (optional).
- Pagination at bottom.
- "Read More" expands or navigates to full article page.

---

## Notifications

```
🔔 (Bell icon with unread count badge)

┌─────────────────────────────────┐
│ Notifications                   │
├─────────────────────────────────┤
│ ● Adi replied to your post      │
│   5m ago                        │
│ ● Budi verified your logbook    │
│   1h ago                        │
│ ● New announcement: Schedule    │
│   2h ago                        │
│ ● Citra sent you a message      │
│   "Did you submit the task?"    │
│                                 │
│ [Mark all as read]              │
└─────────────────────────────────┘
```

- Dropdown from bell icon (max 5 recent).
- Full page at `/notifications` for history.
- Unread: bold text + blue dot. Read: normal weight.
- Click → navigate to relevant context (post, logbook, message).
