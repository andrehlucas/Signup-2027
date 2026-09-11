/**
 * Opus VO — Badge
 *
 * Source-backed from artifacts/figma-design/client/src/components/Badge.tsx.
 * Adapted to this package's consumer-safe exports and canonical Opus tokens.
 *
 * Three shape variants:
 *   "pill"   — fully rounded; status tags, loose labels
 *   "badge"  — small-radius rectangle; counts, tight containers
 *   "modern" — white bg + gray border + shadow; neutral, works on any surface
 *
 * Twelve colors from the Figma utility palette:
 *   gray · brand · error · warning · success ·
 *   gray-blue · blue-light · indigo · purple · blue · pink · orange
 *
 * Semantic colors (error/warning/success/gray) reference the Opus primitive
 * ramps emitted into src/index.css by scripts/build-tokens.mjs.
 * Extended palette colors (indigo/purple/blue/pink/orange) use inline hex
 * matching Figma component-colors/utility values — these are not yet in tokens.
 */
import * as React from "react";

import { cn } from "../../lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────

export type BadgeColor =
  | "gray"
  | "brand"
  | "error"
  | "warning"
  | "success"
  | "gray-blue"
  | "blue-light"
  | "indigo"
  | "purple"
  | "blue"
  | "pink"
  | "orange";

export type BadgeSize    = "sm" | "md";
export type BadgeVariant = "pill" | "badge" | "modern";

export interface BadgeProps {
  children: React.ReactNode;
  color?:       BadgeColor;
  size?:        BadgeSize;
  variant?:     BadgeVariant;
  /** Show a colored dot before the label */
  dot?:         boolean;
  /** Show an icon node before the label (takes precedence over dot) */
  leadingIcon?: React.ReactNode;
  /** Show a dismiss button after the label */
  onClose?:     () => void;
  className?:   string;
}

// ─── Color palette ─────────────────────────────────────────────────────────
// Semantic colors use Tailwind token classes that map to Opus primitive ramps.
// Extended palette colors reference Figma-defined hex values directly.

type ColorConfig = { bg: string; border: string; text: string; dot: string };

const COLOR_MAP: Record<BadgeColor, ColorConfig> = {
  // Semantic — use Opus primitive ramp token utilities
  gray:        { bg: "bg-gray-50",    border: "border-gray-200",   text: "text-gray-700",   dot: "bg-gray-400"    },
  brand:       { bg: "bg-brand-50",   border: "border-brand-200",  text: "text-brand-700",  dot: "bg-brand-600"   },
  error:       { bg: "bg-error-50",   border: "border-error-200",  text: "text-error-700",  dot: "bg-error-500"   },
  warning:     { bg: "bg-warning-50", border: "border-warning-200",text: "text-warning-700",dot: "bg-warning-400" },
  success:     { bg: "bg-success-50", border: "border-success-200",text: "text-success-700",dot: "bg-success-500" },
  // Extended palette — Figma component-colors/utility hex
  "gray-blue": { bg: "bg-gray-blue-50", border: "border-gray-blue-200", text: "text-gray-blue-700", dot: "bg-gray-blue-700" },
  "blue-light": { bg: "bg-brand-50",  border: "border-brand-100",  text: "text-brand-600",  dot: "bg-brand-500"   },
  indigo:      { bg: "bg-[#eef4ff]",  border: "border-[#c7d7fe]",  text: "text-[#3538cd]",  dot: "bg-[#3538cd]"   },
  purple:      { bg: "bg-[#f4f3ff]",  border: "border-[#d9d6fe]",  text: "text-[#5925dc]",  dot: "bg-[#5925dc]"   },
  blue:        { bg: "bg-[#eff8ff]",  border: "border-[#b2ddff]",  text: "text-[#175cd3]",  dot: "bg-[#175cd3]"   },
  pink:        { bg: "bg-[#fdf2fa]",  border: "border-[#fcceee]",  text: "text-[#c11574]",  dot: "bg-[#c11574]"   },
  orange:      { bg: "bg-[#fef6ee]",  border: "border-[#f9dbaf]",  text: "text-[#b93815]",  dot: "bg-[#b93815]"   },
};

// ─── Size scale ────────────────────────────────────────────────────────────

const SIZE_MAP: Record<BadgeSize, {
  text: string;
  dotSize: string;
  iconSize: string;
  closeSize: string;
  pillPx: string;
  badgePx: string;
  py: string;
}> = {
  sm: {
    text: "text-xs font-medium leading-[18px]",
    dotSize: "w-1.5 h-1.5",
    iconSize: "w-3 h-3",
    closeSize: "w-3 h-3",
    pillPx: "px-2",
    badgePx: "px-1.5",
    py: "py-0.5",
  },
  md: {
    text: "text-sm font-medium leading-5",
    dotSize: "w-2 h-2",
    iconSize: "w-3.5 h-3.5",
    closeSize: "w-3.5 h-3.5",
    pillPx: "px-2.5",
    badgePx: "px-2",
    py: "py-1",
  },
};

// ─── Close icon ────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <path d="M9 3L3 9M3 3l6 6" />
    </svg>
  );
}

// ─── Badge ─────────────────────────────────────────────────────────────────

export function Badge({
  children,
  color   = "gray",
  size    = "sm",
  variant = "pill",
  dot     = false,
  leadingIcon,
  onClose,
  className,
}: BadgeProps) {
  const colors = COLOR_MAP[color];
  const sz     = SIZE_MAP[size];

  let shapeClass: string;
  let bgClass: string;
  let borderClass: string;
  let textClass: string;
  let shadowStyle: React.CSSProperties = {};
  let px: string;

  if (variant === "modern") {
    shapeClass  = "rounded-md";
    bgClass     = "bg-white";
    borderClass = "border border-gray-300";
    textClass   = colors.text;
    shadowStyle = { boxShadow: "var(--shadow-xs)" };
    px          = sz.badgePx;
  } else if (variant === "badge") {
    shapeClass  = "rounded-md";
    bgClass     = colors.bg;
    borderClass = `border ${colors.border}`;
    textClass   = colors.text;
    px          = sz.badgePx;
  } else {
    // pill
    shapeClass  = "rounded-full";
    bgClass     = colors.bg;
    borderClass = `border ${colors.border}`;
    textClass   = colors.text;
    px          = sz.pillPx;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap select-none",
        shapeClass, bgClass, borderClass, textClass, sz.text, sz.py, px,
        className,
      )}
      style={shadowStyle}
    >
      {leadingIcon ? (
        <span className={cn("flex-shrink-0 flex items-center justify-center", sz.iconSize)} aria-hidden="true">
          {leadingIcon}
        </span>
      ) : dot ? (
        <span className={cn("flex-shrink-0 rounded-full", sz.dotSize, colors.dot)} aria-hidden="true" />
      ) : null}

      <span>{children}</span>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={cn("flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity -mr-0.5 cursor-pointer", sz.closeSize)}
          aria-label="Remove"
        >
          <CloseIcon />
        </button>
      )}
    </span>
  );
}

export default Badge;
