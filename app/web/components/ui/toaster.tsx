"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "bg-zinc-900 border-zinc-700 text-zinc-100",
          description: "text-zinc-400",
          actionButton: "bg-helix-600 text-zinc-50",
          cancelButton: "bg-zinc-700 text-zinc-300",
        },
      }}
    />
  );
}
