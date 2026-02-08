import { toast as sonnerToast } from "sonner";

/**
 * React hook for displaying toast notifications.
 *
 * Wraps sonner's toast API with a compatible interface.
 */
export function useToast() {
  return {
    toast: ({
      title,
      description,
      variant,
    }: {
      title: string;
      description?: string;
      variant?: "default" | "destructive";
    }) => {
      if (variant === "destructive") {
        sonnerToast.error(title, { description });
      } else {
        sonnerToast.success(title, { description });
      }
    },
  };
}
