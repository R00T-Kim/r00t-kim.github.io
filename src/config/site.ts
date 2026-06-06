export const siteConfig = {
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://r00t-kim.github.io",
  author: {
    name: { ko: "김근호", en: "Keunho Kim" },
    title: {
      ko: "Embedded Security Researcher",
      en: "Embedded Security Researcher",
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
    defaultTitle: "Keunho Kim | Embedded Security Researcher",
    description:
      "IoT와 Embedded 시스템을 중심으로 취약점 분석, 펌웨어 리버싱, 익스플로잇 재현, Automated Exploit Generation을 수행하는 보안 연구자 김근호의 포트폴리오입니다.",
    keywords: [
      "zero-day researcher",
      "automated exploit generation",
      "AEG",
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
