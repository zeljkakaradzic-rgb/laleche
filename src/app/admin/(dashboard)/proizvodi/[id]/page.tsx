import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { MediaFrame } from "@/components/media-frame";

export const dynamic = "force-dynamic";
import {
  updateProduct,
  deleteProduct,
  addVariant,
  updateVariantStock,
  deleteVariant,
  deleteMedia,
  saveRecommendations,
} from "../actions";
import { uploadMedia } from "../media-actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories, otherProducts] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: {
        media: { orderBy: { sortOrder: "asc" } },
        variants: { orderBy: { size: "asc" } },
        recommendsTo: { select: { recommendedProductId: true } },
      },
    }),
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
    db.product.findMany({
      where: { id: { not: id } },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  const recommendedIds = new Set(product.recommendsTo.map((r) => r.recommendedProductId));

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-serif-display text-3xl">{product.name}</h1>
        <p className="label-caps text-[var(--color-taupe)]">/{product.slug}</p>
      </div>

      <section className="mt-8">
        <h2 className="label-caps text-[var(--color-taupe)]">Osnovni podaci</h2>
        <form
          key={product.updatedAt.toISOString()}
          action={updateProduct.bind(null, product.id)}
          className="mt-4 space-y-4"
        >
          <div>
            <label className="label-caps text-[var(--color-taupe)]" htmlFor="name">
              Naziv
            </label>
            <input
              id="name"
              name="name"
              defaultValue={product.name}
              required
              className="input-field mt-2"
            />
          </div>

          <div>
            <label className="label-caps text-[var(--color-taupe)]" htmlFor="categoryId">
              Kategorija
            </label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={product.categoryId}
              required
              className="input-field mt-2"
            >
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
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="1"
                defaultValue={product.price}
                required
                className="input-field mt-2"
              />
            </div>
            <div>
              <label className="label-caps text-[var(--color-taupe)]" htmlFor="oldPrice">
                Stara cena (opciono)
              </label>
              <input
                id="oldPrice"
                name="oldPrice"
                type="number"
                min="0"
                step="1"
                defaultValue={product.oldPrice ?? ""}
                className="input-field mt-2"
              />
            </div>
          </div>

          <div>
            <label className="label-caps text-[var(--color-taupe)]" htmlFor="material">
              Materijal
            </label>
            <input
              id="material"
              name="material"
              defaultValue={product.material ?? ""}
              className="input-field mt-2"
            />
          </div>

          <div>
            <label className="label-caps text-[var(--color-taupe)]" htmlFor="description">
              Opis
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={product.description ?? ""}
              className="input-field mt-2"
            />
          </div>

          <div>
            <label className="label-caps text-[var(--color-taupe)]" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={product.status}
              className="input-field mt-2"
            >
              <option value="DRAFT">Priprema (nije vidljivo)</option>
              <option value="ACTIVE">Aktivan</option>
              <option value="SOLD_OUT">Rasprodato</option>
              <option value="ARCHIVED">Arhiviran</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-[var(--color-ink-soft)]">
            <input type="checkbox" name="featured" defaultChecked={product.featured} />
            Prikaži u &quot;Laleche Edit&quot; na početnoj stranici
          </label>

          <button type="submit" className="btn-primary">
            Sačuvaj izmene
          </button>
        </form>
      </section>

      <section className="mt-12">
        <h2 className="label-caps text-[var(--color-taupe)]">Slike i video</h2>

        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {product.media.map((m) => (
            <div key={m.id} className="relative aspect-[4/5] overflow-hidden bg-[var(--color-accent-soft)]">
              <MediaFrame
                type={m.type}
                url={m.url}
                posterUrl={m.posterUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              <form action={deleteMedia.bind(null, product.id, m.id)} className="absolute right-1 top-1">
                <button
                  type="submit"
                  className="bg-[var(--color-ink)] px-2 py-1 text-xs text-[var(--color-cream)]"
                >
                  Obriši
                </button>
              </form>
            </div>
          ))}
        </div>

        <form
          action={uploadMedia.bind(null, product.id)}
          className="mt-4 flex flex-wrap items-center gap-3"
        >
          <input
            type="file"
            name="files"
            multiple
            accept="image/*,video/*"
            className="text-sm"
          />
          <button type="submit" className="btn-secondary">
            Dodaj fotografije/video
          </button>
        </form>
        <p className="mt-2 text-xs text-[var(--color-taupe)]">
          Preporuka: kratki, nemi video (MP4/WebM) ili fotografija u portret formatu.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="label-caps text-[var(--color-taupe)]">Veličine, boje i zalihe</h2>

        <div className="mt-4 divide-y divide-[var(--color-line)] border border-[var(--color-line)] bg-[var(--color-surface)]">
          {product.variants.map((v) => (
            <div key={v.id} className="flex items-center gap-3 px-4 py-3">
              <span className="w-16">{v.size}</span>
              <span className="flex-1">{v.color}</span>
              <form action={updateVariantStock.bind(null, v.id)} className="flex items-center gap-2">
                <input
                  key={v.stock}
                  type="number"
                  name="stock"
                  min="0"
                  defaultValue={v.stock}
                  className="input-field w-20"
                />
                <button type="submit" className="label-caps text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
                  Sačuvaj
                </button>
              </form>
              <form action={deleteVariant.bind(null, product.id, v.id)}>
                <button type="submit" className="label-caps text-[var(--color-taupe)] hover:text-[var(--color-terracotta)]">
                  Obriši
                </button>
              </form>
            </div>
          ))}
        </div>

        <form action={addVariant.bind(null, product.id)} className="mt-4 flex flex-wrap gap-3">
          <input name="size" placeholder="Veličina (npr. M)" required className="input-field w-32" />
          <input name="color" placeholder="Boja (npr. Crna)" required className="input-field w-40" />
          <input
            name="stock"
            type="number"
            min="0"
            placeholder="Zaliha"
            required
            className="input-field w-24"
          />
          <button type="submit" className="btn-secondary">
            Dodaj varijantu
          </button>
        </form>
      </section>

      <section className="mt-12">
        <h2 className="label-caps text-[var(--color-taupe)]">Laleche kombinacija (Complete the Look)</h2>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
          Izaberi proizvode koji se prikazuju kao preporuka uz ovaj komad.
        </p>
        <form action={saveRecommendations.bind(null, product.id)} className="mt-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {otherProducts.map((p) => (
              <label key={p.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="recommend"
                  value={p.id}
                  defaultChecked={recommendedIds.has(p.id)}
                />
                {p.name}
              </label>
            ))}
          </div>
          <button type="submit" className="btn-secondary mt-4">
            Sačuvaj kombinacije
          </button>
        </form>
      </section>

      <section className="mt-12 border-t border-[var(--color-line)] pt-8">
        <form action={deleteProduct.bind(null, product.id)}>
          <button
            type="submit"
            className="label-caps text-[var(--color-terracotta)] hover:underline"
          >
            Obriši proizvod
          </button>
        </form>
      </section>
    </div>
  );
}
