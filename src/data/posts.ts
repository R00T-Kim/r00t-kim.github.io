/**
 * Blog posts shown on the home page and /blog.
 *
 * Bodies are Markdown files in content/posts/<slug>.md (imported from the
 * Tistory RSS feed, images under public/blog/<slug>/). To add a post: write
 * the Markdown file, then add an entry here with a unique slug.
 *
 * `type` follows the three post kinds of the hub: analysis (long, complete
 * write-ups), note (one experiment or problem), retrospective (how I work).
 */
export type PostType = "analysis" | "note" | "retrospective";

export interface Post {
  /** Tistory post number; used as a stable id and for related-post links. */
  id: number;
  /** URL slug; the body lives in content/posts/<slug>.md and renders at /[locale]/blog/<slug>. */
  slug: string;
  title: string;
  /** English title shown in the EN locale. Falls back to `title` if absent. */
  titleEn?: string;
  summary: string;
  /** Optional English summary; falls back to `summary`. */
  summaryEn?: string;
  /** ISO date (YYYY-MM-DD) */
  date: string;
  /** Original post on Tistory. */
  url: string;
  type: PostType;
  tags: string[];
  series?: string;
  /** Language the post is written in. */
  lang: "ko" | "en";
}

export const posts: Post[] = [
  {
    id: 24,
    slug: "mucamp2-first-author-notes",
    title:
      "[1저자 해설] MuCamp2 — LLM이 만든 TTP Variant의 ‘품질’을 어떻게 판단할 것인가",
    titleEn:
      "[First-author notes] MuCamp2 — How to judge the quality of LLM-generated TTP variants",
    summary:
      "Camp2Vec에서 MuCamp, MuCamp2까지 이어지는 흐름과, LLM이 생성한 TTP 시퀀스 변종의 품질을 AEP 검증으로 판단하는 기준을 1저자 관점에서 풀어씁니다.",
    summaryEn:
      "A first-author walkthrough of the path from Camp2Vec to MuCamp2 and how AEP-based validation judges the quality of LLM-generated TTP sequence variants.",
    date: "2026-06-19",
    url: "https://rootk1m.tistory.com/24",
    type: "analysis",
    tags: ["AI for Security", "Threat Intelligence"],
    lang: "ko",
  },
  {
    id: 23,
    slug: "answers-externalized-standards-remain",
    title: "답은 외부화되고, 기준은 남는다",
    titleEn: "Answers get externalized; the standard remains",
    summary:
      "AI에게 글을 비판적으로 읽히는 과정에서, 답이 외부화된 시대에 사람에게 남는 것은 판단의 기준이라는 생각을 정리합니다.",
    summaryEn:
      "When answers are externalized to AI, what remains with people is the standard of judgment. Notes from having AI critique my own writing.",
    date: "2026-06-12",
    url: "https://rootk1m.tistory.com/23",
    type: "retrospective",
    tags: ["Essay", "AI"],
    lang: "ko",
  },
  {
    id: 22,
    slug: "externalized-intelligence-internalized-experience",
    title: "외부화된 지능, 내재화되는 경험",
    titleEn: "Externalized intelligence, internalized experience",
    summary:
      "AI가 준 것이 생산성만은 아니라는 질문에서 출발해, 지능이 외부화될수록 경험은 어떻게 내재화되는지를 생각합니다.",
    summaryEn:
      "Starting from the question of what AI really gave us, on how experience becomes internalized as intelligence becomes external.",
    date: "2026-06-12",
    url: "https://rootk1m.tistory.com/22",
    type: "retrospective",
    tags: ["Essay", "AI"],
    lang: "ko",
  },
  {
    id: 21,
    slug: "cra-analysis-korea-product-security",
    title:
      "CRA 분석: 취약점이 수출 장벽이 될 때, 한국 Product Security 시장은 커질까",
    titleEn:
      "CRA analysis: when vulnerabilities become an export barrier, will Korea's product-security market grow?",
    summary:
      "EU CRA의 공식 문서와 통계를 바탕으로, 취약점이 수출 장벽이 될 때 한국 Product Security 시장이 어떻게 움직일지 확인된 사실과 분석을 나눠 봅니다.",
    summaryEn:
      "Reading the EU Cyber Resilience Act through official documents and statistics, separating confirmed facts from analysis of Korea's product-security market.",
    date: "2026-05-31",
    url: "https://rootk1m.tistory.com/21",
    type: "analysis",
    tags: ["Product Security", "Policy"],
    lang: "ko",
  },
  {
    id: 20,
    slug: "copy-fail-cve-2026-31431",
    title: "Copy Fail: CVE-2026-31431",
    titleEn: "Copy Fail: CVE-2026-31431",
    summary:
      "Linux 커널 AF_ALG 경로에서 발생한 로컬 권한 상승 취약점 CVE-2026-31431의 원인과 영향을 분석합니다.",
    summaryEn:
      "Root-cause analysis of CVE-2026-31431, a local privilege escalation in the Linux kernel's AF_ALG path.",
    date: "2026-05-23",
    url: "https://rootk1m.tistory.com/20",
    type: "analysis",
    tags: ["Linux", "Kernel", "Exploitation"],
    lang: "ko",
  },
  {
    id: 19,
    slug: "firmagent-ndss-2026-paper-review",
    title:
      "[논문 리뷰] FirmAgent — Fuzzing + LLM으로 IoT 펌웨어 취약점 자동 탐지 (NDSS 2026)",
    titleEn:
      "[Paper review] FirmAgent — Fuzzing + LLM for automated IoT firmware vulnerability discovery (NDSS 2026)",
    summary:
      "NDSS 2026에 발표된 FirmAgent 논문을 읽고, 퍼징과 LLM 에이전트를 결합해 IoT 펌웨어 취약점을 찾는 접근을 정리합니다.",
    summaryEn:
      "Notes on FirmAgent (NDSS 2026): combining fuzzing with LLM agents to find vulnerabilities in IoT firmware.",
    date: "2026-04-04",
    url: "https://rootk1m.tistory.com/19",
    type: "note",
    tags: ["Embedded", "AI for Security", "Fuzzing"],
    lang: "ko",
  },
  {
    id: 18,
    slug: "rolljam-3-extensions-and-wrap-up",
    title: "3. RollJam 확장 & 마무리",
    titleEn: "3. RollJam extensions & wrap-up",
    summary:
      "RollJam 이후 제조사 대응과 그 한계를 짚고 자동차 RKE 연구 시리즈를 마무리합니다.",
    summaryEn:
      "Vendor responses after RollJam, their limits, and a wrap-up of the automotive remote keyless entry series.",
    date: "2025-12-27",
    url: "https://rootk1m.tistory.com/18",
    type: "analysis",
    tags: ["Automotive", "RF"],
    series: "RollJam",
    lang: "ko",
  },
  {
    id: 17,
    slug: "rolljam-2-how-it-works",
    title: "2. RollJam 원리 및 구현",
    titleEn: "2. How RollJam works and how it was implemented",
    summary:
      "RKE 롤링코드의 허점을 이론으로 살펴본 뒤, RollJam의 동작 원리와 구현 과정을 정리합니다.",
    summaryEn:
      "After a look at rolling-code weaknesses in theory, how RollJam works and how it was implemented.",
    date: "2025-12-14",
    url: "https://rootk1m.tistory.com/17",
    type: "analysis",
    tags: ["Automotive", "RF"],
    series: "RollJam",
    lang: "ko",
  },
  {
    id: 16,
    slug: "rolljam-1-what-is-rolljam",
    title: "1. RollJam이란?",
    titleEn: "1. What is RollJam?",
    summary:
      "2015년 공개된 RollJam을 출발점으로 자동차 리모컨 키(RKE)와 롤링코드의 구조를 소개합니다.",
    summaryEn:
      "An introduction to automotive remote keyless entry and rolling codes, starting from RollJam (2015).",
    date: "2025-12-13",
    url: "https://rootk1m.tistory.com/16",
    type: "analysis",
    tags: ["Automotive", "RF"],
    series: "RollJam",
    lang: "ko",
  },
  {
    id: 15,
    slug: "whitehat-school-3-retrospective",
    title: "화이트햇 스쿨 3기 프로젝트 회고 - 스마트 기기 취약점 분석",
    titleEn:
      "Whitehat School 3rd cohort retrospective — smart-device vulnerability analysis",
    summary:
      "화이트햇 스쿨 3기에서 진행한 스마트 기기 취약점 분석 프로젝트를 돌아보고 CVE 발굴까지의 과정을 회고합니다.",
    summaryEn:
      "A retrospective on the Whitehat School smart-device vulnerability project and the road to CVE discoveries.",
    date: "2025-09-10",
    url: "https://rootk1m.tistory.com/15",
    type: "retrospective",
    tags: ["Embedded", "IoT", "CVE"],
    lang: "ko",
  },
  {
    id: 114,
    slug: "about-gnosis",
    title: "Gnosis",
    summary:
      "요즘 꽂힌 단어가 있습니다. 바로 Gnosis라는 단어인데요. 어떤 존재가 앎을 경험함으로서 자신을 재구성하게 되는, 그런 개인적인 앎을 뜻합니다.",
    date: "2026-04-06",
    url: "https://velog.io/@awqs1221/Gnosis",
    type: "retrospective",
    tags: ["Essay"],
    lang: "ko",
  },
  {
    id: 14,
    slug: "iot-doorbell-analysis-guide",
    title: "IoT 스마트 도어벨 취약점 분석 가이드",
    summary:
      "https://github.com/Brrester/IoT-Smart-Doorbell-Vulnerability-Analysis-Guide",
    date: "2025-08-19",
    url: "https://rootk1m.tistory.com/14",
    type: "note",
    tags: ["Embedded", "IoT"],
    lang: "ko",
  },
  {
    id: 13,
    slug: "android-intent-redirection-cve-2024",
    title: "Android Intent Redirection (with. CVE-2024-26131)",
    summary:
      "안드로이드 앱 해킹에서 Intent 시스템은 공격자 입장에서 가장 흔하게 노리는 표면입니다. 컴포넌트 간 메시지(인텐트)를 다루는 과정에서 개발자가 놓치기 쉬운 부분, 특히 Intent Redirection…",
    date: "2025-06-03",
    url: "https://rootk1m.tistory.com/13",
    type: "analysis",
    tags: ["CVE", "Android", "App Security"],
    lang: "ko",
  },
  {
    id: 12,
    slug: "mitm-ssl-tls-pinning",
    title: "MITM(중간자) 공격 , SSL/TLS Pinning & Bypass",
    summary:
      "카페 Wi-Fi에서 로그인했을 뿐인데, 일주일 뒤 불법 결제 알림이 뜬 적이 있으신가요? 모바일 앱은 HTTPS 아이콘을 보여주지만 Burp Suite에서는 평문 JSON이 잡힙니다…",
    date: "2025-05-17",
    url: "https://rootk1m.tistory.com/12",
    type: "analysis",
    tags: ["MITM", "Mobile"],
    lang: "ko",
  },
  {
    id: 11,
    slug: "sme-security-guide-1-3",
    title: "1.3 정보보호 정책과 절차 수립 – 중소기업/스타트업 보안 전략 가이드",
    summary:
      "1.1 경영진의 보안 리더십과 의지 - 중소기업/스타트업 보안 전략 가이드",
    date: "2025-05-12",
    url: "https://rootk1m.tistory.com/11",
    type: "analysis",
    tags: ["Product Security", "Security Management"],
    series: "중소기업·스타트업 보안 전략 가이드",
    lang: "ko",
  },
  {
    id: 10,
    slug: "diva-4-insecure-data-storage-2",
    title: "[DIVA] 4. Insecure Data Storage - Part 2",
    summary:
      "myuser 테이블에 저장된 ID/PW 를 획득하거나, 테이블 구조 자체를 삭제(DROP) 하여 보호장치 없는 DB 저장을 검증하라.",
    date: "2025-05-09",
    url: "https://rootk1m.tistory.com/10",
    type: "note",
    tags: ["Android", "App Security"],
    series: "DIVA",
    lang: "ko",
  },
  {
    id: 9,
    slug: "diva-3-insecure-data-storage-1",
    title: "[DIVA] 3. Insecure Data Storage - Part 1",
    summary:
      "앱이 3rd-party 자격증명(ID/PW)을 어디에, 어떻게 저장하는지 찾아서 값을 확보하라.",
    date: "2025-05-08",
    url: "https://rootk1m.tistory.com/9",
    type: "note",
    tags: ["Android", "App Security"],
    series: "DIVA",
    lang: "ko",
  },
  {
    id: 8,
    slug: "diva-2-hardcoding-issues",
    title: "[DIVA] 2. Hardcoding Issues",
    summary:
      "앱 내부에 하드코딩 된 민감 정보가 무엇인지 찾아 입력-우회로 정상 플로우를 트리거하라.",
    date: "2025-05-08",
    url: "https://rootk1m.tistory.com/8",
    type: "note",
    tags: ["Android", "App Security"],
    series: "DIVA",
    lang: "ko",
  },
  {
    id: 7,
    slug: "diva-1-insecure-logging",
    title: "[DIVA] 1. Insecure Logging",
    summary:
      "1. 앱 실행 → “Insecure Logging” 단계 선택 카드 번호 입력 창에 임의 값 (나의 경우 123) 입력 후 CHECK OUT 클릭 2. adb logcat | grep diva-log로 애플리케이션…",
    date: "2025-05-05",
    url: "https://rootk1m.tistory.com/7",
    type: "note",
    tags: ["Android", "App Security"],
    series: "DIVA",
    lang: "ko",
  },
  {
    id: 6,
    slug: "what-is-mitre-attack",
    title: "MITRE ATT&CK이란?",
    summary:
      "최근 학부연구생 생활을 시작했는데요, 저희 연구실의 주된 연구 주제가 MITRE ATT&CK입니다. MITRE는 CVE 발급해 주는 기관으로만 어렴풋이 알고 있었는데, 이런 프레임워크까지 정리하고 분석하는지는…",
    date: "2025-05-03",
    url: "https://rootk1m.tistory.com/6",
    type: "note",
    tags: ["MITRE ATT&CK", "Threat Intelligence"],
    lang: "ko",
  },
  {
    id: 5,
    slug: "seh-handler-stack-cookie",
    title: "SEH Handler & Stack Cookie(/GS Cookie)",
    summary:
      "화이트햇 스쿨 과제로 윈도우 애플리케이션 익스플로잇을 진행했는데, 리눅스 환경이랑은 또 완전 다른 느낌입니다..",
    date: "2025-04-20",
    url: "https://rootk1m.tistory.com/5",
    type: "analysis",
    tags: ["System Hacking", "Pwnable", "Windows"],
    lang: "ko",
  },
  {
    id: 4,
    slug: "sme-security-guide-1-2",
    title: "1.2 자산 식별과 위협 평가 - 중소기업/스타트업 보안 전략 가이드",
    summary:
      "1.1 경영진의 보안 리더십과 의지 - 중소기업/스타트업 보안 전략 가이드",
    date: "2025-04-09",
    url: "https://rootk1m.tistory.com/4",
    type: "analysis",
    tags: ["Product Security", "Security Management"],
    series: "중소기업·스타트업 보안 전략 가이드",
    lang: "ko",
  },
  {
    id: 3,
    slug: "what-is-system-hacking",
    title: "시스템 해킹이란 무엇인가?",
    summary:
      "시스템 해킹을 ‘포너블(pwnable)’이라고 부르게 된 유래에 대한 가설 중 한 가지는 인터넷에서 'own'(지배하다, 소유하다)의 오타인 'pwn'에서 유래했다고 합니다. 이는 해킹에서 대상 시스템을 장악하거나…",
    date: "2025-04-07",
    url: "https://rootk1m.tistory.com/3",
    type: "note",
    tags: ["System Hacking", "Pwnable"],
    lang: "ko",
  },
  {
    id: 113,
    slug: "blog-migration-notice",
    title: "블로그 이전 안내",
    summary:
      "앞으로의 글은 Tistory 블로그를 통해 게시할 예정입니다. velog에 남겨진 기존 글들은 그대로 유지되지만, 새로운 글은 아래 링크에서 확인해 주세요:",
    date: "2025-04-05",
    url: "https://velog.io/@awqs1221/%EB%B8%94%EB%A1%9C%EA%B7%B8-%EC%9D%B4%EC%A0%84-%EC%95%88%EB%82%B4",
    type: "retrospective",
    tags: ["Essay"],
    lang: "ko",
  },
  {
    id: 2,
    slug: "sme-security-guide-1-1",
    title: "1.1 경영진의 보안 리더십과 의지 - 중소기업/스타트업 보안 전략 가이드",
    summary:
      "스타트업이나 중소기업에서 보안은 대부분 긴급하지 않지만 중요한 것에 속합니다. 제품을 먼저 만들고, 고객을 확보하고, 시장을 넓히는 데 집중하다 보면 보안은 '나중에 하자'는 항목으로 분류됩니다. 특히 CTO나…",
    date: "2025-04-05",
    url: "https://rootk1m.tistory.com/2",
    type: "analysis",
    tags: ["Product Security", "Security Management"],
    series: "중소기업·스타트업 보안 전략 가이드",
    lang: "ko",
  },
  {
    id: 1,
    slug: "sme-security-guide-0",
    title: "중소기업/스타트업 보안 전략 가이드 - 0",
    summary:
      "보안은 기업의 가장 마지막에 고려되는 주제처럼 여겨집니다. 특히 스타트업이나 중소기업에서는 “우선 제품부터 완성하고, 유저부터 확보하고, 매출부터 만들고, 그다음에 보안을…”이라는 생각이 당연시됩니다. 하지만…",
    date: "2025-04-05",
    url: "https://rootk1m.tistory.com/1",
    type: "analysis",
    tags: ["Product Security", "Security Management"],
    series: "중소기업·스타트업 보안 전략 가이드",
    lang: "ko",
  },
  {
    id: 112,
    slug: "ctf-operations-retrospective",
    title: "CTF 운영 / 문제 출제 회고",
    summary:
      "세종대 SSG, 명지대 MJSEC, 건국대 seKUrity 이른바 MSG 되시겠다.",
    date: "2025-03-29",
    url: "https://velog.io/@awqs1221/CTF-%EC%9A%B4%EC%98%81-%EB%AC%B8%EC%A0%9C-%EC%B6%9C%EC%A0%9C-%ED%9A%8C%EA%B3%A0",
    type: "retrospective",
    tags: ["CTF", "Retrospective"],
    lang: "ko",
  },
  {
    id: 111,
    slug: "learning-about-mcp",
    title: "MCP에 대해 알아 보자!",
    summary:
      "MCP는 기본적으로 호스트 애플리케이션이 여러 서버에 연결할 수 있는 Client-Server 아키텍쳐를 따름",
    date: "2025-03-25",
    url: "https://velog.io/@awqs1221/MCP%EC%97%90-%EB%8C%80%ED%95%B4-%EC%95%8C%EC%95%84-%EB%B3%B4%EC%9E%90",
    type: "note",
    tags: ["MCP", "AI for Security"],
    lang: "ko",
  },
  {
    id: 110,
    slug: "blind-sql-injection-time-based",
    title: "Blind SQL Injection (+Time-Based)",
    summary:
      "위 과정을 통해 원하는 데이터를 추출해낼 수 있음.",
    date: "2025-03-21",
    url: "https://velog.io/@awqs1221/Blind-SQL-Injection-Time-Based",
    type: "note",
    tags: ["SQL Injection", "Web"],
    lang: "ko",
  },
  {
    id: 109,
    slug: "cwe-285-improper-authorization",
    title: "CWE-285 : Improper Authorization",
    summary:
      "Improper Authorization 부적절한 권한 부여",
    date: "2025-03-20",
    url: "https://velog.io/@awqs1221/CWE-285-Improper-Authorization",
    type: "note",
    tags: ["CWE", "Web"],
    lang: "ko",
  },
  {
    id: 108,
    slug: "cve-2024-45387-sql-injection",
    title: "CVE-2024-45387 : SQL Injection",
    summary:
      "출처 : https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2024-45387…",
    date: "2025-03-20",
    url: "https://velog.io/@awqs1221/CVE-2024-45387-SQL-Injection",
    type: "analysis",
    tags: ["SQL Injection", "CVE", "Web"],
    lang: "ko",
  },
  {
    id: 107,
    slug: "cwe-89-sql-injection",
    title: "CWE-89 : SQL Injection",
    summary:
      "만약 사용자가 username에 ' OR '1'='1 을 입력한다면?",
    date: "2025-03-20",
    url: "https://velog.io/@awqs1221/CWE-89-SQL-Injection",
    type: "note",
    tags: ["SQL Injection", "CWE", "Web"],
    lang: "ko",
  },
  {
    id: 106,
    slug: "haeuso",
    title: "해우소",
    summary:
      "정신이 없습니다. 20학점 들으며, 화이트햇 스쿨도 진행하고, 동아리 운영진 일도 하려니까 여간 바쁜게 아니네요.",
    date: "2025-03-15",
    url: "https://velog.io/@awqs1221/%ED%95%B4%EC%9A%B0%EC%86%8C",
    type: "retrospective",
    tags: ["Essay"],
    lang: "ko",
  },
  {
    id: 105,
    slug: "android-hacking-intro-2b",
    title: "안드로이드 해킹 입문 - 2(하)",
    summary:
      "목표: 안드로이드 운영체제 구조와 보안 기본 개념 학습 활동: 유튜브에서 “OWASP Mobile Top 10” 및 안드로이드 보안 개념 관련 무료 영상 시청 보안 취약점(예: 인텐트 검증, 파일 권한 문제) 목록…",
    date: "2025-03-04",
    url: "https://velog.io/@awqs1221/%EC%95%88%EB%93%9C%EB%A1%9C%EC%9D%B4%EB%93%9C-%ED%95%B4%ED%82%B9-%EC%9E%85%EB%AC%B8-2%ED%95%98",
    type: "note",
    tags: ["Android", "App Security"],
    series: "안드로이드 해킹 입문",
    lang: "ko",
  },
  {
    id: 104,
    slug: "android-hacking-intro-2a",
    title: "안드로이드 해킹 입문 - 2(상)",
    summary:
      "목표: 안드로이드 운영체제 구조와 보안 기본 개념 학습 활동: 유튜브에서 “OWASP Mobile Top 10” 및 안드로이드 보안 개념 관련 무료 영상 시청 보안 취약점(예: 인텐트 검증, 파일 권한 문제) 목록…",
    date: "2025-03-04",
    url: "https://velog.io/@awqs1221/%EC%95%88%EB%93%9C%EB%A1%9C%EC%9D%B4%EB%93%9C-%ED%95%B4%ED%82%B9-%EC%9E%85%EB%AC%B8-2%EC%83%81",
    type: "note",
    tags: ["Android", "App Security"],
    series: "안드로이드 해킹 입문",
    lang: "ko",
  },
  {
    id: 103,
    slug: "whitehat-school-3-acceptance",
    title: "화이트햇 스쿨 3기 최종 합격 후기",
    summary:
      "요즘 안드로이드 글이 안 올라갔죠? ~작심 1일~은 맞았지만 오늘부터 다시 하려고 합니다. 조금 변명을 하자면 ..",
    date: "2025-03-03",
    url: "https://velog.io/@awqs1221/%ED%99%94%EC%9D%B4%ED%8A%B8%ED%96%87-%EC%8A%A4%EC%BF%A8-3%EA%B8%B0-%EC%B5%9C%EC%A2%85-%ED%95%A9%EA%B2%A9-%ED%9B%84%EA%B8%B0",
    type: "retrospective",
    tags: ["Retrospective"],
    lang: "ko",
  },
  {
    id: 102,
    slug: "android-hacking-intro-1",
    title: "안드로이드 해킹 입문 - 1",
    summary:
      "목표: Android Studio 설치, 에뮬레이터 설정, 기본 “Hello World” 앱 작성 활동: Android Studio 설치 가이드 참고…",
    date: "2025-02-23",
    url: "https://velog.io/@awqs1221/%EC%95%88%EB%93%9C%EB%A1%9C%EC%9D%B4%EB%93%9C-%ED%95%B4%ED%82%B9-%EC%9E%85%EB%AC%B8-1",
    type: "note",
    tags: ["Android", "App Security"],
    series: "안드로이드 해킹 입문",
    lang: "ko",
  },
  {
    id: 101,
    slug: "android-hacking-intro-0",
    title: "안드로이드 해킹 입문 - 0",
    summary:
      "네, 블로그 쓰는 습관도 들여놓을 겸 2주 정도 시간이 뜨기에 공부해보고 싶었던 안드로이드 해킹을 지피티 선생님이 추천해주신 방법으로 공부해볼까 합니다. 뭐 이 글은 나중에 맘에 안들면 지울 예정이구요. 철저히…",
    date: "2025-02-23",
    url: "https://velog.io/@awqs1221/%EC%95%88%EB%93%9C%EB%A1%9C%EC%9D%B4%EB%93%9C-%ED%95%B4%ED%82%B9-%EC%9E%85%EB%AC%B8-0",
    type: "note",
    tags: ["Android", "App Security"],
    series: "안드로이드 해킹 입문",
    lang: "ko",
  },
];

export const postTypes: PostType[] = ["analysis", "note", "retrospective"];

/** Newest first. */
export function sortedPosts(): Post[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id));
}

export function latestPosts(count: number): Post[] {
  return sortedPosts().slice(0, count);
}

export function postById(id: number): Post | undefined {
  return posts.find((p) => p.id === id);
}

export function postBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function postTitle(post: Post, locale: string): string {
  return locale === "ko" ? post.title : post.titleEn ?? post.title;
}

export function postSummary(post: Post, locale: string): string {
  return locale === "ko" ? post.summary : post.summaryEn ?? post.summary;
}
