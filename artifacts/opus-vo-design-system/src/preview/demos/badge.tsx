/**
 * Opus VO — Badge stories
 * Covers: 3 variants, 12 colors, 2 sizes, dot, leadingIcon, onClose, real-world usage.
 */
import { useState } from "react";
import { Check, Clock, Zap } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import type { BadgeColor } from "../../components/ui/badge";
import { Guidelines, Row, Stack } from "../parts";

const ALL_COLORS: BadgeColor[] = [
  "gray", "brand", "error", "warning", "success",
  "gray-blue", "blue-light", "indigo", "purple", "blue", "pink", "orange",
];

export function BadgeDemo() {
  const [tags, setTags] = useState<string[]>(["Design system", "Tokens", "Components"]);

  return (
    <div className="space-y-8">
      {/* ── Variants ─────────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-6">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Variants</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pill, badge, and modern shapes — each with consistent padding and radius.
          </p>
        </div>
        <Row label="Pill (default) — status and loose labels">
          <Badge variant="pill" color="brand">Live</Badge>
          <Badge variant="pill" color="success">Published</Badge>
          <Badge variant="pill" color="warning">Draft</Badge>
          <Badge variant="pill" color="error">Failed</Badge>
          <Badge variant="pill" color="gray">Archived</Badge>
        </Row>
        <Row label="Badge — counts and tight containers">
          <Badge variant="badge" color="brand">New</Badge>
          <Badge variant="badge" color="success">Published</Badge>
          <Badge variant="badge" color="warning">Pending</Badge>
          <Badge variant="badge" color="error">Error</Badge>
          <Badge variant="badge" color="gray">Default</Badge>
        </Row>
        <Row label="Modern — neutral, works on any surface">
          <Badge variant="modern" color="brand">Brand</Badge>
          <Badge variant="modern" color="success">Success</Badge>
          <Badge variant="modern" color="warning">Warning</Badge>
          <Badge variant="modern" color="error">Error</Badge>
          <Badge variant="modern" color="gray">Gray</Badge>
        </Row>
      </section>

      {/* ── All 12 colors ────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-6">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">All 12 colors</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The full Figma utility palette. Semantic colors (gray, brand, error, warning, success)
            use Opus primitive ramp tokens. Extended colors use Figma-defined hex.
          </p>
        </div>
        <Stack label="Pill">
          <div className="flex flex-wrap gap-2">
            {ALL_COLORS.map((color) => (
              <Badge key={color} variant="pill" color={color}>{color}</Badge>
            ))}
          </div>
        </Stack>
        <Stack label="Badge">
          <div className="flex flex-wrap gap-2">
            {ALL_COLORS.map((color) => (
              <Badge key={color} variant="badge" color={color}>{color}</Badge>
            ))}
          </div>
        </Stack>
        <Stack label="Modern">
          <div className="flex flex-wrap gap-2">
            {ALL_COLORS.map((color) => (
              <Badge key={color} variant="modern" color={color}>{color}</Badge>
            ))}
          </div>
        </Stack>
      </section>

      {/* ── Sizes ────────────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-6">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sizes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Small (default) for dense lists and tables. Medium for prominent labels.
          </p>
        </div>
        <Row label="Small (sm) — text-xs, py-0.5">
          <Badge size="sm" color="brand">Small</Badge>
          <Badge size="sm" color="success">Published</Badge>
          <Badge size="sm" color="gray">Archived</Badge>
        </Row>
        <Row label="Medium (md) — text-sm, py-1">
          <Badge size="md" color="brand">Medium</Badge>
          <Badge size="md" color="success">Published</Badge>
          <Badge size="md" color="gray">Archived</Badge>
        </Row>
      </section>

      {/* ── Slots ────────────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-6">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Slots</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Dot, leadingIcon, and dismiss (onClose) slots.
          </p>
        </div>
        <Row label="Dot indicator">
          <Badge color="success" dot>Active</Badge>
          <Badge color="warning" dot>Processing</Badge>
          <Badge color="error" dot>Failed</Badge>
          <Badge color="gray" dot>Inactive</Badge>
        </Row>
        <Row label="Leading icon">
          <Badge color="success" leadingIcon={<Check size={12} />}>Verified</Badge>
          <Badge color="warning" leadingIcon={<Clock size={12} />}>Pending</Badge>
          <Badge color="brand" leadingIcon={<Zap size={12} />}>Beta</Badge>
        </Row>
        <Row label="Dismiss (onClose)">
          {tags.map((tag) => (
            <Badge
              key={tag}
              color="brand"
              variant="pill"
              onClose={() => setTags((prev) => prev.filter((t) => t !== tag))}
            >
              {tag}
            </Badge>
          ))}
          {tags.length === 0 && (
            <span className="text-sm text-muted-foreground">All tags removed. Refresh to reset.</span>
          )}
        </Row>
        <Row label="Dot + size=md">
          <Badge size="md" color="success" dot>Live</Badge>
          <Badge size="md" color="brand" dot>Beta</Badge>
          <Badge size="md" color="gray" dot>Draft</Badge>
        </Row>
      </section>

      {/* ── Usage example ─────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-4">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Usage example</h2>
          <p className="mt-1 text-sm text-muted-foreground">Badges in a realistic table row context.</p>
        </div>
        <div className="divide-y divide-border rounded-lg border">
          {[
            { name: "Voice assistant integration", status: "success" as const, label: "Published", env: "Production" },
            { name: "Multi-language support",      status: "warning" as const, label: "In review",  env: "Staging" },
            { name: "Real-time transcription v2",  status: "brand"   as const, label: "Beta",       env: "Preview" },
            { name: "Offline mode",                status: "gray"    as const, label: "Planned",    env: "—" },
          ].map((row) => (
            <div key={row.name} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium">{row.name}</span>
              <div className="flex items-center gap-3">
                <Badge color={row.status} dot size="sm">{row.label}</Badge>
                <Badge color="gray-blue" variant="badge" size="sm">{row.env}</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Guidelines ─────────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">Guidelines</h2>
        <Guidelines
          items={[
            { kind: "do",   text: "Use success/warning/error colors to communicate status semantically." },
            { kind: "do",   text: "Use dot or leadingIcon to reinforce status — not instead of the label." },
            { kind: "do",   text: "Keep badge text to 1–2 words so it stays scannable." },
            { kind: "dont", text: "Use a badge as a button — it has no interaction affordance." },
            { kind: "dont", text: "Mix pill and badge variants within the same list or table column." },
            { kind: "dont", text: "Apply the brand color to indicate a negative or destructive state." },
          ]}
        />
      </section>
    </div>
  );
}
