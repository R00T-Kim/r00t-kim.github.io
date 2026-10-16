## 🛠️ DIVA 소개 & Insecure Logging 문제 풀이

> [<strong>DIVA(“Damn Insecure and Vulnerable App”)</strong>](https://github.com/0xArab/diva-apk-file) 는 OWASP MSTG 학습 목적의 안드로이드 워게임입니다.  
> 각 단계마다 실전에서 자주 발생하는 모바일 취약점을 체험하며 “원인–악용–대응” 흐름을 스스로 실습할 수 있게 설계되었습니다.  
> 이번 글에선 <strong>1단계 Insecure Logging</strong> 문제를 다뤄 보겠습니다.

---

## 1\. 문제 개요 : Insecure Logging

![](/blog/diva-1-insecure-logging/01.png)

-   <strong>Objective</strong> : “어디서·어떻게 민감 정보가 로그에 남는지 찾아라”
-   <strong>힌트</strong> : 개발자가 인증정보/세션 ID/카드번호 등을 무심코 Log.\*() 로 남기면 공격자가 Logcat을 통해 그대로 열람 가능

---

## 2\. 풀이

1.  <strong>앱 실행 → “Insecure Logging” 단계 선택</strong>  
    카드 번호 입력 창에 임의 값 (나의 경우 123) 입력 후 <strong>CHECK OUT</strong> 클릭
2.  <strong>adb logcat | grep diva-log</strong>로 애플리케이션 전용 태그만 확인 (나는 Android Studio Logcat 기능 활용)  
    
    ![](/blog/diva-1-insecure-logging/02.png)
    
      
    민감 정보(ex: 카드번호)가 평문 그대로 노출
3.  ****decompile  
    ****
    
    ![](/blog/diva-1-insecure-logging/03.png)
    
    Log.e() 호출부에서 사용자가 입력한 문자열을 그대로 덧붙이고 있음을 확인.

---

## 3\. Root Cause 분석

<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft"><tbody><tr><td><b>원인</b></td><td><b>설명</b></td></tr><tr><td><b>개발 단계 디버그 로그를 그대로 출하</b></td><td>Log.d / Log.e 등을 조건 분기 없이 사용 → Release 빌드에도 포함</td></tr><tr><td><b>민감 데이터 마스킹 부재</b></td><td>카드번호·세션토큰 등 그대로 출력</td></tr><tr><td><b>권한 없는 프로세스도 Logcat 접근</b></td><td>Android &lt; 13 에선 READ_LOGS 퍼미션이 없어도 동일 UID 앱·PC ADB 모두 로그 열람 가능</td></tr></tbody></table>

---

## 4\. 완화(Mitigation) 방안

<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft"><tbody><tr><td><b>항목</b></td><td><b>구현 예시</b></td></tr><tr><td><b>빌드 타입 분리</b></td><td>if (BuildConfig.DEBUG) Log.d(...)<br>proguardFiles getDefaultProguardFile('proguard-android-optimize.txt')</td></tr><tr><td><b>로그 레벨 제한 &amp; 필터링</b></td><td>민감 값은 전부 **** 마스킹 → Log.i(TAG, "cc=****")</td></tr><tr><td><b>보안 로거 도입</b></td><td>자체 래퍼 클래스 만들어<br>1) DEBUG 모드만 출력<br>2) 개인정보 자동 Redact</td></tr><tr><td><b>릴리스 빌드 스트립</b></td><td>R8/ProGuard) -assumenosideeffects class android.util.Log { *; }</td></tr><tr><td><b>Android 13(33) 이상 타깃</b></td><td>READ_LOGS 범위 축소, 외부 앱 logcat 접근 차단</td></tr></tbody></table>

---

## 5\. 정리

> <strong>교훈</strong> : “로그는 스택트레이스가 아닌 개인정보 저장소가 될 수 있다.”  
> 로그가 그대로 나온다? -> 털릴 수 있다~

---

### ✍️ 나의 메모

1.  Android 13 이상 타깃으로 설정하면 ADB 외 프로세스 logcat 접근이 막히지만, <strong>루팅 환경</strong>에선 여전히 취약.
2.  차후 <strong>syslog 서버 전송</strong> 시에도 암호화 여부 확인 필요.
