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
    id: "mucamp2",
    title: "MuCamp2 - 검증 기반 사이버 캠페인 변종 생성",
    titleEn: "MuCamp2 - Validated Cyber Campaign Variant Generation",
    background: [
      {
        text: "APT 그룹 분류와 CTI 분석에서는 실제 캠페인 데이터가 제한적이어서, TTP 시퀀스를 증강하더라도 공격 전술 구조와 실행 가능성을 훼손하지 않는 검증 체계가 필요했습니다.",
        textEn:
          "APT group attribution and CTI analysis face limited real campaign data, so augmenting TTP sequences required validation that preserves tactic structure and operational plausibility.",
      },
      {
        text: "LLM을 자유 생성기로 사용하면 그럴듯하지만 검증되지 않은 캠페인 변종이 만들어질 수 있어, 후보 풀 제약과 독립 검증기를 결합한 구조가 필요했습니다.",
        textEn:
          "Using LLMs as free-form generators can produce plausible but unverified campaign variants, requiring a design that combines constrained candidate pools with independent validation.",
      },
    ],
    role: [
      {
        title: "제약 기반 생성·검증 구조 설계",
        titleEn: "Constrained Generation & Validation Design",
        items: [
          {
            text: "MuCamp2에서 LLM을 신뢰 경계 밖에 두고, 동일 tactic 후보 풀과 코드 수준 검증으로 TTP 변종 생성을 제한하는 구조를 설계·구현했습니다.",
            textEn:
              "Designed and implemented MuCamp2's architecture that keeps LLMs outside the trust boundary and constrains TTP mutation with same-tactic candidate pools and code-level verification.",
            subItems: [
              {
                text: "MITRE ATT&CK 기반 technique/tactic 매핑을 사용해 변이 후보를 제한하고, V1~V4 코드 검증으로 길이·인덱스·원본 보존·후보 풀 일치성을 확인했습니다.",
                textEn:
                  "Constrained mutation candidates with MITRE ATT&CK technique/tactic mappings and checked length, index consistency, original-position preservation, and candidate-pool membership through V1–V4 verification.",
              },
              {
                text: "AEP 기반 L1/L2/L3 의미 검증을 적용해 구조적 일관성, 실행 가능성, strict dependency 만족도를 단계적으로 평가했습니다.",
                textEn:
                  "Applied AEP-based L1/L2/L3 semantic validation to evaluate structural consistency, execution feasibility, and strict dependency satisfaction.",
              },
            ],
          },
        ],
      },
      {
        title: "실험·재현 산출물 정리",
        titleEn: "Experiment & Reproducibility Artifacts",
        items: [
          {
            text: "Lazarus와 MenuPass 캠페인 시퀀스를 대상으로 SR baseline과 LLM few-shot 변종을 비교하고, 평가 스크립트·데이터·GUI 재현 환경을 공개 저장소로 정리했습니다.",
            textEn:
              "Compared SR baselines and LLM few-shot variants on Lazarus and MenuPass campaign sequences, then organized evaluation scripts, data, and GUI reproduction artifacts in a public repository.",
            subItems: [
              {
                text: "AEP coverage 한계를 명시해 'validated' 표현을 완전한 semantic ground truth가 아니라 AEP coverage 내 검증으로 해석하도록 정리했습니다.",
                textEn:
                  "Documented AEP coverage limits so 'validated' is interpreted as validation under current AEP coverage rather than complete semantic ground truth.",
              },
              {
                text: "IEEE Access 논문 링크와 Apache-2.0 라이선스 GitHub 저장소를 공개 산출물로 연결했습니다.",
                textEn:
                  "Connected the IEEE Access paper and Apache-2.0 GitHub repository as public research artifacts.",
              },
            ],
          },
        ],
      },
    ],
    results: [
      {
        text: "MuCamp2 논문이 IEEE Access 2026에 게재되었고, IEEE Xplore 및 GitHub 저장소를 통해 논문·코드 산출물을 공개했습니다.",
        textEn:
          "The MuCamp2 paper was published in IEEE Access 2026, with paper and code artifacts released through IEEE Xplore and GitHub.",
      },
      {
        text: "tactic violation rate 0%를 달성하고, L3 pass rate에서 Lazarus +5.5pp, MenuPass +3.0pp의 개선을 보고했습니다.",
        textEn:
          "Reported a 0% tactic violation rate and L3 pass-rate improvements of +5.5 pp for Lazarus and +3.0 pp for MenuPass.",
      },
      {
        text: "LLM을 신뢰 주체가 아니라 제한된 선택·정제 모듈로 두고, 독립 검증기로 산출물을 gate하는 보안 연구 패턴을 정리했습니다.",
        textEn:
          "Established a security research pattern where the LLM is a constrained selection/refinement module rather than a trusted actor, and outputs are gated by independent validators.",
      },
    ],
    lessons: [
      {
        text: "보안 데이터 증강에서 중요한 것은 생성량보다 구조적 무결성, 검증 기준, coverage 한계를 함께 공개하는 것임을 확인했습니다.",
        textEn:
          "Confirmed that security data augmentation is less about generation volume and more about publishing structural integrity, validation criteria, and coverage limits together.",
      },
      {
        text: "LLM 기반 보안 자동화는 모델 성능만으로 설득되지 않으며, 신뢰 경계·제약 조건·재현 가능한 평가 파이프라인이 함께 설계되어야 한다는 점을 배웠습니다.",
        textEn:
          "Learned that LLM-based security automation is not justified by model capability alone; trust boundaries, constraints, and reproducible evaluation pipelines must be designed together.",
      },
    ],
  },
  {
    id: "scout",
    title: "SCOUT - IoT 펌웨어 취약점 후보 자동 생성 시스템",
    titleEn: "SCOUT - Deterministic Firmware-to-Exploit Evidence Engine",
    background: [
      {
        text: "IoT 펌웨어 취약점 분석은 파일 시스템, 바이너리, SBOM, CVE 매칭, 동적 검증 결과가 분리되어 있어 분석가가 바로 따라갈 수 있는 재현 가능한 근거 체인을 만들기 어려웠습니다.",
        textEn:
          "IoT firmware vulnerability analysis often separates filesystem, binary, SBOM, CVE matching, and dynamic validation results, making it difficult to build reproducible evidence chains that analysts can immediately follow.",
      },
      {
        text: "Agentic AI 기반 분석을 실제 펌웨어 규모에 적용하려면, LLM의 추론보다 먼저 해시·오프셋·파일 경로·stage 산출물로 검증 가능한 결정론적 증거 구조가 필요했습니다.",
        textEn:
          "To apply Agentic AI-based analysis at real firmware scale, a deterministic evidence structure anchored by hashes, offsets, file paths, and stage artifacts was required before relying on LLM reasoning.",
      },
    ],
    role: [
      {
        title: "End-to-End 시스템 오너십",
        titleEn: "End-to-End System Ownership",
        items: [
          {
            text: "SCOUT의 핵심 아키텍처, stage 오케스트레이션, 증거 스키마, CLI/리포팅 흐름을 직접 설계하고 대부분의 구현을 주도했습니다.",
            textEn:
              "Designed SCOUT's core architecture, stage orchestration, evidence schema, and CLI/reporting flow, while driving most of the implementation directly.",
            subItems: [
              {
                text: "펌웨어 입력부터 SARIF, CycloneDX SBOM+VEX, SLSA Provenance, 해시 앵커 증거 체인까지 이어지는 자동 분석 경로를 구축했습니다.",
                textEn:
                  "Built the automated analysis path from firmware input to SARIF, CycloneDX SBOM+VEX, SLSA Provenance, and hash-anchored evidence chains.",
              },
              {
                text: "초기 42단계 파이프라인을 compliance_report까지 포함한 43단계 구조로 확장하고, Zero pip dependencies 원칙을 유지했습니다.",
                textEn:
                  "Extended the initial 42-stage pipeline into a 43-stage structure including compliance_report while preserving the zero-pip-dependencies principle.",
              },
              {
                text: "AI Agent가 취약점 후보와 증거 번들을 넘겨받아 후속 분석을 수행할 수 있도록 MCP 서버와 handoff writer 구조를 설계했습니다.",
                textEn:
                  "Designed the MCP server and handoff writer structure so AI agents could consume vulnerability candidates and evidence bundles for follow-up analysis.",
              },
            ],
          },
        ],
      },
      {
        title: "핵심 개발·디버깅·품질 안정화",
        titleEn: "Core Development, Debugging & Quality Stabilization",
        items: [
          {
            text: "CVE 매칭, ELF 하드닝 감사, source/sink 식별, LLM triage, adversarial verification, compliance mapping 등 핵심 분석 모듈을 직접 구현·디버깅했습니다.",
            textEn:
              "Directly implemented and debugged core analysis modules including CVE matching, ELF hardening audits, source/sink identification, LLM triage, adversarial verification, and compliance mapping.",
            subItems: [
              {
                text: "2,239개 CVE 시그니처 기반 매칭 엔진, 51개 sink coverage, format-string detector, LARA URI/CGI/config-key source identification을 구축했습니다.",
                textEn:
                  "Built a CVE matching engine with 2,239 signatures, 51-sink coverage, a format-string detector, and LARA URI/CGI/config-key source identification.",
              },
              {
                text: "AFL++ 퍼징, FirmAE/QEMU 에뮬레이션, Ghidra/P-code 분석, 4개 LLM 드라이버(Codex, Claude API, Claude Code, Ollama)를 파이프라인에 통합했습니다.",
                textEn:
                  "Integrated AFL++ fuzzing, FirmAE/QEMU emulation, Ghidra/P-code analysis, and four LLM drivers (Codex, Claude API, Claude Code, Ollama) into the pipeline.",
              },
              {
                text: "run.py 집중 구조를 normalize, stage_executor, report_assembler, handoff_writer로 분해하고, pyright 113개 오류를 0개로 줄이며 회귀 테스트 기반을 정리했습니다.",
                textEn:
                  "Decomposed the run.py-centered architecture into normalize, stage_executor, report_assembler, and handoff_writer, reduced 113 pyright errors to zero, and organized the regression-test foundation.",
              },
            ],
          },
        ],
      },
      {
        title: "벤치마크·릴리즈·발표까지 직접 마무리",
        titleEn: "Benchmarking, Release & Presentation Ownership",
        items: [
          {
            text: "FirmAE 데이터셋 기반 대규모 벤치마크, analyst-ready evidence bundle 재설계, release gate, 문서 정합성, 외부 발표까지 직접 챙겼습니다.",
            textEn:
              "Owned the large-scale FirmAE benchmark, analyst-ready evidence bundle redesign, release gates, documentation consistency, and external presentation.",
            subItems: [
              {
                text: "벤치마크를 단순 성공률이 아니라 analysis rate와 analyst-ready rate를 분리해 보는 구조로 재설계했습니다.",
                textEn:
                  "Redesigned the benchmark to separate analysis rate from analyst-ready rate instead of reporting only raw success rates.",
              },
              {
                text: "v2.7.2 기준 수치와 문서를 정리하고, 2026년 5월 9일 프로젝트를 마무리해 Incognito Conference에서 발표했습니다.",
                textEn:
                  "Organized the v2.7.2 figures and documentation, concluded the project on May 9, 2026, and presented it at Incognito Conference.",
              },
            ],
          },
        ],
      },
    ],
    results: [
      {
        text: "FirmAE 데이터셋 1,123개 펌웨어 이미지 대상 검증에서 98.8% 성공률(1110/1123)을 달성했습니다.",
        textEn:
          "Achieved a 98.8% success rate (1110/1123) when validating against 1,123 firmware images from the FirmAE dataset.",
      },
      {
        text: "LLM-Adjudicated FPR 99.3%를 달성하고, 증거 기반 취약점 후보 생성 시스템으로 SCOUT v2.7.2를 완성했습니다.",
        textEn:
          "Achieved 99.3% LLM-adjudicated FPR and completed SCOUT v2.7.2 as an evidence-driven vulnerability candidate generation system.",
      },
      {
        text: "1,136개 이상의 테스트, release gate, 문서 정합성 검증을 통해 대규모 펌웨어 분석 파이프라인을 회귀 가능한 상태로 안정화했습니다.",
        textEn:
          "Stabilized the large-scale firmware analysis pipeline into a regression-testable state through 1,136+ tests, release gates, and documentation consistency checks.",
      },
      {
        text: "아키텍처 설계, 핵심 개발, 디버깅, 벤치마크, 테스트, 문서화, 발표까지 프로젝트의 대부분 핵심 작업을 엔드투엔드로 직접 수행했습니다.",
        textEn:
          "Executed most of the project's core work end-to-end, including architecture design, core development, debugging, benchmarking, testing, documentation, and presentation.",
      },
    ],
    lessons: [
      {
        text: "보안 자동화에서 중요한 것은 모델이 그럴듯한 답을 내는 것이 아니라, 모든 판단이 원본 바이트와 재현 가능한 근거로 되돌아갈 수 있게 만드는 것임을 배웠습니다.",
        textEn:
          "Learned that security automation is not about models producing plausible answers, but about making every judgment traceable back to original bytes and reproducible evidence.",
      },
      {
        text: "Agentic AI를 실제 취약점 분석에 적용하려면 자동화, 검증, 리포팅, 팀 운영을 하나의 시스템으로 설계해야 한다는 것을 경험했습니다.",
        textEn:
          "Experienced that applying Agentic AI to real vulnerability analysis requires designing automation, validation, reporting, and team operations as one integrated system.",
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
