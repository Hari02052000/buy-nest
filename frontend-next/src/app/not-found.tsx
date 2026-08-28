import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold mb-2">404</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <div className="flex gap-4">
        <Button>
          <Link href="/" className="text-current no-underline">
            Go home
          </Link>
        </Button>
        <Button variant="outline">
          <Link href="/products" className="text-current no-underline">
            Browse products
          </Link>
        </Button>
      </div>
    </div>
  );
}