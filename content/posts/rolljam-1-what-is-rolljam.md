![](/blog/rolljam-1-what-is-rolljam/01.jpg)

## 인트로: 2015년, 차고 문을 여는 방식이 영원히 바뀌다

자동차 리모컨 키(FOB)를 눌렀는데 문이 안 열리는 경험, 한 번쯤 있으실 겁니다.

1.  버튼을 한 번 누른다 → <strong>아무 반응이 없다.</strong>
2.  잠깐 멈칫하고, “배터리가 약해졌나? 내가 너무 멀리 있나?” 하고 생각한다.
3.  차에 한두 걸음 더 다가가서, 다시 한 번 누른다 → 이번엔 <strong>‘철컥’</strong> 하고 문이 열린다.

대부분은 이걸 그냥 일상적인 경험으로 받아들입니다.

그런데 만약 방금 전 그 <strong>‘첫 번째 실패’</strong>가 단순한 오류가 아니라, 누군가 고의로 만들어낸 <strong>공격 시나리오</strong>였다면 어떨까요?

![](/blog/rolljam-1-what-is-rolljam/02.png)

---

2015년 DEF CON 23에서 Samy Kamkar는 바로 이 “첫 번째 실패”를 이용하는 아이디어를 대중적으로 알린 장치/기법 <strong>RollJam</strong>을 소개합니다. 핵심은 단순합니다. 피해자가 2번 눌러서 정상 동작했다고 믿는 동안, 공격자는 <strong>유효한 롤링코드를 ‘먼저’ 가로채서</strong> 나중에 재사용 가능한 상태로 남겨 둡니다.

RollJam은 <strong>AES를 깨지도 않고</strong>, <strong>KeeLoq를 크랙하지도 않습니다.</strong>

그저 <strong>“차량이 아직 한 번도 받지 못한, 미래에 유효한 코드를 먼저 빼앗은 뒤”</strong>, 운전자가 모르는 사이에 그 코드를 나중에 <strong>재생(Replay)</strong>할 뿐입니다.

-   운전자는 “한 번 안 먹히고, 두 번째에 열리는 평범한 상황”이라고 생각합니다.
-   공격자는 “첫 번째 눌렀을 때의 유효한 코드를 훔쳐서, 한 번은 차에게 대신 써주고, 하나를 남겨둡니다.”
-   결과적으로, 공격자는 <strong>운전자의 키를 실제로 손에 넣지 않고도</strong>, 나중에 언제든지 차 문을 열 수 있는 “한 번 쓸 수 있는 열쇠”를 확보하게 됩니다.

이 공격이 무서운 이유는 딱 두 가지입니다.

1.  <strong>최신 암호 알고리즘을 전혀 공격하지 않는다.</strong>
2.  대신, <strong>RKE 프로토콜 설계의 구조적 허점 + 사람의 UX/심리</strong>를 이용한다.

그리고 이 아이디어는 이후 <strong>RollBack, RollCAN</strong> 같은 공격들로 이어지며, “자동차 무선 프로토콜 보안”의 기본 전제를 다시 보게 만드는 계기가 됩니다.

그래서 이 글은 단순히 “옛날 해킹 썰 풀기”가 아니라,

-   우리가 매일 누르는 그 <strong>FOB 버튼 한 번</strong> 뒤에 어떤 프로토콜 가정이 깔려 있는지,
-   그리고 그 가정이 얼마나 쉽게 깨질 수 있는지를 이해하는 배경 편(Part 1)입니다.

이제, 우리가 흔히 한 덩어리로 부르는 “스마트키”를 <strong>보안 관점에서 제대로 분해</strong>해 보겠습니다.

---

## 1.1 Key FOB 개요: RKE vs Passive Entry

현대 차량의 “키”는 대략 두 계열로 나뉩니다.

-   <strong>RKE(Remote Keyless Entry): 버튼을 눌러야 동작하는 리모컨</strong>
-   <strong>PKES/PKE(Passive Keyless Entry/Start): 가까이 가거나 손잡이를 잡으면 반응하는 패시브 키</strong>

두 시스템 모두 겉보기에는 “문이 열리고 닫힌다”는 같은 기능을 하지만, <strong>통신 구조, 공격 표면, 방어 모델</strong>은 완전히 다릅니다.

RollJam은 이 중 <strong>RKE만</strong>을 노립니다.

---

### RKE (Remote Keyless Entry) – “버튼을 눌러야 열리는 리모컨”

<strong>작동 방식</strong>

-   사용자가 <strong>버튼을 직접 누르지 않으면</strong> 아무 일도 일어나지 않습니다.
-   FOB는 버튼이 눌리는 순간, 내부에서 <strong>롤링코드 프레임을 생성</strong>해서 <strong>차량으로 쏩니다.</strong>
-   차량은 이 프레임을 받고, 내부에 저장된 정보와 비교해 “유효한 신호인지” 검사합니다.

<strong>통신 구조</strong>

-   <strong>단방향(Unidirectional)</strong> 구조입니다.
    -   <strong>FOB → Vehicle</strong> 단방향
    -   차량은 “알았어, 열어줄게”라는 ACK를 무선으로 따로 보내지 않습니다.
    -   대표적인 KeeLoq 계열 인코더(HCS301) 데이터시트에서도 RKE를 <strong>단방향 remote keyless entry</strong> 시스템으로 전제합니다

![출처: HCS301 KEELOQ Code Hopping Encoder Data Sheet](/blog/rolljam-1-what-is-rolljam/03.png)

*출처: HCS301 KEELOQ Code Hopping Encoder Data Sheet*

<strong>아키텍처 한 줄 요약</strong>

> <strong>FOB: 버튼 입력 → MCU + Crypto Engine에서 코드 생성 → RF 송신기 → 안테나로 전송</strong>
> 
> <strong>차량: RF 리시버 → MCU → 롤링코드 검증 → 도어락/알람 제어</strong>

이 단방향 구조 때문에 <strong>“차량이 무슨 생각을 했는지(코드를 받아서 인정했는지)”를</strong> FOB는 알 수 없습니다. 이 비대칭성은 UX 관점에서는 크게 문제 되지 않지만, <strong>RollJam 같은 공격에서 자연스럽게 숨는 조건</strong>이 됩니다.

---

### Passive Entry (PKE - Passive Keyless Entry) – “주머니에 넣어도 열리는 스마트키”

<strong>작동 방식</strong>

-   키를 꺼내서 누를 필요가 없습니다.
-   차량은 LF(저주파, 보통 125 kHz)로 주변을 스캔하거나, <strong>도어 핸들 터치·버튼 입력</strong>이 있을 때 키를 <strong>“깨워”</strong> 근처에 있는지 확인합니다.
-   키는 이를 감지하면 고주파(UHF) 대역으로 응답(Challenge-Response)을 보내고, 양쪽이 <strong>양방향 통신</strong>을 하며 인증을 진행합니다.

<strong>통신 구조</strong>

-   <strong>양방향(Bidirectional)</strong>입니다.
    -   Vehicle → FOB (LF로 깨우기, Challenge 전송)
    -   FOB → Vehicle (UHF로 Response 전송)
-   대부분 <strong>Challenge-Response</strong> 구조를 사용합니다.
    -   차량이 랜덤한 Challenge를 던지고
    -   FOB는 비밀키를 이용해 이를 암호화한 Response를 돌려줍니다.
    -   차량은 Response가 예상 값과 일치하면 문을 엽니다.

이 구조 때문에 RollJam처럼 <strong>“단순히 미래의 코드를 훔쳐서 저장했다가 나중에 쓰는”</strong> 기법은 PKE에는 그대로 적용되지 않습니다. 대신 PKE 쪽은 <strong>Relay Attack(거리 연장) 같은 다른 계열의 공격이 주로 논의됩니다.</strong>

---

### RollJam의 타깃이 왜 RKE에 한정되는가?

RollJam이 RKE에만 적용되는 핵심 이유는 다음과 같습니다.

1.  <strong>단방향 통신</strong>
    -   FOB는 “코드를 보냈다”는 사실만 알지, 그 코드가 “정말로 차량에서 받아들여졌는지”를 모릅니다.
    -   공격자가 중간에서 <strong>Jamming으로 차량 수신을 막아도</strong>, FOB 입장에서는 “정상적으로 한 번 눌렸다”고만 인식합니다.
2.  <strong>Challenge-Response 부재</strong>
    -   RKE는 “사전에 합의된 롤링코드 시퀀스 중 다음 값”을 던지는 구조입니다. (일방적인 “다음 코드를 보내는” 형태)
    -   따라서 해커는 “미래에 유효한 코드”를 먼저 훔쳐두고, <strong>사용자가 모르는 사이에 시점을 조절해 재생</strong>할 수 있습니다.
3.  <strong>ACK/에러 신호 비가시성</strong>
    -   대부분의 RKE는 <strong>유선/계기판에 별도 에러 메시지를 남기지 않습니다.</strong>
    -   “한 번 안 먹고, 두 번째에 열리는 상황”은 사용자가 <strong>“그럴 수도 있지”</strong> 하고 넘기는 수준입니다.
    -   즉, <strong>공격이 UX 관점에서 자연스럽게 숨겨집니다.</strong>

---

## 1.2 롤링코드(Rolling Code): 왜 만들었고, 어떻게 동작하는가?

초기 자동차 리모컨 시스템은 <strong>고정 코드(Fixed Code)</strong>를 사용했습니다.

-   FOB가 누를 때마다 <strong>항상 같은 값</strong>, 예를 들어 0x1234 같은 코드를 보냅니다.
-   차량은 “이 코드가 오면 문을 열어라”라고만 설정되어 있습니다.

이 구조는 캡처 후 그대로 재생하는 Replay에 매우 취약했습니다.

1.  공격자가 옆에서 RF 신호를 캡처한다.
2.  나중에 그 신호를 그대로 재생한다.
3.  차량은 “똑같이 유효한 코드네?” 하고 문을 열어준다. → <strong>Replay Attack</strong>

이를 막기 위해 등장한 것이 <strong>롤링코드(Rolling Code / Hopping Code)</strong>입니다.

![롤링 코드의 작동 방식 출처: Figure 1 in Gesteira-Miñarro et al., “Revisiting Wireless Cyberattacks on Vehicles”, Sensors 2025, 25, 2605, CC BY 4.0.](/blog/rolljam-1-what-is-rolljam/04.png)

*롤링 코드의 작동 방식 출처: Figure 1 in Gesteira-Miñarro et al., “Revisiting Wireless Cyberattacks on Vehicles”, Sensors 2025, 25, 2605, CC BY 4.0.*

---

### 롤링코드의 핵심 원리 – “한 번 쓴 코드는 다시 못 쓴다”

롤링코드는 다음 철학 하나에 모든 것을 겁니다.

> “한 번 쓴 코드는 다시 쓰지 않는다.”

이를 위해 FOB와 차량 양쪽에 <strong>동기화된 카운터(Synchronization Counter)</strong>를 둡니다.

아주 단순화해서 보면 구조는 다음과 같습니다.

-   FOB 내부 상태:
    -   counter\_fob (정수) – 버튼을 누를 때마다 증가
    -   secret\_key – 제조사가 차량/FOB 쌍마다 심어놓은 비밀키
    -   serial – FOB 고유 시리얼 번호
-   차량 내부 상태:
    -   counter\_car – 차량이 “마지막으로 인정한 카운터 값”
    -   secret\_key – FOB와 짝이 맞는 비밀키
    -   serial – 등록된 FOB의 시리얼 목록

<strong>FOB 쪽 동작 (버튼 한 번 누를 때)</strong>

```
counter_fob = counter_fob + 1
rolling_code = Encrypt(secret_key, counter_fob || serial || 기타 데이터)
frame = [serial][function bits][rolling_code]
전송(frame)
```

<strong>차량 쪽 동작 (프레임 수신 시)</strong>

```
입력: frame = [serial][function bits][rolling_code]

1. serial로 어떤 FOB인지 찾는다.
2. 해당 FOB에 대한 counter_car를 읽는다.
3. secret_key, serial, counter 후보들을 사용해
   "이 rolling_code가 나올 수 있는지" 확인한다.
4. 그 결과 얻어진 counter_rx가
   - counter_car보다 크고
   - 허용 윈도우 안에 있으면 → 유효로 인정하고 문을 연다.
   - 그렇지 않으면 → 무시한다.
5. 유효로 인정한 경우 counter_car = counter_rx로 업데이트한다.
```

실제 KeeLoq 기반 시스템에서는:

-   counter 영역(일반적으로 16비트 정도)
-   serial / discrimination 영역
-   암호화된 hopping code 블록

등으로 조금 더 복잡하지만, 개념적으로는 위와 같습니다.

---

### ⚠️ “동기화 윈도우(Look-ahead Window)”의 딜레마

현실에서는 이런 상황이 자주 발생합니다.

-   사용자가 <strong>차와 멀리 떨어진 집 안/엘리베이터/주머니 속</strong>에서 장난처럼 FOB 버튼을 여러 번 누른다.
-   혹은 가방 안에서 물건 정리하다가 <strong>버튼이 여러 번 눌려버린다.</strong>

이 경우를 시나리오로 써보면:

-   처음 기준 상태:
    -   counter\_fob = 100
    -   counter\_car = 100 (둘이 잘 동기화됨)
-   사용자가 보이지 않는 곳에서 버튼을 50번 연타:
    -   FOB는 그때그때 실제로 RF를 쏘고 있지만, 차량은 물리적으로 멀어서 신호를 못 받거나, 아예 차량 전원이 꺼져 있는 상태일 수 있습니다.
    -   결과:
        -   counter\_fob = 150 (50번 증가)
        -   counter\_car = 100 (여전히 100에 머물러 있음)

이제 사용자가 실제로 차량 앞에 와서 <strong>한 번 버튼을 누르면:</strong>

-   FOB는 counter\_fob = 151을 만들어서 보냅니다.

이때 차량 입장에서 보면,

-   “내가 마지막으로 인정한 값은 100인데, 갑자기 151이 왔다.”
-   이걸 어떻게 처리해야 UX가 좋을까요?

여기서 등장하는 것이 바로 <strong>동기화 윈도우(Look-ahead Window)</strong>입니다.

> “현실적으로 카운터가 어느 정도는 앞서 있을 수 있으니, <strong>어느 범위까지는 ‘미래의 값’도 유효로 인정</strong>하자.”

예를 들어:

-   window\_size = 256이라고 하면, 차량은 (counter\_car, counter\_car + 256\] = (100, 356\] 범위의 카운터 값을 <strong>미래의 유효 코드</strong>로 인정하게 됩니다.

즉, 151은 <strong>충분히 있을 수 있는 “앞선 값”</strong>으로 받아들여지고, 차량은 문을 열어준 뒤 counter\_car = 151로 동기화를 맞춥니다.

---

### 실제 구현에서는 윈도우가 두 개 있을 때도 많다

KeeLoq 계열 데이터시트를 보면, 윈도우를 대략 두 단계로 나누는 경우가 많습니다.

1.  <strong>메인 윈도우(Main Window)</strong>
    -   예: 현재 값에서 +16 정도까지
    -   사용자가 차 근처에서 정상적으로 누르는 범위.
2.  <strong>리싱크 윈도우(Resynchronization Window)</strong>
    -   예: 그보다 훨씬 큰 +256~+1024 범위“
    -   키가 많이 앞질러진 것 같지만, 특정 패턴(예: 연속 두 번 수신)을 만족하면차량이 카운터를 크게 점프시켜 맞춰주는 모드.”

![Open=16, Resync=32K(카운터 절반), 나머지는 거부 출처: Introduction to Ultimate KEELOQ Technology](/blog/rolljam-1-what-is-rolljam/05.png)

*Open=16, Resync=32K(카운터 절반), 나머지는 거부 출처: Introduction to Ultimate KEELOQ Technology*

이 구조는 <strong>UX 관점에서는 매우 유용</strong>합니다. 키가 잠깐 오작동하거나, 멀리서 누른 적이 있어도 다시 잘 동작하게 해주니까요.

하지만 보안 관점에서는 이렇게 해석할 수 있습니다.

> “공격자가 ‘앞으로 쓸 수 있는 코드들’이 꽤 많이 남아 있는 상태를 <strong>설계적으로 허용</strong>하고 있다.”

RollJam은 이 <strong>“앞으로 쓸 수 있는 코드 중 일부를 먼저 빼앗고, 사용자보다 늦게 쓰는”</strong> 접근입니다.

---

## 1.3 RollJam 공격 개요 – Jam + Capture + Replay의 합체

이제 본격적으로 RollJam 이야기입니다.

2015년 DEF CON 23에서 Samy Kamkar는 RKE 시스템의 이 설계 특성을 파고들어, <strong>“암호를 깨지 않고도 롤링코드를 재사용하는 방법”</strong>을 보여줍니다.

핵심 키워드는 세 가지입니다.

1.  <strong>Jamming</strong> – 차량이 신호를 못 듣게 만들기
2.  <strong>Capture</strong> – 그 와중에 공격자 장비가 신호를 몰래 캡처하기
3.  <strong>Replay</strong> – 나중에 그 신호를 꺼내서 원하는 시점에 다시 쓰기

---

### 공격 시나리오 – 시간 순서대로 풀어보기

상황 설정:

-   counter\_fob와 counter\_car는 현재 둘 다 100이라고 가정합니다.
-   공격자는 피해자의 차량 근처(주차장, 차고 앞, 집 입구 등)에 <strong>작은 RollJam 장치</strong>를 미리 설치해 둡니다.
    -   이 장치는 <strong>두 개의 RF 기능</strong>을 가집니다.
        1.  <strong>Jammer</strong> – 차량 수신 주파수 대역에 노이즈/신호를 쏴서 수신을 방해
        2.  <strong>Receiver/Sniffer</strong> – 그 와중에 FOB에서 나오는 실제 신호를 캡처

---

### 1단계: 첫 번째 버튼 – Jam + Capture (차량은 못 듣는다)

-   피해자가 차에 다가와 FOB 버튼을 누릅니다.
-   FOB는 내부 카운터를 올립니다.
    -   counter\_fob: 100 → 101
    -   rolling\_code\_101 생성 후 전송
-   RollJam 장치는 <strong>동시에 두 일을 합니다.</strong>
    -   Jammer: 433 MHz(혹은 315 MHz) 대역에 강한 신호/노이즈를 뿌려 차량 리시버가 아무 것도 해석하지 못하게 만듭니다.
    -   Receiver: 같은 대역에서 <strong>FOB 신호를 캡처</strong>해 rolling\_code\_101을 저장합니다.
-   결과:
    -   FOB 입장: “나는 101번 코드를 잘 보냈다” → counter\_fob = 101로 굳어짐
    -   차량 입장: <strong>아무 것도 못 들었다</strong> → counter\_car = 100 유지
    -   공격자: rolling\_code\_101 <strong>획득</strong> (아직 누구에게도 쓰이지 않은 “미래 코드”)

피해자는 이때 “어? 왜 안 열리지?” 하고 <strong>살짝 의아해하지만, 보통 여기서 공격을 의심하진 않습니다.</strong>

---

### 2단계: 두 번째 버튼 – 또 Jam + Capture, 그리고 첫 번째 코드를 대신 써준다

-   피해자는 “조금 더 가까이 가야 하나?” 싶어서 차에 더 다가온 뒤, FOB 버튼을 <strong>한 번 더</strong> 누릅니다.
-   FOB 동작:
    -   counter\_fob: 101 → 102
    -   rolling\_code\_102 생성 후 전송
-   RollJam 장치는 이번에도 동일하게 행동합니다.
    -   Jammer: 여전히 차량 수신을 막습니다.
    -   Receiver: rolling\_code\_102를 <strong>추가로 캡처</strong>합니다.
-   그리고, 이번에는 Jam만 하지 않고, 이전에 저장해 둔 <strong>rolling\_code\_101을 차량으로 재생(Replay)</strong>합니다.

이때 차량은 어떤 상태일까요?

-   차량이 마지막으로 인정한 값: counter\_car = 100
-   새로 들어온 코드: rolling\_code\_101 (공격자가 재생한 것)
-   이 코드를 복호/검증해보면:
    -   counter\_rx = 101 (100보다 크고, 허용 윈도우 안) → 유효한 “다음 코드”이므로 <strong>문을 열어준다.</strong>
    -   counter\_car를 101로 업데이트한다.

최종 정리하자면,

-   피해자 입장:
    -   “첫 번째에는 안 열렸고, 두 번째에 <strong>정상적으로</strong> 열렸다.”
    -   아무 이상을 못 느낀다.
-   차량 입장:
    -   자신이 본 건 <strong>오직 101 코드 하나</strong>뿐이고, 이를 정상적인 “다음 코드”로 처리했다.
-   FOB 상태:
    -   내부 카운터는 이미 <strong>102</strong>까지 증가해 있다.
-   공격자 상태:
    -   rolling\_code\_101 → 이미 사용됐으므로 더 이상 소용 없음
    -   <strong>rolling\_code\_102는 아직 아무도 쓰지 않았다.</strong>
    -   차량 입장에서는 102는 “아직 들어본 적 없는, 허용 윈도우 안의 유효한 미래 코드”로 남아 있다.

즉, 공격자는 현재 <strong>“언제든지 재생하면 차 문이 열리는 유효한 롤링코드 하나”</strong>를 손에 쥔 상태입니다.

피해자가 차를 타고 떠난 뒤, 공격자는 차가 세워진 곳(집 앞, 회사 주차장 등)에 와서 조용히 <strong>rolling\_code\_102를 재생</strong>하면, 차량은 그걸 <strong>진짜 FOB에서 보낸 다음 코드</strong>라고 믿고 문을 열어줍니다.

![RollJam 공격 시나리오 출처: Figure 2 in Gesteira-Miñarro et al., “Revisiting Wireless Cyberattacks on Vehicles”, Sensors 2025, 25, 2605, CC BY 4.0.](/blog/rolljam-1-what-is-rolljam/06.png)

*RollJam 공격 시나리오 출처: Figure 2 in Gesteira-Miñarro et al., “Revisiting Wireless Cyberattacks on Vehicles”, Sensors 2025, 25, 2605, CC BY 4.0.*

---

### RollJam이 성립하기 위한 조건 – 정리

RollJam이 가능하려면 대략 다음 조건들이 맞아떨어져야 합니다.

1.  <strong>RKE 구조여야 한다.</strong>
    -   <strong>단방향 롤링코드 기반 RKE</strong>
    -   별도의 Challenge-Response나 타임스탬프 기반 검증이 없음
2.  <strong>카운터 기반 롤링코드 + 허용 윈도우</strong>
    -   FOB/Vehicle 양쪽에 동기화 카운터가 있고 “미래의 일정 범위까지는 유효로 인정”하는 <strong>Look-ahead Window</strong>가 존재
3.  <strong>Jamming에 대한 탐지/대응이 없다.</strong>
    -   차량이 “이상하게 신호가 안 들어온다”를 별도로 로깅하거나, <strong>RF 채널에서 지속적인 Jam 패턴을 탐지해 알람을 띄우지 않음</strong>
4.  <strong>사용자가 “한 번 안 먹고, 두 번째에 되는 것”을 자연스럽게 받아들인다.</strong>
    -   대부분의 사용자가 “버튼 두 번 눌렀더니 열리네?” 정도로 지나감
    -   즉, 공격이 <strong>심리적으로 매우 자연스럽게 숨겨진다.</strong>

2015년 당시, KeeLoq 기반 RKE를 사용하는 차량과 차고문 시스템 상당수가 이 조건을 그대로 만족하고 있었습니다.

-   대상 예시:
    -   Chrysler, GM, Honda, Toyota, Volkswagen, Volvo, Fiat, Daewoo(쉐보레) 등 다수
-   영향:
    -   Samy 발표 이후 일부 제조사는 <strong>Timestamp 추가, Jam 탐지 로직, 추가적인 세션/Nonce 구조</strong> 등을 도입하기 시작했습니다.
    -   하지만 구형 차량, 저가형 애프터마켓 알람/차고문 시스템은 여전히 RollJam류 공격에 취약한 경우가 많습니다.

---

## ✅ 마무리: “암호”가 아니라 “프로토콜”이 무너질 때

여기까지의 이야기를 한 문장으로 정리하면 이렇습니다.

> RollJam은 암호를 깨는 공격이 아니라,
> 
> <strong>단방향 RKE(롤링코드 + 동기화 윈도우)와 사용자의 자연스러운 행동(한 번 더 누르기)</strong>
> 
> 사이의 간극을 파고드는 프로토콜 공격입니다.

우리는 보통 보안을 말할 때 “AES가 안전한가?”, “키 길이가 충분한가?”처럼 <strong>암호 알고리즘</strong>부터 떠올립니다.

그런데 RKE 같은 현실 시스템에서는 알고리즘 자체가 튼튼해도,

-   <strong>수신 성공/실패를 누가 알 수 있는지(단방향의 비대칭)</strong>
-   <strong>동기화가 어긋났을 때 어디까지 허용할지(윈도우 설계)</strong>
-   <strong>실패했을 때 사용자가 어떻게 행동하는지(UX/심리)</strong>

같은 “운영 가정”이 더 먼저 무너질 수 있습니다. RollJam이 무서운 이유는 그걸 아주 짧은 시나리오로 증명해버리기 때문입니다.

다음 편에서는 <strong>RollJam의 원리 및 구현</strong>을 더 자세히 다뤄보겠습니다.

질문, 오류가 있다면 댓글로 남겨주세요! 감사합니다.

---

### 참고 자료

-   <strong>Gesteira-Miñarro, R.; López, G.; Palacios, R.</strong> Revisiting Wireless Cyberattacks on Vehicles. <strong>Sensors</strong> 2025, 25(8), 2605. DOI: 10.3390/s25082605.
-   <strong>Kamkar, Samy.</strong> Drive It Like You Hacked It (DEF CON 23, 2015)
    -   [https://sa.my/defcon2015/](https://sa.my/defcon2015/)
    -   [https://sa.my/defcon2015/2015-defcon.pdf](https://sa.my/defcon2015/2015-defcon.pdf)
-   [https://www.wired.com/2015/08/hackers-tiny-device-unlocks-cars-opens-garages/](https://www.wired.com/2015/08/hackers-tiny-device-unlocks-cars-opens-garages/)
-   <strong>Microchip.</strong> AN1683: Introduction to Ultimate KeeLoq® Technology (Application Note, PDF).
-   <strong>Microchip.</strong> HCS301: KeeLoq® Code Hopping Encoder (Datasheet, PDF).
