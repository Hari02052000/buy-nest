# Authentication & Forms Architecture

This document defines the authentication and form-handling strategy for the Next.js e-commerce frontend. It is a companion to `api-architecture.md`, `tanstack-query.md`, and `state-management.md`.

## 1. Authentication Overview

Authentication is handled entirely by the backend using httpOnly cookies with refresh-token rotation. The frontend's role is limited to:
- Sending credentials via login/registration forms
- Reading the current user via TanStack Query
- Redirecting unauthenticated users away from protected routes
- Logging out by calling the backend

The frontend never reads, writes, or stores tokens. There is no `localStorage` auth state, no `Authorization` header, and no manual token refresh.

---

## 2. Login

**Frontend responsibilities:**
- Render a login form with email and password fields.
- Validate input with Zod before submission.
- Submit credentials to the backend via `login()` in `src/lib/api/auth.ts`.
- On success: invalidate the auth query cache so `useAuth()` refetches the user.
- On error: display the backend message inline. Do not redirect.
- Redirect authenticated users away from `/account/login` to `/account`.

**Backend responsibilities:**
- Validate credentials.
- Create httpOnly access and refresh cookies.
- Return `{ success, message, data: { user } }`.
- Handle refresh-token rotation transparently.

**Server/client split:**
- Server Component for the page shell (SEO-friendly title/layout).
- Client Component for the form (React Hook Form + Zod + mutation).

---

## 3. Registration

**Frontend responsibilities:**
- Render a signup form with name, email, password, and confirm-password fields.
- Validate input with Zod (email format, password minimum length, password match).
- Submit credentials to `register()` in `src/lib/api/auth.ts`.
- On success: same as login (invalidate auth query, redirect to `/account` or show success message).
- On error: display the backend message inline.

**Backend responsibilities:**
- Validate input.
- Create user.
- Create httpOnly cookies.
- Return `{ success, message, data: { user } }`.

**Server/client split:**
- Same as login: Server Component page shell, Client Component form.

---

## 4. Logout

**Frontend responsibilities:**
- Call `logout()` in `src/lib/api/auth.ts` on user action.
- On success: invalidate the entire TanStack Query cache (`queryClient.invalidateQueries()`) and redirect to `/`.
- Clear any client-side derived state (e.g., cart count badges update automatically when cart queries are invalidated).

**Backend responsibilities:**
- Clear httpOnly cookies.
- Invalidate the refresh token in the session store.
- Return `{ success, message }`.

**Server/client split:**
- Logout is a Client Component action (button click).
- Optionally a Server Action if the logout button lives in a Server Component.

---

## 5. Session Handling

**Source of truth:** Backend session store (httpOnly cookies).

**Client-side session check:**
```tsx
// src/features/auth/hooks/use-auth.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/lib/api/auth';
import { queryKeys } from '@/lib/query-keys';

export function useAuth() {
  return useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: getCurrentUser,
    staleTime: 5 * 60_000,
    retry: false,
  });
}
```

**Server-side session check:**
- Next.js middleware reads cookies server-side and redirects unauthenticated requests.
- Server Components call `getCurrentUser()` directly when they need the user object for SSR.

**Rules:**
- No `localStorage` tokens.
- No manual token refresh in the frontend.
- No `useEffect` that redirects based on auth state (causes flash). Use middleware + Server Components for redirects.

---

## 6. Protected Routes / Pages

**Two layers of protection:**

1. **Next.js middleware** — Server-side guard in `middleware.ts`. Reads cookies and redirects unauthenticated users before the page renders. This prevents flash of unauthenticated content and protects Server Components.

2. **Client-side `ProtectedRoute` component** — Wraps Client Components that must not render without auth. Uses `useAuth()` and redirects via `useRouter`.

**Pattern:**
```tsx
// src/features/auth/components/protected-route.tsx
'use client';
import { useAuth } from '../hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push('/account/login');
  }, [user, isLoading, router]);

  if (isLoading) return <Skeleton className="h-screen w-full" />;
  if (!user) return null;
  return <>{children}</>;
}
```

**Usage:**
- Wrap account pages, cart, checkout, wishlist, order history.
- Do not wrap public pages (shop, home, product detail, about, contact).

---

## 7. Account Pages

**Layout:** `/account` is a protected route group under `(store)`.

**Pages:**
- `/account` — Profile dashboard (name, email, member since).
- `/account/addresses` — Address book (list, add, edit, delete).
- `/account/orders` — Order history.
- `/account/orders/[id]` — Order detail.

**Data ownership:**
- User profile: TanStack Query `useAuth()`.
- Addresses: TanStack Query `useQuery` + `useMutation`.
- Orders: TanStack Query `useQuery` + `useMutation` (cancel order).

**Server/client split:**
- Account pages are Server Components that prefetch user data.
- Interactive tabs, forms, and lists are Client Components using TanStack Query.

---

## 8. React Hook Form

All forms use React Hook Form in Client Components.

**Setup:**
- `react-hook-form` for form state management.
- `@hookform/resolvers/zod` for Zod integration.
- Uncontrolled inputs by default (minimal re-renders).

**Pattern:**
```tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  // ...
}
```

**Rules:**
- Every form has a Zod schema.
- Form state never leaks to a global store.
- Form submission uses `useMutation` for API calls.
- Disable submit button during submission with `isSubmitting`.

---

## 9. Zod Validation

Zod is the single source of truth for validation.

**Where schemas live:**
- `src/features/auth/schemas/login.schema.ts`
- `src/features/auth/schemas/signup.schema.ts`
- `src/features/checkout/schemas/shipping.schema.ts`
- `src/features/admin/schemas/product.schema.ts`

**Usage:**
- Client-side: Zod resolver in React Hook Form validates before submission.
- Server-side (optional): Zod validates API request bodies in Server Actions or API routes as a security boundary.

**Rules:**
- Schemas are shared between client and server where possible.
- Error messages are user-friendly. No raw Zod error messages in the UI.
- Schemas enforce backend constraints (min length, max length, required fields) so invalid requests are caught before reaching the network.

---

## 10. Form Submission

Forms submit via `useMutation` from TanStack Query.

**Pattern:**
```tsx
const mutation = useMutation({
  mutationFn: (data: FormData) => login(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
    router.push('/account');
  },
  onError: (error) => {
    toast.error(error.message);
  },
});

const onSubmit = (data: FormData) => mutation.mutate(data);
```

**Rules:**
- Do not use `fetch` directly in form submit handlers.
- Do not use Server Actions for auth mutations unless there is a specific reason (e.g., CSRF protection). Client-side mutations are simpler for login/register.
- On success: invalidate relevant queries and redirect.
- On error: show the error message from the backend.

---

## 11. Validation Errors

Validation errors come from two sources:

1. **Client-side Zod validation** — Displayed inline below the field.
2. **Backend validation errors** — Returned in `ApiError.message` or `ApiError.response?.data?.errors`. Displayed inline or as a toast.

**Client-side error pattern:**
```tsx
<input {...register('email')} />
{errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
```

**Backend error pattern:**
```tsx
const mutation = useMutation({
  mutationFn: login,
  onError: (error) => {
    if (error instanceof ApiError && error.status === 422) {
      setFieldErrors(error.response?.data?.errors);
    } else {
      toast.error(error.message);
    }
  },
});
```

**Rules:**
- Never show generic "Invalid input" messages. Show the specific field and reason.
- Never show raw stack traces or backend error shapes.
- Field-level errors are shown below the field. Global errors are shown at the top of the form.

---

## 12. Authentication Errors

Authentication errors are a subset of API errors with specific handling.

| Status | Meaning | UI Behavior |
|--------|---------|-------------|
| 401 | Unauthorized (invalid credentials, expired session) | Show "Invalid email or password" on login. Redirect to `/account/login` on other pages. |
| 403 | Forbidden (insufficient permissions) | Show "Access denied" page. |
| 422 | Validation error | Show field-level errors or "Please check your input." |

**Rules:**
- Do not distinguish between "user not found" and "wrong password" on the frontend. Show a generic "Invalid email or password" message to prevent user enumeration.
- Do not log auth errors with PII (email, password).
- 401 during a protected-page query triggers middleware redirect on next navigation.

---

## 13. Loading / Submitting States

**Loading states:**
- Login/signup pages show a centered form with a `Skeleton` while `useAuth()` checks if the user is already logged in.
- If the user is already authenticated, Server Component redirects before the form renders.

**Submitting states:**
- Submit button shows "Signing in..." and is disabled during mutation.
- Button uses `mutation.isPending` (or `formState.isSubmitting` with React Hook Form).

**Pattern:**
```tsx
<Button type="submit" disabled={mutation.isPending}>
  {mutation.isPending ? 'Signing in...' : 'Sign in'}
</Button>
```

**Rules:**
- Never allow double submission. Disable the button during mutation.
- Do not show a full-page spinner for form submission. Show a loading state on the button only.

---

## 14. Server / Client Responsibilities

| Concern | Owner | Rationale |
|---------|-------|-----------|
| Login page layout / SEO | Server Component | Static shell, no auth data needed |
| Login form | Client Component | Needs React Hook Form + `useMutation` |
| Signup page layout / SEO | Server Component | Static shell |
| Signup form | Client Component | Needs React Hook Form + `useMutation` |
| Auth check (already logged in) | Server Component (redirect) + middleware | Prevents flash of login form |
| Current user data | Server Component (initial) + TanStack Query (updates) | Cookies available server-side |
| Logout button | Client Component | Needs `useMutation` |
| Protected page wrapper | Client Component | Needs `useAuth()` + `useRouter` |
| Route guard (unauthenticated) | Next.js middleware | Server-side, prevents flash |
| Route guard (unauthorized admin) | Next.js middleware + layout check | Server-side first, client fallback |

**Rule:** Forms and form submission are always Client Components. Page shells and auth guards are Server Components or middleware.

---

## 15. Security-sensitive Responsibilities

These responsibilities belong to the backend or Next.js server-side features. The frontend must not implement them.

| Responsibility | Owner | Why Frontend Must Not Touch |
|----------------|-------|----------------------------|
| Password hashing | Backend | Frontend cannot safely hash passwords |
| Token generation | Backend | Tokens are httpOnly cookies |
| Token storage / refresh | Backend | Frontend never accesses tokens |
| Session validation | Backend + middleware | Frontend can be bypassed |
| CSRF protection | Backend + `withCredentials` | Axios sends cookies automatically; backend validates |
| Rate limiting | Backend | Frontend rate limiting is trivially bypassed |
| Password reset flow | Backend | Requires email, secure tokens |
| Email verification | Backend | Requires email delivery |
| Input sanitization | Backend + Zod | Frontend validation is UX only; backend is the security boundary |

**Frontend security responsibilities:**
- Use `withCredentials: true` so cookies are sent automatically.
- Use HTTPS in production (enforced by deployment).
- Do not log auth errors with PII.
- Do not store passwords, tokens, or session IDs in any client-side storage.
- Use Zod to catch invalid input before it reaches the network (UX, not security).

---

## Folder Conventions

```
src/features/auth/
├── components/
│   ├── login-form.tsx          # Client Component: RHF + mutation
│   ├── signup-form.tsx         # Client Component: RHF + mutation
│   ├── protected-route.tsx     # Client Component: auth guard
│   └── logout-button.tsx       # Client Component: mutation
├── hooks/
│   └── use-auth.ts             # Client Component: TanStack Query wrapper
├── schemas/
│   ├── login.schema.ts         # Zod schema
│   └── signup.schema.ts        # Zod schema
├── api.ts                      # Re-exports from lib/api/auth.ts
└── types.ts                    # Auth-specific types if needed
```

**Rules:**
- Auth forms live in `features/auth/components/`.
- Auth schemas live in `features/auth/schemas/`.
- The `useAuth` hook lives in `features/auth/hooks/`.
- All auth API calls go through `src/lib/api/auth.ts`.

---

## Rules Future Developers and AI Agents Must Follow

1. **No auth state in global stores.** Do not create `AuthContext`, `authSlice`, or any global auth state. Use `useAuth()` (TanStack Query).
2. **No tokens in `localStorage`.** httpOnly cookies are the only auth mechanism.
3. **No client-side redirect `useEffect` for auth.** Use Next.js middleware for route guards. Client-side redirects are only for mutation success (e.g., after login).
4. **No manual token refresh.** The backend handles refresh-token rotation transparently.
5. **No `Authorization` headers.** The axios instance uses `withCredentials: true`. Do not add headers.
6. **All forms use React Hook Form + Zod.** No `useState` for form inputs, no Formik.
7. **Zod schemas mirror backend constraints.** If the backend requires a minimum password length, the Zod schema enforces it too.
8. **Auth errors are generic.** Do not reveal whether an email exists or a password is wrong.
9. **No optimistic updates for auth mutations.** Login, register, and logout are security-critical. Use standard `onSuccess` invalidation only.
10. **Protected routes use both middleware and `ProtectedRoute`.** Middleware protects Server Components. `ProtectedRoute` protects Client Components.

---

## Important Tradeoffs

- **Client-side mutations vs Server Actions for login/register:** Client-side mutations are simpler and provide better error handling with TanStack Query. Server Actions would add complexity without security benefit because the backend is the security boundary regardless.
- **Middleware + ProtectedRoute vs single layer:** Two layers seem redundant, but middleware protects Server Components (which cannot use Client Component guards), and `ProtectedRoute` protects Client Components. This is necessary in the App Router.
- **5-minute stale time for auth:** Users remain logged in even if they close the tab and return later (cookies persist). The `useAuth` query refetches on navigation after 5 minutes of inactivity. This balances freshness with performance.
- **Generic auth error messages:** "Invalid email or password" is less helpful than "Password incorrect," but it prevents user enumeration attacks. This is the correct security tradeoff for a public-facing e-commerce site.
- **No "Remember me" checkbox:** The backend's refresh-token rotation already handles persistent sessions. A "Remember me" checkbox would require backend changes and adds complexity without clear user value for this project scope.
