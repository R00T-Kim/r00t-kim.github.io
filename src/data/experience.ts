export interface Experience {
  company: string;
  companyEn: string;
  role: string;
  roleEn: string;
  team: string;
  teamEn: string;
  period: string;
  periodEn: string;
  startDate: string;
  endDate: string | null;
  description: string[];
  descriptionEn: string[];
  tags: string[];
}

export const experiences: Experience[] = [
  {
    company: "AUTOCRYPT",
    companyEn: "AUTOCRYPT",
    role: "Red Team 인턴",
    roleEn: "Red Team Intern",
    team: "자동차보안위협연구소",
    teamEn: "Vehicle Threat Research Lab",
    period: "2026.01 ~ 2026.02",
    periodEn: "Jan 2026 — Feb 2026",
    startDate: "2026-01",
    endDate: "2026-02",
    description: [
      "자동차 보안 위협 분석 및 모의해킹 수행",
      "차량 시스템 대상 Offensive Security 연구",
    ],
    descriptionEn: [
      "Automotive security threat analysis and penetration testing",
      "Offensive security research targeting vehicle systems",
    ],
    tags: ["Automotive Security", "Penetration Testing", "Red Team"],
  },
  {
    company: "CYAI Lab (세종대학교)",
    companyEn: "CYAI Lab (Sejong University)",
    role: "학부 연구생",
    roleEn: "Undergraduate Researcher",
    team: "사이버보안 AI 연구실",
    teamEn: "Cybersecurity AI Lab",
    period: "2025.04 ~ 현재",
    periodEn: "Apr 2025 — Present",
    startDate: "2025-04",
    endDate: null,
    description: [
      "LLM 및 자율 에이전트 기반 보안 자동화 연구 수행",
      "Agentic AI 기반 ExploitAgent 구조 설계 및 실험 파이프라인 구축",
      "한국인터넷정보학회 추계학술대회 논문 발표 (우수논문상 수상)",
      "정기 세미나 참여 및 APT 공격·방어 메커니즘 최신 동향 분석",
      "개인 연구 MuCAMP2: LLM 기반 APT 공격 시나리오 변종 생성 실험 수행",
    ],
    descriptionEn: [
      "Conducting research on AI-driven security automation focusing on LLM and autonomous agents",
      "Designed Agentic AI-based ExploitAgent architecture and experiment pipelines",
      "Paper presentation at KSII Autumn Conference (Best Paper Award)",
      "Participating in regular seminars analyzing recent APT attack and defense trends",
      "Personal research MuCAMP2: LLM-based APT attack scenario variant generation experiments",
    ],
    tags: ["AI for Security", "Agentic AI", "LLM", "Exploit Automation", "APT Analysis"],
  },
  {
    company: "화이트햇 스쿨 3기",
    companyEn: "Whitehat School 3rd Cohort",
    role: "교육생",
    roleEn: "Trainee",
    team: "보안 교육 프로그램",
    teamEn: "Security Training Program",
    period: "2025.03 ~ 2025.09",
    periodEn: "Mar 2025 — Sep 2025",
    startDate: "2025-03",
    endDate: "2025-09",
    description: [
      "Offensive Security 심화 교육 이수",
      "취약점 분석 및 익스플로잇 개발 실습",
    ],
    descriptionEn: [
      "Completed advanced Offensive Security training",
      "Hands-on vulnerability analysis and exploit development",
    ],
    tags: ["Offensive Security", "Training", "Exploit Development"],
  },
];
