# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal research hub + portfolio for a security researcher ("gnosis" / Keunho Kim). Built with Next.js 16 App Router + React 19, statically exported to GitHub Pages. The site is a hub: a curated home page, a blog index, a projects page, and an about/portfolio page.

Next 15+ convention: page/layout `params` is a `Promise` — always `await params` before reading `locale`.

## Commands

```bash
npm run dev      # Local dev server
npm run build    # Static export to ./out/
npm run lint     # ESLint
npx tsc --noEmit # Type check
```

No test suite is configured.

## Architecture

### Static Export

`output: "export"` in `next.config.ts` — no server-side runtime, no API routes, images unoptimized. All pages pre-rendered at build time via `generateStaticParams`. The `./out/` directory is deployed to GitHub Pages via GitHub Actions.

**No `middleware.ts`** (incompatible with `output: export`). Locale handling is therefore explicit in each page: every page under `[locale]/` must export `generateStaticParams()` returning the locales and call `setRequestLocale(locale)` at the top of the component. The `/ → /ko` redirect lives in `src/app/page.tsx` (`redirect("/ko")`); the root `src/app/layout.tsx` only sets metadata and passes children through — the real `<html>`/providers shell is `src/app/[locale]/layout.tsx`.

### Routing

```
/                    → redirect to /ko
/[locale]            → hub: a root session typed out on load (name, id, `ls` of `about_me/ blog/ laboratory/`), then a live prompt (`help`, `ls`, `cd`, `whoami`, `clear`; anything else searches) — `src/components/home/hub.tsx`, `hub-shell.tsx`
/[locale]/about_me   → about me: profile, experience, highlights, publications, talks, credentials, contact
/[locale]/blog       → post index (client-side filter/search over src/data/posts.ts)
/[locale]/laboratory → tools & experiments (project accordion)
/[locale]/career     → project stories (long-form, per-project sections `#section-<id>`), linked from about_me
/[locale]/about, /[locale]/projects → legacy redirects to /about_me and /laboratory
```

Locales: `ko` (default), `en`. Configured in `src/i18n/routing.ts`.

### Navigation

Top-level nav is route based and comes from `siteConfig.nav` (`{ key, href }[]`: about_me, blog, laboratory; labels are the directory names in both locales); `href` is appended to `/${locale}` and `key` is the label key under `nav` in `src/messages/*.json`. `Header` marks a link active by pathname prefix (`/career` counts as `about_me`). The wordmark `~/gnosis_` is the hub link. A global search dialog (`⌘K` / `Ctrl+K`, `src/components/search/search-dialog.tsx`) lazy-loads `src/lib/search-index.ts`, which indexes featured research, career sections, projects, and posts.

The hub's directory stats derive from data: latest award (`awards[0]`), post count and latest post date (`src/data/posts.ts`), and projects whose period contains `현재`. `src/components/home/{hero,system-map,featured-research,recent-posts,home-projects,home-contact}.tsx` are an earlier, longer home layout kept for reuse; nothing renders them now.

### Bilingual Content Pattern

Two separate systems for translations:

- **Data content** (`src/data/*.ts`): Every object carries sibling fields like `title` / `titleEn`. Components check `locale === "ko"` and select the appropriate field directly.
- **UI labels** (`src/messages/{ko,en}.json`): Navigation, section headings, button text — accessed via next-intl's `useTranslations()` (`getTranslations` in server `generateMetadata`).

Posts are Korean-first: each post has `lang`, and `PostRow` shows a small language badge when the UI locale differs from the post language.

### Styling

Tailwind CSS v4 via PostCSS plugin — **no `tailwind.config.js`**. Theme tokens (colors, fonts) defined in `src/app/globals.css` using `@theme { }` with CSS custom properties. Dark mode via `.dark` class (next-themes, default: dark).

**Visual direction: the site looks like a Linux terminal.** Everything is monospace (`JetBrains Mono` for Latin, `Nanum Gothic Coding` for Hangul, both via `next/font/google`; the `@theme` font chains name the families literally because next/font's own `--font-*` variables would collide). Terminal-black background, **one teal accent** (`--color-accent`), thin `border-border` rules, 2px corners (a global rule flattens `rounded-*`). Pages open with a prompt line (`.prompt` → `gnosis@kim:~ $ cat about_me/README.md`) and markdown-style headings (`#`, `##`, `###`). Shared terminal primitives live in `src/components/ui/term.tsx`: `Cmd` (`$ open github` links), `Tags` (`#tag` lists), `Bullets` (`- item`), `Line` (date column + content), `SubHeading` (`### …`), `Bracket` (`[tag]`). The footer closes the session the home page opens: `exit`, `logout`, `Connection to <host> closed.` (host from `siteConfig.url`).

- **Section background alternation**: sections on a page strictly alternate `bg-section-alt` and `bg-background`. About-me page: intro(bg) → About(alt) → Experience(bg) → CareerHighlights(alt) → Publications(bg) → Speaking(alt) → Credentials(bg) → Contact(alt via `className`). The hub is a single `bg-background` section. Re-check when adding or reordering sections.
- **Headings**: the hub's door titles and tagline end with an accent-colored period (message strings must not end with a period). Sub pages use `PageIntro` (mono path like `~/gnosis/blog`, h1, description). `SectionLabel` (`NN / mono label` + sentence title) is used by the older home sections.
- **Utilities in globals.css**: `.bg-grid` (hero blueprint grid), `.cursor-blink`, `.dash-flow` (animated SVG connections). Both animations are disabled under `prefers-reduced-motion`.
- **Fonts**: Inter (latin) + JetBrains Mono (`--font-mono`) load via `next/font`; Pretendard (Korean) loads via a CDN `<link>` in the `[locale]/layout.tsx` `<head>`. `--font-sans` chains Pretendard → Inter → system.

### Provider Tree

```
ThemeProvider (next-themes)
  → NextIntlClientProvider
    → ErrorBoundary
      → LazyMotionProvider (Framer Motion domAnimation)
```

Defined in `src/app/[locale]/layout.tsx`.

### Key Conventions

- **Path alias**: `@/*` → `src/*`
- **Class utility**: `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge)
- **Section components** are `"use client"`; home sections use Framer Motion `m` with `whileInView` fade-ins. `SectionLabel` and `PageIntro` are plain server-compatible components.
- **No state management library** — local `useState` only
- **Site config**: `src/config/site.ts` is the single source for URL, author (name, alias, handles, email), social links (incl. `rss`), nav routes, SEO metadata
- **SEO is generated, not hand-written**: `src/app/sitemap.ts`, `src/app/robots.ts`, and the JSON-LD in `src/components/seo/json-ld.tsx` all derive from `siteConfig` — edit the config, not these files
- **Custom domain switch**: when `gnosis.kim` (or any custom domain) points at GitHub Pages, change the default of `siteConfig.url` (or set `NEXT_PUBLIC_BASE_URL`); sitemap, robots, canonical/alternate URLs and JSON-LD follow automatically. No `CNAME` file is needed with the Actions deploy.
- **Date sorting**: data with Korean date strings (e.g. `"2024. 03."`) is sorted via `parseDate()` in `src/lib/date-utils.ts`; posts use ISO `YYYY-MM-DD` and sort lexicographically.

### Content Editing Map

| What | File |
|------|------|
| Personal info, education | `src/data/profile.ts` |
| Work/research experience (first entry with `endDate: null` feeds the hero "now" line) | `src/data/experience.ts` |
| Career highlights, competencies (first entry feeds the hero "latest" line) | `src/data/career-summary.ts` |
| Career story narratives (`#section-<id>` anchors) | `src/data/career-detail.ts` |
| Featured research cards on the home (first = large card) | `src/data/featured.ts` |
| Hero system-map layers (blocks, captions, links) | `src/data/system-map.ts` |
| Projects (`featured: true` → home strip, `relatedPostIds` → "관련 글") | `src/data/projects.ts` |
| Blog posts (mirror of the Tistory RSS; add an entry per new post) | `src/data/posts.ts` |
| Publications (papers) | `src/data/publications.ts` |
| Certifications, awards | `src/data/credentials.ts` |
| Talks, community | `src/data/speaking.ts` |
| Site URL, author, nav, social, SEO | `src/config/site.ts` |
| UI labels (Korean) | `src/messages/ko.json` |
| UI labels (English) | `src/messages/en.json` |
| Colors, fonts, theme tokens, utilities | `src/app/globals.css` |

### Roadmap notes

Posts currently link out to Tistory. The planned next step is MDX posts under the same site (`/[locale]/blog/<slug>`), tags, and an RSS feed generated from `src/data/posts.ts`; `PostRow`, `PostList`, and the search index are written so that `url` can become an internal path without changing their shape.
