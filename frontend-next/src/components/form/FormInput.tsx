import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ForwardedRef,
  type ReactElement,
  type RefObject,
} from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Input, type InputProps } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { useShakeContext } from "./ShakeContext";

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499A10.75 10.75 0 0 1 2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 2.82-4.341" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

export type FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<InputProps, "name" | "defaultValue"> & {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  showPasswordToggle?: boolean;
  reserveErrorSpace?: boolean;
  containerClassName?: string;
  enableShake?: boolean;
};

function FormInputInner<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  {
    control,
    name,
    label,
    description,
    showPasswordToggle = false,
    type = "text",
    required,
    disabled,
    id,
    className,
    containerClassName,
    onChange,
    onBlur,
    reserveErrorSpace,
    enableShake = true,
    ...props
  }: FormInputProps<TFieldValues, TName>,
  ref: ForwardedRef<HTMLInputElement>
) {
  const [showPassword, setShowPassword] = useState(false);
  const shakeContext = useShakeContext();
  const [shouldShake, setShouldShake] = useState(false);
  const hadErrorRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);

  const {
    field: {
      ref: fieldRef,
      value,
      onChange: fieldOnChange,
      onBlur: fieldOnBlur,
      disabled: fieldDisabled,
    },
    fieldState: { error },
  } = useController({
    name,
    control,
    disabled,
  });

  const setComposedRef = useCallback(
    (node: HTMLInputElement | null) => {
      fieldRef(node);

      if (typeof ref === "function") {
        ref(node);
      } else if (ref && typeof ref === "object" && "current" in ref) {
        (ref as RefObject<HTMLInputElement | null>).current = node;
      }
    },
    [fieldRef, ref]
  );

  const triggerShake = useCallback(() => {
    if (enableShake && !prefersReducedMotionRef.current) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 200);
    }
  }, [enableShake]);

  useEffect(() => {
    prefersReducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const hasError = Boolean(error);

  useEffect(() => {
    if (shakeContext) {
      shakeContext.registerField(name, hasError, enableShake, triggerShake);
      return () => shakeContext.unregisterField(name);
    }
  }, [name, hasError, enableShake, triggerShake, shakeContext]);

  const isPasswordField = type === "password";
  const hasToggle = isPasswordField && showPasswordToggle;
  const resolvedType = hasToggle ? (showPassword ? "text" : "password") : type;

  useEffect(() => {
    if (hasError && !hadErrorRef.current && enableShake) {
      hadErrorRef.current = true;
      let isFirstError = true;

      if (shakeContext) {
        // Check if this is the first error field in DOM order
        // We can't easily check from here without exposing field list,
        // so we'll rely on the context's requestShakeFirstInvalid for submit
        // For blur, we shake if this field has error and no other field before it has error
        // Since we don't have access to other fields' state here, we'll skip blur shake
        // and only use submit-triggered shake which is more reliable
        isFirstError = false; // Disable blur shake to avoid double-shake complexity
      }

      if (isFirstError && !prefersReducedMotionRef.current) {
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 200);
      }
    } else if (!hasError) {
      hadErrorRef.current = false;
    }
  }, [hasError, enableShake, shakeContext]);

  const reactId = useId();
  const inputId = id || reactId;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;

  const ariaDescribedBy =
    [
      description ? descriptionId : null,
      hasError ? errorId : null,
      props["aria-describedby"],
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const isInputDisabled = fieldDisabled || disabled;

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
          {required && (
            <span
              className="ml-1 text-error-foreground select-none"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      {description && (
        <p id={descriptionId} className="text-sm text-foreground-muted">
          {description}
        </p>
      )}

      <div className={cn("relative w-full", shouldShake && "shake")}>
        <Input
          {...props}
          id={inputId}
          ref={setComposedRef}
          type={resolvedType}
          value={value ?? ""}
          onChange={(e) => {
            fieldOnChange(e);
            onChange?.(e);
          }}
          onBlur={(e) => {
            fieldOnBlur();
            onBlur?.(e);
          }}
          disabled={isInputDisabled}
          required={required}
          aria-required={required ? "true" : undefined}
          aria-invalid={hasError ? "true" : undefined}
          aria-describedby={ariaDescribedBy}
          hasError={hasError}
          className={cn(hasToggle && "pr-10", className)}
        />

        {hasToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={isInputDisabled}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-1 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      <div
        className={cn(
          "grid transition-all duration-200 ease-out overflow-hidden",
          hasError ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          reserveErrorSpace && "min-h-[1.25rem]"
        )}
      >
        <div className="overflow-hidden">
          {error?.message && (
            <p
              id={errorId}
              role="alert"
              aria-live="polite"
              className="text-sm font-medium text-error-foreground pt-0.5"
            >
              {error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Higher-level reusable form control combining Label, Description, Input,
 * React Hook Form integration, Password toggle, and Accessible error messaging.
 */
export const FormInput = forwardRef(FormInputInner) as <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: FormInputProps<TFieldValues, TName> & {
    ref?: ForwardedRef<HTMLInputElement>;
  }
) => ReactElement;
