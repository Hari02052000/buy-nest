"use client";

import { useState, useEffect, useRef } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import type { CurrentUser } from "@/types/user";

interface AdminShellProps {
  user: CurrentUser;
  children: React.ReactNode;
}

function getInitialMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 1024;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(getInitialMobile);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      const checkMobile = () => {
        const mobile = window.innerWidth < 1024;
        setIsMobile(mobile);
        setIsSidebarOpen(!mobile);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile={isMobile} />
      <AdminTopbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        user={user}
      />
      <main
        className={`pt-16 overflow-auto transition-all duration-200 ${
          isSidebarOpen && !isMobile ? "lg:ml-64" : ""
        }`}
        role="main"
      >
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}