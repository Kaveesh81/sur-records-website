/**
 * ============================================================================
 *  SUR RECORDS — CONTENT MAP
 * ============================================================================
 *  This is the ONLY file you need to edit to put real content on the site.
 *  Every headline, artist, release, video and stat on the site is read from
 *  here.
 *
 *  Anything marked  // PLACEHOLDER  is invented and should be replaced
 *  before you market the site publicly.
 * ============================================================================
 */

export const site = {
  name: "Sur Records",
  nameDevanagari: "सुर",
  tagline: "Creating the sound of the next generation",
  email: "admin@surrecords.com",
  // PLACEHOLDER — add your real number, or set to null to hide it from the footer.
  phone: null as string | null,
  // PLACEHOLDER — replace the '#' values with your real profile URLs.
  // Any entry left as '#' is rendered as non-clickable so the site never
  // ships a dead link.
  socials: [
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "Spotify", href: "#" },
    { label: "Apple Music", href: "#" },
  ],
} as const;

export const nav = [
  { label: "The Surilas", href: "/surilas" },
  { label: "The Sur Sound", href: "/sur-sound" },
  { label: "From the Studio", href: "/studio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Hero — brand-forward, centered. The name IS the content until real
 * branding assets exist.
 *
 * `logoSrc` overrides the generated devanagari + wordmark lockup with a real
 * logo file — same fallback pattern as CoverArt's `src` prop. Drop a file in
 * /public/brand and point this at it once you have one.
 */
export const hero = {
  logoSrc: null as string | null, // PLACEHOLDER — add a real logo file later.
  primaryCta: { label: "Meet The Surilas", href: "/surilas" },
  secondaryCta: { label: "Hear The Sur Sound", href: "/sur-sound" },
};

/**
 * Manifesto — the brand statement on the homepage.
 * `contrasts` are the short not/but pairs, rendered as emphasised couplets.
 */
export const manifesto = {
  label: "Our Manifesto",
  lead: "We believe great music begins with great artists.",
  paragraphs: [
    "Sur Records exists to discover distinctive voices, nurture bold ideas, and give artists the freedom to create without boundaries.",
    "We bring together heritage and the new, instinct and craft, culture and contemporary expression, creating music that belongs to its time, yet lives beyond it.",
  ],
  contrasts: [
    {
      not: "We don't believe in chasing noise.",
      but: "We believe in building voices.",
    },
    {
      not: "We don't simply release songs.",
      but: "We build artists, shape stories, and create a legacy.",
    },
  ],
  signature: "Sur Records — For the artists who have something to say.",
};

/**
 * The Surilas — the artist directory. Large portraits are the point, so keep
 * entries lean.
 *
 * To add a real photo: set `photo: '/artists/name.jpg'` and drop the file in
 * /public/artists. Without a photo the card renders generated gradient art.
 */
export const surilas = [
  // PLACEHOLDER — every artist below is invented; replace before you launch.
  {
    name: "Meera Raghunathan",
    song: "Antara",
    age: 24,
    language: "Hindi",
    socialHandle: "@meeraraghunathan",
    hue: 24,
    glyph: "मी",
    photo: null as string | null,
  },
  {
    name: "Kabir Sen",
    song: "Monsoon Static",
    age: 27,
    language: "Bengali",
    socialHandle: "@kabirsen",
    hue: 248,
    glyph: "क",
    photo: null as string | null,
  },
  {
    name: "Tanvi Deshpande",
    song: "Bhairav After Hours",
    age: 22,
    language: "Marathi",
    socialHandle: "@tanvideshpande",
    hue: 8,
    glyph: "ता",
    photo: null as string | null,
  },
  {
    name: "Aarav Menon",
    song: "Paper Boats",
    age: 29,
    language: "Malayalam",
    socialHandle: "@aaravmenon",
    hue: 190,
    glyph: "आ",
    photo: null as string | null,
  },
];

/**
 * Releases — the single source of truth for The Sur Sound.
 * "Latest" = `featured` items. "Songs" = everything with `type !== "Album"`.
 * "Albums" = `type === "Album"`. One list, three views — no duplication.
 *
 * `streaming` entries follow the same inert-'#'-link pattern as
 * `site.socials`: leave a platform out (or '#') and its link renders inert
 * rather than shipping a dead href.
 */
export type StreamingLinks = {
  spotify?: string;
  appleMusic?: string;
  amazonMusic?: string;
  youtubeMusic?: string;
  jioSaavn?: string;
  gaana?: string;
};

export const releases = [
  // PLACEHOLDER — all six releases below are invented.
  {
    title: "Antara",
    artist: "Meera Raghunathan",
    singer: "Meera Raghunathan",
    composer: "Kabir Sen",
    lyricist: "Aarav Menon",
    year: "2026",
    releaseDate: "2026-03-14",
    type: "Single" as const,
    featured: true,
    art: { hue: 24, glyph: "अ" },
    streaming: { spotify: "#", appleMusic: "#", amazonMusic: "#", youtubeMusic: "#", jioSaavn: "#", gaana: "#" } as StreamingLinks,
    youtubeUrl: "#",
    cover: null as string | null,
    audioSrc: null as string | null,
    duration: 214,
  },
  {
    title: "Monsoon Static",
    artist: "Kabir Sen",
    singer: "Kabir Sen",
    composer: "Kabir Sen",
    lyricist: "Tanvi Deshpande",
    year: "2026",
    releaseDate: "2026-01-22",
    type: "EP" as const,
    featured: true,
    art: { hue: 248, glyph: "म" },
    streaming: { spotify: "#", appleMusic: "#", amazonMusic: "#", youtubeMusic: "#", jioSaavn: "#", gaana: "#" } as StreamingLinks,
    youtubeUrl: "#",
    cover: null as string | null,
    audioSrc: null as string | null,
    duration: 251,
  },
  {
    title: "Bhairav After Hours",
    artist: "Tanvi Deshpande",
    singer: "Tanvi Deshpande",
    composer: "Aarav Menon",
    lyricist: "Meera Raghunathan",
    year: "2025",
    releaseDate: "2025-11-08",
    type: "Album" as const,
    featured: false,
    art: { hue: 8, glyph: "भ" },
    streaming: { spotify: "#", appleMusic: "#", amazonMusic: "#", youtubeMusic: "#", jioSaavn: "#", gaana: "#" } as StreamingLinks,
    youtubeUrl: "#",
    cover: null as string | null,
    audioSrc: null as string | null,
    duration: 198,
  },
  {
    title: "Paper Boats",
    artist: "Aarav Menon",
    singer: "Aarav Menon",
    composer: "Aarav Menon",
    lyricist: "Kabir Sen",
    year: "2025",
    releaseDate: "2025-08-30",
    type: "Single" as const,
    featured: false,
    art: { hue: 190, glyph: "प" },
    streaming: { spotify: "#", appleMusic: "#", amazonMusic: "#", youtubeMusic: "#", jioSaavn: "#", gaana: "#" } as StreamingLinks,
    youtubeUrl: "#",
    cover: null as string | null,
    audioSrc: null as string | null,
    duration: 187,
  },
  {
    title: "Teen Taal",
    artist: "The Sur Collective",
    singer: "The Sur Collective",
    composer: "Meera Raghunathan",
    lyricist: "—",
    year: "2025",
    releaseDate: "2025-05-17",
    type: "Live Session" as const,
    featured: false,
    art: { hue: 42, glyph: "त" },
    streaming: { spotify: "#", appleMusic: "#", amazonMusic: "#", youtubeMusic: "#", jioSaavn: "#", gaana: "#" } as StreamingLinks,
    youtubeUrl: "#",
    cover: null as string | null,
    audioSrc: null as string | null,
    duration: 302,
  },
  {
    title: "Low Tide, Bombay",
    artist: "Ishani Roy",
    singer: "Ishani Roy",
    composer: "Ishani Roy",
    lyricist: "Ishani Roy",
    year: "2024",
    releaseDate: "2024-09-02",
    type: "EP" as const,
    featured: false,
    art: { hue: 300, glyph: "इ" },
    streaming: { spotify: "#", appleMusic: "#", amazonMusic: "#", youtubeMusic: "#", jioSaavn: "#", gaana: "#" } as StreamingLinks,
    youtubeUrl: "#",
    cover: null as string | null,
    audioSrc: null as string | null,
    duration: 229,
  },
];

/**
 * From the Studio — behind-the-scenes video placeholders.
 * `videoUrl: null` renders a placeholder card; add a real URL to embed it.
 */
export const studio = [
  // PLACEHOLDER — replace with real footage before launch.
  {
    title: "In the Booth: Antara",
    category: "Studio Session",
    description:
      "The first take, the last take, and everything argued over in between.",
    relatedSong: "Antara",
    videoUrl: null as string | null,
  },
  {
    title: "Behind Monsoon Static",
    category: "Behind the Scenes",
    description: "On set for the music video, from load-in to final frame.",
    relatedSong: "Monsoon Static",
    videoUrl: null as string | null,
  },
  {
    title: "The Lyrical Journey of Bhairav After Hours",
    category: "Lyrical Journey",
    description: "How a raga became a chorus — the writing room, unedited.",
    relatedSong: "Bhairav After Hours",
    videoUrl: null as string | null,
  },
];

/** About — verbatim brand copy. */
export const about = {
  mission: {
    heading: "About Sur Records",
    paragraphs: [
      "Founded in 2026 by Ishhan, Sur Records is an independent music label built to discover, develop, and champion the next generation of artists.",
      "Rooted in love for music, storytelling, and culture, the label brings together emerging voices, established creative talent, and contemporary sounds under one vision.",
      "From artist development and music production to visual storytelling and global collaborations, Sur Records aims to create more than releases. It aims to build artists, stories, and a catalogue that lasts.",
      "Based in Mumbai, India. With a vision for the world.",
    ],
  },
  founder: {
    heading: "Founder's Message",
    paragraphs: [
      "Every story needs a beginning. Every voice needs a stage. Every dream needs a chance.",
      "Sur Records was born from my love for music and my belief in the artists who have yet to be heard.",
      "We're here to discover those voices, turn moments into melodies, and melodies into memories.",
      "Because the best stories aren't just heard… they're felt.",
      "This is our first chapter.",
      "And the music has only just begun.",
    ],
    signOff: "— Ishhan",
    signOffTitle: "Founder, Sur Records",
  },
};

/** The application form, now hosted on /contact. */
export const apply = {
  label: "Open call",
  heading: "Be part of the label",
  sub: "Send us your voice. We read every submission ourselves — no forms disappearing into an inbox nobody opens.",
  roles: [
    "Singer / Vocalist",
    "Composer",
    "Producer",
    "Lyricist",
    "Instrumentalist",
    "Other",
  ],
};
