### 인트로: 끝난 줄 알았지? (The Nightmare Continues)

2015년 Samy Kamkar의 <strong>RollJam</strong>이 공개됐을 때, 제조사들은 꽤 빨리 대응을 시작했습니다.

-   “Jamming이 감지되면 해당 프레임은 버리자”
-   “롤링코드에 <strong>타임스탬프</strong>를 붙여 재사용을 막자”
-   “[아예 <strong>FHSS(Frequency Hopping)</strong> 를 써서 특정 주파수 대역만 때리는 Jam을 피하자](https://patents.google.com/patent/US20170320465A1)”

겉으로 보기에는 “이제 RollJam은 옛날 얘기 아닌가?” 싶습니다.

하지만, 방어가 한 발 나가면 공격은 두 발 나갑니다.

-   [<strong>RollBack</strong>](https://arxiv.org/abs/2210.11923)은 “이미 사용해서 무효가 된 과거 코드”를 다시 유효하게 만들고
-   [<strong>SDR RollJam / FHSS RollJam / Enhanced RollJam</strong>](https://ceur-ws.org/Vol-3731/paper40.pdf)은 하드웨어와 파형 레벨에서 RollJam을 “업그레이드”하고
-   [<strong>RollCAN</strong>](https://dl.acm.org/doi/10.1145/3736130.3762686)은 RF를 포기하고 아예 <strong>CAN 버스로 점프</strong>해 RollJam 철학을 이식합니다.
-   마지막으로 [<strong>AI/ML 기반 공격/방어</strong>](https://www.mdpi.com/2079-9292/11/20/3376)가 등장하면서, RKE 보안은 완전히 다른 국면으로 들어가고 있습니다.

이번 편에서는 단순 나열이 아니라, <strong>“방어가 바뀔 때마다 공격이 어떻게 형태를 바꿔 따라붙었는지”</strong>를 축으로 RollJam 이후의 <strong>7가지 계보</strong>를 기술적으로 파헤쳐 봅니다.

![](/blog/rolljam-3-extensions-and-wrap-up/01.webp)

---

## 3.1 RollBack: 시간을 되돌리는 공격

<strong>키워드: Time-agnostic Replay, Resynchronization Abuse</strong>

-   발표: <strong>Black Hat USA 2022</strong>, 이후 [저널 논문](https://arxiv.org/abs/2210.11923)으로 확장 (L. Csikor et al.)
-   요약: _“한 번만 쓰고 버린다”_는 롤링코드의 전제를 부정
-   핵심: <strong>재동기화(Resync) 로직의 버그를 이용해 과거의 코드를 부활</strong>

### 3.1.1 RollJam vs RollBack – 철학의 차이

<table style="border-collapse: collapse; width: 100%; height: 105px;" border="1" data-ke-align="alignLeft" data-ke-style="style12"><tbody><tr style="height: 21px;"><td style="height: 21px;">구분</td><td style="height: 21px;">RollJam</td><td style="height: 21px;">RollBack</td></tr><tr style="height: 21px;"><td style="height: 21px;">타깃</td><td style="height: 21px;">RKE + RollJam 취약 차량 전반</td><td style="height: 21px;"><a href="https://nvd.nist.gov/vuln/detail/CVE-2022-37418" target="_blank" rel="noopener">특정 제조사 RKE 구현</a> (Honda, Nissan, Kia, Hyundai 등)</td></tr><tr style="height: 21px;"><td style="height: 21px;">필요 조건</td><td style="height: 21px;"><b>실시간 Jamming + Capture</b></td><td style="height: 21px;"><b>Jamming 불필요</b>, 단순 캡처</td></tr><tr style="height: 21px;"><td style="height: 21px;">캡처 시점</td><td style="height: 21px;">공격 시점에 현장에서 수행</td><td style="height: 21px;">과거에 한 번 캡처해두면 됨</td></tr><tr style="height: 21px;"><td style="height: 21px;">재사용 가능성</td><td style="height: 21px;"><b>한 번 쓰면 끝 (그 코드 소멸)</b></td><td style="height: 21px;"><a href="https://arxiv.org/abs/2210.11923" target="_blank" rel="noopener"><b>시간 무관(Time-agnostic)·반복 가능</b></a></td></tr></tbody></table>

RollJam은 <strong>미래에 쓸 수 있는 코드 하나를 ‘예약’</strong>하는 공격이었습니다, 반면 RollBack은 아예 <strong>“과거로 롤백해서, 이미 쓴 코드를 다시 유효하게”</strong> 만듭니다.

### 3.1.2 공격 원리: Resynchronization의 배신

RKE 시스템에는 “카운터가 너무 멀어졌을 때”를 복구하기 위한 <strong>Resync 메커니즘</strong>이 있습니다.

일반적인 그림은 이렇습니다.

1.  차량은 마지막으로 본 카운터 Ctr\_car를 기억하고 있음
2.  FOB에서 들어온 코드가

```bash
Ctr_car < Ctr_rx ≤ Ctr_car + W (윈도우 내) → 정상
Ctr_rx가 너무 커서 윈도우 밖 → 별도의 Resync 알고리즘 실행
```

문제는, 일부 구현에서 이 Resync 로직이 <strong>허술하거나, 아예 잘못 구현</strong>되어 있었다는 것입니다.

RollBack 논문의 핵심 포인트:

-   두 개의 <strong>연속된 유효 신호</strong>를 순서대로 재생하면
-   특정 차량들은 <strong>“과거의 카운터 상태로 되돌아가는 것과 같은 효과”</strong>를 보이며
-   그 지점부터 <strong>이미 사용한 코드들도 다시 유효</strong>해지는 롤백 현상 관찰

즉, 카운터 검증 로직이 꼬이면서:

> 지금부터는 과거에 썼던 시퀀스 전체를 다시 받아들이겠습니다.

라는, RKE 설계 철학과 정반대의 상태로 떨어지는 것.

### 3.1.3 공격 흐름 (간단 시나리오)

![Fig. 2 출처: RollBack: A New Time-Agnostic Replay Attack Against the Automotive Remote Keyless Entry Systems](/blog/rolljam-3-extensions-and-wrap-up/02.png)

*Fig. 2 출처: RollBack: A New Time-Agnostic Replay Attack Against the Automotive Remote Keyless Entry Systems*

1.  <strong>Capture 단계</strong>
    -   공격자는 타깃 차량 근처에서 RKE 신호를 일정 시간 수집
    -   예: C100, C101, C102, C103, ... (카운터 100, 101, 102, 103...)
2.  <strong>사용자 일상 사용</strong>
    -   피해자는 평소처럼 FOB를 쓰면서 카운터를 200, 300… 까지 올려버림
    -   <strong>이 시점에서 RollJam 방식 리플레이는 이미 끝장</strong> (과거 코드 무효)
3.  <strong>Trigger 단계</strong>
    -   공격자가 <strong>특정 순서·간격으로 캡처해둔 코드 몇 개</strong>를 재생
    -   예: [C120 → C121을 연속으로 5초 이내 송신 등](https://i.blackhat.com/USA-22/Thursday/US-22-Csikor-RollBack-A-New-Time-Agnostic-Replay-Attack.pdf) (차종마다 조건 다름)
    -   일부 RKE 구현은 이를 “이상 상태 → 재동기화 필요”로 오인
4.  <strong>Rollback 단계</strong>
    -   내부 상태 머신/카운터 관리 버그 때문에 RKE 수신기가 <strong>이전 상태로 돌아간 것처럼</strong> 동작
    -   이후 <strong>이미 사용한 코드들(C100~C121…)도 다시 수용</strong>
5.  <strong>Exploit</strong>
    -   공격자는 과거에 캡처해 둔 코드들을 하나씩 재생해 언제든 차량을 열 수 있게 됨.

이 공격은 <strong>Jamming이 전혀 필요 없고</strong>, <strong>“언제, 어디서 캡처했는지”</strong>와 상관없이 나중에 반복적으로 쓸 수 있기 때문에, 연구진이 <strong>“Time-agnostic Replay Attack”</strong> 이라고 부른 이유가 됩니다.

### 3.1.4 실제 영향

-   논문·BlackHat 발표 기준 테스트된 차량의 <strong>약 70%가 취약</strong>하다는 결과 보고
-   CVE-2022-37418: 특정 Nissan/Kia/Hyundai 차량의 RKE 수신기가 “두 개의 연속된 유효 신호”만으로 RollBack 공격을 허용하는 취약점으로 등록

![](/blog/rolljam-3-extensions-and-wrap-up/03.png)

<strong>방어 측면 메시지</strong>는 명확합니다.

> “Resync는 UX를 위한 예외 처리라고 가볍게 구현했는데, 알고 보니 그 자체가 새로운 공격 표면이었다.”

---

## 3.2 RollBack 변형들: Sequence/Overflow 계열

RollBack은 하나의 PoC가 아니라, <strong>“Resync 로직을 틀리게 짠 모든 구현을 관통하는 공격 패턴</strong>”에 가깝습니다.

실제 분석·PoC들을 보면, 패턴은 대략 두 가지 계열로 정리할 수 있습니다.

### 3.2.1 [Sequence-based RollBack](https://i.blackhat.com/USA-22/Thursday/US-22-Csikor-RollBack-A-New-Time-Agnostic-Replay-Attack.pdf)

<strong>아이디어:</strong> “특정 시퀀스의 명령 조합이 내부 상태 머신을 엉망으로 만든다”

-   예시 패턴들:
    -   LOCK → LOCK → TRUNK 같은 비정상/드문 시퀀스
    -   연속된 UNLOCK 신호를 일정 시간 내에 반복
-   일부 구현에서, 이런 비정상 시퀀스를 받으면 “키가 미친 것 같다 → 초기화/Resync 모드 진입” 같은 로직이 들어있음

공격자는 이 “비정상 시퀀스”를 이용해

1.  RKE를 Resync 모드로 몰아넣고
2.  과거 코드/미래 코드들을 다시 유효하게 만드는

<strong>RollBack-like 상태</strong>를 유도할 수 있습니다.

### 3.2.2 Overflow-based RollBack

<strong>아이디어:</strong> “카운터 오버플로우를 제대로 처리 안 하면, 다시 0으로 돌아가는 순간이 생긴다”

-   대부분의 RKE 카운터는 16비트 또는 32비트 정수
-   설계상으로는 “카운터가 넘치면 더 이상 사용되지 않는다”거나 “특별한 초기화 절차를 요구해야” 안전함
-   하지만 일부 구현은:
    -   Ctr가 최댓값에 도달했을 때 <strong>다시 0으로 롤오버</strong>되면서도
    -   과거 값에 대한 방어(“이건 너무 과거잖아”)가 제대로 되어 있지 않음

이 경우 공격자는:

1.  의도적으로 카운터를 최댓값까지 밀어붙이고
2.  오버플로우 이후 구간에서
3.  과거 코드/특정 시퀀스를 재생해 재동기화/롤백을 유도할 수 있습니다.

> 요약: RollJam이 “윈도우 앞쪽(미래)”를 공략한다면, RollBack 계열은 “윈도우 뒤쪽(과거)과 롤오버 지점”을 공략하는 공격입니다.

---

## 3.3 SDR RollJam: 하드웨어의 족쇄를 끊다

<strong>키워드: Wideband, Multi-modulation, Toolchain</strong>

초기 [RollJam](https://github.com/eliddell1/RollJam)은 <strong>CC1101 + Teensy</strong>라는 저가형 조합을 썼습니다.

-   장점: 싸다, 작다, 구현이 쉽다
-   단점:
    -   특정 주파수(315/433 MHz) 중심
    -   지원하는 변조 방식·대역폭 한계
    -   새로운 OEM/변조 스킴이 나오면 다시 튜닝 필요

그래서 자연스럽게 이어진 게 <strong>SDR(Software Defined Radio)</strong> 기반 RollJam입니다.

![대표적인 SDR 중 하나인 HackRF One](/blog/rolljam-3-extensions-and-wrap-up/04.jpg)

*대표적인 SDR 중 하나인 HackRF One*

### 3.3.1 연구 사례: Unibo의 SDR RollJam 구현

2024년 Stabili et al. 은 <strong>“[Implementing and testing RollJam on Software-Defined Radios”라는](https://cris.unibo.it/bitstream/11585/999874/1/paper40.pdf)</strong> 논문에서, HackRF/USRP 계열 SDR로 RollJam 전체 체인을 구현·평가했습니다.

핵심 포인트:

-   <strong>Wideband Capture</strong>
    -   특정 433.92 MHz만 보는 게 아니라
    -   주변 수 MHz~수십 MHz 대역을 통째로 샘플링
    -   한 번의 캡처로 여러 타입의 FOB 신호를 동시에 분석 가능
-   <strong>Software Modulation/Demodulation</strong>
    -   ASK/OOK뿐 아니라 FSK/GFSK 등 다양한 변조를
    -   <strong>GnuRadio/커스텀 DSP 블록</strong>에서 구현
    -   차량/FOB가 어떤 변조를 쓰든, <strong>코드 수정만으로 적응</strong> 가능
-   <strong>Replay Automation</strong>
    -   Universal Radio Hacker(URH) 등과 연동해
        -   패킷 분석
        -   특정 패턴 필터링
        -   타이밍 맞춰 재생
    -   GUI 또는 스크립트로 반자동화

### 3.3.2 RFQuack: RollJam을 모듈로 제공하는 툴킷

Maggi et al. 의 [<strong>RFQuack</strong>](https://arxiv.org/abs/2104.02551) 프로젝트는 멀티 라디오 하드웨어 + 펌웨어 + Python 툴로 구성된 <strong>“범용 무선 프로토콜 해킹 툴킷”</strong>입니다.

![두 개의 RFQuack 모듈형 동글.](/blog/rolljam-3-extensions-and-wrap-up/05.png)

*두 개의 RFQuack 모듈형 동글.*

재미있는 점:

-   RollJam이 <strong>“대표 데모 모듈”</strong> 중 하나로 포함
-   특정 패턴의 패킷이 들어오면:
    -   즉시 Jam 전환
    -   캡처된 패킷을 가공/저장
    -   이후 원하는 타이밍에 재생

즉, RollJam은 더 이상 “한 해커의 PoC”가 아니라, <strong>툴킷의 한 기능</strong> 수준으로 추상화되어 버렸다는 것입니다.

> “무선 프로토콜 보안 분석”을 한다고 하면, RollJam 클래스 공격은 기본 레퍼토리로 들어간 시대.

---

## 3.4 FHSS RollJam: 주파수 호핑 위에서 춤추기

<strong>키워드: FHSS, Wideband / Reactive Jamming</strong>

RollJam이 공개된 이후, 업계가 가장 먼저 꺼내든 방어 카드 중 하나가 <strong>FHSS</strong>입니다. [(구글 특허)](https://patents.google.com/patent/US20170320465A1)

-   FOB ↔ 차량이 <strong>여러 채널(예: 433.1, 433.3, 433.5 MHz…)을</strong> <strong>Pseudo-random 시퀀스</strong>에 따라 빠르게 바꿔 가며 통신
-   공격자가 특정 채널만 Jam해선 전체 패킷을 깨기가 어려워짐

그러면 “RollJam은 FHSS 나오면 끝난 거냐?” → 당연히 공격자도 가만있지 않았습니다.

### 3.4.1 Wideband Jamming

SDR + 충분한 출력이 있다면, 애초에 “개별 채널”이라는 개념을 무시해 버릴 수 있습니다.

-   예: 433~435 MHz 전체에 넓은 대역 노이즈를 뿌리기
-   RKE에서 사용하는 모든 호핑 채널을 <strong>한 방에 덮어버리는 방식</strong>

단점:

-   전력 소모 크고, 눈에 띌 수 있음
-   규제 위반 가능성 높음

하지만 <strong>실험실/PoC/근거리</strong> 기준에서는 충분히 가능하고, 일부 논문/특허에서도 “FHSS라도 Wideband Jam에는 취약”하다는 점은 반복적으로 지적됩니다.

### 3.4.2 Reactive Jamming

조금 더 “똑똑한” 방식은 <strong>Reactive Jammer</strong>입니다.

1.  공격자는 SDR로 RKE 대역을 <strong>수신 모드로 모니터링</strong>
2.  특정 특징:
    -   Preamble 패턴
    -   FFT 상의 에너지 변화
    -   제조사별 시그니처등을 기반으로 “지금 FOB가 말하기 시작했다”를 감지
3.  감지 순간:
    -   <strong>스크립트/FPGA 로직</strong>이 즉시 Jam 신호 발사
    -   호핑 시퀀스를 어느 정도 역공학했다면, “다음에 이동할 채널”에도 선제적으로 Jam 준비

이 방식은:

-   FHSS를 그대로 “따라가면서” Jam 하는 형태
-   차량 입장에서는 <strong>“어느 채널로 튀어도 항상 잡음이 깔려 있는 것처럼”</strong> 보이게 됩니다.

결국 FHSS 도입은 난이도·비용을 올렸지만, <strong>Wideband + Reactive Jamming + SDR</strong> 조합에는 취약할 수밖에 없다는 게 현재까지의 [결론](https://ceur-ws.org/Vol-3731/paper40.pdf)입니다.

---

## 3.5 Enhanced RollJam: “스텔스” 지향 지능형 Jamming

<strong>키워드: Smart Jamming, Low-duty Interference</strong>

초기 RollJam은 꽤 <strong>무식한 방식</strong>이었습니다.

-   FOB가 말하는 내내
-   꽤 오랫동안
-   꽤 큰 파워로
-   같은 대역에 Jam 신호를 깔아버리는 형태

최신 차량들은 <strong>“비정상적인 지속 Jam 패턴”</strong>을 RF 레벨에서 탐지하고 알람을 띄우거나, 아예 해당 상황에서 RKE를 비활성화하는 방어책을 [일부 도입](https://www.automotiveworld.com/articles/mitigating-vulnerabilities-in-keyless-entry-systems/)했습니다.

그래서 등장하는 개념이 <strong>Enhanced/Stealth RollJam</strong>입니다.

### 3.5.1 Smart Jamming 전략

기본 아이디어:

> “필요한 순간에만, 아주 짧게, 최소한만 때리자”

구체적으로는:

1.  <strong>Preamble 스니핑</strong>
    -   CC1101/SDR에서 <strong>Preamble+Sync Word 감지용 로직</strong>만 항상 돌려둠
    -   “이건 FOB 패킷 같다” 판단되면
2.  <strong>핀포인트 Jam</strong>
    -   Preamble 끝나고, <strong>Payload 구간 일부</strong>에만
    -   수 ms~수십 ms 단위로 Jam
    -   차량 입장에서는:
        -   Sync는 찾았는데
        -   CRC가 안 맞거나
        -   데이터 일부가 깨져서 그냥 버리는 상황
3.  <strong>저 duty-cycle</strong>
    -   전체 시간 대비 Jam ON 시간 비율을 극단적으로 낮춰:
        -   RF 모니터링 장비·탐지 로직이
        -   “특정 패턴의 Jam”을 통계적으로 인지하기 어렵게 함

RFQuack 같은 툴킷은 이미 <strong>“패킷이 특정 패턴과 매칭되면, 그때만 개입”</strong>하는 in-flight packet filtering / manipulation 기능을 지원합니다.

이 개념을 RollJam에 적용하면:

-   <strong>공격 성공률은 유지</strong>
-   <strong>탐지 가능성은 최소화</strong>

라는, 공격자 입장에서는 “맛있는 조합”이 됩니다.

Stabili 등의 [SDR RollJam](https://ceur-ws.org/Vol-3731/paper40.pdf) 구현에서도 <strong>Jamming 타이밍/지속시간 최적화</strong>가 성공률·은닉성의 핵심 변수로 등장합니다.

---

## 3.6 RollCAN / CAN RollJam: RF가 막히면 선을 탄다

<strong>키워드: In-vehicle Network, CAN Error-based Jamming</strong>

이제부터는 더 노골적인 이야기입니다.

> “무선이 까다로워지면, 그냥 차 안으로 들어가서 <strong>CAN 버스</strong>를 건드리면 되지 않나?”

2025년 Hamborg et al. 은 “[<strong>RollCAN – CAN-bus based RollJam-Attack</strong>](https://dl.acm.org/doi/10.1145/3736130.3762686)”를 발표합니다.

아이디어 한 줄 요약:

> “RollJam의 Jam & Capture 패턴을 RF 대신 CAN 버스에 적용해 보자.”

### 3.6.1 공격 벡터

-   진입점:
    -   OBD-II 포트
    -   깨진 헤드램프/테일램프/사이드미러 통해 노출된 CAN 배선
    -   애프터마켓 장비(블랙박스, 텔레매틱스 모듈) 취약점 등([fbi.h-da.de](https://fbi.h-da.de/en/single-news/rollcan))
-   전제:
    -   일부 차량은 <strong>RKE 메시지를 CAN 버스 상에서 중계</strong>하거나
    -   도어락 제어가 CAN 메시지 기반으로 이뤄짐
    -   (도어 ECU, BCM, RKE 모듈 간 통신)

### 3.6.2 Jam & Capture in CAN

![RollCan 시스템 아키텍처 출처: RollCAN – CAN-bus based RollJam-Attack](/blog/rolljam-3-extensions-and-wrap-up/06.png)

*RollCan 시스템 아키텍처 출처: RollCAN – CAN-bus based RollJam-Attack*

CAN 버스에서 “Jamming”은 RF와는 방식이 다릅니다.

-   CAN의 arbitration·에러 처리 특성을 이용:

1.  <strong>Sniff</strong>
    -   공격 장비가 CAN 버스를 모니터링
    -   사용자의 RKE 조작으로 인해 “문 열어” CAN 프레임이 지나가는 시점 포착
2.  <strong>Inject (Jamming)</strong>
    -   같은 순간에 <strong>더 높은 우선순위 ID</strong>를 보내거나
    -   에러 프레임을 연속적으로 쏴서
    -   원래의 도어락 메시지가 <strong>버스 상에서 충돌/취소</strong>되도록 유도
3.  <strong>Capture</strong>
    -   원래 도어락 메시지는 <strong>일부 ECU에 전달되지 못했지만</strong>
    -   공격 장비는 이미 그 내용(롤링코드/상태)을 캡처해 둔 상태
4.  <strong>Replay</strong>
    -   나중에 공격자가 같은 CAN 프레임을 단독으로 쏘면, 도어 ECU는 이를 정상 메시지로 받아들이고 문을 열어 줌.

즉, 논문이 말하듯:

> “RollCAN은 물리적으로 RF를 공격하지 않고, RKE 메시지가 흘러가는 <strong>차량 내부 네트워크</strong>를 공격한다.”

### 3.6.3 의미

-   <strong>무선 방어(타임스탬프, FHSS, UWB 등)를</strong> 아무리 강화해도
-   내부에서 RKE 메시지가 평문으로 돌아다니면
    -   물리 접근 + CAN 주입만으로 RollJam급 공격이 가능

그래서 최근 [SoK·스마트키 보안 동향 논문](https://www.researchgate.net/publication/391461313_SoK_Stealing_Cars_Since_Remote_Keyless_Entry_Introduction_and_How_to_Defend_From_It)들은

-   Secure CAN / Authenticated CAN
-   차량 내부에서도 <strong>암호·MAC을 통한 메시지 보호</strong>
-   도어락/시동 등 안전·보안 관련 신호에 대해 <strong>강한 도메인 분리·하드닝</strong>을 강조하고 있습니다.

---

## 3.7 AI RollJam: 스스로 학습하는 공격·방어 도구

<strong>키워드: RF Classification, Pattern Learning, Protocol Fuzzing</strong>

마지막은 현재진행형·미래형에 가까운 이야기입니다.

“AI RollJam”이란 이름의 정식 논문이 있는 건 아니지만, 이미 퍼즐 조각은 다 나와 있습니다.

### 3.7.1 RF 신호 분류(Classification) – 공격·방어 양면 칼

최근 무선 통신 분야에서는:

-   <strong>Automatic Modulation Classification(AMC)</strong>
-   <strong>무선 신호 분류 RF Fingerprinting</strong>
-   <strong>SDR 기반 신호 침입 탐지</strong>

같은 주제에 [<strong>CNN/LSTM/Attention</strong>](https://www.researchgate.net/publication/357902330_Deep_Learning-based_Wireless_Signal_Classification_in_the_IoT_Environment) 같은 딥러닝이 활발히 적용되고 있습니다. RKE 특화 연구도 이미 등장했습니다.

-   VGG-16 + SVM으로 <strong>RKE 리플레이 공격 탐지/식별</strong>([ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2590123023003705?utm_source=chatgpt.com))
-   Jetson TX2 같은 임베디드 보드 위에 올린
-   <strong>신호 침입 탐지용 ML 모델</strong>([phaidra.ustp.at](https://phaidra.ustp.at/detail/o%3A3078?utm_source=chatgpt.com))

이는 <strong>방어 입장</strong>에서 큰 희망입니다.

-   “이건 정상 FOB가 쏜 신호인지, 공격자가 재생한 것인지”
-   “이 패턴은 일상적인 혼선인지, 공격적 Jamming인지”

를 <strong>RF 레벨에서 AI가 분류</strong>할 수 있기 때문입니다.

하지만 공격자 입장에서도 이런 기술은 그대로 무기화될 수 있습니다.

### 3.7.2 공격 관점에서의 AI 활용 시나리오

예를 들어, “AI RollJam”을 상상해 보면:

1.  <strong>Signal Classification</strong>
    -   SDR로 들어오는 수많은 신호 중에서 <strong>“이건 특정 제조사 FOB 신호다”</strong>를 딥러닝 기반 분류기로 실시간 식별
    -   여러 제조사/프로토콜이 섞인 주차장 환경에서 타깃 차량 신호만 골라 공격 가능
2.  <strong>Jamming 타이밍 최적화</strong>
    -   다양한 Jam 타이밍/지속시간/파형을 탐색하면서,
    -   <strong>“어떤 패턴에서 차량이 가장 잘 열리고, 로그도 안 남는지”</strong>를 RL(강화학습)·AutoML로 자동 탐색
3.  <strong>Resync/윈도우 Reverse Engineering</strong>
    -   차량별로 롤링코드 허용 윈도우·Resync 패턴을 ML이 관측·학습해
    -   RollBack/Enhanced RollJam 성공 확률이 높은 “최적 시퀀스”를 스스로 찾아낼 수 있음

즉, 지금까지 사람 손으로 하던 <strong>“Protocol Reconnaissance”</strong>을 AI가 대신 수행하는 시대가 오는 건 시간문제입니다.

---

## \[결론\] RollJam 유니버스에서 살아남는 법

RollJam → RollBack → SDR/FHSS/Enhanced RollJam → RollCAN → AI RollJam까지 짧게는 10년 남짓한 시간 동안, [공격과 방어는 이렇게 오고 갔습니다.](https://arxiv.org/html/2505.02713v1)

<strong>패턴을 요약하면:</strong>

1.  <strong>암호가 아니라 프로토콜이 털린다</strong>
    -   KeeLoq, AES 자체를 깨서 들어간 게 아니라
    -   롤링코드 윈도우, Resync, PKE/RKE UX가 뚫림
2.  <strong>방어가 한 층 생기면, 공격은 한 단계 더 아래로 내려간다</strong>
    -   RF 레벨 방어 → 프로토콜 레벨 공격 (RollBack)
    -   프로토콜 패치 → PHY/SDR/FHSS 공격
    -   RF 하드닝 → CAN 내부 RollCAN
    -   룰 기반 탐지 → AI 기반 분류/탐지/공격
3.  <strong>“완벽한 방어”는 없지만, “비용을 기하급수적으로 올리는 방어”는 가능하다</strong>
    -   Timestamp + 양방향 인증 + Secure CAN + UWB 등 여러 층을 쌓으면, 공격 난이도/비용/리스크는 급격히 증가합니다.

<strong>보안 담당자/연구자 입장에서의 take-away:</strong>

-   RollJam/ RollBack/ RollCAN은 “옛날 재밌는 해킹 사례”가 아니라 <strong>무선·임베디드·프로토콜·AI가 모두 섞인 “지금-여기”의 문제</strong>입니다.
-   RKE/PKES를 설계·검토할 때는
    -   암호 알고리즘(AES냐 KeeLoq냐)을 논하기 전에
    -   <strong>윈도우/Resync/에러 처리/State Machine/내부 네트워크 흐름</strong>부터 모델링해야 합니다.
-   마지막으로, 방어 측 AI/ML을 도입한다면
    -   동시에 <strong>공격 측도 같은 도구를 쓸 수 있다</strong>는 전제를 항상 깔고 설계해야 합니다.

---

## ✅ 마무리: SoK의 4가지 질문으로 다시 정리하는 “RollJam 유니버스”

여기까지 우리는 RollJam 이후 공격이 어떻게 “진화”했는지(롤백, SDR, FHSS 대응, CAN으로의 점프, AI까지) 계보를 따라왔습니다.

그런데 이 흐름을 한 번 더 깔끔하게 정리해 주는 프레임이 있습니다. SoK 논문은 결론을 <strong>4개의 Research Question(RQ)에</strong> 대한 답으로 닫습니다.

### RQ1) 기술 진화가 보안을 높였는가?

<strong>부분적으로는 그렇다.</strong>

암호 자체를 깨는 공격(cryptographic attacks)은 점점 어려워졌습니다. 하지만 그 대신 공격은 “암호”보다 더 아래/바깥을 파고듭니다. 즉 <strong>릴레이 같은 물리 계층 공격</strong>, 그리고 <strong>웹/백엔드 기반 공격 표면</strong>이 새로 강해졌습니다.

→ 이 글의 관점에서 말하면: “RollJam을 막는 패치”가 생겨도, 공격은 RollBack·Relay·Web·In-vehicle로 형태를 바꾸며 살아남았습니다.

### RQ2) 공격 전략은 변했는가?

<strong>크게 변하지 않았다.</strong>

SoK가 강조하는 요지는, “새로운 변종이 쏟아져도 핵심 클래스(relay/replay)는 계속 남는다”는 점입니다. 특히 <strong>릴레이 공격은 여전히 강력하고 접근 난이도가 낮은 편</strong>이라, 현실에서 가장 무서운 카드로 남아 있습니다.

→ 그래서 “RollJam 유니버스”를 다룰 때도, 신기한 변종보다 지속적으로 살아남는 공격 클래스를 기준으로 모델링하는 게 실무적으로 더 중요합니다.

### RQ3) 방어책은 효과적이고 배포 가능한가?

<strong>논문 속 방어책은 ‘좋은 아이디어’인 경우가 많지만, 상용 적용은 드물다.</strong>

비용(하드웨어 추가), 복잡도(프로토콜 변경), 레거시 호환성(기존 차량/키) 때문에, 학계에서 제안된 많은 방어책이 실제 차량에 널리 들어가진 못했다는 결론입니다.

→ “가능한 방어”와 “배포 가능한 방어”는 다릅니다. 그래서 설계/보안 검토에서 <strong>현실 제약(원가, 생산, 유지보수, 규제, 사용자 UX)을</strong> 같이 넣어야 합니다.

### RQ4) 그럼 무엇이 필요하나?

SoK의 결론은 꽤 직설적입니다. <strong>security-by-obscurity(폐쇄적 보안)에</strong> 기대는 방식에서 벗어나, <strong>투명성과 커뮤니티 협력</strong>이 필요하다고 말합니다. 또한 앞으로의 큰 축으로 <strong>웹 API/웹 서비스 보안</strong>과 <strong>UWB 구현의 표준화된 가이드라인</strong>(“UWB를 쓴다”가 아니라 “안전하게 구현한다”)을 강조합니다.

→ 즉, 앞으로의 RKE/PKES 보안은 “RF만 잘하면 끝”이 아니라 <strong>RF + 차량 내부 네트워크 + 클라우드/앱 생태계까지 한 덩어리</strong>로 봐야 한다는 이야기입니다.

---

![](/blog/rolljam-3-extensions-and-wrap-up/07.png)

AutoHack2025를 준비하며 알게 된 RollJam으로 이렇게 3부작 글을 마무리하게 되었네요. 보안은 역시 너무나도 넓습니다.

질문, 오류가 있다면 댓글로 남겨주세요. 감사합니다!

---

## <strong>참고자료</strong>

<strong>\[Main SoK Paper\]</strong>

-   Bianchi, T. et al., “SoK: Stealing Cars Since Remote Keyless Entry Introduction and How to Defend From It” (VehicleSec 2025)
    -   [https://www.usenix.org/conference/vehiclesec25/presentation/bianchi](https://www.usenix.org/conference/vehiclesec25/presentation/bianchi)

<strong>\[Evolution 1: RollBack & RollingPwn\]</strong>

-   Csikor, L. et al., “RollBack: A New Time-Agnostic Replay Attack Against the Automotive RKE Systems” (Black Hat USA 2022 / ACM Trans)
    -   [https://i.blackhat.com/USA-22/Thursday/US-22-Csikor-RollBack-A-New-Time-Agnostic-Replay-Attack.pdf](https://i.blackhat.com/USA-22/Thursday/US-22-Csikor-RollBack-A-New-Time-Agnostic-Replay-Attack.pdf)
-   NIST NVD, “CVE-2022-37418 Detail” (Resynchronization Vulnerability)
    -   [https://nvd.nist.gov/vuln/detail/CVE-2022-37418](https://nvd.nist.gov/vuln/detail/CVE-2022-37418)
-   RollingPwn, “RollingPwn: Attack against Honda Vehicles”
    -   [https://rollingpwn.github.io/rolling-pwn/](https://rollingpwn.github.io/rolling-pwn/)

<strong>\[Evolution 2: SDR & Enhanced Jamming\]</strong>

-   Stabili, D. et al., “Implementing and testing RollJam on Software-Defined Radios” (ITASEC 2024 / CEUR-WS)
    -   [https://ceur-ws.org/Vol-3731/paper40.pdf](https://ceur-ws.org/Vol-3731/paper40.pdf)
-   Depp, Z. et al., “Enhanced Vehicular Roll-Jam Attack using a Known Noise Source” (VehicleSec 2023)
    -   [https://www.ndss-symposium.org/wp-content/uploads/vehiclesec2023\_23\_paper.pdf](https://www.ndss-symposium.org/wp-content/uploads/vehiclesec2023_23_paper.pdf)
-   Maggi, F. et al., “RFQuack: A Universal Hardware-Software Toolkit for Wireless Protocol Security Analysis”
    -   [https://github.com/TrendMicro/rfquack](https://github.com/TrendMicro/rfquack)

<strong>\[Evolution 3: Network & AI\]</strong>

-   Hamborg, Y. et al., “RollCAN – CAN-bus based RollJam-Attack” (ACM CSCS '24)
    -   [https://dl.acm.org/doi/10.1145/3635463.3635469](https://dl.acm.org/doi/10.1145/3635463.3635469)
-   Joo, K. et al., “Experimental Analyses of RF Fingerprint Technique for Securing Keyless Entry System” (LASER 2020)
    -   [https://www.ndss-symposium.org/wp-content/uploads/2020/02/Laser2020\_paper\_8.pdf](https://www.ndss-symposium.org/wp-content/uploads/2020/02/Laser2020_paper_8.pdf)
