"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";

interface ToastData {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  variant?: "default" | "destructive" | "success";
  className?: string;
}

const TOAST_LIMIT = 5;

type ToastState = ToastData[];

interface ToastContextType {
  toasts: ToastState;
  toast: (props: Omit<ToastData, "id">) => { id: string; dismiss: () => void; update: (props: Partial<ToastData>) => void };
  dismiss: (toastId?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProviderComponent({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastState>([]);

  const toast = useCallback((props: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).slice(2);
    const newToast: ToastData = { ...props, id };
    
    setToasts((prev) => [newToast, ...prev].slice(0, TOAST_LIMIT));
    
    return {
      id,
      dismiss: () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      update: (updateProps: Partial<ToastData>) => 
        setToasts((prev) => prev.map((t) => t.id === id ? { ...t, ...updateProps } : t)),
    };
  }, []);

  const dismiss = useCallback((toastId?: string) => {
    setToasts((prev) => toastId ? prev.filter((t) => t.id !== toastId) : []);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastProvider>
        <ToastViewport className="fixed bottom-0 right-0 flex flex-col p-4 sm:w-[420px] gap-2 z-50" />
      </ToastProvider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      <ToastViewport className="fixed bottom-0 right-0 flex flex-col p-4 sm:w-[420px] gap-2 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          className={cn(
            "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
            toast.variant === "default" && "border-border bg-surface text-foreground",
            toast.variant === "destructive" && "border-destructive bg-destructive text-destructive-foreground",
            toast.variant === "success" && "border-green-500 bg-green-500 text-white",
            toast.className
          )}
        >
          <div className="grid gap-1">
            {toast.title && <ToastTitle className="text-sm font-semibold">{toast.title}</ToastTitle>}
            {toast.description && <ToastDescription className="text-sm opacity-90">{toast.description}</ToastDescription>}
          </div>
          <ToastClose
            className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
            aria-label="Dismiss"
          >
            <XIcon className="h-4 w-4" />
          </ToastClose>
        </Toast>
      ))}
    </ToastViewport>
    </ToastProvider>
  );
}