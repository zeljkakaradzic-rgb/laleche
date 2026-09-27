"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

const STATUSES = ["NEW", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "RETURNED", "CANCELLED"] as const;

export async function updateOrderStatus(orderId: string, formData: FormData) {
  const status = String(formData.get("status") ?? "");
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) return;

  await db.order.update({ where: { id: orderId }, data: { status: status as never } });
  revalidatePath("/admin/porudzbine");
  revalidatePath(`/admin/porudzbine/${orderId}`);
}
