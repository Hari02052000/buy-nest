# TanStack Query / Data-Fetching Strategy

This document defines the TanStack Query data-fetching strategy for the Next.js e-commerce frontend. It is a companion to `api-architecture.md`, which defines the API client, types, and service boundaries.

## 1. What Data Uses TanStack Query

TanStack Query manages **client-side server state** — data that lives on the backend and is consumed in Client Components.

**Use TanStack Query for:**
- User-specific data: cart, wishlist, orders, user profile
- Frequently updated data: cart quantity changes, order status updates
- Filtered/sorted/searched data: product listings, search results
- Data dependent on client-side state: current filter set, active search query

**Specific examples:**
- Product lists filtered by category, price, brand
- Cart contents and totals
- Order history and order detail
- Wishlist items
- User profile data (after initial server fetch)
- Admin product lists, order lists, dashboard stats

## 2. What Data Must NOT Use TanStack Query

TanStack Query is for **server state only**. Do not use it for:

- **URL state:** filters, search queries, sort, pagination — these belong in URL search parameters via `nuqs` or `useSearchParams`
- **Form state:** input values, validation errors — these belong in React Hook Form
- **UI state:** modal open/closed, mobile menu, active tab — these belong in component-local `useState`
- **Server Component initial data:** Server Components fetch directly with `await`; no TanStack Query needed for the initial HTML payload
- **Static data:** hardcoded constants, theme tokens, category trees that do not change — these are imports, not queries

## 3. Server Component Fetching

Server Components fetch data **directly** with `async/await`. They do not use TanStack Query.

**Pattern:**
```tsx
import { getProduct, getRelatedProducts } from '@/lib/api/products';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const [product, related] = await Promise.all([
    getProduct(params.id),
    getRelatedProducts(params.id),
  ]);
  return <ProductDetailClient product={product} related={related} />;
}
```

**Why:** Server Components run only on the server. They have access to cookies and can return HTML with data already embedded. TanStack Query would add unnecessary client-side loading states and refetches for data that is already in the page.

**Prefetching exception:** When a Server Component knows a Client Component will need data, it can warm the TanStack Query cache with `prefetchQuery`. This is not "fetching with TanStack Query" — it is seeding the cache for the client.

## 4. Client Component Fetching

Client Components use `useQuery` for data that is:
- User-specific (cart, orders, wishlist)
- Updated by mutations (cart after add/remove)
- Driven by client-side state (filters, search, sort)
- Too expensive to prefetch for every possible state combination

**Pattern:**
```tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api/products';

export function ProductGrid({ category }: { category: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', 'list', category],
    queryFn: () => getProducts(category),
  });
  // ...
}
```

**Rule:** If a Server Component already fetched the data and passed it as props, the Client Component must not refetch it. The Client Component receives data via props.

## 5. Query Keys

Query keys are **centralized** in `src/lib/query-keys.ts` as factory functions.

**Pattern:**
```ts
export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (category: string, filters: ProductFilters) =>
      [...queryKeys.products.all, 'list', category, filters] as const,
    detail: (id: string) => [...queryKeys.products.all, 'detail', id] as const,
  },
  cart: {
    all: ['cart'] as const,
    detail: () => [...queryKeys.cart.all, 'detail'] as const,
  },
  orders: {
    all: ['orders'] as const,
    list: (status?: string) => [...queryKeys.orders.all, 'list', status] as const,
    detail: (id: string) => [...queryKeys.orders.all, 'detail', id] as const,
  },
  wishlist: {
    all: ['wishlist'] as const,
    detail: () => [...queryKeys.wishlist.all, 'detail'] as const,
  },
};
```

**Rules:**
- Never hardcode query keys in components. Always import from `queryKeys`.
- Factory functions accept parameters and return tuples. This prevents typos and enables type-safe invalidation.
- The top-level key (e.g., `'products'`) is the namespace. Sub-keys are `'list'`, `'detail'`, etc.

## 6. Queries

All client-side data fetching uses `useQuery`. No `useEffect` + `useState` for server data.

**Standard query:**
```tsx
const { data, isLoading, error, isFetching } = useQuery({
  queryKey: queryKeys.products.list(category, filters),
  queryFn: () => getProducts(category, filters),
  staleTime: 60_000,
  gcTime: 5 * 60_000,
});
```

**Dependent queries:**
```tsx
const { data: product } = useQuery({
  queryKey: queryKeys.products.detail(id),
  queryFn: () => getProduct(id),
  enabled: !!id,
});
```

**Disabled queries:**
Use `enabled: false` when the query should not run until a condition is met (e.g., user is authenticated, ID exists).

## 7. Mutations

All writes use `useMutation`.

**Pattern:**
```tsx
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: () => addToCart(productId, quantity),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
  },
  onError: (error) => {
    toast.error(error.message);
  },
});
```

**Return values:** Mutations should return the updated entity (e.g., updated cart) so the caller can react if needed.

**Loading states:** Use `mutation.isPending` to disable buttons during submission. Do not use global loading spinners for mutations.

## 8. Cache Invalidation

Invalidation is **explicit** after mutations. No time-based cache busting for user actions.

**Rules:**
- After creating/updating/deleting an item, invalidate the list query and the detail query.
- After mutating cart, invalidate all cart queries (`queryKeys.cart.all`).
- After toggling wishlist, invalidate wishlist + product list if wishlist count affects the UI.

**Example:**
```ts
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
  // Invalidates both list and detail queries
}
```

**Do NOT:**
- Invalidate everything on every mutation.
- Use `invalidateQueries` with string filters. Always use the centralized `queryKeys` factories.

## 9. Optimistic Updates

Optimistic updates are used **sparingly** for high-frequency, low-risk actions.

**Allowed:**
- Cart quantity changes (increment/decrement)
- Wishlist toggle (add/remove)

**Not allowed:**
- Checkout / create order (irreversible, financial)
- Login / register (security-critical)
- Admin mutations (data integrity)

**Pattern:**
```tsx
const mutation = useMutation({
  mutationFn: updateCartItemQuantity,
  onMutate: async (newQuantity) => {
    await queryClient.cancelQueries({ queryKey: queryKeys.cart.detail() });
    const previous = queryClient.getQueryData(queryKeys.cart.detail());
    queryClient.setQueryData(queryKeys.cart.detail(), (old) => ({
      ...old,
      items: old.items.map(item =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      ),
    }));
    return { previous };
  },
  onError: (_, __, context) => {
    queryClient.setQueryData(queryKeys.cart.detail(), context?.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
  },
});
```

**Rules:**
- Always provide an `onError` rollback.
- Always invalidate in `onSettled` to reconcile with server truth.
- Document every optimistic update in the component.

## 10. Pagination / Infinite Queries

Pagination uses URL search parameters (`?page=2`). The page number is part of the query key.

**Standard pagination:**
```tsx
const { data, isLoading } = useQuery({
  queryKey: ['products', 'list', category, filters, page],
  queryFn: () => getProducts(category, filters, page),
});
```

**Infinite queries** (for scroll-based loading):
```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['products', 'list', category],
  queryFn: ({ pageParam }) => getProducts(category, { page: pageParam }),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => lastPage.nextPage,
});
```

**Rule:** Use standard pagination for e-commerce product listings. Use infinite queries only for feeds or history lists where scroll-based loading is expected.

## 11. Prefetching

Server Components prefetch queries to warm the cache before hydration.

**Pattern:**
```tsx
import { prefetchQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  await prefetchQuery(queryClient, {
    queryKey: ['products', 'list', params.category],
    queryFn: () => getProducts(params.category),
  });
  return <ProductGrid category={params.category} />;
}
```

**When to prefetch:**
- The next likely navigation target (e.g., prefetch product detail from product grid)
- Data that is expensive to fetch and likely needed immediately
- Data that does not depend on client-side state

**When NOT to prefetch:**
- Data behind user-specific filters that are unpredictable
- Data that is large and unlikely to be needed
- Already-fetched data (avoid duplicate prefetches)

## 12. SSR / Hydration

Server Components fetch initial data directly. TanStack Query hydrates on the client.

**Prefetch + hydrate pattern:**
```tsx
// Server Component
await prefetchQuery(queryClient, {
  queryKey: queryKeys.products.detail(id),
  queryFn: () => getProduct(id),
});
return <ProductDetailClient id={id} />;

// Client Component
export function ProductDetailClient({ id }: { id: string }) {
  const { data } = useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProduct(id),
  });
  // `data` is available immediately from the prefetched cache
}
```

**Rule:** If a Server Component prefetches data, the corresponding Client Component must use the exact same query key and query function. Mismatched keys cause unnecessary refetches.

## 13. Loading / Error States

Every query must handle loading and error states.

**Loading:**
```tsx
if (isLoading) return <ProductGridSkeleton />;
if (isFetching && !isLoading) return <ProductGrid data={data} overlay />;
```

**Error:**
```tsx
if (error) {
  if (error instanceof ApiError && error.status === 404) {
    return <NotFound />;
  }
  return <Alert variant="destructive">Failed to load products.</Alert>;
}
```

**Empty:**
```tsx
if (!data || data.length === 0) {
  return <EmptyState title="No products found" />;
}
```

**Rules:**
- Every query has loading, error, and empty states.
- Loading states use skeletons that match the final content shape.
- Error states show actionable messages. Generic "Something went wrong" is not acceptable.
- Empty states guide the user to action (e.g., "Browse categories").

## 14. Server / Client Boundaries

| Concern | Owner | Rationale |
|---------|-------|-----------|
| Initial page data | Server Component | SEO, LCP, no client JS needed |
| User-specific initial data | Server Component + prefetch | Auth cookies available server-side |
| Subsequent client data | Client Component + `useQuery` | Reactivity, caching, mutations |
| Mutations | Client Component + `useMutation` | User interaction, optimistic updates |
| URL-driven state | Client Component reads URL, drives query key | Shareable, bookmarkable |
| Form state | Client Component + React Hook Form | Uncontrolled inputs, validation |
| UI state | Client Component + `useState` | Ephemeral, component-scoped |

**Rule:** TanStack Query lives entirely in Client Components. Server Components do not import `useQuery`. Server Components do not use TanStack Query devtools.

## 15. Folder Conventions

Query-related code lives inside feature folders, not in a global `queries/` directory.

```
src/features/products/
├── components/
│   ├── product-grid.tsx          # uses useQuery
│   └── product-card.tsx
├── hooks/
│   ├── use-products.ts           # useQuery wrapper for product list
│   └── use-product-detail.ts     # useQuery wrapper for product detail
└── api.ts                        # re-exports from lib/api/products.ts

src/features/cart/
├── components/
│   ├── cart-page.tsx             # uses useQuery + useMutation
│   └── cart-item.tsx
├── hooks/
│   └── use-cart.ts               # useQuery + useMutation wrappers
└── api.ts
```

**`src/lib/query-keys.ts`:** Centralized query key factory functions.

**`src/lib/query-client.ts`:** QueryClient instance with default options.

**Rules:**
- Feature hooks (`use-cart.ts`, `use-products.ts`) wrap TanStack Query for that feature.
- Pages import feature hooks, not raw `useQuery`.
- Query keys are imported from `lib/query-keys.ts`, never hardcoded.

## 16. Rules Future Developers and AI Agents Must Follow

1. **TanStack Query is for server state only.** Do not use it for URL state, form state, or UI state.
2. **No `useEffect` + `useState` for server data in Client Components.** Use `useQuery` or `useInfiniteQuery`.
3. **Query keys are never hardcoded strings.** Import from `lib/query-keys.ts` factory functions.
4. **Mutations invalidate on success.** No exceptions without explicit architectural review.
5. **Optimistic updates are opt-in and documented.** Only for cart quantity and wishlist toggle.
6. **Server Components do not use TanStack Query.** They `await` API functions directly.
7. **Prefetch from Server Components only when the Client Component needs the same data.** Do not prefetch data that the Client Component will not use.
8. **Every query has loading, error, and empty states.** No silent failures, no blank pages.
9. **Loading states use skeletons that match content shape.** No spinners without context.
10. **Error states are actionable.** Show "Failed to load products. Retry" not "Error".

## 17. Important Tradeoffs

- **TanStack Query cache vs Server Components:** Server Components provide instant HTML but refetch on every navigation. TanStack Query caches on the client but adds JS bundle size. The hybrid approach (Server Component initial + TanStack Query updates) balances both.
- **Prefetching cost vs benefit:** Prefetching warms the cache but adds server-side latency. Prefetch only high-probability data (product detail from grid, cart from header).
- **Stale time tuning:** Shorter stale time (30s) means fresher data but more refetches. Longer stale time (5min) reduces bandwidth but risks stale UI. Use per-query stale times: catalog data 60s, cart 30s, profile 5min.
- **Optimistic update complexity:** Optimistic updates make the UI feel instant but add rollback logic and cache reconciliation. Use them only where the UX gain justifies the code complexity.
- **Infinite queries vs pagination:** Infinite queries are simpler for scroll-based feeds but harder to debug and can cause memory issues with large datasets. Standard pagination is preferred for e-commerce product listings.
