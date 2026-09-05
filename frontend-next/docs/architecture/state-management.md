# State Management Architecture

This document defines the application's state ownership strategy. It is a companion to `api-architecture.md` and `tanstack-query.md`.

## Guiding Principle
Do not print the detailed analysis in the terminal.

Read:

docs/architecture/api-architecture.md
docs/architecture/tanstack-query.md

Also inspect the existing repository.

Create:

docs/architecture/state-management.md

Define the application's state ownership strategy.

Cover ONLY:

1. Server state
2. URL state
3. Local UI state
4. Form state
5. Authentication/session state
6. Cart state
7. Wishlist state
8. Truly global client state

For each category define:

* source of truth
* technology/location
* persistence
* whether it should be global

Explicitly evaluate whether Zustand is necessary.

Do not introduce Redux unless there is a compelling architectural reason.

Prevent multiple sources of truth.

Do NOT implement anything.
Do NOT install packages.
Do NOT modify application source code.

Write the complete result directly into the file.

After completion output ONLY:

DONE: docs/architecture/state-management.md

Then provide at most 5 short bullet points.

There is no global state management library. The application uses five distinct state categories, each with a single source of truth and a single technology.

| Category | Technology | Global? |
|----------|-----------|---------|
| Server state | TanStack Query | No (library-managed cache) |
| URL state | `nuqs` / `useSearchParams` | No (URL is the store) |
| Form state | React Hook Form | No (component-scoped) |
| UI state | Component `useState` | No (component-scoped) |
| Session state | httpOnly cookies + TanStack Query | No (library-managed cache) |

Zustand is **not used**. There is no state that fits Zustand's sweet spot: client state shared across distant components but not worth TanStack Query or URL state. If a future requirement emerges, evaluate it then. Do not add it preemptively.

Redux is **not used**. The audit found duplicate state management in Redux + AuthContext + admin Context, all partially broken. Eliminating it removes a large dependency, reduces bundle size, and simplifies debugging.

---

## 1. Server State

**Definition:** Data that lives on the backend and is fetched into the client.

**Source of truth:** Backend database.

**Technology/location:**
- **Server Components:** `await` API functions directly from `src/lib/api/`.
- **Client Components:** `useQuery` / `useMutation` from TanStack Query, calling the same API functions.

**Persistence:** TanStack Query cache (in-memory, per tab). Server Components do not cache; they refetch on every request.

**Global?** No. TanStack Query manages a global cache, but components do not subscribe to a global store. They declare their data needs declaratively with `useQuery`.

**Examples:**
- Products, categories
- Cart contents and totals
- Orders and order detail
- Wishlist items
- User profile (after initial server fetch)
- Admin stats, product lists, order lists

---

## 2. URL State

**Definition:** Data that the user might want to bookmark, share, or navigate back to.

**Source of truth:** The browser URL.

**Technology/location:**
- `nuqs` (type-safe URL state) for complex filters, search, sort, pagination.
- `useSearchParams` from `next/navigation` for simple cases.

**Persistence:** URL persists across sessions, tabs, and refreshes.

**Global?** No. The URL is the global store by nature, but components read it reactively via hooks. There is no in-memory global state mirroring the URL.

**Examples:**
- Search query: `?q=laptop`
- Category filter: `?category=electronics`
- Price range: `?minPrice=500&maxPrice=2000`
- Sort: `?sort=price-asc`
- Page: `?page=2`
- Active tab: `?tab=addresses`

**Rule:** If a user refreshes the page and the state is lost, it belongs in the URL.

---

## 3. Local UI State

**Definition:** Ephemeral, component-scoped state that does not need to survive navigation or be shared.

**Source of truth:** Component-local `useState` / `useReducer`.

**Technology/location:**
- `useState` in the component that owns the state.
- Small, isolated contexts (e.g., toast notifications) when state must be shared by a few adjacent components.

**Persistence:** None. Lost on unmount.

**Global?** Never.

**Examples:**
- Mobile menu open/closed
- Dialog / modal visibility
- Active tab (if not shareable)
- Toast queue
- Accordion expanded/collapsed
- Hover states, focus states

**Rule:** If only one component (and its direct children) needs the state, it stays local. Do not lift state to a global store "just in case."

---

## 4. Form State

**Definition:** Input values, validation errors, and submission status for forms.

**Source of truth:** The form itself.

**Technology/location:**
- React Hook Form in Client Components.
- Zod schemas for validation.

**Persistence:** None. Forms are reset on submission or navigation.

**Global?** Never.

**Examples:**
- Login form (email, password, errors)
- Signup form (name, email, password, confirm password)
- Checkout address form (address line, city, state, pincode)
- Contact form
- Admin product form (name, price, category, images)

**Rule:** Form state never leaks into a global store. If two forms need the same data, they each manage their own state.

---

## 5. Authentication / Session State

**Definition:** The current authenticated user and session validity.

**Source of truth:** Backend session store (httpOnly cookies).

**Technology/location:**
- **Server-side:** Next.js middleware reads cookies. Server Components call `getCurrentUser()` directly.
- **Client-side:** `useAuth()` hook wraps a TanStack Query `useQuery` on `/user`.

**Persistence:**
- Cookies: httpOnly, persistent across sessions (refresh token rotation).
- TanStack Query cache: 5-minute stale time in memory.

**Global?** No. TanStack Query manages a global cache, but the auth state is derived from a server query, not a global store.

**Rule:** The frontend never reads, writes, or stores tokens. No `localStorage`, no `Authorization` header, no manual token refresh.

---

## 6. Cart State

**Definition:** Cart items, quantities, totals, applied coupons.

**Source of truth:** Backend cart document (user-scoped in MongoDB).

**Technology/location:**
- **Server-side:** Server Components fetch cart via `getCart()` if needed for initial render.
- **Client-side:** `useQuery` for reading, `useMutation` for writes. Optimistic updates for quantity changes.

**Persistence:** Backend (database) + TanStack Query cache (in-memory).

**Global?** No. TanStack Query cache is global in scope, but components declare their needs with `useQuery`. There is no cart store, cart slice, or cart context.

**Rule:** Cart is server state, not client state. Do not create a `cartSlice`, `cartContext`, or cart reducer. The audit found cart duplicated in Redux and AuthContext, both broken.

---

## 7. Wishlist State

**Definition:** Wishlist items and item count.

**Source of truth:** Backend wishlist document.

**Technology/location:**
- **Client-side:** `useQuery` for reading, `useMutation` for writes. Optimistic updates for toggle.

**Persistence:** Backend + TanStack Query cache.

**Global?** No. Same as cart.

**Rule:** Wishlist is server state. Do not create a `wishlistSlice` or `wishlistContext`.

---

## 8. Truly Global Client State

**Definition:** State that must be accessed from unrelated parts of the component tree without prop drilling, and is not server state, URL state, form state, or UI state.

**Verdict: None.**

After evaluating all state categories, there is no remaining state that requires a global client store.

**What was considered and rejected:**
- **Cart count badge in Header:** Derived from TanStack Query `useQuery(['cart'])`. The Header is a Client Component; it can call `useQuery` directly.
- **User name in Header:** Derived from `useAuth()` (TanStack Query). No global store needed.
- **Theme (light/dark):** Stored in `localStorage` + `data-theme` attribute on `<html>`. Read by CSS custom properties. No React state needed unless toggling.
- **Toast notifications:** Small, isolated context or `sonner` library. Not a global store.
- **Cart drawer open/closed:** Local `useState` in the Header or a tiny `CartDrawerContext` for the drawer + trigger. Not a global store.

**If a future requirement emerges** that genuinely needs global client state (e.g., a complex multi-step wizard spanning unrelated routes), evaluate Zustand at that time. Do not add it preemptively.

---

## State Ownership Summary

| State | Source of Truth | Technology | Location | Global? | Persists Across Refresh? |
|-------|-----------------|------------|----------|---------|--------------------------|
| Products | Backend DB | TanStack Query | `features/products/hooks/` | No | No (refetched) |
| Categories | Backend DB / static import | TanStack Query / import | `lib/categories.ts` | No | N/A |
| Cart | Backend DB | TanStack Query | `features/cart/hooks/` | No | No (refetched) |
| Wishlist | Backend DB | TanStack Query | `features/wishlist/hooks/` | No | No (refetched) |
| Orders | Backend DB | TanStack Query | `features/orders/hooks/` | No | No (refetched) |
| User profile | Backend session | TanStack Query | `features/auth/hooks/` | No | No (refetched) |
| Search query | URL | `nuqs` / `useSearchParams` | Search component | No | Yes |
| Filters | URL | `nuqs` / `useSearchParams` | Filter components | No | Yes |
| Sort | URL | `nuqs` / `useSearchParams` | Sort component | No | Yes |
| Pagination | URL | `nuqs` / `useSearchParams` | Pagination controls | No | Yes |
| Form values | Component | React Hook Form | Form components | No | No |
| Form errors | Component | React Hook Form + Zod | Form components | No | No |
| Mobile menu | Component | `useState` | Header | No | No |
| Dialog visibility | Component | `useState` | Parent component | No | No |
| Active tab | Component / URL | `useState` or URL | Tab component | No | No |
| Theme | `localStorage` + CSS | `data-theme` attribute | Root layout | No | Yes |
| Toast queue | Component context | `sonner` or small context | Toast provider | No | No |

---

## Rules Future Developers and AI Agents Must Follow

1. **No Redux.** Do not install `@reduxjs/toolkit` or `react-redux`. Do not create slices, reducers, or actions.
2. **No Zustand (for now).** Do not install `zustand` unless a future requirement genuinely cannot be solved with the five state categories above.
3. **No `localStorage` for tokens or session data.** httpOnly cookies are the only auth mechanism.
4. **No global contexts for server data.** Do not create `CartContext`, `AuthContext`, or `ProductContext`. Use TanStack Query.
5. **No prop drilling for server data.** If you are passing cart data through 3+ layers, the intermediate component should call `useQuery` directly.
6. **URL state is not duplicated in React state.** Do not mirror `?category=electronics` in a `useState` category variable. Read from the URL.
7. **Form state stays in the form.** Do not lift form values to a parent or global store unless the values are needed by an unrelated component after submission.
8. **UI state stays local.** Do not lift modal visibility, menu state, or tab state to a global store.
9. **If you are unsure where state belongs, ask.** Do not default to a global store because it feels familiar.

---

## Important Tradeoffs

- **No global state library vs prop drilling:** Prop drilling is acceptable for layout data (e.g., user name from Header to Footer). For deep trees, components call `useQuery` directly. This is simpler than introducing a global store.
- **TanStack Query cache vs URL state:** TanStack Query cache is in-memory and lost on refresh. URL state persists. Use URL state for anything the user expects to survive a refresh (filters, search, pagination). Use TanStack Query for data that can be refetched.
- **Local `useState` vs Context for UI state:** Context adds re-render overhead and complexity. Use it only when state must be shared by siblings or distant components (e.g., a modal trigger in Header and a modal in the page body). For parent-child state, use `useState` + props.
- **React Hook Form vs local `useState` for forms:** React Hook Form reduces re-renders and integrates with Zod. Do not use `useState` for form inputs unless the form is extremely simple (single field).
- **No Zustand vs future complexity:** If the app grows to have truly cross-cutting client state (e.g., a global mini-cart that updates without a query), Zustand can be added later without rewriting the entire state layer. The current architecture is designed to accommodate this if needed.
