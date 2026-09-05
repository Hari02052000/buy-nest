'use client';

import { type ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../hooks/use-admin-auth';
import { Spinner } from '@/components/ui/spinner';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: admin, isLoading, error } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!admin || error)) {
      router.push('/admin/login');
    }
  }, [admin, isLoading, error, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size={32} />
      </div>
    );
  }

  if (!admin || error) {
    return null;
  }

  return <>{children}</>;
}
