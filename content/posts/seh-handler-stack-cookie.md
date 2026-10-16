## 🧭 인트로: 윈도우 익스플로잇 도전기

화이트햇 스쿨 과제로 윈도우 애플리케이션 익스플로잇을 진행했는데, 리눅스 환경이랑은 또 완전 다른 느낌입니다..

리눅스와 다른 보호 메커니즘이 존재해 저 같은 초보자들을 당황스럽게 만드는데요, 대표적으로 <strong>SEH(Structured Exception Handling)</strong>와 <strong>스택 쿠키(Stack Cookie, a.k.a. Stack Canary)</strong> 같은 보호기법들이 존재합니다.

오늘 글에서는 이 두 보호 메커니즘과, 우회 방법에 대해 간단히 다뤄보려고 합니다.

---

## 📌 SEH (Structured Exception Handling) 란?

### 📍 SEH의 개념 및 등장 배경

SEH는 윈도우 운영체제에서 <strong>Exception</strong>을 처리하기 위해 설계된 구조적 메커니즘입니다. 프로그램에서 <strong>예외 상황</strong>(Access Violation / 메모리 접근 위반, divide by zero 등)이 발생하면, OS가 자동으로 사전 정의된 SEH 핸들러를 호출하여 상황을 처리합니다.

SEH의 등장 이유는 명확합니다. 예외를 처리하지 못한 프로그램이 비정상 종료될 경우, 사용자 경험 저하와 데이터 손실 위험이 커집니다. 따라서 SEH를 통해 <strong>안정성</strong>과 <strong>신뢰성</strong>을 높이기 위해 도입된 메커니즘입니다.

### 📍 SEH 구조의 내부 메커니즘 상세 분석

SEH의 구조는 스택에 존재하는 <strong>EXCEPTION\_REGISTRATION\_RECORD</strong>라는 구조체로 이루어집니다.

```cpp
typedef struct _EXCEPTION_REGISTRATION_RECORD {
    struct _EXCEPTION_REGISTRATION_RECORD *Next;
    PEXCEPTION_ROUTINE Handler;
} EXCEPTION_REGISTRATION_RECORD;
```

-   <strong>Next</strong>: 다음 예외 처리 레코드를 가리키는 포인터입니다.
-   <strong>Handler</strong>: 예외 발생 시 호출할 함수의 포인터입니다.
    
    ![EXCEPTION_REGISTRATION_RECORD 구조체](/blog/seh-handler-stack-cookie/01.jpg)
    
    *EXCEPTION_REGISTRATION_RECORD 구조체*
    

프로그램 실행 중 예외가 발생하면, OS는 현재 스레드의 SEH 체인을 순차적으로 탐색해 적절한 예외 처리 함수를 호출합니다.

![](/blog/seh-handler-stack-cookie/02.jpg)

![x32dbg를 통해 확인한 SEH Handler](/blog/seh-handler-stack-cookie/03.png)

*x32dbg를 통해 확인한 SEH Handler*

### 📍 SEH Overwrite 공격의 원리와 실제 공격 시나리오

SEH overwrite 공격은 버퍼 오버플로우 취약점을 통해 <strong>EXCEPTION\_REGISTRATION\_RECORD</strong>의 <strong>Handler 필드</strong>를 덮어씌우는 방법입니다.

예를 들어 다음과 같은 공격 흐름을 가정할 수 있습니다.

1.  <strong>취약한 프로그램</strong>에서 사용자의 입력값을 버퍼 크기 체크 없이 복사
2.  공격자는 <strong>과도하게 긴 입력값</strong>으로 버퍼를 넘치게 만듦 (Buffer Overflow)
3.  버퍼 오버플로우로 인해 <strong>SEH 레코드</strong>가 덮어써지고, 공격자는 이때 <strong>Handler 필드를 자신이 원하는 주소로 변경</strong> 가능
4.  예외 발생 시, 공격자가 설정한 주소로 <strong>코드 실행 흐름 변경</strong>

이때 자주 사용되는 방식이 바로 <strong>POP POP RET</strong> 기법입니다.

### 📍 POP POP RET 기법 이해

POP POP RET은 공격자가 SEH Handler로 등록할 수 있는 코드 패턴으로, 스택 정리 후 RET을 호출해 공격자가 원하는 주소로 제어 흐름을 넘길 수 있게 합니다.

```bash
POP reg 
POP reg
RET
```

이 패턴을 활용하면 <strong>SEH 체인에서 Next SEH 필드를 건너뛰고 공격자가 컨트롤하는 코드 영역으로 실행 흐름을 넘기는 것이 가능</strong>합니다. 보통 Short Jump를 활용합니다.

---

## 📌 스택 쿠키(Stack Cookie, /GS) 란?

### 📍 스택 쿠키(Stack Cookie) 정의 및 목적

<strong>스택 쿠키</strong>는 마이크로소프트에서 버퍼 오버플로우 공격을 방어하기 위해 <strong>Visual Studio 컴파일러의 /GS 옵션</strong>으로 제공되는 보호 메커니즘입니다.

프로그램 실행 시 함수 진입점에서 스택에 임의의 쿠키 값을 삽입하고, 함수 종료 시 쿠키 값이 손상되지 않았는지 검사합니다. 만약 값이 변경되었다면 버퍼 오버플로우 공격을 탐지하고 프로그램을 강제로 종료합니다. 리눅스 환경의 Stack Canary와 같은 역할을 합니다.

![스택 쿠키](/blog/seh-handler-stack-cookie/04.jpg)

*스택 쿠키*

### 📍 스택 쿠키의 내부 동작 메커니즘 상세 분석

스택 쿠키가 활성화된 프로그램의 내부 코드는 다음과 같은 형태로 구성됩니다.

```cpp
void vulnerable_function(char *input) {	
	char buffer[32]; 
	int cookie = __security_cookie; // 쿠키 삽입 
    strcpy(buffer, input); // 취약한 함수 
    	if (cookie != __security_cookie) { // 쿠키 검사 
        	__report_gsfailure(); // 공격 탐지 후 종료 
		} 
}
```

함수 종료 전 삽입된 쿠키 값이 변조된 경우, <strong>\_\_report\_gsfailure()</strong>가 호출되어 강제로 프로그램 종료시킵니다.

### 📍 스택 쿠키 우회 방법

스택 쿠키는 완벽하지 않습니다. 공격자가 쿠키를 우회할 수 있는 방법 중 대표적인 두 가지입니다.

-   <strong>정보 유출(Information Leak)</strong>: 메모리 덤프나 디버깅을 통해 쿠키 값을 미리 알아내고, 변조된 쿠키 값을 정확히 삽입하여 검사를 통과
-   <strong>SEH overwrite 활용</strong>: SEH overwrite 공격으로 쿠키 검사 코드 실행을 건너뛰고, 예외 핸들러를 이용해 제어권 확보

---

## 🎯 실전 공격 실습 시나리오 (SEH Overwrite + Stack Cookie 우회)

### 📍 Step 1: 실습 환경 준비 (Easy Chat Server 등 취약한 응용 프로그램 사용)

-   실제 취약한 윈도우 프로그램(예: Easy Chat Server)을 준비
-   분석을 위해 Immunity Debugger, Windbg, x96dbg, ida 등 준비

### 📍 Step 2: 버퍼 오버플로우로 SEH 레코드 덮어쓰기

-   프로그램에 긴 입력값을 입력해 <strong>SEH 구조체 덮어쓰기</strong>
-   분석 도구로 메모리 확인 및 <strong>SEH Handler 주소</strong> 덮어쓰기

### 📍 Step 3: POP POP RET 기법을 통한 제어 흐름 변경

-   디버거로 POP POP RET 가젯 탐색
-   찾은 가젯 주소로 SEH Handler 필드 덮어쓰기

### 📍 Step 4: 스택 쿠키(/GS) 보호 우회하기

-   SEH overwrite 공격을 통해 쿠키 검사 과정 스킵
-   예외 발생 시, 공격자가 원하는 <strong>Shellcode로 제어 흐름 이동</strong>
-   Shellcode 실행 성공, 권한 획득 및 익스플로잇 완료

---

## ✅ 실천 체크리스트

-   SEH 구조 및 핸들러를 상세히 설명할 수 있다.
-   스택 쿠키가 동작하는 원리를 코드 수준에서 설명할 수 있다.
-   실제 프로그램을 이용해 SEH overwrite 익스플로잇을 수행했다.
-   스택 쿠키를 우회하는 방법을 실습을 통해 직접 확인했다.
-   <strong>화이트햇 스쿨 과제라 직접 분석한 것을 못 올려 아쉽다..</strong>

---

## 🔗 참고자료

-   [Microsoft Docs: SEH](https://learn.microsoft.com/en-us/windows/win32/debug/structured-exception-handling)
-   [Microsoft Docs: /GS Compiler Security Checks](https://learn.microsoft.com/en-us/cpp/build/reference/gs-buffer-security-check)
-   [https://tribal1012.tistory.com/31](https://tribal1012.tistory.com/31)
-   [https://coalfire.com/the-coalfire-blog/the-basics-of-exploit-development-2-seh-overflows](https://coalfire.com/the-coalfire-blog/the-basics-of-exploit-development-2-seh-overflows)
-   [https://learn.microsoft.com/en-us/shows/inside/c0000005](https://learn.microsoft.com/en-us/shows/inside/c0000005)
-   [https://cgy12306.tistory.com/197](https://cgy12306.tistory.com/197)
-   [https://made0x78.com/bseries-defeat-stack-cookies/](https://made0x78.com/bseries-defeat-stack-cookies/)

---

## ✍️ 나의 생각

과제에서는 pop pop ret 안 쓰고, 그냥 SEH 핸들러 부분을 덮기만 했는데 익스플로잇에 성공했습니다. 아마 다른 <strong>Mitigation</strong>이 걸려있지 않아서 그런 것 같습니다. DEP나.. 뭐 ASLR이나...? 요 부분도 나중에 찾아봐야겠습니다.

아, 중간고사 이후 시점부터 연구실에 학부연구생으로 참여하게 되었습니다. 일단 일을 크게 벌이는 중인데, 뭐 수습은 나중의 제가 하겠죠 하하..
