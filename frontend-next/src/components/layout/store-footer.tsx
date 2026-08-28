import * as React from "react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

const FOOTER_SECTIONS = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All Products" },
      { href: "/categories", label: "Categories" },
      { href: "/wishlist", label: "Wishlist" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/profile", label: "My Profile" },
      { href: "/orders", label: "My Orders" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function StoreFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h2 className="font-bold text-lg">{SITE_NAME}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your one-stop shop for quality products.
            </p>
          </div>
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm">{section.title}</h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}