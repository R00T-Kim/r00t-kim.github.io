# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16 App Router portfolio site statically exported for GitHub Pages. Routes live in `src/app/`, with localized pages under `src/app/[locale]/` (`/[locale]` and `/[locale]/career`). Reusable UI is split across `src/components/layout/`, `src/components/sections/`, `src/components/ui/`, and `src/components/seo/`. Portfolio content belongs in `src/data/`; global metadata, social links, SEO, and navigation live in `src/config/site.ts`. i18n setup is in `src/i18n/`, while UI strings are in `src/messages/ko.json` and `src/messages/en.json`. Static assets are in `public/`; `.next/` and `out/` are generated and should not be committed.

## Build, Test, and Development Commands

- `npm ci` — install dependencies from `package-lock.json` for reproducible local and CI builds.
- `npm run dev` — start the local Next.js development server.
- `npm run lint` — run ESLint with Next.js core-web-vitals and TypeScript rules.
- `npm run build` — generate the static export in `out/`; run this before submitting changes.

## Coding Style & Naming Conventions

Use TypeScript strict mode and React function components. Follow the existing two-space indentation, double quotes, named exports, and kebab-case filenames such as `career-highlights.tsx`. Prefer the `@/*` path alias for imports from `src/`. Build Tailwind class strings directly in JSX and use `cn()` from `src/lib/utils.ts` when conditionally merging classes. Tailwind v4 tokens are defined in `src/app/globals.css`; do not add a `tailwind.config.js` unless the project intentionally migrates.

## Testing Guidelines

No dedicated test framework is configured. Treat `npm run lint` and `npm run build` as the required validation gate. For content changes, verify both Korean and English data/labels render correctly. If adding tests later, keep them near the feature or under a clear `tests/` directory and document the new command in `package.json`.

## Commit & Pull Request Guidelines

Recent history uses concise imperative subjects, sometimes with Conventional Commit scopes (for example, `feat(projects): update SCOUT metrics...`). Keep commits focused and explain why in the body when context is not obvious. AI-authored commits must include `Co-Authored-By: OpenAI Codex <noreply@openai.com>`. Pull requests should summarize the change, list validation (`npm run lint`, `npm run build`), link related issues, and include screenshots or recordings for visual/UI updates.

## Security & Configuration Tips

Keep secrets out of git. `.env*` files are ignored except `.env.example`; update that example when configuration changes. This site is a static export, so avoid server-only APIs or runtime assumptions that will not work on GitHub Pages.
