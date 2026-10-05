"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * App-wide TanStack Query provider for the App Router.
 *
 * The QueryClient is created lazily in state so each browser session gets a
 * single stable client, and it is never shared across requests on the server.
 * Kept intentionally minimal — no global state system beyond TanStack Query.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Auth state changes rarely within a view; avoid refetch churn.
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
