export interface ProjectLink {
  label: string;
  labelEn: string;
  url: string;
}

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
  links?: ProjectLink[];
}

export const projects: Project[] = [
  {
    title: "SCOUT - AEG-first 펌웨어-to-익스플로잇 증거 엔진",
    titleEn: "SCOUT - AEG-First Firmware-to-Exploit Evidence Engine",
    period: "2026.01 ~ 현재",
    periodEn: "Jan 2026 — Present",
    goals: [
      "IoT 펌웨어 증거에서 익스플로잇 가능성 체인을 재구성하는 AEG-first 분석 플랫폼 개발",
      "ELF 바이너리와 쉘 스크립트를 함께 감사하는 하이브리드 증거 파이프라인 구축",
    ],
    goalsEn: [
      "Develop an AEG-first platform that reconstructs exploitability chains from IoT firmware evidence",
      "Build a hybrid evidence pipeline for auditing both ELF binaries and shell scripts",
    ],
    contents: [
      "해시 앵커 기반 증거 계보로 파일 경로, 바이트 오프셋, SHA-256, stage 산출물을 추적",
      "Hybrid Analysis Engine(v3)로 ELF 바이너리 분석과 쉘 스크립트 휴리스틱 감사를 통합",
      "CycloneDX 1.6 SBOM + VEX 생성 및 SARIF 2.1.0 리포팅 (GitHub Code Scanning 호환)",
      "2,528개 로컬 CVE DB/NVD 기반 매칭과 1,300+ 쉘 스크립트 감사 커버리지 확보",
      "Exploit Pattern RAG, metadata-only PoC-in-GitHub importer, NVD/vuln-list enrichment, human-reviewed pattern-card promotion 설계",
      "AutoPoC, poc_validation, verified_chain, FP/FPR gate를 묶은 AEG E2E 검증 경로 구축",
    ],
    contentsEn: [
      "Trace file paths, byte offsets, SHA-256 hashes, and stage artifacts through hash-anchored evidence lineage",
      "Integrated ELF binary analysis and shell-script heuristic auditing through the v3 Hybrid Analysis Engine",
      "CycloneDX 1.6 SBOM + VEX generation and SARIF 2.1.0 reporting (GitHub Code Scanning compatible)",
      "Expanded coverage to 2,528 local CVE/NVD entries and 1,300+ shell scripts",
      "Designed Exploit Pattern RAG, a metadata-only PoC-in-GitHub importer, NVD/vuln-list enrichment, and human-reviewed pattern-card promotion",
      "Built the AEG E2E validation path across AutoPoC, poc_validation, verified_chain, and FP/FPR gates",
    ],
    results: [
      "프로젝트 리더로서 시스템 아키텍처 설계 및 팀 리딩",
      "2026년 5월 9일 Incognito Conference 발표 이후 v3.0.0-rc1 Hybrid Analysis Engine 프리릴리즈까지 확장",
      "FirmAE 데이터셋 기반 1,123개 펌웨어 이미지 대상 검증 (성공률 98.8%, 1110/1123)",
      "TP-Link ER605 검증에서 1,334개 쉘 스크립트 처리 및 TOP 20 script finding 수동 검토",
      "LLM Tribunal 기반 오탐 감소율 99.3% 달성 (Tier 2 carry-over baseline)",
      "Netgear R7000 CVE-2017-5521 real vulnerable/patched pair에서 vulnerable pass와 patched fail-closed 증거 기록",
      "Python 표준 라이브러리만으로 구현 (Zero pip dependencies)",
    ],
    resultsEn: [
      "Led system architecture design and team as project lead",
      "Presented at Incognito Conference on May 9, 2026, then extended the project to the v3.0.0-rc1 Hybrid Analysis Engine pre-release",
      "Validated against 1,123 firmware images from FirmAE dataset (98.8% success rate, 1110/1123)",
      "Processed 1,334 shell scripts in TP-Link ER605 validation and manually reviewed the top 20 script findings",
      "Achieved 99.3% LLM Tribunal-based false-positive reduction (Tier 2 carry-over baseline)",
      "Recorded vulnerable-pass and patched fail-closed evidence on a real Netgear R7000 CVE-2017-5521 vulnerable/patched pair",
      "Implemented with Python standard library only (zero pip dependencies)",
    ],
    tags: ["Python", "Firmware Analysis", "AEG", "Exploit Pattern RAG", "SARIF", "SBOM", "MCP"],
    url: "https://github.com/R00T-Kim/SCOUT",
  },
  {
    title: "MuCamp2 - 검증 기반 사이버 캠페인 변종 생성",
    titleEn: "MuCamp2 - Validated Cyber Campaign Variant Generation",
    period: "2026.04 ~ 2026.06",
    periodEn: "Apr 2026 — Jun 2026",
    goals: [
      "LLM 기반 APT TTP 시퀀스 증강에서 구조적 무결성과 검증 가능성을 확보",
      "MITRE ATT&CK 및 AEP 기반 제약으로 공격 캠페인 변종 생성 품질 평가",
    ],
    goalsEn: [
      "Preserve structural integrity and verifiability in LLM-based APT TTP sequence augmentation",
      "Evaluate cyber campaign variant quality with MITRE ATT&CK and AEP-based constraints",
    ],
    contents: [
      "LLM을 신뢰 경계 밖에 두고, 동일 tactic 후보 풀과 코드 검증으로 변종 생성을 제한",
      "AEP 기반 L1/L2/L3 의미 검증으로 Lazarus·MenuPass 캠페인 변종을 선별",
      "논문 산출물과 재현 코드를 IEEE Access 및 GitHub에 공개",
    ],
    contentsEn: [
      "Kept LLMs outside the trust boundary, constraining generation with same-tactic candidate pools and code-level checks",
      "Filtered Lazarus and MenuPass campaign variants through AEP-based L1/L2/L3 semantic validation",
      "Published the paper artifact and reproducibility code through IEEE Access and GitHub",
    ],
    results: [
      "IEEE Access 2026 게재: Generating Validated Cyber Campaign Variants via Constrained LLMs for Group Attribution",
      "tactic violation rate 0% 및 L3 pass rate 개선(Lazarus +5.5pp, MenuPass +3.0pp) 보고",
      "Apache-2.0 라이선스의 공개 저장소로 데이터·스크립트·GUI 재현 환경 제공",
    ],
    resultsEn: [
      "Published in IEEE Access 2026: Generating Validated Cyber Campaign Variants via Constrained LLMs for Group Attribution",
      "Reported 0% tactic violation rate and L3 pass-rate gains (Lazarus +5.5 pp, MenuPass +3.0 pp)",
      "Released data, scripts, and GUI reproduction environment in a public Apache-2.0 repository",
    ],
    tags: ["LLM", "Cyber Threat Intelligence", "APT Analysis", "MITRE ATT&CK", "AEP", "IEEE Access"],
    links: [
      {
        label: "논문",
        labelEn: "Paper",
        url: "https://ieeexplore.ieee.org/document/11552376",
      },
      {
        label: "코드",
        labelEn: "Code",
        url: "https://github.com/cyailab/MuCamp2",
      },
    ],
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
