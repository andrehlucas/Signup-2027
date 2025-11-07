import type { FC, ReactNode } from "react";

/**
 * Checks if a value is a React component (function component)
 * Returns true if the value is a function that could be a React component
 */
export function isReactComponent(value: FC<{ className?: string }> | ReactNode): value is FC<{ className?: string }> {
  return typeof value === "function";
}
