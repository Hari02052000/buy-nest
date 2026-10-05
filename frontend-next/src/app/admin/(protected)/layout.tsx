import { redirect } from "next/navigation";
import { getServerCurrentUser } from "@/features/admin/auth/server-auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}