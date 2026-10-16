> NDSS 2026 | 칭화대 Network Security Lab  
> "Leveraging Fuzzing to Assist LLM Agents with IoT Firmware Vulnerability Discovery"

---

## 인트로: 왜 이 논문을 골랐나

IoT 기기 수가 2025년 기준 약 180억 대를 넘어서면서, 공격 표면이 폭발적으로 커지고 있다. 문제는 IoT 펌웨어의 특성상 <strong>소스코드 없이 바이너리만 존재</strong>하는 경우가 대부분이라, 취약점을 찾기가 일반 소프트웨어보다 훨씬 까다롭다는 것이다.

이 분야에는 크게 두 가지 접근이 있다:

-   <strong>정적 분석</strong>: 바이너리를 실행하지 않고 코드 패턴으로 취약점을 찾는다. 빠르고 전체 코드를 볼 수 있지만, <strong>False Positive가 많고</strong> PoC 생성이 불가능하다.
-   <strong>동적 분석 (Fuzzing)</strong>: 프로그램을 실제로 실행하면서 크래시를 유발한다. 실제 취약점을 확인할 수 있지만, 복잡한 조건 분기를 통과하기 어려워 <strong>False Negative가 많다.</strong>

기존 도구 단독으로는 <strong>정확도(Precision)와 커버리지(Coverage)를 동시에 달성하기 어렵다</strong>는 것이 이 분야의 오래된 딜레마다. FirmAgent는 여기에 LLM을 결합해 이 딜레마를 해결한다.

핵심 아이디어는 의외로 심플하다:

> Fuzzing이 런타임 정보를 수집하고, LLM Agent가 그 정보를 기반으로 취약점 경로를 추론한 뒤 PoC를 자동 생성한다.

기존에도 LLM을 보안 분석에 쓰려는 시도가 있었지만, 대부분 LLM을 <strong>fuzzing 도중에 호출</strong>하는 방식이라 오버헤드가 크고 hallucination도 심했다. FirmAgent는 <strong>fuzzing이 끝난 후</strong> LLM이 독립적으로 분석하게 만들어서 두 문제를 동시에 해결한다. 이게 이 논문의 핵심 contribution이다.

---

## 논문 기본 정보

| 항목 | 내용 |
| --- | --- |
| 논문명 | FirmAgent: Leveraging Fuzzing to Assist LLM Agents with IoT Firmware Vulnerability Discovery |
| 저자 | 칭화대학교 Network Security Lab |
| 학회 | <strong>NDSS 2026</strong> (보안 분야 4대 탑티어 학회, CORE Ranking A\*) |
| 출판 시기 | 2025년 2월 아카이브 프리프린트 |
| GitHub | [https://github.com/vul337/FirmAgent](https://github.com/vul337/FirmAgent) |
| 데이터셋 | 14개 실제 IoT 펌웨어 (공개 DB 없음) |
| 비교 대상 | EmTaint, HermeScan, Greenhouse, Hy-FirmFuzz |

NDSS는 IEEE S&P, ACM CCS, USENIX Security와 함께 보안 분야 <strong>Big 4</strong> 학회다. 여기에 accept된 것 자체가 상당한 수준의 검증을 받았다는 의미.

---

## 배경 지식

## IoT Firmware 취약점 탐지의 현실

IoT 펌웨어 분석이 일반 소프트웨어 분석보다 어려운 이유가 몇 가지 있다:

1.  <strong>Binary-only</strong>: 소스코드가 없다. 디컴파일러(Ghidra, IDA) 출력에 의존해야 하는데, 결과가 완벽하지 않다.
2.  <strong>다양한 아키텍처</strong>: ARM, MIPS, MIPSEL 등 다양한 CPU 아키텍처를 지원해야 한다.
3.  <strong>하드웨어 의존성</strong>: NVRAM, GPIO, 특수 칩셋 등 하드웨어에 의존하는 코드가 많아 에뮬레이션이 어렵다.
4.  <strong>웹 서비스 중심</strong>: IoT 기기의 취약점 대부분이 웹 관리 인터페이스(httpd, CGI)에서 발생한다.

알려진 주요 취약점 유형:

-   <strong>Command Injection</strong>: `system()`, `popen()` 등에 사용자 입력이 그대로 전달
-   <strong>Buffer Overflow</strong>: `strcpy()`, `strcat()` 등에서 경계 검사 없이 데이터 복사
-   <strong>Format String</strong>: `printf()` 계열 함수에 사용자 입력이 포맷 스트링으로 사용

## 정적 분석 vs 동적 분석 — 더 자세히

| 구분 | 정적 분석 | 동적 분석 (Fuzzing) |
| --- | --- | --- |
| <strong>실행 여부</strong> | 실행 안 함 | 실제 실행 |
| <strong>입력</strong> | 바이너리/소스코드 | 무작위/변형된 입력 |
| <strong>장점</strong> | 빠름, 전체 코드 커버리지 | 실제 취약점 확인 가능 (Low FP) |
| <strong>단점</strong> | FP 다수, 코드 의미 이해 불가, PoC 불가 | FN 많음, 조건 분기 돌파 어려움 |
| <strong>대표 도구</strong> | CodeQL, EmTaint, IDA | AFL++, Greenhouse, Hy-FirmFuzz |
| <strong>IoT 특유 문제</strong> | aliasing, indirect call resolution | 하드웨어 의존 분기, Emulation 실패 |

<strong>정적 분석의 FP 문제가 심각한 이유</strong>: 예를 들어  recv() 와 system() 을 둘 다 import하는 바이너리가 있다고 하자. 정적 분석기는 "입력 함수와 위험 함수가 같은 바이너리에 있다"는 이유만으로 alert를 발생시킨다. 하지만 실제로 recv() 의 데이터가 system()까지 도달하는지는 확인하지 못한다. 이게 심볼 동시 출현(symbol co-occurrence) 기반 탐지의 근본적 한계다.

<strong>동적 분석의 FN 문제가 심각한 이유</strong>: Fuzzing은 입력을 무작위로 변형해서 넣지만, if (strcmp(input, "SPECIFIC\_KEY") == 0)  같은 조건을 무작위로 맞출 확률이 극히 낮다. IoT 펌웨어는 이런 하드웨어 상태/설정값 의존 조건 분기가 많아서 fuzzer가 코드의 깊은 부분까지 도달하지 못하는 경우가 흔하다.

## Taint Analysis (오염 분석)

Taint analysis는 <strong>신뢰할 수 없는 입력 데이터(taint source)가 위험한 함수(sink)까지 도달하는지</strong> 추적하는 기법이다.

```
[Source]         [Propagation]        [Sink]
recv(buf)  →  sprintf(cmd, buf)  →  system(cmd)
  ↑ 입력             ↑ 전파              ↑ 위험!
```

-   <strong>Source</strong>: `recv()`, `getenv()`, `nvram_get()`, `fgets()` 같은 외부 입력 함수
-   <strong>Sink</strong>: `system()`, `popen()`, `execve()`, `strcpy()` 같은 위험 함수
-   <strong>Propagation</strong>: source의 데이터가 변수 할당, 함수 호출 등을 통해 sink까지 전달되는 경로

<strong>전통적 taint analysis의 한계:</strong>

-   <strong>Aliasing 문제</strong>: 포인터가 같은 메모리를 가리키는 경우 추적이 어려움
-   <strong>Indirect Call</strong>: 함수 포인터를 통한 호출은 정적으로 해석 불가
-   <strong>코드 의미 이해 불가</strong>: `atoi(input)`으로 정수 변환한 뒤 `system()`에 넣으면 위험한가? 정적 분석기는 이 의미를 모른다

FirmAgent는 이 taint analysis를 LLM이 <strong>코드 의미와 함께</strong> 수행하게 만든다. LLM은 디컴파일된 코드를 읽고 "이 입력이 정수로 변환되니까 command injection은 불가능하다"는 판단을 내릴 수 있다.

## LLM in Security — 기대와 현실

LLM을 보안 분석에 활용하는 연구가 최근 급증하고 있다:

-   코드 취약점 탐지
-   악성코드 분석
-   패킹 보완
-   PoC/Exploit 생성

<strong>장점</strong>: 코드의 의미를 이해하고, 자연어 수준의 취약점 설명이 가능하다.

<strong>치명적 한계 — Hallucination</strong>: LLM이 존재하지 않는 취약점을 "확신을 가지고" 보고하는 현상. 선행 연구에서 LLM 단독 사용 시 Precision이 낮다는 결과가 반복적으로 나왔다.

FirmAgent의 핵심 인사이트: <strong>Fuzzing이 수집한 실제 실행 정보를 LLM에게 넘겨줘서 hallucination을 억제한다.</strong> LLM에게 "이 코드가 취약한지 판단해봐"가 아니라 "fuzzing 결과 이 경로로 입력이 실제로 흘러갔는데, 이 경로가 취약한지 판단해봐"라고 묻는 것이다.

---

## ❓ 문제 정의: 기존 접근의 한계와 Research Questions

## 정적 분석의 한계

-   Taint source를 정적으로 식별 → aliasing + 코드 의미 이해 불가
-   IoT 펌웨어의 다양한 입력 경로 중 실제 도달 가능한 것 특정 불가
-   결과: <strong>False Positive 폭증</strong>

## 동적 분석의 한계

-   복잡한 조건 분기 통과 어려움 → firmware 코드의 상당 부분 미탐색
-   IoT 특유의 하드웨어 상태/설정값 의존 분기 → Fuzzing 돌파 어려움
-   결과: <strong>False Negative 폭증</strong>

이 딜레마를 해결하기 위한 3개의 Research Question:

> <strong>RQ1</strong>: Fuzzing이 수집한 런타임 정보로 LLM의 False Positive를 줄일 수 있는가?

> <strong>RQ2</strong>: LLM이 Fuzzing이 놓친 취약점 경로를 보완할 수 있는가?

> <strong>RQ3</strong>: 두 기술의 결합이 SOTA 단독 도구보다 더 많은 취약점을 더 높은 정밀도로 찾는가?

세 질문 모두 실험으로 검증된다. 특히 RQ1은 ablation study의 Firm-Cut 변형으로 명확하게 답한다.

---

## ⚙️ 제안 방법: FirmAgent 파이프라인

![](/blog/firmagent-ndss-2026-paper-review/01.png)

FirmAgent의 전체 파이프라인은 크게 <strong>두 단계</strong>로 나뉜다.

## Stage 1: Fuzzing-Driven Information Collection

펌웨어를 <strong>QEMU full-system emulation</strong> 위에서 실제 실행하면서 정보를 수집하는 단계다.

## 1-1. Pre-fuzzing Analysis

Fuzzing을 시작하기 전에 타겟을 분석하는 사전 작업:

<strong>Service Handler Detection:</strong>

-   펌웨어의 웹 서비스 핸들러 (CGI, SOAP 등)를 자동 식별
-   HTTP 요청을 받아 처리하는 함수들을 fuzzing 대상으로 설정
-   예: `httpd`의 `/cgi-bin/` 핸들러, `mini_httpd`의 URL 라우팅 함수

<strong>Keyword Dictionary Analysis:</strong>

-   HTTP 파라미터명, URL 패턴, 설정 키값 등에서 의미 있는 키워드 수집
-   이 키워드들을 fuzzing 입력 생성에 활용 (dictionary-based mutation)
-   예: `"password"`, `"cmd"`, `"action=reboot"` 같은 문자열

<strong>Sink Scope and Distance:</strong>

-   위험 함수(sink)까지의 call graph 거리를 측정
-   거리가 가까운 경로에 fuzzing 리소스를 집중
-   coverage-guided fuzzing의 방향을 sink 도달로 유도

## 1-2. Runtime Monitoring

실제 fuzzing 실행 중 세 가지 정보를 동시에 수집:

<strong>Dictionary-Based and Distance-Guided Mutation:</strong>

-   수집한 키워드와 sink 거리 정보를 기반으로 입력을 변형
-   일반적인 coverage-guided mutation보다 목적 지향적
-   코드 커버리지를 최대화하면서 동시에 sink 도달을 유도

<strong>Memory Taint Detection:</strong>

-   실행 중 메모리에서 taint된 데이터의 흐름을 추적
-   <strong>Csource</strong> (실제로 입력이 흘러들어가는 코드 지점)를 동적으로 식별
-   정적 분석과 달리 "실제로 이 경로로 데이터가 흘러갔다"는 증거를 수집

<strong>Indirect Call Resolution:</strong>

-   함수 포인터, vtable 등을 통한 간접 호출을 동적으로 해석
-   정적 분석에서는 불가능한 call graph 완성
-   이 정보가 LLM의 taint path reconstruction에 핵심적

이 과정의 최종 출력물은 두 가지:

1.  <strong>Csource</strong>: 입력이 실제로 흘러들어가는 코드 지점
2.  <strong>Potential Paths</strong>: Csource에서 sink까지의 후보 경로

## Stage 2: Taint-to-PoC Agent (LLM)

Fuzzing이 수집한 정보를 <strong>LLM Agent 2개</strong>가 순차적으로 분석하는 단계다.

## 2-1. Taint Propagation Agent

역할: Taint Source에서 Sink까지 경로를 분석하고 취약점 여부를 판정한다.

<strong>입력:</strong>

-   Fuzzing이 식별한 Csource (실제 입력이 흘러간 지점)
-   재구성된 Potential vulnerability path
-   디컴파일된 바이너리 코드

<strong>LLM이 하는 것:</strong>

-   바이너리를 리버싱하여 <strong>data flow를 의미론적으로 추적</strong>
-   조건 분기, 함수 호출, 포인터 역참조 등 <strong>코드 의미를 고려</strong>
-   Source → Sink 도달 가능 여부 판정
-   취약점 유형 분류 (command injection, buffer overflow 등)

<strong>왜 LLM이 기존 taint analysis보다 나은가?</strong>

-   기존: `recv()` → ??? → `system()` — 중간 경로를 aliasing 때문에 추적 못함
-   FirmAgent: LLM이 디컴파일 코드를 읽고 "이 변수가 저 함수의 인자로 전달되고, 그 함수가 system()을 호출한다"는 의미적 추론 가능
-   게다가 Fuzzing이 "실제로 이 경로로 데이터가 흘러갔다"는 증거까지 제공하니 hallucination이 줄어듦

## 2-2. PoC Generation Agent

역할: 취약점 확인 + PoC Testcase 생성

<strong>입력:</strong>

-   Taint Propagation Agent의 alert (취약점 후보)
-   Fuzzing이 생성한 testcase (크래시 입력 등)

<strong>동작:</strong>

-   LLM이 fuzzing testcase를 <strong>정제</strong>하여 취약점 재현 가능한 PoC 생성
-   불필요한 노이즈를 제거하고, 핵심 트리거 조건만 남김
-   생성된 PoC를 에뮬레이션 환경에서 실행해 검증

<strong>PoC 성공 = Verified vulnerability.</strong> 이게 FirmAgent의 최종 출력이다.

논문 결과: 182개 취약점 중 167개에서 PoC 자동 생성 성공 (<strong>91.8%</strong>).

## 이 구조의 핵심: Fuzzing이 LLM의 Hallucination을 억제한다

기존 LLM 단독 분석:

> "이 코드를 보니 `system()` 호출이 있고 `recv()`도 있으니까 취약할 것이다" → <strong>추측 기반, FP 높음</strong>

FirmAgent:

> "Fuzzing 결과 이 경로(`recv → process_input → handler_cmd → system`)로 실제로 데이터가 흘러갔다. 이 경로가 취약한지 판단해봐" → <strong>증거 기반, FP 낮음</strong>

이 차이가 precision 91%와 37%(EmTaint)의 차이를 만든다.

---

## 실험 결과

## 데이터셋

-   <strong>14개</strong> 실제 IoT 펌웨어
-   벤더: NETGEAR, D-Link, Tenda, ASUS, TP-Link, TRENDnet, TOTOLINK, Linksys
-   선정 기준: <strong>Full-system Emulation이 가능한 펌웨어</strong>
-   평가 지표: Precision, Recall, CVE 할당 수, Unique Vulnerabilities

## 기존 도구 비교 (TABLE IV)

| 도구 | Alert | TP (Vuln) | Precision |
| --- | --- | --- | --- |
| EmTaint | 27 | 10 | 37.0% |
| HermeScan | 215 | 71 | 33.0% |
| Greenhouse | 20 | 8 | 40.0% |
| Hy-FirmFuzz | 13 | 13 | 100% |
| <strong>FirmAgent</strong> | <strong>200</strong> | <strong>182</strong> | <strong>91.0%</strong> |

수치가 말해준다:

-   <strong>FirmAgent</strong>: 200개 alert 중 182개가 실제 취약점. <strong>precision 91%</strong>.
-   <strong>EmTaint</strong>: 27개 alert 중 10개만 실제 취약점. precision 37%. 정적 분석의 FP 문제가 그대로 드러남.
-   <strong>HermeScan</strong>: alert는 215개로 가장 많지만 71개만 TP. precision 33%. alert만 많으면 의미 없다.
-   <strong>Hy-FirmFuzz</strong>: precision 100%이지만 13개밖에 못 찾음. 높은 precision이지만 recall이 처참.
-   <strong>Greenhouse</strong>: 20개 중 8개. IoT에서 fuzzing 단독의 한계.

FirmAgent만 <strong>precision과 recall을 동시에</strong> 높은 수준으로 달성했다.

## Ablation Study — 각 컴포넌트의 기여

| 변형 | Alert | TP | Precision | FPR |
| --- | --- | --- | --- | --- |
| <strong>FirmAgent (full)</strong> | <strong>200</strong> | <strong>182</strong> | <strong>91.0%</strong> | <strong>9.0%</strong> |
| Firm-Directed | 194 | 176 | 90.7% | 9.3% |
| Firm-Indirect (간접 호출 제거) | 187 | 169 | 90.4% | 9.6% |
| Firm-Cut <strong>(Fuzzing 정보 제거)</strong> | <strong>232</strong> | <strong>172</strong> | <strong>74.1%</strong> | <strong>25.9%</strong> |
| Firm-Emt (EmTaint 대체) | 34 | 15 | 44.1% | 55.9% |
| Firm-Her (HermeScan 대체) | 120 | 71 | 59.2% | 40.8% |

<strong>가장 주목할 결과: Firm-Cut</strong>

-   Fuzzing 정보 없이 LLM만으로 분석한 변형
-   Precision이 91% → <strong>74.1%</strong>로 급락, FPR은 9% → <strong>25.9%</strong>로 폭증
-   <strong>"Fuzzing 정보가 LLM의 hallucination을 억제한다"는 핵심 주장의 직접적 증거</strong>

Firm-Emt (EmTaint로 source 정보 대체)는 precision 44.1%. 정적 분석이 제공하는 taint source 정보의 품질이 fuzzing 기반보다 크게 떨어진다는 것을 보여준다.

## PoC 생성 결과

182개 confirmed 취약점에 대한 PoC 생성 시도:

| 유형 | 개수 | 비율 |
| --- | --- | --- |
| <strong>E-PoC</strong> (완전 자동 성공) | 167 | 91.8% |
| <strong>H-PoC</strong> (수정 필요) | 15 | 8.2% |
| <strong>F-PoC</strong> (실패) | 18 | \- |

PoC 자동 생성 성공률 <strong>91.8%</strong>. 보안 연구자 입장에서 이 수치는 상당히 실용적이다. 취약점을 찾는 것도 중요하지만, <strong>재현 가능한 PoC가 있어야</strong> vendor에 보고하거나 CVE를 받을 수 있다.

## Unique Vulnerabilities — FirmAgent만 찾은 것

Venn diagram에서 확인되는 것:

-   FirmAgent가 찾은 182개 중 <strong>140개는 다른 도구가 놓친 unique 취약점</strong>
-   이 중 <strong>17개가 CVE 할당</strong>
-   나머지 42개는 다른 도구와 겹침

140개를 독점적으로 찾았다는 건, 기존 도구들의 커버리지 한계를 FirmAgent가 실질적으로 메웠다는 뜻이다.

---

## 한계 & 의의

## 논문이 인정한 한계

1.  <strong>Full-system Emulation 의존</strong>: 에뮬레이션이 안 되는 펌웨어는 분석 불가. 14개라는 데이터셋 규모 자체가 이 제약의 직접적 결과다. 실제 IoT 펌웨어의 상당수는 NVRAM, 특수 하드웨어 의존으로 에뮬레이션이 안 된다.
2.  <strong>평가 규모 14개</strong>: 14개 펌웨어에서 91%가 1,000개 규모에서도 유지될지는 미지수다. 통계적 신뢰도를 위해서는 더 큰 데이터셋이 필요하다.
3.  <strong>Binary-only 환경</strong>: 소스코드 없이 바이너리만 분석하므로 정보 손실이 불가피하다. 디컴파일러 품질에 따라 결과가 달라질 수 있다.
4.  <strong>LLM Hallucination 완전 해결은 아님</strong>: 91% precision은 인상적이지만, 여전히 9%의 FP가 존재한다. LLM의 본질적 한계.
5.  <strong>분석 시간 오버헤드</strong>: Fuzzing + LLM 두 단계 모두 시간이 소요된다. 실시간 탐지에는 부적합.

## 의의

1.  <strong>Fuzzing × LLM 결합의 구체적 방법론 제시</strong>: "둘을 합치면 좋겠다"는 아이디어는 많았지만, 어떻게 합칠지의 구체적 아키텍처를 제시하고 검증한 것이 contribution.
2.  <strong>Ablation으로 각 컴포넌트 기여도 입증</strong>: 특히 Firm-Cut 실험이 "왜 fuzzing 정보가 필요한가"를 깔끔하게 답한다.
3.  <strong>End-to-end PoC 자동화</strong>: 취약점 탐지에서 끝나지 않고 PoC 생성까지 연결한 것은 실무적 가치가 크다.
4.  <strong>17개 CVE 할당</strong>: 실제 영향력 있는 취약점을 찾았다는 실증.

---

## SCOUT 프로젝트와의 비교

내가 개발하고 있는 [SCOUT](https://github.com/R00T-Kim/SCOUT) 프로젝트와 비교해보면 접근 방식이 꽤 다르다.

| 항목 | FirmAgent | SCOUT |
| --- | --- | --- |
| <strong>핵심 접근</strong> | Dynamic-first (Fuzzing → LLM) | Static-first (Evidence chain → Dynamic promotion) |
| <strong>Precision</strong> | 91% (14개 대상, confirmed) | 측정 중 (1,123개 대상) |
| <strong>규모</strong> | 14개 펌웨어 | 1,123개 펌웨어 |
| <strong>파이프라인</strong> | 2-stage (Fuzzing → LLM Agent) | 42-stage sequential pipeline |
| <strong>LLM 역할</strong> | Taint reasoning + PoC 생성의 <strong>핵심</strong> | FP 검증 + 분류의 <strong>보조</strong> |
| <strong>에뮬레이션</strong> | <strong>필수</strong> 전제 | 선택적 (정적 분석이 기본) |
| <strong>CVE 탐지</strong> | PoC 기반 confirmed | NVD 매칭 + 시그니처 기반 |
| <strong>산출물</strong> | Alert + PoC | SARIF, CycloneDX VEX, Evidence chain |
| <strong>전제 조건</strong> | Full-system Emulation 가능한 펌웨어 | Firmware blob만 있으면 됨 |

## 접근 방식의 근본적 차이

<strong>FirmAgent</strong>: "적은 수를 깊게" — 에뮬레이션 가능한 펌웨어만 대상으로 하지만, fuzzing + LLM으로 높은 precision과 PoC까지 도달한다.

<strong>SCOUT</strong>: "많은 수를 넓게" — 에뮬레이션 없이도 분석 가능하므로 1,100개+ 펌웨어를 대상으로 하지만, precision은 아직 FirmAgent 수준에 못 미친다.

## 상호 보완 가능성

두 접근은 사실 <strong>경쟁이 아니라 상호 보완적</strong>이다.

1.  SCOUT의 정적 파이프라인으로 대규모 스크리닝 → 유의미한 후보만 추출
2.  FirmAgent 방식의 fuzzing + LLM taint reasoning으로 후보를 깊게 검증
3.  PoC 자동 생성으로 confirmed vulnerability로 승격

이렇게 하면 <strong>SCOUT의 넓은 커버리지 + FirmAgent의 깊은 검증</strong>을 모두 가져갈 수 있다. 실제로 SCOUT v2.2.0에서 Ghidra 디컴파일 결과를 taint analysis에 연결하는 작업을 진행 중인데, FirmAgent의 Taint Propagation Agent 구조가 좋은 참고가 된다.

## SCOUT가 FirmAgent에서 배울 점

1.  <strong>Fuzzing 정보를 LLM 컨텍스트로 활용</strong>: SCOUT의 fp\_verification이 "코드 없이" LLM에게 판정을 시키는 문제를 FirmAgent 방식으로 해결할 수 있다.
2.  <strong>PoC 자동 생성 파이프라인</strong>: SCOUT에도 `poc_refinement` 스테이지가 있지만, FirmAgent처럼 fuzzing testcase를 seed로 활용하는 구조가 더 효과적일 수 있다.
3.  <strong>Ablation study 설계</strong>: 논문급 검증을 위해 각 컴포넌트의 기여를 분리해서 측정하는 방법론.

---

## ✅ 정리

FirmAgent는 <strong>"Fuzzing이 LLM의 hallucination을 억제한다"</strong>는 단순하지만 강력한 아이디어를 체계적으로 구현하고 검증한 논문이다.

| 핵심 수치 |   |
| --- | --- |
| Precision | 91.0% |
| TP (Confirmed Vuln) | 182 / 200 |
| PoC 자동 성공률 | 91.8% |
| CVE 할당 | 17개 |
| Unique (다른 도구 미탐지) | 140개 |
| FPR | 9.0% |

<strong>가장 인상 깊은 것</strong>: Firm-Cut ablation에서 fuzzing 정보를 제거하면 precision이 91% → 74%로 떨어진다는 결과. LLM을 잘 쓰려면 "좋은 컨텍스트를 주는 것"이 핵심이라는 교훈을 정량적으로 보여준다.

<strong>아쉬운 것</strong>: 14개 펌웨어라는 규모. 이 규모에서 91%가 수백 개 규모에서도 유지될지는 후속 연구가 필요하다. 에뮬레이션 전제도 현실적 제약.

내가 SCOUT를 발전시키면서 가장 많이 참고할 포인트는 <strong>"LLM에게 어떤 컨텍스트를 줘야 hallucination이 줄어드는가"</strong>에 대한 이 논문의 답 — fuzzing이 수집한 실제 런타임 정보 — 이다.

---

## 참고 자료

-   논문 원문: [NDSS 2026 Proceedings](https://www.ndss-symposium.org/ndss-paper/firmagent-leveraging-fuzzing-to-assist-llm-agents-with-iot-firmware-vulnerability-discovery/)
-   GitHub: [vul337/FirmAgent](https://github.com/vul337/FirmAgent)
-   SCOUT: [R00T-Kim/SCOUT](https://github.com/R00T-Kim/SCOUT)

---

> 이 글은 세종대학교 CYAI Lab 세미나에서 발표한 내용을 블로그용으로 재구성한 것입니다.
