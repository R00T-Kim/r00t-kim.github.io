export interface PublicationLink {
  label: string;
  labelEn: string;
  url: string;
}

export interface Publication {
  title: string;
  titleEn: string;
  /** Author names in publication order (Korean). */
  authors: string[];
  /** Author names in publication order (English). */
  authorsEn: string[];
  /** 0-based index of the site owner within authors[] / authorsEn[] (rendered bold). */
  authorIndex: number;
  venue: string;
  venueEn: string;
  date: string;
  type: "journal" | "conference";
  /** True when the site owner is the first author. */
  firstAuthor?: boolean;
  award?: string;
  awardEn?: string;
  /** Render as the prominent headliner card. */
  highlight?: boolean;
  doi?: string;
  links?: PublicationLink[];
}

export const publications: Publication[] = [
  {
    title:
      "MuCamp2: 제약 기반 LLM을 통한 공격 그룹 식별용 검증된 사이버 캠페인 변종 생성",
    titleEn:
      "MuCamp2: Generating Validated Cyber Campaign Variants via Constrained LLMs for Group Attribution",
    authors: [
      "Keunho Kim",
      "Jimin Lee",
      "Insup Lee",
      "Insung Han",
      "Jungsik Lee",
      "Shinwoo Shim",
      "Changhee Choi",
    ],
    authorsEn: [
      "Keunho Kim",
      "Jimin Lee",
      "Insup Lee",
      "Insung Han",
      "Jungsik Lee",
      "Shinwoo Shim",
      "Changhee Choi",
    ],
    authorIndex: 0,
    firstAuthor: true,
    venue: "IEEE Access (SCIE)",
    venueEn: "IEEE Access (SCIE)",
    date: "2026.06",
    type: "journal",
    highlight: true,
    doi: "10.1109/ACCESS.2026.3700808",
    links: [
      {
        label: "논문",
        labelEn: "Paper",
        url: "https://ieeexplore.ieee.org/document/11552376",
      },
      {
        label: "DOI",
        labelEn: "DOI",
        url: "https://doi.org/10.1109/ACCESS.2026.3700808",
      },
      {
        label: "코드",
        labelEn: "Code",
        url: "https://github.com/cyailab/MuCamp2",
      },
    ],
  },
  {
    title: "Agentic AI 기반 악성 행위 탐지 기법",
    titleEn: "Agentic AI-based Anomaly Behavior Detection Method",
    authors: [
      "김민준",
      "변재준",
      "김근호",
      "조상훈",
      "이지민",
      "한인성",
      "박성진",
      "김태훈",
      "최창희",
    ],
    authorsEn: [
      "Minjun Kim",
      "Jaejun Byun",
      "Keunho Kim",
      "Sanghoon Cho",
      "Jimin Lee",
      "Insung Han",
      "Sungjin Park",
      "Taehoon Kim",
      "Changhee Choi",
    ],
    authorIndex: 2,
    venue: "한국인터넷정보학회 춘계학술대회 2026",
    venueEn: "KSII Spring Conference 2026",
    date: "2026.05",
    type: "conference",
    award: "우수논문상",
    awardEn: "Best Paper Award",
  },
  {
    title: "LLM 기반 보안로그 저감 기법",
    titleEn: "LLM-based Security Log Reduction Technique",
    authors: [
      "변재준",
      "김민준",
      "김근호",
      "조상훈",
      "이지민",
      "한인성",
      "박성진",
      "김태훈",
      "최창희",
    ],
    authorsEn: [
      "Jaejun Byun",
      "Minjun Kim",
      "Keunho Kim",
      "Sanghoon Cho",
      "Jimin Lee",
      "Insung Han",
      "Sungjin Park",
      "Taehoon Kim",
      "Changhee Choi",
    ],
    authorIndex: 2,
    venue: "한국인터넷정보학회 춘계학술대회 2026",
    venueEn: "KSII Spring Conference 2026",
    date: "2026.05",
    type: "conference",
  },
  {
    title: "Agentic AI 기반 ExploitAgent의 구조 설계 및 자율 행위 생성 기술",
    titleEn:
      "Architecture Design and Autonomous Behavior Generation of Agentic AI-based ExploitAgent",
    authors: ["조상훈", "김근호", "최창희"],
    authorsEn: ["Sanghun Jo", "Keunho Kim", "Changhee Choi"],
    authorIndex: 1,
    venue: "한국인터넷정보학회 추계학술대회 2025 (국방정보기술연구회)",
    venueEn: "KSII Autumn Conference 2025 (Defense IT Research Society)",
    date: "2025.10",
    type: "conference",
    award: "우수논문상",
    awardEn: "Best Paper Award",
  },
];
