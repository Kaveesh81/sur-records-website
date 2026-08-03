# Sur Records

Landing site for Sur Records — an independent record label. Built to showcase
releases and convert visiting singers, composers and producers into applicants.

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
any component to change copy, releases, artists, stats or contact details.

| What you want to change | Where in `lib/content.ts` |
| --- | --- |
| Email, phone, social links | `site` |
| Hero headline and buttons | `hero` |
| Scrolling word band | `ticker` |
| The "Our sound" statement | `manifesto` |
| Releases in the gallery | `releases` |
| Artists on the roster | `roster` |
| What the label offers | `offer` |
| The four big numbers | `proof` |
| Form heading and role options | `apply` |

### Currently placeholder — replace before you market the site

- **All six releases** and **all four artists** are invented names.
- **The four stats** (40+ tracks, 12 artists, 3M+ streams, 6 languages).
- **All four social links** are `#`. Any link left as `#` renders as inert
  text rather than a dead link, so nothing is broken until you fill them in —
  but they should be filled in.
- **Phone number** is `null`, which hides it from the footer entirely.

### Adding real images

The site ships with **no image files** — every cover and artist portrait is
generated from CSS gradients, so nothing is ever a broken image. To use real
artwork:

- **Release cover:** put the file in `public/covers/`, then add
  `cover: '/covers/antara.jpg'` to that release in `content.ts`.
- **Artist photo:** put the file in `public/artists/`, then add
  `photo: '/artists/meera.jpg'` to that artist.

Square images for covers, 3:4 portrait for artists. The generated art stays as
the fallback for anything without a file.

---

## Where form submissions go

`Apply` form → `POST /api/apply` → validated → emailed to `APPLICATIONS_TO`.

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

Only **two** sections pin (Manifesto and Releases) — more than that starts
fighting native scroll, and both drop their pin below 768px where pinning hurts
touch scrolling most.

**Everything is disabled under `prefers-reduced-motion`.** Content is fully
visible and readable with animation off; scroll-revealed sections also stay
visible without JavaScript so crawlers index them.

---

## Accessibility notes

- Contrast verified against WCAG AA across every text node in both the mobile
  and desktop renders.
- `--color-indigo` is **glow only** — it measures 2.7:1 on ink and must never be
  used for text. Use `--color-indigo-lift` (5.0:1) if you need indigo type.
- All tap targets are ≥44px; form has visible labels, inline validation on blur,
  `role="alert"` errors, and focus moves to the first invalid field on submit.
- Skip link, keyboard-visible focus rings, and `Escape` closes the mobile menu.
