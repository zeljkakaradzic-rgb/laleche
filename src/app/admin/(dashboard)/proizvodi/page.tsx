import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Priprema",
  ACTIVE: "Aktivan",
  SOLD_OUT: "Rasprodato",
  ARCHIVED: "Arhiviran",
};

const TABS = ["SVI", "DRAFT", "ACTIVE", "SOLD_OUT", "ARCHIVED"] as const;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeTab = TABS.includes(status as (typeof TABS)[number]) ? status! : "SVI";

  const products = await db.product.findMany({
    where: activeTab === "SVI" ? {} : { status: activeTab as never },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      media: { orderBy: { sortOrder: "asc" }, take: 1 },
      variants: true,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif-display text-3xl">Proizvodi</h1>
        <Link href="/admin/proizvodi/novi" className="btn-primary">
          + Novi proizvod
        </Link>
      </div>

      <div className="mt-6 flex gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab}
            href={tab === "SVI" ? "/admin/proizvodi" : `/admin/proizvodi?status=${tab}`}
            className={`label-caps px-3 py-2 ${
              activeTab === tab
                ? "bg-[var(--color-ink)] text-[var(--color-cream)]"
                : "border border-[var(--color-line)] text-[var(--color-ink-soft)]"
            }`}
          >
            {tab === "SVI" ? "Svi" : STATUS_LABEL[tab]}
          </Link>
        ))}
      </div>

      <div className="mt-6 divide-y divide-[var(--color-line)] border border-[var(--color-line)] bg-[var(--color-surface)]">
        {products.length === 0 ? (
          <p className="px-4 py-6 text-[var(--color-ink-soft)]">Nema proizvoda u ovoj listi.</p>
        ) : (
          products.map((p) => {
            const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
            return (
              <Link
                key={p.id}
                href={`/admin/proizvodi/${p.id}`}
                className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--color-accent-soft)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.media[0]?.url ?? "/placeholders/look.svg"}
                  alt={p.name}
                  className="h-16 w-14 flex-shrink-0 object-cover"
                />
                <div className="flex-1">
                  <p className="font-serif-display">{p.name}</p>
                  <p className="text-sm text-[var(--color-ink-soft)]">{p.category.name}</p>
                </div>
                <span className="hidden text-sm text-[var(--color-ink-soft)] sm:block">
                  Zalihe: {totalStock}
                </span>
                <span className="w-24 text-right">{formatPrice(p.price)}</span>
                <span className="label-caps w-24 text-right text-[var(--color-taupe)]">
                  {STATUS_LABEL[p.status]}
                </span>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
