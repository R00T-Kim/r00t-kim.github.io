[1.1 경영진의 보안 리더십과 의지 - 중소기업/스타트업 보안 전략 가이드](https://rootk1m.tistory.com/2)

[1.2 자산 식별과 위협 평가 - 중소기업/스타트업 보안 전략 가이드](https://rootk1m.tistory.com/4)

## 🚨 <strong>규칙이 없으면 보안은 관습이 된다</strong> – 정책/절차 수립이 SMB 보안의 출발점

> “명문화된 규칙이 없다면, 사람들은 저마다 익숙한 방식으로만 행동한다.  
> 보안이 ‘습관’이 아닌 ‘문화’가 되려면 문서화된 기준이 먼저다.”

---

## 🧭 <strong>인트로: ‘문서’는 왜 늘 뒷전으로 밀릴까?</strong>

빠른 제품 출시, 투자 유치, 시장 확장을 향해 전력 질주하는 스타트업, 중소기업(SMB)에게  
‘정보보호 정책/절차 문서’는 대개 <strong>“나중에 써도 되는 형식적 산출물”</strong>로 여겨집니다.  
그러나 실제 사고 분석 보고서를 보면, 침해 사고의 <strong>68%</strong>가 <strong>휴먼 요소 즉,</strong> <strong>“규정 없음 → 책임 흐림 → 실수/오남용”</strong>의 순서로 이어집니다.

![](/blog/sme-security-guide-1-3/01.png)

(Verizon 2024 DBIR Executive Summary PDF p.8 [https://www.verizon.com/business/resources/reports/2024-dbir-executive-summary.pdf](https://www.verizon.com/business/resources/reports/2024-dbir-executive-summary.pdf))  
결국 <strong>‘문서화된 규칙’</strong>이야말로 가장 저렴하고도 강력한 보안 통제라는 사실이 드러납니다.

이 글은 ISO 27001:2022와 ISMS-P(2023) 프레임워크를 <strong>SMB 스케일</strong>로 축소, 적용해  
“경영진, 보안 담당자, 일반 사원, 보안을 공부 중인 학생” 모두가  
바로 써먹을 수 있는 <strong>정책 설계/운영 가이드</strong>를 제공합니다.

---

## ⚠️ <strong>핵심 이슈</strong>

### 1️⃣ 규제, 투자 딜리전스에서 ‘문서’는 기본 자격 요건

-   개인정보를 다루는 모든 기업은 「[개인정보 보호법](https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%EB%B3%B4%ED%98%B8%EB%B2%95)」 29조에 따라 <strong>내부관리계획(정책)</strong>을 의무적으로 보유해야 합니다.
-   SaaS/핀테크 기업은 고객사의 ISO 27001/CSA STAR 체크리스트 검토를 받습니다. <strong>정책 부재 = 계약 탈락</strong>입니다.
-   투자 실사 과정에서도 “정보보호 정책, 조직도/사고 대응 계획” 제출은 상수입니다.

### 2️⃣ 사건, 사고 대응 시 기준 부재가 부르는 혼란

-   사고가 터졌을 때, _“누가 리더냐, 어떤 채널로 보고하냐, 외부 통지는 언제 하냐”_가 문서화돼 있지 않으면  
    <strong>보고 지연/책임 공방/법적 의무 불이행</strong>이 연쇄적으로 발생합니다.
-   「[개인정보 보호법 시행령](https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%EB%B3%B4%ED%98%B8%EB%B2%95%EC%8B%9C%ED%96%89%EB%A0%B9)」은 유출 발생 후 <strong>72시간 이내</strong> 관계기관 통지를 [규정](https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%EB%B3%B4%ED%98%B8%EB%B2%95%EC%8B%9C%ED%96%89%EB%A0%B9/\(20250313,35343,20250225\)/%EC%A0%9C39%EC%A1%B0)합니다.  
    정책/절차가 없으면 시간 안에 의무를 이행하기 거의 불가능합니다.

### 3️⃣ 잦은 조직 개편, 원격 근무 환경에서의 공통 규범

-   스타트업은 인사이동이 잦고 외부 개발자, 협력사가 수시로 출입합니다.  
    <strong>부서별, 개인별 관습</strong>에 보안을 맡기면 통제가 불가능해집니다.
-   문서화된 <strong>최소 공통 규범(Policy)</strong>은 경험이 다른 구성원들에게  
    _“우리 회사에서 보안은 이렇게 한다”_는 <strong>단일 기준</strong>을 제공합니다.

### 4️⃣ 보안 예산 확보의 논리적 근거

-   <strong>정책에 정의된 통제</strong>가 있어야 “무엇을, 왜, 언제까지” 해야 하는지 정량화할 수 있습니다.  
    경영진 설득 역시 <strong>“문서에 정의된 의무 이행”</strong>이라는 명분이 있을 때 쉽습니다.
-   예산 품의서에 _“정책 2.6항 ‘다중인증 적용’ 이행을 위해 MFA 솔루션 도입 필요”_라고 적으면  
    <strong>ROI, 우선순위를</strong> 설명할 근거가 됩니다.

---

## 🎯 <strong>전략 제안: ‘Policy Stack 4계층’으로 시작하라</strong>

### Policy Stack 구조

<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft"><tbody><tr><td><b>계층</b></td><td><b>핵심 역할</b></td><td><b>SMB 최소 구현 예</b></td></tr><tr><td><b>헌장 (Charter)</b></td><td>최고경영진 선언, 범위/책임/검토 주기</td><td>1~2쪽, CEO 서명</td></tr><tr><td><b>정책 (Policy)</b></td><td>“무엇을 해야 하나”를 규정</td><td>접근통제/암호/사고대응 등 8~10종</td></tr><tr><td><b>표준 (Standard)</b></td><td>기술 / 품질 세부 기준</td><td>패스워드≥12자, AWS S3 버킷 암호화</td></tr><tr><td><b>절차 (Procedure)</b></td><td>“어떻게 할 것인가” 단계별 가이드</td><td>계정 발급 SOP, 패치 플로우</td></tr></tbody></table>

> ☑️ <strong>Tip</strong> – 정책 저장소를 Git으로 관리하면 <strong>Pull Request = 정책 변경 승인</strong>이 됩니다.  
> 문서 버전/검토자/승인자를 자동으로 기록할 수 있어 증적 관리가 대폭 수월해집니다.

---

### ISO 27001, ISMS-P 매핑 MVP 10종

<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft"><tbody><tr><td><b>정책 문서</b></td><td><b>ISO 27001 통제 예</b></td><td><b>ISMS-P 매핑 예</b></td></tr><tr><td>정보보호 조직/역할</td><td>A.5 Information&nbsp;Security&nbsp;Policies</td><td>2.1 정책, 조직, 자산관리</td></tr><tr><td>인적 보안(채용/퇴사)</td><td>A.6.5&nbsp;Responsibilities&nbsp;after&nbsp;termination&nbsp;or&nbsp;change&nbsp;of&nbsp;employment</td><td>2.2 인적 보안</td></tr><tr><td>자산 관리</td><td>A.5.9 Inventory&nbsp;of&nbsp;Information&nbsp;and&nbsp;Other&nbsp;Associated&nbsp;Assets</td><td>2.1.3 정보자산 관리</td></tr><tr><td>접근통제</td><td>A.5.15 Access control</td><td>2.6 접근통제</td></tr><tr><td>암호 관리</td><td>A.8.24&nbsp;Use&nbsp;of&nbsp;cryptography</td><td>2.7 암호화 적용</td></tr><tr><td>로깅/모니터링</td><td>A.8.15 로깅 / A.8.16 모니터링</td><td>2.10 시스템 및 서비스 보안관리</td></tr><tr><td>변경/형상 관리</td><td>A.8.32&nbsp;Change&nbsp;management</td><td>2.9 시스템 및 서비스 운영관리</td></tr><tr><td>협력사/벤더 관리</td><td>A.5.19 Addressing&nbsp;information&nbsp;security&nbsp;within&nbsp;supplier&nbsp;agreements</td><td>2.3 외부자 보안</td></tr><tr><td>사고 대응</td><td>A.5.25&nbsp;Information&nbsp;security&nbsp;incident&nbsp;management</td><td>2.11 사고 예방 및 대응</td></tr><tr><td>백업/복구(BCP/DR)</td><td>A.8.13 Information&nbsp;backup</td><td>2.12 재해 복구</td></tr></tbody></table>

10종만 갖춰도 ISO 27001 93개 통제의 ‘정책, 조직’ 요구사항을 80% 이상 커버할 수 있습니다.

---

## ✅ <strong>실행 체크리스트</strong>

단계 해야 할 일 도구, 팁

<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft"><tbody><tr><td><b>1. 범위 확정</b></td><td>어느 조직, 시스템에 정책을 적용할지 결정</td><td>리스크 평가 결과 사용</td></tr><tr><td><b>2. 헌장 작성</b></td><td>CEO 서명 1~2쪽 선언문</td><td>Notion 템플릿 활용</td></tr><tr><td><b>3. 정책 초안</b></td><td>MVP 10종 정책 초안 작성</td><td>SANS, GitHub 템플릿 참고</td></tr><tr><td><b>4. 내부 검토</b></td><td>각 부서 피드백, 현실성 조정</td><td>Slack PR 리뷰</td></tr><tr><td><b>5. 최고 승인</b></td><td>경영회의/전자결재로 공식 비준</td><td>결재선 꼭 기록</td></tr><tr><td><b>6. 전사 공지</b></td><td>이메일, 인트라넷 게시, 서약서 징구</td><td>노션 읽음 확인</td></tr><tr><td><b>7. 표준/절차</b></td><td>기술 기준, 업무 매뉴얼 세분화</td><td>Markdown + Git</td></tr><tr><td><b>8. 통제 이행</b></td><td>설정 변경, 프로세스 반영</td><td>MFA, 로그 정책 배포</td></tr><tr><td><b>9. 교육/캠페인</b></td><td>신규, 전사 교육, 미니 퀴즈</td><td>e-러닝 15분 모듈</td></tr><tr><td><b>10. 검토/개정</b></td><td>분기 자체 점검, 연 1회 개정</td><td>PDCA 사이클 운영</td></tr></tbody></table>

---

## 🏗️ <strong>정책 문서 설계 가이드</strong>

### 공통 구성 요소

1.  <strong>목적과 범위</strong> – “누구에게, 무엇을 위해 적용되는가?”
2.  <strong>용어 정의</strong> – 약어, 전문 용어를 친절히 설명
3.  <strong>역할과 책임</strong> – CISO/IT/개발/모든 임직원 책임 명시
4.  <strong>정책 진술</strong> – 지켜야 할 ‘규칙’을 선언형 문장으로 기술
5.  <strong>예외 관리</strong> – 정책 준수 불가 시 승인 프로세스
6.  <strong>위반 시 제재</strong> – 징계/법적 책임 등 명문화
7.  <strong>관련 문서</strong> – 상/하위 문서, 법령 참조
8.  <strong>버전 관리</strong> – 개정 이력/승인자/유효일자 표기

### 예시: <strong>접근통제 정책</strong>

<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft"><tbody><tr><td><b>필수 항목</b></td><td><b>샘플 문구</b></td></tr><tr><td><b>목적</b></td><td>“본 정책은 정보시스템 접근권한 부여/변경/회수 기준을 정의한다.”</td></tr><tr><td><b>범위</b></td><td>“모든 임직원,외주 인력,협력사 계정을 포함한다.”</td></tr><tr><td><b>원칙</b></td><td>“최소 권한 원칙을 적용하며, 공유 계정 사용을 금지한다.”</td></tr><tr><td><b>비밀번호 규칙</b></td><td>“길이 12자 이상, 대소문자,숫자,특수문자 각 1자 포함, 90일마다 변경”</td></tr><tr><td><b>MFA</b></td><td>“관리자 권한은 반드시 2단계 인증을 사용한다.”</td></tr><tr><td><b>리뷰 주기</b></td><td>“분기 1회 이상 모든 시스템 권한을 점검한다.”</td></tr><tr><td><b>예외</b></td><td>“예외 필요 시 보안팀,CISO 사전 승인 필수”</td></tr><tr><td><b>제재</b></td><td>“무단 공유 계정 사용 적발 시 즉시 계정 잠금 및 징계 절차”</td></tr></tbody></table>

정책 → “비밀번호 구성 표준” → “계정 발급/회수 절차”로 연결되도록 설계합니다.

---

## 🛠️ <strong>실행 도구/자동화 예시</strong>

필요 작업 저비용, 고효율 도구

<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft"><tbody><tr><td><b>문서 버전 관리</b></td><td>GitLab / GitHub Private Repo</td></tr><tr><td><b>정책 공개/열람</b></td><td>Notion, GitBook, Confluence</td></tr><tr><td><b>서명/배포</b></td><td>Google Workspace 전자서명, DocuSign</td></tr><tr><td><b>교육/테스트</b></td><td>Typeform 퀴즈, Google Form 확인서</td></tr><tr><td><b>권한 리뷰 자동화</b></td><td>IAM 분석 오픈소스(CloudQuery 등)</td></tr><tr><td><b>정책 준수 점검</b></td><td>가벼운 CIS-CAT, Lynis, Scout Suite</td></tr></tbody></table>

---

## 📚 <strong>참고자료</strong>

-   [ISO/IEC 27001 : 2022 & ISO/IEC 27002 : 2022](https://www.isms.online/)
-   [KISA <strong>ISMS-P 인증 제도 안내서</strong>](https://isms.kisa.or.kr/main/ispims/notice/?boardId=bbs_0000000000000014&mode=view&cntId=24)
-   [<strong>NIST SP 800-53 rev 5</strong> Controls Catalog](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)
-   [SANS <strong>Security Policy Templates</strong>](https://www.cisecurity.org/wp-content/uploads/2019/08/NCSR-SANS-Policy-Templates.pdf)
-   [GitHub <strong>security-policy-templates</strong>](https://github.com/JupiterOne/security-policy-templates)
-   [KISA <strong>중소기업 정보보호 가이드</strong> 시리즈](https://www.kisa.or.kr/2060302/form?postSeq=3&lang_type=KO&page=1)

---

## ✍️ <strong>나의 생각</strong>

솔직히 정책 문서 작업은 지루하고 따분하게 느껴질 수 있습니다. 하지만 <strong>“보안은 결국 문서로부터 시작된다”</strong>는 점을 잊지 말아야 합니다. 지금 한 번 제대로 만들어두면, 사고/감사/투자 유치 등 중요한 순간마다 우리를 지켜주는 든든한 안전망이 된다는 것을 알게 되었습니다.

이 시리즈로 돌아오는 것도 오랜만이네요. 아마 다음 글은 안드로이드 해킹일 겁니다. 프로젝트 일지 써야 해서.. 긴 글 읽느라 고생하셨습니다.
