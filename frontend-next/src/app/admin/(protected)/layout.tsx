import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/server";
import { AdminShell } from "@/features/admin/components/admin-shell";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
