

# Left Sidebar with Diploma History

## Overview
Add a collapsible left sidebar (like ChatGPT/Grok) to the `/app` page showing diploma history. Profile and settings move to the sidebar footer. The header becomes minimal with just logo + sidebar trigger.

## What Changes

### 1. New Database Table: `diploma_sessions`
Stores each diploma "conversation" so users can return to previous designs:
- `id`, `user_id`, `title` (auto-generated from recipient/theme), `diploma_html`, `diploma_css`, `diploma_format`, `created_at`, `updated_at`
- RLS: users see only their own sessions

### 2. New Component: `AppSidebar.tsx`
- Uses the existing Shadcn `Sidebar` components
- **Top**: "New Diploma" button (+ icon)
- **Middle**: Scrollable list of saved diploma sessions, grouped by date (Today, Yesterday, Previous 7 days)
- **Bottom footer**: User avatar, name, settings gear, logout -- minimal row
- Collapsible to icon-only mode (just icons visible)

### 3. Updated Layout: `Index.tsx`
- Wrap everything in `SidebarProvider`
- Structure: `Sidebar | Header + Content`
- Header simplified: just logo + `SidebarTrigger` on left, no profile menu on right
- The resizable Chat + Preview panels remain unchanged inside the main content area

### 4. Updated Context: `DiplomaContext.tsx`
- Add `currentSessionId` and `loadSession(id)` / `saveSession()` helpers
- Auto-save current diploma state when generating or switching sessions

### 5. Remove from Header
- Profile dropdown moves entirely to sidebar footer
- BlockchainMenu stays in header (or moves to preview panel toolbar)

## Layout Sketch

```text
+--------+------------------------------------------+
| [=]    |  Logo  Diplomator         [Blockchain]   |
| New +  |------------------------------------------|
|        |  Chat Panel  |  |   Preview Panel        |
| Today  |              |  |                        |
|  Diploma A |          |  |                        |
|  Diploma B |          |  |                        |
| Yesterday  |          |  |                        |
|  Diploma C |          |  |                        |
|        |              |  |                        |
|--------|              |  |                        |
| [AV] Name  [gear]    |  |                        |
+--------+------------------------------------------+
```

## Technical Details

- **Migration SQL**: Create `diploma_sessions` table with RLS policy `user_id = auth.uid()`
- **Auto-save**: Debounced save after each AI generation completes (updates `diploma_html`, `diploma_css`, `title`)
- **Title generation**: First generation in a session auto-sets title from recipient name or theme (e.g., "Royal - John Smith")
- **Session switching**: Loading a session restores `diplomaHtml`, `diplomaCss`, `diplomaFormat`, and `messages` into context
- **Sidebar width**: 240px expanded, 48px collapsed (icon-only shows just the + button and avatar)
- **New Diploma**: Resets context to blank state, creates a new session row

