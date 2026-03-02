export const siteConfig = {
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://r00t-kim.github.io",
  author: {
    name: { ko: "김근호", en: "Keunho Kim" },
    title: { ko: "보안 연구원", en: "Security Researcher" },
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
    speaking: true,
    certified: true,
    projects: true,
    contact: true,
  },
  seo: {
    titleTemplate: "%s | Keunho Kim",
    defaultTitle: "Keunho Kim | Security Researcher",
    description:
      "Offensive Security 관점에서 IoT, Embedded, Automotive, Mobile 환경의 취약점 분석과 Exploit/Reversing을 연구하는 보안 연구원 김근호의 포트폴리오입니다.",
    keywords: [
      "security researcher",
      "offensive security",
      "IoT security",
      "vulnerability analysis",
      "exploit development",
      "reverse engineering",
    ],
  },
  googleVerification: "",
};

export type NavKey = (typeof siteConfig.nav)[number];
