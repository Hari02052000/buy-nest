"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useAdminSession, useAdminLogout } from "@/lib/query/hooks/useAdminAuth";
import { toast } from "sonner";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: admin } = useAdminSession();
  const logoutMutation = useAdminLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Logged out");
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar onLogout={handleLogout} />
      <div className="flex flex-1 flex-col">
        <AdminTopbar
          userName={admin?.userName || admin?.email || "Admin"}
          onLogout={handleLogout}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
