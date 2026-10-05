"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { logout } from "@/features/admin/auth/auth.service";
import { useCurrentUser } from "@/features/admin/auth/useCurrentUser";
import { currentUserQueryKey } from "@/features/admin/auth/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      await logout();
      queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : "Failed to log out");
      setIsLoggingOut(false);
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="relative" ref={menuRef}>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 px-3 py-1.5"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
          {initials}
        </div>
        <span className="hidden sm:block text-sm font-medium text-foreground">
          {user?.name ?? user?.email ?? "Admin"}
        </span>
        <ChevronDownIcon className="h-4 w-4 text-foreground-muted" aria-hidden="true" />
      </Button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-48 bg-surface border border-border rounded-md shadow-lg",
            "animate-in fade-in-150 zoom-in-95",
            "overflow-hidden z-50"
          )}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-3 py-2 border-b border-border">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.name ?? "Administrator"}
            </p>
            <p className="text-xs text-foreground-muted truncate">{user?.email}</p>
          </div>

          <div className="py-1" role="none">
            <button
              role="menuitem"
              className={cn(
                "w-full px-3 py-2 text-left text-sm text-foreground-secondary",
                "hover:bg-surface-subtle hover:text-foreground",
                "focus:outline-none focus:bg-surface-subtle",
                "transition-colors duration-150"
              )}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Profile
            </button>
            <button
              role="menuitem"
              className={cn(
                "w-full px-3 py-2 text-left text-sm text-foreground-secondary",
                "hover:bg-surface-subtle hover:text-foreground",
                "focus:outline-none focus:bg-surface-subtle",
                "transition-colors duration-150"
              )}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Settings
            </button>
          </div>

          <div className="border-t border-border py-1" role="none">
            <button
              role="menuitem"
              className={cn(
                "w-full px-3 py-2 text-left text-sm text-error-foreground",
                "hover:bg-error/10",
                "focus:outline-none focus:bg-error/10",
                "transition-colors duration-150"
              )}
              onClick={() => setIsOpen(false)}
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={logoutError !== null || isLoggingOut}
        onClose={() => {
          setLogoutError(null);
          setIsLoggingOut(false);
        }}
        onConfirm={handleLogout}
        title="Sign out"
        description="Are you sure you want to sign out of your admin account?"
        confirmText="Sign out"
        cancelText="Cancel"
        variant="danger"
        isLoading={isLoggingOut}
      />
    </div>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}