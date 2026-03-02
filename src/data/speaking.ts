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
