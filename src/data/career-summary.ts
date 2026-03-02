export interface CareerHighlight {
  title: string;
  titleEn: string;
  items: string[];
  itemsEn: string[];
}

export const careerOverview = {
  ko: "Offensive Security 관점에서 IoT, Embedded, Automotive, Mobile 등 다양한 환경의 취약점 분석과 Exploit/Reversing을 연구합니다. IoT 디바이스 대상 18건의 CVE를 발굴했으며, Agentic AI를 활용한 취약점 분석 자동화 연구를 수행하고 있습니다.",
  en: "I research vulnerability analysis and exploit/reversing across diverse environments including IoT, Embedded, Automotive, and Mobile from an Offensive Security perspective. Discovered 18 CVEs in IoT devices and currently researching vulnerability analysis automation using Agentic AI.",
};

export const careerHighlights: CareerHighlight[] = [
  {
    title: "IoT/임베디드 보안 연구",
    titleEn: "IoT/Embedded Security Research",
    items: [
      "IoT 스마트 도어벨 대상 종합 보안 분석 수행 및 18건 CVE 발굴",
      "펌웨어 추출, 리버스 엔지니어링을 통한 취약점 분석 방법론 확립",
      "분석 가이드 공개를 통한 IoT 보안 연구 커뮤니티 기여",
    ],
    itemsEn: [
      "Comprehensive security analysis of IoT smart doorbell — discovered 18 CVEs",
      "Established vulnerability analysis methodology through firmware extraction and reverse engineering",
      "Contributed to IoT security research community by publishing analysis guides",
    ],
  },
  {
    title: "AI 기반 보안 연구",
    titleEn: "AI-Powered Security Research",
    items: [
      "Agentic AI 기반 ExploitAgent 구조 설계 및 자율 행위 생성 기술 연구",
      "SCOUT: Agent 기반 IoT 펌웨어 취약점 후보 자동 생성 시스템 개발",
      "한국인터넷정보학회 추계학술대회 우수논문상 수상",
    ],
    itemsEn: [
      "Agentic AI-based ExploitAgent architecture design and autonomous behavior generation research",
      "SCOUT: Agent-based IoT firmware vulnerability candidate auto-generation system development",
      "Best Paper Award at KSII Autumn Conference",
    ],
  },
  {
    title: "자동차 보안",
    titleEn: "Automotive Security",
    items: [
      "AUTOCRYPT 자동차보안위협연구소 Red Team 인턴 활동",
      "AutoHack 2025 자동차 해킹·방어 경진대회 COSS 협의회 의장상 수상",
      "차량 시스템 대상 Offensive Security 연구 수행",
    ],
    itemsEn: [
      "Red Team intern at AUTOCRYPT Vehicle Threat Research Lab",
      "Won COSS Council Chair Award at AutoHack 2025 automotive hacking competition",
      "Conducted offensive security research targeting vehicle systems",
    ],
  },
  {
    title: "보안 커뮤니티 리더십",
    titleEn: "Security Community Leadership",
    items: [
      "SSG (Sejong Security Group) 회장 역임",
      "시스템 해킹 강의 및 임베디드 취약점 분석 프로젝트 멘토링",
      "동아리 운영진/총무로서 조직 관리 및 활동 기획",
    ],
    itemsEn: [
      "President of SSG, Sejong University security club",
      "Systems hacking lecturer and embedded vulnerability analysis project mentor",
      "Organization management and activity planning as operations/treasurer",
    ],
  },
];

export const selfDevelopedTools = [
  {
    ko: "SCOUT - IoT 펌웨어 취약점 후보 자동 생성 시스템",
    en: "SCOUT - IoT Firmware Vulnerability Candidate Auto-Generation System",
  },
];

export const coreCompetencies = [
  {
    ko: "IoT/임베디드 디바이스 취약점 분석 및 CVE 발굴",
    en: "IoT/Embedded device vulnerability analysis and CVE discovery",
  },
  {
    ko: "바이너리 익스플로잇 및 리버스 엔지니어링",
    en: "Binary exploitation and reverse engineering",
  },
  {
    ko: "Agentic AI 기반 보안 분석 자동화 연구",
    en: "Agentic AI-based security analysis automation research",
  },
  {
    ko: "자동차 보안 위협 분석 및 모의해킹",
    en: "Automotive security threat analysis and penetration testing",
  },
];
