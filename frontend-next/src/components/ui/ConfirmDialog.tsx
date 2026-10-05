"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
}

function FocusTrap({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        const closeBtn = container!.querySelector('[data-action="close"]') as HTMLElement;
        closeBtn?.click();
      }
    }

    container.addEventListener("keydown", handleTab);
    container.addEventListener("keydown", handleEscape);

    return () => {
      container.removeEventListener("keydown", handleTab);
      container.removeEventListener("keydown", handleEscape);
      previousActiveElement.current?.focus();
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />
      <FocusTrap>
        <div
          className={cn(
            "relative w-full max-w-md bg-surface border border-border rounded-lg shadow-xl overflow-hidden",
            "animate-in fade-in-150 zoom-in-95"
          )}
        >
          <div className="px-6 py-4 border-b border-border">
            <h2 id="confirm-dialog-title" className="text-lg font-semibold text-foreground">
              {title}
            </h2>
          </div>
          {description && (
            <div className="px-6 py-4">
              <p id="confirm-dialog-description" className="text-sm text-foreground-secondary">
                {description}
              </p>
            </div>
          )}
          <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
            <Button
              variant="ghost"
              size="md"
              onClick={onClose}
              disabled={isLoading}
              data-action="close"
            >
              {cancelText}
            </Button>
            <Button
              variant={variant === "danger" ? "primary" : "primary"}
              size="md"
              onClick={onConfirm}
              disabled={isLoading}
              isLoading={isLoading}
              className={variant === "danger" ? "bg-error-foreground hover:bg-error-foreground/90 focus:ring-error-foreground" : ""}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}