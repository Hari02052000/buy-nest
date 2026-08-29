import { cookies } from "next/headers";
import { createServerApi } from "@/lib/api/client";
import { ProductListClient } from "./_components/product-list-client";
import type { AdminProduct } from "@/lib/api/types";

export default async function ProductsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token_admin")?.value;
  let initialData: AdminProduct[] | undefined;

  try {
    if (token) {
      const serverApi = createServerApi(`access_token_admin=${token}`);
      initialData = await serverApi.get<AdminProduct[]>("products", {
        isAdmin: true,
        limit: 20,
        skip: 0,
      });
    }
  } catch {
    initialData = undefined;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your product catalog
          </p>
        </div>
        <a
          href="/admin/products/new"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Add Product
        </a>
      </div>
      <ProductListClient initialData={initialData} />
    </div>
  );
}
