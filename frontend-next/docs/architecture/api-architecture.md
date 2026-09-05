# API / Data-Access Architecture

## 1. API Client Architecture

Single axios instance in `src/lib/api/axios.ts`. No competing clients, no classes, no service wrappers.

```
src/lib/api/
├── axios.ts      # Instance, interceptor, ApiError
├── types.ts      # ApiResponse<T>, unwrap(), shared entity interfaces
├── cookies.ts    # Server-side cookie forwarding helper
├── products.ts   # Product + category endpoints
├── cart.ts       # Cart endpoints
├── orders.ts     # Order endpoints
├── wishlist.ts   # Wishlist endpoints
├── auth.ts       # Auth endpoints
├── checkout.ts   # Checkout + payment endpoints
└── upload.ts     # Image upload endpoint
```

**Instance configuration:**
- `baseURL`: `process.env.NEXT_PUBLIC_API_URL`
- `withCredentials: true` (httpOnly cookies)
- Response interceptor normalizes errors into an `ApiError` class
- No request interceptors that mutate bodies or headers beyond cookie forwarding

**Domain modules** export plain async functions. No cross-module imports in the API layer. Each module owns its endpoints exclusively.

## 2. API Service Boundaries

One module per domain. Clear ownership prevents circular dependencies.

| Module | Owns | Does NOT touch |
|--------|------|----------------|
| `products.ts` | Product list, detail, related, search | Cart, orders, auth |
| `categories.ts` | Category tree, category by slug | Products (except category lookup) |
| `cart.ts` | Cart CRUD, coupon apply/remove | Products (except product info for cart items) |
| `orders.ts` | Order list, detail, cancel | Cart, products |
| `wishlist.ts` | Wishlist CRUD | Products, cart |
| `auth.ts` | Login, register, logout, getCurrentUser | Everything else |
| `checkout.ts` | Create order, create payment intent, verify payment | Cart (except cart summary for checkout) |
| `upload.ts` | Image upload | Everything else |

## 3. Server-side Data Fetching

Server Components import API functions directly and `await` them. No TanStack Query needed for the initial server render.

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

**Cookie forwarding:**
Server-side requests attach cookies from `next/headers` via a helper:
```ts
const cookieHeader = await getServerCookieHeader();
const response = await api.get('/user', cookieHeader ? { headers: { Cookie: cookieHeader } } : undefined);
```

Use cases: initial page data for SEO, authenticated data where cookies are required, data that does not change frequently.

## 4. Client-side Data Fetching

Client Components use TanStack Query to call the same API functions. No separate client-side API layer.

**Pattern:**
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['products', category],
  queryFn: () => getProducts(category),
});
```

**Prefetching from Server Components:**
```tsx
await prefetchQuery(queryClient, {
  queryKey: ['products', params.category],
  queryFn: () => getProducts(params.category),
});
return <ProductGrid category={params.category} />;
```

Use cases: user-specific data, frequently updated data, filtered/sorted/searched data, data dependent on client-side state.

## 5. Mutations

All writes use `useMutation` from TanStack Query. API functions return promises; mutations handle cache invalidation.

**Pattern:**
```tsx
const mutation = useMutation({
  mutationFn: () => addToCart(productId, quantity),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
  },
});
```

**Optimistic updates** are used sparingly for high-frequency, low-risk actions: cart quantity changes, wishlist toggle. Not used for checkout, login, or admin mutations.

## 6. TypeScript API Types

Shared entity types live in `src/lib/api/types.ts`. Domain modules import and use them. The backend envelope is unwrapped at the API layer via a shared helper.

**Key interfaces:**
- `ApiResponse<T>` — backend envelope `{ success, message, data }`
- `Product`, `Category`, `Cart`, `CartItem`, `Order`, `OrderItem`, `Address`, `PaymentInfo`, `User`

**Unwrap helper:**
```ts
export async function unwrap<T>(response: { data: ApiResponse<T> }): Promise<T> {
  return response.data.data;
}
```

Components receive plain entities. They never see `success`, `message`, or `data` envelope properties.

## 7. Authentication / Session Handling

httpOnly cookies only. No Authorization headers. No tokens in `localStorage`.

- Axios instance has `withCredentials: true`. Cookies are sent automatically.
- Server-side: cookies forwarded from `next/headers` via `getServerCookieHeader()`.
- Client-side: auth state is a `useQuery` on `/user` with 5-minute stale time.
- Next.js middleware handles 401 redirects server-side. No client-side `useEffect` login redirects.
- Backend manages refresh-token rotation. Frontend never reads, writes, or stores tokens.

## 8. Error Handling

**Two layers:**

1. **Global interceptor** normalizes all axios errors into `ApiError` with a message and status code.
2. **Per-call handling** distinguishes expected failures (404, 401, 403, 429) from unexpected ones (500).

| Status | Client | Server |
|--------|--------|--------|
| 401 | Redirect to `/account/login` | Next.js middleware |
| 403 | Show "Access denied" | Show "Access denied" |
| 404 | Inline not-found | `notFound()` |
| 429 | "Too many requests" | Pass to error boundary |
| 500 | Generic error + retry | Pass to error boundary |

Server Components use try/catch + `notFound()` for 404. Client Components use TanStack Query error states. Global render errors are caught by `app/error.tsx`.

## 9. Environment Variables

Minimal set, validated at build time with Zod.

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...       # Server-only
ADMIN_EMAIL=admin@buynest.com       # Server-only
```

Validation fails the build if required variables are missing. No `dotenv` package. Next.js loads `.env.local`, `.env.development`, `.env.production` automatically.

## 10. Request / Response Transformation

Minimal transformation. Unwrap the backend envelope. Do not mutate request bodies.

- **Response:** Backend returns `{ success, message, data }`. The `unwrap` helper extracts `data`. Components never see the envelope.
- **Request:** API functions pass arguments directly to axios. If the backend requires a specific field name, the translation happens in the specific API function only.
- No global request interceptors that mutate payloads.

## 11. Server Component vs Client Component Responsibilities

| Concern | Owner | Example |
|---------|-------|---------|
| Initial page data | Server Component | `await getProduct(id)` in `page.tsx` |
| Authenticated data | Server Component (initial) + TanStack Query (updates) | `await getCurrentUser()` then `useAuth()` |
| User mutations | Client Component via `useMutation` | Add to cart, apply coupon |
| Form state | Client Component via React Hook Form | Checkout address form |
| URL state (filters, search, sort, pagination) | Client Component reads URL, drives TanStack Query key | `?category=electronics&sort=price-asc` |
| UI state (modals, menus, tabs) | Client Component local `useState` | Mobile menu open/closed |
| Optimistic updates | Client Component mutation `onMutate` | Cart quantity change |

**Rule:** Server Components fetch data directly. Client Components fetch via TanStack Query. No component fetches data in both contexts simultaneously.

## 12. Recommended Folder Structure

```
src/lib/api/
├── axios.ts
├── types.ts
├── cookies.ts
├── products.ts
├── categories.ts
├── cart.ts
├── orders.ts
├── wishlist.ts
├── auth.ts
├── checkout.ts
└── upload.ts
```

**Access rules:**
- Server Components import domain functions directly.
- Client Components import the same domain functions and use them inside `useQuery` / `useMutation`.
- Server Actions import domain functions directly.
- Feature hooks wrap domain functions in TanStack Query.
- Next.js API routes import the axios instance directly for proxying.

## 13. Data Flow

```
Server Component (page.tsx)
  │
  ├─ await getProduct(id) ──▶ lib/api/products.ts
  │                              │
  │                              ├─ getServerCookieHeader() (if auth needed)
  │                              ├─ api.get(`/products/${id}`)
  │                              └─ unwrap(response) → Product
  │
  └─ pass Product as props to Client Component

Client Component ('use client')
  │
  ├─ useQuery({ queryKey, queryFn: getProducts }) ──▶ lib/api/products.ts
  │                                                      │
  │                                                      ├─ api.get(...)
  │                                                      └─ unwrap(response) → Product[]
  │
  └─ useMutation({ mutationFn: addToCart }) ──▶ lib/api/cart.ts
                                                      │
                                                      ├─ api.post('/cart/add', ...)
                                                      └─ unwrap(response) → Cart
                                                              │
                                                              └─ onSuccess: invalidateQueries(['cart'])

URL State (nuqs / useSearchParams)
  │
  ├─ User changes filter ──▶ URL updates (?category=electronics)
  │
  └─ Product grid reads URL ──▶ queryKey includes filters ──▶ TanStack Query fetches
```

## 14. Rules Future Developers and AI Agents Must Follow

1. **One API client only.** Always import from `src/lib/api/`. Do not create new axios instances, fetch wrappers, or service classes.
2. **One module per domain.** Do not add cart methods to `products.ts` or order methods to `cart.ts`.
3. **Always unwrap the envelope.** Use the `unwrap` helper. Components receive plain entities, not `ApiResponse<T>`.
4. **No `localStorage` for tokens or session data.** httpOnly cookies are the only auth mechanism.
5. **No manual `fetch` in components.** All data access goes through `src/lib/api/` functions.
6. **Server Components `await` API functions directly.** Do not wrap them in `prefetchQuery` unless prefetching for a Client Component.
7. **Client Components use TanStack Query for data.** Do not use `useEffect` + `useState` for server data.
8. **Mutations invalidate on success.** No exceptions without explicit architectural review.
9. **Optimistic updates are opt-in and documented.** Only for cart quantity and wishlist toggle.
10. **Error handling is normalized.** Every API function throws `ApiError`. Callers inspect `error.status`.

## 15. Important Tradeoffs

- **Axios bundle size (~12KB gzipped)** vs fetch native API: Axios is retained for `withCredentials` support, mature interceptors, and consistency with the existing admin panel. If bundle size becomes critical, evaluate a lightweight fetch wrapper.
- **Shared types manual sync** vs generated from OpenAPI: Types are copied from the backend and maintained manually. The backend is strictly typed and owned by the same team, so manual sync is faster and avoids OpenAPI tooling overhead.
- **Envelope unwrapping at API layer** vs at call sites: Unwrapping in `types.ts` means call sites are clean. The tradeoff is that raw API responses are not available for debugging without removing the unwrap.
- **Cookie forwarding helper** vs per-function configuration: The helper adds a small abstraction. The alternative is repeating `headers: { Cookie: ... }` in every server-side call, which is more error-prone.
- **No request caching in the API layer**: Caching is handled exclusively by TanStack Query. The API layer is intentionally thin and stateless. This means Server Components refetch on every request, which is correct for dynamic data but wasteful for static data (mitigated by SSG/ISR where appropriate).
