import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminLoginForm } from '@/features/auth/components/admin-login-form';

export default function AdminLoginPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token_admin');

  if (accessToken) {
    redirect('/admin');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Buy Nest</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to the admin panel
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
