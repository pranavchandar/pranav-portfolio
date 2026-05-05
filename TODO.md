# Portfolio TODO — Prioritized Roadmap

This file tracks everything that is *not yet built* in the portfolio, ordered
by priority. Phase 1 (cleanup of existing modules) is already done on the
`claude/portfolio-review-feedback-hoZO8` branch — see commit history.

Priority legend:
- **P0** — blocks the site from being shareable. Do first.
- **P1** — required to deliver the multi-discipline vision.
- **P2** — quality / performance / polish.
- **P3** — ambitious add-ons that lean into the unorthodox vision.

---

## P0 — Make the site shareable

### Resume content
The new `/resume` page is structurally complete, but the data model in
`resume.component.ts` contains placeholders (`[Add company]`, `[Start] –
Present`, etc.). Fill in:
- [ ] Real experience entries with company, period, and 2–4 bullets each.
      Lead bullets with measurable outcomes.
- [ ] Real skill lists (currently lists are reasonable defaults).
- [ ] Real education entry.
- [ ] Add a "Download PDF" button next to the heading and host the PDF in
      `public/` or via a link service.

### Footer contact info
`footer.component.ts` ships placeholder URLs. Replace:
- [ ] Real `mailto:` address.
- [ ] Real `tel:` (or remove the phone link).
- [ ] Real GitHub, LinkedIn, Instagram, Facebook, personal-site URLs.
- [ ] Verify all icons render and have correct `aria-label`.

### Domain & hosting
- [ ] Buy / point a domain.
- [ ] Pick a host (Vercel, Netlify, Cloudflare Pages, Firebase) — Angular SSR
      works on all of them; static prerender is enabled and is the simpler path.
- [ ] Set up `robots.txt` and `sitemap.xml` (Angular SSR has built-in support).

---

## P1 — Deliver the multi-discipline vision

The three nav links currently route to a working `PlaceholderComponent`
("Coming Soon"). They need to become real portfolio sub-pages.

### Shared work-page infrastructure
- [ ] Define a `Project` interface (id, title, year, hero image, tags, body,
      gallery, links).
- [ ] Build `WorkIndexComponent` (the discipline landing page — grid of cards).
- [ ] Build `WorkDetailComponent` for `/work/:discipline/:slug`.
- [ ] Add a JSON or TypeScript data source per discipline (start static; move
      to a CMS only if it stops scaling).

### `/work/programming`
- [ ] Pick 3–6 case studies (mix of professional + personal).
- [ ] For each: problem, stack, your role, screenshots/GIFs, outcome, repo link.
- [ ] Include at least one AI-related project to back the claim in About.

### `/work/cgi`
- [ ] Curate 6–12 Blender renders.
- [ ] For each: hero render, lookdev breakdown stills, optional turntable mp4,
      "made with" credits.
- [ ] Use the existing `chandar.svg` arcade-shop scene as the section hero.

### `/work/digital-art`
- [ ] Curate sketches and illustrations.
- [ ] For each: full-res image, optional process GIF, medium/tools used.
- [ ] Consider adding a `/work/vfx` later — same template.

---

## P2 — Code health, performance, accessibility

### Shared `<app-page-shell>`
Today, `home`, `about`, `resume`, and `placeholder` each reimplement
background + overlay + nav + footer.
- [ ] Extract a `PageShellComponent` that takes a slot for content.
- [ ] Migrate the four pages to use it. Delete the duplicated SCSS blocks.

### Asset pipeline
The `/assets` folder is now ~30 MB — still too large.
- [ ] Convert PNG → AVIF/WebP for hero CRT frames, about portraits, background.
- [ ] Generate 480 / 960 / 1920 widths and use `<img srcset sizes>`.
- [ ] Add `loading="lazy"` to non-LCP images, `fetchpriority="high"` to the LCP.
- [ ] Compress `intro3.mp4` (currently 13.7 MB) with `-crf 28 -preset slow`,
      target <3 MB. Or move to a CDN.
- [ ] Consider replacing the 5 hero CRT PNGs (~10 MB) with a single SVG/Lottie
      animation — same effect, ~99% smaller.

### Mobile parity
- [ ] Replace the "best experienced in desktop view" copy.
- [ ] Design a vertical hero for mobile that doesn't hide the CRT animation.
- [ ] Audit `/about`: large image container is `display: none` under 962 px,
      so the "click to destroy" interaction is desktop-only. Either make it
      mobile-friendly or surface an alternative on mobile.

### Accessibility
- [ ] Add `prefers-reduced-motion` guards around the 2-second fade-out and
      the destructible-portrait animation (the global CSS guard helps but the
      JS-driven `setTimeout` navigation should also fire instantly).
- [ ] Verify color contrast of `#920000` on the dark overlay (WCAG AA).
- [ ] Real alt text everywhere (currently `aria-hidden="true"` on the hero
      image; that's fine because the name conveys the info, but case-study
      images later will need real alt text).
- [ ] Keyboard support for the destructible portrait (`role="button"`,
      `tabindex="0"`, Enter/Space handler).

### Tooling
- [ ] Add ESLint (`ng add @angular-eslint/schematics`).
- [ ] Add Prettier with a project config.
- [ ] Add a CI workflow: install → lint → build on push.
- [ ] Add a basic Lighthouse CI check.

### Tests
The existing `*.spec.ts` files are auto-generated and don't assert anything
meaningful.
- [ ] Add a smoke test per route.
- [ ] Test the navigation submenu open/close.
- [ ] Test the Resume data shape (so refactors don't break the timeline).

### Misc cleanup
- [ ] `/test` route still ships in production (now lazy-loaded). Either gate
      it behind an environment flag or remove.
- [ ] Multiple copies of `Vector.svg` exist in `assets/` and `assets/images/`.
      Consolidate.
- [ ] Unused SVG variants (`pranav.svg`, `chandar.svg`, `software engineer.svg`,
      `VectorName.svg`) — keep if you plan to swap text → SVG type, otherwise
      delete.

---

## P3 — Unorthodox UI ideas (the fun part)

These are the moves that turn the site from "another portfolio" into the
visiting-card you actually want. Pick 1–2 and commit, don't try to do all.

### CRT shader on the hero
- [ ] Pure-CSS scanlines + chromatic aberration overlay. ~30 lines.
- [ ] Subtle phosphor flicker animation.

### Custom cursor (already attempted in commit history)
- [ ] Bring back the cursor follower across the whole site (not just home).
- [ ] Make it react: dot → ring on hover, color shift on links.

### Boot-up sequence
- [ ] Extend `/secret` into a real first-visit experience.
- [ ] After the Y/N gate and intro video, show a "desktop" with folder icons
      that route to `/work/programming`, `/work/cgi`, `/work/digital-art`.
- [ ] The pixel folder asset already in `/assets/images/resume.png` is the
      visual language to lean into.

### Drag-to-rearrange portfolio grid
- [ ] Use Angular CDK Drag-Drop on the work-index page.
- [ ] Persist order to `localStorage`.

### 3D model on `/work/cgi`
- [ ] Embed one Blender model via `@google/model-viewer` or a tiny Three.js
      scene (with @angular/three or vanilla).
- [ ] Lazy-load — only fetch when the user scrolls to it.

### Audio
- [ ] Soft CRT hum / synth blip on hover.
- [ ] Mute toggle in the nav, persisted in `localStorage`.
- [ ] Respect `prefers-reduced-motion` (treat as "no audio either" by default).

### Discoverability for the easter egg
- [ ] Add a Konami code listener at the app root that navigates to `/secret`.
- [ ] Add a hidden terminal command (`cd /secret`) at the top of the home page
      that opens an input on tilde-key press.

---

## Done (Phase 1 — already shipped on this branch)

- Per-route titles, OG meta, theme color, preconnect, preload of LCP image.
- Lazy-loaded all routes; bundle now splits cleanly per page.
- Created shared design tokens in `styles.scss` and added a global
  `prefers-reduced-motion` guard.
- Created `PlaceholderComponent` and wired `/work/programming`,
  `/work/digital-art`, `/work/cgi` routes so nav no longer 404s.
- Home: dropped unused `RouterLinkActive` import, converted hero CTAs to
  semantic anchors, cleaner alt text.
- About: removed `console.log` debug call.
- Resume: fixed `@ViewChild('aboutContainer')` → `'resumeContainer'` bug,
  replaced "resume Me" placeholder with a real structured skeleton
  (Summary, Experience, Skills, Education).
- Footer: real anchor structure with `aria-label`, safe `target="_blank"`
  + `rel="noopener noreferrer"`, configurable link list in TS.
- Navigation: `<button>` for the hamburger with proper ARIA, keyboard
  support on the dropdown, portfolio links now point to `/work/*`.
- Landing page: removed dead `showImage` flag, gated DOM access behind
  `isPlatformBrowser` so it's SSR-safe, used `@ViewChild` on the video.
- Test: replaced unsafe `eval()` with a typed enum of safe curves.
- Removed ~16 MB of unused/oversized assets (intro.mp4, intro2.mp4,
  intro-placeholder.jpg, abouut.png, poof.jpg, poof2.png, stray
  social-icons sprite).
