## 인트로: 모순을 해결하는 기술

지난 글에서 우리는 RKE와 롤링코드의 허점을 이론적으로 살펴봤습니다.

이론만 보면 RollJam은 꽤 “깔끔한” 아이디어입니다.

-   한 번 안 먹힌 코드(Code A)를 <strong>훔쳐서</strong>
-   두 번째 버튼을 누를 때 <strong>대신 써주고</strong>
-   그 사이에 <strong>다음 코드(Code B)를 훔쳐서</strong> 나중에 쓰는 공격.

문제는, 이걸 <strong>현실의 RF 환경에서 구현</strong>하려고 할 때입니다.

> “내가 엄청 큰 소리(Jamming) 를 지르면서, 동시에 옆 사람의 <strong>귓속말(FOB 신호)</strong> 을 들을 수 있을까?”

무선 세계에서 Jamming은 말 그대로 <strong>강력한 잡음(Interference)</strong>을 뿌리는 행위입니다.

일반적으로는 내가 Jam을 세게 때리면 → 상대방 수신기는 물론이고, <strong>내 수신기까지 같이 먹통</strong>이 되는 게 정상입니다.

Samy Kamkar는 이 물리적인 모순을 어떻게 우회했을까요?

“차량은 못 듣게 막으면서, 나는 그 신호를 캡처하는” 게 어떻게 가능했을까요?

이번 글에서는 RollJam의 <strong>기술적 구현 원리</strong>를

1.  RF/SINR 레벨
2.  시퀀스 레벨
3.  코드/상태 머신 레벨

에서 끝까지 해부해 봅니다.

![](/blog/rolljam-2-how-it-works/01.png)

---

## 2.1 공격의 핵심 전제: 신호 대 간섭 및 잡음 비(SINR)와 거리, 대역폭

먼저 물리 계층 관점에서 이 상황을 수식으로 한 번 써 보겠습니다.

차량 수신기가 보는 신호를 단순화하면:

$r\_\\text{car}(t) = s\_\\text{FOB}(t) + s\_\\text{jam}(t) + n(t)$

-   $s\_\\text{FOB}(t)$: 사용자의 FOB에서 오는 유효 신호
-   $s\_\\text{jam}(t)$: RollJam에서 뿌리는 Jam 신호
-   $n(t)$: 환경 잡음(thermal noise, 기타 간섭 등)

차량이 패킷을 제대로 복원하려면, 의도적 간섭까지 포함한 <strong>SINR(Signal to Interference plus Noise Ratio)</strong> 가 일정 임계치 이상이어야 합니다.

$\\mathrm{SINR}\\text{car} = \\frac{P\\text{FOB}}{P\_\\text{jam}+P\_n} \\ge \\gamma\_\\text{demod}$

RollJam이 하고 싶은 건 정반대입니다.

$\\frac{P\_\\text{FOB}}{P\_\\text{jam}+P\_n} \\ll \\gamma\_\\text{demod}$

즉, <strong>차량 입장에서는 FOB 신호가 Jam에 완전히 묻혀서 해석 불가능</strong>해야 합니다.

반면, 공격자의 수신기(RollJam RX)가 보는 신호는:

$r\_\\text{RJ}(t) = s\_\\text{FOB}(t) + s'\_\\text{jam}(t) + n'(t)$

여기서 포인트는 두 가지입니다.

1.  <strong>거리(거리 감쇠)와 안테나 배치</strong>
2.  <strong>대역폭(Bandwidth)과 필터링 전략</strong>

## 2.1.1 거리(거리 감쇠)로 만든 “SINR 비대칭”

전파는 거리의 제곱에 반비례하여 세기가 줄어듭니다. (Friis 전송 방정식)

대충 감으로만 보면

-   <strong>FOB → 차량</strong>: 예를 들어 10m
-   <strong>RollJam → 차량</strong>: 차 바로 아래/옆에 설치, 0.5~1m
-   <strong>FOB → RollJam</strong>: RollJam이 “차 근처”에 있다고 해도 FOB와 3~5m 정도 거리

정도로 설정할 수 있습니다.

이 상황에서:

-   차량 수신기 입장:
    -   Jammer(RollJam TX)는 <strong>바로 옆</strong>에서 세게 때리고,
    -   FOB는 <strong>멀리서 약하게</strong> 날아옵니다.
    -   $P\_\\text{jam} \\gg P\_\\text{FOB}$인 상황.
-   RollJam RX 입장:
    -   Jammer(TX)와 수신기(RX)는 <strong>안테나 분리 + 회로 설계</strong>로 어느 정도 격리.
    -   FOB는 상대적으로 충분한 세기로 들어옴.
    -   [무엇보다 RollJam은 <strong>자기가 뿌리는 Jam 파형을 알고</strong> 있어 (또는, 아예 Jam을 다른 주파수 대역/형태로 설계해) 신호 처리를 할 수 있습니다.](https://www.ndss-symposium.org/wp-content/uploads/2023/02/vehiclesec2023-23037-paper.pdf)

즉, 차량과 RollJam이 “같은 신호를 받는 게 아니다”가 핵심입니다.

-   차량: FOB + Jam + 잡음 → 대역폭도 넓고, 필터링도 “범용”
-   RollJam RX: FOB + (알고 있는 형태의 Jam) + 잡음 → 좁은 대역, 공격자 특수 튜닝

## 2.1.2 대역폭 차이: “수신 윈도우”를 누가 더 공격적으로 최적화할 수 있나

Jam & Capture를 “수신기 관점”에서 보면 결국 싸움의 축은 하나입니다.

> 얼마나 넓은 주파수 구간을 ‘유효 신호’로 받아들이도록 설계/세팅되어 있느냐(= channel filter / receive window)

### (1) 차량 수신기는 ‘현실적 허용오차’ 때문에 일정 폭의 수신 윈도우가 필요하다

차량 쪽 RKE 리시버는 현실적으로 아래를 감당해야 합니다.

-   발진기 편차/온도 변화에 따른 <strong>주파수 오프셋(드리프트)</strong>
-   환경 간섭, 다중경로 등으로 인한 <strong>채널 상태 변화</strong>
-   (구현/시장에 따라) 동일 대역에서 다양한 송신 특성을 가진 키를 수용하는 경우

결국 차량 수신기는 “이상적으로 한 점만 보는 필터”가 아니라, 운용을 위해 <strong>어느 정도 폭을 가진 수신 윈도우</strong>를 갖는 쪽으로 설계되기 쉽습니다.

### (2) 공격자는 “타깃 FOB 하나만” 잡으면 되니, 더 좁게 세팅할 여지가 있다

반대로 공격자는 <strong>단 하나의 FOB 신호</strong>만 안정적으로 잡으면 됩니다. 그래서 수신 체인을 더 공격적으로 튜닝할 수 있죠.

-   채널 필터 대역폭을 <strong>좁히면(narrower bandwidth)</strong> 필터가 통과시키는 잡음 전력(대략 $N \\propto B$)이 줄고, 같은 신호 세기에서도 <strong>복조 관점의 여유(SINR)가 좋아지는 방향</strong>으로 갑니다.

이 “대역폭을 줄여 수신을 예민하게 만든다”는 건 추상적인 얘기가 아니라, 예를 들어 CC1101 같은 Sub-GHz 트랜시버도 채널 필터/설정에 따라 수신 특성이 달라진다는 식으로 문서화돼 있습니다.

### (3) ‘살짝 빗겨 잼’이 나오는 이유: 같은 창 안에서 “차량만 더 힘들게” 만들고 싶기 때문

그래서 자주 언급되는 아이디어가, <strong>FOB 성분과 겹치되(차량 수신 윈도우 안), 공격자 쪽에선 상대적으로 분리/완화가 쉬운 형태</strong>로 간섭을 얹는 접근입니다.

다만 이건 <strong>튜닝 문제</strong>입니다.

-   너무 멀리 벗어나면 차량 수신 창 밖이라 간섭이 약해지고
-   너무 가까이/강하게 얹으면 공격자 캡처 품질도 같이 망가집니다.

여기서 결론은 단순합니다.

> 차량은 ‘운용을 위한 수신 윈도우’를 가져야 하고 공격자는 ‘타깃 1개 최적화’로 더 공격적인 세팅을 할 수 있다.
> 
> 이 비대칭이 Jam & Capture 성립을 돕는다.

---

## 2.2 “듣는 동시에 막기” – Jam & Capture 전략

![samy kamkar가 DEF CON에서 보여준 RollJam 하드웨어](/blog/rolljam-2-how-it-works/02.png)

*samy kamkar가 DEF CON에서 보여준 RollJam 하드웨어*

RollJam 하드웨어 사진을 보면 안테나가 두 개 달려 있습니다.

대부분의 구현은 <strong>TI CC1101 모듈 2개 + 마이크로컨트롤러(Teensy 3.1 등)</strong> 조합을 사용합니다.

역할 분담은 보통 이렇게 합니다.

-   <strong>CC1101 #1 → RX 전용 (FOB 신호 캡처)</strong>
-   <strong>CC1101 #2 → TX 전용 (Jamming + Replay)</strong>

하나의 RF 칩으로 “보내면서 들으려” 하면, PA(Power Amplifier) 출력이 LNA(Low Noise Amplifier)를 다 쓸어버리는 <strong>self-interference</strong> 문제가 생깁니다.

그래서 아예 <strong>물리적인 RF 체인을 분리</strong>해 버리는 거죠.

## 2.2.1 Jam 신호는 꼭 “정교한 노이즈”일 필요는 없다

RollJam에서 Jam의 목적은 “예쁜 노이즈(AWGN)를 생성하는 것”이 아닙니다. 목표는 훨씬 실용적이죠.

> 차량 수신기가 이번 버튼 입력을 ‘정상 프레임’으로 끝까지 처리하지 못하게 만들면 된다.
> 
> (프리앰블/동기 획득 → 복조 → 프레임 형식/CRC 검증 중 어디서든 실패하면 됨)

그래서 PoC 수준의 RollJam에서는 Jam 파형이 꼭 AWGN처럼 정교할 필요가 없습니다.

-   동일 채널(또는 매우 근접 채널)에서
-   FOB 전송 타이밍에 맞춰
-   충분한 간섭 성분을 얹어

차량의 동기 획득이나 복조 파이프라인을 흔들기만 해도, 수신기는 프레임을 “깨진 신호”로 보고 버릴 가능성이 크게 올라갑니다.

다만 여기서 RollJam은 한 가지를 더 만족해야 합니다.

> 막는 동시에 캡처해서, 나중에 재생할 수 있을 정도의 신호 품질이 남아야 한다.

그래서 Jam을 “아무렇게나 세게” 때리면 차량뿐 아니라 공격자 캡처까지 같이 망가지고, 이 딜레마가 Jam & Capture를 구현 난이도 있게 만드는 핵심 요인 중 하나가 됩니다.

## 2.2.2 타이밍의 핵심: Preamble/Sync Word/Payload

FOB가 보내는 패킷 구조를 단순화하면:

1.  <strong>Preamble</strong>: 주기적인 0101… 패턴 (수신기 타이밍/AGC/클럭 동기 맞추기)
2.  <strong>Sync Word</strong>: “여기서부터 진짜 데이터 시작”을 알려주는 고유 패턴
3.  <strong>Payload</strong>: 롤링코드, 시리얼, 기능 비트 등

수신기 입장에서는, 이 순서를 따라갑니다.

1.  Preamble 비슷한 패턴이 일정 시간 이상 보이면 → “어, 뭔가 신호 온다”
2.  Sync Word가 정확히 매칭되면 → “오케이, 이제부터 데이터로 읽자”
3.  그 다음 비트들을 샘플링/복원해서 Payload로 내보냄

RollJam이 Jam을 거는 타이밍은 대략 두 가지 전략이 가능합니다.

1.  <strong>Preamble부터 신나게 덮어버리기</strong>
    -   차량 수신기가 Sync Word까지 제대로 못 보고 <strong>아예 패킷 인식 실패</strong>.
    -   공격자는 좁은 대역폭/높은 감도로 Preamble+Payload를 최대한 복원.
2.  <strong>Preamble은 봐도 되는데, Sync Word/Payload를 깨버리기</strong>
    -   차량은 “뭔가 신호는 온 것 같은데 이상해서 버림”.
    -   공격자는 Preamble 이후 구간을 집중적으로 캡처/복조.

Samy의 PoC들은 이 부분을 <strong>정교하게 튜닝</strong>하기보다는

-   <strong>“일단 신호 감지되면 바로 Jam 시작” → 끝날 때까지 유지</strong>
-   그 와중에 RX에서 최대한 패킷을 기록

하는 식의 보다 러프한 전략에 가깝습니다.

그래서 <strong>“얼마나 빨리 Jam을 때릴 수 있느냐”</strong>가 구현 난이도의 핵심입니다.

---

## 2.3 시나리오 기반 공격 단계 상세 – Jamming & Replay

이제 물리 계층 얘기를 들고, 실제 시나리오에 “타임라인”을 붙여보겠습니다.

-   Ctr = 롤링코드 카운터 값
-   Code A = Ctr = 100일 때 생성된 코드
-   Code B = Ctr = 101일 때 생성된 코드

라고 할 때,

## Scene 1: 첫 번째 버튼 – The Trap

-   시점 T0
    -   피해자가 차량 앞에서 버튼을 한번 누릅니다.
    -   FOB:
        -   counter\_fob: 99 → 100
        -   Code A 생성 후 전송
-   RollJam:
    1.  <strong>RSSI 모니터링</strong> 중 “갑자기 신호 세기 상승” 감지.
    2.  즉시 TX 체인으로 Jam 신호 발사.
    3.  RX 체인은 <strong>가능한 좁은 대역/민감한 설정</strong>으로 패킷 전체를 캡처.
-   차량:
    -   Jam + FOB 신호가 섞인 걸 받아,
    -   <strong>Preamble/Sync를 제대로 인식하지 못하고 패킷을 버립니다.</strong>
    -   counter\_car는 여전히 99에 머무릅니다.
-   결과:
    -   사용자 입장: “어? 왜 안 열리지?”
    -   FOB: counter\_fob = 100으로 올라간 상태 고정
    -   공격자: Code A를 <strong>정상적으로 복원/저장</strong>해 둠 (아직 아무도 쓰지 않은 코드)

## Scene 2: 두 번째 버튼 – The Exploit

-   시점 T1
    -   피해자는 “아까는 잘 안 눌렸나 보다” 하고 다시 한 번 버튼을 누릅니다.
    -   FOB:
        -   counter\_fob: 100 → 101
        -   Code B 생성 후 전송
-   RollJam:
    1.  다시 RSSI 상승 → Jam 시작
    2.  RX로 Code B 캡처
    3.  <strong>Code B 기록이 끝난 직후</strong>,
        -   Jam을 <strong>아주 짧은 순간 멈추거나 줄인 뒤</strong>,
        -   <strong>Code A를 차량 쪽으로 재생(Replay)</strong>
-   차량:
    -   counter\_car = 99 상태에서 Code A 수신
    -   복호화/검증 결과:
        -   Ctr\_rx = 100 → “마지막으로 본 99보다 크고, 허용 윈도우 안”
        -   → 유효한 코드로 판단 → <strong>문을 열어줌</strong>
    -   counter\_car를 100으로 업데이트
-   결과:
    -   사용자 입장:
        -   “이번에는 잘 됐네”
        -   두 번째 눌렀을 때 문이 열렸으니 <strong>아무 의심 없이 지나감</strong>
    -   공격자 입장:
        -   Code A는 이제 사용됨 → 폐기
        -   Code B는 <strong>아직 차량이 본 적 없는, 미래의 유효 코드</strong>로 남아 있음

## Scene 3: 공격자의 이득 – The Future Code

-   시점 T2 (나중에, 아무 때나)
    -   피해자는 차를 타고 이동/주차/귀가 → 차를 세워둡니다.
    -   공격자는 차량 근처로 와서 <strong>Code B를 재생</strong>합니다.
    -   차량:
        -   현재 counter\_car = 100
        -   Code B는 Ctr = 101 → 허용 윈도우 내의 “다음 코드”
        -   → 아무 의심 없이 문을 열어줍니다.

이 과정을 한 번만 성공해도, 공격자는 <strong>“언제든 한 번 차를 열 수 있는 권한”</strong>을 얻습니다.

장치를 계속 붙여놓고 반복하면, [유효 코드를 여러 개 확보하는 것도 가능합니다.](https://en.wikipedia.org/wiki/Rolling_code)

---

![위에서 설명한 시나리오를 도식화한 그림](/blog/rolljam-2-how-it-works/03.png)

*위에서 설명한 시나리오를 도식화한 그림*

---

## 2.4 Samy Kamkar PoC 구현 분석 – 하드웨어 & 상태 머신

이제 RollJam PoC를 하드웨어/소프트웨어 관점에서 뜯어보겠습니다.

공개된 PoC는 깃허브에 있으니 참고하셔서 보시면 좋을 것 같습니다.

-   [https://github.com/eliddell1/RollJam](https://github.com/eliddell1/RollJam)
-   [https://github.com/CR11CS/RollJam-315MHz-433MHz](https://github.com/CR11CS/RollJam-315MHz-433MHz)

## 2.4.1 하드웨어 구성 (BOM 관점)

Samy가 DEF CON 23에서 소개한 RollJam의 핵심은 “<strong>싼 부품으로도 된다</strong>”였습니다.

대표적인 구성은 다음과 같습니다.

-   <strong>Controller</strong>
    -   Teensy 3.1 / 3.2 (Arduino 호환, 32-bit MCU, 상대적으로 빠른 클럭)
-   <strong>RF Module</strong>
    -   TI CC1101 RF 트랜시버 모듈 × 2
        -   하나는 <strong>RX 전용</strong>
        -   하나는 <strong>TX(Jamming + Replay) 전용</strong>
-   <strong>Antenna</strong>
    -   315 MHz 또는 433 MHz 대역용 와이어 안테나 혹은 작은 모노폴/다이폴
-   <strong>기타</strong>
    -   배터리 팩, 케이스 (동전 지갑 사이즈 정도), 스위치 등

코스트:

-   전체 BOM을 2015년 기준으로 잡으면, <strong>30~40달러 수준</strong>에서 구현 가능했다고 소개됩니다.

여기서 강조하고 싶은 포인트는:

> “이건 고가의 SDR 장비나 특수 하드웨어가 아니라, 취미용 RF 모듈과 소형 MCU로도 충분히 가능한 공격이다.”

라는 메시지입니다.

## 2.4.2 CC1101가 왜 많이 쓰였는가?

TI CC1101는 <strong>Sub-GHz 범용 RF 트랜시버</strong>로, [다음 같은 특징이 있습니다.](https://www.politesi.polimi.it/retrieve/46db7039-bdf5-46b4-9c96-55bcb75d3134/Tesi%20Alessandro%20Fiorillo.pdf)

-   주파수: 300~348 MHz, 387~464 MHz, 779~928 MHz 지원
-   변조: 2-FSK, GFSK, ASK/OOK 등
-   패킷 엔진:
    -   Preamble/Synch Word 검출
    -   자동 패킷 길이 처리
    -   CRC, 주소 필터링 등
-   설정 가능한 파라미터:
    -   대역폭(BW)
    -   데이터율(Baud Rate)
    -   출력 파워
    -   RSSI 측정, LQI 등

공격자 입장에서는,

-   합법 장비처럼 보이는 “범용 RF 칩”을
-   약간 다른 설정(필터 해제, 프라미스큐어스 모드 등)으로 사용하여 <strong>패킷을 “말 그대로 다 받아 보는” 스니퍼</strong>로 쓸 수 있습니다.

RollJam은 이 칩을 <strong>하나는 “듣는 용”, 하나는 “막고/재생하는 용”</strong>으로 써서 논리적으로 “듣는 동시에 막기”를 구현한 셈입니다.

---

## 2.4.3 소프트웨어 로직: 상태 머신(FSM) 관점

Samy의 PoC 코드는 구조적으로 보면 <strong>Finite State Machine(FSM)</strong> 입니다.

대표적인 상태들을 나열해 보면:

1.  <strong>IDLE</strong>
    -   아무 신호도 없을 때 대기 상태
    -   RX 체인은 RSSI를 모니터링하며 <strong>“신호가 올라오나”</strong> 감시
2.  <strong>JAM\_AND\_CAPTURE\_FIRST</strong>
    -   첫 번째 FOB 신호(Code A) 감지
    -   TX 체인: Jam 신호 발사
    -   RX 체인: 패킷 전체를 버퍼에 기록
    -   패킷이 끝났다고 판단되면:
        -   storedCodes\[0\] = Code A
        -   상태를 WAIT\_SECOND로 이동
3.  <strong>WAIT\_SECOND</strong>
    -   “사용자가 한 번 더 누를 때까지” 대기
    -   다시 RSSI 모니터링 → 두 번째 신호 감지
4.  <strong>JAM\_AND\_CAPTURE\_SECOND</strong>
    -   두 번째 FOB 신호(Code B) 감지
    -   TX: Jam 신호 발사
    -   RX: Code B 버퍼에 기록
    -   패킷 끝 감지 후:
        -   storedCodes\[1\] = Code B
        -   상태를 REPLAY\_FIRST로 이동
5.  <strong>REPLAY\_FIRST</strong>
    -   TX 체인으로 storedCodes\[0\] (Code A)를 차량에 전송
    -   이때 Jam을 끄거나 강도를 낮춰 <strong>차량이 코드 A를 제대로 받게</strong> 한다.
    -   이후 ATTACK\_READY로 이동
6.  <strong>ATTACK\_READY</strong>
    -   이제 공격자는 storedCodes\[1\] (Code B)를 들고 있는 상태
    -   별도의 트리거(시간/버튼/원격 명령 등)에 따라
    -   Code B를 재생할 수 있는 “준비 완료” 상태

이걸 아주 압축한 형태의 의사코드로 쓰면 대략:

```
loop() {
    switch (state) {
        case IDLE:
            if (RSSI_rx > TH1) {
                start_jamming();
                start_recording();
                state = JAM_AND_CAPTURE_FIRST;
            }
            break;

        case JAM_AND_CAPTURE_FIRST:
            if (packet_end_detected()) {
                stop_jamming();
                storedCodes[0] = recorded_packet;
                state = WAIT_SECOND;
            }
            break;

        case WAIT_SECOND:
            if (RSSI_rx > TH1) {
                start_jamming();
                start_recording();
                state = JAM_AND_CAPTURE_SECOND;
            }
            break;

        case JAM_AND_CAPTURE_SECOND:
            if (packet_end_detected()) {
                stop_jamming();
                storedCodes[1] = recorded_packet;
                state = REPLAY_FIRST;
            }
            break;

        case REPLAY_FIRST:
            // 잠깐 Jam을 멈추거나 줄이고
            transmit(storedCodes[0]); // Code A
            state = ATTACK_READY;
            break;

        case ATTACK_READY:
            // 나중에 원할 때 storedCodes[1] (Code B)를 재생
            break;
    }
}

```

여기서 중요한 건, 이게 “정교한 RF DSP”가 아니라

“RSSI 상승 감지 → Jam ON → 패킷 끝날 때까지 기록 → Jam OFF”라는

상대적으로 단순한 FSM으로도 [충분히 구현](https://github.com/eliddell1/RollJam)된다는 점입니다

---

## 2.4.4 “왜 타이밍이 이렇게까지 중요하냐”

꼭 한 번 짚고 넘어가면 좋은 포인트입니다.

-   <strong>너무 늦게 Jam을 때리면?</strong>
    -   차량이 이미 Preamble/Sync Word를 보고, Payload 일부까지 읽었을 수 있습니다.
    -   이 경우 일부 차량 구현에서는 “이상한 패킷”으로 로그를 남기거나, 특정 상황에서 방어 로직(예: Anti-DoS)을 작동시킬 수도 있습니다.
-   <strong>너무 일찍, 너무 오래 Jam을 때리면?</strong>
    -   사용자가 버튼을 여러 번 눌러도 계속 “안 된다”라고 느껴서 수상함을 느낄 수 있습니다.
    -   공격자가 원하는 건 <strong>"한 번 안 됐다가, 바로 다음 눌렀을 때 되는 경험”</strong>입니다.

그래서 PoC 구현에서는 보통:

-   CC1101의 <strong>GDO0/2 핀에 인터럽트</strong>를 걸어
    -   특정 신호(예: Sync Word 검출, 패킷 시작 등)를 트리거로
    -   <strong>수 밀리초 수준의 Latency로 Jam을 시작/종료</strong>하게 하고,
-   FOB의 <strong>데이터율(예: 2~4 kbps) + 패킷 길이(수십~수백 비트)</strong> 를 기준으로 “대충 이 정도 시간 동안만 Jam을 유지하면 된다”는 경험적 값으로 튜닝하는 식으로 구현합니다.

---

## 2.5 RollJam이 성공하는 구조적 이유 – 프로토콜 레벨 요약

![출처: https://s34s0n.github.io/2019/07/18/Jam-and-Replay-Attacks-on-Vehicular-Keyless-Entry-Systems/](/blog/rolljam-2-how-it-works/04.gif)

*출처: https://s34s0n.github.io/2019/07/18/Jam-and-Replay-Attacks-on-Vehicular-Keyless-Entry-Systems/*

마지막으로, “왜 제조사들이 이런 공격에 취약했나?”를 정리해 보면:

1.  <strong>단방향성(One-Way RKE)</strong>
    -   차량은 FOB에게 “너 방금 보낸 100번 코드 잘 받았고, 이제 101번을 기다릴게”라고 알려주지 않습니다.
    -   FOB는 본인 카운터만 올리고, 차량이 실제로 받았는지 모릅니다.
    -   RollJam은 이 <strong>상태 비동기(State Desynchronization)를</strong> <strong>강제로 유도</strong>합니다.
2.  <strong>허용 윈도우(Window)의 역습</strong>
    -   사용자의 실수/주머니 클릭을 커버하기 위해 도입한 “Look-ahead Window”가, 공격자에게는 “훔친 미래 코드(Code B)를 합법적으로 승인해 주는 백도어”가 됩니다.
    -   차량 입장에서는:
        -   “아, 이건 아마도 사용자가 예전에 멀리서 눌렀던 값이겠지.”
        -   → <strong>정상적인 미래 코드로 승인</strong>
3.  <strong>(세대/제조사별 편차) Jam 상황이 “사용자 경험”에서 명확히 드러나지 않을 수 있음</strong>
    -   Jam이 걸리면 차량은 결과적으로 “유효 프레임을 못 받는 상황”이 됩니다.
    -   이때 많은 사용자는 단순히 “한 번 더 누르면 되겠지”로 행동하고, RollJam은 바로 그 행동 패턴을 공격 체인에 편입합니다.
    -   즉, 방어가 강한 구현에서는 간섭을 탐지/대응할 수 있지만, 그렇지 않은 구현에서는 “수신 실패가 경험으로 흡수”되면서 공격 성공 확률을 올리는 방향으로 작동합니다.
4.  <strong>사용자 경험/심리에 너무 기대는 방어 모델</strong>
    -   사람은 “한 번 안 되면 다시 누른다”는 패턴을 너무 자연스럽게 가지고 있습니다.
    -   RollJam은 이 심리를 공격 체인에 그대로 넣어버립니다.
    -   결과적으로:
        -   사용자: “아, 아까는 잘 안 눌렸나 보다.”
        -   차량: “100, 그다음 101… 정상 시퀀스네?”
        -   공격자: “아무도 모르게 101을 들고나감.”

---

## ✅ 마무리: “아이디어”가 “장치”가 되는 구간

오늘은 RollJam의 아이디어를 실제 장치로 내리기 위해 반드시 넘어야 하는 관문,

즉 <strong>Jam & Capture의 모순을 어떻게 푸는지</strong>를 다뤘습니다.

정리하면:

-   차량이 보는 신호와 공격자가 보는 신호는 동일하지 않다(비대칭 조건 형성)
-   self-interference 때문에 한 칩으로 동시 처리가 어렵고, 그래서 <strong>RX/TX 체인을 분리</strong>한다
-   실제 구현은 “DSP 천재”가 아니라 <strong>FSM + 타이밍 + 버퍼 처리</strong>가 승부처다

그리고 여기까지 이해되면, 다음 질문이 자연스럽게 나옵니다.

> “그럼 요즘 차들은 왜 이게 잘 안 먹히지?”
> 
> “그래서 RollBack / RollCAN은 뭘 바꿔서 다시 성립시키지?”

---

## 다음 편 예고 (Part 3: RollJam 확장)

다음 글(Part 3)에서는:

-   일부 현대 구현에서 RollJam이 어려워지는 이유(설계 가정 변화)
-   그걸 우회하려는 변종들이 어떤 발상을 했는지
-   특히 <strong>RollBack(시간 비의존적 리플레이)</strong> 이 “어떤 전제를 뒤집었는지”

를 <strong>RollJam과 대비</strong>시키면서 정리할 예정입니다.

오류나 질문이 있으시다면 댓글로 남겨주세요.

긴 글 읽어주셔서 감사합니다!

---

## 참고자료

\[Original / Talk\]

-   Samy Kamkar, “Drive It Like You Hacked It” (DEF CON 23) (Video Archive / Index)
    -   [https://infocondb.org/con/def-con/def-con-23/drive-it-like-you-hacked-it](https://infocondb.org/con/def-con/def-con-23/drive-it-like-you-hacked-it)

\[Popular / Context\]

-   WIRED (2015), “This Hacker's Tiny Device Unlocks Cars And Opens Garages”
    -   [https://www.wired.com/2015/08/hackers-tiny-device-unlocks-cars-opens-garages/](https://www.wired.com/2015/08/hackers-tiny-device-unlocks-cars-opens-garages/)

\[Datasheet / Vendor Docs\]

-   Texas Instruments, CC1101 Low-Power Sub-1GHz RF Transceiver Datasheet (SWRS061)
    -   [https://www.ti.com/lit/ds/symlink/cc1101.pdf](https://www.ti.com/lit/ds/symlink/cc1101.pdf)
-   (CC1101 레퍼런스/클래스 문서, 핀/커맨드/표 참조용)
    -   [https://mikaelpatel.github.io/Cosa/d6/d29/classCC1101.html](https://mikaelpatel.github.io/Cosa/d6/d29/classCC1101.html)
-   Microchip, HCS301 KeeLoQ Code Hopping Encoder Datasheet (DS21143)
    -   [https://ww1.microchip.com/downloads/en/DeviceDoc/21143B.pdf](https://ww1.microchip.com/downloads/en/DeviceDoc/21143B.pdf)
-   Microchip HCS301 Product Page
    -   [https://www.microchip.com/en-us/product/HCS301](https://www.microchip.com/en-us/product/HCS301)

\[Hands-on / Blog (2차 자료)\]

-   HandsOn Security (s34s0n), “Jam and Replay Attacks on Vehicular Keyless Entry Systems”
    -   [https://s34s0n.github.io/2019/07/18/Jam-and-Replay-Attacks-on-Vehicular-Keyless-Entry-Systems/](https://s34s0n.github.io/2019/07/18/Jam-and-Replay-Attacks-on-Vehicular-Keyless-Entry-Systems/)

\[Follow-up / Extensions\]

-   Csikor et al., “RollBack: A New Time-Agnostic Replay Attack Against the Automotive RKE Systems” (ACM)
    -   [https://dl.acm.org/doi/full/10.1145/3627827](https://dl.acm.org/doi/full/10.1145/3627827)

\[Code / PoC 참고(구조 이해용)\]

-   RollJam PoC (CC1101 기반) 저장/재생 흐름 참고
    -   [https://github.com/eliddell1/RollJam](https://github.com/eliddell1/RollJam)
    -   [https://github.com/CR11CS/RollJam-315MHz-433MHz](https://github.com/CR11CS/RollJam-315MHz-433MHz)
