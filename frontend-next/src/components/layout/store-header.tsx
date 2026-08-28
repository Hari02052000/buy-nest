"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Menu, User, Heart, Package, LogOut, Sun, Moon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchBar } from "@/components/shared/search-bar";
import { CartBadge } from "@/features/cart/components/cart-badge";
import { useTheme } from "next-themes";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StoreHeaderProps {
  cartCount?: number;
  isAuthenticated?: boolean;
  userName?: string;
  onSearch?: (query: string) => void;
  onLogout?: () => void;
  className?: string;
}

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function StoreHeader({
  cartCount = 0,
  isAuthenticated = false,
  userName,
  onSearch,
  onLogout,
  className,
}: StoreHeaderProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const go = (href: string) => () => router.push(href);

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur", className)}>
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden")}
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>{SITE_NAME}</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="font-bold text-lg whitespace-nowrap">
          {SITE_NAME}
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.slice(0, 3).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 max-w-md hidden sm:block">
          <SearchBar value={search} onChange={setSearch} onSearch={onSearch} />
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 dark:hidden" />
            <Moon className="h-5 w-5 hidden dark:block" />
          </Button>

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
          >
            <Heart className="h-5 w-5" />
          </Link>

          <Link
            href="/cart"
            aria-label="Cart"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
          >
            <ShoppingCart className="h-5 w-5" />
            <CartBadge count={cartCount} />
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={buttonVariants({ variant: "ghost", size: "icon" })}
              >
                <User className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  {userName || "My Account"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={go("/profile")}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={go("/orders")}>
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={go("/wishlist")}>
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}