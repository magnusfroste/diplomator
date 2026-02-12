

# Improving the Signed Diplomas Page

The current `/signed` page is functional but visually flat -- a plain card wrapping a list of diploma entries with raw URLs and code blocks. Here is a plan to make it more polished and appealing.

---

## 1. Summary Stats Bar

Add a row of small stat cards above the diploma list showing at-a-glance numbers:
- **Total Diplomas** issued
- **Institutions** (unique count)
- **Latest Signed** (relative date, e.g. "2 days ago")

This gives the page immediate visual weight even before scrolling to the list.

## 2. Better Empty State

Replace the plain text empty state with a more inviting illustration-style layout:
- A large Award icon with a subtle background circle
- A clear heading and a CTA button ("Create Your First Diploma") that navigates to `/app`

## 3. Improved Diploma Cards

Redesign each diploma card to feel more like a credential:
- Add a subtle left border accent (e.g. green or primary color) to each card
- Show a small "shield check" verified icon inline instead of a badge in the corner
- Collapse the three URL fields (Diploma ID, Diploma URL, Verification URL) into a collapsible "Details" section using an Accordion or Collapsible, keeping the card compact by default
- Show only recipient name, institution, date, and quick-action buttons (View, Verify, Copy Link) in the default collapsed view

## 4. Better Loading State

Replace "Loading signed diplomas..." text with skeleton cards (2-3 placeholder cards with shimmer animation using the existing Skeleton component).

## 5. Sort and View Options

Add a small toolbar next to the search bar:
- Sort toggle: newest first / oldest first
- Optional: grid vs list view toggle for future flexibility

---

## Technical Details

### Files Modified

**`src/components/DiplomaManager.tsx`** -- main changes:
- Import `Skeleton`, `Collapsible`/`CollapsibleTrigger`/`CollapsibleContent`, `ShieldCheck`, `ChevronDown` from existing UI/lucide
- Add a `stats` computed section (total count, unique institutions, latest date) rendered as small stat cards
- Replace loading state with 3 `Skeleton` cards
- Replace empty state with illustrated CTA
- Refactor each diploma card:
  - Add `border-l-4 border-primary` accent
  - Default view: recipient, institution, date, action buttons (View Diploma, Verify, Copy Link)
  - Collapsible detail section with blockchain ID and raw URLs
- Add sort state (`ascending` toggle) passed to the query or applied client-side
- Add sort button next to search input

**`src/pages/Signed.tsx`** -- minor:
- Remove "Back to App" button (sidebar already provides navigation)
- Keep header clean

No database changes or new dependencies required. All components used (Skeleton, Collapsible, Badge) are already installed.

