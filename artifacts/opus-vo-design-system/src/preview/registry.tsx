/**
 * Opus VO Design System — preview registry
 *
 * This file is the authoritative manifest for the living style guide.
 * Only source-backed Opus components are registered here. Generic scaffold
 * component families have been removed; their stories are not presented as
 * production Opus components.
 *
 * The three verified production component families shipped in this package:
 *   Button · ButtonGroup · Badge
 *
 * Upcoming families (designed in Figma, not yet implemented):
 *   Input · Select · Dialog · Toast · Table · Sidebar Nav
 *   → Documented in DESIGN.md; not registered here.
 *
 * All component pages are lazy-loaded so opening the preview does not
 * download every story upfront.
 */
import { lazy, type ComponentType } from "react";
import {
  ColorsPage,
  FontsPage,
  LayoutPage,
  OverviewPage,
} from "./foundations";

function lazyPage(load: () => Promise<ComponentType>) {
  return lazy(async () => ({ default: await load() }));
}

// ─── Lazy component stories (Opus source-backed only) ─────────────────────

const ButtonDemo = lazyPage(() =>
  import("./demos/button").then(({ ButtonDemo }) => ButtonDemo),
);

const ButtonGroupDemo = lazyPage(() =>
  import("./demos/button-group").then(({ ButtonGroupDemo }) => ButtonGroupDemo),
);

const BadgeDemo = lazyPage(() =>
  import("./demos/badge").then(({ BadgeDemo }) => BadgeDemo),
);

// ─── Types ────────────────────────────────────────────────────────────────

export type PreviewEntry = {
  /**
   * Globally unique across every group — it is the deep-link slug
   * (`#page=<id>`) and the active-page key.
   */
  id: string;
  name: string;
  description: string;
  Page: ComponentType;
};

export type NavGroup = {
  name: string;
  entries: PreviewEntry[];
};

// ─── System metadata ──────────────────────────────────────────────────────

export const DESIGN_SYSTEM = {
  title: "Opus VO Design System",
  description:
    "The canonical visual language for Opus VO product teams. Source-backed from Figma — precise, practical, and implementation-ready.",
} as const;

export const OVERVIEW_ENTRY: PreviewEntry = {
  id: "overview",
  name: "Overview",
  description:
    "System identity, brand palette, token coverage, component status, and live theme switching.",
  Page: OverviewPage,
};

// ─── Navigation groups ────────────────────────────────────────────────────

export const NAV_GROUPS: NavGroup[] = [
  {
    name: "Colors",
    entries: [
      {
        id: "color-roles",
        name: "Color roles",
        description:
          "Semantic roles, the Opus blue brand ramp, status ramps, and neutral grays — light and dark.",
        Page: ColorsPage,
      },
    ],
  },
  {
    name: "Typography",
    entries: [
      {
        id: "type-scale",
        name: "Type scale",
        description:
          "Inter variable font, heading/body/label/caption scale, and monospace usage.",
        Page: FontsPage,
      },
    ],
  },
  {
    name: "Layout",
    entries: [
      {
        id: "spacing-radius",
        name: "Spacing and radius",
        description:
          "The 4px base spacing step, the 8px base radius, and responsive grid guidance.",
        Page: LayoutPage,
      },
    ],
  },
  {
    name: "Actions",
    entries: [
      {
        id: "button",
        name: "Button",
        description:
          "Five hierarchies (primary / secondary / tertiary / link-color / link-gray), five sizes, icon slots, loading, and all interaction states.",
        Page: ButtonDemo,
      },
      {
        id: "button-group",
        name: "Button group",
        description:
          "Segmented controls with none / leading / dot / icon-only icon types and active, hover, focused, and disabled segment states.",
        Page: ButtonGroupDemo,
      },
    ],
  },
  {
    name: "Labels",
    entries: [
      {
        id: "badge",
        name: "Badge",
        description:
          "Pill, badge, and modern shape variants across 12 Figma-sourced colors in two sizes, with dot, leadingIcon, and dismiss slots.",
        Page: BadgeDemo,
      },
    ],
  },
];

// ─── Flat list and duplicate guard ────────────────────────────────────────

export const ALL_ENTRIES: PreviewEntry[] = [
  OVERVIEW_ENTRY,
  ...NAV_GROUPS.flatMap((group) => group.entries),
];

const duplicateIds = ALL_ENTRIES.map((entry) => entry.id).filter(
  (id, index, ids) => ids.indexOf(id) !== index,
);

if (duplicateIds.length > 0) {
  throw new Error(
    `Duplicate preview page id(s): ${[...new Set(duplicateIds)].join(
      ", ",
    )}. Every page id must be unique across all nav groups.`,
  );
}
