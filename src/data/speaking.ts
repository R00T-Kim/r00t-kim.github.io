export interface Talk {
  title: string;
  titleEn: string;
  date: string;
  venue: string;
  venueEn: string;
  slidesUrl?: string;
  videoUrl?: string;
  highlight?: boolean;
}

export interface Community {
  role: string;
  roleEn: string;
  organization: string;
  organizationEn: string;
  period: string;
  periodEn: string;
  active: boolean;
}

export const talks: Talk[] = [
  {
    title: "너희는 전혀 생각하고 있지 않아",
    titleEn: "You Are Not Thinking At All",
    date: "2026.05.16",
    venue: "세종대학교 보안 동아리 연합 세미나 (SSG, S!, NSbit, 사이버펑크)",
    venueEn:
      "Sejong University Security Club Joint Seminar (SSG, S!, NSbit, Cyberpunk)",
    slidesUrl:
      "https://github.com/R00T-Kim/gnosis/blob/main/wiki/academic/presentation-thinking-not-solving.md",
    highlight: true,
  },
  {
    title: "SCOUT 프로젝트 발표",
    titleEn: "SCOUT Project Presentation",
    date: "2026.05.09",
    venue: "Incognito Conference",
    venueEn: "Incognito Conference",
    slidesUrl: "https://www.instagram.com/incognito.conference/",
    highlight: true,
  },
  {
    title: "SSG 안드로이드 해킹 입문",
    titleEn: "Introduction to Android Hacking for SSG",
    date: "2026.05.01",
    venue: "SSG 내부 세미나",
    venueEn: "SSG Internal Seminar",
    slidesUrl:
      "https://github.com/R00T-Kim/gnosis/blob/main/wiki/academic/ssg-android-hacking-intro-v2.md",
  },
  {
    title: "SSG 임베디드 해킹 입문",
    titleEn: "Introduction to Embedded Hacking for SSG",
    date: "2026.05.01",
    venue: "SSG 내부 세미나",
    venueEn: "SSG Internal Seminar",
    slidesUrl:
      "https://github.com/R00T-Kim/gnosis/blob/main/wiki/academic/ssg-embedded-hacking-intro-v4.md",
  },
  {
    title:
      "Agentic AI 기반 ExploitAgent의 구조 설계 및 자율 행위 생성 기술 (공저: 조상훈, 김근호, 최창희)",
    titleEn:
      "Architecture Design and Autonomous Behavior Generation of Agentic AI-based ExploitAgent (Co-authors: Sanghun Jo, Keunho Kim, Changhee Choi)",
    date: "2025.10",
    venue: "한국인터넷정보학회 추계학술대회 (국방정보기술연구회)",
    venueEn: "KSII Autumn Conference (Defense IT Research Society)",
    highlight: true,
  },
];

export const communities: Community[] = [
  {
    role: "회장",
    roleEn: "President",
    organization: "SSG (Sejong Security Group)",
    organizationEn: "SSG (Sejong Security Group)",
    period: "2026.01 ~ 현재",
    periodEn: "Jan 2026 — Present",
    active: true,
  },
  {
    role: "프로젝트부 부장",
    roleEn: "Projects Department Director",
    organization: "SSG (Sejong Security Group)",
    organizationEn: "SSG (Sejong Security Group)",
    period: "2025.09 ~ 2025.12",
    periodEn: "Sep 2025 — Dec 2025",
    active: false,
  },
  {
    role: "임베디드 취약점 분석 프로젝트 멘토",
    roleEn: "Embedded Vulnerability Analysis Project Mentor",
    organization: "SSG",
    organizationEn: "SSG",
    period: "2025.09 ~ 2026.01",
    periodEn: "Sep 2025 — Jan 2026",
    active: false,
  },
  {
    role: "시스템 해킹 강사 & 멘토",
    roleEn: "Systems Hacking Lecturer & Mentor",
    organization: "SSG",
    organizationEn: "SSG",
    period: "2025.03 ~ 2025.08",
    periodEn: "Mar 2025 — Aug 2025",
    active: false,
  },
  {
    role: "운영진 / 총무",
    roleEn: "Operations / Treasurer",
    organization: "SSG",
    organizationEn: "SSG",
    period: "2024.09 ~ 2025.08",
    periodEn: "Sep 2024 — Aug 2025",
    active: false,
  },
];
