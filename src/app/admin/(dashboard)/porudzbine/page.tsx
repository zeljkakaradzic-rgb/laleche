```tsx
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  NEW: "Nova",
  CONFIRMED: "Potvrđena",
  PACKED: "Pakovana",
  SHIPPED: "Poslata",
  DELIVERED: "Isporučena",
  RETURNED: "Vraćena",
  CANCELLED: "Otkazana",
};

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="font-serif-display text-3xl">Porudžbine</h1>

      <div className="mt-6 divide-y divide-[var(--color-line)] border border-[var(--color-line)] bg-[var(--color-surface)]">
        {orders.length === 0 ? (
          <p className="px-4 py-6 text-[var(--color-ink-soft)]">
            Još nema porudžbina.
          </p>
        ) : (
          orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/porudzbine/${order.id}`}
              className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 hover:bg-[var(--color-accent-soft)]"
            >
              <div className="min-w-0">
                <p className="font-serif-display">{order.customerName}</p>

                <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
                  {order.items.length} stavki · {order.city}
                </p>

                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    <span className="text-[var(--color-taupe)]">Email: </span>
                    {order.email || "Nije unet"}
                  </p>

                  <p>
                    <span className="text-[var(--color-taupe)]">
                      Adresa:{" "}
                    </span>
                    {order.address}, {order.postalCode || "Bez poštanskog broja"}{" "}
                    {order.city}
                  </p>
                </div>
              </div>

              <span className="font-medium">
                {formatPrice(order.total)}
              </span>

              <span className="label-caps text-[var(--color-taupe)]">
                {STATUS_LABEL[order.status] ?? order.status}
              </span>

              <span className="text-sm text-[var(--color-taupe)]">
                {order.createdAt.toLocaleDateString("sr-RS")}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
```
