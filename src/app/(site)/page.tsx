import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [newArrivals, edit, categories] = await Promise.all([
    db.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { media: { orderBy: { sortOrder: "asc" }, take: 1 } },
    }),
    db.product.findMany({
      where: { status: "ACTIVE", featured: true },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { media: { orderBy: { sortOrder: "asc" }, take: 1 } },
    }),
    db.category.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <div>
      <section
        className="relative flex min-h-[78vh] items-end overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #efe6d8 0%, #ded0ba 45%, #b99f82 100%)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-cream)] via-transparent to-transparent opacity-70" />
        <div className="relative z-10 container-page pb-16 text-[var(--color-ink)]">
          <p className="label-caps">Concept Laleche</p>
          <h1 className="mt-4 max-w-xl font-serif-display text-4xl leading-tight md:text-6xl">
            Carefully chosen.
            <br />
            Effortlessly worn.
          </h1>
          <div className="mt-8 flex gap-3">
            <Link href="/prodavnica" className="btn-primary">
              Pogledaj prodavnicu
            </Link>
            <Link href="/prica" className="btn-secondary">
              Naša priča
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif-display text-2xl">Novo u ponudi</h2>
          <Link href="/prodavnica" className="label-caps text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
            Sve →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {newArrivals.map((p) => (
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

      {edit.length > 0 ? (
        <section className="bg-[var(--color-surface)] py-16">
          <div className="container-page">
            <p className="label-caps text-[var(--color-taupe)]">Laleche Edit</p>
            <h2 className="mt-2 font-serif-display text-2xl">Naš izbor ove sezone</h2>
            <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
              {edit.map((p) => (
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
          </div>
        </section>
      ) : null}

      <section className="container-page py-16">
        <h2 className="font-serif-display text-2xl">Kategorije</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/prodavnica?kategorija=${cat.slug}`}
              className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[var(--color-accent-soft)]"
            >
              <span className="font-serif-display text-lg transition-transform group-hover:scale-105">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-ink)] py-20 text-[var(--color-cream)]">
        <div className="container-page max-w-2xl text-center">
          <p className="label-caps text-[var(--color-taupe)]">Zašto Laleche</p>
          <p className="mt-6 font-serif-display text-2xl leading-relaxed md:text-3xl">
            Ne treba ti više odeće. Treba ti bolji izbor. Mi biramo umesto tebe — komade koji dobro
            stoje, koji se lako kombinuju i koje ne obučeš samo jednom.
          </p>
          <Link href="/prica" className="mt-8 inline-block label-caps underline">
            Pročitaj našu priču
          </Link>
        </div>
      </section>
    </div>
  );
}
