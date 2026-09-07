export interface CareerHighlight {
  title: string;
  titleEn: string;
  items: string[];
  itemsEn: string[];
}

export const careerOverview = {
  ko: "하드웨어 보안, 네트워크 취약점, Automated Exploit Generation, Automated Post-Exploitation을 함께 연구합니다. 실제 장비와 서비스에서 취약점을 찾고 공격 가능성을 검증합니다. 취약점 발견부터 익스플로잇 생성, 초기 접근 이후의 후속 공격까지 자동화하는 방법도 연구합니다.",
  en: "I research hardware security, network vulnerabilities, Automated Exploit Generation, and Automated Post-Exploitation. On real devices and services, I discover vulnerabilities and validate exploitability. I also study how to automate exploit generation and follow-up attacks after initial access.",
};

export const careerHighlights: CareerHighlight[] = [
  {
    title: "하드웨어 보안 연구",
    titleEn: "Hardware Security Research",
    items: [
      "IoT 스마트 도어벨을 종합 분석해 18건의 CVE 발굴",
      "펌웨어와 UART·JTAG 등 하드웨어 인터페이스를 함께 분석",
      "AUTOGLITCH를 이용한 폴트 인젝션 실험 자동화 연구",
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
      "네트워크 장비와 서비스의 공격 표면을 분석하고 취약점을 검증",
      "실제 시스템에서 취약점을 재현하고 익스플로잇 가능성을 확인",
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
      "Agentic AI 기반 ExploitAgent 구조와 자율 행위 생성 기술 연구",
      "SCOUT로 펌웨어 증거를 분석해 익스플로잇까지 이어지는 근거를 재구성",
      "분석한 취약점을 재현 가능한 익스플로잇으로 검증",
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
      "제1저자와 공동저자로 참여한 논문 2편을 IEEE Access에 게재",
      "한국인터넷정보학회 학술대회 우수논문상 2회 수상",
      "스마트 기기 취약점을 분석해 18건의 CVE 발굴에 기여",
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
      "초기 접근 이후의 권한 확대·내부 이동 등 후속 공격 자동화 연구",
      "전문 에이전트가 이전 공격 결과를 이어받아 다음 단계를 선택하도록 설계",
      "보안 도구를 연동해 선택한 공격 단계를 실행",
    ],
    itemsEn: [
      "Research on automating post-exploitation actions after initial access, including privilege escalation and lateral movement",
      "Designed workflows where specialized agents use prior attack results to select the next step",
      "Integrated security tools to execute the selected attack steps",
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
