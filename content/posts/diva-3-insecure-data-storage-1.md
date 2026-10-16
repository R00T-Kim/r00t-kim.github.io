![](/blog/diva-3-insecure-data-storage-1/01.png)

## 🎯 Objective

앱이 <strong>3rd-party 자격증명</strong>(ID/PW)을 어디에, 어떻게 저장하는지 찾아서 값을 확보하라.

---

## 🏗️ 시나리오 & 풀이 Step-by-Step

![](/blog/diva-3-insecure-data-storage-1/02.png)

<table style="border-collapse: collapse; width: 100%;" border="1" data-end="851" data-start="323" data-ke-align="alignLeft"><tbody><tr><td><b>단계</b></td><td><b>작업</b></td><td><b>핵심 포인트</b></td></tr><tr data-end="476" data-start="358"><td data-col-size="sm" data-end="370" data-start="358">① 입력 &amp; 저장</td><td data-end="424" data-start="370" data-col-size="md">앱 화면에서 admin / admin 입력 → <b>SAVE CREDENTIALS</b> 클릭</td><td data-end="476" data-start="424" data-col-size="md">saveCredentials() 호출, SharedPreferences 에 저장</td></tr><tr data-end="623" data-start="477"><td data-col-size="sm" data-end="490" data-start="477">② 저장 위치 파악</td><td data-end="581" data-start="490" data-col-size="md">- run-as 명령으로 전용 스토리지 진입 bash adb shell run-as jakhar.aseem.diva ls shared_prefs<br>- 나의 경우엔 Android Studio Device Explorer 사용</td><td data-end="623" data-start="581" data-col-size="md">일반 모드의 앱이라도 <b>run-as</b> 로 접근 가능(디버그 빌드)</td></tr><tr data-end="729" data-start="624"><td data-col-size="sm" data-end="634" data-start="624">③ 파일 덤프</td><td data-end="700" data-start="634" data-col-size="md">bash cat shared_prefs/jakhar.aseem.diva_preferences.xml</td><td data-end="729" data-start="700" data-col-size="md">XML 형태, Base64·암호화 <b>없음</b></td></tr><tr data-end="851" data-start="730"><td data-col-size="sm" data-end="740" data-start="730">④ 결과 확인</td><td data-end="826" data-start="740" data-col-size="md">xml &lt;string name="user"&gt;admin&lt;/string&gt; &lt;string name="password"&gt;admin&lt;/string&gt;</td><td data-end="851" data-start="826" data-col-size="md">자격증명이 그대로 노출 → 풀리기 완료</td></tr></tbody></table>

![](/blog/diva-3-insecure-data-storage-1/03.png)

![](/blog/diva-3-insecure-data-storage-1/04.png)

  
  

> <strong>Tip</strong> : 디버그 빌드가 아닌 경우에도 루팅, ADB 백업, 앱 데이터 추출(Helium/adb backup) 등으로 동일 취약 노출 가능.

---

## 🔍 Root Cause 분석

1.  <strong>평문 저장</strong> : 민감 데이터를 바로 putString() -> 누구나 읽기 가능
2.  <strong>암호화 부재</strong> : Android Keystore / AES 사용 안 함
3.  <strong>Debuggable</strong> : 개발 편의상 android:debuggable="true" 빌드 → run-as·adb backup 허용
4.  <strong>권한 경계 착각</strong> : MODE\_PRIVATE = 다른 앱만 접근 불가일 뿐, <strong>로컬·루트</strong> 에선 보호되지 않음

---

## 🚧 Mitigation & Hardening 가이드

<table style="border-collapse: collapse; width: 100%;" border="1" data-end="1909" data-start="1264" data-ke-align="alignLeft"><tbody data-end="1909" data-start="1298"><tr><td><b>영역</b></td><td><b>권장 조치</b></td><td><b>참고</b></td></tr><tr data-end="1437" data-start="1298"><td data-col-size="sm" data-end="1312" data-start="1298"><b>데이터 암호화</b></td><td data-end="1367" data-start="1312" data-col-size="md">Jetpack <b>EncryptedSharedPreferences</b> or 직접 AES/GCM</td><td data-end="1437" data-start="1367" data-col-size="md">implementation "androidx.security:security-crypto:1.1.0-alpha06"</td></tr><tr data-end="1520" data-start="1438"><td data-col-size="sm" data-end="1449" data-start="1438"><b>키 관리</b></td><td data-col-size="md" data-end="1495" data-start="1449">대칭키는 <b>Android Keystore</b> 내부에 저장 → 외부 유출 방지</td><td data-end="1520" data-start="1495" data-col-size="md">KeyGenParameterSpec</td></tr><tr data-end="1648" data-start="1521"><td data-col-size="sm" data-end="1536" data-start="1521"><b>Build 설정</b></td><td data-end="1625" data-start="1536" data-col-size="md">출시 APK → android:debuggable="false"&lt;br/&gt;minifyEnabled true, shrinkResources true</td><td data-end="1648" data-start="1625" data-col-size="md">ProGuard /R8 난독화 병행</td></tr><tr data-end="1730" data-start="1649"><td data-col-size="sm" data-end="1661" data-start="1649"><b>백업 차단</b></td><td data-col-size="md" data-end="1705" data-start="1661">android:allowBackup="false" manifest 설정</td><td data-end="1730" data-start="1705" data-col-size="md">ADB backup로 데이터 유출 차단</td></tr><tr data-end="1820" data-start="1731"><td data-col-size="sm" data-end="1743" data-start="1731"><b>루팅 탐지</b></td><td data-end="1801" data-start="1743" data-col-size="md">SafetyNet / Play Integrity API 로 변조·루트 환경 탐지 → 민감 기능 차단</td><td data-end="1820" data-start="1801" data-col-size="md">보안 민감 앱(핀테크) 필수</td></tr><tr data-end="1909" data-start="1821"><td data-col-size="sm" data-end="1836" data-start="1821"><b>위험 계층 분리</b></td><td data-end="1887" data-start="1836" data-col-size="md">자격증명은 <b>Secure Server</b> 보관, 토큰만 로컬 캐시(만료·재발급 가능)</td><td data-end="1909" data-start="1887" data-col-size="md">OAuth 2.0 / JWT 권장</td></tr></tbody></table>
