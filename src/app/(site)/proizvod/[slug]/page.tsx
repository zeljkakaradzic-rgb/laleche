import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { MediaFrame } from "@/components/media-frame";

export const dynamic = "force-dynamic";
import { ProductCard } from "@/components/product-card";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { formatPrice } from "@/lib/format";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      media: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { size: "asc" } },
      category: true,
      recommendsTo: {
        include: {
          recommendedProduct: {
            include: { media: { orderBy: { sortOrder: "asc" }, take: 1 } },
          },
        },
      },
    },
  });

  if (!product || product.status === "DRAFT" || product.status === "ARCHIVED") {
    notFound();
  }

  const similar = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      status: "ACTIVE",
      id: { not: product.id },
    },
    take: 4,
    include: { media: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  const soldOut = product.status === "SOLD_OUT";
  const primaryImage = product.media[0]?.url ?? "/placeholders/look.svg";

  return (
    <div className="container-page py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="grid gap-3">
          {product.media.length > 0 ? (
            product.media.map((m) => (
              <div key={m.id} className="aspect-[4/5] overflow-hidden bg-[var(--color-accent-soft)]">
                <MediaFrame
                  type={m.type}
                  url={m.url}
                  posterUrl={m.posterUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="aspect-[4/5] bg-[var(--color-accent-soft)]" />
          )}
        </div>

        <div className="md:sticky md:top-24 md:self-start">
          <p className="label-caps text-[var(--color-taupe)]">{product.category.name}</p>
          <h1 className="mt-2 font-serif-display text-3xl">{product.name}</h1>

          <div className="mt-3 flex items-baseline gap-3">
            <span className={product.oldPrice ? "text-[var(--color-terracotta)]" : ""}>
              {formatPrice(product.price)}
            </span>
            {product.oldPrice ? (
              <span className="text-sm line-through text-[var(--color-taupe)]">
                {formatPrice(product.oldPrice)}
              </span>
            ) : null}
          </div>

          {product.description ? (
            <p className="mt-6 text-[var(--color-ink-soft)]">{product.description}</p>
          ) : null}

          {product.material ? (
            <p className="mt-3 label-caps text-[var(--color-taupe)]">Materijal: {product.material}</p>
          ) : null}

          <div className="mt-8">
            <ProductPurchasePanel
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              image={primaryImage}
              variants={product.variants}
              soldOut={soldOut}
            />
          </div>
        </div>
      </div>

      {product.recommendsTo.length > 0 ? (
        <section className="mt-20">
          <p className="label-caps text-[var(--color-taupe)]">Laleche kombinacija</p>
          <h2 className="mt-2 font-serif-display text-2xl">Kompletiraj izgled</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {product.recommendsTo.map(({ recommendedProduct: rp }) => (
              <ProductCard
                key={rp.id}
                slug={rp.slug}
                name={rp.name}
                price={rp.price}
                oldPrice={rp.oldPrice}
                status={rp.status}
                media={rp.media}
              />
            ))}
          </div>
        </section>
      ) : null}

      {similar.length > 0 ? (
        <section className="mt-20">
          <h2 className="font-serif-display text-2xl">Slični proizvodi</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {similar.map((p) => (
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
        </section>
      ) : null}
    </div>
  );
}
