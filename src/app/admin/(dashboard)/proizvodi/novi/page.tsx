import { db } from "@/lib/db";
import { createProduct } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="max-w-xl">
      <h1 className="font-serif-display text-3xl">Novi proizvod</h1>

      <form action={createProduct} className="mt-8 space-y-4">
        <div>
          <label className="label-caps text-[var(--color-taupe)]" htmlFor="name">
            Naziv
          </label>
          <input id="name" name="name" required className="input-field mt-2" />
        </div>

        <div>
          <label className="label-caps text-[var(--color-taupe)]" htmlFor="categoryId">
            Kategorija
          </label>
          <select id="categoryId" name="categoryId" required className="input-field mt-2">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-caps text-[var(--color-taupe)]" htmlFor="price">
              Cena (RSD)
            </label>
            <input id="price" name="price" type="number" min="0" step="1" required className="input-field mt-2" />
          </div>
          <div>
            <label className="label-caps text-[var(--color-taupe)]" htmlFor="oldPrice">
              Stara cena (opciono)
            </label>
            <input id="oldPrice" name="oldPrice" type="number" min="0" step="1" className="input-field mt-2" />
          </div>
        </div>

        <div>
          <label className="label-caps text-[var(--color-taupe)]" htmlFor="material">
            Materijal
          </label>
          <input id="material" name="material" className="input-field mt-2" />
        </div>

        <div>
          <label className="label-caps text-[var(--color-taupe)]" htmlFor="description">
            Opis
          </label>
          <textarea id="description" name="description" rows={4} className="input-field mt-2" />
        </div>

        <div>
          <label className="label-caps text-[var(--color-taupe)]" htmlFor="status">
            Status
          </label>
          <select id="status" name="status" defaultValue="DRAFT" className="input-field mt-2">
            <option value="DRAFT">Priprema (nije vidljivo)</option>
            <option value="ACTIVE">Aktivan</option>
            <option value="SOLD_OUT">Rasprodato</option>
            <option value="ARCHIVED">Arhiviran</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-[var(--color-ink-soft)]">
          <input type="checkbox" name="featured" />
          Prikaži u &quot;Laleche Edit&quot; na početnoj stranici
        </label>

        <button type="submit" className="btn-primary">
          Sačuvaj i dodaj varijante/slike
        </button>
      </form>
    </div>
  );
}
