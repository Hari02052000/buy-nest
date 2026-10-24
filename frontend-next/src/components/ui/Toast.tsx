"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitive.Provider;

const ToastViewport = ToastPrimitive.Viewport;

const Toast = ToastPrimitive.Root;

const ToastTitle = ToastPrimitive.Title;

const ToastDescription = ToastPrimitive.Description;

const ToastClose = ToastPrimitive.Close;

const ToastAction = ToastPrimitive.Action;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};