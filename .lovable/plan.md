

# Design System Review: Colors, Containment & Space Optimization

After reviewing the renderer, CSS blocks, and AI prompt, I found three categories of issues to fix.

---

## 1. Dark Background Text Contrast (Critical)

**Problem**: The renderer hardcodes body text colors (`#333`, `#555`, `#666`, `#888`, `#999`, `#aaa`) that are invisible on dark backgrounds like `cosmic-dark` or `ocean-deep`. The AI prompt tells the model to use light `primaryColor`, but the renderer ignores this for secondary text elements (pretext, description, date, fields, footer, subtitle).

**Fix**: In `renderer.ts`, derive secondary text colors from `primaryColor` instead of hardcoding. If primaryColor is light (luminance check), use light grays for secondary text. If dark, use the current dark grays.

---

## 2. Border Overflow Clipping (Medium)

**Problem**: The `overflow: hidden` rule on `.diploma-border` clips decorative pseudo-elements that intentionally extend outside the border (ornamental `::after` at `top: -8px`, celtic-knot at `top: -10px`, botanical-vine at `-10px`, geometric-deco at `-16px`). These decorations are part of the design but get cut off.

**Fix**: Change `.diploma-border` from `overflow: hidden` to `overflow: visible`, and instead apply `overflow: hidden` only on `.diploma-container` (the outer wrapper) to prevent page-level overflow while allowing decorations to render within the container padding area.

---

## 3. Space Utilization (Medium)

**Problem**: The diploma body description is capped at `max-width: 500px` inside an `800px` container, leaving a lot of unused horizontal space. Combined with generous margins, the diploma can feel small and empty.

**Fix**:
- Increase `.diploma-body .diploma-description` max-width from `500px` to `600px`
- Reduce some vertical margins slightly for a tighter, more professional feel
- Ensure `.diploma-container` takes the full available width with `width: 100%` alongside `max-width`

---

## Technical Details

### File: `src/diploma-dsl/renderer.ts`

**A) Add color luminance helper** (top of file):
- A small function `isLightColor(hex)` that returns true if the color is light (luminance > 0.5)
- Used to derive appropriate secondary text colors

**B) Derive adaptive text palette**:
- If `primaryColor` is light: secondary text = `#ccc`, `#aaa`, `#999` (light grays for dark backgrounds)
- If `primaryColor` is dark: secondary text = `#555`, `#666`, `#888` (dark grays, current behavior)
- Apply these to: `.diploma-pretext`, `.diploma-description`, `.diploma-date`, `.diploma-fields`, `.diploma-footer`, header `.subtitle`, signature `.sig-title`

**C) Fix overflow**:
- `.diploma-container`: add `overflow: hidden`
- `.diploma-border`: change to `overflow: visible` (let border decorations render within container padding)

**D) Improve space usage**:
- `.diploma-description` max-width: `500px` -> `600px`
- `.diploma-container` add `width: 100%`
- Reduce `.diploma-body` margin from `1.5em 0` to `1.2em 0`

### File: `supabase/functions/generate-diploma/index.ts`

**E) Add prompt rule about customCss for dark backgrounds**:
- Instruct AI to add `color` overrides for `.diploma-description`, `.diploma-pretext`, `.diploma-date`, `.diploma-footer` via `customCss` when using dark backgrounds, as a safety net alongside the renderer fix.

