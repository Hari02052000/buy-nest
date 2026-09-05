# Buy Nest Frontend — Foundation Implementation Plan

## 1. Project Context

Build the foundation for a production-style Next.js e-commerce frontend (App Router, TypeScript strict, Tailwind CSS v4). All requirements are sourced from `docs/architecture/*.md`.

## 2. Key Decisions (from docs)

- **Framework**: Next.js 14+ with App Router. No Pages Router.
- **Language**: TypeScript strict mode. No `any` without justification.
- **Styling**: Tailwind CSS v4 with `@theme` directive. CSS custom properties in `app/globals.css` are the single source of truth for design tokens.
- **Theme**: Light/dark/system via CSS custom properties + `data-theme` attribute on `<html>`. Docs say "single light theme with CSS custom properties that make dark mode easy to add later" — but the task requires light/dark/system foundation, so we implement all three with minimal overhead.
- **State**: No global state library. TanStack Query v5 for client-side server state. No Redux, no Zustand, no AuthContext, no CartContext.
- **Fonts**: Inter (sans), Playfair Display (display), system mono (prices/codes) via `next/font`.
- **Path alias**: `@/*` → `./src/*`
- **Lint/Format**: ESLint 9+ flat config, Prettier + `prettier-plugin-tailwindcss`.
- **Testing stack** (not installed now, but reserved): Vitest + React Testing Library, Playwright, `jest-axe`.

## 3. Dependencies to Install

| Package | Purpose |
|---------|---------|
| `next` `react` `react-dom` | Framework (peer) |
| `typescript` @types/react @types/node | Type safety |
| `tailwindcss` @tailwindcss/postcss | Styling v4 |
| `@tanstack/react-query` | Client-side server state |
| `react-hook-form` @hookform/resolvers `zod` | Forms + validation |
| `axios` | HTTP client |
| `class-variance-authority` `clsx` `tailwind-merge` | UI variant management + class merging |
| `lucide-react` | Icons |
| `eslint` `@typescript-eslint/parser` `@typescript-eslint/eslint-plugin` `eslint-plugin-react-hooks` `eslint-plugin-react-refresh` | Linting |
| `prettier` `prettier-plugin-tailwindcss` | Formatting + Tailwind class sort |
| `@eslint/js` | ESLint flat config support |

## 4. Files to Create / Modify

### Configuration Files
- `tsconfig.json` — strict mode, path alias `@/*`, ESNext target/module
- `eslint.config.ts` — flat config with TS + React hooks + refresh rules
- `.prettierrc` — singleQuote, semi, trailingComma es5, printWidth 100, tailwindcss plugin
- `postcss.config.mjs` — `@tailwindcss/postcss` processor
- `next.config.ts` — security headers, remote image patterns (placeholder), path alias support
- `.env.local` — dev env vars (API_URL, etc.)
- `.env.example` — documented required vars
- `.gitignore` — standard Next.js + node_modules + .env.local

### App Foundation (`src/app/`)
- `src/app/globals.css` — Tailwind imports, `@theme` design tokens (colors, typography, radius, shadows), CSS custom properties for light/dark/system themes, base reset/styles
- `src/app/layout.tsx` — Root layout: fonts (Inter, Playfair Display, mono), theme provider, TanStack Query provider, metadata defaults, JSON-LD Organization
- `src/app/loading.tsx` — Root skeleton loader
- `src/app/error.tsx` — Global error boundary (client component)
- `src/app/not-found.tsx` — Global 404 page
- `src/app/page.tsx` — Minimal home page for build verification
- `src/app/(store)/layout.tsx` — Store route group layout (Header + Footer placeholders, max-w-7xl container)
- `src/app/(admin)/layout.tsx` — Admin route group layout (placeholder)
- `src/app/(auth)/layout.tsx` — Auth route group layout (placeholder)

### Utility Structure (`src/lib/`)
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `src/lib/env.ts` — Zod env validation, fails build if required vars missing
- `src/lib/query-client.ts` — QueryClient instance with sensible defaults

### Shared Components Skeleton (`src/components/`)
- `src/components/ui/` — Empty directory with placeholder `button.tsx` (CVA-based) to establish pattern
- `src/components/layout/` — Empty directory
- `src/components/features/` — Empty directory

### Feature Folders (`src/features/`)
- `src/features/auth/` — Empty directories (components, hooks, schemas)
- `src/features/products/` — Empty directories
- `src/features/cart/` — Empty directories
- `src/features/checkout/` — Empty directories
- `src/features/orders/` — Empty directories
- `src/features/wishlist/` — Empty directories
- `src/features/admin/` — Empty directories

### Providers (`src/components/providers/`)
- `src/components/providers/theme-provider.tsx` — Theme context/provider (light/dark/system)
- `src/components/providers/query-provider.tsx` — TanStack Query provider wrapper

### Middleware & Types
- `src/middleware.ts` — Placeholder auth guard (not fully functional until backend exists)
- `src/types/` — Empty directory for shared TypeScript types

## 5. Design Token Plan

### Color Tokens (CSS custom properties via `@theme` in `globals.css`)

Semantic groups, each with 50–950 scale where applicable:

- `background` / `foreground`
- `primary` / `primary-foreground` — deep charcoal (#171717)
- `secondary` / `secondary-foreground`
- `muted` / `muted-foreground`
- `accent` / `accent-foreground` — warm red (#d6001c)
- `destructive` / `destructive-foreground`
- `success` / `success-foreground`
- `warning` / `warning-foreground`
- `border` / `input` / `ring`

Dark mode overrides via `[data-theme="dark"]` selector on `:root` or `html`.

### Typography Tokens

- `--font-sans`: Inter
- `--font-display`: Playfair Display
- `--font-mono`: system mono

### Spacing / Radius / Shadows / Transitions

Use Tailwind defaults exclusively. No arbitrary values.

- Radius: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full`
- Shadows: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`
- Transitions: `transition-colors` (150ms), `transition-all` (200ms), `duration-300` for drawers/modals

### Breakpoints

Mobile-first Tailwind defaults: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px.

## 6. Implementation Order

1. **Scaffold**: `npx create-next-app@latest` with TypeScript, Tailwind, App Router, no src dir, no import alias, no ESLint (we will reconfigure). OR manually create files to match exact architecture.
2. **Configure**: tsconfig, eslint, prettier, postcss, next.config, env files
3. **Install**: All dependencies listed above
4. **Tokens**: `globals.css` with full `@theme` token system + light/dark CSS variables
5. **Utilities**: `cn()`, `env.ts`, `query-client.ts`
6. **Providers**: Theme provider, Query provider
7. **Layouts**: Root layout, store/admin/auth layouts with metadata
8. **Boundaries**: loading.tsx, error.tsx, not-found.tsx
9. **UI Primitives**: Button (CVA) as canonical example
10. **Verify**: `npm run lint`, `tsc --noEmit`, `next build`

## 7. Verification

- `npm run lint` — zero errors
- `npx tsc --noEmit` — zero errors
- `npm run build` — succeeds
- Root page renders at `/`
- `/not-found` renders global 404
- Error boundary exists at `app/error.tsx`

## 8. Risks & Mitigations

- **Tailwind v4 stability**: Use `@tailwindcss/postcss` which is the v4 standard. If issues arise, fall back to v3 with `tailwind.config.ts`.
- **Design token duplication**: Enforce `globals.css` as the only token source. No `tokens.ts` or JSON files.
- **Dark mode complexity**: Keep it minimal — just CSS variable overrides on `[data-theme="dark"]`. No complex theming logic.
- **Over-engineering**: Stop at the minimum viable foundation. Do not build Header/Footer content, do not build auth forms, do not build admin shell.

## 9. Out of Scope (for this milestone)

- Admin login/dashboard
- Products, categories, cart, checkout, orders, payment
- Customer pages
- TanStack Query hooks (deferred to feature milestones)
- React Hook Form implementations
- Testing setup (Vitest/Playwright) — deferred to quality milestone
- Middleware auth guards (placeholder only)
- Actual API client modules in `lib/api/` (deferred)
