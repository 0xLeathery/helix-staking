"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  headline: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon: Icon, headline, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
        <Icon className="w-6 h-6 text-zinc-400" />
      </div>
      <p className="text-sm font-medium text-zinc-200">{headline}</p>
      {description && (
        <p className="text-xs text-zinc-400 max-w-xs">{description}</p>
      )}
      {action && (
        action.href ? (
          <Button asChild size="sm">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : (
          <Button size="sm" onClick={action.onClick}>{action.label}</Button>
        )
      )}
    </div>
  );
}
