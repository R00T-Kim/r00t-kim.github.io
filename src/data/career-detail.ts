export interface SubSection {
  title: string;
  titleEn: string;
  items: CareerDetailItem[];
}

export interface CareerDetailLink {
  label: string;
  labelEn: string;
  url: string;
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
  links?: CareerDetailLink[];
  background: CareerDetailItem[];
  role: SubSection[];
  results: CareerDetailItem[];
  lessons: CareerDetailItem[];
}

export const careerDetailSections: CareerDetailSection[] = [
  {
    id: "pwn2own-hue",
    title: "Pwn2Own Ireland 2026 - Philips Hue Bridge Pro",
    titleEn: "Pwn2Own Ireland 2026 - Philips Hue Bridge Pro",
    links: [
      {
        label: "ZDI 결과 발표",
        labelEn: "ZDI Results",
        url: "https://www.thezdi.com/blog/2026/10/6/pwn2own-ireland-2026-day-one-results",
      },
    ],
    background: [
      {
        text: "Pwn2Own은 Zero Day Initiative가 주최하는 해킹 대회로, 양산 상태의 실제 소비자 기기를 현장에서 공략해 익스플로잇 가능성을 입증하는 자리입니다.",
        textEn:
          "Pwn2Own is a hacking competition hosted by the Zero Day Initiative, where competitors must exploit real, retail consumer devices on-site to prove exploitability.",
      },
      {
        text: "Smart Home 부문의 대상인 Philips Hue Bridge Pro는 가정 내 조명과 연동 기기를 제어하는 허브로, 침해 시 홈 네트워크 내 다른 기기로의 확장 경로가 될 수 있는 기기였습니다.",
        textEn:
          "The Smart Home target, the Philips Hue Bridge Pro, is a hub that controls home lighting and connected devices, and a compromise of it can become a pivot point to other devices on the home network.",
      },
    ],
    role: [
      {
        title: "디버깅 환경 구축",
        titleEn: "Debugging Environment Setup",
        items: [
          {
            text: "대상 기기에 적용된 하드웨어 수준 완화 기법(미티게이션) 때문에, 취약점 분석에 앞서 기기 내부를 관측하고 디버거를 붙일 수 있는 환경을 만드는 것부터 시작했습니다.",
            textEn:
              "Because of the hardware-level mitigations applied to the target device, the work started with building an environment that could observe the device's internals and attach a debugger before any vulnerability analysis.",
          },
        ],
      },
      {
        title: "하드웨어 분석",
        titleEn: "Hardware Analysis",
        items: [
          {
            text: "기기의 하드웨어 구성과 인터페이스를 분석해 공격 표면과 내부 접근 경로를 파악했습니다.",
            textEn:
              "Analyzed the device's hardware layout and interfaces to map the attack surface and paths for internal access.",
          },
        ],
      },
      {
        title: "취약점 연구 및 익스플로잇",
        titleEn: "Vulnerability Research & Exploitation",
        items: [
          {
            text: "Out of Bounds 소속으로 취약점을 분석하고, 취약점 5개를 연결한 익스플로잇을 준비해 대회 현장에서 Philips Hue Bridge Pro에 대한 공격 가능성을 검증했습니다.",
            textEn:
              "As part of Out of Bounds, analyzed the vulnerabilities and prepared an exploit chaining five of them to validate exploitability of the Philips Hue Bridge Pro live at the competition.",
            subItems: [
              {
                text: "대회 규정상 발견한 취약점은 벤더에 보고되어 책임공개 절차를 따르며, 기술 세부는 패치 전까지 비공개로 유지됩니다.",
                textEn:
                  "Under the competition rules, the discovered vulnerabilities were reported to the vendor and follow coordinated disclosure, with technical details kept private until a patch is released.",
              },
            ],
          },
        ],
      },
    ],
    results: [
      {
        text: "Philips Hue Bridge Pro 익스플로잇 시연에 성공해 Pwn2Own Ireland 2026에서 Win을 기록했습니다.",
        textEn:
          "Successfully demonstrated the Philips Hue Bridge Pro exploit and recorded a Win at Pwn2Own Ireland 2026.",
      },
      {
        text: "상금 $12,000과 Master of Pwn 2.5점을 받았습니다.",
        textEn: "Awarded $12,000 and 2.5 Master of Pwn points.",
      },
    ],
    lessons: [
      {
        text: "하드웨어·임베디드 시스템에서는 소프트웨어처럼 바로 디버거를 붙일 수 없고, 하드웨어 미티게이션 때문에 기기를 관측 가능한 상태로 만드는 디버깅 환경 구축 자체가 집중해야 할 하나의 연구 과정임을 체감했습니다.",
        textEn:
          "Experienced that with hardware and embedded systems you cannot simply attach a debugger as with software; because of hardware mitigations, building a debugging environment that makes the device observable is itself a research effort that demands dedicated focus.",
      },
      {
        text: "실험 환경이 아니라 양산 소비자 기기를 정해진 시간 안에 현장에서 공략해야 하는 조건에서, 취약점 분석을 재현 가능한 익스플로잇으로 끝까지 완성하는 경험을 했습니다.",
        textEn:
          "Gained experience carrying vulnerability analysis through to a reproducible, working exploit under the constraint of attacking a retail consumer device on-site within a fixed time window, rather than in a lab setting.",
      },
      {
        text: "여러 취약점을 하나의 공격 경로로 연결하는 과정에서, 개별 결함보다 이들을 안정적으로 이어 붙이는 체인 구성이 실제 익스플로잇의 핵심임을 확인했습니다.",
        textEn:
          "In chaining multiple vulnerabilities into a single attack path, confirmed that reliably stitching them together, rather than any single flaw, is the core of a real exploit.",
      },
    ],
  },
  {
    id: "iot-doorbell",
    title: "IoT 스마트 도어벨 취약점 분석",
    titleEn: "IoT Smart Doorbell Vulnerability Analysis",
    links: [
      {
        label: "분석 가이드",
        labelEn: "Analysis Guide",
        url: "https://github.com/Brrester/IoT-Smart-Doorbell-Vulnerability-Analysis-Guide",
      },
    ],
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
        title: "제약 기반 생성 / 검증 구조 설계",
        titleEn: "Constrained Generation & Validation Design",
        items: [
          {
            text: "MuCamp2에서 LLM을 신뢰 경계 밖에 두고, 동일 tactic 후보 풀과 코드 수준 검증으로 TTP 변종 생성을 제한하는 구조를 설계 / 구현했습니다.",
            textEn:
              "Designed and implemented MuCamp2's architecture that keeps LLMs outside the trust boundary and constrains TTP mutation with same-tactic candidate pools and code-level verification.",
            subItems: [
              {
                text: "MITRE ATT&CK 기반 technique/tactic 매핑을 사용해 변이 후보를 제한하고, V1~V4 코드 검증으로 길이 / 인덱스 / 원본 보존 / 후보 풀 일치성을 확인했습니다.",
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
        title: "실험 / 재현 산출물 정리",
        titleEn: "Experiment & Reproducibility Artifacts",
        items: [
          {
            text: "Lazarus와 MenuPass 캠페인 시퀀스를 대상으로 SR baseline과 LLM few-shot 변종을 비교하고, 평가 스크립트 / 데이터 / GUI 재현 환경을 공개 저장소로 정리했습니다.",
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
        text: "MuCamp2 논문이 IEEE Access 2026에 게재되었고, IEEE Xplore 및 GitHub 저장소를 통해 논문 / 코드 산출물을 공개했습니다.",
        textEn:
          "The MuCamp2 paper was published in IEEE Access 2026, with paper and code artifacts released through IEEE Xplore and GitHub.",
      },
      {
        text: "tactic violation rate 0%를 달성하고, L3 pass rate에서 Lazarus +5.5pp, MenuPass +3.0pp의 개선을 보고했습니다.",
        textEn:
          "Reported a 0% tactic violation rate and L3 pass-rate improvements of +5.5 pp for Lazarus and +3.0 pp for MenuPass.",
      },
      {
        text: "LLM을 신뢰 주체가 아니라 제한된 선택 / 정제 모듈로 두고, 독립 검증기로 산출물을 gate하는 보안 연구 패턴을 정리했습니다.",
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
        text: "LLM 기반 보안 자동화는 모델 성능만으로 설득되지 않으며, 신뢰 경계 / 제약 조건 / 재현 가능한 평가 파이프라인이 함께 설계되어야 한다는 점을 배웠습니다.",
        textEn:
          "Learned that LLM-based security automation is not justified by model capability alone; trust boundaries, constraints, and reproducible evaluation pipelines must be designed together.",
      },
    ],
  },
  {
    id: "scout",
    title: "SCOUT - AEG-first 펌웨어-to-익스플로잇 증거 엔진",
    titleEn: "SCOUT - AEG-First Firmware-to-Exploit Evidence Engine",
    links: [
      {
        label: "GitHub",
        labelEn: "GitHub",
        url: "https://github.com/R00T-Kim/SCOUT",
      },
    ],
    background: [
      {
        text: "IoT 펌웨어 취약점 분석은 파일 시스템, ELF 바이너리, 쉘 스크립트, SBOM, CVE 매칭, 동적 검증 결과가 분리되어 있어 분석가가 바로 따라갈 수 있는 재현 가능한 근거 체인을 만들기 어려웠습니다.",
        textEn:
          "IoT firmware vulnerability analysis often separates filesystem, ELF binaries, shell scripts, SBOM, CVE matching, and dynamic validation results, making it difficult to build reproducible evidence chains that analysts can immediately follow.",
      },
      {
        text: "Agentic AI 기반 AEG를 실제 펌웨어 규모에 적용하려면, LLM의 추론보다 먼저 해시 / 오프셋 / 파일 경로 / stage 산출물로 검증 가능한 결정론적 증거 구조가 필요했습니다.",
        textEn:
          "To apply Agentic AI-based AEG at real firmware scale, a deterministic evidence structure anchored by hashes, offsets, file paths, and stage artifacts was required before relying on LLM reasoning.",
      },
    ],
    role: [
      {
        title: "End-to-End 시스템 오너십",
        titleEn: "End-to-End System Ownership",
        items: [
          {
            text: "SCOUT의 핵심 아키텍처, stage 오케스트레이션, 증거 스키마, Hybrid Analysis Engine, CLI/리포팅 흐름을 직접 설계하고 대부분의 구현을 주도했습니다.",
            textEn:
              "Designed SCOUT's core architecture, stage orchestration, evidence schema, Hybrid Analysis Engine, and CLI/reporting flow, while driving most of the implementation directly.",
            subItems: [
              {
                text: "펌웨어 입력부터 SARIF, CycloneDX SBOM+VEX, SLSA Provenance, 해시 앵커 증거 체인, AutoPoC 검증 경로까지 이어지는 자동 분석 경로를 구축했습니다.",
                textEn:
                  "Built the automated analysis path from firmware input to SARIF, CycloneDX SBOM+VEX, SLSA Provenance, hash-anchored evidence chains, and AutoPoC validation paths.",
              },
              {
                text: "v3.0.0-rc1에서 ELF 바이너리 분석과 쉘 스크립트 감사를 통합한 Hybrid Analysis Engine으로 확장하고, Zero pip dependencies 원칙을 유지했습니다.",
                textEn:
                  "Extended the platform in v3.0.0-rc1 into a Hybrid Analysis Engine that combines ELF binary analysis with shell-script auditing while preserving the zero-pip-dependencies principle.",
              },
              {
                text: "AI Agent가 취약점 후보와 증거 번들을 넘겨받아 후속 분석을 수행할 수 있도록 MCP 서버, handoff writer, metadata-only PoC intelligence 구조를 설계했습니다.",
                textEn:
                  "Designed the MCP server, handoff writer, and metadata-only PoC intelligence structure so AI agents could consume vulnerability candidates and evidence bundles for follow-up analysis.",
              },
            ],
          },
        ],
      },
      {
        title: "핵심 개발 / 디버깅 / 품질 안정화",
        titleEn: "Core Development, Debugging & Quality Stabilization",
        items: [
          {
            text: "CVE 매칭, ELF 하드닝 감사, 쉘 스크립트 분석, source/sink 식별, Exploit Pattern RAG, LLM triage, adversarial verification 등 핵심 분석 모듈을 직접 구현 / 디버깅했습니다.",
            textEn:
              "Directly implemented and debugged core analysis modules including CVE matching, ELF hardening audits, shell-script analysis, source/sink identification, Exploit Pattern RAG, LLM triage, and adversarial verification.",
            subItems: [
              {
                text: "2,528개 로컬 CVE DB/NVD 기반 매칭 엔진, 51개 sink coverage, format-string detector, LARA URI/CGI/config-key source identification을 구축했습니다.",
                textEn:
                  "Built a CVE matching engine backed by 2,528 local CVE/NVD entries, 51-sink coverage, a format-string detector, and LARA URI/CGI/config-key source identification.",
              },
              {
                text: "AutoPoC, poc_validation, verified_chain, FP/FPR gate, FirmAE/QEMU 에뮬레이션, AFL++ 퍼징, 4개 LLM 드라이버(Codex, Claude API, Claude Code, Ollama)를 파이프라인에 통합했습니다.",
                textEn:
                  "Integrated AutoPoC, poc_validation, verified_chain, FP/FPR gates, FirmAE/QEMU emulation, AFL++ fuzzing, and four LLM drivers (Codex, Claude API, Claude Code, Ollama) into the pipeline.",
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
        title: "벤치마크 / 릴리즈 / 발표까지 직접 마무리",
        titleEn: "Benchmarking, Release & Presentation Ownership",
        items: [
          {
            text: "FirmAE 데이터셋 기반 대규모 벤치마크, analyst-ready evidence bundle 재설계, v3 프리릴리즈 gate, 문서 정합성, 외부 발표까지 직접 챙겼습니다.",
            textEn:
              "Owned the large-scale FirmAE benchmark, analyst-ready evidence bundle redesign, v3 pre-release gates, documentation consistency, and external presentation.",
            subItems: [
              {
                text: "벤치마크를 단순 성공률이 아니라 analysis rate와 analyst-ready rate를 분리해 보는 구조로 재설계했습니다.",
                textEn:
                  "Redesigned the benchmark to separate analysis rate from analyst-ready rate instead of reporting only raw success rates.",
              },
              {
                text: "2026년 5월 9일 Incognito Conference 발표 이후 v3.0.0-rc1 Hybrid Analysis Engine과 Phase 3 AEG Plan IR readiness까지 문서를 정리했습니다.",
                textEn:
                  "After presenting at Incognito Conference on May 9, 2026, organized the v3.0.0-rc1 Hybrid Analysis Engine and Phase 3 AEG Plan IR readiness documentation.",
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
        text: "v3.0.0-rc1 프리릴리즈 기준 Hybrid Analysis Engine으로 확장하고, LLM Tribunal 기반 오탐 감소율 99.3%를 기록했습니다.",
        textEn:
          "Extended SCOUT into the v3.0.0-rc1 Hybrid Analysis Engine pre-release and recorded 99.3% LLM Tribunal-based false-positive reduction.",
      },
      {
        text: "TP-Link ER605 검증에서 1,334개 쉘 스크립트를 처리하고 TOP 20 script finding을 수동 검토해 binary-only 스캐너 한계를 보완했습니다.",
        textEn:
          "Processed 1,334 shell scripts in TP-Link ER605 validation and manually reviewed the top 20 script findings, reducing the blind spots of a binary-only scanner.",
      },
      {
        text: "Netgear R7000 CVE-2017-5521 real known-vulnerable/patched pair에서 vulnerable gate pass와 patched/control dynamic fail-closed 증거를 기록했습니다.",
        textEn:
          "Recorded vulnerable-gate-pass and patched/control dynamic fail-closed evidence on a real Netgear R7000 CVE-2017-5521 known-vulnerable/patched pair.",
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
        text: "AutoHack 2025는 실제 차량 시스템을 대상으로 한 해킹 / 방어 경진대회로, 실전 역량을 검증하는 기회였습니다.",
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
                text: "IVI(In-Vehicle Infotainment) 시스템 익스플로잇 및 UAV 보안 챌린지(RF 기반 Hijacking 후 소유권 탈취 시나리오 분석 / 재현)를 수행했습니다.",
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
  {
    id: "terminator",
    title: "Terminator - 자율 보안 에이전트 시스템",
    titleEn: "Terminator - Autonomous Security Agent System",
    links: [
      {
        label: "GitHub",
        labelEn: "GitHub",
        url: "https://github.com/R00T-Kim/Terminator",
      },
    ],
    background: [
      {
        text: "CTF 풀이와 버그바운티 헌팅은 분석, 익스플로잇 작성, 검증이 반복되는 과정이라, 사람이 수행하던 작업 흐름을 자율 에이전트로 옮길 수 있는지 확인하고 싶었습니다.",
        textEn:
          "CTF solving and bug bounty hunting repeat a cycle of analysis, exploit writing, and validation, so I wanted to see whether that human workflow could be moved onto autonomous agents.",
      },
      {
        text: "다만 LLM 기반 에이전트는 작동하지 않는 결과를 그럴듯하게 보고하는 문제가 있어, 검증을 먼저 강제하는 구조가 필요했습니다.",
        textEn:
          "However, LLM-based agents tend to report non-working results plausibly, so a structure that enforces verification first was required.",
      },
    ],
    role: [
      {
        title: "멀티 에이전트 설계 및 도구 통합",
        titleEn: "Multi-agent Design & Tool Integration",
        items: [
          {
            text: "Claude Code Agent Teams 기반으로 4개 도메인에 걸친 25개 전문 에이전트를 설계하고, 보안 도구와 지식 베이스를 파이프라인에 통합했습니다.",
            textEn:
              "Designed 25 specialized agents across 4 domains on top of Claude Code Agent Teams, and integrated security tools and a knowledge base into the pipeline.",
            subItems: [
              {
                text: "reverser, exploiter, critic, verifier 등 역할별 에이전트를 순차 파이프라인과 구조화된 핸드오프로 협업하게 구성했습니다.",
                textEn:
                  "Composed role-specific agents such as reverser, exploiter, critic, and verifier to collaborate through sequential pipelines and structured handoffs.",
              },
              {
                text: "14개 MCP 서버(gdb, radare2, Ghidra, Frida 등)와 40개 이상의 보안 도구, 28만 건 이상의 보안 지식 문서를 SQLite FTS5 검색 엔진으로 연결했습니다.",
                textEn:
                  "Connected 14 MCP servers (gdb, radare2, Ghidra, Frida, etc.), 40+ security tools, and 280,000+ security knowledge documents through a SQLite FTS5 search engine.",
              },
            ],
          },
        ],
      },
    ],
    results: [
      {
        text: "Verification-First 방법론(로컬 3회 검증 후 실행, Critic 에이전트 거부권)과 No-Exploit-No-Report 정책으로 작동하지 않는 결과의 보고를 차단했습니다.",
        textEn:
          "Blocked reporting of non-working results through a verification-first methodology (3x local validation before execution, critic-agent veto) and a no-exploit-no-report policy.",
      },
      {
        text: "CTF 30문제 이상 자동 풀이와 40건 이상의 버그바운티 리포트 제출을 달성했습니다.",
        textEn:
          "Achieved autonomous solving of 30+ CTF challenges and submission of 40+ bug bounty reports.",
      },
    ],
    lessons: [
      {
        text: "자율 보안 에이전트의 실질적 가치는 생성 능력보다, 작동하는 PoC로 검증되지 않은 결과를 걸러내는 게이트에 있다는 것을 확인했습니다.",
        textEn:
          "Confirmed that the real value of autonomous security agents lies less in generation capability and more in the gate that filters out results not backed by a working PoC.",
      },
    ],
  },
  {
    id: "autoglitch",
    title: "AUTOGLITCH - 폴트 인젝션 자동화 프레임워크",
    titleEn: "AUTOGLITCH - Autonomous Fault Injection Framework",
    links: [
      {
        label: "GitHub",
        labelEn: "GitHub",
        url: "https://github.com/R00T-Kim/autoglitch",
      },
    ],
    background: [
      {
        text: "임베디드 하드웨어 대상 폴트 인젝션(글리치)은 전압·타이밍 같은 파라미터 조합이 방대해, 사람이 수동으로 탐색하면 성공 조건을 찾기까지 많은 시행착오가 필요했습니다.",
        textEn:
          "Fault injection (glitching) against embedded hardware has a vast combination of parameters such as voltage and timing, so manually searching for successful conditions required extensive trial and error.",
      },
    ],
    role: [
      {
        title: "폐쇄 루프 탐색 파이프라인 설계",
        titleEn: "Closed-loop Search Pipeline Design",
        items: [
          {
            text: "파라미터 제안부터 하드웨어 실행, 결과 분류, 보상 신호, 최적화 반복까지 이어지는 폐쇄 루프 폴트 인젝션 파이프라인을 설계했습니다.",
            textEn:
              "Designed a closed-loop fault injection pipeline running from parameter suggestion through hardware execution, result classification, reward signal, and optimizer iteration.",
            subItems: [
              {
                text: "베이지안 최적화와 Stable Baselines3 기반 강화학습으로 글리치 파라미터를 자율 탐색하게 구현했습니다.",
                textEn:
                  "Implemented autonomous glitch-parameter search using Bayesian optimization and reinforcement learning via Stable Baselines3.",
              },
              {
                text: "ChipWhisperer USB 백엔드와 타입드 JSONL 시리얼 프로토콜을 구현하고, Mock 환경으로 하드웨어 없이도 개발과 CI 테스트가 가능하게 했습니다.",
                textEn:
                  "Built a ChipWhisperer USB backend and a typed JSONL serial protocol, and enabled development and CI testing without hardware through a mock environment.",
              },
            ],
          },
        ],
      },
    ],
    results: [
      {
        text: "127개 테스트와 전체 품질 게이트(ruff, mypy, pytest)를 통과했으며, 실제 임베디드 디바이스(STM32F3 등) 대상 하드웨어 검증을 후속 연구로 계획하고 있습니다.",
        textEn:
          "Passed 127 tests and all quality gates (ruff, mypy, pytest), with hardware validation on real embedded devices (STM32F3, etc.) planned as follow-up research.",
      },
    ],
    lessons: [
      {
        text: "하드웨어 보안 실험은 자동화를 설계할 때 하드웨어 없이도 반복 가능한 Mock 경로를 함께 만들어야, 실제 장비 접근이 제한된 상황에서도 연구를 이어갈 수 있다는 것을 배웠습니다.",
        textEn:
          "Learned that hardware security experiments need a repeatable mock path designed alongside the automation, so that research can continue even when access to real equipment is limited.",
      },
    ],
  },
  {
    id: "awesome-offensive-mcp",
    title: "Awesome Offensive MCP",
    titleEn: "Awesome Offensive MCP",
    links: [
      {
        label: "GitHub",
        labelEn: "GitHub",
        url: "https://github.com/R00T-Kim/awesome-offensive-mcp",
      },
    ],
    background: [
      {
        text: "Agentic AI 도구가 빠르게 늘면서 공격 보안 워크플로우에 쓸 수 있는 MCP 서버가 흩어져 있었고, 어떤 도구가 실제로 쓸 만한지 판단하기 어려웠습니다.",
        textEn:
          "As Agentic AI tooling grew quickly, MCP servers usable in offensive security workflows were scattered, and it was hard to judge which tools were actually usable.",
      },
    ],
    role: [
      {
        title: "큐레이션 및 검증",
        titleEn: "Curation & Verification",
        items: [
          {
            text: "Red Team, Pentest, 취약점 연구에 활용 가능한 MCP 서버를 수집하고, 커뮤니티 검증(30+ Stars) 또는 직접 검증을 거친 도구만 선별해 카테고리별로 정리했습니다.",
            textEn:
              "Collected MCP servers usable for Red Team, Pentest, and vulnerability research, then curated only community-verified (30+ stars) or personally verified tools and organized them by category with usage guides.",
          },
        ],
      },
    ],
    results: [
      {
        text: "GitHub Stars 18개를 기록하고, 공격 보안 커뮤니티에서 MCP 활용 레퍼런스로 공유되었습니다.",
        textEn:
          "Reached 18 GitHub stars and was shared as an MCP reference in the offensive security community.",
      },
    ],
    lessons: [
      {
        text: "도구 목록의 가치는 수집량이 아니라 검증 기준을 명확히 하는 데 있다는 것을 확인했습니다.",
        textEn:
          "Confirmed that the value of a tool list lies not in the volume collected but in making the verification criteria explicit.",
      },
    ],
  },
];
