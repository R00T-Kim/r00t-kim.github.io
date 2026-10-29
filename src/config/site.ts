// Switch to the custom domain (e.g. "https://gnosis.kim") here once its DNS
// points at GitHub Pages. sitemap/robots/JSON-LD/RSS all derive from this value.
const url = process.env.NEXT_PUBLIC_BASE_URL || "https://gnosis.kim";

export const siteConfig = {
  url,
  author: {
    name: { ko: "김근호", en: "KeunHo Kim" },
    alias: "gnosis",
    handles: ["gnosis", "rootk1m"],
    title: {
      ko: "Vulnerability Researcher",
      en: "Vulnerability Researcher",
    },
    email: "awqs1221@naver.com",
  },
  social: {
    github: "https://github.com/R00T-Kim",
    linkedin:
      "https://www.linkedin.com/in/%EA%B7%BC%ED%98%B8-%EA%B9%80-2abaa135a/",
    blog: "https://rootk1m.tistory.com/",
    // Generated from src/data/posts.ts by src/app/rss.xml/route.ts
    rss: `${url}/rss.xml`,
    x: "https://x.com/gn0sis__",
  },
  // Top-level routes. `href` is appended to `/${locale}`; `key` is the label
  // key under `nav` in src/messages/*.json.
  nav: [
    { key: "about_me", href: "/about_me" },
    { key: "blog", href: "/blog" },
    { key: "laboratory", href: "/laboratory" },
  ] as const,
  seo: {
    titleTemplate: "%s · Gnosis Kim",
    defaultTitle: "Gnosis Kim",
    description: "Gnosis is to be surprised at everything.",
    keywords: [
      "vulnerability researcher",
      "vulnerability research",
      "exploit development",
      "automated exploit generation",
      "automated post-exploitation",
      "AEG",
      "reverse engineering",
      "binary exploitation",
      "zero-day research",
      "agentic AI",
    ],
  },
  googleVerification: "",
  // GoatCounter site code (the "<code>" in https://<code>.goatcounter.com). Empty = no
  // visit counting at all; the script is only added once this is set.
  goatcounter: "gnosiskim",
};

export type NavKey = (typeof siteConfig.nav)[number]["key"];

/**
 * Shared Open Graph / Twitter card image: a 1200×630 terminal-style card
 * (public/og.png). Next.js replaces `openGraph`/`twitter` per route segment
 * instead of deep-merging, so every page that sets its own block re-attaches
 * this rather than inheriting it from the root layout.
 */
export const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: `${siteConfig.seo.defaultTitle} — ${siteConfig.seo.description}`,
} as const;
