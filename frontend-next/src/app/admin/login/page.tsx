import { LoginForm } from "@/features/admin/auth/LoginForm";

/**
 * Admin Login Page.
 *
 * Server Component that renders the admin login form.
 * Page-level layout with centered login card.
 */
export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Buy Nest</h1>
          <p className="text-foreground-muted mt-1">Admin Portal</p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Administrator</h2>
            <p className="text-foreground-muted mt-1 text-sm">Sign in to access the admin dashboard</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}