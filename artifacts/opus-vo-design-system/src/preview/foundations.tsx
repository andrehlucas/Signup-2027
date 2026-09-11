/**
 * Opus VO Design System — foundation pages
 * Overview, Colors, Fonts, Layout — all driven by canonical tokens.
 */
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

// ─── Internal primitives (preview-only, not exported) ─────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </h2>
  );
}

function Swatch({ name, className, hex }: { name: string; className: string; hex?: string }) {
  return (
    <div className="space-y-2">
      <div className={`h-14 rounded-lg border border-black/5 ${className}`} />
      <p className="text-xs font-semibold">{name}</p>
      {hex && <p className="text-xs text-muted-foreground font-mono">{hex}</p>}
    </div>
  );
}

// ─── Semantic swatches ────────────────────────────────────────────────────

const SEMANTIC_SWATCHES = [
  { name: "Background",  className: "bg-background border",      hex: "light #ffffff" },
  { name: "Foreground",  className: "bg-foreground",             hex: "light #181d27" },
  { name: "Primary",     className: "bg-primary",                hex: "light #026aa2" },
  { name: "Secondary",   className: "bg-secondary border",       hex: "light #f5f5f5" },
  { name: "Accent",      className: "bg-accent",                 hex: "light #e0f2fe" },
  { name: "Muted",       className: "bg-muted",                  hex: "light #f5f5f5" },
  { name: "Border",      className: "bg-border",                 hex: "light #e9eaeb" },
  { name: "Destructive", className: "bg-destructive",            hex: "light #f04438" },
  { name: "Ring",        className: "bg-ring",                   hex: "light #7cd4fd" },
] as const;

// ─── Brand ramp swatches ──────────────────────────────────────────────────

const BRAND_SWATCHES = [
  { name: "brand-50",  className: "bg-brand-50",  hex: "#e0f2fe" },
  { name: "brand-100", className: "bg-brand-100", hex: "#b9e6fe" },
  { name: "brand-200", className: "bg-brand-200", hex: "#7cd4fd" },
  { name: "brand-300", className: "bg-brand-300", hex: "#36bffa" },
  { name: "brand-400", className: "bg-brand-400", hex: "#0ba5ec" },
  { name: "brand-500", className: "bg-brand-500", hex: "#0086c9" },
  { name: "brand-600", className: "bg-brand-600", hex: "#026aa2" },
  { name: "brand-700", className: "bg-brand-700", hex: "#065986" },
  { name: "brand-800", className: "bg-brand-800", hex: "#0b4a6f" },
  { name: "brand-900", className: "bg-brand-900", hex: "#062c41" },
] as const;

const SEMANTIC_STATUS = [
  { name: "Error 500",   className: "bg-error-500",   hex: "#f04438" },
  { name: "Warning 400", className: "bg-warning-400", hex: "#fdb022" },
  { name: "Success 500", className: "bg-success-500", hex: "#17b26a" },
] as const;

// ─── Type scale ───────────────────────────────────────────────────────────

const TYPE_SCALE = [
  { label: "Display",   className: "text-4xl font-bold",     sample: "Voice-first. Human-first." },
  { label: "Heading 1", className: "text-2xl font-semibold", sample: "Project dashboard" },
  { label: "Heading 2", className: "text-xl font-semibold",  sample: "Recent sessions" },
  { label: "Body",      className: "text-base",              sample: "Opus VO transcribes, translates, and routes voice data in real time." },
  { label: "Label",     className: "text-sm font-medium",    sample: "Session ID" },
  { label: "Caption",   className: "text-sm text-muted-foreground", sample: "Last updated 2 minutes ago" },
  { label: "Mono",      className: "text-sm font-mono",      sample: "sess_a1b2c3d4e5f6" },
] as const;

// ─── Spacing scale ────────────────────────────────────────────────────────

const SPACING_SCALE = [
  { label: "1", className: "w-1",  px: "4px" },
  { label: "2", className: "w-2",  px: "8px" },
  { label: "4", className: "w-4",  px: "16px" },
  { label: "6", className: "w-6",  px: "24px" },
  { label: "8", className: "w-8",  px: "32px" },
  { label: "12", className: "w-12", px: "48px" },
  { label: "16", className: "w-16", px: "64px" },
  { label: "24", className: "w-24", px: "96px" },
] as const;

// ─── Component status table ───────────────────────────────────────────────

const COMPONENT_STATUS = [
  { name: "Button",       status: "stable",   source: "Figma source-backed" },
  { name: "ButtonGroup",  status: "stable",   source: "Figma source-backed" },
  { name: "Badge",        status: "stable",   source: "Figma source-backed" },
  { name: "Input",        status: "planned",  source: "Figma designs available" },
  { name: "Select",       status: "planned",  source: "Figma designs available" },
  { name: "Dialog",       status: "planned",  source: "Figma designs available" },
  { name: "Toast",        status: "planned",  source: "Figma designs available" },
  { name: "Table",        status: "planned",  source: "Figma designs available" },
  { name: "Sidebar Nav",  status: "planned",  source: "Figma designs available" },
] as const;

const STATUS_COLOR: Record<string, Parameters<typeof Badge>[0]["color"]> = {
  stable:  "success",
  planned: "gray",
  alpha:   "warning",
};

// ─────────────────────────────────────────────────────────────────────────────
// Pages
// ─────────────────────────────────────────────────────────────────────────────

export function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* Identity */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground">
        <SectionHeading>System identity</SectionHeading>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Product</p>
            <p className="text-sm font-semibold">Opus VO</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Brand voice</p>
            <p className="text-sm font-semibold">Precise, practical, blue</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Token source</p>
            <p className="text-sm font-semibold">Figma — 1,105 variables</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Themes</p>
            <p className="text-sm font-semibold">Light + Dark</p>
          </div>
        </div>
      </section>

      {/* Brand palette summary */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground">
        <SectionHeading>Brand palette</SectionHeading>
        <p className="mt-1 text-sm text-muted-foreground">
          The Opus blue ramp drives primary, accent, sidebar, and focus-ring tokens across both themes.
        </p>
        <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10">
          {BRAND_SWATCHES.map((s) => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>
      </section>

      {/* Token coverage */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border bg-card p-6 text-card-foreground">
          <SectionHeading>Semantic roles</SectionHeading>
          <p className="mt-1 text-sm text-muted-foreground">
            Light/dark values sourced from Figma semantic modes.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {SEMANTIC_SWATCHES.slice(0, 6).map((s) => (
              <Swatch key={s.name} {...s} />
            ))}
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6 text-card-foreground">
          <SectionHeading>Typography sample</SectionHeading>
          <div className="mt-4 space-y-3">
            {TYPE_SCALE.slice(0, 5).map((e) => (
              <p key={e.label} className={e.className}>{e.sample}</p>
            ))}
          </div>
        </section>
      </div>

      {/* Components in use */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-4">
        <SectionHeading>Components in use</SectionHeading>
        <div className="flex flex-wrap items-center gap-3">
          <Button hierarchy="primary">Publish session</Button>
          <Button hierarchy="secondary">Cancel</Button>
          <Button hierarchy="tertiary">View details</Button>
          <Badge color="success" dot size="sm">Live</Badge>
          <Badge color="warning" size="sm">Draft</Badge>
          <Badge color="brand" variant="badge" size="sm">Beta</Badge>
          <Badge color="error" size="sm">Failed</Badge>
        </div>
      </section>

      {/* Component status */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground">
        <SectionHeading>Component status</SectionHeading>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Only source-backed components are shipped in this package.
          Planned components have Figma designs but no production implementation yet.
        </p>
        <div className="divide-y divide-border rounded-lg border">
          {COMPONENT_STATUS.map((c) => (
            <div key={c.name} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium">{c.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground hidden sm:inline">{c.source}</span>
                <Badge color={STATUS_COLOR[c.status]} size="sm">{c.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ColorsPage() {
  return (
    <div className="space-y-8">
      {/* Semantic roles */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-6">
        <div>
          <SectionHeading>Semantic surface roles</SectionHeading>
          <p className="mt-1 text-sm text-muted-foreground">
            Resolved from Figma semantic variable modes. Both light and dark values live in
            <code className="ml-1 text-xs bg-muted px-1 py-0.5 rounded">tokens.json</code>.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
          {SEMANTIC_SWATCHES.map((s) => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>
      </section>

      {/* Brand blue ramp */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-6">
        <div>
          <SectionHeading>Opus brand ramp — blue</SectionHeading>
          <p className="mt-1 text-sm text-muted-foreground">
            Figma Primitives/Colors/Brand. Emitted as{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">--color-brand-*</code> CSS custom
            properties. Use via Tailwind utility classes:
            <code className="ml-1 text-xs bg-muted px-1 py-0.5 rounded">bg-brand-600</code>,
            <code className="ml-1 text-xs bg-muted px-1 py-0.5 rounded">text-brand-700</code>, etc.
          </p>
        </div>
        <div className="grid grid-cols-5 gap-3 sm:grid-cols-10">
          {BRAND_SWATCHES.map((s) => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>
      </section>

      {/* Status colors */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-6">
        <div>
          <SectionHeading>Status ramps — error, warning, success</SectionHeading>
          <p className="mt-1 text-sm text-muted-foreground">
            Full 12-step ramps in tokens.json; emitted as{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">--color-error-*</code>,
            <code className="mx-1 text-xs bg-muted px-1 py-0.5 rounded">--color-warning-*</code>,
            <code className="text-xs bg-muted px-1 py-0.5 rounded">--color-success-*</code>.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {SEMANTIC_STATUS.map((s) => (
            <Swatch key={s.name} {...s} />
          ))}
          {[
            { name: "Success 200", className: "bg-success-200", hex: "#abefc6" },
            { name: "Warning 100", className: "bg-warning-100", hex: "#fef0c7" },
            { name: "Error 100",   className: "bg-error-100",   hex: "#fee4e2" },
          ].map((s) => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>
      </section>

      {/* Gray + gray-blue */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-4">
        <div>
          <SectionHeading>Neutral and gray-blue ramps</SectionHeading>
          <p className="mt-1 text-sm text-muted-foreground">
            12-step gray ramp (Figma Primitives/Colors/Gray light mode) and gray-blue ramp.
            Used for text, borders, and backgrounds.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {[
            { name: "gray-100", className: "bg-gray-100", hex: "#f5f5f5" },
            { name: "gray-200", className: "bg-gray-200", hex: "#e9eaeb" },
            { name: "gray-300", className: "bg-gray-300", hex: "#d5d7da" },
            { name: "gray-400", className: "bg-gray-400", hex: "#a4a7ae" },
            { name: "gray-500", className: "bg-gray-500", hex: "#717680" },
            { name: "gray-600", className: "bg-gray-600", hex: "#535862" },
            { name: "gray-700", className: "bg-gray-700", hex: "#414651" },
            { name: "gray-800", className: "bg-gray-800", hex: "#252b37" },
          ].map((s) => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>
      </section>

      {/* Theme switching note */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground">
        <SectionHeading>Light and dark mode</SectionHeading>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Toggle the theme using the button in the page header. Every semantic token resolves
          to distinct values for each mode. The{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">.dark</code> class on a parent
          element switches the mode — this is handled by{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">next-themes</code> in consuming apps.
          Primitive ramp values (brand-*, gray-*, etc.) remain constant across modes; only semantic
          roles change.
        </p>
      </section>
    </div>
  );
}

export function FontsPage() {
  return (
    <div className="space-y-8">
      {/* Primary typeface */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-4">
        <SectionHeading>Primary typeface — Inter</SectionHeading>
        <p className="text-4xl font-bold leading-tight">
          Voice-first interfaces demand clarity.
        </p>
        <p className="text-sm text-muted-foreground">
          Inter variable font. Loaded via non-blocking{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">&lt;link&gt;</code> in index.html.
          Tokens: <code className="text-xs bg-muted px-1 py-0.5 rounded">typography.fontFamily.sans</code>.
        </p>
      </section>

      {/* Type scale */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-6">
        <SectionHeading>Type scale</SectionHeading>
        {TYPE_SCALE.map((e) => (
          <div key={e.label} className="grid gap-1 sm:grid-cols-[100px_1fr] sm:gap-4">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground pt-0.5">
              {e.label}
            </span>
            <p className={e.className}>{e.sample}</p>
          </div>
        ))}
      </section>

      {/* Mono */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-3">
        <SectionHeading>Monospace — Menlo</SectionHeading>
        <p className="text-sm text-muted-foreground">
          For session IDs, token values, API keys, and code samples.
          Token: <code className="text-xs bg-muted px-1 py-0.5 rounded">typography.fontFamily.mono</code>.
        </p>
        <p className="font-mono text-base">sess_a1b2c3d4e5f6_opus</p>
        <p className="font-mono text-sm text-muted-foreground">--color-brand-600: #026aa2</p>
      </section>
    </div>
  );
}

export function LayoutPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Spacing */}
        <section className="rounded-xl border bg-card p-6 text-card-foreground">
          <h2 className="font-semibold">Spacing</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Base step: 0.25rem (4px). Tailwind's default scale.
            Token: <code className="text-xs bg-muted px-1 py-0.5 rounded">spacing.base</code>.
          </p>
          <div className="mt-6 space-y-4">
            {SPACING_SCALE.map((s) => (
              <div key={s.label} className="flex items-center gap-4">
                <span className="w-10 text-xs text-muted-foreground font-mono">{s.label}</span>
                <div className={`h-3 rounded-full bg-brand-600 ${s.className}`} />
                <span className="text-xs text-muted-foreground">{s.px}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Radius */}
        <section className="rounded-xl border bg-card p-6 text-card-foreground">
          <h2 className="font-semibold">Corner radius</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Base: 0.5rem (8px). sm/md/lg/xl derive from it.
            Token: <code className="text-xs bg-muted px-1 py-0.5 rounded">radius.base</code>.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[
              { label: "sm — 4px",  className: "rounded-sm" },
              { label: "md — 6px",  className: "rounded-md" },
              { label: "lg — 8px",  className: "rounded-lg" },
              { label: "xl — 12px", className: "rounded-xl" },
            ].map((r) => (
              <div
                key={r.label}
                className={`flex h-20 items-end border bg-brand-50 border-brand-200 p-3 ${r.className}`}
              >
                <span className="text-xs font-medium text-brand-700">{r.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Grid guidance */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-3">
        <h2 className="font-semibold">Responsive grid</h2>
        <p className="text-sm text-muted-foreground">
          Mobile-first. Single column below 768px. Standard breakpoints:
          sm (640px), md (768px), lg (1024px), xl (1280px).
          Use <code className="text-xs bg-muted px-1 py-0.5 rounded">min-h-[100dvh]</code> instead of{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">h-screen</code> for full-height layouts.
        </p>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {["col 1", "col 2", "col 3", "col 4"].map((c) => (
            <div key={c} className="rounded-md border border-dashed border-brand-300 bg-brand-25 p-4 text-center text-xs font-medium text-brand-700">
              {c}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
