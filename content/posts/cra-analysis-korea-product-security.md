## CRA 분석: 취약점이 수출 장벽이 될 때, 한국 Product Security 시장은 커질까

> <strong>작성 기준:</strong> 2026년 5월 31일 기준 공개된 공식 문서와 통계를 바탕으로 작성했다.  
> 이 글에서 <strong>\[확인된 사실\]</strong>은 법령·정부기관·공식 통계로 확인 가능한 내용이고, <strong>\[분석\]</strong>과 <strong>\[전망 시나리오\]</strong>는 그 사실을 바탕으로 한 해석이다.  
> 이 글은 법률 자문이 아니라, 제품보안 연구자의 관점에서 규제와 시장의 연결 구조를 분석한 글이다.

---

## 1\. Overview

스마트카메라 펌웨어에 하드코딩된 계정이 남아 있다.  
라우터에는 지원이 끝난 오픈소스 라이브러리가 포함되어 있다.  
스마트홈 장비의 OTA 업데이트는 서명 검증이나 rollback 방어가 불명확하다.  
취약점을 제보하려 해도 제조사의 security contact나 공개된 패치 정책을 찾기 어렵다.

이 문제들은 새롭지 않다.

그럼에도 많은 제품은 시장에 출시되었고, 취약점이 발견된 이후에도 계속 판매되었다. 제품보안이 중요하지 않았기 때문이 아니다. 상당수 디지털 제품 시장에서 제품보안은 오랫동안 <strong>판매의 선행조건</strong>이라기보다, 사고가 발생한 뒤 처리하는 비용으로 남아 있었기 때문이다.

EU의 <strong>Cyber Resilience Act</strong>, 이하 <strong>CRA</strong>는 이 구조를 바꾼다.

CRA는 EU 시장에 제공되는 디지털 요소 포함 제품, 즉 네트워크나 다른 장치와 연결되는 하드웨어·소프트웨어에 대해 설계, 출시, 취약점 처리, 업데이트, 기술문서, 적합성 평가까지 생애주기 수준의 사이버보안 책임을 부과한다. 핵심은 단순히 “취약점이 없어야 한다”가 아니다. 제조사가 제품을 판매하고 계속 지원하려면, <strong>무엇이 들어 있는지 알고, 어떤 취약점이 영향을 주는지 판단하며, 패치하고, 신고하고, 그 전 과정을 증명할 수 있어야 한다</strong>는 점이다.\[1\]\[2\]

이 글의 질문은 하나다.

> 자동차에서 UN R155/R156가 차량 사이버보안을 형식승인과 연결하면서 전문 보안시장의 수요를 키웠듯, CRA는 IoT·펌웨어·소프트웨어 영역에서 Product Security 시장을 본격적으로 키울 것인가?

  
먼저 결론부터 말하면 다음과 같다.

> <strong>\[분석\] CRA는 Product Security 시장을 무(無)에서 창조하는 규제라기보다, 이미 존재하던 제품보안 수요를 EU 시장 접근 조건과 제조사의 사후 책임으로 묶어 하나의 구매시장으로 응집시키는 촉매가 될 가능성이 높다. 특히 수출 제조업과 연결형 제품 기반이 강한 한국에서는 SBOM, PSIRT, 펌웨어 분석, Secure Update, 적합성 증적 자동화 영역의 수요가 확대될 조건이 충분하다. 다만 모든 제조사가 내부 Product Red Team을 대규모로 구축하거나, 자동차와 동일한 형태의 고가 평가시장이 그대로 복제된다고 단정할 수는 없다.</strong>

---

## 2\. Background: 제품보안은 필요했지만, 판매 조건은 아니었다

IoT와 임베디드 제품의 공격면은 대개 하나의 코드베이스에 머물지 않는다.

```
Mobile App
  ↕
Cloud API / Account System
  ↕
Device Protocol
  ↕
Firmware / Bootloader / Update Mechanism
  ↕
Hardware Interface
```

스마트카메라 하나만 보더라도 모바일 앱 인증, 클라우드 API, 로컬 웹 인터페이스, P2P 통신, 펌웨어 내부 바이너리, OTA 업데이트 경로, UART/JTAG와 같은 물리 인터페이스까지 하나의 제품 공격면으로 연결될 수 있다.

문제는 이 공격면을 유지보수하는 비용이 제품 가격과 출시 속도에 직접 충돌한다는 점이다.

| 반복되는 문제 | 기술적 의미 | 제조사 입장에서 미뤄지기 쉬웠던 이유 |
| --- | --- | --- |
| 하드코딩된 계정·키 | 인증 우회, 기기 탈취, fleet compromise | 출하 이후 수정 비용이 큼 |
| 오래된 OSS 컴포넌트 | 알려진 CVE의 지속 노출 | 제품 내부 구성요소 자체를 모르는 경우가 있음 |
| 취약한 OTA | 악성 펌웨어 배포, downgrade 공격 | 기능 업데이트가 우선되고 보안 설계는 후순위가 되기 쉬움 |
| CVD·PSIRT 부재 | 제보 방치, 패치·공개 조정 실패 | 전담 인력과 운영 프로세스가 필요함 |
| 지원 종료 정책 부재 | 사용자가 안전한 사용기간을 알 수 없음 | 장기 패치 비용을 판매 시점에 반영하기 어려움 |
| 제품 버전 추적 부재 | 어떤 SKU가 영향받는지 판단 불가 | ODM·외부 SDK·다품종 구조가 복잡함 |

취약점은 존재했지만, 그것이 항상 즉시 판매 차단이나 수출 실패로 이어지지는 않았다. 보안은 중요했으나, 제품을 출시하기 위한 필수 증적과 연결되지 않은 경우가 많았다.

CRA의 의미는 여기서 출발한다. 기존의 기술적 위험을 다음과 같은 경제적 위험으로 변환한다.

```
security weakness
  → regulatory non-conformity
  → market access / distribution risk
  → mandatory security spending
```

---

## 3\. Cyber Resilience Act: Product Security가 시장 진입 조건이 되는 법

### 3.1 적용 대상과 적용 제외

<strong>\[확인된 사실\]</strong> CRA는 `Regulation (EU) 2024/2847`로, EU 시장에 제공되는 <strong>products with digital elements</strong>를 대상으로 한다. EU 집행위원회의 설명에 따르면 여기에는 하드웨어와 소프트웨어 최종 제품뿐 아니라, 별도로 시장에 공급되는 컴포넌트와 제품 기능 수행에 필수적인 제조사 책임 하의 원격 데이터 처리 솔루션도 포함된다.\[1\]

적용 판단의 핵심은 제품의 intended purpose 또는 reasonably foreseeable use가 장치나 네트워크에 대한 직·간접적 논리적 또는 물리적 데이터 연결을 포함하는가이다.\[1\]

| 제품·기능 | CRA와의 관계 |
| --- | --- |
| 라우터, 모뎀, 네트워크 스위치 | Annex III의 중요 제품군에 포함 |
| 보안카메라, 스마트도어락, 베이비모니터, 알람 시스템 | 보안 기능을 가진 스마트홈 제품으로 Annex III에 포함 |
| VPN, 비밀번호 관리자, 네트워크 관리 시스템, SIEM, 운영체제 | Annex III의 중요 제품군에 포함 |
| 방화벽, IDS/IPS, 하이퍼바이저, 컨테이너 런타임 | Annex III Class II 제품군에 포함 |
| Secure element, 스마트카드 등 | Annex IV의 critical product 범주와 연결 |
| 일반적인 상업용 연결형 하드웨어·소프트웨어 | 중요·핵심 분류가 아니더라도 CRA 일반 요구사항의 대상이 될 수 있음 |

여기서 자동차 비교를 할 때 반드시 구분해야 할 지점이 있다.

<strong>\[확인된 사실\] 자동차 자체는 CRA의 대표 적용 대상이 아니다.</strong> CRA는 Regulation (EU) 2019/2144가 적용되는 자동차 관련 디지털 요소 제품을 일반 적용 범위에서 제외한다.\[2\] 자동차는 이미 별도의 차량 형식승인·사이버보안 규제 체계가 있기 때문이다.

따라서 이 글에서 자동차는 CRA 직접 적용 사례가 아니라, <strong>제품보안 규제가 산업 수요를 어떻게 바꾸는지 보여 주는 선행 비교사례</strong>로만 사용한다.

### 3.2 시행 일정

CRA의 압력은 한 번에 오지 않는다. 기업에게 실질적인 준비 기한은 두 단계로 다가온다.

| 날짜 | 확인된 적용 내용 | 기업이 준비해야 할 것 |
| --- | --- | --- |
| 2024년 12월 10일 | CRA 발효 | 대상 제품군·공급망 영향 파악 시작 |
| 2026년 6월 11일 | 적합성 평가기관 통지 관련 Chapter IV 적용 | 평가 생태계와 notified body 대응 준비 |
| 2026년 9월 11일 | Article 14의 신고 의무 적용 | 악용 취약점·중대한 사고 인지 및 보고 프로세스 |
| 2027년 12월 11일 | 주요 CRA 의무 전면 적용 | 제품보안 요구사항, 적합성 평가, 기술문서, CE 체계 |

특히 중요한 것은 <strong>신고 의무가 주요 제품보안 의무의 전면 적용보다 먼저 시작된다</strong>는 점이다.

EU 집행위원회는 2026년 9월 11일부터 제조사가 인지한 actively exploited vulnerability와 제품 보안에 영향을 미치는 severe incident를 ENISA의 Single Reporting Platform을 통해 보고해야 한다고 설명한다. 초기 경보는 인지 후 24시간, 주요 신고는 72시간, 실제 악용 취약점의 최종 보고는 시정 또는 완화조치가 가능해진 뒤 14일 이내가 기준이다.\[1\]\[3\]

또한 보고 의무는 2027년 12월 이전에 이미 EU 시장에 제공된 제품에도 적용될 수 있다.\[1\]

이 한 문장만으로도 기업 내부에서 필요한 기능이 드러난다.

```
"우리 제품에서 문제가 발견되면 고친다."
```

만으로는 부족하다.

```
"어떤 제품과 버전이 EU에 공급되었고,
 어떤 취약점이 실제로 영향을 주며,
 누가 24시간 이내에 판단하고 신고하며,
 어떤 패치와 고객 공지를 배포할 것인가."
```

를 운영할 수 있어야 한다.

### 3.3 제조사가 실제로 부담하는 의무

<strong>\[확인된 사실\]</strong> CRA의 제조사 의무는 설계·개발·생산·유지보수 단계 전체에 걸친다. 제조사는 사이버보안 위험평가를 수행하고 이를 기술문서에 포함해야 하며, 출시 전 적합성 평가를 진행하고, 적합한 경우 EU Declaration of Conformity와 CE 표시를 갖춰야 한다.\[1\]\[2\]

| CRA가 요구하는 영역 | 실제 Product Security 업무로 번역하면 |
| --- | --- |
| 사이버보안 위험평가 | Threat Modeling, Attack Surface Review, Risk Treatment |
| Essential cybersecurity requirements 충족 | Secure by Design / Secure by Default, 인증·권한·암호화·로깅·공격면 최소화 |
| Vulnerability handling | 취약점 접수, 재현, 영향도 판단, 패치, 공개 조정 |
| SBOM 작성 | 구성요소 식별, 버전 추적, OSS·서드파티 의존성 관리 |
| 지원기간 명시 | 제품별 EOL/EOS 정책과 패치 제공 계획 |
| 보안 업데이트 제공 | 안전한 배포, OTA 검증, 릴리스·백포트 관리 |
| 보고 의무 | PSIRT, 사고 분류, ENISA/CSIRT 보고 프로세스 |
| 적합성 평가·기술문서 | 테스트 결과, 위험평가, 보안 증적, CE 대응 |

CRA는 제조사가 제품의 취약점과 구성요소를 식별하고 문서화하도록 요구하며, 여기에는 <strong>기계 판독 가능한 형식의 SBOM을 작성하고 최소한 최상위 의존성을 포함하는 것</strong>이 들어간다.\[2\]

다만 여기서 한 가지 오해는 피해야 한다.

> <strong>\[확인된 사실\] CRA가 직접 요구하는 것은 SBOM이다. VEX와 SCA라는 용어 자체를 법적 의무로 직접 지정한 것은 아니다.</strong>

  
VEX는 특정 취약점이 특정 제품에 실제 영향을 미치는지 표현하는 실무 형식이고, SCA는 구성요소와 알려진 취약점을 추적하는 구현 수단이다. CRA가 요구하는 SBOM, 취약점 처리, 빠른 신고를 현실적으로 운영하려면 VEX와 SCA가 유력한 실무 도구가 될 수 있다는 것이지, 법 조문이 그 도구명을 그대로 강제하는 것은 아니다.\[4\]\[5\]

### 3.4 적합성 평가와 제재

<strong>\[확인된 사실\]</strong> 일반 제품은 조건에 따라 제조사 자체평가 경로를 사용할 수 있지만, Annex III와 Annex IV의 important·critical product는 제품 분류와 적용 표준 여부에 따라 제3자 적합성 평가 또는 사이버보안 인증 경로가 요구될 수 있다.\[1\]\[2\]

즉, 스마트카메라·라우터·보안 소프트웨어처럼 Annex III에 직접 닿는 제품군은 “내부에서 보안 체크리스트 한 번 돌렸다”는 수준으로 끝나지 않을 수 있다.

핵심 의무 위반에 대해서는 최대 <strong>1,500만 유로 또는 전년도 전 세계 연매출의 2.5% 중 더 큰 금액</strong>까지의 행정벌금 체계가 규정되어 있다.\[2\]

정리하면 CRA의 핵심은 다음과 같다.

```
제품 출시
  ≠ 기능 구현 완료

제품 출시
  = 기능 구현
  + 사이버보안 위험평가
  + 취약점·컴포넌트 관리
  + 업데이트·지원기간 운영
  + 신고 체계
  + 적합성 증적
```

---

## 4\. Automotive Precedent: 자동차에서는 이미 유사한 변화가 먼저 일어났다

### 4.1 자동차 규제의 구조

<strong>\[확인된 사실\]</strong> 자동차 분야에서는 UNECE의 <strong>UN Regulation No. 155</strong>가 차량 사이버보안과 Cyber Security Management System, 즉 CSMS를 다루고, <strong>UN Regulation No. 156</strong>이 소프트웨어 업데이트와 Software Update Management System, 즉 SUMS를 다룬다. UNECE는 EU에서 이 체계가 2022년 7월부터 신규 차량 유형에, 2024년 7월부터 모든 신차에 적용된다고 설명했다.\[6\]

또한 <strong>ISO/SAE 21434:2021</strong>은 차량 전기·전자 시스템의 생애주기 사이버보안 엔지니어링을 다루는 국제표준이다. ISO/SAE 21434는 법률 자체라기보다, 차량 제조사와 공급사가 위협분석·위험평가·개발·운영 프로세스를 구조화하는 표준이다.\[7\]

| 자동차 영역 | 기능 |
| --- | --- |
| UN R155 | 차량 사이버보안 및 CSMS 요구, 형식승인과 연결 |
| UN R156 | 소프트웨어 업데이트 관리 및 SUMS 요구 |
| ISO/SAE 21434 | 차량 생애주기 사이버보안 엔지니어링 표준 |
| TARA | 차량 자산·위협·공격경로·리스크 분석 |
| Vehicle Pentest / OTA Verification | 기술적 검증과 승인 증적 보조 |

### 4.2 CRA와 자동차 규제의 관계: 동일 법률이 아니라 동일한 경제 압력

CRA와 자동차 규제는 법적 적용 대상이 다르다. 자동차 본체는 CRA의 일반 대상에서 제외되고, 별도의 차량 규제 체계에 속한다.

그럼에도 경제적 메커니즘은 비교할 수 있다.

| 자동차 보안 규제 | CRA 기반 일반 제품보안 |
| --- | --- |
| 차량 형식승인과 CSMS/SUMS | 디지털 제품의 CRA 적합성 평가와 CE 체계 |
| ECU·IVI·TCU·OTA | 펌웨어·앱·API·클라우드·OTA |
| TARA·Vehicle Pentest | Threat Modeling·Firmware/IoT Pentest |
| 차량 공급망 증적 | SBOM·컴포넌트·패치·지원기간 증적 |
| 현장 차량 업데이트 관리 | 판매된 제품의 보안 업데이트·취약점 신고 |

여기서 시장 형성의 핵심은 단순하다.

> <strong>\[분석\] 규제가 취약점을 새로 만든 것은 아니다. 규제가 이미 존재하던 공격면을 제조사가 예산을 들여 관리하고, 외부에서 구매하며, 문서로 증명해야 하는 대상으로 바꿨다.</strong>

  
자동차 사이버보안 분야에 AUTOCRYPT, FESCARO와 같은 전문기업이 존재하고, 이들이 UN R155/R156·CSMS·TARA·보안 테스팅 등 규제 및 기술 서비스를 사업 영역으로 제시하고 있다는 사실은 확인할 수 있다.\[13\]\[14\] 그러나 이 사실만으로 “UN R155가 이 기업들을 만들었다”고 단정할 수는 없다. 커넥티드카, OTA, 소프트웨어 정의 차량, 공급망 복잡도 증가도 함께 작용했다.

하지만 규제가 차량 사이버보안을 형식승인과 연결하면서 CSMS/SUMS 구축, TARA, 침투테스트, OTA 검증, 인증 증적 지원이 제조사와 공급사에게 회피하기 어려운 구매 항목이 된 것은 충분히 합리적인 해석이다.

CRA를 바라볼 때도 같은 방식으로 접근해야 한다. “CRA 하나로 Product Security 기업이 우후죽순 생긴다”가 아니라, <strong>기술 위험이 시장 접근 위험으로 변하면서 반복적으로 돈을 지불할 이유가 생긴다</strong>는 것이 핵심이다.

---

## 5\. Mechanism: 취약점은 어떻게 구매예산이 되는가

CRA 이전의 제품보안 대응은 제조사에 따라 다음과 같이 흘러갈 수 있었다.

```
제품 개발
  → 기능 중심 출시
  → 취약점 발견
  → 대응 비용과 침해 가능성 계산
  → 패치 지연 또는 제품별 임시 대응
  → 지원정책이 불명확해도 판매 지속
```

CRA가 적용되는 제품에서는 흐름이 달라진다.

```
EU 판매 대상 제품 식별
  → 제품 분류 및 위험평가
  → SBOM·컴포넌트·버전 인벤토리 구축
  → 보안 요구사항과 업데이트 체계 반영
  → 적합성 평가·기술문서·CE 준비
  → 출시 및 지원기간 운영
  → 취약점·실제 악용 모니터링
  → 신고·패치·사용자 고지·증적 갱신
```

이 흐름은 각각 별도의 역할과 도구 수요로 번역된다.

| 법적·운영 요구 | 발생하는 기술 업무 | 구매될 수 있는 서비스·도구 |
| --- | --- | --- |
| 제품 범위·분류 판단 | 제품 포트폴리오와 SKU 분석 | CRA Gap Assessment, Product Inventory |
| 사이버보안 위험평가 | Threat Modeling, Security Architecture Review | Product Security Consulting |
| SBOM 작성·구성요소 문서화 | 펌웨어·바이너리·빌드 구성요소 식별 | SBOM/SCA Platform, Firmware SBOM |
| 취약점 처리 | 영향도·도달성·악용 가능성 판단 | VEX Workflow, Vulnerability Triage |
| 지원기간·보안 업데이트 | OTA, signing, rollback 방지, 릴리스 추적 | Secure Update Platform |
| 24/72시간 신고 | 접수·재현·보고·공지 프로세스 | PSIRT, Managed Vulnerability Response |
| 적합성 평가·CE | 테스트 결과와 문서 증적 축적 | Assurance, Lab, Evidence Automation |
| 고위험 제품 검증 | 심층 공격 검증·펌웨어 리버싱 | Product Pentest, Red Team, Research |

<strong>\[분석\] 이 표가 의미하는 것은 CRA의 첫 수혜시장이 반드시 레드팀은 아니라는 점이다.</strong>

제조사가 제품에 무엇이 들어 있는지 모르고, EU에 어떤 버전을 팔았는지 모르고, 지원기간과 제보창구조차 정리하지 못한 상태라면 고급 exploit 연구부터 살 이유가 없다.

먼저 필요한 것은 다음이다.

```sql
Inventory
  → SBOM
  → Vulnerability Handling
  → Update Governance
  → Conformity Evidence
  → Deep Technical Validation
```

즉 초기 시장은 <strong>증적과 운영의 시장</strong>으로 시작하고, 이후 고위험 제품과 대규모 제조사를 중심으로 <strong>심층 검증과 Product Red Team 시장</strong>이 강해질 가능성이 높다.

---

## 6\. If the Market Forms: CRA 이후 실제로 벌어질 일들

이 절부터는 법령에 적힌 사실이 아니라, CRA의 의무구조와 자동차 선행사례를 바탕으로 한 <strong>전망 시나리오</strong>다.

### 6.1 제조사 내부: 제품보안의 조직화

<strong>\[전망 시나리오\]</strong> 가장 먼저 변화하는 곳은 보안업체가 아니라 제조사 내부일 가능성이 높다.

많은 제조사는 지금까지 제품 개발팀, 품질팀, 인증팀, CS팀, 보안팀이 분리되어 있었을 수 있다. CRA는 이 역할들을 제품 생애주기 안에서 연결하도록 압박한다.

| 내부 변화 | 발생 이유 |
| --- | --- |
| EU 판매 제품·버전 인벤토리 작성 | 신고와 패치 대상을 판단하려면 어떤 제품이 팔렸는지 알아야 함 |
| 지원기간과 EOL 정책 수립 | 구매 시점부터 지원 종료 시점을 제시해야 함 |
| SBOM 생성·갱신 프로세스 | 구성요소와 취약점 영향도를 관리해야 함 |
| PSIRT 또는 제품 취약점 대응 창구 구축 | 제보·재현·패치·공지·신고를 조정해야 함 |
| 출시 전 보안 게이트 도입 | 적합성 평가와 기술문서의 입력이 필요함 |
| OTA·릴리스 프로세스 개편 | 지원기간 동안 안전한 업데이트를 배포해야 함 |
| 법무·인증·개발·보안 협업 구조 | 규제 판단과 기술 대응을 분리할 수 없음 |

그 결과 Product Security Engineer는 단순히 코드리뷰를 하는 사람이 아니라, 제품 개발팀·펌웨어팀·품질팀·인증팀·PSIRT 사이를 연결하는 역할로 확장될 수 있다.

### 6.2 공급망: 완제품 회사의 요구가 부품사와 ODM으로 내려간다

<strong>\[전망 시나리오\]</strong> CRA의 효과는 EU에 직접 완제품을 파는 기업에서 끝나지 않을 가능성이 높다.

스마트기기 하나에는 SoC 벤더 SDK, 무선 모듈 펌웨어, 오픈소스 라이브러리, ODM 제공 코드, 모바일 앱 SDK, 클라우드 백엔드와 OTA 서버가 엮여 있다. 완제품 제조사가 적합성을 입증하려면, 공급업체에게 구성요소 정보와 패치 가능성, 지원기간, 취약점 대응 정보를 요청할 수밖에 없다.

```
EU 규제 압력
  → EU 판매 브랜드 / 완제품 제조사
    → ODM·OEM·펌웨어 공급사
      → 모듈·SDK·칩셋 벤더
        → 오픈소스·서드파티 컴포넌트 관리
```

이 구조가 굴러가기 시작하면, 공급사는 단지 기능이 동작하는 펌웨어를 납품하는 것만으로 부족해진다.

| 공급사가 요구받을 가능성이 큰 자료 | 의미 |
| --- | --- |
| SBOM 또는 구성요소 목록 | 완제품 제조사의 문서화와 취약점 추적에 필요 |
| 취약점 대응 연락처 | PSIRT와 공급망 에스컬레이션에 필요 |
| 패치 지원기간 | 완제품의 지원정책과 충돌하지 않아야 함 |
| 업데이트·서명 검증 증적 | Secure Update 검증에 필요 |
| 알려진 취약점 영향 판단 | 패치·VEX·고객 공지의 입력 |
| 보안 시험 결과 | 적합성 평가와 고객 요구 대응 |

한국 제조업에서 특히 중요한 것은 이 지점이다. EU 시장에 자기 브랜드로 제품을 팔지 않더라도, 유럽 제품의 공급망에 들어가는 한국 업체라면 고객사의 계약 요구를 통해 Product Security 증적을 요청받을 수 있다.

### 6.3 전문기업: 한국판 자동차 보안기업은 일반 제품 영역에서도 나올까

<strong>\[전망 시나리오\]</strong> 새로운 회사가 등장할 수 있는 공간은 있다. 다만 단순한 “CRA 인증 대행”보다, 기술 검증과 증적 운영을 결합한 회사가 더 강할 가능성이 높다.

| 기업 유형 | 고객이 돈을 내는 문제 |
| --- | --- |
| CRA Readiness / Product Security 컨설팅 | 어떤 제품이 대상인지, 어떤 프로세스를 갖춰야 하는지 모름 |
| Firmware / IoT Security Assessment | 제품이 실제로 안전한지 검증할 역량이 없음 |
| SBOM·VEX·SCA 플랫폼 | 제품·버전·취약점의 관계를 반복적으로 추적하기 어려움 |
| Managed PSIRT | 자체 대응팀 없이 취약점 접수·신고·공지까지 운영해야 함 |
| Secure OTA / Device Identity 공급사 | 업데이트와 기기 신뢰체인을 직접 설계하기 어려움 |
| Product Security Evidence Automation | 기술문서와 적합성 증적 작성 비용이 큼 |
| 시험·인증·평가기관 | 고위험 제품의 제3자 평가와 시장 출시 증명이 필요함 |

자동차 보안기업과 가장 유사한 포지션은 다음 세 가지를 함께 제공하는 조직이다.

```
제품 구조와 공격면을 이해한다.
  + 실제 공격 가능성을 기술적으로 검증한다.
  + 결과를 규제 대응·패치·증적 문서로 연결한다.
```

반대로 단순히 법령 체크리스트를 대신 채우거나, CVE 목록만 대량으로 뽑는 서비스는 초기 수요를 얻을 수 있어도 장기적인 차별화가 어렵다.

### 6.4 처음에는 좋은 현상만 나타나지 않는다

CRA가 정착되면 장기적으로 제품 보안 수준이 높아질 수 있다. 그러나 초기 시장에서는 오히려 불편한 현상들이 먼저 보일 수 있다.

| 예상되는 현상 | 왜 발생할 수 있는가 |
| --- | --- |
| 취약점 공지와 패치 공지 증가 | 새로운 취약점이 갑자기 생긴 것이 아니라, 기존 문제를 공식 처리하기 시작함 |
| 구형 제품·저가 SKU 정리 | 장기 지원 비용을 감당하기 어려운 제품을 줄일 유인 |
| EU 판매 포기 또는 지역별 라인업 분리 | 저가 제품은 규제 대응 비용을 흡수하기 어려울 수 있음 |
| 공급사 교체 | SBOM·패치·증적을 제공하지 못하는 ODM/SDK 공급사는 리스크가 됨 |
| 제품 가격 상승 | 업데이트·문서화·평가 비용이 가격에 반영될 수 있음 |
| Paper Compliance | 실질 보안보다 문서와 체크박스 위주로 대응하는 업체가 등장할 수 있음 |

이 지점은 중요하다. 규제가 시장을 키운다는 말은 그 시장이 자동으로 좋은 보안을 만든다는 뜻이 아니다. 실제로 가치 있는 기업은 “규제 문서 작성”과 “공격 가능성 감소”를 분리하지 않는 기업일 것이다.

---

## 7\. Korea: 제조업 기반이 강한 한국에는 비용인가, 기회인가

### 7.1 대EU 교역과 ICT 수출 기반

<strong>\[확인된 사실\]</strong> EU 집행위원회 무역 페이지에 따르면 2025년 EU와 한국의 상품 교역은 약 <strong>1,242.5억 유로</strong>였고, EU의 한국산 상품 수입은 <strong>697억 유로</strong>였다. EU의 한국산 수입에서 기계류 및 운송장비는 <strong>367억 유로</strong>, 전체의 <strong>52.7%</strong>를 차지했다.\[8\]

또한 과학기술정보통신부가 공개한 「2025년 연간 및 12월 정보통신산업(ICT) 수출입 동향」 보도자료는 2025년 한국 ICT 수출이 <strong>2,642.9억 달러</strong>로 역대 최대였다고 발표했다.\[9\]

다만 이 통계를 해석할 때는 선을 지켜야 한다.

> <strong>\[확인된 사실\] 위 수출액 전체가 CRA 대상이라는 뜻은 아니다.</strong> 자동차 자체는 CRA 일반 적용에서 제외되고, 반도체·부품·산업장비 역시 제품 형태와 제공 방식, 기능에 따라 적용 여부를 개별 판단해야 한다.

  
그럼에도 이 수치는 한국이 CRA의 영향을 관찰만 하는 국가가 아니라는 점을 보여 준다. 한국은 연결형 장비, 전자제품, 임베디드 컴포넌트, 네트워크 제품, 소프트웨어를 직접 만들고 해외 공급망에 제공하는 국가다.

또한 한국인터넷진흥원(KISA)은 2026년 3월 EU 집행위원회의 「사이버복원력법」 적용 지침 초안 의견수렴 동향을 국내 법제동향으로 소개하면서, 적용범위, FOSS, substantial modification, 지원기간, 중요·핵심 제품, 위험평가, 보고의무를 주요 해석 쟁점으로 정리했다.\[10\] <strong>\[분석\]</strong> 이는 국내 시장이 이미 성숙했다는 증거는 아니지만, 적어도 한국의 수출·보안 지원 생태계가 CRA를 별도의 실무 대응 과제로 인식하기 시작했다는 신호로는 볼 수 있다.

### 7.2 직접적 영향 가능성이 큰 한국 제품군

| 제품군 | CRA와의 접점 | 필요한 Product Security 역량 |
| --- | --- | --- |
| 스마트홈·물리보안 제품 | 보안카메라·도어락·알람 등은 Annex III와 직접 연결 | Firmware Analysis, Mobile/API Testing, Secure Update, PSIRT |
| 라우터·게이트웨이·네트워크 장비 | 라우터·모뎀·스위치가 중요 제품군에 포함 | SBOM, CVE Triage, Protocol/Firmware Pentest |
| 산업용 IoT·원격관리 장비 | 네트워크 연결과 장기 지원이 핵심 | Asset Inventory, Secure Update, Incident Response |
| 보안 소프트웨어·VPN·관리 시스템 | 중요 제품군과 직접 연결 | SSDLC, Vulnerability Response, Assurance |
| 보안 기능이 포함된 칩·모듈 | Annex III·IV 분류와 연결 가능 | Secure Boot, Root of Trust, Component Evidence |
| 로봇·스마트 물류·드론 등 연결형 장치 | 제품별 판단이 필요하지만 연결형 제품보안 이슈가 큼 | Device Identity, Wireless/Firmware/API Security |

<strong>\[분석\]</strong> 한국에서 시장의 파이가 커질 가능성이 높은 이유는 단순히 “제조업이 크다”가 아니다. 다음 조건들이 겹치기 때문이다.

```
대EU 상품 교역 규모
  + ICT·전자·임베디드 생산 기반
  + ODM/OEM·부품 공급망 구조
  + 이미 축적된 자동차·IoT 보안 경험
  + CRA의 생애주기·증적 요구
```

이 조합은 기술 보안평가와 규제 대응 자동화를 동시에 구매할 고객군을 만들 수 있다.

### 7.3 자동차 경험은 직접 적용이 아니라 역량 전이의 기반이다

한국 자동차 산업은 CRA 대상 그 자체로 다루면 안 된다. 하지만 자동차 사이버보안에서 쌓인 경험은 일반 Product Security 시장으로 전이될 수 있다.

| 자동차 보안에서 축적되는 역량 | CRA 제품보안에서의 전환 가능성 |
| --- | --- |
| TARA와 보안 요구사항 관리 | IoT·소프트웨어 Threat Modeling |
| ECU·IVI·TCU 분석 | 임베디드·펌웨어 제품 평가 |
| OTA 보안과 SUMS | Secure Update·지원기간·배포 이력 관리 |
| CSMS 프로세스 | Product Security Program·PSIRT 운영 |
| 차량 형식승인 증적 | CRA 적합성 기술문서·시험 증적 |
| 차량 침투테스트 | 앱–클라우드–기기 연쇄 공격 검증 |

<strong>\[분석\]</strong> 따라서 국내 자동차 보안 전문기업이나 인증·시험기관이 CRA 기반 일반 디지털 제품보안 영역으로 확장하는 시나리오는 충분히 현실적이다. 다만 자동차의 고단가·강한 안전규제·구조화된 OEM 공급망과 저가 IoT 제품 시장은 동일하지 않다. 같은 사업모델이 그대로 복제되기보다, 일반 제품 영역에서는 자동화와 규모의 경제가 훨씬 중요해질 가능성이 높다.

---

## 8\. Who Wins, Who Loses: 시장이 생긴다면 누가 먼저 성장할까

### 8.1 먼저 돈이 흐를 가능성이 큰 영역

다음 우선순위는 CRA 조문에 적힌 직접 의무와 시행 시점을 기준으로 한 <strong>분석적 예측</strong>이다.

| 우선순위 | 투자 영역 | 이유 |
| --: | --- | --- |
| 1 | 제품 범위 판단·SKU 인벤토리·지원기간 정책 | 대상 제품과 책임기간을 알아야 모든 대응이 시작됨 |
| 2 | SBOM·구성요소·취약점 추적 | 법적으로 요구되는 구성요소 문서화와 영향 판단의 기초 |
| 3 | PSIRT·CVD·신고 프로세스 | 2026년 9월부터 보고 의무가 먼저 적용됨 |
| 4 | Secure Update·릴리스·패치 관리 | 지원기간 동안 실제 보안 업데이트를 제공해야 함 |
| 5 | 적합성 문서·시험·증적 자동화 | 2027년 전면 적용과 고위험 제품 평가 대응 |
| 6 | Firmware/IoT Pentest·Product Red Team | 기술적으로 높은 위험을 가진 제품의 심층 검증 |
| 7 | Exploit Research·Advanced Validation | 대기업·고위험 제품·전문평가사에서 차별화 요소 |

따라서 CRA가 촉진하는 초기 Product Security 시장은 “내부 레드팀 채용 러시”보다 아래와 같은 모습일 가능성이 높다.

```
내부 Product Security 책임자 소수
  + SBOM / 취약점 관리 플랫폼
  + 외부 IoT·펌웨어 평가업체
  + PSIRT 또는 Managed Response
  + 적합성·증적 지원
```

제품군이 많고 수출 규모가 큰 대기업, 네트워크·보안 제품 벤더, 산업장비 제조사에서는 내부 Firmware Security, Supply Chain Security, PSIRT, Product Red Team까지 확장할 유인이 더 강해진다.

### 8.2 성장할 가능성이 큰 주체

| 수혜 가능성이 큰 주체 | 강점이 되는 요소 |
| --- | --- |
| 제품보안 평가·컨설팅 업체 | CRA 요구사항과 실제 제품 공격면을 함께 해석 |
| 시험·인증기관 | 적합성 평가와 기술문서 검토 |
| SBOM/SCA/VEX 플랫폼 업체 | 제품·버전·취약점의 반복 관리 |
| PSIRT 운영·자동화 기업 | 신고·패치·고객공지 워크플로우 |
| Secure OTA·Device Identity 업체 | 제품 설계에 직접 들어가는 보안 기능 |
| Firmware Analysis 플랫폼 | 바이너리 기반 구성요소 추출과 취약점 영향 판단 |
| 자동차 보안 기반 기업 | 임베디드·업데이트·규제 대응 경험의 전환 |

### 8.3 압박을 받을 가능성이 큰 주체

| 압박을 받을 주체 | 구조적 약점 |
| --- | --- |
| 저가 연결형 제품 제조사 | 장기 패치와 증적 비용을 제품 가격에 반영하기 어려움 |
| BOM·버전 관리가 불투명한 ODM | 고객사가 적합성 리스크를 떠안기 어려움 |
| 업데이트 경로가 없는 레거시 제품군 | 지원기간 의무와 패치 운영이 구조적으로 어려움 |
| 일회성 스캔 결과만 파는 업체 | CRA는 발견보다 처리·증적·지원 운영을 묻기 때문 |
| 문서만 만들고 기술 검증이 약한 컨설팅 | 실제 사고나 악용 취약점 발생 시 신뢰가 무너짐 |

---

## 9\. Product Security Careers: 어떤 직무가 실제로 커질까

Product Security 시장이 커진다는 말은 단순히 모의해킹 인력이 늘어난다는 뜻이 아니다. CRA는 제품보안을 개발, 운영, 공급망, 취약점 대응, 증적이라는 여러 역할로 분해한다.

| 직무군 | 구체 직무 | CRA와 연결되는 지점 |
| --- | --- | --- |
| Product Security Governance | Product Security Manager, Program Manager | 제품군별 정책·지원기간·출시 게이트 |
| Architecture / Risk | Product Security Architect, Threat Modeling Engineer | 위험평가, Secure by Design |
| Secure Development | Product Security Engineer, AppSec Engineer | 코드·API·인증·릴리스 보안 |
| Firmware / IoT | Firmware Security Researcher, IoT Security Engineer | 펌웨어·OTA·앱·기기 검증 |
| Supply Chain | SBOM Engineer, SCA/VEX Analyst, OSS Security Engineer | 구성요소·취약점 영향 관리 |
| Vulnerability Response | PSIRT Engineer, CVD Manager, CVE Coordinator | 접수·패치·공개·신고 |
| Assurance / Compliance | CRA Compliance Engineer, Cybersecurity Assurance Engineer | 기술문서·적합성·시험 증적 |
| Automation | Product Security Automation Engineer, Security Tooling Engineer | 반복 분석·증적·워크플로우 자동화 |
| Offensive Validation | Product Pentester, Product Red Team, Exploit Researcher | 고위험 제품의 실제 공격 가능성 검증 |

<strong>\[분석\]</strong> CRA에 의해 가장 빠르게 수요가 커질 직무는 Exploit Researcher 단독보다는, 제품 인벤토리·SBOM·PSIRT·Secure Update·Assurance를 다룰 수 있는 인력일 가능성이 높다.

그러나 펌웨어 분석과 exploitability 판단 역량의 가치가 낮다는 뜻은 아니다. 오히려 다음 조합이 희소해진다.

```
펌웨어를 분석할 수 있다.
  + 실제 악용 가능성을 판단할 수 있다.
  + 패치·업데이트 구조를 이해한다.
  + SBOM·PSIRT·규제 증적과 연결한다.
  + 반복 작업을 자동화할 수 있다.
```

이는 단순 취약점 연구보다 시장의 구매 이유에 더 가깝다.

---

## 10\. From Research to Market: SCOUT를 다시 보게 된 이유

개인적으로 이 주제가 흥미로운 이유는, 현재 진행 중인 펌웨어 분석 자동화 방향을 다시 해석하게 만들기 때문이다.

펌웨어 분석 도구의 초기 질문은 보통 다음과 같다.

```
위험한 함수가 존재하는가?
입력에서 sink까지 흐름이 도달하는가?
알려진 CVE와 유사한 패턴이 있는가?
PoC 또는 exploit candidate를 만들 수 있는가?
```

이 질문들은 취약점 연구 관점에서는 중요하다.

그러나 CRA와 Product Security 관점에서 제조사가 필요로 하는 질문은 더 넓다.

```
이 제품 버전에 어떤 컴포넌트가 포함되어 있는가?
어떤 취약점이 실제 제품 경로에서 영향을 미치는가?
어떤 제품군을 언제까지 패치해야 하는가?
업데이트 메커니즘 자체는 안전한가?
그 판단을 기술문서와 고객 공지에 어떻게 남길 것인가?
실제 악용이 확인되면 신고 흐름과 어떻게 연결할 것인가?
```

이 관점에서 SCOUT와 같은 펌웨어 분석 도구의 방향은 다음처럼 바뀔 수 있다.

```
Firmware Vulnerability Scanner
  → Firmware Product Security Assessment Engine
  → IoT / Embedded Product Security Assurance Platform
```

| 확장 기능 | 기술적 의미 | 제조사에게 주는 Product Security 가치 |
| --- | --- | --- |
| 펌웨어 언팩·파일시스템·바이너리 인벤토리 | 분석 대상 가시화 | 제품 버전별 구성요소 관리 |
| Firmware SBOM 생성 | 라이브러리·패키지·버전 식별 | CRA SBOM 준비 보조 |
| CVE·EOL 컴포넌트 매핑 | 알려진 위험 탐지 | 패치 우선순위와 공급망 질의 |
| Reachability 분석 | 코드 경로상의 영향 판단 | false positive 감소, VEX 판단 보조 |
| Exploitability 평가 | 공격 가능성 기술 검증 | 긴급 대응·심층 평가 필요성 판단 |
| 하드코딩 자격증명·노출 서비스 검사 | 기본 보안 결함 식별 | Secure by Default 평가 |
| OTA·서명·rollback 검사 | 업데이트 신뢰성 검증 | Secure Update·지원 운영 증적 |
| 패치 전후 비교 | 수정 효과·회귀 위험 확인 | PSIRT·릴리스 관리 지원 |
| CRA 요구사항 매핑 보고서 | 결과를 규제 언어로 변환 | 기술문서·외부평가 준비 |

다만 여기에서도 과장은 피해야 한다.

> <strong>\[분석\] 펌웨어 분석 도구 하나가 CRA 준수를 보장할 수는 없다.</strong> CRA는 조직 프로세스, 지원기간, 사고 신고, 공급망 책임, 적합성 평가까지 포함하기 때문이다. SCOUT가 현실적으로 노릴 수 있는 가치는 CRA 전체를 “자동 인증”하는 것이 아니라, <strong>펌웨어와 임베디드 제품에서 필요한 기술 증적을 더 빠르고 재현 가능하게 생산하는 것</strong>이다.

  
또한 사업화에서 중요한 평가지표는 취약점 후보 개수만이 아니다.

| 연구용 데모에서 보이는 지표 | 제품보안 시장에서 더 중요한 지표 |
| --- | --- |
| 탐지 건수 | 확인 가능한 true positive와 재현성 |
| CVE 매칭 수 | 실제 제품 영향도 판단 정확성 |
| LLM 보고서 품질 | 감사 가능한 근거와 원본 추적성 |
| PoC 생성 성공 | 패치·공지·증적 워크플로우 연결성 |
| 분석 속도 | 제품군·버전 단위 반복 운영 가능성 |

CRA가 실제 시장을 키운다면, 잘 팔리는 도구는 가장 화려한 AI 데모가 아니라 <strong>감사 가능하고 반복 가능한 증적을 생산하는 도구</strong>일 가능성이 높다.

---

## 11\. Counterarguments: 정말 자동차처럼 큰 시장이 생길까

지금까지의 주장은 가능성이 높은 시나리오이지, 이미 실현된 사실이 아니다. 반론은 세 가지로 정리된다.

### 11.1 일반 IoT는 자동차처럼 높은 평가비용을 흡수하지 못한다

자동차는 단가가 높고, 안전과 형식승인 비용을 제품 가격에 반영할 수 있다. 반면 저가 스마트홈 기기나 소비자 IoT는 심층 펌웨어 리버싱과 고가 컨설팅을 제품마다 적용하기 어렵다.

따라서 CRA 시장은 자동차와 같은 형태로 균일하게 성장하기보다, 위험도와 단가에 따라 분리될 가능성이 높다.

```
저가·대량·저위험 제품
  → 표준화된 SBOM, 자동 스캔, 기본 보안검증, 관리형 대응

고가·고위험·장기지원 제품
  → 심층 펌웨어 분석, 독립 평가, Product Red Team, Exploitability 검증
```

### 11.2 새로운 스타트업보다 기존 인증·보안업체가 수요를 흡수할 수 있다

시험·인증기관, 글로벌 SCA 업체, 기존 AppSec·DevSecOps 플랫폼, 대형 컨설팅사가 CRA 서비스를 빠르게 추가할 수 있다. 따라서 시장이 성장하더라도 반드시 새로운 독립 기업만이 승자가 된다고 볼 수 없다.

국내 신생 기업이 경쟁력을 가지려면 다음 중 하나 이상의 차별점이 필요하다.

| 차별점 | 이유 |
| --- | --- |
| 소스 없이도 가능한 펌웨어 바이너리 분석 | ODM·외부 공급 제품에서는 소스 접근이 제한될 수 있음 |
| 앱–클라우드–기기 통합 공격 검증 | 단일 SCA보다 실제 제품 리스크에 가까움 |
| 한국 제조·ODM 공급망 이해 | 국내 고객의 문서·계약·개발 관행에 맞는 지원 가능 |
| 규제 증적 자동화 | 고정 비용을 여러 제품군에 분산 가능 |
| Reachability·Exploitability 판단 | 단순 CVE 목록보다 높은 기술 가치 |

### 11.3 규제는 보안이 아니라 문서 시장으로 변질될 수 있다

SBOM과 체크리스트가 생겼다고 해서 제품이 자동으로 안전해지는 것은 아니다. 구성요소 목록은 정확하지 않을 수 있고, 실제 도달 가능성이 없는 CVE가 대량 경보를 만들 수 있으며, 보고서는 아름답지만 OTA나 인증 구조는 여전히 취약할 수 있다.

따라서 좋은 Product Security 기업은 규제 대응 서류를 만드는 곳이 아니라, 다음 연결을 실제로 구현하는 곳이어야 한다.

```
Evidence
  ↕
Technical Validation
  ↕
Remediation
  ↕
Operational Response
```

---

## 12\. Product Security Takeaways

CRA를 제품보안 관점에서 정리하면 핵심은 다음 여섯 가지다.

```
1. 제품보안은 EU 시장에서 점차 품질 선택지가 아니라 시장 접근 조건이 된다.

2. CRA가 직접 요구하는 것은 SBOM, 취약점 처리, 업데이트, 신고, 적합성 증적이다.
   VEX와 SCA는 이를 운영하기 위한 유력한 구현 방식이지, 법 조문상의 동일한 의무명이 아니다.

3. 자동차는 CRA 적용 대상의 대표 사례가 아니라,
   제품보안 규제가 전문시장과 조직 수요를 키운 선행 비교사례다.

4. 초기 시장에서 가장 먼저 커질 가능성이 높은 것은
   대규모 레드팀보다 인벤토리, SBOM, PSIRT, Secure Update, 증적 자동화다.

5. 한국은 대EU 교역과 ICT·전자·임베디드 공급 기반 때문에
   CRA를 규제 비용으로도, Product Security 산업 기회로도 마주할 수 있다.

6. 펌웨어 연구의 사업적 가치는 취약점 발견량만이 아니라,
   제품 영향도·패치·보고·적합성 증적으로 연결되는 재현 가능한 결과에서 커진다.
```

더 짧게 쓰면 이렇다.

```
자동차에서 차량 사이버보안이 형식승인의 일부가 되었듯,
CRA는 일반 디지털 제품에서 Product Security를 판매와 지원의 조건으로 만든다.

그리고 시장은 취약점 그 자체보다,
그 취약점을 관리하고 증명하는 능력에 먼저 돈을 지불할 가능성이 높다.
```

---

## 13\. Conclusion

처음 CRA를 접했을 때는 단순한 EU 보안 규제로 보일 수 있다.

그러나 규정의 구조를 자동차 보안 규제와 나란히 놓고 보면, 이 법의 의미는 “취약점을 만들지 말라”는 선언보다 더 크다.

CRA는 제품을 판매하는 회사에게 다음을 묻는다.

```
무엇을 판매했는가.
그 안에 무엇이 들어 있는가.
어떤 위험을 평가했는가.
얼마나 오래 지원할 것인가.
취약점이 실제로 악용되면 누가 판단하고 신고할 것인가.
패치와 증적을 어떻게 남길 것인가.
```

이 질문에 답하려면 Product Security는 더 이상 보안팀의 선택적인 지원 기능에 머무르기 어렵다. 제품기획, 개발, 펌웨어, 공급망, 품질, 인증, 고객지원, 사고대응을 잇는 운영체계가 되어야 한다.

자동차 산업은 먼저 유사한 변화를 경험했다. UN R155/R156는 차량 사이버보안과 업데이트 관리를 형식승인과 연결했고, 차량 보안 평가·프로세스·시험·증적을 전문적으로 다루는 시장을 강화했다. CRA는 자동차와 법적 대상은 다르지만, 같은 경제적 질문을 더 넓은 디지털 제품 시장에 던진다.

한국은 이 변화와 무관한 국가가 아니다. 한국은 제품을 만들고, 임베디드 소프트웨어와 전자제품을 공급하고, EU와 큰 규모로 교역한다. 모든 수출품이 CRA 대상은 아니지만, 스마트홈, 네트워크 장비, 보안 제품, 산업용 IoT, 임베디드 컴포넌트와 같은 영역에서는 Product Security 역량이 수출 경쟁력과 직접 연결될 가능성이 있다.

다만 이 시장이 열린다고 해서 자동으로 국내 기업이 수혜를 얻는 것은 아니다. 글로벌 인증기관과 플랫폼 업체가 수요를 먼저 흡수할 수 있고, 저가 제품 제조사는 대응 비용 때문에 시장을 포기할 수도 있으며, 실질 보안보다 문서 준수만 남는 실패도 가능하다.

그럼에도 방향은 분명하다.

```
firmware vulnerability
  + product lifecycle
  + vulnerability response
  + regulatory evidence
  = product security market
```

취약점을 찾는 능력은 여전히 중요하다.

하지만 앞으로 더 가치 있는 능력은, 그 취약점이 어떤 제품에 영향을 주는지 판단하고, 어떻게 패치하며, 어떤 사용자에게 알리고, 어떤 증적을 남기고, 어떤 시장 책임으로 이어지는지까지 연결하는 능력일 것이다.

CRA가 Product Security 시장을 만든다는 말은 결국 이런 뜻이다.

> <strong>취약점을 발견하는 일이, 제품을 계속 판매하고 수출할 수 있게 만드는 일과 직접 연결되기 시작한다.</strong>

---

## References

\[1\] European Commission, <strong>The Cyber Resilience Act – Summary of the legislative text</strong>, last updated 3 Dec 2025.  
[https://digital-strategy.ec.europa.eu/en/policies/cra-summary](https://digital-strategy.ec.europa.eu/en/policies/cra-summary)

\[2\] European Union, <strong>Regulation (EU) 2024/2847 – Cyber Resilience Act</strong>, Official Journal of the European Union, 23 Oct 2024.  
[https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ%3AL\_202402847](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ%3AL_202402847)

\[3\] European Commission, <strong>Cyber Resilience Act – Reporting obligations</strong>, last updated 23 Apr 2026.  
[https://digital-strategy.ec.europa.eu/en/policies/cra-reporting](https://digital-strategy.ec.europa.eu/en/policies/cra-reporting)

\[4\] CISA, <strong>Software Bill of Materials (SBOM)</strong>.  
[https://www.cisa.gov/topics/information-communications-technology-supply-chain-security/sbom](https://www.cisa.gov/topics/information-communications-technology-supply-chain-security/sbom)

\[5\] NTIA, <strong>Vulnerability Exploitability eXchange (VEX) – One-Page Summary</strong>.  
[https://www.ntia.gov/sites/default/files/publications/vex\_one-page\_summary\_0.pdf](https://www.ntia.gov/sites/default/files/publications/vex_one-page_summary_0.pdf)

\[6\] UNECE, <strong>Three landmark UN vehicle regulations enter into force</strong>, 2021; UNECE, <strong>UN Regulation No. 155 / No. 156</strong>.  
[https://unece.org/sustainable-development/press/three-landmark-un-vehicle-regulations-enter-force](https://unece.org/sustainable-development/press/three-landmark-un-vehicle-regulations-enter-force)  
[https://unece.org/transport/documents/2021/03/standards/un-regulation-no-155-cyber-security-and-cyber-security](https://unece.org/transport/documents/2021/03/standards/un-regulation-no-155-cyber-security-and-cyber-security)  
[https://unece.org/transport/documents/2021/03/standards/un-regulation-no-156-software-update-and-software-update](https://unece.org/transport/documents/2021/03/standards/un-regulation-no-156-software-update-and-software-update)

\[7\] ISO, <strong>ISO/SAE 21434:2021 – Road vehicles — Cybersecurity engineering</strong>.  
[https://www.iso.org/standard/70918.html](https://www.iso.org/standard/70918.html)

\[8\] European Commission, <strong>EU trade relations with South Korea</strong>, trade picture updated with 2025 figures.  
[https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/south-korea\_en](https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/south-korea_en)

\[9\] 과학기술정보통신부, <strong>2025년 연간 및 12월 정보통신산업(ICT) 수출입 동향</strong>, 정책브리핑, 2026.01.14.  
[https://www.korea.kr/briefing/pressReleaseView.do?newsId=156739620](https://www.korea.kr/briefing/pressReleaseView.do?newsId=156739620)

\[10\] KISA, <strong>\[26-6\] EU 집행위원회, 「사이버복원력법」 적용에 관한 지침 초안 의견수렴 ('26.3.3~3.31)</strong>, 2026.03.24.  
[https://www.kisa.or.kr/20201/form?lang\_type=KO&page=&postSeq=274](https://www.kisa.or.kr/20201/form?lang_type=KO&page=&postSeq=274)

\[11\] ENISA & Joint Research Centre, <strong>Cyber Resilience Act Requirements Standards Mapping</strong>, 2024.  
[https://www.enisa.europa.eu/publications/cyber-resilience-act-requirements-standards-mapping](https://www.enisa.europa.eu/publications/cyber-resilience-act-requirements-standards-mapping)

\[12\] NIST, <strong>SP 800-218: Secure Software Development Framework (SSDF) Version 1.1</strong>, 2022.  
[https://csrc.nist.gov/pubs/sp/800/218/final](https://csrc.nist.gov/pubs/sp/800/218/final)

\[13\] AUTOCRYPT, <strong>Automotive Cybersecurity | Mobility Solutions</strong>.  
[https://www.autocrypt.io/](https://www.autocrypt.io/)

\[14\] FESCARO, <strong>자동차 사이버보안 및 규제대응 원스톱 솔루션</strong>.  
[https://www.fescaro.com/kr/index.php](https://www.fescaro.com/kr/index.php)
