# 📝 Product Requirement Document (PRD) - MVP Stage

**Project:** HubAcademy (All-in-One School Ecosystem)  
**Target Stack:** Laravel 13, Inertia.js (React), SQLite, Spatie RBAC, Cloudflare R2, Laravel Reverb  
**System Nature:** Sustainable & Scalable (Built for transition across student generations)

---

## 👥 1. User Management & Authentication (RBAC)

### A. Roles & Permissions (Spatie)
The system enforces 4 distinct roles with permission-based access control handled via Laravel Middleware and passed directly to Inertia React props:

*   **Admin:** Full system control, centralized user management (mass data import), configuration of global forum categories, chat/forum moderation, and public news management.
*   **Teacher:** Creates LMS courses, inputs learning materials, takes student attendance (current & *backdate*), verifies internship (PKL) logbooks, and publishes posts in restricted internal forum categories.
*   **Student:** Self-registration, joins courses via unique codes, reads learning materials, fills out daily internship logbooks (text + photo proof), posts/comments in open forum categories, and initiates real-time direct messages.
*   **Industry Mentor:** Views and verifies daily logbooks of assigned internship students, leaving feedback or evaluative notes.

### B. Authentication Features
*   **Self-Registration:** Students can create their own accounts via a registration page requiring: Full Name, Student National ID (NISN), Email, Password, and Class/Major selection.
*   **Mass Data Import:** Admins have access to a dashboard utility to upload Excel/CSV files containing bulk Teacher or Student rosters for automated account generation (powered by `Laravel Excel`).

---

## 📚 2. Core Modules & Feature Requirements (MVP Scope)

### Module 1: LMS (Learning Management System)
*   **Structure:** `Course (Subject)` ➔ `Section (Chapter)` ➔ `Topic (Material)`.
*   **Workflow:** 
    1. A Teacher creates a new *Course*, and the system generates a **Unique Join Code**.
    2. Students enter this code on their dashboard to instantly enroll in the *Course*.
    3. Teachers populate chapters with topics formatted in **Markdown** (for rich text) and **Embedded Links** (for videos hosted on YouTube or Google Drive).
    4. Students access the structured layout to consume reading materials cleanly.

### Module 2: Student Attendance (Flexible & Backdated)
*   **Mechanism:** *Teacher-driven attendance* (Manually logged by educators).
*   **Workflow:**
    1. The Teacher selects the Class, Subject, and **Attendance Date** (supporting both today's date and past dates—*backdating*—to accommodate teachers transitioning from traditional paper logs).
    2. The system renders the student roster in a data table.
    3. The Teacher updates each student's status via a dropdown: `Present`, `Late`, `Permitted Absence`, `Sick`, or `Unexcused Absence (Alpa)`.
    4. An optional `Notes` text column is available for context (e.g., "Doctor's note attached").
    5. The Teacher clicks "Save Attendance". Write operations are queued via *Laravel Queues* during peak traffic periods to eliminate SQLite engine lockups.

### Module 3: Portfolio System (Foundational Architecture)
*   **Workflow:** 
    1. A Student opens the Portfolio tab and inputs project details: Project Title, Description, Category, and External Links (e.g., GitHub repository or Figma file).
    2. The Student uploads an image or screenshot of their work.
    3. On the frontend (React), the image file is compressed on the client side using `browser-image-compression` to a maximum ceiling of ~200KB.
    4. Laravel receives the optimized stream, pipes it directly to **Cloudflare R2 Storage**, and logs the permanent asset URL into the SQLite database.

### Module 4: Internship System (PKL Digital Logbook)
*   **Workflow:**
    1. Admins or Teachers link a Student account to their designated Industry Mentor.
    2. The Student logs their daily shift by providing a text-based summary of duties performed and optionally uploading 1 photo proof of activity (stored on Cloudflare R2).
    3. Teachers and Industry Mentors monitor their assigned students via a unified logbook **timeline**.
    4. Evaluators can click a "Verify" button and attach brief performance feedback.

### Module 5 & 6: Community Forum & Real-Time Chat
*   **Forum Dynamics:**
    *   Students and Teachers can create open discussion posts tagged with custom hashtags (`#category`).
    *   Admins or Teachers can register protected structural categories (e.g., `#InternalAnnouncements`). These display as pinned/recommended categories for staff members; Students have read-only and comment privileges within these spaces.
*   **Chat Dynamics:**
    *   Peer-to-peer *Direct Messages* (DMs) are universally open across all user categories (Student, Teacher, Mentor).
    *   Powered by **Laravel Reverb**, message ingestion and delivery happen in real-time without polling or manual screen refreshing.
    *   Admins possess explicit "Delete Message" and "Block User" utilities on a moderation dashboard to curb inappropriate interactions.

### Module 7 & 8: Public News & In-App Notifications
*   **News Portal:** An announcement feed curated by Admins and Teachers. This specific routing layer **bypasses authentication middleware (Public Access)** to act as the school’s external PR/newsletter outlet.
*   **Notification Engine:** An in-app alert system (bell icon in the top-right corner of the dashboard viewport). Triggered dynamically via Laravel Reverb when a user receives a forum reply, a staff member drops a restricted announcement, or a logbook entry is verified.

---

## 🗄️ 3. Database Schema Architecture (SQLite Optimized)

To keep the local SQLite database file snappy and organized across school years, the following relational migrations will form the system’s core backbone:
┌───────────────┐       ┌────────────────────┐       ┌─────────────────┐
│     users     │──────►│ model_has_roles    │──────►│      roles      │
└───────────────┘       └────────────────────┘       └─────────────────┘
│
├───────────────┐
▼               ▼
┌───────────────┐       ┌────────────────────┐
│   logbooks    │       │     attendances    │
└───────────────┘       └────────────────────┘
│                       │
▼ (R2 Links)            ▼
┌───────────────┐       ┌────────────────────┐
│   courses     │◄──────│   course_student   │ (Pivot Table / Join Codes)
└───────────────┘       └────────────────────┘
│
▼
┌───────────────┐
│   sections    │
└───────────────┘
│
▼
┌───────────────┐
│    topics     │ (Markdown content + Link Embedding)
└───────────────┘

> 📌 **SQLite Performance Tune:** Database indexes (`index()`) are strictly required on high-frequency columns like `user_id`, `course_id`, `date`, and `role_id` to guarantee rapid querying as data rows compound across semesters.

---

## 📈 4. MVP Development Milestones (4-Week Sprint Plan)

### Sprint 1: Foundation & Authentication (Week 1)
*   Initialize Laravel 13 boilerplate paired with the React/Inertia starter kit.
*   Install Spatie Laravel-Permission and seed the 4 baseline roles.
*   Develop Login/Logout UX, student Self-Registration, and the Admin CSV bulk import endpoint.

### Sprint 2: LMS Engine & Attendance Ledger (Week 2)
*   Construct CRUD features for Course, Section, and Topic layers (integrate a React Markdown parsing package).
*   Build Join Code matching logic.
*   Deliver the flexible Teacher Attendance UI featuring *backdated* calendar picking.

### Sprint 3: PKL Logs, Portfolios & Cloudflare R2 Integration (Week 3)
*   Configure the S3 Flysystem driver to bind seamlessly with Cloudflare R2 credentials.
*   Program the Portfolio submission form equipped with client-side image compression.
*   Launch the daily PKL logbook pipeline and Mentor verification workflow.

### Sprint 4: Real-Time Services & Open Portals (Week 4)
*   Boot and optimize the Laravel Reverb WebSocket daemon on the VPS server.
*   Connect client-side Laravel Echo hooks to support instant DMs and top-bar bell notifications.
*   Finalize the public-facing News grid and clean up responsive layouts.