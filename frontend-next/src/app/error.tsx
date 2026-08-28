"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold mb-2">Something went wrong!</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        We encountered an error while loading this page.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline">
          <Link href="/" className="text-current no-underline">
            Go home
          </Link>
        </Button>
      </div>
    </div>
  );
}