/**
 * Opus VO — ButtonGroup stories
 * Covers: icon types, active/hover/focused/disabled states, mixed compositions.
 */
import { useState } from "react";
import { AlignCenter, AlignLeft, AlignRight, Grid2X2, LayoutList, Minus, Plus, Star } from "lucide-react";
import { ButtonGroup } from "../../components/ui/button-group";
import type { ButtonGroupItem } from "../../components/ui/button-group";
import { Guidelines, Row, Stack } from "../parts";

export function ButtonGroupDemo() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [align, setAlign] = useState<"left" | "center" | "right">("left");
  const [count, setCount] = useState(1);

  const viewItems: ButtonGroupItem[] = [
    { label: "List",  icon: <LayoutList />, iconType: "leading", current: view === "list",  onClick: () => setView("list") },
    { label: "Grid",  icon: <Grid2X2 />,   iconType: "leading", current: view === "grid",  onClick: () => setView("grid") },
  ];

  const alignItems: ButtonGroupItem[] = [
    { icon: <AlignLeft />,   iconType: "icon-only", current: align === "left",   onClick: () => setAlign("left"),   "aria-label": "Align left" },
    { icon: <AlignCenter />, iconType: "icon-only", current: align === "center", onClick: () => setAlign("center"), "aria-label": "Align center" },
    { icon: <AlignRight />,  iconType: "icon-only", current: align === "right",  onClick: () => setAlign("right"),  "aria-label": "Align right" },
  ];

  const counterItems: ButtonGroupItem[] = [
    { icon: <Minus />, iconType: "icon-only", onClick: () => setCount((c) => Math.max(0, c - 1)), "aria-label": "Decrease", disabled: count === 0 },
    { label: String(count), iconType: "none", current: false },
    { icon: <Plus />,  iconType: "icon-only", onClick: () => setCount((c) => c + 1), "aria-label": "Increase" },
  ];

  return (
    <div className="space-y-8">
      {/* ── Interactive examples ──────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-6">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Interactive examples</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Segmented controls with live state. Click segments to toggle.
          </p>
        </div>
        <Row label="View switcher">
          <ButtonGroup items={viewItems} />
          <span className="text-sm text-muted-foreground">Active: {view}</span>
        </Row>
        <Row label="Alignment (icon-only)">
          <ButtonGroup items={alignItems} />
          <span className="text-sm text-muted-foreground">Active: {align}</span>
        </Row>
        <Row label="Counter">
          <ButtonGroup items={counterItems} />
          <span className="text-sm text-muted-foreground">Count: {count}</span>
        </Row>
      </section>

      {/* ── Icon types ───────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-6">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Icon types</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Four icon-type configurations available per segment.
          </p>
        </div>
        <Row label="None — text only">
          <ButtonGroup items={[
            { label: "Monthly",  iconType: "none", current: true },
            { label: "Annual",   iconType: "none" },
            { label: "Lifetime", iconType: "none" },
          ]} />
        </Row>
        <Row label="Leading icon">
          <ButtonGroup items={[
            { label: "Overview", icon: <Grid2X2 />,  iconType: "leading", current: true },
            { label: "Starred",  icon: <Star />,     iconType: "leading" },
          ]} />
        </Row>
        <Row label="Dot indicator">
          <ButtonGroup items={[
            { label: "Active",   iconType: "dot", current: true },
            { label: "Draft",    iconType: "dot" },
            { label: "Archived", iconType: "dot" },
          ]} />
        </Row>
        <Row label="Icon only">
          <ButtonGroup items={alignItems} />
        </Row>
      </section>

      {/* ── States ───────────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-6">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">States</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Default, hover, focused, and disabled segment states.
          </p>
        </div>
        <Stack label="Default / current">
          <ButtonGroup items={[
            { label: "Selected", current: true },
            { label: "Unselected" },
            { label: "Unselected" },
          ]} />
        </Stack>
        <Stack label="Hover (forceState)">
          <ButtonGroup items={[
            { label: "Normal" },
            { label: "Hover", forceState: "hover" },
            { label: "Normal" },
          ]} />
        </Stack>
        <Stack label="Focused (forceState)">
          <ButtonGroup items={[
            { label: "Normal" },
            { label: "Focused", forceState: "focused" },
            { label: "Normal" },
          ]} />
        </Stack>
        <Stack label="Disabled segments">
          <ButtonGroup items={[
            { label: "Available", current: true },
            { label: "Unavailable", disabled: true },
            { label: "Available" },
          ]} />
        </Stack>
      </section>

      {/* ── Guidelines ───────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">Guidelines</h2>
        <Guidelines
          items={[
            { kind: "do",   text: "Use ButtonGroup for mutually exclusive filter or view-mode choices." },
            { kind: "do",   text: "Keep labels short (1–2 words) so segments stay scannable." },
            { kind: "do",   text: "Supply aria-label on icon-only segments for screen reader access." },
            { kind: "dont", text: "Use ButtonGroup for destructive or primary CTA actions — use Button." },
            { kind: "dont", text: "Mix icon-only and labelled segments in the same group without visual alignment." },
          ]}
        />
      </section>
    </div>
  );
}
