# Design System Architecture

This document defines the target UI/design-system architecture for the Buy Nest e-commerce frontend rebuild. It is a companion to `nextjs-architecture.md` and the other architecture documents in this folder.

The design system is built on **Tailwind CSS** with **CSS custom properties** for theming. It replaces the existing MUI-based design system (two incompatible themes, CSS-in-JS runtime, inconsistent component patterns) with a single, cohesive, token-driven system.

---

## 1. Design Tokens

All design tokens are defined as **CSS custom properties** in `app/globals.css` using the Tailwind v4 `@theme` directive (or `tailwind.config.ts` for Tailwind v3). Tokens are organized into semantic groups.

### 1.1 Colors

**Base palette:**
- `background` / `foreground` — Page canvas and primary text.
- `primary` / `primary-foreground` — Brand color, CTAs, active states.
- `secondary` / `secondary-foreground` — Subtle surfaces, hover states.
- `muted` / `muted-foreground` — Disabled, helper text, metadata.
- `accent` / `accent-foreground` — Highlights, focus rings.
- `destructive` / `destructive-foreground` — Errors, delete actions, warnings.
- `success` / `warning` / `info` — Status indicators, form feedback.
- `border` / `input` / `ring` — Form borders, focus indicators.

**Scale:** Each color group uses a 50–950 scale (light to dark), matching Tailwind's default scale.

**Current codebase inspiration:**
- User theme: black primary, red secondary.
- Admin theme: dark navy primary, green accent.
- **Target:** A single neutral-primary system. Primary is a deep charcoal (`#171717`). Accent is a warm red (`#d6001c`) for CTAs and badges. Success, warning, and info are standard semantic colors.

**Rules:**
- Never hardcode hex values in components. Always use token classes (e.g., `bg-primary`, `text-destructive`).
- Never use arbitrary values for colors (e.g., `bg-[#123456]`) unless the color is not in the token system. If you need a new color, add it to the token system first.

### 1.2 Semantic Colors

Semantic colors map tokens to meaning:

| Token | Usage |
|-------|-------|
| `text-destructive` | Error messages, delete buttons |
| `bg-destructive` | Destructive action backgrounds |
| `text-success` | Success messages, in-stock indicators |
| `bg-success` | Success banners |
| `text-warning` | Warning messages, low-stock indicators |
| `border-border` | All borders (cards, inputs, dividers) |
| `bg-muted` | Disabled backgrounds, secondary surfaces |
| `text-muted-foreground` | Placeholder text, helper text, metadata |

### 1.3 Typography

**Font families:**
- `--font-sans`: `Inter` — All interface text, forms, navigation, body copy.
- `--font-display`: `Playfair Display` — Product titles, hero headings, brand moments.
- `--font-mono`: `Geist Mono` or system mono — Prices, codes, admin data tables.

**Loading:** `next/font` with `self-hosted: true` for zero layout shift.

### 1.4 Font Sizes

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 0.75rem | 1rem | Captions, labels, badges, helper text |
| `text-sm` | 0.875rem | 1.25rem | Secondary text, metadata, input text |
| `text-base` | 1rem | 1.5rem | Body text, forms, navigation |
| `text-lg` | 1.125rem | 1.75rem | Lead text, card descriptions |
| `text-xl` | 1.25rem | 1.75rem | Section headings |
| `text-2xl` | 1.5rem | 2rem | Product titles, card headings |
| `text-3xl` | 1.875rem | 2.25rem | Page headings |
| `text-4xl` | 2.25rem | 2.5rem | Hero headings |
| `text-5xl` | 3rem | 1.2 | Brand / marketing headlines |

**Rules:**
- Never use raw pixel values. Always use Tailwind type scale.
- Line height is tied to the size class. Do not override `leading-` arbitrarily.
- Maximum measure: `max-w-prose` (65ch) for long-form text.

### 1.5 Font Weights

| Token | Weight | Usage |
|-------|--------|-------|
| `font-normal` | 400 | Body text, form inputs |
| `font-medium` | 500 | Navigation, button text, labels |
| `font-semibold` | 600 | Card titles, section headings |
| `font-bold` | 700 | Hero text, brand logo |

### 1.6 Spacing

Tailwind's default spacing scale (4px base) is used exclusively.

| Token | Value | Usage |
|-------|-------|-------|
| `p-1` / `m-1` | 0.25rem | Tight spacing inside components |
| `p-2` / `m-2` | 0.5rem | Component padding |
| `p-4` / `m-4` | 1rem | Standard section spacing |
| `p-6` / `m-6` | 1.5rem | Large section spacing |
| `p-8` / `m-8` | 2rem | Page-level spacing |
| `gap-2` | 0.5rem | Tight gaps between items |
| `gap-4` | 1rem | Standard gaps |
| `gap-6` | 1.5rem | Large gaps |

**Rules:**
- Never hardcode pixel values for spacing. Use Tailwind spacing utilities.
- For components with internal spacing, use consistent gaps (`gap-2`, `gap-4`, `gap-6`).

### 1.7 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 0.125rem | Small accents, badges |
| `rounded-md` | 0.375rem | Buttons, inputs, tabs |
| `rounded-lg` | 0.5rem | Cards, dialogs, drawers |
| `rounded-xl` | 0.75rem | Large cards, modals |
| `rounded-full` | 9999px | Pills, avatars, circular icons |

**Rules:**
- Use `rounded-md` for most interactive elements.
- Use `rounded-lg` for containers (cards, panels).
- Avoid mixing multiple radius values in the same component.

### 1.8 Shadows

| Token | Usage |
|-------|-------|
| `shadow-sm` | Subtle elevation for cards on hover |
| `shadow-md` | Standard card shadow |
| `shadow-lg` | Elevated modals, drawers, dropdowns |
| `shadow-xl` | Floating elements, active dialogs |

**Rules:**
- Use shadow sparingly. The existing MUI code overuses `boxShadow`.
- Shadows should indicate elevation only. Do not use shadows for decoration.

### 1.9 Breakpoints

Mobile-first Tailwind defaults:

| Breakpoint | Min-width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Large phones, small tablets |
| `md` | 768px | Tablets, small laptops |
| `lg` | 1024px | Laptops, desktops |
| `xl` | 1280px | Large desktops |
| `2xl` | 1536px | Extra-wide |

**Rules:**
- All responsive styles use mobile-first prefixes (`sm:`, `md:`, `lg:`, `xl:`).
- Never use `max-width` media queries. Tailwind's mobile-first approach is sufficient.

### 1.10 Containers

| Token | Max-width | Usage |
|-------|-----------|-------|
| `max-w-sm` | 640px | Narrow forms, centered content |
| `max-w-md` | 768px | Medium content areas |
| `max-w-lg` | 1024px | Standard content |
| `max-w-xl` | 1280px | Wide layouts, admin tables |
| `max-w-7xl` | 1280px | Default container for store pages |
| `max-w-screen-2xl` | 1536px | Extra-wide layouts |

**Rules:**
- Use `container mx-auto px-4` for page containers.
- Use `max-w-7xl` for store pages. Use `max-w-xl` for admin tables.

### 1.11 Transitions / Motion

| Token | Value | Usage |
|-------|-------|-------|
| `transition-colors` | 150ms | Hover states, button backgrounds |
| `transition-all` | 200ms | Card hover, expand/collapse |
| `duration-300` | 300ms | Drawer slide, modal fade |
| `ease-in-out` | — | Smooth state changes |
| `ease-out` | — | Entrance animations |

**Rules:**
- Use `transition-colors` for hover/focus states.
- Use `transition-all` sparingly (cards, collapsibles).
- No custom animation libraries unless required. CSS transitions are sufficient for this project.

---

## 2. Responsive Design

### Mobile

- **Breakpoint:** `< md` (below 768px)
- **Layout:** Single column. Stack grids vertically.
- **Navigation:** Hamburger menu. Categories collapse into a drawer or accordion.
- **Header:** Logo centered, icons only (no text links).
- **Cards:** Full width, stacked.
- **Forms:** Single column, full-width inputs.
- **Touch targets:** Minimum `h-11` (44px).

### Tablet

- **Breakpoint:** `md` to `lg` (768px – 1024px)
- **Layout:** 2-column grids for products.
- **Navigation:** Horizontal nav links visible.
- **Header:** Search bar visible, categories bar visible.
- **Cards:** 2-column grid.

### Desktop

- **Breakpoint:** `lg` and above (1024px+)
- **Layout:** 3–4 column grids for products.
- **Navigation:** Full horizontal nav with category chips.
- **Header:** All elements visible.
- **Cards:** 3–4 column grid depending on viewport width.

### Responsive Layout Principles

1. **Mobile-first.** Write styles for mobile first, then add `md:` and `lg:` overrides.
2. **Fluid grids.** Use CSS Grid with responsive column counts: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`.
3. **Content reflow, not hide.** Prefer reordering and stacking over hiding content on mobile.
4. **Container queries (future).** If component-level responsiveness becomes complex, evaluate container queries. For now, viewport breakpoints are sufficient.

---

## 3. UI Primitives

UI primitives are the foundational building blocks. They live in `components/ui/`. They are styled with Tailwind classes, accept `className` for composition, and use `class-variance-authority` (CVA) for variant management where needed.

### 3.1 Button

```tsx
<Button variant="default" size="md">Add to Cart</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="destructive" size="lg">Delete</Button>
```

**Variants:**
- `default` — Solid primary background.
- `outline` — Border only, transparent background.
- `ghost` — No border, hover background.
- `destructive` — Red background, white text.
- `link` — Text only, underlined on hover.

**Sizes:**
- `sm` — `h-9 px-3 text-sm`
- `md` — `h-10 px-4 text-base` (default)
- `lg` — `h-11 px-8 text-lg`

**Rules:**
- All buttons must have a `disabled` state with reduced opacity and `cursor-not-allowed`.
- Icon buttons must have `aria-label`.
- Loading state uses a spinner inside the button or replaces text with "Loading...".

### 3.2 Input

```tsx
<Input placeholder="Email" error={errors.email} />
```

**Variants:**
- `default` — Standard border.
- `error` — Red border, error message below.
- `disabled` — Grayed out, no interaction.

**Rules:**
- All inputs have a visible label (or `aria-label`).
- Error messages are displayed below the input in `text-destructive`.
- Focus state uses `ring-2 ring-ring ring-offset-2`.

### 3.3 Select

Native `<select>` styled with Tailwind, or a custom `Select` primitive built on a `<button>` + `<ul>` pattern for full styling control.

**Rules:**
- If using native `<select>`, apply Tailwind appearance utilities.
- If building custom, ensure keyboard navigation and `aria-expanded`.

### 3.4 Checkbox

Custom checkbox built on `<input type="checkbox">` with hidden native input and styled `<span>` indicator.

**Rules:**
- Label is clickable and associated with the input.
- Focus state is visible.
- Indeterminate state supported (for "Select all").

### 3.5 Radio

Custom radio group built on `<input type="radio">` with styled indicators.

**Rules:**
- Group uses `role="radiogroup"` with `aria-label`.
- Keyboard navigation with arrow keys.

### 3.6 Dialog (Modal)

Modal overlay with centered content. Built on a portal with focus trap.

**Rules:**
- Closes on `Escape` key.
- Focus is trapped inside the modal.
- Background scroll is locked.
- Returns focus to the trigger on close.

### 3.7 Drawer (Slide-over)

Side panel that slides in from the right (cart drawer) or left (mobile navigation).

**Rules:**
- Closes on `Escape` key and overlay click.
- Focus is trapped inside.
- Backdrop blur or dimmed overlay.
- Swipe-to-close on mobile (optional).

### 3.8 Card

Container for grouped content.

```tsx
<Card>
  <CardMedia src={product.images[0]?.url} alt={product.name} />
  <CardContent>
    <Typography variant="h3">{product.name}</Typography>
  </CardContent>
  <CardFooter>
    <Button>Add to Cart</Button>
  </CardFooter>
</Card>
```

**Variants:**
- `default` — White background, border, shadow-sm.
- `elevated` — White background, shadow-md, no border.
- `outline` — Transparent background, border only.

**Rules:**
- Cards are not interactive by default. If the entire card is clickable, make it a `<button>` or wrap in a `<Link>`.
- Media aspect ratios are consistent (e.g., `aspect-square` for product images).

### 3.9 Badge

Small status indicator.

```tsx
<Badge variant="default">New</Badge>
<Badge variant="destructive">Out of stock</Badge>
<Badge variant="outline">Draft</Badge>
```

**Rules:**
- Badges use `text-xs` font size.
- Rounded full or rounded sm.
- Semantic colors only (no arbitrary colors).

### 3.10 Tabs

Horizontal tab list with content panels.

```tsx
<Tabs defaultValue="description">
  <TabsList>
    <TabsTrigger value="description">Description</TabsTrigger>
    <TabsTrigger value="specifications">Specifications</TabsTrigger>
  </TabsList>
  <TabsContent value="description">...</TabsContent>
</Tabs>
```

**Rules:**
- Active tab is indicated by color and underline or fill.
- Keyboard navigation with arrow keys.

### 3.11 Skeleton

Loading placeholder that matches the shape of the content.

```tsx
<Skeleton className="h-48 w-full rounded-lg" />
<Skeleton className="h-4 w-3/4" />
```

**Rules:**
- Skeletons use `animate-pulse` from Tailwind.
- Skeletons must match the final content dimensions to prevent layout shift.
- Every loading state has a matching skeleton.

### 3.12 Loading Indicators

- **Spinner:** Use for action-level loading (button, form submission). Not for page-level loading.
- **Progress bar:** For multi-step processes (checkout steps, file upload).
- **Skeleton:** For content loading (product grids, order lists).

**Rules:**
- Page-level loading uses `loading.tsx` with skeletons.
- Action-level loading uses `Button` with `isPending` state.
- No full-page spinners unless the entire page is loading for the first time.

### 3.13 Tooltip

Brief informational text on hover or focus.

**Rules:**
- Triggered by `hover` and `focus`.
- Positioned to avoid viewport edges.
- Uses `role="tooltip"`.

### 3.14 Other Primitives (Justified)

| Primitive | Justification |
|-----------|---------------|
| `Alert` | Inline feedback for errors, warnings, success. Used by TanStack Query error states. |
| `Separator` | Visual dividers between sections. |
| `Avatar` | User profile images in header and account pages. |
| `Sheet` | Mobile-friendly drawer/modal primitive (can replace custom drawer). |

**Not included (and why):**
- No `DatePicker` — not needed for current scope. Add if date selection is required.
- No `Calendar` — not needed.
- No `DataTable` — admin tables use standard HTML `<table>` with Tailwind or a lightweight table library if needed. TanStack Table is overkill for this project.
- No `Carousel` — the existing `react-slick` is heavy. Use `embla-carousel-react` if a carousel is needed, or build a simple one with CSS scroll snap.

---

## 4. Shared Application Components

These components are used across multiple features. They live in `components/layout/` or `components/features/`.

### 4.1 Header

- **Location:** `components/layout/header.tsx`
- **Type:** Client Component (`'use client'`)
- **Contains:** Logo, navigation links, search input, category dropdown trigger, cart icon with badge, wishlist icon with badge, auth links (Login/Signup or user name + Logout).
- **Rules:**
  - The Header reads cart count and wishlist count from TanStack Query (`useQuery(['cart'])`, `useQuery(['wishlist'])`).
  - Search input writes to URL state (`?q=...`).
  - Category dropdown is a collapsible section, not a separate page.
  - No AuthContext. Auth state comes from `useAuth()`.

### 4.2 Footer

- **Location:** `components/layout/footer.tsx`
- **Type:** Server Component (static links)
- **Contains:** Newsletter signup, quick links, customer service links, social icons, copyright.
- **Rules:**
  - No interactivity needed. Server Component.
  - Newsletter form is a Client Component embedded in the footer if needed.

### 4.3 Breadcrumbs

- **Location:** `components/layout/breadcrumbs.tsx`
- **Type:** Server Component or Client Component depending on data source.
- **Contains:** Home > Category > Product links.
- **Rules:**
  - Uses semantic `<nav>` and `<ol>`.
  - Current page is not a link.

### 4.4 Pagination

- **Location:** `components/features/pagination.tsx`
- **Type:** Client Component
- **Contains:** Previous, next, page numbers, page size selector.
- **Rules:**
  - Reads and writes URL `?page=` parameter.
  - Disables at boundaries (first page, last page).

### 4.5 Search

- **Location:** `components/features/search-input.tsx`
- **Type:** Client Component
- **Contains:** Debounced input, search icon, clear button.
- **Rules:**
  - Writes to URL `?q=` parameter.
  - Debounces input (300ms) before updating URL.
  - Clear button resets the search.

### 4.6 Feedback States

- **EmptyState:** Icon, title, description, optional action link.
- **ErrorState:** Error icon, title, description, retry button.
- **SuccessState:** Success icon, title, optional action.
- **Location:** `components/features/feedback-states.tsx` or separate files.
- **Rules:**
  - Every list/grid has an empty state.
  - Every error state is actionable.

---

## 5. Feature Components

Feature components are specific to a domain. They live in `features/[domain]/components/`.

### 5.1 Product Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ProductCard` | `features/products/components/product-card.tsx` | Displays product image, name, price, add-to-cart, wishlist toggle. |
| `ProductGrid` | `features/products/components/product-grid.tsx` | Responsive grid of `ProductCard`s. |
| `ProductCarousel` | `features/products/components/product-carousel.tsx` | Hero carousel or featured products carousel. |
| `ProductFilters` | `features/products/components/product-filters.tsx` | Category, price, brand filters. |
| `ProductSort` | `features/products/components/product-sort.tsx` | Sort dropdown. |
| `ProductDetailClient` | `features/products/components/product-detail-client.tsx` | Client-side interactivity for product detail page (carousel, tabs, qty picker). |

**Rules:**
- `ProductCard` is a single canonical component. No `ProductCard1` duplicates.
- `ProductCard` accepts `product` as a prop. It does not fetch data itself.
- Image aspect ratio is `aspect-square` by default.

### 5.2 Cart Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `CartPage` | `features/cart/components/cart-page.tsx` | Full cart page with items, summary, coupon. |
| `CartItem` | `features/cart/components/cart-item.tsx` | Single cart item row with quantity controls. |
| `CartSummary` | `features/cart/components/cart-summary.tsx` | Subtotal, tax, shipping, total. |
| `CouponInput` | `features/cart/components/coupon-input.tsx` | Coupon code input with apply/remove. |
| `CartDrawer` | `features/cart/components/cart-drawer.tsx` | Slide-over cart from header. |

**Rules:**
- Cart reads from TanStack Query `useQuery(['cart'])`.
- Quantity changes use optimistic updates.
- Cart is not a global context.

### 5.3 Checkout Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `CheckoutFlow` | `features/checkout/components/checkout-flow.tsx` | Multi-step checkout wizard. |
| `ShippingForm` | `features/checkout/components/shipping-form.tsx` | Address form with React Hook Form + Zod. |
| `PaymentForm` | `features/checkout/components/payment-form.tsx` | Stripe Elements wrapper. |
| `OrderSummary` | `features/checkout/components/order-summary.tsx` | Order total, items, payment method. |

**Rules:**
- Checkout is a multi-step flow: Shipping → Payment → Review → Confirm.
- Forms use React Hook Form + Zod.
- Payment uses Stripe Elements via `@stripe/react-stripe-js`.

### 5.4 Account Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ProfileDashboard` | `features/auth/components/profile-dashboard.tsx` | User name, email, member since. |
| `AddressBook` | `features/account/components/address-book.tsx` | List, add, edit, delete addresses. |
| `OrderHistory` | `features/orders/components/order-history.tsx` | List of past orders. |
| `OrderDetail` | `features/orders/components/order-detail.tsx` | Single order with items, status, tracking. |

**Rules:**
- All account pages are protected by middleware + `ProtectedRoute`.
- Account data comes from TanStack Query.

### 5.5 Order Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `OrderCard` | `features/orders/components/order-card.tsx` | Summary card for order list. |
| `OrderStatus` | `features/orders/components/order-status.tsx` | Status chip with color coding. |
| `OrderTracking` | `features/orders/components/order-tracking.tsx` | Timeline of order statuses. |

### 5.6 Admin Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `AdminLayout` | `features/admin/components/admin-layout.tsx` | Sidebar + topbar shell. |
| `ProductTable` | `features/admin/components/product-table.tsx` | Product list with edit/delete actions. |
| `CategoryTree` | `features/admin/components/category-tree.tsx` | Nested category list. |
| `OrderTable` | `features/admin/components/order-table.tsx` | Order list with status editing. |
| `ImageUpload` | `features/admin/components/image-upload.tsx` | Drag-and-drop image uploader. |

**Rules:**
- Admin components use the same UI primitives but may have different density and layout (more data-dense, more tables).
- Admin forms use the same React Hook Form + Zod pattern as store forms.

---

## 6. Component Ownership Rules

### 6.1 What belongs in `components/ui/`

**UI primitives** — generic, framework-agnostic building blocks with no business logic:
- Button, Input, Select, Checkbox, Radio
- Card, Badge, Tabs, Dialog, Drawer, Sheet
- Skeleton, Spinner, Alert, Toast
- Avatar, Separator, Tooltip
- Breadcrumbs, Pagination (if generic)

**Rules:**
- Primitives accept `className` and use `cn()` for merging.
- Primitives have no knowledge of the domain (no "Add to Cart" text hardcoded).
- Primitives are styled entirely with Tailwind classes.

### 6.2 What belongs in `components/layout/`

**Structural components** that define the page shell:
- Header, Footer, Breadcrumbs
- AdminShell (sidebar + topbar)
- MobileNav

**Rules:**
- Layout components may read from TanStack Query for data needed in the shell (e.g., cart count in Header).
- Layout components do not contain business logic.

### 6.3 What belongs in `components/features/`

**Shared feature components** used by multiple features or routes:
- `OrderSuccessModal` — used by checkout and order pages.
- `PaymentForm` — used by checkout and admin order edit.
- `SearchInput` — used by Header and search page.
- `EmptyState`, `ErrorState` — used everywhere.

**Rules:**
- If a component is used by only one feature, it lives in that feature's `components/` folder.
- If a component is used by 2+ features, it lives in `components/features/`.

### 6.4 What belongs inside `features/`

**Domain-specific components, hooks, schemas, and API re-exports:**
- `features/products/components/` — ProductCard, ProductGrid, ProductCarousel
- `features/products/hooks/` — `use-products.ts`, `use-product-detail.ts`
- `features/products/schemas/` — `product-filter.schema.ts`
- `features/products/api.ts` — Re-exports from `lib/api/products.ts`

**Rules:**
- Everything related to a feature lives in its folder.
- Pages (`app/.../page.tsx`) import from `features/`, not the other way around.
- Features do not import from each other's `components/` directly. Shared components move to `components/features/`.

### 6.5 What belongs at page level

**Page shells and composition:**
- `app/(store)/products/[id]/page.tsx` — Server Component that fetches product and renders `ProductDetailClient`.
- `app/(store)/cart/page.tsx` — Renders `CartPage` from `features/cart/`.

**Rules:**
- Pages are thin. They compose components; they do not contain business logic.
- Server Component pages fetch data and pass as props.
- Client Component pages orchestrate feature components.

---

## 7. Anti-Pattern Prevention Rules

These rules prevent the problems found in the existing codebase.

### 7.1 No Duplicate Components

- If two components serve the same purpose (e.g., `ProductCard.jsx` and `ProductCard1.jsx`), merge them into one.
- Search the codebase before creating a new component. If a similar one exists, extend it.

### 7.2 No Duplicate Logic

- If the same logic appears in two places (e.g., `formatPrice` in `ProductDetailPage` and `CategoryPage`), extract it to `lib/format.ts`.
- If the same API call appears in two features, it belongs in `lib/api/`.

### 7.3 No Giant Components

- No component exceeds **300 lines**. If it does, split it.
- If a component exceeds **200 lines**, consider extracting sub-components.
- Use the existing codebase's `ComputersPage.jsx` (1186 lines) and `ProductDetailPage.jsx` (742 lines) as anti-patterns.

### 7.4 No Universal Components

- Do not create a `UniversalCard` that tries to serve every use case.
- Create focused components: `ProductCard`, `OrderCard`, `CategoryCard`.
- If a component needs 10+ props to be flexible, it is doing too much.

### 7.5 No Prop Explosion

- If a component receives more than **6–8 props**, consider:
  - Grouping related props into an object.
  - Using composition (`children`) instead of props.
  - Splitting the component.

### 7.6 No Arbitrary Colors

- Every color must come from the token system.
- If you need a new color, add it to `globals.css` tokens.
- No `bg-[#123456]`, no `text-red-500` (use `text-destructive`).

### 7.7 No Arbitrary Spacing

- Every spacing value must use Tailwind's spacing scale.
- No `mt-[13px]`, no `gap-[2.5rem]`.
- If you need a value not in the scale, add a custom token or use the closest available value.

### 7.8 No Inconsistent Typography

- Every font size uses Tailwind's type scale.
- Every font family uses one of the three defined fonts.
- No inline `style={{ fontSize: 14 }}`.
- Line height follows the size class. Do not override arbitrarily.

### 7.9 No Unnecessary Abstractions

- Do not create a `useToggle` hook for a simple `const [open, setOpen] = useState(false)`.
- Do not create a `useApi` wrapper around `useQuery` unless it adds real value.
- Do not create HOCs. Use composition.
- Do not create a `withAuth` HOC. Use the `ProtectedRoute` component.

---

## 8. Accessibility Requirements

All components must meet **WCAG 2.1 AA** standards.

### 8.1 Semantic HTML

- Use `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>` instead of `<div>`.
- Buttons are `<button>`. Links are `<a>` or Next.js `<Link>`.
- Form inputs have associated `<label>` elements.

### 8.2 ARIA

- Icon-only buttons have `aria-label`.
- Dialogs have `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
- Tabs have `role="tablist"`, `role="tab"`, `role="tabpanel"`.
- Status updates use `aria-live="polite"` or `aria-live="assertive"`.
- Expandable sections have `aria-expanded`.

### 8.3 Keyboard Navigation

- All interactive elements are focusable (`<button>`, `<a>`, or `tabIndex="0"`).
- Focus order follows visual order.
- Focus is visible in all states (`focus-visible:ring-2`).
- Dialogs trap focus. On close, focus returns to the trigger.
- Dropdowns and menus support arrow key navigation.

### 8.4 Color Contrast

- All text meets WCAG AA:
  - Body text: 4.5:1 minimum contrast.
  - Large text (18px+ or 14px+ bold): 3:1 minimum.
- Do not rely on color alone to convey information (use icons or text alongside color).

### 8.5 Screen Readers

- All images have descriptive `alt` text.
- Decorative images have `alt=""`.
- Form errors are announced via `aria-describedby` linking to the error message.
- Loading states use `aria-busy="true"`.

---

## 9. Design-System Naming Conventions

### 9.1 Files

- **Components:** PascalCase (`ProductCard.tsx`, `CartDrawer.tsx`).
- **Hooks:** camelCase with `use` prefix (`use-products.ts`, `use-cart.ts`).
- **Schemas:** camelCase with `.schema` suffix (`login.schema.ts`, `product-filter.schema.ts`).
- **Utilities:** camelCase (`format.ts`, `cn.ts`).
- **Types:** camelCase or PascalCase depending on entity (`product.ts` for interfaces, `ProductCardProps` for component props).

### 9.2 Classes

- **Tailwind classes** are ordered: layout → spacing → typography → color → effects.
- Use `cn()` utility (wrapper around `clsx` + `tailwind-merge`) for conditional classes.
- Component variants use CVA with descriptive names: `variant="default"`, `variant="outline"`, `size="sm"`.

### 9.3 Tokens

- **CSS custom properties:** kebab-case with `--` prefix (`--color-primary`, `--font-sans`).
- **Tailwind classes:** kebab-case (`bg-primary`, `text-destructive`, `rounded-lg`).

### 9.4 Props

- **Component props:** camelCase (`product`, `onAddToCart`, `isLoading`).
- **Event handlers:** `on` prefix (`onClick`, `onChange`, `onSubmit`).
- **Boolean props:** `is` or `has` prefix (`isLoading`, `hasError`, `isDisabled`).

---

## 10. Important Tradeoffs

- **Tailwind vs MUI:** Tailwind generates static CSS classes and eliminates the CSS-in-JS runtime overhead of MUI Emotion. The tradeoff is that Tailwind requires more discipline with utility classes. CVA and the `cn()` helper mitigate this.
- **Single theme vs dark mode:** The existing admin panel supports dark mode. The initial target is a single light theme with CSS custom properties that make dark mode easy to add later. Do not build dark mode now unless explicitly requested.
- **Custom primitives vs shadcn/ui:** The primitives defined here are similar to shadcn/ui. The tradeoff is building them manually vs copying a library. For a portfolio project, building them demonstrates engineering skill. For speed, copying shadcn/ui is acceptable. The architecture supports either approach.
- **CVA vs inline variants:** CVA adds a small dependency but prevents prop explosion and inconsistent styling. Use it for components with 3+ variants. Use simple `className` conditional for simple cases.
- **No design tokens file vs CSS custom properties:** CSS custom properties in `globals.css` are the single source of truth. No separate `tokens.ts` or `design-tokens.json` is needed. The tradeoff is that designers cannot easily extract tokens without reading CSS, but for a single-developer project this is acceptable.
