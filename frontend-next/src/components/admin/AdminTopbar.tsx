"use client";

import { AdminSidebarTrigger } from "./AdminSidebar";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { cn } from "@/lib/utils";

interface AdminTopbarProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

export function AdminTopbar({ onMenuClick, isSidebarOpen, isMobile }: AdminTopbarProps) {
  const headerMargin = isSidebarOpen && !isMobile ? "lg:ml-64" : "";

  return (
    <header className={cn("sticky top-0 z-40 h-16 bg-surface border-b border-border", headerMargin)}>
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <AdminSidebarTrigger onClick={onMenuClick} isSidebarOpen={isSidebarOpen} />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}