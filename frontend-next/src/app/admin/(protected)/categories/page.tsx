import { cookies } from "next/headers";
import { createServerApi } from "@/lib/api/client";
import { CategoryListClient } from "./_components/category-list-client";
import type { AdminCategory } from "@/lib/api/types";

export default async function CategoriesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token_admin")?.value;
  let initialData: AdminCategory[] | undefined;

  try {
    if (token) {
      const serverApi = createServerApi(`access_token_admin=${token}`);
      initialData = await serverApi.get<AdminCategory[]>("category", {
        limit: 50,
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
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage product categories
          </p>
        </div>
        <a
          href="/admin/categories/new"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Add Category
        </a>
      </div>
      <CategoryListClient initialData={initialData} />
    </div>
  );
}
