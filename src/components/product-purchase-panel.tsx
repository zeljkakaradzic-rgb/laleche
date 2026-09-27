"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

type Variant = { id: string; size: string; color: string; stock: number };

type Props = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  variants: Variant[];
  soldOut: boolean;
};

export function ProductPurchasePanel({
  productId,
  slug,
  name,
  price,
  image,
  variants,
  soldOut,
}: Props) {
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.find((v) => v.stock > 0)?.id ?? null,
  );
  const [justAdded, setJustAdded] = useState(false);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId) ?? null,
    [variants, selectedVariantId],
  );

  function handleAddToBag() {
    if (!selectedVariant || selectedVariant.stock < 1) return;
    addItem(
      {
        variantId: selectedVariant.id,
        productId,
        slug,
        name,
        size: selectedVariant.size,
        color: selectedVariant.color,
        price,
        image,
        maxStock: selectedVariant.stock,
      },
      1,
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div>
      <p className="label-caps text-[var(--color-taupe)]">Veličina i boja</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {variants.map((v) => {
          const isOut = v.stock < 1;
          const isSelected = v.id === selectedVariantId;
          return (
            <button
              key={v.id}
              type="button"
              disabled={isOut}
              onClick={() => setSelectedVariantId(v.id)}
              className={`border px-4 py-2 text-sm transition-colors ${
                isOut
                  ? "cursor-not-allowed border-[var(--color-line)] text-[var(--color-taupe)] line-through"
                  : isSelected
                    ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-cream)]"
                    : "border-[var(--color-line)] hover:border-[var(--color-ink)]"
              }`}
            >
              {v.size} — {v.color}
            </button>
          );
        })}
      </div>

      {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 2 ? (
        <p className="mt-3 text-xs text-[var(--color-terracotta)]">
          Još samo {selectedVariant.stock} {selectedVariant.stock === 1 ? "komad" : "komada"}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleAddToBag}
        disabled={soldOut || !selectedVariant || selectedVariant.stock < 1}
        className="btn-primary mt-6 w-full"
      >
        {soldOut
          ? "Rasprodato"
          : justAdded
            ? "Dodato u torbu ✓"
            : `Dodaj u torbu — ${formatPrice(price)}`}
      </button>
    </div>
  );
}
