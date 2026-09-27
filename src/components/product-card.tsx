import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { MediaFrame } from "@/components/media-frame";

type ProductCardProps = {
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  status: "DRAFT" | "ACTIVE" | "SOLD_OUT" | "ARCHIVED";
  media: { type: "IMAGE" | "VIDEO"; url: string; posterUrl?: string | null }[];
};

export function ProductCard({ slug, name, price, oldPrice, status, media }: ProductCardProps) {
  const primary = media[0];
  const isSoldOut = status === "SOLD_OUT";

  return (
    <Link href={`/proizvod/${slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-accent-soft)]">
        {primary ? (
          <MediaFrame
            type={primary.type}
            url={primary.url}
            posterUrl={primary.posterUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
        {isSoldOut ? (
          <span className="absolute left-3 top-3 bg-[var(--color-ink)] px-3 py-1 label-caps text-[var(--color-cream)]">
            Rasprodato
          </span>
        ) : oldPrice ? (
          <span className="absolute left-3 top-3 bg-[var(--color-terracotta)] px-3 py-1 label-caps text-white">
            Sniženo
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h3 className="font-serif-display text-[0.95rem] text-[var(--color-ink)]">{name}</h3>
      </div>
      <div className="mt-1 flex items-baseline gap-2 text-sm text-[var(--color-ink-soft)]">
        <span className={oldPrice ? "text-[var(--color-terracotta)]" : ""}>
          {formatPrice(price)}
        </span>
        {oldPrice ? (
          <span className="text-xs line-through text-[var(--color-taupe)]">
            {formatPrice(oldPrice)}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
