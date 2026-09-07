export interface CareerHighlight {
  title: string;
  titleEn: string;
  items: string[];
  itemsEn: string[];
}

export const careerOverview = {
  ko: "하드웨어 보안, 네트워크 취약점 연구, Automated Exploit Generation, Automated Post-Exploitation을 함께 수행합니다. 실제 장비와 서비스에서 취약점을 찾고 공격 가능성을 검증하며, 발견부터 익스플로잇과 초기 접근 이후의 영향 검증까지 이어지는 과정을 자동화하는 방법을 연구하고 있습니다.",
  en: "I work across hardware security, network vulnerability research, Automated Exploit Generation, and Automated Post-Exploitation. My research discovers and validates vulnerabilities on real devices and services, then studies how to automate the path from initial findings to exploitation and post-exploitation impact validation.",
};

export const careerHighlights: CareerHighlight[] = [
  {
    title: "하드웨어 보안 연구",
    titleEn: "Hardware Security Research",
    items: [
      "IoT 스마트 도어벨 대상 종합 보안 분석 수행 및 18건 CVE 발굴",
      "펌웨어와 UART·JTAG 등 하드웨어 인터페이스를 함께 분석",
      "AUTOGLITCH를 통한 폴트 인젝션 실험 자동화 연구",
    ],
    itemsEn: [
      "Comprehensive security analysis of an IoT smart doorbell, contributing to 18 CVE discoveries",
      "Combined firmware analysis with hardware interfaces including UART and JTAG",
      "Research on automating fault-injection experiments through AUTOGLITCH",
    ],
  },
  {
    title: "네트워크 취약점 연구",
    titleEn: "Network Vulnerability Research",
    items: [
      "네트워크 장비와 서비스의 공격 표면 분석 및 취약점 검증",
      "실제 시스템에서 취약점 재현과 익스플로잇 가능성 확인",
      "차량 네트워크의 CAN Bus·UDS 프로토콜 분석 경험",
    ],
    itemsEn: [
      "Attack-surface analysis and vulnerability validation across network devices and services",
      "Vulnerability reproduction and exploitability validation on real systems",
      "Hands-on analysis of CAN bus and UDS protocols in automotive networks",
    ],
  },
  {
    title: "Automated Exploit Generation",
    titleEn: "Automated Exploit Generation",
    items: [
      "Agentic AI 기반 ExploitAgent 구조 및 자율 행위 생성 기술 연구",
      "SCOUT로 펌웨어 증거에서 익스플로잇 가능성 체인을 재구성",
      "취약점 분석 결과를 재현 가능한 익스플로잇 검증으로 연결",
    ],
    itemsEn: [
      "Researched Agentic AI-based ExploitAgent architecture and autonomous behavior generation",
      "Used SCOUT to reconstruct exploitability chains from firmware evidence",
      "Connected vulnerability findings to reproducible exploit validation",
    ],
  },
  {
    title: "연구 성과와 논문",
    titleEn: "Research Outcomes & Publications",
    items: [
      "IEEE Access 논문 2편 게재 및 제1저자·공동저자 참여",
      "한국인터넷정보학회 학술대회 우수논문상 2회 수상",
      "스마트 기기 취약점 분석을 통해 18건의 CVE 발굴에 기여",
    ],
    itemsEn: [
      "Published two IEEE Access papers as first author and co-author",
      "Received two Best Paper Awards at KSII conferences",
      "Contributed to 18 CVE discoveries through smart-device vulnerability research",
    ],
  },
  {
    title: "Automated Post-Exploitation",
    titleEn: "Automated Post-Exploitation",
    items: [
      "초기 접근 이후 권한 확대·내부 이동·영향 검증 과정의 자동화 연구",
      "전문 에이전트가 분석 결과를 이어받아 후속 행위를 수행하는 구조 설계",
      "실제 실행 결과와 검증 근거를 우선하는 자동화 방식 적용",
    ],
    itemsEn: [
      "Research on automating privilege escalation, lateral movement, and impact validation after initial access",
      "Designed workflows where specialized agents continue follow-up actions from prior analysis results",
      "Applied automation methods that prioritize real execution results and validation evidence",
    ],
  },
];

export const selfDevelopedTools = [
  {
    ko: "SCOUT - AEG-first 펌웨어-to-익스플로잇 증거 엔진",
    en: "SCOUT - AEG-First Firmware-to-Exploit Evidence Engine",
  },
  {
    ko: "Terminator - 자율 보안 에이전트 시스템",
    en: "Terminator - Autonomous Security Agent System",
  },
];

export const coreCompetencies = [
  {
    ko: "하드웨어 보안 연구",
    en: "Hardware security research",
  },
  {
    ko: "네트워크 취약점 연구",
    en: "Network vulnerability research",
  },
  {
    ko: "Automated Exploit Generation",
    en: "Automated Exploit Generation",
  },
  {
    ko: "Automated Post-Exploitation",
    en: "Automated Post-Exploitation",
  },
];
