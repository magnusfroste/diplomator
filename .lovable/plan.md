

# Inline Text Editing in Diploma Preview

Add a lightweight "Edit Mode" toggle to the preview panel that lets users click on any text element in the diploma and edit it directly -- no code, no credits, no complexity.

---

## How It Works

1. User generates a diploma via AI chat
2. User clicks "Edit Mode" toggle button in the preview toolbar
3. Text elements in the preview become clickable -- a subtle highlight appears on hover
4. Clicking a text element opens an inline edit (contenteditable or a small input overlay)
5. User types the correction, clicks away or presses Enter
6. The underlying HTML in DiplomaContext is updated automatically
7. User toggles Edit Mode off and proceeds to Sign/Share

---

## What Gets Built

### Preview Panel Toolbar Addition
- A new "Edit" toggle button (Pencil icon) next to the existing Fullscreen/Download buttons
- When active, the button shows as highlighted/pressed
- A small banner: "Click any text to edit it" appears below the toolbar

### Iframe Communication
- When Edit Mode is on, inject a small script into the iframe via `srcDoc` that:
  - Adds `contenteditable="true"` to all text-containing elements (p, h1-h6, span, td, li, etc.)
  - Adds hover highlight styling (subtle outline or background)
  - Sends a `postMessage` back to the parent with the updated HTML when the user finishes editing (on `blur`)
- The parent listens for these messages and calls `setDiplomaHtml()` with the updated content

### No New Dependencies
- Uses standard browser APIs: `contenteditable`, `postMessage`, `MutationObserver`
- No drag-and-drop library, no WYSIWYG framework

---

## Technical Details

### Files Modified

**`src/components/PreviewPanel.tsx`**
- Add `isEditMode` state (boolean toggle)
- Add Pencil icon button in header toolbar
- Modify `getPreviewContent()` to inject edit-mode script when `isEditMode` is true
- Add `useEffect` with `window.addEventListener('message', ...)` to listen for HTML updates from the iframe
- When an update message arrives, call `setDiplomaHtml(newHtml)` to persist the change

**Injected iframe script (inline in srcDoc)**
- On load (when edit mode): query all text elements, set `contenteditable="true"`, add hover CSS
- On `blur` of any editable element: gather the full `.diploma-wrapper` innerHTML and `postMessage` it to parent
- On exit edit mode: remove `contenteditable`, remove hover styles

### Scope Boundaries
- Only text content is editable -- no moving, resizing, or style changes
- Structural changes (adding/removing elements) still go through the AI chat or code editor
- This keeps the feature simple and unlikely to break diploma layouts

