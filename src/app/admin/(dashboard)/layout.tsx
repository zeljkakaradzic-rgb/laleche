import Link from "next/link";
import { logout } from "./actions";

const NAV = [
  { href: "/admin", label: "Pregled" },
  { href: "/admin/proizvodi", label: "Proizvodi" },
  { href: "/admin/kategorije", label: "Kategorije" },
  { href: "/admin/porudzbine", label: "Porudžbine" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <div className="flex flex-col md:flex-row">
        <aside className="border-b border-[var(--color-line)] bg-[var(--color-surface)] md:min-h-screen md:w-56 md:border-b-0 md:border-r">
          <div className="p-6">
            <p className="font-serif-display text-lg tracking-[0.1em]">LALECHE</p>
            <p className="label-caps mt-1 text-[var(--color-taupe)]">Admin</p>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-4 pb-4 md:flex-col md:gap-1 md:px-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="label-caps whitespace-nowrap rounded px-3 py-2 text-[var(--color-ink-soft)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-ink)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden px-4 pb-6 md:block">
            <form action={logout}>
              <button type="submit" className="label-caps text-[var(--color-taupe)] hover:text-[var(--color-terracotta)]">
                Odjava
              </button>
            </form>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
