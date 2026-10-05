"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AdminSidebarNav } from "./AdminNavItem";
import { Button } from "@/components/ui/Button";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export function AdminSidebar({ isOpen, onClose, isMobile }: AdminSidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      sidebarRef.current?.focus();
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // On mobile: render nothing when closed (drawer behavior)
  // On desktop: always render (collapsible behavior)
  if (!isOpen && isMobile) {
    return null;
  }

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      <aside
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border",
          "flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "transition-transform duration-200 ease-in-out"
        )}
        role="navigation"
        aria-label="Admin sidebar"
        tabIndex={-1}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2" aria-label="Buy Nest Admin Home">
            <svg className="h-7 w-7 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-bold text-lg text-foreground hidden sm:block">Buy Nest</span>
          </Link>

          {/* Close button - only on mobile when sidebar is open */}
          {isMobile && isOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close menu"
              className="lg:hidden"
            >
              <XIcon className="h-5 w-5" />
            </Button>
          )}
        </div>

        <AdminSidebarNav />
      </aside>
    </>
  );
}

export function AdminSidebarTrigger({
  onClick,
  isSidebarOpen,
}: {
  onClick: () => void;
  isSidebarOpen: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="md"
      className="p-2"
      onClick={onClick}
      aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      aria-expanded={isSidebarOpen}
    >
      {isSidebarOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
    </Button>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}