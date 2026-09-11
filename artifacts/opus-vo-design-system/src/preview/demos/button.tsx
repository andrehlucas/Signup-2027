/**
 * Opus VO — Button stories
 * Covers: all 5 hierarchies, all 5 sizes, icon slots, states, loading, iconOnly.
 */
import { ArrowRight, ChevronDown, Plus, Search, Settings } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Guidelines, Row, Stack } from "../parts";

export function ButtonDemo() {
  return (
    <div className="space-y-8">
      {/* ── Hierarchies ─────────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-6">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Hierarchies</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Five hierarchy levels encode visual weight and action priority.
          </p>
        </div>
        <Row label="Primary — main CTA, one per view">
          <Button hierarchy="primary">Create project</Button>
        </Row>
        <Row label="Secondary — supporting actions alongside primary">
          <Button hierarchy="secondary">Cancel</Button>
          <Button hierarchy="secondary" leadingIcon={<Settings />}>Settings</Button>
        </Row>
        <Row label="Tertiary — low-emphasis actions in toolbars">
          <Button hierarchy="tertiary">View details</Button>
          <Button hierarchy="tertiary" leadingIcon={<Plus />}>Add member</Button>
        </Row>
        <Row label="Link color — inline navigational links">
          <Button hierarchy="link-color">Learn more</Button>
          <Button hierarchy="link-color" trailingIcon={<ArrowRight />}>Read the docs</Button>
        </Row>
        <Row label="Link gray — secondary inline links">
          <Button hierarchy="link-gray">Skip for now</Button>
          <Button hierarchy="link-gray" trailingIcon={<ArrowRight />}>See all results</Button>
        </Row>
      </section>

      {/* ── Sizes ──────────────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-6">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sizes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Five sizes — sm through 2xl — cover dense UIs to prominent CTAs.
          </p>
        </div>
        <Row label="Primary">
          <Button hierarchy="primary" size="sm">Small</Button>
          <Button hierarchy="primary" size="md">Medium</Button>
          <Button hierarchy="primary" size="lg">Large</Button>
          <Button hierarchy="primary" size="xl">X-Large</Button>
          <Button hierarchy="primary" size="2xl">2X-Large</Button>
        </Row>
        <Row label="Secondary">
          <Button hierarchy="secondary" size="sm">Small</Button>
          <Button hierarchy="secondary" size="md">Medium</Button>
          <Button hierarchy="secondary" size="lg">Large</Button>
          <Button hierarchy="secondary" size="xl">X-Large</Button>
          <Button hierarchy="secondary" size="2xl">2X-Large</Button>
        </Row>
      </section>

      {/* ── Icon slots ─────────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-6">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Icon slots</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Leading icon, trailing icon, and icon-only square variants.
          </p>
        </div>
        <Row label="Leading icon">
          <Button hierarchy="primary" leadingIcon={<Plus />}>Add item</Button>
          <Button hierarchy="secondary" leadingIcon={<Search />}>Search</Button>
          <Button hierarchy="tertiary" leadingIcon={<Settings />}>Configure</Button>
        </Row>
        <Row label="Trailing icon">
          <Button hierarchy="primary" trailingIcon={<ArrowRight />}>Continue</Button>
          <Button hierarchy="secondary" trailingIcon={<ChevronDown />}>Options</Button>
        </Row>
        <Row label="Icon only (sm, md, lg)">
          <Button hierarchy="primary" iconOnly size="sm" leadingIcon={<Plus />} aria-label="Add" />
          <Button hierarchy="primary" iconOnly size="md" leadingIcon={<Plus />} aria-label="Add" />
          <Button hierarchy="primary" iconOnly size="lg" leadingIcon={<Plus />} aria-label="Add" />
          <Button hierarchy="secondary" iconOnly size="md" leadingIcon={<Settings />} aria-label="Settings" />
          <Button hierarchy="tertiary" iconOnly size="md" leadingIcon={<Search />} aria-label="Search" />
        </Row>
      </section>

      {/* ── States ─────────────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground space-y-6">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">States</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Default, focused, disabled, and loading. Use <code className="text-xs bg-muted px-1 py-0.5 rounded">forceState</code> in
            showcase; rely on native pseudo-classes in production.
          </p>
        </div>
        <Row label="Default">
          <Button hierarchy="primary">Primary</Button>
          <Button hierarchy="secondary">Secondary</Button>
          <Button hierarchy="tertiary">Tertiary</Button>
        </Row>
        <Row label="Focused (forceState)">
          <Button hierarchy="primary" forceState="focused">Primary</Button>
          <Button hierarchy="secondary" forceState="focused">Secondary</Button>
          <Button hierarchy="tertiary" forceState="focused">Tertiary</Button>
        </Row>
        <Row label="Disabled">
          <Button hierarchy="primary" disabled>Primary</Button>
          <Button hierarchy="secondary" disabled>Secondary</Button>
          <Button hierarchy="tertiary" disabled>Tertiary</Button>
          <Button hierarchy="link-color" disabled>Link</Button>
        </Row>
        <Row label="Loading">
          <Button hierarchy="primary" loading>Creating...</Button>
          <Button hierarchy="secondary" loading>Saving...</Button>
          <Button hierarchy="primary" iconOnly loading size="md" aria-label="Loading" />
        </Row>
      </section>

      {/* ── Guidelines ─────────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-6 text-card-foreground">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">Guidelines</h2>
        <Guidelines
          items={[
            { kind: "do",   text: "Use primary for the one highest-priority action per view." },
            { kind: "do",   text: "Use secondary for supporting actions adjacent to a primary button." },
            { kind: "do",   text: "Use tertiary or link variants in toolbars, tables, and inline text." },
            { kind: "do",   text: "Add aria-label to icon-only buttons so they are accessible." },
            { kind: "dont", text: "Place two primary buttons side by side — it creates ambiguity." },
            { kind: "dont", text: "Use destructive hierarchy unless a button removes data permanently." },
            { kind: "dont", text: "Override brand colors with arbitrary hex — use hierarchy variants instead." },
          ]}
        />
      </section>
    </div>
  );
}
