import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await db.category.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
    select: { name: true, slug: true },
  });

  return (
    <>
      <SiteHeader categories={categories} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
