# Opus VO Design System

This package defines the visual language for Opus VO product teams. Use it whenever you
build or restyle UI so every surface looks like the same product. It is a real
workspace package (`@workspace/opus-vo-design-system`): other artifacts depend
on it and import its theme and components directly.

## What's here

- `tokens.json` — the single source of truth (DTCG format). Contains 1,105 Figma variables
  from 7 collections: the Opus blue brand ramp, gray/error/warning/success primitive ramps,
  light/dark semantic role tokens, typography, spacing, and radius.
- `scripts/build-tokens.mjs` — generates the outputs below from `tokens.json`. Extended to
  emit `--color-brand-*`, `--color-gray-*`, `--color-error-*`, `--color-warning-*`,
  `--color-success-*`, and `--color-gray-blue-*` CSS custom properties so components can
  reference the full Opus palette without hardcoded hex.
- `scripts/theme-template.css` — CSS template consumed by the generator. Contains `@theme inline`
  blocks that register all semantic and primitive ramp tokens as Tailwind utilities.
- `src/index.css` — GENERATED token theme (web), exported as `./styles.css`.
- `src/generated/tokens.tsx` — GENERATED hex token object, the package's `.` and `./tokens` entry.
  Includes `color.light`, `color.dark`, and `primitives` (all ramps as hex).
- `public/favicon.svg` — GENERATED from the primary token and the page title.
- `DESIGN.md` — root design reference: hierarchy, color roles, typography, spacing, radius, states,
  accessibility, responsive layout, icon treatment, composition rules, do/don'ts, and component coverage.
- `src/components/ui/button.tsx` — **Opus source-backed.** Five hierarchies (primary/secondary/
  tertiary/link-color/link-gray), five sizes (sm/md/lg/xl/2xl), icon slots, loading state.
  Backward-compatible with legacy `variant` prop for scaffold consumers.
- `src/components/ui/button-group.tsx` — **Opus source-backed.** Segmented control with
  none/leading/dot/icon-only icon types per segment.
- `src/components/ui/badge.tsx` — **Opus source-backed.** Three variants (pill/badge/modern),
  12 colors from the Figma utility palette, two sizes, dot/leadingIcon/onClose slots.
- `src/components/ui/` — remaining scaffold components (accordion, alert, avatar, calendar, card,
  carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu,
  empty, field, form, hover-card, input, input-group, input-otp, item, kbd, label, menubar,
  navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select,
  separator, sheet, sidebar, skeleton, slider, sonner, spinner, switch, table, tabs, textarea,
  toast, toaster, toggle, toggle-group, tooltip). These are not exported or registered as Opus
  source components. They exist to keep the scaffold functional while source-backed components
  are built out.
- `src/lib/` (`cn`) and `src/hooks/` — exported as `./lib/*` and `./hooks/*`.
- `src/App.tsx` — entry point for the living style guide.
- `src/preview/DesignSystemBrowser.tsx` — persistent navigation shell with theme toggle,
  search, deep-link hash routing, and lazy page rendering.
- `src/preview/registry.tsx` — preview manifest. Only source-backed Opus components are
  registered. Title: "Opus VO Design System". Upcoming components are documented in DESIGN.md
  but not registered.
- `src/preview/foundations.tsx` — Overview, Colors, Fonts, and Layout pages. Overview shows
  system identity, brand palette, token coverage, component status table, and live theme switching.
- `src/preview/parts.tsx` — shared preview primitives: `Row`, `Stack`, `Guidelines`.
- `src/preview/demos/button.tsx` — rich Button story: all hierarchies, all sizes, icon slots, states.
- `src/preview/demos/button-group.tsx` — rich ButtonGroup story: icon types, interactive state, states.
- `src/preview/demos/badge.tsx` — rich Badge story: all variants, all 12 colors, sizes, slots, usage example.
- `docs/consuming-web.md`, `docs/consuming-expo.md`, `docs/consuming-slides.md` — platform usage guides.
- `docs/migrating-web.md`, `docs/migrating-expo.md` — migration guides.

Every source file in this package is a `.tsx` file (including token, utility, and hook modules
with no JSX), so every export below is a single `*.tsx` glob. Do not add `.ts` files here.

## What this package exports

```jsonc
".":              "./src/generated/tokens.tsx",
"./tokens":       "./src/generated/tokens.tsx",
"./styles.css":   "./src/index.css",
"./components/*": "./src/components/*.tsx",
"./lib/*":        "./src/lib/*.tsx",
"./hooks/*":      "./src/hooks/*.tsx"
```

Components import each other with relative paths internally, so they resolve
correctly when another package imports them through
`@workspace/opus-vo-design-system/components/...`. Never use a `@/` alias inside
this package. Components added through shadcn may use this package's
`#components/*`, `#lib/*`, and `#hooks/*` imports from `package.json`; those are
consumer-safe because they resolve against this package.

## Component status

| Family | Status | Notes |
|---|---|---|
| Button | Stable | Opus source-backed. Use `hierarchy` prop. Legacy `variant` supported. |
| ButtonGroup | Stable | Opus source-backed. Use `items` array with icon types. |
| Badge | Stable | Opus source-backed. 12 colors, 3 variants. |
| Input | Planned | Figma designs complete. Not yet shipped. |
| Select | Planned | Figma designs complete. Not yet shipped. |
| Dialog | Planned | Figma designs complete. Not yet shipped. |
| Toast | Planned | Figma designs complete. Not yet shipped. |
| Table | Planned | Figma designs complete. Not yet shipped. |
| Sidebar Nav | Planned | Figma designs complete. Not yet shipped. |

## Editing and maintaining the design system

Edit `tokens.json` only, then run `pnpm tokens`. The dev server regenerates on change.
Never hand-edit `src/index.css` or `src/generated/tokens.tsx`.

When adding a new Opus source component:
1. Create `src/components/ui/<name>.tsx` using only Opus token utilities and Radix primitives.
2. Write a rich demo in `src/preview/demos/<name>.tsx` covering all variants, sizes, and states.
3. Register the demo in `src/preview/registry.tsx` with a unique `id`, name, and description.
4. Update the "Component status" table in this file.
5. Update DESIGN.md to document the component's design rules.

Do not register scaffold (non-Opus) components as preview entries. Their stories remain in
`src/preview/demos/` for typecheck coverage only.

## Token utilities available in components

After running `pnpm tokens`, these Tailwind utility classes are available:

**Brand:** `bg-brand-{25|50|100|200|300|400|500|600|700|800|900}`, `text-brand-*`, `border-brand-*`  
**Gray:** `bg-gray-{25|50|100|200|300|400|500|600|700|800|900|950}`, `text-gray-*`, `border-gray-*`  
**Error:** `bg-error-{25..950}`, `text-error-*`, `border-error-*`  
**Warning:** `bg-warning-{25..950}`, `text-warning-*`, `border-warning-*`  
**Success:** `bg-success-{25..950}`, `text-success-*`, `border-success-*`  
**Gray-blue:** `bg-gray-blue-{25..900}`, `text-gray-blue-*`, `border-gray-blue-*`  
**Semantic:** `bg-primary`, `text-primary-foreground`, `bg-destructive`, `bg-muted`, `text-muted-foreground`, etc.

## Theme switching

The living style guide includes a light/dark theme toggle in the sidebar header.
Theme state is stored in `localStorage` under the key `ds-theme`.
The `.dark` class is toggled on `document.documentElement`.
In consuming apps, wire `next-themes` or an equivalent provider.

## Keep it template-ready

This design system is a prime candidate to be saved to the workspace as a reusable template.
Keep it self-contained: concrete dependency versions (never `catalog:`), standalone `tsconfig.json`
(never extends a workspace-relative base), and no imports from sibling artifacts or shared
`@workspace/*` libs. Generated files (`src/index.css`, `src/generated/tokens.tsx`) are committed
so the template carries a readable theme snapshot.

## Prototyping on the canvas

Use the mockup-sandbox skill's "Design systems" flow. It creates a sandbox entry
for `@workspace/opus-vo-design-system` and renders mockups using this package's
theme and components.

## Consuming this package

Never copy token values, component source, hooks, or these docs into a consuming
artifact. Add `@workspace/opus-vo-design-system` as a `workspace:*` dependency,
run `pnpm install`, and import directly from this package.

Read only the guides required by the current task:

- Building or styling web UI: `artifacts/opus-vo-design-system/docs/consuming-web.md`
- Building or styling Expo UI: `artifacts/opus-vo-design-system/docs/consuming-expo.md`
- Building or styling a slide deck: `artifacts/opus-vo-design-system/docs/consuming-slides.md`
- Replacing an existing or scaffolded web theme/component library: `artifacts/opus-vo-design-system/docs/migrating-web.md`
- Replacing existing or scaffolded Expo theme/hooks/components: `artifacts/opus-vo-design-system/docs/migrating-expo.md`

## Universal rules

- Match exact token values. Do not invent colors, fonts, spacing, or radii in a consuming app.
- Use `hierarchy` prop on Button, not the legacy `variant` prop, for new code.
- Keep product data, navigation, application state, and product-specific compositions in the app.
  Product-agnostic visual primitives belong here.
- Read these docs in place. Do not copy them into another artifact.
