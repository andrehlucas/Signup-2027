/**
 * Opus VO — ButtonGroup (segmented control)
 *
 * Source-backed from artifacts/figma-design/client/src/components/ButtonGroup.tsx.
 * Adapted to this package's consumer-safe exports and canonical Opus tokens.
 *
 * Renders a connected row of button segments inside a single bordered container.
 * Use for tab-like navigation, filter toggles, view switchers, or date-range pickers.
 *
 * Icon types per segment:
 *   "none"      — text label only
 *   "leading"   — icon placed before the label
 *   "dot"       — success dot indicator before the label
 *   "icon-only" — square button containing only the icon
 *
 * Token alignment:
 *   Border  → border-gray-300   (--color-gray-300)
 *   Divider → border-gray-300
 *   BG      → bg-white
 *   Hover   → bg-gray-50
 *   Active  → bg-gray-50 text-gray-700
 *   Text    → text-gray-600/700
 *   Focus   → ring-brand-100    (--color-brand-100)
 *   Shadow  → var(--shadow-xs-skeuomorphic)
 */
import * as React from "react";

import { cn } from "../../lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────

export type ButtonGroupIconType = "none" | "leading" | "dot" | "icon-only";
export type ButtonGroupItemState = "default" | "hover" | "focused" | "disabled";

export interface ButtonGroupItem {
  /** Visible label text. Not used when iconType is "icon-only". */
  label?: string;
  /** Icon node — used as leading icon or sole content for "icon-only". */
  icon?: React.ReactNode;
  /** Which icon variant to render. Default: "none". */
  iconType?: ButtonGroupIconType;
  /** Whether this item is the active/selected segment. */
  current?: boolean;
  /**
   * Force a visual state for design system showcase.
   * In production use native :hover/:focus-visible/:disabled instead.
   */
  forceState?: ButtonGroupItemState;
  onClick?: () => void;
  disabled?: boolean;
  /** Accessible label — required when iconType is "icon-only". */
  "aria-label"?: string;
}

export interface ButtonGroupProps {
  items: ButtonGroupItem[];
  className?: string;
}

// ─── Dot ───────────────────────────────────────────────────────────────────

function Dot({ disabled }: { disabled?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn("w-2 h-2 rounded-full flex-shrink-0", disabled ? "bg-gray-300" : "bg-success-500")}
    />
  );
}

// ─── Segment ───────────────────────────────────────────────────────────────

function Segment({
  item,
  isFirst,
  isLast,
}: {
  item: ButtonGroupItem;
  isFirst: boolean;
  isLast: boolean;
}) {
  const {
    label,
    icon,
    iconType = "none",
    current = false,
    forceState,
    disabled,
  } = item;

  const isDisabled = disabled || forceState === "disabled";
  const isHover    = forceState === "hover";
  const isFocused  = forceState === "focused";

  const bgClass   = current || isHover ? "bg-gray-50" : "bg-white";
  const textClass = isDisabled ? "text-gray-300" : current ? "text-gray-700" : "text-gray-600";
  const ringClass = isFocused ? "ring-4 ring-brand-100 z-10 outline-none" : "";
  const widthClass = iconType === "icon-only" ? "w-10 px-0" : "px-4";

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={item.onClick}
      aria-label={item["aria-label"]}
      aria-pressed={current}
      className={cn(
        "relative flex items-center justify-center h-10 gap-1.5 transition-colors duration-100",
        "text-sm font-semibold select-none whitespace-nowrap",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 focus-visible:z-10",
        "disabled:cursor-not-allowed",
        // Rounded corners only on first/last
        isFirst && "rounded-l-xl",
        isLast  && "rounded-r-xl",
        // Right divider — always present except on the last segment
        !isLast && "border-r border-gray-300",
        widthClass,
        bgClass,
        textClass,
        ringClass,
      )}
    >
      {/* Leading icon */}
      {iconType === "leading" && icon && (
        <span className={cn("flex-shrink-0 w-4 h-4", isDisabled ? "text-gray-300" : "text-gray-400")} aria-hidden="true">
          {icon}
        </span>
      )}

      {/* Dot indicator */}
      {iconType === "dot" && <Dot disabled={isDisabled} />}

      {/* Icon-only */}
      {iconType === "icon-only" && icon && (
        <span className={cn("flex-shrink-0 w-4 h-4", isDisabled ? "text-gray-300" : "text-gray-500")} aria-hidden="true">
          {icon}
        </span>
      )}

      {/* Label (not shown for icon-only) */}
      {iconType !== "icon-only" && label && <span>{label}</span>}
    </button>
  );
}

// ─── ButtonGroup ────────────────────────────────────────────────────────────

export function ButtonGroup({ items, className }: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={cn(
        "inline-flex items-stretch border border-gray-300 rounded-xl bg-white overflow-hidden",
        className,
      )}
      style={{ boxShadow: "var(--shadow-xs-skeuomorphic)" }}
    >
      {items.map((item, i) => (
        <Segment
          key={i}
          item={item}
          isFirst={i === 0}
          isLast={i === items.length - 1}
        />
      ))}
    </div>
  );
}
