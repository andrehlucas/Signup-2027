# Opus VO Design System — Design Reference

This document is the authoritative design reference for Opus VO product teams.
Read it before building any new UI surface. It supersedes any generic template guidance.

---

## 1. Identity

**Opus VO** is a voice-first product. Its design language is precise, practical, and confident —
never decorative for its own sake. Every visual decision should reduce cognitive load and
communicate capability without noise.

**Brand voice:** Clear. Technical where necessary. Never marketing-inflated.

**Primary color:** Opus blue — a professional mid-blue that reads as trustworthy and focused
without the corporate heaviness of navy. The 600-step (`#026aa2`) is the anchor for primary
interactive elements in light mode; the 300-step (`#36bffa`) leads in dark mode.

---

## 2. Token system

### Source of truth

`tokens.json` (DTCG format) is the single source of truth. Run `pnpm tokens` after any edit.
Never hand-edit `src/index.css` or `src/generated/tokens.tsx`.

### Token layers

| Layer | What it is | Example |
|---|---|---|
| Primitive ramps | Full-step color ramps (brand, gray, error, warning, success, gray-blue) | `brand-600 = #026aa2` |
| Semantic roles | Context-specific aliases that resolve per theme | `primary = brand-600 (light), brand-300 (dark)` |

### Semantic color roles

| Role | Light | Dark | When to use |
|---|---|---|---|
| `background` | `#ffffff` | `#0a0d12` | Page, canvas, modal backdrops |
| `foreground` | `#181d27` | `#fafafa` | Body text, primary labels |
| `primary` | `#026aa2` | `#36bffa` | CTAs, active states, links |
| `primary-foreground` | `#ffffff` | `#062c41` | Text on primary backgrounds |
| `secondary` | `#f5f5f5` | `#22262f` | Secondary buttons, chips |
| `muted` | `#f5f5f5` | `#22262f` | Disabled backgrounds, subtle fills |
| `muted-foreground` | `#717680` | `#94979c` | Placeholder text, captions |
| `accent` | `#e0f2fe` | `#0b4a6f` | Highlighted rows, brand-tinted surfaces |
| `destructive` | `#f04438` | `#b42318` | Destructive actions, error states |
| `border` | `#e9eaeb` | `#252b37` | Dividers, card outlines |
| `ring` | `#7cd4fd` | `#026aa2` | Focus rings |
| `card` | `#ffffff` | `#13161b` | Card and panel backgrounds |

### Primitive ramps

The full ramps are emitted as CSS custom properties by `build-tokens.mjs`:

```
--color-brand-25  through  --color-brand-900
--color-gray-25   through  --color-gray-950
--color-error-25  through  --color-error-950
--color-warning-25 through --color-warning-950
--color-success-25 through --color-success-950
--color-gray-blue-25 through --color-gray-blue-900
```

Use them via Tailwind utility classes: `bg-brand-600`, `text-gray-700`, `border-error-200`, etc.

---

## 3. Color usage

### Hierarchy

1. **Primary surface** — `background` / `foreground`. All content defaults here.
2. **Card surfaces** — `card` / `card-foreground`. Grouped content that sits on the background.
3. **Sidebar** — `sidebar` / `sidebar-foreground`. Slightly offset from the card to create depth.
4. **Emphasis** — `primary` for the single highest-emphasis element in a region.
5. **Status** — `error`, `warning`, `success` ramps for feedback states only.

### Rules

- Apply `primary` to one focal element per visible region. Overuse flattens hierarchy.
- Use `accent` (brand-tinted) for hover rows, active selections, and spotlight areas — not for text.
- Never use arbitrary hex in component code. Map every color need to an existing token or ramp step.
- Ensure 4.5:1 contrast ratio for body text, 3:1 for large text and UI components (WCAG AA).

### Do / do not

- **Do** use `success` for confirmations, `warning` for advisories, `error` for failures.
- **Do** use `muted-foreground` for secondary labels, timestamps, and captions.
- **Do not** use `primary` as a background tint — use `accent` instead.
- **Do not** use error red for anything that is not a genuine error or destructive action.

---

## 4. Typography

**Primary typeface:** Inter (variable, 100–900 weight, 14–32 optical size range)
**Mono:** Menlo — session IDs, token names, code snippets, API keys
**Serif:** Georgia — reserved, not used in product UI

### Type scale

| Step | Size | Weight | Line height | Use |
|---|---|---|---|---|
| Display | 36px / text-4xl | 700 bold | 40px | Hero headers, splash |
| Heading 1 | 24px / text-2xl | 600 semibold | 32px | Page titles, modal titles |
| Heading 2 | 20px / text-xl | 600 semibold | 28px | Section headers |
| Body | 16px / text-base | 400 regular | 24px | Running text, descriptions |
| Label | 14px / text-sm | 500 medium | 20px | Form labels, table headers |
| Caption | 14px / text-sm | 400 regular | 20px | Timestamps, secondary metadata |
| Mono | 14px / text-sm | 400 regular | 20px | Code, IDs, technical values |
| Micro | 12px / text-xs | 500 medium | 18px | Badge labels, legal |

### Rules

- Use `font-semibold` for headings and emphasis; `font-medium` for labels; `font-normal` for body.
- Set uppercase labels with `tracking-wide` (`letter-spacing: 0.05em`) for small-caps effect.
- Limit line length to 60–80 characters for body text (max-w-prose or max-w-2xl).
- Do not use more than two weight levels in a single view.

---

## 5. Spacing

Base step: 4px (`spacing.base = 0.25rem`). All spacing is a multiple of 4px.

| Token class | Value | Common use |
|---|---|---|
| p-1, gap-1 | 4px | Micro gaps between icons and labels |
| p-2, gap-2 | 8px | Internal component padding (sm badges) |
| p-3, gap-3 | 12px | Row internal padding |
| p-4, gap-4 | 16px | Section internal padding, card padding |
| p-5, gap-5 | 20px | Panel padding |
| p-6, gap-6 | 24px | Card padding, section spacing |
| p-8, gap-8 | 32px | Large section gaps |
| p-10, gap-10 | 40px | Page padding (mobile) |
| p-14, gap-14 | 56px | Page padding (desktop) |

### Rules

- Use Tailwind spacing utilities exclusively. No arbitrary `px-[13px]` values.
- Align related elements on the same baseline. Use `gap-` in flex/grid; avoid manual margin stacking.
- Maintain consistent vertical rhythm: 24px between form fields, 32px between page sections.

---

## 6. Corner radius

Base: 8px (`radius.base = 0.5rem`). Derived values:

| Class | Value | Use |
|---|---|---|
| rounded-sm | 4px | Tight elements: badges (badge variant), chips |
| rounded-md | 6px | Default inputs, small cards, dropdowns |
| rounded-lg | 8px | Buttons (all sizes), most cards, dialogs |
| rounded-xl | 12px | Large buttons (2xl), modals, panels |
| rounded-full | 50% | Pill badges, avatars, dot indicators |

### Rules

- Use `rounded-lg` for all interactive elements unless size explicitly calls for another step.
- Do not use `rounded-2xl` or higher on functional UI — only decorative containers.
- Keep radius consistent within a component group (all buttons in a group share the same radius).

---

## 7. Interaction states

Every interactive element must communicate its state clearly:

| State | Visual treatment |
|---|---|
| Default | Baseline appearance |
| Hover | Subtle tint shift (`hover-elevate`) or color step change |
| Focus | 4px ring in `ring` token color (`focus-visible:ring-4 focus-visible:ring-ring`) |
| Active | Slightly darker fill or shadow reduction |
| Disabled | Reduced opacity or muted token colors; `cursor-not-allowed` |
| Loading | Spinner replaces label; button remains disabled |
| Error | Border changes to `error-300`, helper text in `error-600` |

### Focus rings

- Use `focus-visible:ring-4` with `ring-brand-200` (primary) or `ring-brand-100` (secondary/tertiary).
- Never suppress focus rings — they are required for keyboard accessibility.
- The ring should appear only on keyboard navigation (`focus-visible`, not `focus`).

---

## 8. Accessibility

- Minimum contrast: 4.5:1 for text, 3:1 for icons and UI boundaries (WCAG 2.1 AA).
- All interactive elements must have a visible focus indicator.
- Icon-only buttons require `aria-label`. Decorative icons get `aria-hidden="true"`.
- Color alone must never be the sole differentiator — always pair color with a label, icon, or shape.
- Form fields require visible labels (not placeholder-only).
- Use semantic HTML: `<button>` for actions, `<a>` for navigation, `<nav>` for navigation landmarks.

---

## 9. Responsive layout

**Mobile-first.** Start with a single-column layout; expand with breakpoints.

| Breakpoint | Width | Grid columns |
|---|---|---|
| Base (mobile) | < 640px | 1 |
| sm | 640px | 2 |
| md | 768px | 2–3 |
| lg | 1024px | 3–4 |
| xl | 1280px | 4+ |

### Rules

- Use `min-h-[100dvh]` for full-height layouts, not `h-screen` (fails on mobile with URL bars).
- Sidebar navigation collapses to a `<details>` accordion on mobile.
- Max content width: `max-w-5xl` (64rem) inside main content. Wider only for full-bleed tables.
- Minimum tap target: 44×44px for all interactive elements on mobile.

---

## 10. Icons

The icon library is **Lucide React** (`lucide-react`). All icons are rendered as SVGs.

### Rules

- Use `w-4 h-4` (16px) for inline button icons, `w-5 h-5` (20px) for large buttons.
- Use `w-3 h-3` (12px) for badge leading icons.
- Icons in buttons inherit the button's text color — do not set a separate color.
- Set `aria-hidden="true"` on decorative icons. Set `aria-label` on icon-only interactive elements.
- Do not mix icon styles (outline vs filled) in the same view.
- Prefer a 1.5px–2px stroke weight for consistency with Lucide's default stroke.

---

## 11. Component composition rules

### Hierarchy discipline

- Each view has one primary action (Button hierarchy="primary"), one or two secondary actions,
  and as many tertiary/link actions as needed.
- Do not place two `hierarchy="primary"` buttons next to each other.
- Modal footers: primary button right-aligned, cancel left-aligned.

### Density

- **Default density** for most surfaces: 40px row height, 24px card padding.
- **Compact density** (tables, command palettes): 32px row height, 12px cell padding.
- **Comfortable density** (dashboards, landing): 48px row height, 32px card padding.

### Cards

- Use `rounded-xl border bg-card p-6 text-card-foreground` for standard cards.
- Group related actions in the card footer using a flex row with `gap-2`.

### Forms

- Stack label above input with `space-y-1.5`.
- Align submit action to the right; cancel to the left.
- Show inline validation messages below the field with `text-sm text-destructive`.

### Tables

- Use `bg-card` for the table container.
- Alternate rows only for tables wider than 6 columns.
- Right-align numeric columns; left-align text.

---

## 12. Do and do not — summary

**Do:**
- Derive every visual value from a token or ramp step.
- Use the correct hierarchy button for the action's priority level.
- Test every view in light and dark mode.
- Add `aria-label` to icon-only controls.
- Keep badge text to 1–2 words.
- Pair status color with a label or icon — never color alone.

**Do not:**
- Use arbitrary hex or pixel values in component code.
- Place two primary buttons side by side.
- Suppress focus rings.
- Use placeholder text as the only form label.
- Invent a new color that is not in the token set.
- Use the brand blue for negative or destructive states.

---

## 13. Shipped component families (source-backed)

These three families are verified from the Figma source and shipped in this package:

### Button

Five hierarchies: primary · secondary · tertiary · link-color · link-gray  
Five sizes: sm · md · lg · xl · 2xl  
Icon slots: leadingIcon, trailingIcon, iconOnly  
States: default · hover · focused · disabled · loading

### ButtonGroup (segmented control)

Icon types per segment: none · leading · dot · icon-only  
States: default · hover · focused · disabled  
Use for tab-like navigation, view switchers, and filter controls.

### Badge

Three variants: pill · badge · modern  
Twelve colors: gray · brand · error · warning · success · gray-blue · blue-light · indigo · purple · blue · pink · orange  
Two sizes: sm · md  
Slots: dot · leadingIcon · onClose

---

## 14. Upcoming component families (Figma-designed, not yet shipped)

The following families have complete Figma designs in the Opus VO component library.
They are not yet implemented in this package. Do not build ad-hoc versions
of these — wait for the source-backed implementation.

- **Input** — text, email, password, search, and number fields with label, description, error, and icon slots
- **Select** — dropdown with grouped options, placeholder, and disabled states
- **Dialog** — modal with header, scrollable body, and footer action bar
- **Toast / Notification** — transient dismissible messages with status types
- **Table** — sortable, selectable rows with pagination and empty state
- **Sidebar navigation** — collapsible tree with icons, badges, and section groups
- **Avatar** — image, initials fallback, and stacked group
- **Tooltip** — brief label on hover or focus

---

## 15. Token export coverage

`tokens.json` documents 1,105 Figma variables across 7 collections:

- Primitives/Colors/Base (white, black, transparent)
- Primitives/Colors/Brand (Opus blue — 10 steps)
- Primitives/Colors/Gray light mode (12 steps)
- Primitives/Colors/Gray dark mode (12 steps)
- Primitives/Colors/Error (12 steps)
- Primitives/Colors/Warning (12 steps)
- Primitives/Colors/Success (12 steps)
- Primitives/Colors/Gray blue (11 steps)
- Semantic light mode (37 roles)
- Semantic dark mode (37 roles)
- Typography (3 families)
- Radius (1 base step)
- Spacing (1 base step)

The generator (`scripts/build-tokens.mjs`) emits:
- `src/index.css` — CSS custom properties for both semantic modes and all primitive ramps
- `src/generated/tokens.tsx` — hex token object for mobile (Expo) and other platforms
- `public/favicon.svg` — generated from the primary token and the title

---

*Last updated: source-backed v1.0 — Button, ButtonGroup, Badge shipped.*
