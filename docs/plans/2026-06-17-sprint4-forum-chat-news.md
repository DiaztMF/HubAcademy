# Sprint 4: Forum, Chat, Public News & Notifications

**Goal:** Build the Community Forum discussion system, Peer-to-Peer Direct Messages (polling-based, Reverb-ready), Public News portal, and in-app notification bell.

**Constraints:** Laravel Reverb / Pusher not installed (Packagist unreachable). Chat uses polling with DB model — architecture supports direct swap to Reverb later.

---

### Task 1: Community Forum

**Files:**
- Create: `database/migrations/2026_06_17_600001_create_categories_table.php`
- Create: `database/migrations/2026_06_17_600002_create_forum_posts_table.php`
- Create: `database/migrations/2026_06_17_600003_create_forum_comments_table.php`
- Create: `app/Models/Category.php`
- Create: `app/Models/ForumPost.php`
- Create: `app/Models/ForumComment.php`
- Create: `app/Http/Controllers/Forum/ForumPostController.php`
- Create: `app/Http/Controllers/Forum/ForumCommentController.php`
- Create: `app/Http/Requests/Forum/StorePostRequest.php`
- Create: `app/Http/Requests/Forum/StoreCommentRequest.php`
- Create: `resources/js/pages/forum/index.tsx`
- Create: `resources/js/pages/forum/show.tsx`
- Create: `resources/js/pages/forum/create.tsx`
- Create: `resources/js/components/forum/post-card.tsx`
- Modify: `routes/web.php`
- Seed: default categories (General, InternalAnnouncements)
- Update: RolePermissionSeeder with forum permissions
- Test: `tests/Feature/Forum/ForumTest.php`

### Task 2: Public News

**Files:**
- Create: `database/migrations/2026_06_17_700001_create_news_table.php`
- Create: `app/Models/News.php`
- Create: `app/Http/Controllers/NewsController.php`
- Create: `app/Http/Requests/NewsStoreRequest.php`
- Create: `resources/js/pages/news/index.tsx`
- Create: `resources/js/pages/news/show.tsx`
- Create: `resources/js/pages/news/create.tsx` (admin/teacher)
- Modify: `routes/web.php`
- Update: RolePermissionSeeder with news permissions
- Test: `tests/Feature/News/NewsTest.php`

### Task 3: Peer-to-Peer Chat (Polling)

**Files:**
- Create: `database/migrations/2026_06_17_800001_create_chat_messages_table.php`
- Create: `database/migrations/2026_06_17_800002_create_chat_participants_table.php`
- Create: `app/Models/ChatMessage.php`
- Create: `app/Models/ChatConversation.php`
- Create: `app/Http/Controllers/ChatController.php`
- Create: `resources/js/pages/chat/index.tsx`
- Create: `resources/js/pages/chat/conversation.tsx`
- Create: `resources/js/components/chat/message-bubble.tsx`
- Create: `resources/js/components/chat/conversation-list.tsx`
- Modify: `routes/web.php`
- Test: `tests/Feature/Chat/ChatTest.php`

### Task 4: In-App Notifications

**Files:**
- Create: `database/migrations/2026_06_17_900001_create_notifications_table.php` (Laravel's default)
- Create: `app/Http/Controllers/NotificationController.php`
- Create: `resources/js/components/notification-bell.tsx`
- Modify: `resources/js/components/app-header.tsx`
- Modify: `routes/web.php`
- Use: Laravel's built-in notifications table via `php artisan notifications:table`
