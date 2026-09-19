"use client";

import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

interface FieldRegistration {
  name: string;
  hasError: boolean;
  enableShake: boolean;
  triggerShake: () => void;
}

interface ShakeContextValue {
  registerField: (
    name: string,
    hasError: boolean,
    enableShake: boolean,
    triggerShake: () => void
  ) => void;
  unregisterField: (name: string) => void;
  requestShakeFirstInvalid: () => void;
}

const ShakeContext = createContext<ShakeContextValue | null>(null);

export function ShakeProvider({ children }: { children: ReactNode }) {
  const fieldsRef = useRef<Map<string, FieldRegistration>>(new Map());
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    prefersReducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const registerField = useCallback(
    (
      name: string,
      hasError: boolean,
      enableShake: boolean,
      triggerShake: () => void
    ) => {
      const registration: FieldRegistration = {
        name,
        hasError,
        enableShake,
        triggerShake,
      };

      fieldsRef.current.set(name, registration);
    },
    []
  );

  const unregisterField = useCallback((name: string) => {
    fieldsRef.current.delete(name);
  }, []);

  const requestShakeFirstInvalid = useCallback(() => {
    if (prefersReducedMotionRef.current) return;

    for (const field of fieldsRef.current.values()) {
      if (field.hasError && field.enableShake) {
        field.triggerShake();
        break;
      }
    }
  }, []);

  return (
    <ShakeContext.Provider
      value={{ registerField, unregisterField, requestShakeFirstInvalid }}
    >
      {children}
    </ShakeContext.Provider>
  );
}

export function useShakeContext() {
  const context = useContext(ShakeContext);
  if (!context) {
    throw new Error(
      "useShakeContext must be used within a ShakeProvider"
    );
  }
  return context;
}