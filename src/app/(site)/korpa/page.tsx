"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, removeItem, setQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-serif-display text-2xl">Torba je prazna</h1>
        <p className="mt-3 text-[var(--color-ink-soft)]">
          Pogledaj prodavnicu i pronađi svoj sledeći komad.
        </p>
        <Link href="/prodavnica" className="btn-primary mt-8 inline-block">
          Idi u prodavnicu
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <h1 className="font-serif-display text-3xl">Torba</h1>

      <div className="mt-8 divide-y divide-[var(--color-line)]">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-4 py-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.name}
              className="h-28 w-24 flex-shrink-0 object-cover"
            />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <Link href={`/proizvod/${item.slug}`} className="font-serif-display text-lg hover:underline">
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
                  {item.size} — {item.color}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="h-8 w-8 border border-[var(--color-line)]"
                    onClick={() => setQuantity(item.variantId, item.quantity - 1)}
                    aria-label="Umanji količinu"
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    className="h-8 w-8 border border-[var(--color-line)]"
                    onClick={() => setQuantity(item.variantId, item.quantity + 1)}
                    disabled={item.quantity >= item.maxStock}
                    aria-label="Povećaj količinu"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <span>{formatPrice(item.price * item.quantity)}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    className="label-caps text-[var(--color-taupe)] hover:text-[var(--color-terracotta)]"
                  >
                    Ukloni
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-[var(--color-line)] pt-6">
        <span className="label-caps text-[var(--color-taupe)]">Ukupno</span>
        <span className="font-serif-display text-xl">{formatPrice(totalPrice)}</span>
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:justify-end">
        <Link href="/prodavnica" className="btn-secondary text-center">
          Nastavi kupovinu
        </Link>
        <Link href="/porudzbina" className="btn-primary text-center">
          Nastavi na plaćanje
        </Link>
      </div>
    </div>
  );
}
