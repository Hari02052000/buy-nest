"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: NavLink[];
  className?: string;
}

export function MobileNav({ links, className }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), className)}
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>{SITE_NAME}</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}