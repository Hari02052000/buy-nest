import { cookies } from "next/headers";
import { createServerApi } from "@/lib/api/client";
import { OrderListClient } from "./_components/order-list-client";
import type { AdminOrder } from "@/lib/api/types";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token_admin")?.value;
  let initialData: AdminOrder[] | undefined;

  try {
    if (token) {
      const serverApi = createServerApi(`access_token_admin=${token}`);
      initialData = await serverApi.get<AdminOrder[]>("order/admin/all", {
        limit: 20,
        skip: 0,
      });
    }
  } catch {
    initialData = undefined;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage and update customer orders
        </p>
      </div>
      <OrderListClient initialData={initialData} />
    </div>
  );
}
