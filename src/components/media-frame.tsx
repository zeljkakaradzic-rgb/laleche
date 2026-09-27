type MediaFrameProps = {
  type: "IMAGE" | "VIDEO";
  url: string;
  posterUrl?: string | null;
  alt: string;
  className?: string;
};

export function MediaFrame({ type, url, posterUrl, alt, className }: MediaFrameProps) {
  if (type === "VIDEO") {
    return (
      <video
        className={className}
        poster={posterUrl ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-label={alt}
      >
        <source src={url} />
      </video>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={alt} className={className} loading="lazy" />;
}
