# Buy Nest — Architecture

## 1. Project Overview

Buy Nest is a Next.js (App Router) e-commerce frontend rebuild using the App Router. The application serves customers (product browsing, cart, checkout, orders, wishlist, account) and administrators (product/category/order management). It replaces an existing JavaScript codebase with a strictly typed, Server Component-first architecture. The project targets a portfolio-grade implementation with production-ready quality gates.

## 2. Architecture Principles

- **Feature-first organization.** Domain logic lives in `src/features/`. Routes compose features; features do not depend on routes.
- **Server Components by default.** Fetch data directly with `async/await`. Client Components are leaf nodes.
- **Thin API layer.** One axios instance, domain modules, envelope unwrapping at the boundary. Components receive plain entities.
- **Single source of truth per state category.** Server state via TanStack Query; URL state via URL; form state via React Hook Form; UI state via component-local `useState`.
- **No global state library.** No Redux, no Zustand. No `AuthContext`, no `CartContext`.
- **Token-driven design.** CSS custom properties in `globals.css`. No arbitrary colors or hardcoded spacing.
- **Security by server-side enforcement.** httpOnly cookies, middleware guards, Zod validation. Frontend never handles tokens.
- **Convention over configuration.** Colocated `loading.tsx`, `error.tsx`, `generateMetadata`. Minimal routing config.

## 3. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js (App Router) | SSR/SSG/ISR, routing, metadata, streaming |
| Language | TypeScript (strict mode) | Type safety, build-time validation |
| Styling | Tailwind CSS + CSS custom properties | Utility-first styling, token-driven theming |
| Data fetching (client) | TanStack Query v5 | Server state caching, mutations, optimistic updates |
| Data fetching (server) | Native `async/await` | Server Component data access |
| Forms | React Hook Form + Zod | Uncontrolled inputs, validation |
| HTTP client | Axios | Single instance, `withCredentials`, interceptors |
| URL state | `nuqs` (primary), `useSearchParams` (simple cases) | Type-safe search parameters |
| Fonts | `next/font` | Zero layout shift |
| Images | `next/image` | Optimization, lazy loading, responsive sizing |
| Testing (unit/component) | Vitest + React Testing Library | Fast unit and component tests |
| Testing (E2E) | Playwright | Real browser flows |
| Testing (a11y) | `jest-axe` | Programmatic accessibility checks |
| Icons | Lucide React | Tree-shakable icons |
| Notifications | `sonner` (or small context) | Toast messages |
| Linting | ESLint 9+ (flat config) | Code quality, React best practices |
| Formatting | Prettier + `prettier-plugin-tailwindcss` | Consistent style, Tailwind class sorting |
| CI | GitHub Actions | Automated quality gates |

## 4. Next.js Architecture

- **App Router only.** No Pages Router. All routes, layouts, and boundaries live under `src/app/`.
- **Route groups:** `(store)` for customer-facing routes, `(admin)` for admin routes, `(auth)` optional for login/signup. Route groups wrap shared layouts without affecting URLs.
- **Layout hierarchy:** Root layout (providers, HTML shell) → Store layout (Header, Footer, cart context) or Admin layout (sidebar, topbar). Maximum three levels deep.
- **Rendering strategy:**
  - Static (SSG) + ISR for home, about, contact (`revalidate = 300`).
  - Dynamic (SSR) for product detail, categories, cart, checkout, orders, wishlist, admin pages.
- **Loading boundaries:** Route-level `loading.tsx` with skeletons. Not global spinners.
- **Error boundaries:** Global `app/error.tsx` + inline TanStack Query error states.
- **Not-found handling:** Global `app/not-found.tsx` + segment-level `not-found.tsx` triggered by `notFound()` in Server Components.
- **Metadata:** `generateMetadata` colocated with pages. Global defaults in root layout. Dynamic OG images per product. `app/sitemap.ts` and `app/robots.ts`.

## 5. Folder Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout, providers
│   ├── loading.tsx                   # Root loading UI
│   ├── error.tsx                     # Global error boundary
│   ├── not-found.tsx                 # Global 404
│   ├── globals.css                   # Tailwind + CSS custom properties
│   ├── (store)/
│   │   ├── layout.tsx                # Store layout (Header, Footer)
│   │   ├── page.tsx                  # Home
│   │   ├── shop/
│   │   ├── products/[id]/page.tsx    # Product detail
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── orders/ & wishlist/page.tsx
│   │   ├── account/
│   │   └── contact/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx                # Admin layout (sidebar, topbar). Supports wide data tables with horizontal scroll.
│   │   ├── page.tsx
│   │   ├── products/ & categories/ & orders/
│   │   └── [id]/edit/page.tsx
│   └── (auth)/
│       ├── login/page.tsx
│       └── signup/page.tsx
├── features/
│   ├── auth/
│   │   ├── components/               # login-form, signup-form, protected-route, logout-button
│   │   ├── hooks/use-auth.ts
│   │   ├── schemas/                  # login.schema.ts, signup.schema.ts
│   │   └── api.ts
│   ├── products/
│   │   ├── components/               # product-card, product-grid, product-detail-client
│   │   ├── hooks/                    # use-products.ts, use-product-detail.ts
│   │   ├── schemas/                  # product-filter.schema.ts
│   │   └── api.ts
│   ├── cart/
│   │   ├── components/               # cart-page, cart-item, cart-summary, coupon-input
│   │   ├── hooks/use-cart.ts
│   │   └── api.ts
│   ├── checkout/
│   │   ├── components/               # checkout-flow, shipping-form, payment-form, order-summary
│   │   └── schemas/
│   ├── orders/
│   │   ├── components/               # order-history, order-detail, order-card
│   │   └── hooks/use-orders.ts
│   ├── wishlist/
│   │   ├── components/
│   │   └── hooks/use-wishlist.ts
│   └── admin/
│       ├── products/
│       │   └── components/           # admin-product-table, product-form
│       ├── categories/
│       │   └── components/           # admin-category-tree, category-form
│       ├── orders/
│       │   └── components/           # admin-order-table, order-edit
│       └── layout/
│           └── admin-layout.tsx
├── components/
│   ├── ui/                           # Button, Input, Select, Card, Badge, Dialog, Skeleton, etc.
│   ├── layout/                       # header.tsx, footer.tsx, breadcrumbs.tsx
│   └── features/                     # Shared feature components (search-input, pagination, empty-state)
├── lib/
│   ├── api/
│   │   ├── axios.ts                  # Single instance, interceptor, ApiError
│   │   ├── types.ts                  # ApiResponse<T>, unwrap(), shared entities
│   │   ├── cookies.ts                # Server-side cookie forwarding
│   │   ├── products.ts
│   │   ├── categories.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   ├── wishlist.ts
│   │   ├── auth.ts
│   │   ├── checkout.ts
│   │   └── upload.ts
│   ├── auth.ts
│   ├── categories.ts
│   ├── env.ts                        # Zod env validation
│   ├── format.ts                     # formatPrice, formatDate
│   ├── query-client.ts               # QueryClient instance
│   ├── query-keys.ts                 # Centralized query key factories
│   └── cn.ts                         # clsx + tailwind-merge wrapper
├── hooks/                            # Global hooks (if any feature-independent hooks emerge)
├── public/
├── middleware.ts                     # Auth guards
└── __tests__/                        # Unit, component, integration tests
```

## 6. Server vs Client Components

- **Server Components (default):** Import API functions directly and `await` them. Pass data as props to Client Components. Do not use TanStack Query. Do not import hooks or browser APIs.
- **Client Components (`'use client'`):** Opt-in only when the file needs event handlers, React hooks, browser APIs, or third-party DOM libraries. Use TanStack Query for data fetching. Use React Hook Form for forms. Use `useState` for UI state.
- **`'use client'` placement:** Must be the very first line in the file. No imports before it.
- **Leaf node rule:** Client Components should be buttons, forms, or interactive widgets. They should not wrap entire pages.
- **Rule:** No component fetches data in both Server and Client contexts simultaneously. Server Components fetch directly; Client Components use TanStack Query.

## 7. Feature Boundaries

- **Domain modules in `src/lib/api/`:** One module per domain (`products.ts`, `cart.ts`, `orders.ts`, `wishlist.ts`, `auth.ts`, `checkout.ts`, `upload.ts`). No cross-module imports in the API layer. Each module owns its endpoints exclusively.
- **Feature folders in `src/features/`:** Components, hooks, schemas, and API re-exports for a domain. Pages import from `features/`; features do not import from each other's `components/` directly.
- **Admin subdomains:** `features/admin/products/` — components/; `features/admin/categories/` — components/; `features/admin/orders/` — components/.
- **Shared components:** If a component is used by 2+ features, it lives in `components/features/`. If used by only one feature, it lives in that feature's `components/`.
- **UI primitives:** Generic, framework-agnostic atoms in `components/ui/`. No business logic. Accept `className` and use `cn()`.
- **Layout components:** Structural shells in `components/layout/` (Header, Footer, Breadcrumbs). May read TanStack Query for shell data (cart count).
- **Pages:** Thin composition in `app/`. Server Component pages fetch data and pass as props. Client Component pages orchestrate feature components. No business logic in `app/` files.

## 8. Design System

- **Tokens:** CSS custom properties in `app/globals.css` using the Tailwind `@theme` directive. Single source of truth. No separate `tokens.ts` or `design-tokens.json`.
- **Colors:** Semantic tokens (`background`, `foreground`, `primary`, `primary-foreground`, `secondary`, `muted`, `destructive`, `success`, `warning`, `info`, `border`, `input`, `ring`). Each group uses a 50–950 scale. Primary is deep charcoal (`#171717`). Accent is warm red (`#d6001c`). Never hardcode hex values or arbitrary color classes.
- **Typography:** `Inter` for sans, `Playfair Display` for display, system mono for prices/codes. Loaded via `next/font`.
- **Spacing:** Tailwind default scale (4px base) exclusively. No hardcoded pixel values.
- **Border radius:** `rounded-sm`, `rounded-md` (interactive), `rounded-lg` (containers), `rounded-xl` (modals), `rounded-full` (pills/avatars).
- **Shadows:** `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`. Indicate elevation only; never decoration.
- **Transitions:** `transition-colors` (150ms) for hover/focus. `transition-all` (200ms) sparingly for cards/collapsibles. No custom animation libraries.
- **Breakpoints:** Mobile-first Tailwind defaults (`sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px).
- **Containers:** `max-w-7xl` for store pages. Admin tables use responsive wide containers with horizontal scroll (`overflow-x-auto`) and `min-w-full` on tables. `container mx-auto px-4` for page wrappers.

## 9. Component Architecture

- **UI primitives (`components/ui/`):** Button, Input, Select, Checkbox, Radio, Card, Badge, Tabs, Dialog, Drawer, Sheet, Skeleton, Spinner, Alert, Toast, Avatar, Separator, Tooltip, Breadcrumbs, Pagination. Styled with Tailwind. Accept `className`. Use CVA for 3+ variants. No business logic.
- **Layout components (`components/layout/`):** Header, Footer, Breadcrumbs, AdminShell, MobileNav. Header reads cart/wishlist counts via TanStack Query. No business logic.
- **Feature components (`features/[domain]/components/`):** Domain-specific interactivity. Example: `ProductCard`, `CartItem`, `CheckoutFlow`, `LoginForm`. Accept data as props; do not fetch directly unless wrapped in a hook.
- **Shared feature components (`components/features/`):** Used by 2+ features: `SearchInput`, `Pagination`, `EmptyState`, `ErrorState`, `OrderSuccessModal`.
- **Ownership rules:**
  - `components/ui/` = generic atoms.
  - `components/layout/` = page shells.
  - `components/features/` = shared across features.
  - `features/[domain]/components/` = domain-specific only.
- **Anti-patterns:** No duplicate components (`ProductCard1`). No components that mix unrelated concerns (e.g., data fetching + presentation + business logic). No components that require excessive prop drilling (>3 levels) — extract shared data access. Prefer composition over wide prop interfaces. No arbitrary colors or spacing.

## 10. API Architecture

- **Single axios instance** in `src/lib/api/axios.ts`. `baseURL` from `NEXT_PUBLIC_API_URL`. `withCredentials: true` for httpOnly cookies. Response interceptor normalizes errors into `ApiError`. No request interceptors that mutate bodies or headers beyond cookie forwarding.
- **Server-safe API usage:** Server Components import domain functions and `await` them. Cookie forwarding is handled transparently for authenticated requests. Server Components never import browser-only code.
- **Domain modules:** Plain async functions in `src/lib/api/`. One module per domain. No cross-module imports. Each module owns its endpoints.
- **Envelope unwrapping:** Backend returns `{ success, message, data }`. The `unwrap()` helper in `types.ts` extracts `data`. Components receive plain entities.
- **Cookie forwarding (server-side):** `getServerCookieHeader()` from `next/headers` attaches cookies to server-side requests.
- **Server Component fetching:** Import API functions directly and `await` them. Pass data as props to Client Components.
- **Client Component fetching:** Call the same API functions inside `useQuery` / `useMutation`. No separate client-side API layer.
- **Browser-safe API usage:** Client Components call the same domain functions inside `useQuery` / `useMutation`. The axios instance uses `withCredentials: true`. No server-only modules are exposed to the client.
- **Hydration / prefetch strategy:**
  1. Server Component fetches data directly and passes as props → Client Component consumes props (no TanStack Query needed).
  2. Server Component prefetches data with `prefetchQuery` → Client Component uses `useQuery` with the same key (instant cache hit, then reactive updates).
  3. Client Component fetches independently with `useQuery` (no server prefetch) → used for user-specific or client-state-driven data.
  **Rule:** Prefer passing props. Use prefetch only when the Client Component needs reactive cache behavior (mutations, refetches) that props cannot provide.
- **Error handling:** Global interceptor normalizes axios errors into `ApiError` with status code. Expected failures: 401 (redirect), 403 (access denied), 404 (not-found), 429 (rate limit), 500 (generic + retry). Server Components use try/catch + `notFound()`. Client Components use TanStack Query error states. Global render errors caught by `app/error.tsx`.
- **Environment variables:** Minimal set validated with Zod at build time.
  ```
  NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
  STRIPE_SECRET_KEY=sk_test_...       # Server-only
  ADMIN_EMAIL=admin@buynest.com       # Server-only
  ```
  Build fails if required variables are missing. No `dotenv` package.

## 11. TanStack Query

- **Scope:** Client-side server state only. Not for URL state, form state, or UI state.
- **Use for:** User-specific data (cart, wishlist, orders, profile), frequently updated data, filtered/sorted/searched data, data dependent on client-side state.
- **Do NOT use for:** URL state (`?category=electronics`), form state (React Hook Form), UI state (`useState`), Server Component initial data, static imports.
- **Query keys:** Centralized in `src/lib/query-keys.ts` as factory functions. Never hardcoded.
- **Queries:** `useQuery` for reads. `useInfiniteQuery` only for scroll-based feeds; standard pagination for e-commerce listings. Dependent queries use `enabled: !!id`.
- **Mutations:** `useMutation` for all writes. Return updated entities. Disable buttons with `mutation.isPending`.
- **Cache invalidation:** Explicit after mutations. Invalidate list + detail queries. Use `queryKeys` factories, never string filters.
- **Optimistic updates:** Allowed only for cart quantity changes and wishlist toggle. Always provide `onError` rollback and `onSettled` invalidation. Not used for checkout, login, or admin mutations.
- **Hydration / prefetch strategy:**
  1. Server Component fetches data directly and passes as props → Client Component consumes props (no TanStack Query needed).
  2. Server Component prefetches data with `prefetchQuery` → Client Component uses `useQuery` with the same key (instant cache hit, then reactive updates).
  3. Client Component fetches independently with `useQuery` (no server prefetch) → used for user-specific or client-state-driven data.
  **Rule:** Prefer passing props. Use prefetch only when the Client Component needs reactive cache behavior (mutations, refetches) that props cannot provide.
- **Loading/error/empty states:** Every query handles all three. Loading uses content-matching skeletons. Error states are actionable. Empty states guide user action.
- **Rule:** Server Components do not use TanStack Query. Client Components do not use `useEffect` + `useState` for server data.

## 12. State Management

No global state library. Five categories, each with a single source of truth and technology.

| Category | Technology | Global? | Persistence |
|----------|-----------|---------|-------------|
| Server state | TanStack Query | No (library cache) | In-memory per tab |
| URL state | `nuqs` (primary), `useSearchParams` (simple cases) | No (URL is store) | Across sessions/tabs |
| Form state | React Hook Form | No (component-scoped) | None |
| UI state | Component `useState` | No | None |
| Session state | httpOnly cookies + TanStack Query | No (library cache) | Cookies persistent |

- **Server state:** Source of truth is backend DB. Server Components `await` API functions. Client Components use `useQuery` / `useMutation`. No `CartContext`, `AuthContext`, or `ProductContext`.
- **URL state:** Source of truth is the browser URL. Use for search, filters, sort, pagination, active tab. Never mirror URL state in React state.
- **Form state:** Source of truth is the form itself. React Hook Form with Zod. Never lifts to a global store.
- **UI state:** Source of truth is component-local `useState` / `useReducer`. Use isolated Context only when state must be shared by adjacent siblings (e.g., drawer + trigger).
- **Session state:** Source of truth is backend session store (httpOnly cookies). Client-side `useAuth()` wraps a TanStack Query on `/user` with 5-minute stale time. Frontend never reads, writes, or stores tokens.
- **Zustand/Redux:** Not used. No state fits their sweet spot. If a future requirement emerges, evaluate then. Do not add preemptively.

## 13. Authentication

- **Mechanism:** httpOnly cookies with refresh-token rotation. Frontend never reads, writes, or stores tokens.
- **Axios:** `withCredentials: true`. Cookies sent automatically. No `Authorization` headers.
- **Server-side:** Middleware reads cookies and redirects unauthenticated users before page render. Server Components call `getCurrentUser()` directly when needed for SSR.
- **Client-side:** `useAuth()` hook wraps `useQuery` on `/user` with `staleTime: 5 * 60_000`, `retry: false`.
- **Protected routes:**
  - **Middleware (primary):** Server-side guard in `middleware.ts`. Prevents flash of unauthenticated content. Protects Server Components and most Client Components without extra code.
  - **ProtectedRoute (client-only subtrees):** Use only when a client-only subtree genuinely requires a guard that middleware cannot cover. Uses `useAuth()` + `useRouter`.
- **Login/Register/Logout:**
  - Forms use React Hook Form + Zod + `useMutation`.
  - On success: invalidate auth query, redirect to `/account`.
  - On error: show backend message inline. Do not redirect.
  - Logout: call `logout()`, invalidate all queries, redirect to `/`.
- **Auth errors:** Generic "Invalid email or password" for 401. Do not distinguish "user not found" vs "wrong password" to prevent user enumeration. Do not log PII.
- **No `localStorage`.** No manual token refresh. No client-side `useEffect` redirects for auth (causes flash).

## 14. Forms and Validation

- **Forms:** All forms use React Hook Form in Client Components. Uncontrolled inputs by default.
- **Validation:** Zod is the single source of truth. `@hookform/resolvers/zod` for integration. Every form has a Zod schema.
- **Schemas:** Live in `src/features/[domain]/schemas/`. Shared between client and server where possible. Error messages are user-friendly.
- **Submission:** `useMutation` from TanStack Query. Disable submit button with `mutation.isPending` or `formState.isSubmitting`.
- **Error handling:**
  - Client-side Zod errors: displayed inline below the field.
  - Backend validation errors: `ApiError.response?.data?.errors` displayed inline or as toast.
  - Field-level errors below the field. Global errors at the top.
- **Security:** Frontend validation is UX only. Backend is the security boundary. Schemas mirror backend constraints.
- **Rules:** No `useState` for form inputs. No Formik. No Server Actions for auth mutations unless required. No optimistic updates for auth mutations.

## 15. Loading/Error/Empty States

- **Server-side loading:** Route-level `loading.tsx` files with skeletons that match final content shape. No full-page spinners on authenticated pages.
- **Server-side errors:** `app/error.tsx` global boundary. Segment-level `error.tsx` for context-aware fallbacks. `notFound()` for 404 in Server Components.
- **Client-side loading:** TanStack Query `isLoading` → skeleton. `isFetching` with existing data → subtle overlay or no UI change.
- **Client-side errors:** TanStack Query `error` → `Alert` with retry button. Actionable messages. Never generic "Something went wrong".
- **Empty states:** Icon, title, description, optional action link. Every list/grid has an empty state.
- **Form states:** Submit button shows "Signing in..." and is disabled during mutation. Never allow double submission.
- **Rule:** Every query and every list/grid has loading, error, and empty states.

## 16. Responsive Design

- **Mobile-first:** Write base styles for mobile. Add `sm:`, `md:`, `lg:`, `xl:` overrides. No `max-width` media queries.
- **Breakpoints:**
  - `< md` (mobile): Single column, stacked grids, hamburger menu, icons-only header, full-width forms, `h-11` (44px) touch targets.
  - `md` – `lg` (tablet): 2-column product grids, horizontal nav, visible search/categories.
  - `lg`+ (desktop): 3–4 column product grids, full nav with category chips.
- **Fluid grids:** `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`.
- **Content reflow:** Prefer stacking and reordering over hiding content on mobile.
- **Containers:** `container mx-auto px-4` with `max-w-7xl` for store. Admin layouts use wider containers (`max-w-full` with `overflow-x-auto`) to accommodate data tables.

## 17. Accessibility

- **Standard:** WCAG 2.1 AA.
- **Semantic HTML:** `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>` instead of `<div>`. Buttons are `<button>`. Links are `<a>` or `<Link>`.
- **ARIA:** Icon-only buttons have `aria-label`. Dialogs have `role="dialog"`, `aria-modal="true"`, `aria-labelledby`. Tabs have `role="tablist"`, `role="tab"`, `role="tabpanel"`. Status updates use `aria-live`. Expandable sections use `aria-expanded`.
- **Keyboard navigation:** All interactive elements focusable. Focus order follows visual order. Focus visible in all states (`focus-visible:ring-2`). Dialogs trap focus and return focus on close. Dropdowns support arrow keys.
- **Color contrast:** Body text 4.5:1 minimum. Large text 3:1 minimum. Do not rely on color alone.
- **Screen readers:** Images have descriptive `alt` or `alt=""` for decorative. Form errors linked via `aria-describedby`. Loading states use `aria-busy="true"`.
- **Testing:** `jest-axe` on critical components. Manual keyboard check before PR merge.

## 18. SEO

- **Metadata API:** `generateMetadata` colocated with every dynamic page. Global defaults in root layout. Route group defaults in group layouts.
- **Dynamic pages:** Product pages export title, description, OG image, OG title per product. Category pages export title/description per category.
- **Files:** `app/sitemap.ts` (dynamic from products/categories), `app/robots.ts` (robots config), JSON-LD for `Organization` (global) and `Product` (per product).
- **Image optimization:** All product images use `next/image` with explicit dimensions or `fill`. `remotePatterns` in `next.config.ts`.
- **Font optimization:** `next/font` for zero layout shift.
- **Quality gate:** Lighthouse SEO score > 90. Every dynamic page exports `generateMetadata`. No raw `<img>` tags.

## 19. Performance

- **Core Web Vitals targets (aim to meet):** LCP < 2.5s, INP < 200ms, CLS < 0.1. These are measured targets, not hard build gates. Review against actual user metrics.
- **Rendering:** Server Components by default reduce client JS. SSR for dynamic data, SSG/ISR for static content.
- **Images:** `next/image` with WebP/AVIF, responsive sizing, lazy loading offscreen images.
- **Fonts:** `next/font` prevents FOIT and layout shift.
- **Loading:** `loading.tsx` skeletons at every data-fetching route. No full-page spinners unless the entire page loads for the first time.
- **Bundle (targets):** First Load JS < 200KB for store pages. No single chunk > 100KB. Review bundle size on every dependency change; treat these as guidelines, not hard failures. Use `@next/bundle-analyzer` in development (`ANALYZE=true`).
- **Caching:** TanStack Query cache for client-side data. `staleTime` tuned per domain: catalog 60s, cart 30s, profile 5min.
- **Monitoring:** `web-vitals` in production. Vercel Analytics or equivalent. 75th percentile should aim to meet targets.

## 20. Testing

- **Unit testing:** Vitest. `lib/format.ts`, `lib/query-keys.ts`, `lib/env.ts`, feature hooks, Zod schemas. Target 80% coverage for utilities and hooks.
- **Component testing:** React Testing Library via Vitest. Co-located `*.test.tsx` files. Test rendering, interactions, accessibility basics. Target 60% coverage for components. All interactive components have at least one test.
- **Integration testing:** Vitest + MSW. Test feature flows (add to cart → count updates, login → auth state, search → filters → URL). Critical paths: auth, cart, checkout.
- **E2E testing:** Playwright. `e2e/` directory. Test auth flow, cart flow, checkout flow, admin flow. Run against local production builds (`next start`) during development. CI additionally runs against deployed preview environments.
- **Accessibility testing:** `jest-axe` on critical components (`LoginForm`, `ProductCard`, etc.). Zero violations.
- **CI pipeline:** `npm ci` → `tsc --noEmit` → `eslint .` → `prettier --check .` → `vitest --run` → `next build`. All stages must pass before merge.

## 21. Security

- **Authentication:** httpOnly cookies only. No `localStorage`. No `Authorization` headers. No manual token refresh. Backend manages session validation and refresh-token rotation.
- **Route guards:** Next.js middleware is the primary server-side guard. `ProtectedRoute` is only used for client-only subtrees that genuinely require it.
- **Input validation:** Zod on all forms (client-side UX, server-side security boundary). Backend enforces constraints.
- **Security headers:** `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` in `next.config.ts`.
- **CSRF:** Backend validates. Axios `withCredentials: true` sends cookies automatically.
- **XSS:** No `dangerouslySetInnerHTML` without sanitization.
- **Rate limiting:** Backend only. Frontend rate limiting is trivially bypassed.
- **Secrets:** Server-only env vars (`STRIPE_SECRET_KEY`, `ADMIN_EMAIL`) never exposed to client. Build fails if leaked.
- **Logging:** Do not log auth errors with PII (email, password).

## 22. Environment Configuration

- **Loading:** Next.js loads `.env.local`, `.env.development`, `.env.production` automatically. No `dotenv` package.
- **Validation:** `src/lib/env.ts` uses Zod to parse `process.env`. Imported at startup to fail fast on missing variables.
- **Public variables:** Prefixed `NEXT_PUBLIC_`. Exposed to client bundle. Minimal set.
- **Server-only variables:** No prefix. Accessible only in Server Components, Server Actions, API routes.
- **Required variables:**
  ```
  NEXT_PUBLIC_API_URL
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  STRIPE_SECRET_KEY (server-only)
  ADMIN_EMAIL (server-only)
  ```
- **Rule:** No hardcoded API URLs. All URLs use `NEXT_PUBLIC_API_URL`.

## 23. Dependency Rules

- **Evaluate before adding:** Determine if the need can be solved with native APIs or existing packages.
- **Bundle review:** Check bundle size impact before adding any dependency. Use `@next/bundle-analyzer`.
- **Remove unused:** Audit with `depcheck` quarterly. Remove immediately.
- **Pin critical versions:** Next.js, React, TanStack Query. Use exact or `~` ranges.
- **Audit:** `npm audit` in CI. Fail on high/critical vulnerabilities.
- **Server vs client:** Ensure server-only packages (e.g., Stripe Node SDK) are not imported in Client Components. Use dynamic imports or conditional requires if needed.
- **No duplicate packages:** Single source for each capability (one HTTP client, one form library, one validation library, one icon library).

## 24. Anti-Duplication Rules

- **No duplicate components:** Search before creating. If a similar component exists, extend it. Merge `ProductCard.jsx` and `ProductCard1.jsx`.
- **No duplicate logic:** If `formatPrice` appears in two files, extract to `lib/format.ts`. If the same API call appears in two features, it belongs in `lib/api/`.
- **No mixed-responsibility components:** A component should have one reason to change. If it mixes data fetching, business logic, and presentation, split it.
- **No universal components:** Do not create a `UniversalCard` for every use case. Create focused components (`ProductCard`, `OrderCard`).
- **No prop drilling through unrelated subtrees:** If data must pass through 3+ unrelated layers, extract the data access into the intermediate component instead of threading props.
- **No arbitrary values:** No `bg-[#123456]`, `mt-[13px]`, `gap-[2.5rem]`. Add to token system if needed.
- **No unnecessary abstractions:** No `useToggle` for simple `useState(false)`. No `useApi` wrapper around `useQuery` without real value. No HOCs. No `withAuth`.
- **No duplicate state management:** No Redux + Context + useState for the same data.

## 25. AI Development Rules

1. **One API client only.** Import from `src/lib/api/`. Do not create new axios instances, fetch wrappers, or service classes.
2. **One module per domain.** Do not add cart methods to `products.ts` or order methods to `cart.ts`.
3. **Always unwrap the envelope.** Components receive plain entities, not `ApiResponse<T>`.
4. **No `localStorage` for tokens or session data.** httpOnly cookies are the only auth mechanism.
5. **No manual `fetch` in components.** All data access goes through `src/lib/api/` functions.
6. **Server Components `await` API functions directly.** Do not wrap them in `prefetchQuery` unless prefetching for a Client Component.
7. **Client Components use TanStack Query for data.** Do not use `useEffect` + `useState` for server data.
8. **Mutations invalidate on success.** No exceptions without explicit architectural review.
9. **Optimistic updates are opt-in and documented.** Only for cart quantity and wishlist toggle.
10. **Error handling is normalized.** Every API function throws `ApiError`. Callers inspect `error.status`.
11. **No global state libraries.** Do not create `AuthContext`, `cartSlice`, `CartContext`, or install Redux/Zustand.
12. **All forms use React Hook Form + Zod.** No `useState` for form inputs.
13. **Zod schemas mirror backend constraints.** Enforce min length, required fields before network.
14. **Auth errors are generic.** Do not reveal whether an email exists or a password is wrong.
15. **Middleware is the primary route protection.** `ProtectedRoute` is only for client-only subtrees.
16. **Query keys are never hardcoded.** Import from `lib/query-keys.ts` factory functions.
17. **Every query has loading, error, and empty states.** No silent failures.
18. **No `'use client'` on pages unless necessary.** Extract interactive parts into child Client Components.
19. **Pages are thin.** Compose components; do not contain business logic.
20. **If unsure where state belongs, do not default to a global store.** Ask or use the five state categories.

## 26. Definition of Done

A feature is complete when all of the following are satisfied:

- [ ] **Type safety:** `tsc --noEmit` passes with zero errors. No `any` types without explicit justification.
- [ ] **Lint:** `eslint .` passes with zero errors.
- [ ] **Format:** `prettier --check .` passes.
- [ ] **Tests:** `vitest --run` passes. Critical paths covered. Interactive components have at least one test. Critical components pass `jest-axe`.
- [ ] **Build:** `next build` succeeds with no errors or warnings.
- [ ] **Performance:** First Load JS reviewed and within target budget (< 200KB ideal). No single chunk exceeds target budget (< 100KB ideal). `next/image` used for all images. No raw `<img>` tags. No full-page spinners on authenticated pages.
- [ ] **Accessibility:** Manual keyboard navigation check passed. Icon buttons have `aria-label`. Form inputs have labels. Color contrast meets WCAG AA.
- [ ] **SEO:** `generateMetadata` exported. Title, description, and OG tags present. No broken links.
- [ ] **Security:** No tokens in `localStorage`. No hardcoded secrets. Protected routes guarded by middleware; `ProtectedRoute` used only where client-only subtrees require it. Forms validate with Zod. No `dangerouslySetInnerHTML` without sanitization.
- [ ] **Architecture:** Server Components fetch directly. Client Components use TanStack Query. No global state library. No duplicate components or logic. No giant components. Design tokens used; no arbitrary colors or spacing.
- [ ] **E2E (if applicable):** Playwright tests pass on local production build (and on deployed preview when available).
- [ ] **Smoke test:** Homepage loads, login works, product detail loads, add to cart works, checkout reaches payment step.
