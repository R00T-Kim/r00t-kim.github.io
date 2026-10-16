/**
 * Featured research shown on the home page: the first entry renders as the
 * large card, the rest as secondary cards. `href` is appended to `/${locale}`
 * and usually points at a section of the career story page.
 */
export interface FeaturedStat {
  label: string;
  labelEn: string;
  value: string;
}

export interface FeaturedItem {
  id: string;
  kicker: string;
  kickerEn: string;
  title: string;
  titleEn: string;
  target: string;
  targetEn: string;
  work: string;
  workEn: string;
  result: string;
  resultEn: string;
  stats?: FeaturedStat[];
  tags: string[];
  href: string;
  external?: { label: string; labelEn: string; url: string };
  relatedPostId?: number;
}

export const featuredResearch: FeaturedItem[] = [
  {
    id: "pwn2own-hue",
    kicker: "Pwn2Own Ireland 2026 · Smart Home",
    kickerEn: "Pwn2Own Ireland 2026 · Smart Home",
    title: "Philips Hue Bridge Pro 익스플로잇 시연 성공",
    titleEn: "Successful exploit demonstration on Philips Hue Bridge Pro",
    target: "가정 내 조명과 연동 기기를 제어하는 스마트 홈 허브 (양산 기기)",
    targetEn: "A retail smart-home hub that controls lighting and connected devices",
    work:
      "디버깅 환경 구축 → 하드웨어 · 펌웨어 분석 → 취약점 5개를 연결한 익스플로잇 개발과 현장 시연 (Out of Bounds 소속)",
    workEn:
      "Built a debugging environment, analyzed hardware and firmware, then chained five vulnerabilities into a live on-site demonstration (with Out of Bounds)",
    result: "Win · $12,000 · Master of Pwn 2.5점",
    resultEn: "Win · $12,000 · 2.5 Master of Pwn points",
    stats: [
      { label: "취약점", labelEn: "Vulnerabilities", value: "5" },
      { label: "상금", labelEn: "Bounty", value: "$12,000" },
      { label: "Master of Pwn", labelEn: "Master of Pwn", value: "2.5" },
    ],
    tags: ["Hardware", "Firmware", "Exploit Development"],
    href: "/career#section-pwn2own-hue",
    external: {
      label: "ZDI 결과 발표",
      labelEn: "ZDI results",
      url: "https://www.thezdi.com/blog/2026/10/6/pwn2own-ireland-2026-day-one-results",
    },
  },
  {
    id: "iot-doorbell",
    kicker: "IoT 스마트 기기 · Team Brrester",
    kickerEn: "IoT smart device · Team Brrester",
    title: "스마트 도어벨 종합 분석으로 CVE 18건 발굴",
    titleEn: "18 CVEs from a comprehensive smart-doorbell analysis",
    target: "IoT 스마트 도어벨",
    targetEn: "An IoT smart doorbell",
    work: "펌웨어 추출과 리버스 엔지니어링, 하드웨어 인터페이스 분석, 취약점 보고와 분석 가이드 공개",
    workEn:
      "Firmware extraction and reverse engineering, hardware-interface analysis, vulnerability reporting and a public analysis guide",
    result: "CVE-2025-55619 ~ CVE-2025-56802",
    resultEn: "CVE-2025-55619 ~ CVE-2025-56802",
    tags: ["Embedded", "Reverse Engineering", "CVE"],
    href: "/career#section-iot-doorbell",
    external: {
      label: "분석 가이드",
      labelEn: "Analysis guide",
      url: "https://github.com/Brrester/IoT-Smart-Doorbell-Vulnerability-Analysis-Guide",
    },
    relatedPostId: 15,
  },
  {
    id: "mucamp2",
    kicker: "AI for Security · IEEE Access 2026",
    kickerEn: "AI for Security · IEEE Access 2026",
    title: "MuCamp2: 검증 기반 사이버 캠페인 변종 생성",
    titleEn: "MuCamp2: validated cyber-campaign variant generation",
    target: "LLM 기반 APT TTP 시퀀스 증강의 구조적 무결성",
    targetEn: "Structural integrity of LLM-based APT TTP sequence augmentation",
    work: "제1저자 · 제약 기반 생성과 AEP 기반 L1/L2/L3 검증 구조 설계, 재현 코드 공개",
    workEn:
      "First author · designed constrained generation with AEP-based L1/L2/L3 validation and released reproducibility code",
    result: "IEEE Access 게재 · tactic violation 0%",
    resultEn: "Published in IEEE Access · 0% tactic violation rate",
    tags: ["LLM", "Threat Intelligence", "MITRE ATT&CK"],
    href: "/career#section-mucamp2",
    external: {
      label: "논문",
      labelEn: "Paper",
      url: "https://ieeexplore.ieee.org/document/11552376",
    },
    relatedPostId: 24,
  },
];
