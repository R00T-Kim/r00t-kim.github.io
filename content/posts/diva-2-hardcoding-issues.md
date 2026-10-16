## 🎯 Objective

앱 내부에 <strong>하드코딩</strong> 된 민감 정보가 무엇인지 찾아 입력-우회로 정상 플로우를 트리거하라.

## 🔍 풀이

1.  <strong>jadx-gui</strong>로 APK 디컴파일
2.  `jakhar.aseem.diva.HardcodeActivity1` 확인 → 문자열 <strong>"vendorsecretkey"</strong> 를 비교.
    
    ![](/blog/diva-2-hardcoding-issues/01.png)
    

   3. 실제 단말에서 동일 값을 입력 → _Access granted!_ 토스트 출력 → **<strong>완료</strong>**

![](/blog/diva-2-hardcoding-issues/02.png)

## 🛠 Root Cause

-   민감 데이터(백도어 키)가 <strong>소스에 그대로 포함</strong>
-   자바 바이트코드는 디컴파일이 쉬워 비밀 유지 불가

## 🚧 Mitigation

| 방법 | 설명 |
| --- | --- |
| 서버-사이드 검증 | 키 값은 서버에 저장, TLS로 전송 |
| NDK & 암호화 | 추출 난이도 ↑ _but_ <strong>Security by Obscurity</strong> 한계 |
| 런타임 시크릿 주입 | CI/CD 단계에서 환경변수 → BuildConfig |
