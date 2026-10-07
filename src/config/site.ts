export const siteConfig = {
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://r00t-kim.github.io",
  author: {
    name: { ko: "김근호", en: "Keunho Kim" },
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
  },
  nav: [
    "about",
    "experience",
    "career-highlights",
    "publications",
    "speaking",
    "certified",
    "projects",
    "contact",
  ] as const,
  sections: {
    hero: true,
    about: true,
    experience: true,
    careerHighlights: true,
    publications: true,
    speaking: true,
    certified: true,
    projects: true,
    contact: true,
  },
  seo: {
    titleTemplate: "%s | Keunho Kim",
    defaultTitle: "Keunho Kim | Vulnerability Researcher",
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

export type NavKey = (typeof siteConfig.nav)[number];
