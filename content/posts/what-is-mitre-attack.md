## 📚 MITRE ATT&CK 공부하기: 개념부터 파고들기

최근 학부연구생 생활을 시작했는데요, 저희 연구실의 주된 연구 주제가 <strong>MITRE ATT&CK</strong>입니다. <strong>MITRE</strong>는 CVE 발급해 주는 기관으로만 어렴풋이 알고 있었는데, 이런 프레임워크까지 정리하고 분석하는지는 몰랐습니다.

그래서 이번에는 <strong>MITRE ATT&CK</strong> <strong>Matrix</strong>, 특히 Enterprise에 대해 개념부터 시작해 제가 공부하며 이해한 내용을 보다 자세히 정리하려고 합니다.

---

## <strong>🚨 MITRE ATT&CK란 도대체 무엇인가?</strong>

처음 <strong>MITRE ATT&CK</strong>을 접했을 때 저는 이게 단순히 기술 목록이나 전술을 정리한 리스트 정도로 생각했습니다. 하지만 실제로는 훨씬 깊은 맥락이 담겨 있었습니다.

![출처: https://attack.mitre.org/](/blog/what-is-mitre-attack/01.png)

*출처: https://attack.mitre.org/*

### <strong>📍 MITRE ATT&CK의 탄생 배경</strong>

<strong>MITRE ATT&CK(Adversarial Tactics, Techniques, and Common Knowledge)</strong>는 MITRE Corporation에서 사이버 <strong>공격자들의 실제 행동을 분석하고 정리한 프레임워크</strong>입니다. <strong>MITRE Corporation</strong>은 원래 미국 정부가 후원하는 비영리 연구 기관으로, 특히 국방 및 사이버 보안 분야에서의 연구를 수행하고 있습니다. MITRE는 최근에 지원이 끊긴다는 이슈가 있었죠! (일단 유지돼서 다행이라고 생각합니다.)

> <strong>왜</strong> 이런 프레임워크가 등장하게 되었을까요?  

사이버 공격이 갈수록 정교해지고 다양한 형태로 진화하면서 기존의 <strong>"침입 방어"</strong>에만 초점을 맞춘 접근 방식으로는 한계가 명확했습니다. 특히 <strong>APT(Advanced Persistent Threat)</strong>라고 불리는 지능적이고 지속적인 공격의 증가가 큰 원인이었습니다.

이러한 공격은 대부분 단순히 악성 프로그램 설치 정도가 아니라, 조직 내부 깊숙이 침투하여 오랜 기간에 걸쳐 지속적인 피해를 주는 형태입니다. 이런 공격을 방어하려면 <strong>"공격자의 시점"</strong>에서 그들의 행동을 철저히 이해하고 방어 전략을 수립할 필요가 있었습니다.

이런 필요성에서 등장한 것이 바로 <strong>MITRE ATT&CK</strong>입니다.

### <strong>📍 ATT&CK의 핵심 목표</strong>

MITRE ATT&CK은 기본적으로 다음과 같은 목표를 가지고 만들어졌습니다:

-   공격자의 <strong>행동 패턴을 분석하고 이해</strong>하기
-   공격자의 행동을 <strong>"전술(Tactics)"과 "기술(Techniques)"</strong>이라는 구조로 명확히 정리하기
-   보안팀이 보다 <strong>효과적으로 방어 전략을 수립</strong>하고, <strong>탐지 규칙을 설계</strong>하도록 돕기
-   <strong>공격 시나리오를 기반으로 방어 체계를 평가</strong>하고, <strong>보안 도구의 효율성을 측정</strong>하기

공부를 하다 보니 이 프레임워크가 보안 업계에서 왜 널리 쓰이는지 점점 이해가 가기 시작했습니다.

![출처: https://mitre-attack.github.io/attack-navigator/](/blog/what-is-mitre-attack/02.png)

*출처: https://mitre-attack.github.io/attack-navigator/*

---

## <strong>🔍 MITRE ATT&CK의 구조</strong>

MITRE ATT&CK은 기본적으로 3가지 큰 축으로 구성됩니다: <strong>전술(Tactics)</strong>, <strong>기술(Techniques)</strong>, <strong>절차(Procedures).</strong>

### <strong>📌 전술(Tactics)</strong>

<strong>"전술"</strong>은 공격자의 궁극적인 목적이나 목표를 나타냅니다. 즉, 공격자가 <strong>"무엇을 달성하려 하는가"</strong>를 정의한 것입니다.

Enterprise Matrix의 전술 목록은 다음과 같습니다:

-   <strong>Reconnaissance (정찰):</strong> 공격 전 공개 소스, 직원 SNS, 도메인 정보 등을 수집해 <strong>표적을 조사</strong>하는 활동
-   <strong>Resource Development (자원 개발):</strong> 악성 도메인, C2 인프라, 계정, 툴킷 등 공격에 필요한 <strong>자원을 준비하거나 구매</strong>하는 단계
-   <strong>Initial Access (초기 접근):</strong> 피싱, 취약점 악용, 자격 증명 탈취 등을 통해 <strong>네트워크나 시스템에 처음 침투</strong>하는 단계
-   <strong>Execution (실행):</strong> 침투한 시스템에서 악성 코드, 스크립트, 명령어 등을 실행해 <strong>공격 행위를 개시</strong>하는 단계
-   <strong>Persistence (지속성 유지):</strong> <strong>재부팅·패치 후에도 공격자가 계속 접근</strong>할 수 있도록 백도어, 서비스 등록, 스케줄 작업 등을 설치하는 기법
-   <strong>Privilege Escalation (권한 상승):</strong> 일반 사용자 권한에서 <strong>관리자 권한을 획득</strong>해 시스템 전체를 제어할 수 있도록 권한을 높이는 단계
-   <strong>Defense Evasion (방어 회피):</strong> 안티바이러스 우회, 로그 삭제, 난독화 등 <strong>탐지·차단 기술을 회피하거나 지연</strong>시키는 기법
-   <strong>Credential Access (자격 증명 접근):</strong> 키로깅, 메모리 덤프, 패스워드 덤프 툴 등을 이용해 <strong>사용자 이름·비밀번호·토큰 등을 탈취</strong>하는 단계
-   <strong>Lateral Movement (횡적 이동):</strong> 내부 네트워크에서 다른 호스트로 이동하며 <strong>권한을 확장하거나 추가 정보를 수집</strong>하는 기법
-   <strong>Collection (정보 수집):</strong> 중요 문서, 암호화 키, 통화 기록 등 <strong>목표 데이터를 중앙 장소에 모아두는 단계</strong>
-   <strong>Command and Control (명령 제어):</strong> 원격지에서 감염 시스템을 제어하고 상태를 수집할 수 있는 <strong>통신 채널을 설정·운영</strong>하는 단계
-   <strong>Exfiltration (데이터 유출):</strong> 수집한 데이터를 네트워크 <strong>외부로 몰래 전송해 탈취</strong>하는 단계
-   <strong>Impact (영향력 행사):</strong> 랜섬웨어 암호화, 데이터 삭제, 서비스 중단 등으로 <strong>시스템을 무력화하거나 데이터를 손상</strong>시키는 행동

![출처: https://delinea.com/blog/what-is-the-mitre-attack-framework](/blog/what-is-mitre-attack/03.jpg)

*출처: https://delinea.com/blog/what-is-the-mitre-attack-framework*

### <strong>📌 기술(Techniques)</strong>

<strong>"기술"</strong>은 위에서 말한 <strong>전술을 실행하기 위한 구체적인 방법</strong>입니다. 각 전술 아래에는 수많은 기술이 정의되어 있으며, 실제 사례를 기반으로 지속적으로 추가되고 업데이트됩니다.

예를 들어, <strong>Initial Access</strong> 전술 아래 기술 중 하나가 바로 피싱(Phishing)인데, 피싱은 다시 세부적으로 "스피어피싱(Spearphishing)" 등으로 더 세부적으로 나뉘어 있습니다.

![출처: https://attack.mitre.org/techniques/T1566/](/blog/what-is-mitre-attack/04.png)

*출처: https://attack.mitre.org/techniques/T1566/*

또한, 해당 <strong>Technique</strong>을 사용했던 <strong>APT 그룹</strong>들과 해당 내용에 관한 설명, <strong>Mitigations(완화 방안)</strong>이나 <strong>Detection(탐지)</strong>도 같이 정리되어 있어, 구체적으로 어떻게 적용/완화/탐지할 수 있는지까지 파악하기 수월합니다.

![Phishing 기술을 사용한 APT 그룹의 예시](/blog/what-is-mitre-attack/05.png)

*Phishing 기술을 사용한 APT 그룹의 예시*

### <strong>📌 절차(Procedures)</strong>

<strong>"절차(Procedures)"</strong>는 특정 기술(Technique)이 실제 공격에서 <strong>어떻게</strong> 사용되는지를 <strong>단계별로 설명하는 매우 구체적인 공격 시나리오</strong>입니다. ATT&CK에서는 <strong>공격자 그룹별로(APT29, APT3, Kimsuky 등) 식별된 대표적 절차를 제공</strong>하며, 이를 통해 방어 팀은 실제 탐지·대응 룰을 설계할 때 실전 감각을 높일 수 있습니다.

---

## <strong>🎯 TTP(Tactics, Techniques, Procedures)의 중요성</strong>

TTP는 공격자의 행동을 이해하고 분석하는 데 핵심적인 개념입니다. TTP를 공부하면서 저는 왜 Threat Intelligence 분석에서 TTP가 필수 요소인지 깨닫게 되었습니다.

-   <strong>전술(Tactics)</strong>: 공격자의 목적
-   <strong>기술(Techniques)</strong>: 목적 달성 방법
-   <strong>절차(Procedures)</strong>: 실제 공격 그룹의 세부 실행 방식

공격자의 TTP를 파악하면 미리 대응 전략을 세우거나, 공격자의 다음 행동을 예측하여 효과적으로 방어할 수 있는 가능성이 높아집니다. 또한, <strong>공격 시나리오 전반에 대한 이해와 그에 따른 완화/탐지 방법도 더 폭넓게 공부</strong>할 수 있습니다.

---

## <strong>⚙️ MITRE ATT&CK의 실제 활용법</strong>

공부를 하며 발견한 ATT&CK의 다양한 활용법을 간단히 정리했습니다:

-   <strong>SOC의 위협 탐지</strong>: 공격자의 행동을 분석하고 탐지 규칙 표준화
-   <strong>레드팀 및 침투 테스트</strong>: 현실적인 공격 시나리오 구성
-   <strong>보안 전략 수립</strong>: 보안의 취약점을 명확히 파악하여 대응 전략 수립
-   <strong>위협 인텔리전스 분석</strong>: 표준화된 방식으로 정보를 교환

저는 연구실에서 레드팀 역할을 맡아, <strong>ATT&CK 프레임워크를 연구</strong>하고, <strong>APT 그룹별 공격 시나리오를 공부</strong> 중입니다! 궁극적으로는 <strong>LLM을 활용해 ATT&CK 기반 공격 시나리오를 작성하여 직접 시뮬레이션</strong>하는 것을 목표로 하고 있습니다.

---

## <strong>🚀 결론</strong>

이처럼 보안 전반적인 구성과 공방의 흐름을 이해하는 데 있어 ATT&CK 프레임워크는 필수입니다. <strong>Enterprise</strong> 뿐 아니라, <strong>Mobile, ICS(산업제어시스템)</strong>에 대한 Matrix도 제공되고 있으니, 관심 분야가 맞으시다면 확인해보셔도 좋을 것 같습니다.

---

#### 잡설

화이트햇 스쿨 프로젝트 기간도 시작되고, 연구실 처음 들어와 인프라 구축하고 정신이 하나도 없네요. 바쁘지만, 행복하게 지내는 저와 여러분이 됐으면 좋겠습니다.

다음 글은 아마 모바일 해킹, 보안 전략 가이드, APT29 중에 하나가 될 것 같습니다. 감사합니다.
