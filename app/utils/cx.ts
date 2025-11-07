import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sorts and combines class names for consistent styling
 * This is useful for component variants where order matters
 */
export function sortCx<T extends Record<string, any>>(classes: T): T {
  const sorted: any = {};
  
  for (const [key, value] of Object.entries(classes)) {
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      // Recursively handle nested objects
      sorted[key] = sortCx(value);
    } else if (Array.isArray(value)) {
      sorted[key] = value.join(" ");
    } else {
      sorted[key] = value;
    }
  }
  
  return sorted as T;
}
