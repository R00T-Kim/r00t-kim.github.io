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
    titleEn: "SCOUT - Agent-based Vulnerability Candidate Generation for IoT Firmware",
    period: "2026.01 ~ 현재",
    periodEn: "Jan 2026 — Present",
    goals: [
      "IoT 펌웨어 대상 취약점 후보 자동 생성 시스템 개발",
      "Agent 기반 자율 분석 파이프라인 구축",
    ],
    goalsEn: [
      "Develop automated vulnerability candidate generation system for IoT firmware",
      "Build agent-based autonomous analysis pipeline",
    ],
    contents: [
      "Agent 기반 IoT 펌웨어 취약점 후보 자동 생성 시스템 설계 및 개발",
      "바이너리 분석 자동화 파이프라인 구축",
      "Agentic AI를 활용한 취약점 탐지 로직 구현",
    ],
    contentsEn: [
      "Designed and developed agent-based IoT firmware vulnerability candidate auto-generation system",
      "Built binary analysis automation pipeline",
      "Implemented vulnerability detection logic using Agentic AI",
    ],
    results: [
      "프로젝트 리더로서 시스템 아키텍처 설계 및 팀 리딩",
      "진행 중",
    ],
    resultsEn: [
      "Led system architecture design and team as project lead",
      "In progress",
    ],
    tags: ["Python", "AI", "IoT", "Firmware Analysis", "Binary Analysis"],
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
      "Claude Code Agent Teams 기반 22개 전문 에이전트 오케스트레이션",
    ],
    goalsEn: [
      "Develop multi-agent AI system for autonomous CTF solving and bug bounty hunting",
      "Orchestrate 22 specialized agents based on Claude Code Agent Teams",
    ],
    contents: [
      "22개 전문 에이전트(reverser, exploiter, critic 등) 설계 및 구현",
      "순차적 파이프라인과 구조화된 핸드오프를 통한 에이전트 간 협업 체계 구축",
      "12개 MCP 서버 연동 및 40개 이상의 보안 도구 통합",
      "242K+ 라인의 보안 지식 문서 기반 의사결정 시스템 구현",
    ],
    contentsEn: [
      "Designed and implemented 22 specialized agents (reverser, exploiter, critic, etc.)",
      "Built inter-agent collaboration through sequential pipelines with structured handoffs",
      "Integrated 12 MCP servers and 40+ security tools",
      "Implemented decision-making system based on 242K+ lines of security knowledge docs",
    ],
    results: [
      "CTF 20문제 자동 풀이 달성",
      "30개 이상의 버그바운티 타겟 분석 수행",
    ],
    resultsEn: [
      "Achieved autonomous solving of 20 CTF challenges",
      "Analyzed 30+ bug bounty targets",
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
];
