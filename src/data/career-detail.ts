export interface SubSection {
  title: string;
  titleEn: string;
  items: CareerDetailItem[];
}

export interface CareerDetailItem {
  text: string;
  textEn: string;
  subItems?: { text: string; textEn: string }[];
}

export interface CareerDetailSection {
  id: string;
  title: string;
  titleEn: string;
  background: CareerDetailItem[];
  role: SubSection[];
  results: CareerDetailItem[];
  lessons: CareerDetailItem[];
}

export const careerDetailSections: CareerDetailSection[] = [
  {
    id: "iot-doorbell",
    title: "IoT 스마트 도어벨 취약점 분석",
    titleEn: "IoT Smart Doorbell Vulnerability Analysis",
    background: [
      {
        text: "IoT 디바이스의 급격한 보급에도 불구하고 보안 검증이 부족한 제품들이 시장에 유통되고 있었습니다.",
        textEn:
          "Despite the rapid proliferation of IoT devices, products with insufficient security verification were being distributed in the market.",
      },
      {
        text: "스마트 도어벨은 가정 내 보안에 직접적으로 연관된 디바이스로, 취약점 발생 시 사생활 침해 및 물리적 보안 위협이 될 수 있었습니다.",
        textEn:
          "Smart doorbells are devices directly related to home security, and vulnerabilities could lead to privacy invasion and physical security threats.",
      },
    ],
    role: [
      {
        title: "펌웨어 분석",
        titleEn: "Firmware Analysis",
        items: [
          {
            text: "펌웨어 추출 및 리버스 엔지니어링을 통해 내부 구조를 분석했습니다.",
            textEn:
              "Analyzed internal structure through firmware extraction and reverse engineering.",
            subItems: [
              {
                text: "바이너리 분석을 통해 인증 우회, 명령 주입 등 다수의 취약점을 식별했습니다.",
                textEn:
                  "Identified multiple vulnerabilities including authentication bypass and command injection through binary analysis.",
              },
              {
                text: "하드웨어 인터페이스(UART, JTAG 등)를 활용한 디버깅 및 분석을 수행했습니다.",
                textEn:
                  "Performed debugging and analysis using hardware interfaces (UART, JTAG, etc.).",
              },
            ],
          },
        ],
      },
      {
        title: "취약점 도출 및 보고",
        titleEn: "Vulnerability Discovery & Reporting",
        items: [
          {
            text: "발견된 취약점을 체계적으로 분류하고 CVE 등록을 진행했습니다.",
            textEn:
              "Systematically classified discovered vulnerabilities and proceeded with CVE registration.",
            subItems: [
              {
                text: "총 18건의 CVE를 MITRE에 등록하여 공식 취약점으로 인정받았습니다.",
                textEn:
                  "Registered 18 CVEs with MITRE, officially recognized as vulnerabilities.",
              },
              {
                text: "분석 과정과 방법론을 가이드 문서로 작성하여 GitHub에 공개했습니다.",
                textEn:
                  "Documented the analysis process and methodology as a guide and published on GitHub.",
              },
            ],
          },
        ],
      },
    ],
    results: [
      {
        text: "총 18건의 CVE를 발굴하여 IoT 디바이스 보안 취약점의 심각성을 입증했습니다.",
        textEn:
          "Discovered 18 CVEs, demonstrating the severity of IoT device security vulnerabilities.",
      },
      {
        text: "분석 가이드를 오픈소스로 공개하여 IoT 보안 연구 커뮤니티에 기여했습니다.",
        textEn:
          "Contributed to the IoT security research community by open-sourcing the analysis guide.",
      },
    ],
    lessons: [
      {
        text: "IoT 디바이스 보안은 소프트웨어뿐만 아니라 하드웨어 레벨의 분석이 필수적이며, 양면을 아우르는 종합적인 접근이 중요하다는 것을 깨달았습니다.",
        textEn:
          "Realized that IoT device security requires not only software but hardware-level analysis, and a comprehensive approach covering both sides is essential.",
      },
      {
        text: "체계적인 취약점 보고 프로세스(CVE 등록)와 연구 결과의 공개가 보안 생태계 전체에 기여할 수 있다는 것을 경험했습니다.",
        textEn:
          "Experienced that systematic vulnerability reporting processes (CVE registration) and publishing research results can contribute to the entire security ecosystem.",
      },
    ],
  },
  {
    id: "exploit-agent",
    title: "Agentic AI 기반 ExploitAgent 연구",
    titleEn: "Agentic AI-based ExploitAgent Research",
    background: [
      {
        text: "기존의 취약점 분석은 수동적이고 전문가 의존적인 프로세스로, 증가하는 소프트웨어 복잡성에 대응하기 어려웠습니다.",
        textEn:
          "Traditional vulnerability analysis was a manual, expert-dependent process that struggled to keep pace with increasing software complexity.",
      },
      {
        text: "Agentic AI의 발전으로 자율적인 보안 분석 에이전트 구현의 가능성이 열렸습니다.",
        textEn:
          "Advances in Agentic AI opened possibilities for implementing autonomous security analysis agents.",
      },
    ],
    role: [
      {
        title: "아키텍처 설계",
        titleEn: "Architecture Design",
        items: [
          {
            text: "ExploitAgent의 전체 구조를 설계하고 자율 행위 생성 메커니즘을 연구했습니다.",
            textEn:
              "Designed the overall architecture of ExploitAgent and researched autonomous behavior generation mechanisms.",
            subItems: [
              {
                text: "Agent가 취약점 후보를 자율적으로 탐색하고 검증하는 파이프라인을 설계했습니다.",
                textEn:
                  "Designed a pipeline for agents to autonomously discover and validate vulnerability candidates.",
              },
              {
                text: "연구 결과를 한국인터넷정보학회 추계학술대회에서 발표하여 우수논문상을 수상했습니다.",
                textEn:
                  "Presented research results at KSII Autumn Conference and received the Best Paper Award.",
              },
            ],
          },
        ],
      },
    ],
    results: [
      {
        text: "한국인터넷정보학회 추계학술대회 우수논문상 수상으로 연구의 학술적 가치를 인정받았습니다.",
        textEn:
          "Academic value recognized through Best Paper Award at KSII Autumn Conference.",
      },
      {
        text: "SCOUT 프로젝트로 발전시켜 실제 IoT 펌웨어 대상 자동화 시스템 개발에 착수했습니다.",
        textEn:
          "Evolved into the SCOUT project, initiating development of an automation system targeting real IoT firmware.",
      },
    ],
    lessons: [
      {
        text: "AI를 보안 분야에 적용할 때는 단순 자동화를 넘어, Agent의 의사결정 과정에 대한 신뢰성 확보가 핵심 과제임을 배웠습니다.",
        textEn:
          "Learned that applying AI to security requires ensuring trustworthiness of agent decision-making processes beyond simple automation.",
      },
      {
        text: "연구 성과를 학술 논문으로 정리하고 발표하는 과정이 연구 품질을 높이고 커뮤니티 피드백을 받는 데 중요한 역할을 한다는 것을 깨달았습니다.",
        textEn:
          "Realized that organizing and presenting research as academic papers plays an important role in improving research quality and receiving community feedback.",
      },
    ],
  },
  {
    id: "autohack",
    title: "AutoHack 2025 자동차 해킹 경진대회",
    titleEn: "AutoHack 2025 Automotive Hacking Competition",
    background: [
      {
        text: "커넥티드 카 및 자율주행 기술의 발전으로 자동차 사이버 보안의 중요성이 급격히 증가했습니다.",
        textEn:
          "The importance of automotive cybersecurity has rapidly increased with advances in connected cars and autonomous driving technology.",
      },
      {
        text: "AutoHack 2025는 실제 차량 시스템을 대상으로 한 해킹·방어 경진대회로, 실전 역량을 검증하는 기회였습니다.",
        textEn:
          "AutoHack 2025 was a hacking and defense competition targeting real vehicle systems, providing an opportunity to validate practical capabilities.",
      },
    ],
    role: [
      {
        title: "팀 참여 및 분석",
        titleEn: "Team Participation & Analysis",
        items: [
          {
            text: "Team Grand Theft Auto로 참가하여 차량 시스템 대상 공격 시나리오를 수행했습니다.",
            textEn:
              "Participated as Team Grand Theft Auto, executing attack scenarios targeting vehicle systems.",
            subItems: [
              {
                text: "차량 네트워크(CAN Bus) 분석 및 UDS 프로토콜 기반 취약점 탐색을 수행했습니다.",
                textEn:
                  "Performed vehicle network (CAN Bus) analysis and UDS protocol-based vulnerability scanning.",
              },
              {
                text: "IVI(In-Vehicle Infotainment) 시스템 익스플로잇 및 UAV 보안 챌린지(RF 기반 Hijacking 후 소유권 탈취 시나리오 분석·재현)를 수행했습니다.",
                textEn:
                  "Conducted IVI (In-Vehicle Infotainment) exploitation and UAV security challenges (RF-based hijacking and ownership takeover scenario analysis/reproduction).",
              },
            ],
          },
        ],
      },
    ],
    results: [
      {
        text: "COSS 협의회 의장상을 수상하여 자동차 보안 분야의 역량을 인정받았습니다.",
        textEn:
          "Received the COSS Council Chair Award, recognizing capabilities in automotive security.",
      },
    ],
    lessons: [
      {
        text: "자동차 보안은 IT 보안과 다른 독특한 프로토콜과 제약 조건이 있으며, 도메인 특화 지식이 필수적이라는 것을 체감했습니다.",
        textEn:
          "Experienced that automotive security has unique protocols and constraints different from IT security, and domain-specific knowledge is essential.",
      },
      {
        text: "팀 기반의 CTF/해킹 대회에서 역할 분담과 실시간 커뮤니케이션의 중요성을 배웠습니다.",
        textEn:
          "Learned the importance of role division and real-time communication in team-based CTF/hacking competitions.",
      },
    ],
  },
];
