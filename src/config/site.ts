export const siteConfig = {
  // Switch to the custom domain (e.g. "https://gnosis.kim") here once its DNS
  // points at GitHub Pages. sitemap/robots/JSON-LD all derive from this value.
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://gnosis.kim",
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
    rss: "https://rootk1m.tistory.com/rss",
  },
  // Top-level routes. `href` is appended to `/${locale}`; `key` is the label
  // key under `nav` in src/messages/*.json.
  nav: [
    { key: "about_me", href: "/about_me" },
    { key: "blog", href: "/blog" },
    { key: "laboratory", href: "/laboratory" },
  ] as const,
  seo: {
    titleTemplate: "%s | KeunHo Kim",
    defaultTitle: "KeunHo Kim | Vulnerability Researcher",
    description:
      "소프트웨어 / 펌웨어 / 하드웨어의 취약점과 익스플로잇 개발, 보안 연구 자동화를 연구하는 Vulnerability Researcher 김근호의 포트폴리오입니다.",
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
};

export type NavKey = (typeof siteConfig.nav)[number]["key"];
