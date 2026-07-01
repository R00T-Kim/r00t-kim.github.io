# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio site for a security researcher. Built with Next.js 16 App Router + React 19, statically exported to GitHub Pages at `https://r00t-kim.github.io`.

Next 15+ convention: page/layout `params` is a `Promise` — always `await params` before reading `locale`.

## Commands

```bash
npm run dev      # Local dev server
npm run build    # Static export to ./out/
npm run lint     # ESLint
```

No test suite is configured.

## Architecture

### Static Export

`output: "export"` in `next.config.ts` — no server-side runtime, no API routes, images unoptimized. All pages pre-rendered at build time via `generateStaticParams`. The `./out/` directory is deployed to GitHub Pages via GitHub Actions.

**No `middleware.ts`** (incompatible with `output: export`). Locale handling is therefore explicit in each page: every page under `[locale]/` must export `generateStaticParams()` returning the locales and call `setRequestLocale(locale)` at the top of the component. The `/ → /ko` redirect lives in `src/app/page.tsx` (`redirect("/ko")`); the root `src/app/layout.tsx` only sets metadata and passes children through — the real `<html>`/providers shell is `src/app/[locale]/layout.tsx`.

### Routing

```
/ → redirect to /ko
/[locale]         → main portfolio page (all sections)
/[locale]/career  → career story detail page
```

Locales: `ko` (default), `en`. Configured in `src/i18n/routing.ts`.

### Bilingual Content Pattern

Two separate systems for translations:

- **Data content** (`src/data/*.ts`): Every object carries sibling fields like `title` / `titleEn`. Components check `locale === "ko"` and select the appropriate field directly.
- **UI labels** (`src/messages/{ko,en}.json`): Navigation, section headings, button text — accessed via next-intl's `useTranslations()`.

### Styling

Tailwind CSS v4 via PostCSS plugin — **no `tailwind.config.js`**. Theme tokens (colors, fonts, spacing) defined in `src/app/globals.css` using `@theme { }` block with CSS custom properties. Dark mode via `.dark` class (next-themes, default: dark). Accent color: `--color-accent` (emerald `#10b981`).

- **Section background alternation**: sections on the main page strictly alternate `bg-section-alt` and `bg-background` top to bottom. When adding or reordering a section in `[locale]/page.tsx`, re-check that the alternation still holds.
- **Section anchors**: each `<section>` carries an `id` (e.g. `about`, `experience`) that header nav anchors and the `#`-hash scroll target rely on — keep it in sync with the nav keys in `src/config/site.ts`.
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
- **All section components** are `"use client"` with Framer Motion `whileInView` scroll animations
- **No state management library** — local `useState` only
- **Site config**: `src/config/site.ts` is the single source for URL, author info, social links, nav keys, SEO metadata
- **SEO is generated, not hand-written**: `src/app/sitemap.ts`, `src/app/robots.ts`, and the JSON-LD in `src/components/seo/json-ld.tsx` (`JsonLd`, `CareerJsonLd`) all derive from `siteConfig` — edit the config, not these files
- **Date sorting**: data with Korean date strings (e.g. `"2024. 03."`) is sorted via `parseDate()` in `src/lib/date-utils.ts`, which maps them to `year*100 + month`

### Content Editing Map

| What | File |
|------|------|
| Personal info, education | `src/data/profile.ts` |
| Work/research experience | `src/data/experience.ts` |
| Career highlights, competencies | `src/data/career-summary.ts` |
| Career story narratives | `src/data/career-detail.ts` |
| Projects | `src/data/projects.ts` |
| Publications (papers) | `src/data/publications.ts` |
| Certifications, awards | `src/data/credentials.ts` |
| Talks, community | `src/data/speaking.ts` |
| Site URL, author, nav, SEO | `src/config/site.ts` |
| UI labels (Korean) | `src/messages/ko.json` |
| UI labels (English) | `src/messages/en.json` |
| Colors, fonts, theme tokens | `src/app/globals.css` |
