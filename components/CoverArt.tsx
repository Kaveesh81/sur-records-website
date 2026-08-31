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

  // `hue` arrives as a 0–360 brand-differentiator seed from content.ts, but
  // the site is strictly black-and-gold now — so it is remapped into a
  // narrow amber-gold band (deterministic per seed) rather than used as a
  // literal hue. Every cover reads as one gilded catalogue, not a rainbow.
  const seed = ((hue % 360) + 360) % 360;
  const goldHue = 36 + (seed % 5) * 4; // 36–52°: amber through warm gold
  const sat = 58 + (seed % 3) * 7; // 58–72%
  const partnerHue = goldHue - 10;

  return (
    <div
      aria-hidden="true"
      className={`art-noise relative h-full w-full overflow-hidden ${className}`}
      style={{
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 30% 15%, hsl(${goldHue} ${sat}% 52% / 0.55), transparent 62%),
          radial-gradient(ellipse 70% 70% at 78% 82%, hsl(${partnerHue} ${sat - 12}% 28% / 0.55), transparent 60%),
          linear-gradient(155deg, hsl(${goldHue} 32% 8%), #0a0908)
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
