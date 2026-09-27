import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--color-line)] bg-[var(--color-surface)]">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-serif-display text-xl tracking-[0.12em]">LALECHE</p>
          <p className="mt-3 max-w-xs text-sm text-[var(--color-ink-soft)]">
            Ne treba ti više odeće. Treba ti bolji izbor. Odabrano za slobodne žene.
          </p>
        </div>

        <div>
          <p className="label-caps text-[var(--color-taupe)]">Navigacija</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-soft)]">
            <li>
              <Link href="/prodavnica" className="hover:text-[var(--color-ink)]">
                Prodavnica
              </Link>
            </li>
            <li>
              <Link href="/prica" className="hover:text-[var(--color-ink)]">
                Naša priča
              </Link>
            </li>
            <li>
              <Link href="/kontakt" className="hover:text-[var(--color-ink)]">
                Kontakt
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="label-caps text-[var(--color-taupe)]">Kontakt</p>
          <p className="mt-3 text-sm text-[var(--color-ink-soft)]">
            Porudžbine se potvrđuju telefonom.
            <br />
            Plaćanje pouzećem prilikom preuzimanja.
          </p>
        </div>
      </div>

      <div className="container-page flex flex-col gap-2 border-t border-[var(--color-line)] py-6 text-xs text-[var(--color-taupe)] md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Laleche. Sva prava zadržana.</p>
        <Link href="/admin" className="hover:text-[var(--color-ink-soft)]">
          Admin
        </Link>
      </div>
    </footer>
  );
}
