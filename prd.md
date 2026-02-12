# Diplomator — Product Requirements Document

## Overview

Diplomator is an AI-powered diploma and certificate generator. Users describe what they want in a chat interface, and the system generates professional diplomas using a DSL (Domain Specific Language) that maps to pre-defined visual blocks. Diplomas can be iterated on, signed to blockchain, and shared.

---

## User Roles

| Role | Access |
|------|--------|
| **Guest** | Landing page + limited generations (no account required) |
| **Authenticated User** | Full generation, session history, signing, sharing |
| **Admin** | Dashboard, branding settings, integrations, DSL explorer |

---

## Core Interactions

### 1. Diploma Generation (Landing State)

The app starts with a centered landing page (`ChatLanding`). Users have **four ways** to initiate generation:

| Method | Description |
|--------|-------------|
| **Text prompt** | Describe the diploma in free text → AI generates DSL JSON → rendered to HTML/CSS |
| **Image upload** | Upload a reference image (PNG/JPG/GIF/WEBP) → AI analyzes and generates a matching diploma |
| **URL input** | Paste a website URL → system scrapes brand colors/fonts → AI generates brand-matched diploma |
| **Magic wand** | Fills the text input with a random curated prompt for inspiration |

After the first diploma is generated, the UI transitions to a **resizable split-view**: chat on the left, canvas on the right.

### 2. Diploma Iteration (Post-Generation)

Once a diploma exists, the chat input **simplifies** — tool buttons (upload, URL, magic wand) are hidden. The user can only:

- **Send text messages** to refine the diploma (e.g., "make it blue", "add a botanical border", "change the font")
- The AI receives the full conversation history + current HTML/CSS and returns modifications

> **Current limitation**: Image upload and URL-based generation are only available for the *first* generation in a session. Subsequent changes must be described via text.

### 3. Canvas / Preview Panel

The right panel provides five tabs:

| Tab | Functionality |
|-----|---------------|
| **Preview** | Live iframe rendering of the diploma. Supports **edit mode** (pencil toggle) where text elements become contenteditable |
| **HTML** | Monaco code editor showing the diploma HTML. Supports manual editing with save/discard |
| **CSS** | Monaco code editor showing the diploma CSS. Same save/discard flow |
| **Sign** | Blockchain signing interface (see below) |
| **Share** | Download, social sharing, QR code, embed code |

**Canvas toolbar actions:**
- Animation templates (CSS animation presets)
- Edit mode toggle (inline text editing)
- Fullscreen
- Download as HTML

### 4. Blockchain Signing

| Feature | Description |
|---------|-------------|
| **Single sign** | Enter recipient name + institution → signs to Hedera blockchain → generates verification URL |
| **Bulk sign** | Paste a list of names → signs one diploma per name with `{{recipient_name}}` placeholder substitution |

> **Limitation**: The `body.recipientName` in DSL is always `{{recipient_name}}` — a placeholder that gets replaced during signing. Users cannot change the recipient name in the design phase.

> **Limitation**: Signing requires authentication. Guest users cannot sign diplomas.

### 5. Sharing

| Feature | Status |
|---------|--------|
| Download as HTML | ✅ |
| Download as PDF | ✅ (via html2canvas + jsPDF) |
| Copy link | ✅ (for signed diplomas with public URL) |
| Social sharing (Facebook, Twitter, LinkedIn, WhatsApp) | ✅ |
| QR code generation | ✅ |
| Embed code | ✅ |

> **Limitation**: PDF generation quality depends on html2canvas rendering, which may not perfectly match the iframe preview (especially for complex CSS like gradients, pseudo-elements, custom fonts).

### 6. Session Management

| Feature | Description |
|---------|-------------|
| **Auto-save** | Sessions are saved to `diploma_sessions` after generation |
| **Session history** | Sidebar lists past sessions, click to restore |
| **Delete session** | Trash icon on hover with confirmation dialog. Signed diplomas in `signed_diplomas` are unaffected |
| **New session** | "New diploma" button resets the workspace |

> **Limitation**: Sessions cannot be renamed (title is auto-generated from the first message).

---

## Design System (DSL Blocks)

The AI generates structured JSON that maps to a library of pre-built CSS blocks:

| Block | Options |
|-------|---------|
| **Background** | parchment, clean-white, ivory, gradient-warm, gradient-cool, linen, marble, ocean-deep, cosmic-dark, botanical-green, vintage-sepia, watercolor-soft, royal-burgundy |
| **Border** | ornamental, double-line, modern, minimal, classical, art-deco, celtic-knot, botanical-vine, wave, geometric-deco, none |
| **Header** | serif-centered, modern-left, elegant-script, bold-caps, minimal, monumental |
| **Seal** | classical-round, star, shield, ribbon, modern-circle, rosette, compass, laurel-wreath, none |
| **Signature** | handwriting, formal, elegant, stamp, digital |
| **Layout** | landscape / portrait, compact / normal / spacious padding |

### Color Contrast System

The renderer uses an adaptive text color system:
- **Light primaryColor** (dark backgrounds): secondary text uses light grays (`#ccc`, `#aaa`, `#999`)
- **Dark primaryColor** (light backgrounds): secondary text uses dark grays (`#555`, `#666`, `#888`)

The AI prompt enforces strict contrast rules and adds `customCss` overrides for dark backgrounds as a safety net.

### Overflow Handling

- `.diploma-container`: `overflow: hidden` (clips outer edge)
- `.diploma-border`: `overflow: visible` (allows decorative pseudo-elements to render)

---

## Known Limitations & Constraints

### Generation
1. Image/URL generation only available for first generation in a session — subsequent changes are text-only
2. No image support in diplomas (no `<img>` tags, no external images) — all visuals are CSS-only
3. No JavaScript in diplomas — HTML + CSS only
4. No QR code embedding in the diploma itself (QR is a separate share feature)

### Editing
5. Edit mode (contenteditable) only works for text elements — cannot reorder, add, or remove structural elements
6. Manual HTML/CSS edits require explicit Save — no auto-save for code changes
7. Sessions cannot be renamed

### Signing & Export
8. Signing requires authentication — guest users cannot sign
9. `{{recipient_name}}` placeholder is mandatory — real names are inserted only at signing time
10. PDF export may have visual differences from the preview (html2canvas limitations)
11. Signed diplomas are immutable — cannot be edited after signing

### Guest Access
12. Limited number of generations per session (configured server-side)
13. No session persistence for guests
14. No signing or admin features

---

## Pages & Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Landing / marketing page | No |
| `/demo` | Main app (chat + canvas) | No (guest mode) |
| `/auth` | Login / signup | No |
| `/profile` | User profile settings | Yes |
| `/admin` | Admin dashboard | Yes (admin role) |
| `/admin/dsl` | DSL block explorer | Yes (admin role) |
| `/diploma/:id` | Public diploma view | No |
| `/verify/:id` | Diploma verification | No |
| `/signed` | Signed diplomas list | Yes |
| `/embed/:id` | Embeddable diploma iframe | No |
| `/health` | Health check endpoint | No |
