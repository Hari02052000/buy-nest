import { getAdminSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage() {
  const admin = await getAdminSession();
  if (admin) redirect("/admin");

  return <LoginForm />;
}
