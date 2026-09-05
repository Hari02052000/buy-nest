# Next.js Core Architecture

This document defines the core Next.js application architecture for the Buy Nest e-commerce frontend rebuild. It is a companion to `api-architecture.md`, `tanstack-query.md`, `state-management.md`, and `auth-forms.md`.

## 1. Next.js Version / Approach

**Next.js 14+** with the App Router.

The App Router is chosen because:
- Server Components are the default, reducing client-side JavaScript.
- File-system routing eliminates `react-router-dom` and central route configs.
- Built-in SEO via the Metadata API.
- Streaming and Suspense boundaries are native.

The Pages Router is not used. All new code lives in `app/`.

---

## 2. App Router

All routes, layouts, and boundaries live under `src/app/`.

```
src/app/
├── layout.tsx              # Root layout
├── loading.tsx             # Root loading UI (optional)
├── error.tsx               # Global error boundary
├── not-found.tsx           # Global 404
├── globals.css             # Tailwind + CSS custom properties
├── (store)/
├── (admin)/
├── (auth)/
└── api/                    # Next.js API routes (minimal)
```

Route groups `(store)`, `(admin)`, and `(auth)` wrap routes with shared layouts without adding segments to the URL.

---

## 3. Route Organization

Routes are organized by **user intent**, not technical type.

| Route Group | Routes | Purpose |
|-------------|--------|---------|
| `(store)` | `/`, `/shop`, `/shop/[category]`, `/products/[id]`, `/cart`, `/checkout`, `/orders`, `/orders/[id]`, `/wishlist`, `/account/*`, `/contact` | Customer-facing store |
| `(admin)` | `/admin`, `/admin/products`, `/admin/products/new`, `/admin/products/[id]/edit`, `/admin/categories/*`, `/admin/orders/*` | Admin panel |
| `(auth)` | `/account/login`, `/account/signup` | Auth pages (optional; can merge into `(store)`) |

**Dynamic segments:**
- `[id]` — product ID, order ID
- `[category]` — category slug

**Alternative considered:** Flat structure with `admin/` prefix. Rejected because route groups keep `/admin` as a virtual prefix and avoid layout coupling.

---

## 4. Route Groups

Three route groups:

- **`(store)`** — Wraps all customer-facing routes with `Header`, `Footer`, and cart context.
- **`(admin)`** — Wraps admin routes with a completely different shell (sidebar, topbar). Admin pages never see the customer Header/Footer.
- **`(auth)`** — Optional. Use only if login/signup need a distinct centered layout without the store Header/Footer. Otherwise merge into `(store)`.

**Tradeoff:** Route groups are implicit. New developers must understand that `(store)` does not appear in the URL. Document this in the project README.

---

## 5. Layout Hierarchy

Three nested layout levels:

```
app/
├── layout.tsx                    # ROOT LAYOUT
│   ├── <html>, <body>
│   ├── Providers (React Query, Theme, Toast)
│   └── {children}
│
├── (store)/
│   └── layout.tsx                # STORE LAYOUT
│       ├── Header
│       ├── Main content area (max-width container)
│       ├── Footer
│       └── CartDrawerProvider (if needed)
│
├── (admin)/
│   └── layout.tsx                # ADMIN LAYOUT
│       ├── AdminShell (sidebar + topbar)
│       ├── Main content area
│       └── {children}
│
└── (auth)/
    └── layout.tsx                # AUTH LAYOUT (optional)
        ├── Centered card container
        └── {children}
```

**Root layout** is minimal. It sets up providers and the HTML shell. It does not render navigation.

**Store layout** renders the customer Header, Footer, and cart context. Every store page gets these automatically.

**Admin layout** renders a completely different shell. Admin pages never see the customer Header/Footer.

**Alternative considered:** Single root layout with conditional Header/Footer. Rejected because conditional rendering based on route creates prop-drilling and makes layout logic hard to follow.

---

## 6. Server Components

**Default.** Every file in `app/` is a Server Component unless it has `'use client'` at the top.

Server Components:
- Fetch data directly with `async/await`.
- Have access to cookies, the filesystem, and databases.
- Send zero JavaScript to the client by default.
- Pass data as props to Client Components.

**Rule:** If a page does not need interactivity, it stays a Server Component.

---

## 7. Client Components

**Opt-in.** A file becomes a Client Component only when it needs:
- Browser APIs (`window`, `localStorage`, `IntersectionObserver`)
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- React hooks (`useState`, `useEffect`, `useContext`, `useQuery`, `useForm`)
- Third-party libraries that depend on the DOM

**Rule:** Client Components should be leaf nodes. A Client Component should not wrap a page; it should be a button, form, or interactive widget.

---

## 8. `'use client'` Rules

1. `'use client'` goes at the **very top** of the file. No imports before it.
2. Allowed locations:
   - `components/ui/*` — primitives that need event handlers.
   - `components/layout/header.tsx` — needs search input, mobile menu, cart icon.
   - `features/[domain]/components/*` — interactive feature components.
   - `features/[domain]/hooks/*` — all hooks are Client Components.
   - `features/[domain]/forms/*` — all forms are Client Components.
   - `app/` pages that are purely interactive (e.g., `cart/page.tsx`).
3. **Not allowed** on:
   - `app/(store)/page.tsx` (Home) — should fetch directly.
   - `app/(store)/products/[id]/page.tsx` — should fetch directly.
   - `components/layout/footer.tsx` — static links, no interactivity.
   - `features/products/components/product-grid.tsx` — if it only receives data as props.

**Rule:** Do not add `'use client'` to a page just because it uses a hook. Extract the interactive part into a child Client Component.

---

## 9. Rendering Strategy

Mixed rendering based on page data dependencies.

| Page Type | Rendering | Reason |
|-----------|-----------|--------|
| Home | **Static (SSG)** + ISR | Content updates infrequently. Revalidate every 5 minutes. |
| Product Detail | **Dynamic (SSR)** | Real-time stock, price, availability. |
| Category pages | **Dynamic (SSR)** | Product listings change. |
| Cart, Checkout, Orders, Wishlist | **Dynamic (SSR)** | User-specific data, cannot be static. |
| Admin pages | **Dynamic (SSR)** | Real-time data, auth-dependent. |
| About, Contact | **Static (SSG)** | Content rarely changes. |

**SSG/ISR:** Use `export const revalidate = 300` (5 minutes) on public pages.

**SSR:** No `revalidate` export. Next.js renders on every request. Cookies are available server-side.

**Alternative considered:** All SSR. Rejected because it wastes server resources on static content. All SSG. Rejected because cart, checkout, and orders cannot be static.

**Tradeoff:** SSR adds server latency for dynamic pages. Mitigated by TanStack Query caching on the client.

---

## 10. Loading Boundaries

Use Next.js `loading.tsx` files at the **route segment level**.

**Where loading files live:**
- `app/(store)/loading.tsx` — store-wide loading.
- `app/(store)/products/[id]/loading.tsx` — product detail loading.
- `app/(store)/checkout/loading.tsx` — checkout loading.
- `app/(admin)/loading.tsx` — admin loading.

**Pattern:**
```tsx
export default function Loading() {
  return <ProductDetailSkeleton />;
}
```

**Why route-level loading:** Next.js automatically shows the nearest `loading.tsx` during server-side data fetching. It is simpler than manual `Suspense` boundaries everywhere.

**Alternative considered:** Global loading spinner. Rejected because a full-page spinner is worse UX than a skeleton that matches the content shape.

**Tradeoff:** `loading.tsx` shows during the **initial** server fetch. For client-side navigation within a Client Component, local `isLoading` states from TanStack Query are still needed.

---

## 11. Error Boundaries

Two levels:

1. **Global error boundary:** `app/error.tsx`
   - Catches render errors, unexpected exceptions.
   - Shows fallback UI + "Try again" button.
   - Logs to monitoring.

2. **Inline error states in Client Components:**
   - TanStack Query errors handled inline with `Alert` components.
   - Form errors handled inline with Zod validation messages.

**Pattern:**
```tsx
// app/error.tsx
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Alternative considered:** Single global error boundary only. Rejected because inline errors are better UX for expected failures (network errors, validation errors).

---

## 12. Not-found Handling

Three layers:

1. **Global `app/not-found.tsx`** — Catches unmatched routes. Shows "Page not found" with a link home.
2. **Segment-level `not-found.tsx`** — e.g., `app/(store)/products/[id]/not-found.tsx` shows "Product not found".
   - Triggered by calling `notFound()` in a Server Component when data is missing.
3. **Admin not-found** — e.g., `app/(admin)/products/[id]/edit/not-found.tsx`.

**Pattern:**
```tsx
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}
```

**Why segment-level:** Provides context-aware 404 pages. The user stays in the right layout context (admin vs store).

**Alternative considered:** Single global not-found. Rejected because it loses layout context.

---

## 13. Metadata / SEO Structure

Use the Next.js Metadata API.

**Layers:**

| Layer | Location | Purpose |
|-------|----------|---------|
| Global defaults | `app/layout.tsx` | Site title, description, OG defaults, organization JSON-LD |
| Route group defaults | `app/(store)/layout.tsx` | Store-specific metadata (e.g., default title suffix) |
| Page-level | `app/(store)/products/[id]/page.tsx` | Dynamic title, description, OG image per product |
| Category pages | `app/(store)/shop/[category]/page.tsx` | Dynamic title, description per category |

**Pattern for dynamic pages:**
```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.id);
  return {
    title: `${product.name} | Buy Nest`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]?.url],
      type: 'website',
    },
  };
}
```

**Additional SEO files:**
- `app/sitemap.ts` — Dynamic sitemap from product/category list.
- `app/robots.ts` — Robots config.
- JSON-LD structured data in `app/layout.tsx` for Organization, and per-product for `Product` schema.

**Alternative considered:** `react-helmet` / `next/head`. Rejected. Metadata API is the modern standard and works with Server Components.

---

## 14. Feature / Domain Boundaries

Code is organized by **feature domain**, not by technical type.

```
src/features/
├── auth/
│   ├── components/
│   ├── hooks/
│   └── schemas/
├── products/
│   ├── components/
│   ├── hooks/
│   └── schemas/
├── cart/
│   ├── components/
│   ├── hooks/
│   └── api.ts
├── checkout/
├── orders/
├── wishlist/
└── admin/
```

**Why feature-first:**
- When working on the cart, everything is in `features/cart/`. No hunting across `components/`, `hooks/`, `pages/`.
- It prevents the "dumping ground" problem.
- It scales: adding a new feature means adding a new folder.

**Alternative considered:** Type-based organization (`components/`, `hooks/`, `pages/`). Rejected. This scatters related code and was a problem in the old codebase.

---

## 15. Recommended Folder Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── globals.css
│   ├── (store)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── shop/
│   │   │   ├── page.tsx
│   │   │   └── [category]/page.tsx
│   │   ├── products/
│   │   │   └── [id]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── wishlist/page.tsx
│   │   ├── account/
│   │   │   ├── page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── addresses/page.tsx
│   │   └── contact/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── categories/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   └── orders/
│   │       ├── page.tsx
│   │       └── [id]/edit/page.tsx
│   └── (auth)/
│       ├── login/page.tsx
│       └── signup/page.tsx
├── features/
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── wishlist/
│   └── admin/
├── components/
│   ├── ui/
│   ├── layout/
│   └── features/
├── lib/
│   ├── api/
│   ├── auth.ts
│   ├── categories.ts
│   ├── env.ts
│   ├── format.ts
│   ├── query-client.ts
│   ├── query-keys.ts
│   └── types/
├── hooks/
├── public/
└── middleware.ts
```

**Key points:**
- `app/` contains only routing and layout.
- `features/` contains all domain logic.
- `components/ui/` contains primitive, reusable UI atoms.
- `components/layout/` contains structural layout pieces.
- `lib/` contains API clients, utilities, and configuration.
- `middleware.ts` handles auth guards at the edge.

---

## 16. Architectural Rules

1. **Server Components by default.** Do not add `'use client'` unless the file needs interactivity.
2. **Client Components are leaf nodes.** They should not wrap pages; they should be buttons, forms, or interactive widgets.
3. **One layout per route group.** Do not nest layouts more than three levels deep.
4. **No logic in `app/` files beyond routing.** Business logic lives in `features/` or `lib/`.
5. **No `pages/` directory.** The entire app uses the App Router.
6. **No `_app.tsx` or `_document.tsx`.** The root `layout.tsx` replaces both.
7. **Route groups do not affect URLs.** `(store)` does not appear in the browser URL bar.
8. **Dynamic segments use typed `params`.** Server Components destructure `params` with proper types.
9. **Loading and error boundaries are colocated.** `loading.tsx` and `error.tsx` live next to the routes they protect.
10. **Metadata is colocated.** `generateMetadata` lives in the same file as the page it describes.

---

## 17. Important Tradeoffs

- **Server Components vs client bundle size:** Server Components reduce JS but add server latency. For a single developer, the App Router's defaults (static where possible, dynamic when needed) are the right balance.
- **Route groups vs clarity:** Route groups are powerful but implicit. The cost is a small learning curve for new contributors. The benefit is clean URL structure without duplicate layouts.
- **Three layouts vs maintenance:** Three layout files (root, store, admin) means three files to maintain. The alternative (conditional rendering in one layout) is harder to reason about. Three focused files is better.
- **SSG/ISR vs freshness:** 5-minute revalidation means users can see stale catalog data. For e-commerce, this is acceptable. Reduce if product updates become more frequent.
- **Metadata API vs per-page SEO:** The Metadata API requires each page to export `generateMetadata`. This is slightly more work than a global `<Helmet>` but is type-safe, works with Server Components, and prevents SEO gaps.
