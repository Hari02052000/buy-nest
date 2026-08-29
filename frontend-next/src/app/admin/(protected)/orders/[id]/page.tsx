import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerApi } from "@/lib/api/client";
import { OrderDetailClient } from "./_components/order-detail-client";
import type { AdminOrder } from "@/lib/api/types";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token_admin")?.value;
  if (!token) notFound();

  let order: AdminOrder;
  try {
    const serverApi = createServerApi(`access_token_admin=${token}`);
    order = await serverApi.get<AdminOrder>(`order/admin/${id}`);
  } catch {
    notFound();
  }

  return <OrderDetailClient order={order} />;
}
