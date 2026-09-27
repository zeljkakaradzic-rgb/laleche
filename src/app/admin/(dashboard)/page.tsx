import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [todaysOrders, lowStock, draftProducts, categories] = await Promise.all([
    db.order.findMany({ where: { createdAt: { gte: startOfDay } } }),
    db.productVariant.findMany({
      where: { stock: { gt: 0, lte: 2 } },
      include: { product: true },
      take: 6,
    }),
    db.product.count({ where: { status: "DRAFT" } }),
    db.category.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: true } } } }),
  ]);

  const todaysRevenue = todaysOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <h1 className="font-serif-display text-3xl">Pregled</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
          <p className="label-caps text-[var(--color-taupe)]">Porudžbine danas</p>
          <p className="mt-2 font-serif-display text-3xl">{todaysOrders.length}</p>
        </div>
        <div className="border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
          <p className="label-caps text-[var(--color-taupe)]">Prodaja danas</p>
          <p className="mt-2 font-serif-display text-3xl">{formatPrice(todaysRevenue)}</p>
        </div>
        <div className="border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
          <p className="label-caps text-[var(--color-taupe)]">Proizvodi u pripremi</p>
          <p className="mt-2 font-serif-display text-3xl">{draftProducts}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-serif-display text-xl">Kategorije</h2>
          <div className="mt-4 divide-y divide-[var(--color-line)] border border-[var(--color-line)] bg-[var(--color-surface)]">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between px-4 py-3">
                <span>{cat.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[var(--color-ink-soft)]">
                    {cat._count.products} proizvoda
                  </span>
                  <span
                    className={`label-caps px-2 py-1 ${
                      cat.isVisible
                        ? "bg-[var(--color-accent-soft)] text-[var(--color-ink)]"
                        : "bg-[var(--color-line)] text-[var(--color-taupe)]"
                    }`}
                  >
                    {cat.isVisible ? "ON" : "OFF"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/kategorije" className="label-caps mt-3 inline-block text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
            Upravljaj kategorijama →
          </Link>
        </div>

        <div>
          <h2 className="font-serif-display text-xl">Zalihe pri kraju</h2>
          <div className="mt-4 divide-y divide-[var(--color-line)] border border-[var(--color-line)] bg-[var(--color-surface)]">
            {lowStock.length === 0 ? (
              <p className="px-4 py-4 text-sm text-[var(--color-ink-soft)]">
                Trenutno nema proizvoda sa niskim zalihama.
              </p>
            ) : (
              lowStock.map((v) => (
                <div key={v.id} className="flex items-center justify-between px-4 py-3">
                  <span>
                    {v.product.name} — {v.size}, {v.color}
                  </span>
                  <span className="label-caps text-[var(--color-terracotta)]">
                    Još {v.stock}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
