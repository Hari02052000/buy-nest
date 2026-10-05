# Validation UX and Input Normalization Plan

## Context
- Project: Buy Nest (Next.js frontend)
- Current: React Hook Form + Zod validation in LoginForm
- Components: FormInput (RHF wrapper), Input (primitive), login.schema.ts
- All previous shake changes reverted - starting fresh

## Requirements Summary
1. Shake animation on validation error (150-250ms, horizontal, respects prefers-reduced-motion)
2. No universal sanitizer - field-specific normalization only
3. Normalize email: trim + lowercase (in Zod schema)
4. Password: preserve exact value, no modification
5. Client validation ≠ security boundary (backend remains authoritative)
6. **Shake is optional per field** - FormInput prop `enableShake` (default true)
7. **Shake triggers**: on field blur (first error in DOM order) AND on form submit (first invalid in DOM order)

---

## Bugs in Previous Implementation (to avoid)
| Bug | Root Cause | Fix |
|-----|------------|-----|
| Both fields shaking | Race condition: `firstErrorName` state checked during registration but updates are async | Use DOM order for first-error tracking (no registration timing issues) |
| Shake doesn't stop | `setState` in effect + `setTimeout` cleanup unreliable; imperative handle didn't coordinate | Each field manages own shake state; CSS animation auto-cleans via `animationend` |
| Optional shake not implemented | Missing feature | Add `enableShake` prop to FormInput (default true) |

---

## Implementation Tasks

### 1. Add Shake Animation CSS (globals.css)
**File:** `src/app/globals.css`

- Add `@keyframes shake` with horizontal transform (translateX)
- Duration: 180ms, 3-4 oscillations
- Wrap in `@media (prefers-reduced-motion: no-preference)`
- Add utility class `.shake` that applies the animation
- Use `animation-fill-mode: both` to prevent layout shift

```css
@media (prefers-reduced-motion: no-preference) {
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-4px); }
    40%, 80% { transform: translateX(4px); }
  }
  .shake {
    animation: shake 180ms ease-in-out both;
  }
}
```

### 2. Create Shake Context for Field Coordination
**File:** `src/components/form/ShakeContext.tsx` (new file)

- React Context to coordinate "first error" detection across FormInput instances
- **Tracks fields by DOM order** (registration order = render order = DOM order)
- No `firstErrorName` state - compute first error on-demand to avoid race conditions
- API:
  - `registerField(name: string, hasError: boolean, enableShake: boolean, triggerShake: () => void)` - returns nothing
  - `unregisterField(name: string)` - cleanup
  - `requestShakeFirstInvalid()` - finds first field with `hasError && enableShake` by registration order, calls its `triggerShake()`

```tsx
interface FieldRegistration {
  name: string;
  hasError: boolean;
  enableShake: boolean;
  triggerShake: () => void;
}

interface ShakeContextValue {
  registerField: (name: string, hasError: boolean, enableShake: boolean, triggerShake: () => void) => void;
  unregisterField: (name: string) => void;
  requestShakeFirstInvalid: () => void;
}
```

**Key logic for `requestShakeFirstInvalid`:**
```tsx
const requestShakeFirstInvalid = useCallback(() => {
  if (prefersReducedMotionRef.current) return;
  // Fields registered in render order = DOM order
  for (const field of fieldsRef.current.values()) {
    if (field.hasError && field.enableShake) {
      field.triggerShake();
      break; // Only FIRST error field shakes
    }
  }
}, []);
```

### 3. Modify FormInput to Use Shake Context
**File:** `src/components/form/FormInput.tsx`

- Add `enableShake?: boolean` prop (default `true`)
- Consume ShakeContext (optional - if no provider, shake works locally only)
- On mount: register field with `registerField(name, hasError, enableShake, triggerShake)`
- On `hasError` or `enableShake` change: re-register
- On unmount: `unregisterField(name)`
- **Local shake state**: `const [shouldShake, setShouldShake] = useState(false)`
- **`triggerShake` function**: if `enableShake` and not reduced motion, `setShouldShake(true)` + `setTimeout(() => setShouldShake(false), 200)`
- **Blur trigger**: `useEffect` watches `hasError` - when transitions `false → true`, check if this field is first error (via context or local logic) and shake
- Apply `.shake` class to input wrapper when `shouldShake`

**Key fix for infinite loop:** Use `hasError` (boolean) instead of `error` (object) in useEffect dependency array, since React Hook Form's `error` object is a new reference on every render even when content is unchanged.

**Blur shake logic (first error on blur):**
```tsx
const hasError = Boolean(error); // Compute BEFORE useEffect

useEffect(() => {
  if (shakeContext) {
    shakeContext.registerField(name, hasError, enableShake, triggerShake);
    return () => shakeContext.unregisterField(name);
  }
}, [name, hasError, enableShake, triggerShake, shakeContext]); // Use hasError, not error
```

### 4. Update LoginForm to Trigger Shake on Submit
**File:** `src/features/admin/auth/LoginForm.tsx`

- Wrap form with `<ShakeProvider>`
- Use `useShakeContext()` to get `requestShakeFirstInvalid`
- Add `useEffect` watching `form.formState.isSubmitted` and `form.formState.errors`
- When `isSubmitted` becomes true and there are validation errors, call `requestShakeFirstInvalid()`

```tsx
const isSubmitted = form.formState.isSubmitted;
const errors = form.formState.errors;

useEffect(() => {
  if (isSubmitted && (errors.email || errors.password)) {
    requestShakeFirstInvalid();
  }
}, [isSubmitted, errors, requestShakeFirstInvalid]);
```

- Use `form.handleSubmit(onSubmit)` directly on `<form>` (no wrapper function)

### 5. Update Login Schema with Email Normalization
**File:** `src/features/admin/auth/login.schema.ts`

- Add `.transform()` to email field: trim + lowercase
- Use `.pipe()` for validation after transform
- Password field: no transform (preserve exact value)

```typescript
export const loginSchema = z.object({
  email: z
    .string()
    .transform((val) => val.trim().toLowerCase())
    .pipe(z.string().min(1, "Email is required").email("Please enter a valid email address")),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

### 6. Verify Password Pass-Through
**File:** `src/features/admin/auth/login.schema.ts` / `LoginForm.tsx`

- Confirm password field has no `.transform()` or `.trim()`
- Ensure FormInput doesn't modify password value (currently it doesn't)
- No additional changes needed

---

## Validation Checklist

| Requirement | Implementation |
|-------------|----------------|
| Shake animation 150-250ms | 180ms keyframe animation |
| Horizontal shake | translateX(-4px/4px) |
| Subtle/professional | Small offset, ease-in-out |
| No full form/page shake | Applied to input wrapper only |
| Error message primary feedback | Unchanged - animation is secondary |
| First error field shakes on blur | DOM order tracking via context |
| First invalid field shakes on submit | `requestShakeFirstInvalid()` uses DOM order |
| Repeats on each submit attempt | Effect watches `isSubmitted` |
| Stops after animation | `setTimeout` cleanup (200ms) |
| prefers-reduced-motion respected | Media query + runtime check in context & component |
| No animation library added | Pure CSS in globals.css |
| Optional per field | `enableShake` prop on FormInput (default true) |
| Email: trim + lowercase | Zod transform + pipe |
| Password: no modification | No transform in schema |
| Normalization before validation | Zod transform runs first |
| No universal sanitizer | Field-specific only in schema |
| Client ≠ security boundary | Backend auth.service unchanged |

---

## Files to Modify

1. `src/app/globals.css` - Add shake keyframes and utility class
2. `src/components/form/ShakeContext.tsx` - NEW: Context for coordinating shake across fields
3. `src/components/form/FormInput.tsx` - Add `enableShake` prop, use ShakeContext, local shake state
4. `src/features/admin/auth/LoginForm.tsx` - Wrap with ShakeProvider, trigger shake on submit
5. `src/features/admin/auth/login.schema.ts` - Add email normalization transform

---

## Out of Scope

- Rich text sanitization (future feature)
- Generic sanitization framework
- Other form fields (only admin login email/password)
- Server-side changes (backend remains authoritative)