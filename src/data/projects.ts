export interface Project {
  title: string;
  titleEn: string;
  period: string;
  periodEn: string;
  goals: string[];
  goalsEn: string[];
  contents: string[];
  contentsEn: string[];
  results: string[];
  resultsEn: string[];
  tags: string[];
  url?: string;
}

export const projects: Project[] = [
  {
    title: "SCOUT - IoT 펌웨어 취약점 후보 자동 생성 시스템",
    titleEn: "SCOUT - Deterministic Firmware-to-Exploit Evidence Engine",
    period: "2026.01 ~ 현재",
    periodEn: "Jan 2026 — Present",
    goals: [
      "IoT 펌웨어 대상 결정론적 취약점 증거 체인 자동 생성 시스템 개발",
      "해시 앵커 기반 증거 추적이 가능한 42단계 분석 파이프라인 구축",
    ],
    goalsEn: [
      "Develop deterministic vulnerability evidence chain generation system for IoT firmware",
      "Build 42-stage analysis pipeline with hash-anchored evidence tracing",
    ],
    contents: [
      "펌웨어 바이너리 입력부터 검증된 익스플로잇 체인까지 42단계 자동화 파이프라인 설계 및 개발",
      "SHA-256 해시 앵커 기반 증거 체인 시스템 구현 (파일 경로, 바이트 오프셋, 해시, 근거 필수)",
      "CycloneDX 1.6 SBOM + VEX 생성 및 SARIF 2.1.0 리포팅 (GitHub Code Scanning 호환)",
      "2,239개 CVE 시그니처 기반 매칭 엔진 및 ELF 바이너리 하드닝 감사 구현",
      "AFL++ 퍼징, FirmAE/QEMU 에뮬레이션 기반 동적 검증 파이프라인 구축",
      "MCP 서버 연동으로 AI Agent 핸드오프 지원",
    ],
    contentsEn: [
      "Designed and developed 42-stage automated pipeline from firmware binary to verified exploit chains",
      "Implemented SHA-256 hash-anchored evidence chain system (file path, byte offset, hash, and rationale required)",
      "CycloneDX 1.6 SBOM + VEX generation and SARIF 2.1.0 reporting (GitHub Code Scanning compatible)",
      "Built CVE matching engine with 2,239 signatures and ELF binary hardening audits",
      "Constructed dynamic validation pipeline with AFL++ fuzzing and FirmAE/QEMU emulation",
      "MCP server integration for AI agent handoff support",
    ],
    results: [
      "프로젝트 리더로서 시스템 아키텍처 설계 및 팀 리딩",
      "FirmAE 데이터셋 기반 1,124개 펌웨어 이미지 대상 테스트 완료",
      "정밀도 0.90 이상, 재현율 0.60 이상 품질 게이트 달성",
      "Python 표준 라이브러리만으로 구현 (Zero pip dependencies)",
    ],
    resultsEn: [
      "Led system architecture design and team as project lead",
      "Tested against 1,124 firmware images from FirmAE dataset",
      "Achieved quality gates: precision ≥ 0.90, recall ≥ 0.60",
      "Implemented with Python standard library only (zero pip dependencies)",
    ],
    tags: ["Python", "Firmware Analysis", "Binary Analysis", "SARIF", "SBOM", "AFL++", "MCP"],
    url: "https://github.com/R00T-Kim/SCOUT",
  },
  {
    title: "IoT 스마트 도어벨 취약점 분석 (Team Brrester)",
    titleEn: "IoT Smart Doorbell Vulnerability Analysis (Team Brrester)",
    period: "2025.05 ~ 2025.07",
    periodEn: "May 2025 — Jul 2025",
    goals: [
      "IoT 스마트 도어벨 디바이스 대상 종합 보안 분석 수행",
      "실제 CVE 발굴을 통한 IoT 보안 취약점 연구",
    ],
    goalsEn: [
      "Conduct comprehensive security analysis on IoT smart doorbell devices",
      "IoT security vulnerability research through real CVE discovery",
    ],
    contents: [
      "펌웨어 추출 및 리버스 엔지니어링을 통한 취약점 분석",
      "하드웨어/소프트웨어 양면의 보안 취약점 도출",
      "취약점 분석 가이드 문서 작성 및 공개",
    ],
    contentsEn: [
      "Vulnerability analysis through firmware extraction and reverse engineering",
      "Identified security vulnerabilities across hardware and software layers",
      "Authored and published vulnerability analysis guide documentation",
    ],
    results: [
      "총 18건의 CVE 발굴 (CVE-2025-55619 ~ CVE-2025-56802)",
      "분석 가이드를 GitHub에 공개하여 IoT 보안 연구 커뮤니티에 기여",
    ],
    resultsEn: [
      "Discovered 18 CVEs (CVE-2025-55619 ~ CVE-2025-56802)",
      "Contributed to IoT security research community by publishing analysis guide on GitHub",
    ],
    tags: [
      "IoT Security",
      "Firmware Analysis",
      "Reverse Engineering",
      "CVE Research",
      "Hardware Hacking",
    ],
    url: "https://github.com/Brrester/IoT-Smart-Doorbell-Vulnerability-Analysis-Guide",
  },
  {
    title: "Terminator - 자율 보안 에이전트 시스템",
    titleEn: "Terminator - Autonomous Security Agent System",
    period: "2026.02 ~ 현재",
    periodEn: "Feb 2026 — Present",
    goals: [
      "CTF 문제 자동 풀이 및 버그바운티 헌팅을 위한 멀티 에이전트 AI 시스템 개발",
      "Claude Code Agent Teams 기반 25개 전문 에이전트 오케스트레이션",
    ],
    goalsEn: [
      "Develop multi-agent AI system for autonomous CTF solving and bug bounty hunting",
      "Orchestrate 25 specialized agents based on Claude Code Agent Teams",
    ],
    contents: [
      "25개 전문 에이전트(reverser, exploiter, critic, verifier 등) 4개 도메인별 설계 및 구현",
      "순차적 파이프라인과 구조화된 핸드오프를 통한 에이전트 간 협업 체계 구축",
      "14개 MCP 서버(gdb, radare2, Ghidra, Frida, Nuclei, CodeQL 등) 연동 및 40개 이상의 보안 도구 통합",
      "280,000건 이상의 보안 지식 문서(HackTricks, GTFOBins, ExploitDB 등) 기반 SQLite FTS5 검색 엔진 구현",
      "Verification-First 방법론: 로컬 3회 검증 후 실행, Critic 에이전트의 반환각 거부권 적용",
      "No-Exploit-No-Report 정책: 작동하는 PoC 없이는 리포트 제출 차단",
    ],
    contentsEn: [
      "Designed and implemented 25 specialized agents across 4 domains (CTF, Bug Bounty, Firmware, Specialized)",
      "Built inter-agent collaboration through sequential pipelines with structured handoffs",
      "Integrated 14 MCP servers (gdb, radare2, Ghidra, Frida, Nuclei, CodeQL, etc.) and 40+ security tools",
      "Implemented SQLite FTS5 search engine over 280,000+ security knowledge docs (HackTricks, GTFOBins, ExploitDB, etc.)",
      "Verification-first methodology: local 3x validation before execution, critic agent with anti-hallucination veto",
      "No-exploit-no-report policy: blocks report submission without working PoC",
    ],
    results: [
      "CTF 30문제 이상 자동 풀이 달성",
      "40건 이상의 버그바운티 리포트 제출",
    ],
    resultsEn: [
      "Achieved autonomous solving of 30+ CTF challenges",
      "Submitted 40+ bug bounty reports",
    ],
    tags: [
      "Claude Code",
      "Multi-Agent AI",
      "CTF",
      "Bug Bounty",
      "Python",
      "MCP",
    ],
    url: "https://github.com/R00T-Kim/Terminator",
  },
  {
    title: "Awesome Offensive MCP",
    titleEn: "Awesome Offensive MCP",
    period: "2026.01 ~ 현재",
    periodEn: "Jan 2026 — Present",
    goals: [
      "Offensive Security 워크플로우에 활용 가능한 MCP 서버 큐레이션",
      "Red Teaming 및 Pentesting을 위한 Agentic AI 도구 생태계 정리",
    ],
    goalsEn: [
      "Curate MCP servers useful for Offensive Security workflows",
      "Organize Agentic AI tool ecosystem for Red Teaming and Pentesting",
    ],
    contents: [
      "Red Team, Pentest, 취약점 연구에 활용 가능한 MCP 서버 수집 및 검증",
      "30+ Stars 이상 커뮤니티 검증 또는 직접 검증한 도구만 선별",
      "카테고리별 분류 및 사용 가이드 작성",
    ],
    contentsEn: [
      "Collected and verified MCP servers for Red Team, Pentest, and vulnerability research",
      "Curated only community-verified (30+ stars) or personally verified tools",
      "Categorized classification and usage guide documentation",
    ],
    results: [
      "GitHub Stars 18개 달성",
      "Offensive Security 커뮤니티에서 MCP 활용 레퍼런스로 공유",
    ],
    resultsEn: [
      "Achieved 18 GitHub stars",
      "Shared as MCP reference in Offensive Security community",
    ],
    tags: ["MCP", "Offensive Security", "Red Team", "Pentest", "Agentic AI"],
    url: "https://github.com/R00T-Kim/awesome-offensive-mcp",
  },
  {
    title: "AUTOGLITCH - 폴트 인젝션 자동화 프레임워크",
    titleEn: "AUTOGLITCH - Autonomous Fault Injection Framework",
    period: "2026.03 ~ 현재",
    periodEn: "Mar 2026 — Present",
    goals: [
      "임베디드 하드웨어 대상 폴트 인젝션 캠페인 자동화 프레임워크 개발",
      "베이지안 최적화 및 강화학습 기반 글리치 파라미터 자율 탐색 시스템 구축",
    ],
    goalsEn: [
      "Develop autonomous fault injection campaign framework for embedded hardware",
      "Build glitch parameter search system using Bayesian optimization and reinforcement learning",
    ],
    contents: [
      "폐쇄 루프(Closed-loop) 폴트 인젝션 파이프라인 설계: 파라미터 제안 → 하드웨어 실행 → 결과 분류 → 보상 신호 → 최적화 반복",
      "베이지안 최적화 및 Stable Baselines3 기반 강화학습 탐색 전략 구현",
      "ChipWhisperer USB 백엔드 및 타입드 JSONL 시리얼 프로토콜(autoglitch.v1) 구현",
      "Mock 환경 지원으로 하드웨어 없이 개발/CI 테스트 가능",
      "플러그인 매니페스트 기반 런타임 컴포넌트 교체 (observer, classifier, mapper)",
    ],
    contentsEn: [
      "Designed closed-loop fault injection pipeline: parameter suggestion → hardware execution → result classification → reward signal → optimizer iteration",
      "Implemented Bayesian optimization and reinforcement learning search strategies via Stable Baselines3",
      "Built ChipWhisperer USB backend and typed JSONL serial protocol (autoglitch.v1)",
      "Mock environment support for hardware-free development and CI testing",
      "Runtime-swappable components via plugin manifest (observer, classifier, mapper)",
    ],
    results: [
      "127개 테스트 통과 및 전체 품질 게이트 통과 (ruff, mypy, pytest)",
      "추후 실제 임베디드 디바이스(STM32F3 등) 대상 하드웨어 검증 연구 예정",
    ],
    resultsEn: [
      "127 tests passing with all quality gates green (ruff, mypy, pytest)",
      "Hardware validation on real embedded devices (STM32F3, etc.) planned for future research",
    ],
    tags: ["Python", "Fault Injection", "Hardware Security", "Bayesian Optimization", "Reinforcement Learning", "ChipWhisperer"],
    url: "https://github.com/R00T-Kim/autoglitch",
  },
];
