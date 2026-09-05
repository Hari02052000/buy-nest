'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/components/providers/theme-provider';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminMobileNavProps {
  open: boolean;
  onClose: () => void;
  currentPath: string;
}

function AdminMobileNav({ open, onClose, currentPath }: AdminMobileNavProps) {
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-y-0 left-0 w-64 bg-background shadow-lg">
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <span className="font-semibold">Buy Nest Admin</span>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close menu">
            <span className="sr-only">Close</span>
            <span aria-hidden="true">×</span>
          </Button>
        </div>
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive =
              item.href === '/admin'
                ? currentPath === '/admin'
                : currentPath.startsWith(item.href);

            return (
              <button
                key={item.name}
                onClick={onClose}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {item.name}
              </button>
            );
          })}
        </nav>
        <Separator />
        <div className="p-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Theme</p>
          <div className="flex gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('light')}
              className="flex-1"
            >
              <Sun className="h-4 w-4 mr-2" /> Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('dark')}
              className="flex-1"
            >
              <Moon className="h-4 w-4 mr-2" /> Dark
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export { AdminMobileNav, type AdminMobileNavProps };
