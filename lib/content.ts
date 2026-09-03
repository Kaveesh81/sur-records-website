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
    {
      label: "Instagram",
      href: "https://www.instagram.com/surrecordsofficial?igsi=MTZmajBrOW41aHdhbg%3D%3D&utm_source=qr",
    },
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
  { label: "Sur Access", href: "/sur-access" },
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
  headingPrefix: "Be part of the",
  sub: "Fill in your information below and get in touch with us. We read every submission ourselves. No forms disappearing into an inbox nobody opens.",
};

/**
 * Role-specific follow-up fields on the Contact form. Each role is data —
 * picking a role in the "What do you do?" select renders exactly the fields
 * listed here, via `components/ApplyRoleFields.tsx`. Add/reorder/edit fields
 * here; no component code needs to change.
 *
 * `showWhen` makes a field conditional on an earlier `yesno` field's answer
 * (e.g. a different upload prompt depending on whether they have prior work).
 * `allowOther` adds a free-text follow-up when "Other" is picked.
 */
export type FieldType =
  | "select"
  | "multiselect"
  | "text"
  | "textarea"
  | "upload"
  | "upload-or-link" // a file upload OR a pasted link — either satisfies `required`
  | "yesno";

export type RoleField = {
  key: string;
  type: FieldType;
  label: string;
  options?: readonly string[];
  allowOther?: boolean;
  accept?: string; // file input accept attribute — "upload" fields only
  hint?: string;
  showWhen?: { key: string; equals: string };
  required?: boolean; // only meaningful once the field is visible (passes showWhen)
  layout?: "pills" | "list"; // "multiselect" only — checkbox list vs. toggle pills
};

export type RoleConfig = {
  id: string;
  label: string;
  fields: readonly RoleField[];
};

const LANGUAGES = ["English", "Hindi", "Marathi", "Punjabi", "Other"] as const;

const GENRES = [
  "Bollywood / Film",
  "Indie / Alternative",
  "Pop",
  "Hip-Hop / Rap",
  "Classical (Hindustani/Carnatic)",
  "Devotional / Spiritual",
  "Folk",
  "Electronic / EDM",
  "R&B / Soul",
  "Rock",
  "Other",
] as const;

const INSTRUMENTS = [
  "Guitar",
  "Piano / Keyboard",
  "Drums",
  "Bass",
  "Violin",
  "Tabla",
  "Flute (Bansuri)",
  "Sitar",
  "Harmonium",
  "Saxophone",
  "Percussion",
  "Other",
] as const;

const BUDGET_RANGES = [
  "Under ₹50,000",
  "₹50,000 – ₹2,00,000",
  "₹2,00,000 – ₹5,00,000",
  "₹5,00,000+",
  "Prefer to discuss",
] as const;

const AUDIO_ACCEPT = "audio/mpeg,audio/wav,audio/x-wav,audio/mp4,.mp3,.wav";
const AUDIO_VIDEO_ACCEPT = `${AUDIO_ACCEPT},video/mp4,.mp4`;
const DOC_ACCEPT = "application/pdf,.pdf,.doc,.docx";
const ANY_ACCEPT = `${AUDIO_VIDEO_ACCEPT},${DOC_ACCEPT},image/*`;

export const applyRoles: RoleConfig[] = [
  {
    id: "singer",
    label: "Singer",
    fields: [
      { key: "language", type: "select", label: "Language", options: LANGUAGES, allowOther: true, required: true },
      { key: "genre", type: "multiselect", label: "Genre / Style", options: GENRES, allowOther: true },
      { key: "hasPreviousWork", type: "yesno", label: "Do you have previous work you can share?" },
      {
        key: "previousWorkUpload",
        type: "upload",
        label: "Upload your previous work",
        accept: AUDIO_ACCEPT,
        showWhen: { key: "hasPreviousWork", equals: "Yes" },
        required: true,
      },
      {
        key: "singingDemo",
        type: "upload-or-link",
        label: "A short singing demo",
        accept: "video/mp4,.mp4",
        showWhen: { key: "hasPreviousWork", equals: "No" },
        required: true,
      },
      { key: "streamingLinks", type: "text", label: "Streaming platform links", hint: "Optional — Spotify, Apple Music, etc." },
    ],
  },
  {
    id: "lyricist",
    label: "Songwriter / Lyricist",
    fields: [
      { key: "language", type: "select", label: "Language", options: LANGUAGES, allowOther: true, required: true },
      { key: "genre", type: "multiselect", label: "Genre / Style", options: GENRES, allowOther: true },
      { key: "hasPreviousLyrics", type: "yesno", label: "Do you have previous lyrics you can share?" },
      {
        key: "lyricsUpload",
        type: "upload",
        label: "Upload your lyrics",
        accept: DOC_ACCEPT,
        showWhen: { key: "hasPreviousLyrics", equals: "Yes" },
        required: true,
      },
      {
        key: "lyricsDemo",
        type: "upload",
        label: "Lyrics demo — upload your work",
        accept: DOC_ACCEPT,
        showWhen: { key: "hasPreviousLyrics", equals: "No" },
        required: true,
      },
    ],
  },
  {
    id: "composer",
    label: "Music Director / Composer",
    fields: [
      { key: "language", type: "select", label: "Language", options: LANGUAGES, allowOther: true, required: true },
      { key: "genre", type: "multiselect", label: "Genre / Style", options: GENRES, allowOther: true },
      { key: "hasPreviousWork", type: "yesno", label: "Do you have previous work you can share?" },
      {
        key: "previousWorkUpload",
        type: "upload",
        label: "Upload your previous work",
        accept: AUDIO_ACCEPT,
        showWhen: { key: "hasPreviousWork", equals: "Yes" },
        required: true,
      },
      {
        key: "musicDemo",
        type: "upload-or-link",
        label: "A music demo",
        accept: AUDIO_ACCEPT,
        showWhen: { key: "hasPreviousWork", equals: "No" },
        required: true,
      },
      { key: "streamingLinks", type: "text", label: "Streaming platform links", hint: "Optional — Spotify, Apple Music, etc." },
      {
        key: "credits",
        type: "textarea",
        label: "Credits",
        hint: "Productions, films, artists you've worked with",
        showWhen: { key: "hasPreviousWork", equals: "Yes" },
        required: true,
      },
      {
        key: "creditsUpload",
        type: "upload",
        label: "Upload supporting document for your credits",
        showWhen: { key: "hasPreviousWork", equals: "Yes" },
        required: true,
      },
    ],
  },
  {
    id: "musician",
    label: "Musician",
    fields: [
      { key: "genre", type: "multiselect", label: "Genre / Style", options: GENRES, allowOther: true },
      { key: "instruments", type: "multiselect", label: "Instruments", options: INSTRUMENTS, allowOther: true },
      { key: "hasPreviousWork", type: "yesno", label: "Do you have previous work you can share?" },
      {
        key: "previousWorkUpload",
        type: "upload",
        label: "Upload your previous work",
        accept: AUDIO_VIDEO_ACCEPT,
        showWhen: { key: "hasPreviousWork", equals: "Yes" },
        required: true,
      },
      {
        key: "instrumentalDemo",
        type: "upload-or-link",
        label: "An instrumental demo",
        accept: AUDIO_VIDEO_ACCEPT,
        showWhen: { key: "hasPreviousWork", equals: "No" },
        required: true,
      },
      {
        key: "credits",
        type: "textarea",
        label: "Credits",
        showWhen: { key: "hasPreviousWork", equals: "Yes" },
        required: true,
      },
      {
        key: "creditsUpload",
        type: "upload",
        label: "Upload supporting document for your credits",
        showWhen: { key: "hasPreviousWork", equals: "Yes" },
        required: true,
      },
    ],
  },
  {
    id: "producer",
    label: "Producer",
    fields: [
      { key: "companyName", type: "text", label: "Company name", required: true },
      { key: "releases", type: "textarea", label: "List your production releases", required: true },
      { key: "artistsWorkedWith", type: "textarea", label: "Artists worked with", required: true },
      { key: "streamingLinks", type: "text", label: "Streaming platform links", required: true },
      { key: "workUpload", type: "upload", label: "Upload your work", accept: AUDIO_VIDEO_ACCEPT, required: true },
    ],
  },
  {
    id: "visual-creative",
    label: "Visual Creative",
    fields: [
      {
        key: "disciplines",
        type: "multiselect",
        label: "Your discipline(s)",
        options: [
          "Director",
          "Cinematographer",
          "Editor",
          "Photographer (BTS / Stills)",
          "Creative Director",
          "Designer / Costume",
          "Hair & Makeup",
          "Other",
        ],
        allowOther: true,
        layout: "list",
        required: true,
      },
      { key: "portfolioUpload", type: "upload", label: "Portfolio / showreel document", required: true },
      { key: "notableWork", type: "textarea", label: "Notable work / credits", required: true },
      {
        key: "sampleUpload",
        type: "upload",
        label: "A sample reel or images",
        accept: `${AUDIO_VIDEO_ACCEPT},image/*`,
        required: true,
      },
    ],
  },
  {
    id: "brand",
    label: "Brand Collaborations",
    fields: [
      { key: "companyName", type: "text", label: "Company name", required: true },
      { key: "contactPerson", type: "text", label: "Contact person", required: true },
      { key: "brief", type: "textarea", label: "Project / brief", required: true },
      { key: "timeline", type: "text", label: "Timeline", required: true },
      { key: "aboutCompany", type: "textarea", label: "About the company", required: true },
      { key: "budgetRange", type: "select", label: "Budget range", options: BUDGET_RANGES, required: true },
      { key: "attachment", type: "upload", label: "Attachment", accept: ANY_ACCEPT, required: true },
    ],
  },
  {
    id: "events",
    label: "Events / Live Concerts",
    fields: [
      {
        key: "categories",
        type: "multiselect",
        label: "What best describes this?",
        options: ["Festival", "Venue", "Event Collaboration", "Live Partnership", "Other"],
        allowOther: true,
        required: true,
      },
      { key: "organizationName", type: "text", label: "Organization name", required: true },
      { key: "location", type: "text", label: "Location", required: true },
      { key: "proposedDates", type: "text", label: "Proposed dates", required: true },
      { key: "details", type: "textarea", label: "Details", required: true },
    ],
  },
  {
    id: "general",
    label: "General Enquiry",
    fields: [],
  },
  {
    id: "sell-music",
    label: "Sell / License Music",
    fields: [
      { key: "songTitle", type: "text", label: "Song / title name", required: true },
      { key: "artist", type: "text", label: "Artist", required: true },
      { key: "composer", type: "text", label: "Composer", required: true },
      { key: "lyricist", type: "text", label: "Lyricist", required: true },
      { key: "genre", type: "select", label: "Genre", options: GENRES, allowOther: true, required: true },
      { key: "language", type: "select", label: "Language", options: LANGUAGES, allowOther: true, required: true },
      {
        key: "lookingFor",
        type: "multiselect",
        label: "What are you looking for?",
        options: [
          "Sell the music / catalogue",
          "License the music",
          "Release through Sur Records",
          "Distribution",
          "Publishing opportunity",
          "Collaboration",
          "Other",
        ],
        allowOther: true,
        required: true,
      },
      { key: "trackUpload", type: "upload", label: "Upload the track", accept: AUDIO_ACCEPT, required: true },
    ],
  },
];

/**
 * Sur Access — the paid membership. `plans` drives both the pricing cards
 * and the Razorpay order amount server-side (see app/api/razorpay/) — the
 * server always looks the amount up here by `id`, it never trusts a client-
 * supplied amount.
 */
export type SurAccessPlan = {
  id: string;
  label: string;
  amount: number; // INR rupees, NOT paise
  interval: string;
};

export const surAccess = {
  eyebrow: "Members Only",
  heading: "The label, from the inside.",
  description:
    "A closer seat to everything Sur Records makes — the unreleased, the unseen, and the not-yet-announced, before anyone else gets it.",
  benefits: [
    "Exclusive release listening parties",
    "First access to selected unreleased music",
    "Private artist sessions",
    "Priority access to selected events",
    "Exclusive BTS content",
    "Private artist / studio content",
    "Potential future invite-only events",
  ],
  // PLACEHOLDER — pricing isn't finalized yet. Edit these two amounts (in
  // rupees) once you've decided; nothing else in the checkout needs to change.
  plans: [
    { id: "monthly", label: "Monthly", amount: 499, interval: "month" },
    { id: "yearly", label: "Yearly", amount: 4999, interval: "year" },
  ] as SurAccessPlan[],
};
