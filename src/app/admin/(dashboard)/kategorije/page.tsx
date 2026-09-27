import { db } from "@/lib/db";
import { toggleCategory, createCategory, moveCategory } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="font-serif-display text-3xl">Kategorije</h1>
      <p className="mt-2 max-w-xl text-sm text-[var(--color-ink-soft)]">
        Kada je kategorija <strong>OFF</strong>, ona se ne prikazuje u meniju ni na početnoj
        stranici, ali stranice proizvoda koje su već objavljene ostaju dostupne na svom linku.
      </p>

      <div className="mt-6 divide-y divide-[var(--color-line)] border border-[var(--color-line)] bg-[var(--color-surface)]">
        {categories.map((cat, i) => (
          <div key={cat.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
            <div>
              <p className="font-serif-display">{cat.name}</p>
              <p className="text-sm text-[var(--color-ink-soft)]">
                {cat._count.products} proizvoda · /{cat.slug}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <form action={moveCategory.bind(null, cat.id, "up")}>
                <button
                  type="submit"
                  disabled={i === 0}
                  className="h-8 w-8 border border-[var(--color-line)] disabled:opacity-30"
                  aria-label="Pomeri gore"
                >
                  ↑
                </button>
              </form>
              <form action={moveCategory.bind(null, cat.id, "down")}>
                <button
                  type="submit"
                  disabled={i === categories.length - 1}
                  className="h-8 w-8 border border-[var(--color-line)] disabled:opacity-30"
                  aria-label="Pomeri dole"
                >
                  ↓
                </button>
              </form>

              <form action={toggleCategory.bind(null, cat.id)}>
                <button
                  type="submit"
                  className={`label-caps min-w-[4.5rem] px-3 py-2 ${
                    cat.isVisible
                      ? "bg-[var(--color-ink)] text-[var(--color-cream)]"
                      : "border border-[var(--color-line)] text-[var(--color-taupe)]"
                  }`}
                >
                  {cat.isVisible ? "ON" : "OFF"}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <form action={createCategory} className="mt-8 flex max-w-md gap-3">
        <input
          name="name"
          placeholder="Naziv nove kategorije (npr. Suknje)"
          required
          className="input-field"
        />
        <button type="submit" className="btn-primary whitespace-nowrap">
          Dodaj
        </button>
      </form>
    </div>
  );
}
