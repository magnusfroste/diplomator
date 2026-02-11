

# Chat Landing Page (Grok/Claude Style)

## Overview
Transform the new diploma experience: instead of immediately showing the split chat+preview layout, start with a clean centered landing page with a single input field and action buttons. Once the user sends their first prompt (or uploads/pastes a URL), transition to the full chat+canvas view.

## How It Works

```text
NEW SESSION (no messages yet):
+--------+------------------------------------------+
| Sidebar|                                          |
|        |         [Logo] Diplomator                |
|        |                                          |
|        |     "What diploma would you like         |
|        |      to create today?"                   |
|        |                                          |
|        |   +--------------------------------+     |
|        |   | Describe your diploma...       |     |
|        |   |                          [->]  |     |
|        |   +--------------------------------+     |
|        |   [Upload] [URL] [Magic]                 |
|        |                                          |
+--------+------------------------------------------+

AFTER FIRST PROMPT (has messages):
+--------+---------------+-------------------------+
| Sidebar| Chat messages  |   Preview/Canvas       |
|        | ...            |                        |
|        | [input field]  |                        |
|        | [Upload][URL]  |                        |
+--------+---------------+-------------------------+
```

## Changes

### 1. New Component: `ChatLanding.tsx`
A centered landing view shown when no messages exist yet (only the initial welcome message):
- App logo + title at top
- Tagline: "What diploma would you like to create today?"
- Large centered textarea with send button
- Action row below: Upload, URL, Magic buttons as icon+label chips
- Upload opens a file picker dialog (not a separate tab)
- URL opens a popover with URL input
- Magic fills the textarea with a random prompt

### 2. Update `Index.tsx` Layout Logic
- Track whether the session is in "landing" or "active" state
- Landing state = no user messages yet -> show `ChatLanding` full-width (no resizable panels, no preview)
- Active state = has user messages -> show current resizable split layout
- Transition happens automatically when first message is sent

### 3. Update `ChatPanel.tsx`
- Remove the tab bar (Upload, URL, Magic tabs)
- The chat view becomes purely: message list + input area
- Move Upload/URL/Magic action buttons into the input area as small icon buttons (like Claude's attachment button)
- Input area: textarea with action icons on the left, send button on the right

### 4. Context: Add `hasStarted` derived state
- Simple check: `messages.filter(m => m.isUser).length > 0`
- Used by `Index.tsx` to decide which layout to show

## Technical Details

- **ChatLanding.tsx**: New component. Contains the centered input, action buttons, and handles the first message send. After sending, the context gets a user message, which triggers the layout switch automatically.
- **ChatPanel.tsx**: Simplified to just MessageList + input bar with inline action icons. No more tab system.
- **Index.tsx**: Conditionally renders either `ChatLanding` (full width) or the resizable split panels based on whether user messages exist.
- **FileUpload / URLInput**: Reused inside dialogs/popovers triggered from action buttons, rather than as full tab panels.
- No database changes needed.
- No new routes needed -- the transition is purely visual within `/app`.

