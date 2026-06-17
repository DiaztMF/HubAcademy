# Design Principles — HubAcademy

## 1. Clarity Over Decoration
Every visual element must serve a functional purpose. The interface should communicate hierarchy, state, and action without requiring the user to interpret decorative fluff. Whitespace is a feature, not wasted space.

## 2. Predictability & Consistency
Users should feel at home across every module — LMS, Attendance, Forum, Chat, Logbook. Same button behaves the same way. Same pattern appears in the same context. Establish a single source of truth for components and reuse relentlessly.

## 3. Progressive Disclosure
School ecosystems serve diverse roles (Admin, Teacher, Student, Mentor). Show what's relevant to the current role and task. Complex features (e.g., bulk import, backdated attendance, R2 asset management) are unveiled only when needed, not dumped on the user upfront.

## 4. Data Integrity First
Attendance records, logbook verifications, and course enrollments are legally significant. The UI must make destructive actions deliberate (confirmations, undo timelines) and data states unambiguous (Saved, Pending, Verified, Rejected).

## 5. Accessibility as a Baseline
Target WCAG 2.1 AA minimum. Color is never the sole differentiator. Focus indicators are visible. Typography scales respect user preferences. The system serves a wide age range (13–60+), so contrast and font size must accommodate low-vision users and aging educators.

## 6. Mobile-Comfortable, Desktop-Powered
The primary workflow is on desktop (dashboard, data entry, logbook review), but core read tasks (forum browsing, news, notification checks) must work comfortably on mobile. The sidebar collapses; tables scroll horizontally; forms stack vertically.
