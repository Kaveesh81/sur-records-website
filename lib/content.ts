/**
 * ============================================================================
 *  SUR RECORDS — CONTENT MAP
 * ============================================================================
 *  This is the ONLY file you need to edit to put real content on the site.
 *  Every headline, artist, release and stat on the page is read from here.
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
  { label: "Sound", href: "#manifesto" },
  { label: "Releases", href: "#releases" },
  { label: "Artists", href: "#roster" },
  { label: "Label", href: "#offer" },
] as const;

/** Hero — the split-character animated headline. Keep it under 8 words. */
export const hero = {
  eyebrow: "Independent record label",
  headline: ["Where rhythm,", "sound & energy", "come alive"],
  sub: "A home for singers, composers and producers building the next era of Indian music — classical roots, modern pulse.",
  primaryCta: { label: "Be part of the label", href: "#apply" },
  secondaryCta: { label: "Hear the roster", href: "#releases" },
};

/** Infinite marquee band under the hero. */
export const ticker = [
  "Vocalists",
  "Composers",
  "Producers",
  "Lyricists",
  "Instrumentalists",
  "Film Scores",
  "Indie Fusion",
  "Live Sessions",
];

/**
 * Manifesto — revealed word-by-word as you scroll.
 * Keep to ~40 words; longer copy makes the scroll-scrub feel endless.
 */
export const manifesto = {
  label: "Our sound",
  body: "Sur is the note before the song. We build records around that first honest sound — the raga that survives the mix, the voice that does not need repair. Roots you can trace. Production you can feel.",
};

/**
 * Releases — the horizontal pinned gallery.
 * `art` drives the generated cover artwork (no image files needed):
 *   hue      — base hue 0-360
 *   glyph    — Devanagari character shown large on the cover
 * Add a real cover later by setting `cover: '/covers/name.jpg'` and dropping
 * the file in /public/covers — the component prefers it over generated art.
 */
export const releases = [
  // PLACEHOLDER — all six releases below are invented.
  { title: "Antara", artist: "Meera Raghunathan", year: "2026", type: "Single", art: { hue: 24, glyph: "अ" } },
  { title: "Monsoon Static", artist: "Kabir Sen", year: "2026", type: "EP", art: { hue: 248, glyph: "म" } },
  { title: "Bhairav After Hours", artist: "Tanvi Deshpande", year: "2025", type: "Album", art: { hue: 8, glyph: "भ" } },
  { title: "Paper Boats", artist: "Aarav Menon", year: "2025", type: "Single", art: { hue: 190, glyph: "प" } },
  { title: "Teen Taal", artist: "The Sur Collective", year: "2025", type: "Live Session", art: { hue: 42, glyph: "त" } },
  { title: "Low Tide, Bombay", artist: "Ishani Roy", year: "2024", type: "EP", art: { hue: 300, glyph: "इ" } },
];

/**
 * Roster — artist cards.
 * To add a photo: set `photo: '/artists/name.jpg'` and drop the file in
 * /public/artists. Without a photo the card renders generated gradient art.
 */
export const roster = [
  // PLACEHOLDER — all artists below are invented.
  { name: "Meera Raghunathan", role: "Vocalist", location: "Chennai", hue: 24, glyph: "मी" },
  { name: "Kabir Sen", role: "Composer / Producer", location: "Mumbai", hue: 248, glyph: "क" },
  { name: "Tanvi Deshpande", role: "Vocalist", location: "Pune", hue: 8, glyph: "ता" },
  { name: "Aarav Menon", role: "Multi-instrumentalist", location: "Kochi", hue: 190, glyph: "आ" },
];

/** What the label gives an artist — the persuasion engine. */
export const offer = {
  label: "What you get",
  heading: "We sign the voice, then build everything around it.",
  items: [
    {
      icon: "mic",
      title: "Studio time that respects the take",
      body: "Sessions booked around your voice, not the clock. Live tracking, analogue warmth, and an engineer who knows a shruti from a semitone.",
    },
    {
      icon: "globe",
      title: "Distribution everywhere that counts",
      body: "Spotify, Apple Music, YouTube Music, JioSaavn and Gaana — delivered, metadata-clean, on release day. Playlist pitching included.",
    },
    {
      icon: "scroll",
      title: "Publishing you actually understand",
      body: "Transparent splits explained in plain language before you sign. You keep your masters conversation open — we do not bury it in an annexure.",
    },
    {
      icon: "film",
      title: "Sync into film and advertising",
      body: "Direct lines to music supervisors across Hindi, Tamil and Malayalam cinema, plus brand campaigns looking for a real voice.",
    },
    {
      icon: "camera",
      title: "Visuals that match the record",
      body: "Cover art, vertical cutdowns, live session films. Your release arrives looking like it belongs next to anything on the chart.",
    },
    {
      icon: "users",
      title: "A room full of collaborators",
      body: "Composers meeting lyricists meeting producers. Most of our releases started as an introduction in the Sur writing room.",
    },
  ],
};

/** Animated counters. Keep `value` numeric; `suffix` renders after it. */
export const proof = [
  // PLACEHOLDER — replace with real figures before marketing the site.
  { value: 40, suffix: "+", label: "Tracks released" },
  { value: 12, suffix: "", label: "Artists on roster" },
  { value: 3, suffix: "M+", label: "Streams to date" },
  { value: 6, suffix: "", label: "Languages recorded" },
];

/** The application form. */
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
