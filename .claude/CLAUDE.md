# CLAUDE

Project-specific guidance for AI coding agents.

<!-- ASTRYX:START -->
Astryx v0.7.14 · 174 components
CLI: run every command as `npx astryx <cmd>` (shown below as `astryx ...`).

SETUP (once, in app entry e.g. main.tsx) — without these, components render unstyled:
  import "@astryxdesign/core/reset.css";
  import "@astryxdesign/core/astryx.css";

WORKFLOW — start every page from a template, never from scratch:
1. `astryx build "<idea>"` — names the template to scaffold from and the parts it lacks.
2. `astryx template <name> <path>` — scaffold it; keep its frame, gap and padding; replace the content.
3. `astryx template <Block>` for parts it lacks; `astryx component <Name>` to read props before using one.
Changing an existing page? Keep it: skip step 2 and add blocks/components inside its sections.
Before you deliver a build, run `astryx doctor --built <dir>`; don't deliver it if it fails.

RULES:
- No <div> — components handle all layout and spacing.
- Read `astryx docs layout` before changing a template's frame.
- Dense data = rows (Table, List/Item), not Card-wrapped lists. Badge = counts only.
- Style with component props first, then Tailwind utilities backed by tokens. No raw hex/px.
- Palettes and custom colors go through the theme, never :root overrides. Run `astryx theme add <slug>` to import; `theme eject <slug>` only forks source. See `astryx docs theme`.
- SELF-CHECK: re-read the file; replace any style={{…}}, raw <div>/<span>, imported .css/@apply, or hardcoded/arbitrary value (bg-[#fff], p-[13px]) with the component or a token-backed utility.

`astryx help` lists every command. Key ones beyond the workflow:
  search "<query>"   find any component / hook / doc / template
  discover <words>   integrations you could add
  docs <topic>       getting-started, principles, tokens, theme … (`astryx docs` lists all)
  docs cli           commands and API reference
  docs authoring     build an integration package, and every field it holds
  upgrade --from <old version> --apply   run after a dependency bump
<!-- ASTRYX:END -->

## This project's Astryx setup (read before the Astryx rules above)

- **Already set up.** Do not add the CSS imports from SETUP above to an entry file.
  - `app/layers.css` declares the cascade layer order and is imported first by `app/layout.tsx`.
  - `app/globals.css` imports the Astryx reset, components and the Opus theme CSS.
  - `app/providers.tsx` wraps the app in `<Theme theme={opusTheme} mode="light">` and a `LinkProvider` that uses `next/link`.
- **Theme is Opus** (`app/themes/opus/opusTheme.ts`, extends the neutral theme with DESIGN.md values).
  - Change brand colours, type, radius or control sizes there, never with `:root` overrides.
  - After editing it, rebuild the CSS/JS the app loads: `npx astryx theme build app/themes/opus/opusTheme.ts`. Never edit `opus.css` or `opus.js` by hand.
  - It is light-only: colours are single values. Add `[light, dark]` tuples before enabling dark mode.
- **Tailwind is v3, not v4.** Astryx's Tailwind bridge (`tailwind-theme.css`) is not installed.
  - Class names such as `text-primary`, `bg-card`, `border-border`, `rounded-lg` and `shadow-sm` are the app's existing Tailwind theme colours, not Astryx tokens.
  - In redesigned UI, style with Astryx component props first.
  - When a prop can't do it, reference the Astryx token directly, for example `bg-[var(--color-background-surface)]` or `rounded-[var(--radius-container)]`, rather than a legacy Tailwind colour.
- **Cascade order** (lowest to highest): `reset` → `tw-base` (Tailwind preflight) → `astryx-base` → `astryx-theme` → unlayered Tailwind utilities.
  - Tailwind utilities in `className` can override Astryx components.
  - Keep `@tailwind base` inside `@layer tw-base` in `globals.css`. If it is unlayered, Tailwind's reset overrides Astryx components.
- **Text elements.** The signup flow is fully on Astryx, and the theme styles bare `<p>`, `<h1>`–`<h6>` and `<small>`. Use Astryx `Text` and `Heading` rather than bare tags.
- **Remaining shadcn/Tailwind UI.** Only `/admin/analytics` (button, card, chart), the toast system (`toast`, `toaster`, `use-toast`) and the `input` under `ContactPhoneInput` still use `app/components/ui/`. Prefer Astryx for anything new.
- **Sandbox.** `/astryx-sandbox` (`app/astryx-sandbox/page.tsx`) is a scratch page for trying components.
