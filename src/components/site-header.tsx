"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

type NavCategory = { name: string; slug: string };

export function SiteHeader({ categories }: { categories: NavCategory[] }) {
  const { totalCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[var(--color-cream)]/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <button
          type="button"
          className="label-caps md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Meni"
        >
          {open ? "Zatvori" : "Meni"}
        </button>

        <Link
          href="/"
          className="font-serif-display text-xl tracking-[0.12em] md:text-2xl"
        >
          LALECHE
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/prodavnica?kategorija=${cat.slug}`}
              className="label-caps text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/prica"
            className="label-caps text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
          >
            Naša priča
          </Link>
          <Link
            href="/kontakt"
            className="label-caps text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
          >
            Kontakt
          </Link>
        </nav>

        <Link href="/korpa" className="label-caps">
          Torba{totalCount > 0 ? ` (${totalCount})` : ""}
        </Link>
      </div>

      {open ? (
        <nav className="flex flex-col border-t border-[var(--color-line)] px-5 py-4 md:hidden">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/prodavnica?kategorija=${cat.slug}`}
              className="label-caps py-2 text-[var(--color-ink-soft)]"
              onClick={() => setOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/prica" className="label-caps py-2 text-[var(--color-ink-soft)]" onClick={() => setOpen(false)}>
            Naša priča
          </Link>
          <Link href="/kontakt" className="label-caps py-2 text-[var(--color-ink-soft)]" onClick={() => setOpen(false)}>
            Kontakt
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
