export interface CareerHighlight {
  title: string;
  titleEn: string;
  items: string[];
  itemsEn: string[];
}

export const careerOverview = {
  ko: "IoT와 Embedded 시스템을 중심으로 취약점 분석, 펌웨어 리버싱, 익스플로잇 재현, 공격 가능성 검증을 수행합니다. 스마트 기기 취약점 분석으로 다수의 CVE 발굴에 기여했으며, Firmware-to-Exploit Pipeline과 Automated Exploit Generation을 통해 분석 결과를 재현 가능한 PoC와 exploit evidence로 연결하는 연구를 수행하고 있습니다.",
  en: "I perform vulnerability analysis, firmware reversing, exploit reproduction, and exploitability validation across IoT and embedded systems. I contributed to discovering multiple CVEs through smart-device vulnerability research, and work on Firmware-to-Exploit pipelines and Automated Exploit Generation that connect findings to reproducible PoCs and exploit evidence.",
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
    title: "Automated Exploit Generation 연구",
    titleEn: "Automated Exploit Generation Research",
    items: [
      "Agentic AI 기반 ExploitAgent 구조 설계 및 자율 행위 생성 기술 연구",
      "SCOUT: ELF/쉘 스크립트 증거에서 익스플로잇 가능성을 재구성하는 AEG-first Hybrid Engine 개발",
      "한국인터넷정보학회 추계학술대회 우수논문상 수상",
    ],
    itemsEn: [
      "Agentic AI-based ExploitAgent architecture design and autonomous behavior generation research",
      "SCOUT: AEG-first Hybrid Engine that reconstructs exploitability from ELF and shell-script firmware evidence",
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
    ko: "SCOUT - AEG-first 펌웨어-to-익스플로잇 증거 엔진",
    en: "SCOUT - AEG-First Firmware-to-Exploit Evidence Engine",
  },
];

export const coreCompetencies = [
  {
    ko: "Zero-Day 취약점 분석 및 CVE 발굴",
    en: "Zero-day vulnerability analysis and CVE discovery",
  },
  {
    ko: "바이너리 익스플로잇 및 리버스 엔지니어링",
    en: "Binary exploitation and reverse engineering",
  },
  {
    ko: "Agentic AI 기반 Automated Exploit Generation 연구",
    en: "Agentic AI-based Automated Exploit Generation research",
  },
  {
    ko: "자동차 보안 위협 분석 및 모의해킹",
    en: "Automotive security threat analysis and penetration testing",
  },
];
