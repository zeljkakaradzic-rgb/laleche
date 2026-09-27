import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";
import { updateOrderStatus } from "../actions";

const STATUS_OPTIONS = [
  { value: "NEW", label: "Nova" },
  { value: "CONFIRMED", label: "Potvrđena" },
  { value: "PACKED", label: "Pakovana" },
  { value: "SHIPPED", label: "Poslata" },
  { value: "DELIVERED", label: "Isporučena" },
  { value: "RETURNED", label: "Vraćena" },
  { value: "CANCELLED", label: "Otkazana" },
];

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: { items: { include: { product: true, variant: true } } },
  });

  if (!order) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif-display text-3xl">Porudžbina</h1>
      <p className="mt-1 text-[var(--color-taupe)]">{order.id}</p>

      <div className="mt-6 grid gap-1 text-[var(--color-ink-soft)]">
        <p>
          <span className="text-[var(--color-ink)]">{order.customerName}</span> · {order.phone}
        </p>
        <p>
          {order.address}, {order.city}
        </p>
        {order.note ? <p>Napomena: {order.note}</p> : null}
        <p>{order.createdAt.toLocaleString("sr-RS")}</p>
      </div>

      <div className="mt-8 divide-y divide-[var(--color-line)] border border-[var(--color-line)] bg-[var(--color-surface)]">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between px-4 py-3">
            <div>
              <p>{item.product.name}</p>
              <p className="text-sm text-[var(--color-ink-soft)]">
                {item.variant.size} — {item.variant.color} × {item.quantity}
              </p>
            </div>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between border-t border-[var(--color-line)] pt-4">
        <span className="label-caps text-[var(--color-taupe)]">Ukupno</span>
        <span className="font-serif-display text-xl">{formatPrice(order.total)}</span>
      </div>

      <form action={updateOrderStatus.bind(null, order.id)} className="mt-8 flex items-center gap-3">
        <label className="label-caps text-[var(--color-taupe)]" htmlFor="status">
          Status porudžbine
        </label>
        <select
          id="status"
          name="status"
          key={order.status}
          defaultValue={order.status}
          className="input-field w-auto"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary">
          Sačuvaj
        </button>
      </form>
    </div>
  );
}
