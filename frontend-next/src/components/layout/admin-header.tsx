'use client';

import * as React from 'react';
import { useTheme } from '@/components/providers/theme-provider';
import { AdminUserMenu } from './admin-user-menu';
import { Breadcrumbs, type BreadcrumbItem } from './breadcrumbs';
import { Button } from '@/components/ui/button';
import { Menu, Sun, Moon, Monitor } from 'lucide-react';

interface AdminHeaderProps {
  onMenuClick: () => void;
  breadcrumbs?: BreadcrumbItem[];
}

function AdminHeader({ onMenuClick, breadcrumbs }: AdminHeaderProps) {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={cycleTheme}
          aria-label={`Switch theme. Current: ${theme}`}
          className="hidden sm:flex"
        >
          <ThemeIcon className="h-5 w-5" />
        </Button>
        <AdminUserMenu />
      </div>
    </header>
  );
}

export { AdminHeader, type AdminHeaderProps };
