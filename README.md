# Sur Records

Multi-page site for Sur Records — an independent record label. Six pages
(Home, The Surilas, The Sur Sound, From the Studio, About, Contact) plus a
persistent music player that keeps playing across page navigation.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · GSAP
ScrollTrigger · Lenis · Resend

---

## Run it locally

```bash
npm install
cp .env.example .env.local     # then fill in RESEND_API_KEY
npm run dev                    # http://localhost:3000
```

The site renders fine without any environment variables — only the application
form needs `RESEND_API_KEY` to actually deliver.

---

## Putting your real content in

**Almost everything lives in one file: [`lib/content.ts`](lib/content.ts).**

Open it and replace anything marked `// PLACEHOLDER`. You do not need to touch
any component to change copy, releases, artists, videos or contact details.

| What you want to change | Where in `lib/content.ts` | Shows up on |
| --- | --- | --- |
| Email, phone, social links | `site` | Footer, everywhere |
| Nav labels/routes | `nav` | Header, footer |
| Brand name/tagline, CTA links | `hero` | `/` |
| The manifesto copy | `manifesto` | `/` |
| Artists — song, age, language, handle | `surilas` | `/surilas` |
| Releases — credits, streaming/YouTube links, audio | `releases` | `/sur-sound`, the player |
| Behind-the-scenes videos | `studio` | `/studio` |
| About + Founder's Message copy | `about` | `/about` |
| Form heading and role options | `apply` | `/contact` |

### Currently placeholder — replace before you market the site

- **All six releases** and **all four artists** are invented names.
- **`streaming` links and `youtubeUrl`** on every release are `#`. Any link
  left as `#` renders as inert text rather than a dead link, so nothing is
  broken until you fill them in — but they should be filled in.
- **`audioSrc` is `null`** on every release. The music player is fully wired
  up and interactive without it (disk spins, progress ticks, tracks switch),
  it just has nothing to actually play — set `audioSrc` to a real file URL to
  make a track audible.
- **All studio videos have `videoUrl: null`** — placeholder cards until you
  add real footage.
- **All social links** are `#` (see above).
- **Phone number** is `null`, which hides it from the footer entirely.

### Adding real images

The site ships with **no image files** — every cover and artist portrait is
generated from CSS gradients in a narrow gold band, so nothing is ever a
broken image. To use real artwork:

- **Release cover:** put the file in `public/covers/`, then set `cover:
  '/covers/antara.jpg'` on that release in `content.ts` — used everywhere that
  release appears, including the music player's disk.
- **Artist photo:** put the file in `public/artists/`, then set `photo:
  '/artists/meera.jpg'` on that artist in `surilas`.
- **Hero logo:** set `hero.logoSrc` to a real logo file once you have one —
  it replaces the generated devanagari + wordmark lockup on the homepage.

Square images for covers, 3:4 portrait for artists. The generated art stays as
the fallback for anything without a file.

---

## The music player

A persistent bottom bar, mounted once in `app/layout.tsx` via
`lib/player-context.tsx`, so it keeps playing across page navigation — click a
track on `/sur-sound` and it stays playing while you browse to `/about`. Its
queue is read straight from `releases`, not a separate track list.

It's fully interactive even with `audioSrc: null` on every release: play/pause,
the spinning disk, and the progress bar all work off a simulated timer against
each track's `duration`. Set a real `audioSrc` and it switches to driving an
actual `<audio>` element instead — no other change needed.

---

## Where form submissions go

`Apply` form (rendered on `/contact`) → `POST /api/apply` → validated →
emailed to `APPLICATIONS_TO`.

The email's reply-to is set to the applicant, so hitting **Reply** in your inbox
goes straight to the singer.

**Setup:**

1. Sign up free at [resend.com](https://resend.com).
2. Create an API key, put it in `.env.local` as `RESEND_API_KEY`.
3. Verify `surrecords.com` under **Domains**, then set
   `APPLICATIONS_FROM=Sur Records <applications@surrecords.com>`.

Until step 3 is done you can use `onboarding@resend.dev` as the from-address,
but Resend will only deliver to the address you signed up with.

Protections already in place: server-side validation, a hidden honeypot field,
and a 5-per-10-minutes-per-IP rate limit.

> **Note on the rate limit:** it is stored in memory, so on serverless each
> instance counts separately. That is fine for normal traffic. If the form ever
> gets seriously abused, move it to Vercel KV or Upstash Redis.

---

## Role-specific fields & file uploads

Picking a role in "What do you do?" on `/contact` reveals its own follow-up
questions — language, genre, credits, portfolio links, and in several cases a
real file upload. All of it is data: `applyRoles` in
[`lib/content.ts`](lib/content.ts) is the full list of roles and their
fields. Add, remove, or reorder fields there — `components/ApplyRoleFields.tsx`
just interprets whatever it finds, so no component code needs to change.

**File uploads** go straight from the visitor's browser to Vercel Blob
storage (never through this app's server), so large audio/video demos never
hit a request-size limit. The emailed application gets a link to the file,
not the file itself.

**Setup:**

1. In the Vercel dashboard: **Storage → Blob → Connect to project.**
2. Copy the token it gives you into `.env.local` as `BLOB_READ_WRITE_TOKEN`.

Until this is set, every other part of the form still works — uploads just
show "Could not upload that file. You can still submit without it." and
submission proceeds without them.

---

## Deploying to Vercel

```bash
npx vercel          # first run: links the project
npx vercel --prod   # deploy
```

Then in the Vercel dashboard → **Settings → Environment Variables**, add
`RESEND_API_KEY`, `APPLICATIONS_TO`, `APPLICATIONS_FROM` and
`NEXT_PUBLIC_SITE_URL`. Redeploy after adding them.

### Pointing surrecords.com at it

Your domain is currently on GoDaddy Website Builder, which cannot host this
site. Once deployed:

1. Vercel → **Settings → Domains** → add `surrecords.com`.
2. In GoDaddy DNS, set the records Vercel shows you (an `A` record for the
   apex and a `CNAME` for `www`).
3. Turn off the GoDaddy Website Builder site so it stops answering for the
   domain.

DNS usually propagates within an hour.

---

## How the motion works

One motion system: **GSAP + ScrollTrigger**, with **Lenis** for smooth
scrolling. Both share a single RAF loop (`components/SmoothScroll.tsx`) —
running two loops is what causes scrub jitter.

Easing and duration tokens live in `lib/motion.ts` so every animation on the
page shares one rhythm.

The hero composites three effects from the 21st.dev / Aceternity hero family,
re-implemented in CSS + GSAP against this palette rather than pulled in as a
dependency:

| Effect | Where |
| --- | --- |
| Aurora Background | `.aurora` in `globals.css` |
| Lamp Effect | `.lamp-cone` / `.lamp-filament` |
| Sparkles | canvas particle field in `Hero.tsx` |
| Hero Parallax | scrub-driven `data-parallax` layers |

The homepage Hero is the only section with bespoke pinned/scrubbed
choreography; every other page (The Surilas, The Sur Sound, From the Studio,
About) uses the shared `Reveal` component for entrance animation — simpler
and consistent across six pages, without fighting native scroll on each one.

**Everything is disabled under `prefers-reduced-motion`.** Content is fully
visible and readable with animation off; scroll-revealed sections also stay
visible without JavaScript so crawlers index them.

---

## Accessibility notes

- Contrast verified against WCAG AA across every text node in both the mobile
  and desktop renders.
- `--color-bronze` is **glow only** — it measures 3.1:1 on ink and must never be
  used for text. Use `--color-gold` (9.5:1) for any gold-family text.
- All tap targets are ≥44px; form has visible labels, inline validation on blur,
  `role="alert"` errors, and focus moves to the first invalid field on submit.
- Skip link, keyboard-visible focus rings, and `Escape` closes the mobile menu.
