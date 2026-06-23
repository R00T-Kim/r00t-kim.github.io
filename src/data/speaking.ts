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
    slidesUrl: "/slides/20260516-thinking-not-solving.pdf",
    highlight: true,
  },
  {
    title: "SCOUT 프로젝트 발표",
    titleEn: "SCOUT Project Presentation",
    date: "2026.05.09",
    venue: "Incognito Conference",
    venueEn: "Incognito Conference",
    highlight: true,
  },
  {
    title: "SSG 안드로이드 해킹 입문",
    titleEn: "Introduction to Android Hacking for SSG",
    date: "2026.05.01",
    venue: "SSG 내부 세미나",
    venueEn: "SSG Internal Seminar",
    slidesUrl: "/slides/20260501-ssg-android-hacking-intro.pdf",
  },
  {
    title: "SSG 임베디드 해킹 입문",
    titleEn: "Introduction to Embedded Hacking for SSG",
    date: "2026.05.01",
    venue: "SSG 내부 세미나",
    venueEn: "SSG Internal Seminar",
    slidesUrl: "/slides/20260501-ssg-embedded-hacking-intro.pdf",
  },
];

export const communities: Community[] = [
  {
    role: "회장",
    roleEn: "President",
    organization: "SSG (Sejong Security Group)",
    organizationEn: "SSG (Sejong Security Group)",
    period: "2026.01 ~ 2026.06",
    periodEn: "Jan 2026 — Jun 2026",
    active: false,
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
