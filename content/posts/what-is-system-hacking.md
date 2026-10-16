## 시스템 해킹(포너블)이란 무엇인가?

## 📌 정의

### 사전적 정의

<strong>시스템 해킹(System Hacking)</strong>이란, 프로그램이나 시스템의 취약점을 분석하고, 이를 이용해 <strong>권한을 획득</strong>하거나 정상적인 동작을 우회하여 <strong>원하는 동작</strong>을 하게 만드는 일련의 과정을 의미합니다. 특히, 시스템이나 프로그램의 메모리 관리 오류나 논리적 오류를 이용하여 <strong>임의의 코드를 실행(RCE, Remote Code Execution)</strong>하거나 <strong>권한 상승(LPE, Local Privilege Escalation)</strong>을 목표로 하는 해킹 분야입니다.

![대표적인 pwnable 워게임 사이트인  https://pwnable.kr](/blog/what-is-system-hacking/01.jpg)

*대표적인 pwnable 워게임 사이트인  https://pwnable.kr*

### pwnable 명칭의 유래

시스템 해킹을 ‘포너블(pwnable)’이라고 부르게 된 유래에 대한 가설 중 한 가지는 인터넷에서 <strong>'own'(지배하다, 소유하다)</strong>의 오타인 'pwn'에서 유래했다고 합니다. 이는 해킹에서 대상 시스템을 장악하거나 제어권을 확보하는 것을 의미하게 되었습니다.

![매우 큰 상금으로 유명한  'pwn2own'  대회도 있습니다.](/blog/what-is-system-hacking/02.png)

*매우 큰 상금으로 유명한  'pwn2own'  대회도 있습니다.*

## 📚 시스템 해킹을 하려면 뭘 알아야 하는가?

그럼 시스템 해킹을 시작하기 위해 필요한 지식들을 알아보겠습니다.

| 분류 | 필요성 | 추천 언어/기술 |
| --- | --- | --- |
| <strong>언어</strong> | 시스템 구조 이해 및 익스플로잇 작성 | C, Python, Assembly 등 |
| <strong>CS 지식</strong> | 시스템 해킹 원리 이해 | Computer Architecture, OS, Data Structure 등 |
| <strong>디버깅 및 리버싱</strong> | 취약점 분석과 익스플로잇 개발에 필수 | GDB, IDA Pro, Radare2 등 |
| <strong>끈기와 호기심</strong> | 삽질을 열심히 할 수 있는 능력 | 인내심과 꾸준한 삽질 |

-   <strong>CS 지식은 시스템 해킹의 핵심</strong>입니다. 취약점을 찾고 분석하기 위해서는 프로그램의 내부 구조를 철저히 이해하고 파악할 수 있어야 합니다.

## 🎯 무엇을 해킹하는가?

시스템 해킹의 주요 타겟은 매우 광범위하며, 대표적인 예시는 다음과 같습니다.

-   바이너리 및 응용 프로그램
-   브라우저 (Chrome, Firefox 등)
-   운영체제 커널 (Linux, Windows,MacOS 등)
-   임베디드 및 IoT 디바이스
-   펌웨어(Firmware)
-   모바일 환경 (Android, iOS 등)
-   가상화 및 컨테이너 환경(Docker, Kubernetes 등)

## 🔍 어떻게 해킹하는가?

시스템 해킹은 시스템에서 일어나는 <strong>버그</strong>를 이용합니다. 버그란 프로그램 개발 시 발생하는 오류 또는 결함을 의미합니다.  
버그 중에서도 공격자가 <strong>악의적으로 이용할 수 있는 보안상의 약점</strong>을 <strong>취약점(Vulnerability)</strong>라고 합니다.

![출처:  https://hxxyxxn-1238.tistory.com/89](/blog/what-is-system-hacking/03.png)

*출처:  https://hxxyxxn-1238.tistory.com/89*

시스템 해킹 방법은 크게 <strong>두 가지</strong>로 구분할 수 있습니다.

## 1\. 메모리 커럽션(Memory Corruption)

프로그램의 <strong>메모리 관리 오류</strong>를 이용하는 방법입니다.

-   스택 오버플로우(Stack Overflow)
-   힙 오버플로우(Heap Overflow)
-   정수형 오버플로우(Integer Overflow)
-   Use After Free, UAF 등

## 2\. 로직 버그(Logic Bug)

프로그램의 <strong>논리적 오류</strong>를 이용하는 방법입니다.

-   포맷 스트링 버그(Format String Bug, FSB)
-   Path Traversal
-   Race Condition 등

## 🛠️ 무엇으로 해킹하는가?

다음은 시스템 해킹에서 자주 사용하는 대표적인 도구들입니다.

| 분류 | 대표 도구 | 역할 |
| --- | --- | --- |
| 디버거 | GDB, pwndbg | 프로그램의 실행 과정을 추적하고 분석 |
| 디스어셈블러 | Radare2, IDA Pro | 기계어를 어셈블리어로 변환하여 분석 |
| 디컴파일러 | Ghidra, Hex-Rays | 바이너리에서 소스 코드 수준의 분석 지원 |
| 프로세스 모니터 | strace, procmon | 프로세스의 시스템 호출 및 동작 분석 |
| 익스플로잇 프레임워크 | pwntools | 익스플로잇 코드 작성 및 실행 자동화 |
| 퍼저(Fuzzer) | AFL++, honggfuzz | 자동화된 취약점 탐색 |

> 툴에 대한 설정 등은 Hspace에서 제공하는 레포에 잘 정리가 되어 있으니 확인해보셔도 좋을 것 같습니다.  
> [https://github.com/hspace-io/hacker-notebook-setup](https://github.com/hspace-io/hacker-notebook-setup)
> 
> ![](/blog/what-is-system-hacking/04.png)

## 🎓 시스템 해킹을 공부해서 뭘 하는가?

시스템 해킹을 공부하면 다음과 같은 다양한 분야에서 활용할 수 있습니다.

-   <strong>시큐어 코딩</strong>: 안전한 프로그램 작성법을 이해하고 보안 결함 방지
-   <strong>버그 헌팅(Bug Hunting)</strong>: 기업 또는 오픈소스 소프트웨어의 취약점 탐색
-   <strong>레드팀(Red Team), 침투 테스트(Penetration Test)</strong>: 조직 보안을 평가하고 실제 공격을 시뮬레이션하여 대응력 평가
-   <strong>취약점 분석 및 연구</strong>: 새로운 취약점 발굴 및 보안 기술 발전에 기여

## 🗺️ 시스템 해킹 공부 로드맵

다음은 시스템 해킹을 공부할 때 추천하는 간단한 로드맵입니다. 차근차근 단계를 밟아 공부하면 더 효율적이고 체계적으로 배울 수 있습니다.

-   <strong>1\. Linux Stack Exploitation</strong>
    -   Stack Overflow
    -   ROP (Return-Oriented Programming)
-   <strong>2\. Linux 기초 메모리 및 로직 취약점 분석</strong>
    -   Integer Overflow
    -   Use After Free(UAF)
    -   포맷 스트링 버그(Format String Bug, FSB)
-   <strong>3\. Linux Heap Exploitation</strong>
    -   힙 메모리 관리 구조 이해
    -   glibc heap exploit 기법
-   <strong>4\. 심화 과정</strong>
    -   Windows Binary Exploitation
    -   Kernel Exploitation
    -   IoT 및 임베디드
    -   모바일 환경
    -   가상화 및 컨테이너 등

위 로드맵은 <strong>개인적인 추천</strong>이므로, 꼭 이 로드맵을 따라야 한다 라는 의미가 아닙니다 😁

---

#### 이 글을 통해 시스템 해킹에 관심이 있는 입문자 분들이 더 쉽고 체계적으로 접근할 수 있기를 바랍니다! 😊
