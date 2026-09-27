"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { createOrder } from "./actions";

export default function CheckoutPage() {
  const { items, totalPrice, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ orderId: string; total: number } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const result = await createOrder({
      customerName: String(form.get("customerName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      address: String(form.get("address") ?? ""),
      city: String(form.get("city") ?? ""),
      note: String(form.get("note") ?? ""),
      items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setConfirmed({ orderId: result.orderId, total: result.total });
    clear();
  }

  if (confirmed) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-serif-display text-3xl">Hvala na porudžbini!</h1>
        <p className="mt-4 text-[var(--color-ink-soft)]">
          Broj porudžbine: <span className="text-[var(--color-ink)]">{confirmed.orderId}</span>
        </p>
        <p className="mt-1 text-[var(--color-ink-soft)]">Ukupno: {formatPrice(confirmed.total)}</p>
        <p className="mt-6 max-w-md mx-auto text-[var(--color-ink-soft)]">
          Uskoro ćemo te kontaktirati telefonom radi potvrde porudžbine. Plaćanje se vrši pouzećem
          prilikom preuzimanja.
        </p>
        <Link href="/prodavnica" className="btn-primary mt-8 inline-block">
          Nastavi kupovinu
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-serif-display text-2xl">Torba je prazna</h1>
        <Link href="/prodavnica" className="btn-primary mt-8 inline-block">
          Idi u prodavnicu
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <h1 className="font-serif-display text-3xl">Podaci za dostavu</h1>

      <div className="mt-10 grid gap-12 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-caps text-[var(--color-taupe)]" htmlFor="customerName">
              Ime i prezime
            </label>
            <input id="customerName" name="customerName" required className="input-field mt-2" />
          </div>
          <div>
            <label className="label-caps text-[var(--color-taupe)]" htmlFor="phone">
              Telefon
            </label>
            <input id="phone" name="phone" type="tel" required className="input-field mt-2" />
          </div>
          <div>
            <label className="label-caps text-[var(--color-taupe)]" htmlFor="address">
              Adresa
            </label>
            <input id="address" name="address" required className="input-field mt-2" />
          </div>
          <div>
            <label className="label-caps text-[var(--color-taupe)]" htmlFor="city">
              Grad
            </label>
            <input id="city" name="city" required className="input-field mt-2" />
          </div>
          <div>
            <label className="label-caps text-[var(--color-taupe)]" htmlFor="note">
              Napomena (opciono)
            </label>
            <textarea id="note" name="note" rows={3} className="input-field mt-2" />
          </div>

          {error ? <p className="text-sm text-[var(--color-terracotta)]">{error}</p> : null}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Slanje porudžbine..." : `Potvrdi porudžbinu — ${formatPrice(totalPrice)}`}
          </button>
          <p className="text-xs text-[var(--color-taupe)]">
            Plaćanje pouzećem. Porudžbinu potvrđujemo telefonskim pozivom.
          </p>
        </form>

        <div>
          <p className="label-caps text-[var(--color-taupe)]">Tvoja torba</p>
          <div className="mt-4 divide-y divide-[var(--color-line)]">
            {items.map((item) => (
              <div key={item.variantId} className="flex justify-between py-3">
                <div>
                  <p>{item.name}</p>
                  <p className="text-sm text-[var(--color-ink-soft)]">
                    {item.size} — {item.color} × {item.quantity}
                  </p>
                </div>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-[var(--color-line)] pt-4">
            <span className="label-caps text-[var(--color-taupe)]">Ukupno</span>
            <span className="font-serif-display text-xl">{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
