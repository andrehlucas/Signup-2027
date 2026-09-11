/**
 * Opus VO — Button
 *
 * Source-backed from artifacts/figma-design/client/src/components/Button.tsx.
 * Adapted to this package's consumer-safe exports and canonical Opus tokens.
 *
 * Hierarchies: primary | secondary | tertiary | link-color | link-gray
 * Sizes: sm | md | lg | xl | 2xl
 * States: default | hover | focused | disabled | loading (via `forceState`)
 * Icon slots: leadingIcon, trailingIcon, iconOnly
 *
 * Backward-compatible `variant` and legacy sizes are provided so scaffold
 * demos and ui/ components that have not yet been migrated continue to
 * typecheck. New code should use `hierarchy` and the 5-step size scale.
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

// ─── Opus types ────────────────────────────────────────────────────────────

export type ButtonHierarchy =
  | "primary"
  | "secondary"
  | "tertiary"
  | "link-color"
  | "link-gray";

export type ButtonSize = "sm" | "md" | "lg" | "xl" | "2xl";
export type ButtonState = "default" | "hover" | "focused" | "disabled" | "loading";

// ─── Spinner ───────────────────────────────────────────────────────────────

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
      <path className="opacity-75" fill="currentColor" d="M10 2a8 8 0 018 8h-2a6 6 0 00-6-6V2z" />
    </svg>
  );
}

// ─── Size scale ────────────────────────────────────────────────────────────

const SIZE: Record<ButtonSize, { base: string; icon: string; iconOnly: string; spinner: string }> = {
  sm:    { base: "h-9  px-3.5 gap-1.5 text-sm  rounded-lg", icon: "w-4 h-4", iconOnly: "h-9  w-9  rounded-lg", spinner: "w-4 h-4" },
  md:    { base: "h-10 px-4   gap-1.5 text-sm  rounded-lg", icon: "w-4 h-4", iconOnly: "h-10 w-10 rounded-lg", spinner: "w-4 h-4" },
  lg:    { base: "h-11 px-4   gap-2   text-base rounded-lg", icon: "w-5 h-5", iconOnly: "h-11 w-11 rounded-lg", spinner: "w-5 h-5" },
  xl:    { base: "h-12 px-5   gap-2   text-base rounded-lg", icon: "w-5 h-5", iconOnly: "h-12 w-12 rounded-lg", spinner: "w-5 h-5" },
  "2xl": { base: "h-14 px-6   gap-2.5 text-lg  rounded-xl", icon: "w-6 h-6", iconOnly: "h-14 w-14 rounded-xl", spinner: "w-5 h-5" },
};

// ─── Hierarchy → token classes ─────────────────────────────────────────────

const HIERARCHY: Record<ButtonHierarchy, string> = {
  primary: [
    "bg-brand-600 text-white border border-brand-600",
    "shadow-xs",
    "hover:bg-brand-700 hover:border-brand-700",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200",
    "disabled:bg-brand-100 disabled:border-brand-100 disabled:text-brand-400 disabled:shadow-none disabled:cursor-not-allowed",
  ].join(" "),
  secondary: [
    "bg-white text-gray-700 border border-gray-300",
    "shadow-xs",
    "hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100",
    "disabled:text-gray-300 disabled:border-gray-200 disabled:shadow-none disabled:cursor-not-allowed",
  ].join(" "),
  tertiary: [
    "bg-transparent text-brand-700 border border-transparent",
    "hover:bg-brand-50 hover:text-brand-800",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100",
    "disabled:text-brand-200 disabled:cursor-not-allowed",
  ].join(" "),
  "link-color": [
    "bg-transparent text-brand-700 border-0 p-0 h-auto rounded-none gap-1",
    "hover:text-brand-800",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 focus-visible:rounded-sm",
    "disabled:text-brand-200 disabled:cursor-not-allowed",
  ].join(" "),
  "link-gray": [
    "bg-transparent text-gray-600 border-0 p-0 h-auto rounded-none gap-1",
    "hover:text-gray-700",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 focus-visible:rounded-sm",
    "disabled:text-gray-300 disabled:cursor-not-allowed",
  ].join(" "),
};

// ─── Legacy variant → hierarchy mapping ────────────────────────────────────
// Scaffold demos and ui/ components that use the old shadcn `variant` prop
// continue to work. New code should use `hierarchy`.

type LegacyVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type LegacySize = "default" | "sm" | "lg" | "icon";

const VARIANT_TO_HIERARCHY: Record<LegacyVariant, ButtonHierarchy> = {
  default:     "primary",
  destructive: "primary",
  outline:     "secondary",
  secondary:   "secondary",
  ghost:       "tertiary",
  link:        "link-color",
};

// ─── CVA (kept for legacy VariantProps inference in scaffold components) ───

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold transition-all duration-150 select-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:     "",
        destructive: "",
        outline:     "",
        secondary:   "",
        ghost:       "",
        link:        "",
      },
      size: {
        // Legacy sizes
        default: "",
        icon:    "h-10 w-10 rounded-lg",
        // Opus sizes
        sm:      "h-9  px-3.5 gap-1.5 text-sm  rounded-lg",
        md:      "h-10 px-4   gap-1.5 text-sm  rounded-lg",
        lg:      "h-11 px-4   gap-2   text-base rounded-lg",
        xl:      "h-12 px-5   gap-2   text-base rounded-lg",
        "2xl":   "h-14 px-6   gap-2.5 text-lg  rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size:    "default",
    },
  },
);

// ─── Props ─────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Opus hierarchy level — use this for new code. */
  hierarchy?: ButtonHierarchy;
  /**
   * Legacy shadcn variant — maps to an Opus hierarchy.
   * New code should use `hierarchy` instead.
   */
  variant?: LegacyVariant;
  /** Opus size scale — sm/md/lg/xl/2xl. Legacy: "default" maps to md, "icon" maps to icon-only md. */
  size?: ButtonSize | LegacySize;
  /** Force a visual state for design system showcase. */
  forceState?: ButtonState;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** Square icon-only button. */
  iconOnly?: boolean;
  loading?: boolean;
  asChild?: boolean;
}

// ─── Component ─────────────────────────────────────────────────────────────

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      hierarchy,
      variant,
      size,
      forceState,
      leadingIcon,
      trailingIcon,
      iconOnly = false,
      children,
      loading = false,
      disabled,
      className,
      asChild = false,
      ...rest
    },
    ref,
  ) => {
    // Resolve hierarchy: explicit hierarchy > variant mapping > default
    const resolvedHierarchy: ButtonHierarchy =
      hierarchy ??
      (variant ? (VARIANT_TO_HIERARCHY[variant as LegacyVariant] ?? "primary") : "primary");

    // Resolve size: map legacy "default"/"icon" to Opus equivalents
    const resolvedSize: ButtonSize = (() => {
      if (!size || size === "default") return "md";
      if (size === "icon") return "md";
      if (size === "sm" || size === "md" || size === "lg" || size === "xl" || size === "2xl")
        return size as ButtonSize;
      return "md";
    })();

    // icon size prop means iconOnly behaviour
    const isIconOnly = iconOnly || size === "icon";

    const sz = SIZE[resolvedSize];
    const isDisabled = disabled || forceState === "disabled";
    const isLoading  = loading  || forceState === "loading";
    const isLink     = resolvedHierarchy === "link-color" || resolvedHierarchy === "link-gray";

    const layout = isLink
      ? "inline-flex items-center font-semibold transition-colors duration-150"
      : isIconOnly
      ? `inline-flex items-center justify-center font-semibold transition-all duration-150 ${sz.iconOnly}`
      : `inline-flex items-center justify-center font-semibold transition-all duration-150 ${sz.base}`;

    const focusRing =
      forceState === "focused"
        ? resolvedHierarchy === "primary"
          ? "ring-4 ring-brand-200 outline-none"
          : "ring-4 ring-brand-100 outline-none"
        : "";

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        disabled={isDisabled || isLoading}
        className={cn(layout, HIERARCHY[resolvedHierarchy], focusRing, className)}
        {...rest}
      >
        {isLoading ? (
          <>
            <Spinner className={sz.spinner} />
            {!isIconOnly && <span>Submitting...</span>}
          </>
        ) : (
          <>
            {leadingIcon && (
              <span className={cn("flex-shrink-0", sz.icon)} aria-hidden="true">
                {leadingIcon}
              </span>
            )}
            {!isIconOnly && children}
            {trailingIcon && (
              <span className={cn("flex-shrink-0", sz.icon)} aria-hidden="true">
                {trailingIcon}
              </span>
            )}
            {isIconOnly && !leadingIcon && !trailingIcon && children}
          </>
        )}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button };
