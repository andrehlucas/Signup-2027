/**
 * use-toast — stub hook.
 *
 * The Toast UI component is planned (Figma designs complete) but not yet
 * shipped in this package. This stub preserves the ./hooks/use-toast export
 * path so consuming apps that import it do not break at the module-resolution
 * level. Wire up a real implementation when the Toast component ships.
 */

export type ToastVariant = "default" | "destructive";

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastHandle {
  id: string;
  dismiss: () => void;
}

// No-op implementation — replace with a real provider-backed hook when Toast ships.
export function useToast() {
  const toast = (_options: ToastOptions): ToastHandle => {
    return { id: "", dismiss: () => {} };
  };

  return {
    toast,
    toasts: [] as ToastHandle[],
    dismiss: (_id?: string) => {},
  };
}

export function toast(options: ToastOptions): ToastHandle {
  // eslint-disable-next-line no-console
  console.warn("[opus-vo-design-system] toast(): Toast UI not yet implemented.", options);
  return { id: "", dismiss: () => {} };
}
