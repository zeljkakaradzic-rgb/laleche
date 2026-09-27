import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorija?: string }>;
}) {
  const { kategorija } = await searchParams;

  const categories = await db.category.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });

  const activeCategory = categories.find((c) => c.slug === kategorija);

  const products = await db.product.findMany({
    where: {
      status: { in: ["ACTIVE", "SOLD_OUT"] },
      category: { isVisible: true },
      ...(activeCategory ? { categoryId: activeCategory.id } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { media: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  return (
    <div className="container-page py-12">
      <h1 className="font-serif-display text-3xl">Prodavnica</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/prodavnica"
          className={`label-caps border px-4 py-2 ${
            !activeCategory
              ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-cream)]"
              : "border-[var(--color-line)] text-[var(--color-ink-soft)]"
          }`}
        >
          Sve
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/prodavnica?kategorija=${cat.slug}`}
            className={`label-caps border px-4 py-2 ${
              activeCategory?.slug === cat.slug
                ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-cream)]"
                : "border-[var(--color-line)] text-[var(--color-ink-soft)]"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-[var(--color-ink-soft)]">
          Trenutno nema proizvoda u ovoj kategoriji. Uskoro stiže nova kolekcija.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              name={p.name}
              price={p.price}
              oldPrice={p.oldPrice}
              status={p.status}
              media={p.media}
            />
          ))}
        </div>
      )}
    </div>
  );
}
