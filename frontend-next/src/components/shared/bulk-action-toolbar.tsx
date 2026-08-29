"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { BulkAction } from "./data-table";

interface BulkActionToolbarProps {
  selectedCount: number;
  selectedIds: string[];
  actions: BulkAction[];
  onClear: () => void;
}

export function BulkActionToolbar({
  selectedCount,
  selectedIds,
  actions,
  onClear,
}: BulkActionToolbarProps) {
  const [pending, setPending] = React.useState<string | null>(null);

  if (selectedCount === 0) return null;

  const runAction = async (action: BulkAction) => {
    if (action.confirmMessage) {
      const ok = window.confirm(
        action.confirmMessage.replace("{count}", String(selectedCount)),
      );
      if (!ok) return;
    }
    setPending(action.label);
    try {
      await action.onClick(selectedIds);
      toast.success(`${action.label} completed for ${selectedCount} item(s)`);
      onClear();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Action failed";
      toast.error(message);
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2">
      <span className="text-sm font-medium">{selectedCount} selected</span>
      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            size="sm"
            variant={action.variant ?? "outline"}
            onClick={() => runAction(action)}
            disabled={pending === action.label}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={onClear}
        className="ml-auto"
        aria-label="Clear selection"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
