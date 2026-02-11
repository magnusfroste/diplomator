

# Simplify the Diploma Viewer

The current `/diploma/:diplomaId` page is overloaded with 4 tabs and repeated information. The goal is to create a clean, single-page view that shows what matters most.

## Current Problems
- 4 tabs (Diploma, Verification, Embed, Share) -- too many for a viewer
- Redundant URLs shown in multiple places
- Embed/Share tabs are admin features, not relevant for someone viewing a diploma
- "Diplomator Seal" raw JSON shown to end users

## Simplified Design

The new viewer will be a single clean page with:

1. **Header bar** -- Diplomator branding + "Blockchain Verified" badge
2. **Diploma rendering** -- the actual diploma HTML/CSS, front and center
3. **Compact footer bar** -- recipient, institution, date, and action buttons (Verify, QR, Copy Link)

No tabs. The diploma itself is the hero. Verification details are accessible via the existing `/verify/:id` route (linked from the Verify button).

## Technical Details

### File: `src/pages/Diploma.tsx` (rewrite)

- Remove `Tabs`, `EmbedGenerator`, `QRCodeGenerator` imports and all tab content
- Keep: data fetching, loading/error states
- New layout:
  - Sticky header with brand + verified badge
  - Full-width diploma display (the HTML/CSS rendered)
  - Bottom action bar with: Copy Link, Verify on Blockchain, and a small QR toggle (inline popover)
- Parse `diplomator_seal` JSON to show Hedera topic/tx info in a small collapsible section below the diploma (optional click to expand)

### File: `src/pages/Verify.tsx` (no changes)

Already works well as a standalone verification page.

### File: `src/pages/DiplomaEmbed.tsx` (no changes)

Embed remains separate for iframe use cases.

This keeps the Diploma page focused on displaying the diploma beautifully, with minimal UI chrome. Advanced features (embed code, share URLs) can be accessed from the `/signed` management page instead.
