# Engineering Quality Strategy

This document defines the engineering quality strategy for the Buy Nest Next.js e-commerce frontend. It covers type safety, linting, testing, performance, accessibility, security, and CI validation. It is a companion to the other architecture documents in this folder.

The strategy prioritizes tools that provide meaningful value for a single developer maintaining a portfolio-grade project. Unnecessary tooling is avoided.

---

## 1. TypeScript

**Tool:** TypeScript compiler (`tsc`) with strict mode.

**What it solves:**
- Prevents the "everything is implicitly `any`" problem found in the existing codebase.
- Catches API shape mismatches at build time instead of runtime.
- Provides autocomplete and refactoring safety.

**Where it should be used:**
- Every source file is `.ts` or `.tsx`.
- `tsconfig.json` at the project root.

**Configuration:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noEmit": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "module": "esnext",
    "target": "esnext",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**Why it is justified:**
- The existing frontend is 100% plain JavaScript despite claiming to be TypeScript. Strict TypeScript is non-negotiable for a portfolio project targeting senior roles.

**Quality gate:**
- `tsc --noEmit` must pass on every commit. No `any` types without explicit justification.

---

## 2. ESLint

**Tool:** ESLint 9+ with flat config, TypeScript ESLint plugin.

**What it solves:**
- Enforces consistent code style.
- Catches common bugs (unused variables, unreachable code).
- Enforces React best practices (`react-hooks/exhaustive-deps`, `react-refresh/only-export-components`).

**Where it should be used:**
- `eslint.config.ts` at the project root.
- Runs on every save (IDE) and on every commit (pre-commit hook).

**Configuration:**
```ts
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react-hooks';
import refreshPlugin from 'eslint-plugin-react-refresh';

export default [
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactPlugin,
      'react-refresh': refreshPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'warn',
    },
  },
];
```

**Why it is justified:**
- The existing codebase has no linting enforcement. ESLint catches bugs before they reach production.

**Quality gate:**
- `eslint .` must pass with zero errors on every commit.

---

## 3. Formatting

**Tool:** Prettier.

**What it solves:**
- Eliminates formatting debates in PRs.
- Ensures consistent style across the codebase.
- Handles Tailwind class sorting automatically.

**Where it should be used:**
- `.prettierrc` at the project root.
- IDE integration (format on save).
- Pre-commit hook.

**Configuration:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**Why it is justified:**
- `prettier-plugin-tailwindcss` automatically sorts Tailwind classes, preventing the "class order chaos" problem.
- For a single developer, format-on-save removes the mental overhead of manual formatting.

**Quality gate:**
- `prettier --check .` must pass on every commit.

---

## 4. Unit Testing

**Tool:** Vitest + React Testing Library.

**What it solves:**
- Verifies pure functions (utilities, formatters, query key factories).
- Verifies hooks in isolation.
- Prevents regressions in critical business logic.

**Where it should be used:**
- `src/__tests__/` or co-located `*.test.ts` / `*.test.tsx` files.
- CI runs `vitest --run` on every PR.

**What to test:**
- `lib/format.ts` — `formatPrice`, `formatDate`.
- `lib/query-keys.ts` — query key factory functions.
- `lib/env.ts` — env validation.
- `features/auth/hooks/use-auth.ts` — mocked API responses.
- `features/cart/hooks/use-cart.ts` — add/remove/update logic.
- Zod schemas — valid/invalid inputs.

**What NOT to test:**
- MUI / Tailwind internals.
- Next.js router behavior.
- Third-party library internals.

**Why it is justified:**
- The existing codebase has zero tests. Unit tests provide the highest ROI for critical logic with minimal setup cost.

**Quality gate:**
- 80% coverage for utilities and hooks.
- `vitest --run` must pass with zero failures.

---

## 5. Component Testing

**Tool:** React Testing Library (via Vitest).

**What it solves:**
- Verifies components render correctly with given props.
- Verifies user interactions (click, type, submit).
- Verifies accessibility basics (labels, roles).

**Where it should be used:**
- Co-located test files: `ProductCard.test.tsx`, `CartItem.test.tsx`, `LoginForm.test.tsx`.

**What to test:**
- `ProductCard` — renders product, handles add-to-cart click, handles wishlist click.
- `CartItem` — renders item, handles quantity change, handles remove.
- `LoginForm` — validates empty fields, submits with valid data, shows error on failure.
- `EmptyState` — renders icon, title, action.

**Why it is justified:**
- Component tests catch UI regressions that unit tests miss. They are fast and run in CI.

**Quality gate:**
- 60% coverage for components.
- All interactive components have at least one test.

---

## 6. Integration Testing

**Tool:** Vitest + MSW (Mock Service Worker).

**What it solves:**
- Verifies feature flows work end-to-end within the app (e.g., add to cart → cart count updates).
- Tests multiple components interacting through TanStack Query.

**Where it should be used:**
- `src/__tests__/integration/` or feature-level test files.

**What to test:**
- Product list → add to cart → cart drawer shows updated count.
- Search → filter → pagination URL updates.
- Login → auth state updates → protected route renders.

**Why it is justified:**
- MSW mocks the backend at the network level, making tests realistic without a running server.
- Catches integration bugs that unit and component tests miss.

**Quality gate:**
- Critical paths (auth, cart, checkout) have integration tests.
- `vitest --run` must pass with zero failures.

---

## 7. End-to-End Testing

**Tool:** Playwright.

**What it solves:**
- Verifies complete user flows in a real browser.
- Catches issues that unit/component tests cannot (routing, SSR, real network).
- Provides visual regression safety.

**Where it should be used:**
- `e2e/` directory at the project root.
- CI runs `playwright test` on every PR to main.

**What to test:**
1. **Auth flow:** login → redirect to account → logout → redirect to home.
2. **Cart flow:** browse products → add to cart → update quantity → apply coupon → proceed to checkout.
3. **Checkout flow:** fill shipping → select payment → place order → see confirmation.
4. **Admin flow:** admin login → add product → edit product → view orders.

**Why it is justified:**
- The existing codebase has zero E2E tests. Playwright is the industry standard for Next.js E2E.
- For a portfolio project, E2E tests demonstrate maturity and attention to detail.

**Quality gate:**
- All E2E tests pass on every merge to main.
- E2E tests run against a deployed preview environment, not localhost.

---

## 8. Accessibility Testing

**Tool:** `jest-axe` (for unit/component tests) + manual keyboard checks.

**What it solves:**
- Catches accessibility violations programmatically (missing labels, wrong ARIA roles, low contrast).
- Prevents regressions in a11y after refactors.

**Where it should be used:**
- Added to critical component tests: `LoginForm.a11y.test.tsx`, `ProductCard.a11y.test.tsx`.
- Manual check before merging any PR that touches UI.

**What to test:**
- All form inputs have labels.
- Icon buttons have `aria-label`.
- Dialogs have `role="dialog"` and `aria-modal`.
- Color contrast meets WCAG AA.

**Why it is justified:**
- The existing codebase has minimal ARIA and no a11y testing.
- `jest-axe` adds negligible overhead and catches real issues.

**Quality gate:**
- Critical components pass `jest-axe` with zero violations.
- Manual keyboard navigation check before PR merge.

---

## 9. SEO

**Tool:** Next.js Metadata API + Lighthouse CI.

**What it solves:**
- Ensures every page has correct title, description, and Open Graph tags.
- Detects SEO regressions (missing meta, broken links, slow LCP).

**Where it should be used:**
- `generateMetadata` in every dynamic page.
- `app/sitemap.ts` and `app/robots.ts`.
- Lighthouse CI in the deployment pipeline.

**Verification:**
- Lighthouse audit on every deployed preview.
- Manual check: view source, verify meta tags, verify OG tags.

**Why it is justified:**
- The existing codebase has no per-route meta management and no sitemap.
- SEO is a key differentiator for a portfolio e-commerce project.

**Quality gate:**
- Lighthouse SEO score > 90 on all public pages.
- Every dynamic page exports `generateMetadata`.

---

## 10. Core Web Vitals

**Tool:** `web-vitals` library + Vercel Analytics (or similar).

**What it solves:**
- Measures real-user LCP, INP, and CLS.
- Detects performance regressions before users notice.

**Where it should be used:**
- `web-vitals` in production to send metrics to analytics.
- Vercel Analytics dashboard for monitoring.

**Targets:**
| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |

**Why it is justified:**
- Core Web Vitals are Google ranking factors and demonstrate performance awareness to hiring managers.

**Quality gate:**
- 75th percentile of real-user metrics meets targets.
- No CLS > 0.1 on any page (checked via Lighthouse).

---

## 11. Image Optimization

**Tool:** `next/image` with `remotePatterns`.

**What it solves:**
- Automatically serves optimized images (WebP/AVIF, resized to viewport).
- Prevents layout shift with explicit width/height or `fill`.
- Lazy-loads offscreen images.

**Where it should be used:**
- Every `<img>` tag is replaced with `next/image`.
- `next.config.ts` defines `images.remotePatterns` for allowed domains.

**Configuration:**
```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: 'buynest-backend-service' },
  ],
}
```

**Why it is justified:**
- The existing codebase uses raw `<img>` with external URLs, no lazy loading, no sizing.
- `next/image` is a zero-config performance win.

**Quality gate:**
- No raw `<img>` tags in the codebase (grep for `<img`).
- All product images use `next/image` with explicit dimensions or `fill`.

---

## 12. Bundle Performance

**Tool:** `@next/bundle-analyzer` + manual bundle reviews.

**What it solves:**
- Identifies large dependencies bloating the client bundle.
- Prevents accidental inclusion of server-only packages (like the existing `stripe` Node SDK in the browser bundle).

**Where it should be used:**
- Development mode with `ANALYZE=true`.
- CI fails if bundle size exceeds thresholds.

**Targets:**
- First Load JS: < 200KB for store pages.
- No single chunk > 100KB.

**Why it is justified:**
- The existing codebase ships `stripe` (Node SDK), `react-responsive-carousel` (unused), and MUI full bundle to the client.
- Bundle analysis prevents regressions.

**Quality gate:**
- Bundle size reviewed on every PR that adds a dependency.
- CI fails if main bundle exceeds 200KB.

---

## 13. Loading Performance

**Tool:** Next.js built-in performance features + `loading.tsx` skeletons.

**What it solves:**
- Reduces time-to-first-byte and time-to-interactive.
- Prevents layout shift during loading.

**Where it should be used:**
- `loading.tsx` at every route segment with data fetching.
- `next/font` for all web fonts.
- `next/image` for all images.

**Targets:**
- LCP element visible within 2.5s on 4G.
- No layout shift > 0.1 on any page.

**Why it is justified:**
- The existing codebase has no loading skeletons and no font optimization.
- Loading performance directly impacts conversion rate in e-commerce.

**Quality gate:**
- No full-page spinners on authenticated pages.
- Every data-fetching route has a matching `loading.tsx`.

---

## 14. Error Handling

**Tool:** Next.js `error.tsx` + TanStack Query error states + Sentry (optional).

**What it solves:**
- Catches render errors without blanking the page.
- Provides actionable error messages to users.
- Reports production errors to monitoring.

**Where it should be used:**
- `app/error.tsx` — global error boundary.
- `app/(store)/products/[id]/error.tsx` — segment-level error boundary.
- TanStack Query `onError` callbacks for API errors.
- Optional: Sentry for production error monitoring.

**Why it is justified:**
- The existing codebase has no error boundaries. A single render crash blanks the entire app.

**Quality gate:**
- Every query has an error fallback UI.
- Global error boundary exists and renders a recoverable UI.
- Production errors are reported to monitoring (console is acceptable for solo dev; Sentry for portfolio).

---

## 15. Security Boundaries

**Tool:** Next.js middleware + CSP headers + Zod validation.

**What it solves:**
- Prevents unauthenticated access to protected routes server-side.
- Validates all user input before processing.
- Limits damage from XSS and CSRF.

**Where it should be used:**
- `middleware.ts` — auth guards, admin guards.
- Zod schemas — all form inputs and API route bodies.
- `next.config.ts` — security headers (CSP, X-Frame-Options).

**Configuration:**
```ts
// next.config.ts
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];

export default {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};
```

**Why it is justified:**
- The existing codebase has no CSP, no security headers, and client-side-only auth guards.
- Security is a table-stakes requirement for any production web app.

**Quality gate:**
- All protected routes are guarded by middleware.
- All forms validate with Zod before submission.
- No `dangerouslySetInnerHTML` without sanitization.

---

## 16. Environment Variables

**Tool:** Zod validation at build time + Next.js env loading.

**What it solves:**
- Fails the build if required env vars are missing.
- Prevents accidentally exposing secrets to the client bundle.
- Documents required configuration.

**Where it should be used:**
- `src/lib/env.ts` — Zod schema parsing `process.env`.
- Imported in `lib/query-client.ts` or root layout to trigger validation at startup.

**Pattern:**
```ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
});

export const env = envSchema.parse(process.env);
```

**Why it is justified:**
- The existing codebase has only `.env.production` with one variable, and no validation.
- Missing env vars cause silent runtime failures that are hard to debug.

**Quality gate:**
- Build fails if any required env var is missing.
- No `dotenv` package (Next.js handles env loading).

---

## 17. Dependency Management

**Tool:** npm + `package.json` + `npm audit`.

**What it solves:**
- Tracks dependencies and versions.
- Detects known vulnerabilities.

**Where it should be used:**
- `package.json` at the project root.
- `npm audit` in CI.

**Rules:**
- Add a dependency only after evaluating if it can be replaced with native APIs or existing packages.
- Remove unused dependencies immediately.
- Pin major versions for critical packages (Next.js, React, TanStack Query).
- Review bundle size before adding any new dependency.

**Why it is justified:**
- The existing codebase has unused dependencies (`react-responsive-carousel`, `dotenv`, `stripe` Node SDK) and duplicate packages.
- Clean dependencies reduce bundle size and security surface.

**Quality gate:**
- `npm audit` passes with no high/critical vulnerabilities.
- No unused dependencies (audit with `depcheck` or similar quarterly).

---

## 18. CI Validation

**Tool:** GitHub Actions or equivalent.

**What it solves:**
- Runs quality gates automatically on every PR.
- Prevents broken code from reaching main.
- Provides fast feedback to the developer.

**Where it should be used:**
- `.github/workflows/ci.yml` at the project root.

**Pipeline stages:**
1. **Install:** `npm ci`
2. **Type check:** `tsc --noEmit`
3. **Lint:** `eslint .`
4. **Format:** `prettier --check .`
5. **Test:** `vitest --run`
6. **Build:** `next build`
7. **Bundle check:** `ANALYZE=true npm run build` (optional, on PRs touching dependencies)

**Why it is justified:**
- The existing codebase has a Jenkinsfile for the backend but no frontend CI.
- Automated CI is essential for maintaining quality as the project grows.

**Quality gate:**
- All stages must pass before merging to main.
- No bypassing CI for convenience.

---

## 19. Production Build Validation

**Tool:** Next.js built-in build checks + Lighthouse CI.

**What it solves:**
- Ensures the production build succeeds.
- Validates performance, accessibility, SEO, and best practices in a real production build.

**Where it should be used:**
- `next build` in CI.
- Lighthouse CI on deployed preview.
- Manual smoke test after deployment.

**Checklist:**
- [ ] `next build` succeeds with no errors.
- [ ] No static pages have dynamic API routes (mixed-content warnings).
- [ ] All dynamic pages have `generateMetadata`.
- [ ] All images use `next/image`.
- [ ] No `console.log` statements in production code.
- [ ] No hardcoded API URLs (all use `NEXT_PUBLIC_API_URL`).
- [ ] Lighthouse Performance > 90, Accessibility > 90, SEO > 90.

**Why it is justified:**
- The existing Dockerfile builds a Vite SPA. The Next.js build must be validated as a production artifact.
- Production validation catches issues that dev-mode testing misses.

**Quality gate:**
- `next build` passes.
- Lighthouse CI scores meet thresholds.
- Smoke test passes (homepage loads, login works, product detail loads).

---

## Quality Gates Summary

| Stage | Gate | Tool |
|-------|------|------|
| Pre-commit | No lint errors, no format errors | ESLint, Prettier |
| PR opened | Type check passes, tests pass, build passes | tsc, Vitest, Next.js |
| PR merged | Bundle size within budget, Lighthouse scores OK | Bundle analyzer, Lighthouse CI |
| Deployed | Smoke test passes, Core Web Vitals within targets | Manual + web-vitals |

---

## Important Tradeoffs

- **Testing depth vs maintenance cost:** Full coverage is ideal but expensive. Focus on critical paths (auth, cart, checkout) and utility functions. Component tests for reusable primitives. Skip E2E for trivial pages.
- **Lighthouse CI vs speed:** Running Lighthouse on every PR is slow. Run it on PRs to main and on deployed previews only.
- **Sentry vs cost:** Sentry is free for small projects. For a solo developer, console error reporting + Lighthouse CI may be sufficient. Add Sentry if the project becomes public-facing with real users.
- **Strict TypeScript vs development speed:** Strict mode catches bugs but adds boilerplate. The long-term productivity gain outweighs the initial friction, especially for a portfolio project.
- **Prettier vs custom style:** Prettier's defaults are opinionated. Accept them. Fighting Prettier's style wastes time and creates inconsistency.
