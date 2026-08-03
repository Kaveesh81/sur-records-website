import { site, nav } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line px-6 pt-20 pb-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-baseline gap-2.5">
              <span className="font-deva text-2xl leading-none text-saffron">
                {site.nameDevanagari}
              </span>
              <span className="display text-xl">{site.name}</span>
            </div>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone-muted">
              {site.tagline}.
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer">
            <p className="label-mono mb-4">Explore</p>
            <ul className="space-y-0.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-sm text-bone-muted transition-colors duration-[--dur-base] hover:text-bone"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#apply"
                  className="inline-flex min-h-11 items-center text-sm text-saffron transition-colors duration-[--dur-base] hover:text-[#ff8f3d]"
                >
                  Be part of the label
                </a>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="label-mono mb-4">Contact</p>
            <ul className="space-y-0.5">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex min-h-11 items-center text-sm text-bone-muted transition-colors duration-[--dur-base] hover:text-bone"
                >
                  {site.email}
                </a>
              </li>

              {site.phone && (
                <li>
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    className="inline-flex min-h-11 items-center text-sm text-bone-muted transition-colors duration-[--dur-base] hover:text-bone"
                  >
                    {site.phone}
                  </a>
                </li>
              )}
            </ul>

            <p className="label-mono mb-4 mt-8">Follow</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {site.socials.map((s) =>
                s.href === "#" ? (
                  // Placeholder link — rendered inert rather than shipping a dead href.
                  <li
                    key={s.label}
                    className="inline-flex min-h-11 items-center text-sm text-bone-faint"
                    title="Link coming soon"
                  >
                    {s.label}
                  </li>
                ) : (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center text-sm text-bone-muted transition-colors duration-[--dur-base] hover:text-bone"
                    >
                      {s.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-bone-faint">
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="text-xs text-bone-faint">Made for the next generation of Indian music.</p>
        </div>
      </div>

      {/* Oversized wordmark bleeding off the bottom edge. */}
      <p
        aria-hidden="true"
        className="pointer-events-none mt-10 -mb-[0.22em] select-none text-center font-deva text-[24vw] leading-[0.8] text-bone/[0.035]"
      >
        {site.nameDevanagari}
      </p>
    </footer>
  );
}
