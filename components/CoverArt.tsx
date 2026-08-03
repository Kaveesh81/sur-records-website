/**
 * Procedurally generated cover artwork.
 *
 * The site ships with no image files, so placeholder covers are built from
 * layered CSS gradients plus a Devanagari glyph and an SVG noise overlay.
 * They read as deliberate design rather than a broken <img>.
 *
 * To use a real cover instead, pass `src` — it takes precedence.
 */
export default function CoverArt({
  hue,
  glyph,
  src,
  alt,
  className = "",
}: {
  hue: number;
  glyph: string;
  src?: string;
  alt?: string;
  className?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt ?? ""}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  // The second light pool is always pulled back to a brand anchor — saffron
  // for cool base hues, indigo for warm ones. A mechanical complement
  // (hue + 210) produced off-brand limes and teals that broke the set.
  const partner = hue < 180 ? 250 : 25;

  return (
    <div
      aria-hidden="true"
      className={`art-noise relative h-full w-full overflow-hidden ${className}`}
      style={{
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 30% 15%, hsl(${hue} 88% 56% / 0.8), transparent 62%),
          radial-gradient(ellipse 70% 70% at 78% 82%, hsl(${partner} 72% 46% / 0.6), transparent 60%),
          linear-gradient(155deg, hsl(${hue} 38% 11%), hsl(${partner} 45% 5%))
        `,
      }}
    >
      {/* Oversized glyph, cropped by the frame for an editorial crop. */}
      <span className="absolute -bottom-[14%] left-1/2 -translate-x-1/2 select-none font-deva text-[9rem] leading-none text-black/25 mix-blend-overlay">
        {glyph}
      </span>

      {/* Sheen — sells it as a printed sleeve rather than a flat gradient. */}
      <span className="absolute inset-0 bg-gradient-to-tr from-black/45 via-transparent to-white/[0.07]" />
    </div>
  );
}
