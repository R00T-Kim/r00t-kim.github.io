[중소기업/스타트업 보안 전략 가이드 - 0](https://rootk1m.tistory.com/1)

[1.1 경영진의 보안 리더십과 의지 - 중소기업/스타트업 보안 전략 가이드](https://rootk1m.tistory.com/2)

## 🚨 관리되지 않는 자산은 보호할 수 없다: 자산 관리와 리스크 평가의 중요성

> 보안의 첫걸음은 자신이 무엇을 보호해야 하는지 명확히 아는 것입니다.

---

## 🧭 인트로: 스타트업과 중소기업의 사이버 보안 필수 조건 - "정말 큰일 나나요?"라는 질문에 답하다

빠르게 성장하는 스타트업과 자원이 제한적인 중소기업에게 사이버 보안은 종종 간과되기 쉬운 영역입니다. <strong>"작은 규모에 사이버 공격이 정말 일어날까?"</strong>, <strong>"굳이 보안 시스템을 도입해야 할까?"</strong>라는 현실적 고민은 당연할 수 있지만, 이는 <strong>매우 위험한 오해</strong>입니다.

[1.1 경영진의 보안 리더십과 의지](https://rootk1m.tistory.com/2)에서 확인했듯이, 사실 많은 사이버 공격이 중소기업을 대상으로 이루어지며, 기업의 존폐를 위협할 정도로 심각한 수준에 이를 수 있습니다.

이 글을 통해 현실적인 제약 속에서도 효과적으로 정보 자산을 보호할 수 있도록 <strong>자산 식별, 위협 모델링, 그리고 리스크 평가의 중요성과 실행 방법</strong>에 대해 자세히 알아볼 것입니다.

---

## <strong>⚠️ 핵심 이슈 1️⃣: 자산 식별의 필요성과 방법</strong>

### 🔍 <strong>기업 환경에서의 "자산" 정의</strong>

단순히 하드웨어나 소프트웨어만을 자산으로 생각하는 것은 보안 관점에서 매우 좁은 시각입니다. 스타트업과 중소기업의 자산은 유형적인 것뿐만 아니라 무형적인 가치까지 포함하는 넓은 개념으로 이해해야 합니다. <strong>고객 데이터베이스, 핵심 기술 및 지적 재산, 마케팅 전략, 클라우드 서비스 구독 정보, 그리고 특정 지식이나 기술을 보유한 직원까지 모두 중요한 자산</strong>에 해당합니다. 보호해야 할 대상을 명확히 정의하는 것이 효과적인 보안 전략의 첫걸음입니다.

![정보자산 분류 기준 (출처: 한국정보통신기술협회)](/blog/sme-security-guide-1-2/01.png)

*정보자산 분류 기준 (출처: 한국정보통신기술협회)*

### <strong>🔍 자산 식별이 중요한 이유</strong>

<strong>"존재하는지조차 모르는 것을 어떻게 보호할 수 있을까요?"</strong> 자산 식별은 이 질문에 대한 답을 찾는 과정입니다. 기업이 보유한 모든 가치 있는 정보와 시스템을 파악하지 못하면, 공격자에게 노출될 수 있는 취약점을 효과적으로 관리할 수 없습니다. 특히 빠르게 성장하는 스타트업의 경우, 통제되지 않는 Shadow IT 자산이나 보안이 허술한 엔드포인트가 사이버 공격의 주요 통로가 될 수 있습니다.

### <strong>🔍 자산 식별 및 분류를 위한 단계별 가이드</strong>

#### <strong>1단계: 자산 목록화</strong>

-   하드웨어, 소프트웨어, 데이터, 클라우드 서비스, 네트워크 구성 요소, 문서, 인적 자산을 체계적으로 기록하고 관리합니다.  
    
    ![정보자산 관리 기준 (출처: 한국정보통신기술협회)](/blog/sme-security-guide-1-2/02.png)
    
    *정보자산 관리 기준 (출처: 한국정보통신기술협회)*
    
-   자산 목록을 만드는 방법으로는 자동화된 자산 검색 도구를 활용하거나 [(CAASM - Cyber Asset Attack Surface Management)](https://www.rapid7.com/fundamentals/what-is-cyber-asset-attack-surface-management-caasm/), 수동으로 부서별 담당자로부터 정보를 취합하여 관리합니다.
-   중요한 것은 <strong>모든 자산을 빠짐없이 기록</strong>하고, <strong>중앙 집중식으로 관리할 수 있는 시스템을 구축</strong>하는 것입니다.
-   [CIS Controls v8](https://www.cisecurity.org/controls/v8)에서는 기업 자산 및 소프트웨어 자산의 인벤토리 및 제어를 위한 구체적인 지침을 제공합니다.

#### <strong>2단계: 자산 분류 및 중요도 평가</strong>

-   식별된 자산들을 단순히 나열하는 것에서 더 나아가, 각 자산의 가치, 민감도, 그리고 업무 연속성에 미치는 영향 등을 기준으로 분류하고 <strong>중요도를 평가</strong>해야 합니다.
-   일반적으로 자산의 보안 등급은 <strong>기밀성, 무결성, 가용성</strong>의 요구 수준을 평가하여 결정됩니다

![자산정보 평가 기준 (출처: 한국정보통신기술협회)](/blog/sme-security-guide-1-2/03.png)

*자산정보 평가 기준 (출처: 한국정보통신기술협회)*

#### <strong>3단계: 최신 정보 유지</strong>

-   자산 목록은 한번 만들고 끝나는 것이 아니라, 지속적으로 검토하고 업데이트해야 하는 살아있는 문서입니다.
-   IT 환경은 끊임없이 변화하므로, 새로운 소프트웨어나 하드웨어 도입, 직원 변동 등에 따라 자산 목록도 최신 상태를 유지해야 합니다.

---

## <strong>⚠️ 핵심 이슈 2️⃣: 위협 모델링의 이해</strong>

### <strong>🔍 위협 모델링이란 무엇이며 왜 중요할까?</strong>

위협 모델링은 애플리케이션이나 시스템에 <strong>잠재적인 보안 위협을 식별, 분석 및 완화하기 위해 사용되는 구조화된 접근 방식</strong>입니다. 공격자의 관점에서 시스템을 바라보고, 발생 가능한 취약점과 공격 경로를 예측하는 과정이라고 할 수 있습니다.

위협 모델링은 사전에 보안 취약점을 발견하고 해결함으로써, 실제 공격 발생 시 초래될 수 있는 <strong>피해를 최소화하는 데 중요한 역할</strong>을 합니다. 특히 자원이 부족한 스타트업에게 위협 모델링은 초기 개발 단계부터 보안을 고려하여 <strong>불필요한 비용과 노력을 줄이는 효과적인 방법</strong>이 될 수 있습니다

### <strong>🔍 위협 모델링의 4단계</strong>

1.  애플리케이션 평가 및 다이어그램 작성하기 (DFD 활용)
2.  애플리케이션 구성의 보안 결함 식별
3.  결함을 수정하는 변경 사항 만들기
4.  변경 사항이 적용되어 위협을 올바르게 완화했는지 확인하기

### <strong>📌 데이터 흐름 다이어그램(DFD)이란?</strong>

DFD는 <strong>시스템의 구성 요소와 데이터 이동 경로를 시각적으로 표현</strong>하는 방법입니다. 이를 통해 시스템의 경계와 데이터의 흐름을 명확히 파악해 잠재적인 위협을 발견할 수 있습니다. 스타트업은 Lucidchart나 draw.io 같은 가벼운 도구를 활용할 수 있으며, 전문적으로는 Microsoft Threat Modeling Tool이나 OWASP Threat Dragon을 사용할 수 있습니다.

![대표적인 DFD 툴인 Microsoft Threat Modeling Tool](/blog/sme-security-guide-1-2/04.jpg)

*대표적인 DFD 툴인 Microsoft Threat Modeling Tool*

### <strong>📌 STRIDE 모델</strong>

STRIDE는 Microsoft에서 개발한 위협 분류 모델로, 다음과 같은 여섯 가지 유형의 위협을 식별하는 데 사용됩니다.

| STRIDE 범주 | 정의 | 중소기업 관련 예 |
| --- | --- | --- |
| <strong>Spoofing</strong> | 공격자가 다른 사람이나 시스템을 가장하여 권한을 얻거나 악의적인 행위를 수행하는 것 | 피싱 공격을 통해 직원의 계정 정보를 탈취하거나, 가짜 웹사이트를 만들어 고객의 개인 정보를 훔치는 행위 |
| <strong>Tampering</strong> | 데이터의 무결성을 훼손하는 행위 | 웹사이트의 콘텐츠를 무단으로 변경하거나, 데이터베이스의 정보를 조작하여 오작동을 유발하는 행위 |
| <strong>Repudiation</strong> | 어떤 행위를 수행한 사실을 부인하는 것 | 직원이 중요한 데이터를 삭제하고도 자신의 행위가 아니라고 주장하거나, 거래 기록을 조작하여 책임을 회피하는 행위 |
| <strong>Information Disclosure</strong> | 권한 없는 사용자가 민감한 정보에 접근하는 것 | 암호화되지 않은 고객 데이터베이스에 접근하거나, 허술한 접근 제어를 통해 내부 정보가 경쟁사로 유출되는 행위 |
| <strong>Denial of Service</strong> | 합법적인 사용자가 시스템이나 서비스에 접근하지 못하도록 방해하는 행위 | 웹사이트에 과도한 트래픽을 유발하여 다운시키거나, 중요 서비스에 대한 접근을 차단하여 업무 마비를 유발하는 행위 |
| <strong>Elevation of Privilege</strong> | 권한 없는 사용자가 더 높은 수준의 권한을 획득하는 것 |   |

---

## <strong>⚠️ 핵심 이슈 3️⃣: 리스크 평가 프로세스</strong>

### <strong>🔍 리스크 평가란 무엇이며 왜 필요할까?</strong>

리스크 평가는 조직의 자산에 대한 <strong>잠재적인 위협과 취약점을 식별</strong>하고, 그로 인해 발생할 수 있는 부정적인 영향의 가능성과 심각성을 평가하는 체계적인 프로세스입니다. 리스크 평가를 통해 조직은 <strong>보안 취약점을 파악</strong>하고, 어떤 위협에 <strong>우선적으로 대응해야 하는지 결정</strong>할 수 있으며, 제한된 자원을 효율적으로 배분하여 <strong>정보 보안 수준을 향상</strong>할 수 있습니다. 또한, 리스크 평가 결과는 정보 보안 정책 수립 및 개선, 보안 통제 구현, 그리고 비상 대응 계획 마련의 기초 자료로 활용됩니다.

### <strong>🔍 관련 프레임워크</strong>

정보 보안 리스크 관리를 위한 대표적인 프레임워크로는 <strong>ISO 27005</strong>와 <strong>NIST RMF</strong>가 있습니다.

-   <strong>[ISO 27005](https://en.wikipedia.org/wiki/ISO/IEC_27005)</strong>: 정보 보안 리스크 관리에 특화된 국제 표준으로, 자산 식별, 위협 및 취약점 분석, 리스크 평가, 리스크 처리 등 정보 보안 리스크 관리 전반에 대한 지침을 제공합니다.

![ISO 27005](/blog/sme-security-guide-1-2/05.png)

*ISO 27005*

-   <strong>[NIST RMF (Risk Management Framework)](https://en.wikipedia.org/wiki/Risk_Management_Framework)</strong>: 미국 국립표준기술연구소 (NIST)에서 개발한 프레임워크로, 정보 시스템의 보안 및 개인 정보 보호를 위한 체계적인 프로세스를 제시합니다. Categorize, Select, Implement, Assess, Authorize, Monitor의 6단계로 구성되어 있습니다.

![NIST RMF](/blog/sme-security-guide-1-2/06.png)

*NIST RMF*

---

## <strong>🎯 전략 제안: 스타트업/중소기업을 위한 실질적인 리스크 평가 접근 방식</strong>

### <strong>🔍 1단계: 위협과 취약점 식별</strong>

-   <strong>위협</strong>은 조직의 자산에 잠재적인 해를 끼칠 수 있는 사건 또는 행위이며, <strong>취약점</strong>은 위협이 악용할 수 있는 시스템 또는 프로세스의 약점입니다.
-   팀 구성원들과의 브레인스토밍 세션을 통해 조직의 사업과 관련된 잠재적인 위협 (예: 피싱, 악성코드 감염, 데이터 유출, 내부자 위협 )을 식별하고, OWASP Top 10과 같은 자료를 참고하여 웹 애플리케이션의 취약점을 파악할 수 있습니다.
-   내부 및 외부 위협 모두 고려해야 하며, 무료 취약점 스캐닝 도구를 활용하여 시스템의 기술적인 취약점을 점검하는 것도 좋은 방법입니다.

### <strong>🔍 2단계: 발생 가능성 및 영향 평가</strong>

-   위협의 발생 가능성은 해당 위협이 <strong>실제로 발생할 확률</strong>을 의미하며, 영향은 위협이 발생했을 때 조직에 미칠 수 있는 <strong>잠재적인 피해 규모</strong>를 의미합니다.
-   스타트업은 정량적인 평가보다는 "낮음", "중간", "높음"과 같은 간단한 <strong>정성적 척도</strong>를 사용하여 발생 가능성과 영향을 평가할 수 있습니다.
-   이때, 재정적 손실, 기업 이미지 손상, 운영 중단, 법적/규제 위반 등 다양한 유형의 영향을 고려해야 합니다. 특히 스타트업에게는 기업 이미지 손상이 치명적일 수 있다는 점을 간과해서는 안 됩니다

### <strong>🔍 3단계: 리스크 계산 및 우선순위 결정</strong>

-   리스크는 일반적으로 <strong>발생 가능성과 영향의 조합</strong>으로 계산됩니다 (예: 발생 가능성 x 영향, 또는 리스크 매트릭스 활용 ).
-   간단한 리스크 매트릭스를 통해 각 리스크의 수준을 시각적으로 확인하고, 높은 수준의 리스크부터 우선적으로 대응 전략을 수립해야 합니다.
-   [<strong>DREAD 모델</strong>](https://www.purestorage.com/knowledge/dread-threat-model.html)을 활용하여 위협의 심각도를 평가하고 우선순위를 결정하는 것도 효과적인 방법입니다.

---

## <strong>✅ 실천 항목: 스타트업과 중소기업을 위한 실천 방안</strong>

### <strong>🤑 흔히 겪는 어려움과 현실적인 제약</strong>

스타트업과 중소기업은 제한적인 예산, 전문 인력 부족, 시간 제약, 그리고 보안 전문 지식 부족 등 다양한 어려움에 직면합니다. 하지만 모든 보안 활동이 복잡하고 많은 비용을 필요로 하는 것은 아닙니다. 중요한 것은 작은 것부터 시작하여 <strong>점진적으로 보안 수준을 향상</strong>시키는 것입니다. 가장 중요한 자산과 가장 가능성이 높은 위협에 집중하여 우선순위를 정하고 실행하는 것이 효과적입니다.

### <strong>🔍 가벼운 자산 관리 도구</strong>

-   <strong>스프레드시트 (Excel, Google Sheets):</strong> 초기 단계에서는 엑셀이나 구글 시트와 같은 도구를 활용하여 자산 목록을 간단하게 작성하고 관리할 수 있습니다.  
    
-   <strong>무료 또는 저렴한 자산 관리 소프트웨어:</strong> Snipe-IT, Asset Panda, ZORP와 같은 무료 또는 저렴한 자산 관리 소프트웨어는 스타트업에게 적합한 기능을 제공합니다. 클라우드 기반 옵션은 접근성과 확장성이 용이합니다. 다양한 자산 관리 소프트웨어 목록을 참고하여 기업의 필요에 맞는 도구를 선택할 수 있습니다.  
    

![Asset Panda](/blog/sme-security-guide-1-2/07.webp)

*Asset Panda*

### <strong>🔍 무료 또는 저렴한 위협 모델링 도구</strong>

-   <strong>[OWASP Threat Dragon](https://github.com/OWASP/threat-dragon) 및 [Microsoft Threat Modeling Tool](https://learn.microsoft.com/ko-kr/azure/security/develop/threat-modeling-tool-releases):</strong> 무료로 사용할 수 있는 강력한 위협 모델링 도구입니다.  
    
-   <strong>온라인 다이어그램 도구 (Lucidchart, draw.io):</strong> DFD 작성을 위해 [Lucidchart](https://www.lucidchart.com/)나 [draw.io](https://app.diagrams.net/)와 같은 온라인 다이어그램 도구를 활용할 수 있습니다.  
    
-   <strong>OWASP 및 Microsoft 자료:</strong> OWASP Threat Modeling Cheat Sheet, Microsoft Threat Modeling Tool 교육 자료 등 다양한 무료 학습 자료를 활용할 수 있습니다. [GitHub에는 위협 모델링 관련 자료를 모아놓은 리스트](https://github.com/hysnsec/awesome-threat-modelling)도 있습니다.

---

### <strong>😍 위협 모델링 및 리스크 평가 성공 사례</strong>

-   <strong>Eden Data 및 Las Vegas Information Security (현 TCM Security):</strong> [중소기업에 사이버 보안 컨설팅 서비스를 제공하며 성공한 스타트업 사례](https://www.starterstory.com/ideas/cybersecurity-startup/success-stories)입니다. 이는 위협 모델링 및 리스크 평가에 대한 수요가 중소기업 사이에서도 높다는 것을 시사합니다.  
      
    
-   <strong>Global Bank Corp 및 Pacific Trust Bank:</strong> AI 및 다중 요소 인증 (MFA)과 같은 보안 조치 강화를 통해 [사이버 공격 시도를 성공적으로 방어하고 보안 사고 발생률을 크게 감소시킨 사례](https://digitaldefynd.com/IQ/banking-cybersecurity-case-studies/)입니다. 이는 자산 보호 및 리스크 완화에 대한 적극적인 투자의 중요성을 보여줍니다.

### <strong>😭 자산 식별 실패로 인한 보안 사고 사례</strong>

-   <strong>페가수스 항공 데이터 유출:</strong> [클라우드 환경 설정 오류로 인해 민감한 데이터가 노출된 사례](https://www.syteca.com/en/blog/real-life-examples-insider-threat-caused-breaches)로, 적절한 자산 관리 및 보안 통제가 미흡했음을 보여줍니다.  
      
    
-   <strong>캐시 앱 고객 데이터 유출:</strong> [불만을 품은 전 직원이 고객 데이터를 유출한 사례](https://www.syteca.com/en/blog/real-life-examples-insider-threat-caused-breaches)로, 접근 통제 및 민감 정보 모니터링 실패가 원인이었습니다. 이는 자산 관리의 중요성을 강조합니다.  
      
    

---

## <strong>🧐 결론: 보안 인식을 조직 문화로 내재화하기</strong>

-   자산 식별, 위협 모델링, 그리고 리스크 평가는 스타트업과 중소기업이 사이버 보안의 기초를 튼튼히 다지는 데 <strong>필수적인 단계</strong>입니다.
-   보안은 일회성 이벤트가 아니라 <strong>지속적인 여정</strong>이며, 작은 노력들이 모여 강력한 방어 체계를 구축할 수 있습니다.
-   지금 당장은 번거롭고 비용이 든다고 생각될 수 있지만, 장기적인 관점에서 볼 때 이러한 선제적인 보안 활동은 <strong>기업의 성장과 신뢰를 위한 중요한 투자</strong>입니다.
-   모든 직원이 보안의 중요성을 인식하고 각자의 역할을 수행하는 <strong>보안 중심의 문화를 조성</strong>하는 것이 무엇보다 중요합니다.

---

## ✍️ <strong>나의 생각</strong>

스타트업과 중소기업의 장기적인 성공과 회복탄력성을 위해서는 <strong>정보 보안의 기초를 확립</strong>하는 것이 매우 중요하다고 생각합니다. 사이버 보안은 단순히 기술적인 문제가 아니라, <strong>기업의 신뢰도와 직결되는 중요한 경영 이슈</strong>입니다. 초기 단계부터 보안을 고려하는 것은 성장의 발목을 잡는 것이 아니라, 지속 가능한 성장을 위한 든든한 기반을 마련하는 <strong>현명한 투자</strong>입니다. 보안을 성장의 방해물로 여기기보다는, 고객의 신뢰를 얻고 사업을 확장하는 데 도움이 되는 <strong>필수적인 요소</strong>로 인식해야 합니다.

공부하는 입장에서, 전혀 알지 못했던 방법론들과 툴, 실제 사례들도 찾아보며 시간 가는 줄 몰랐습니다. 보안은 정말 넓고도 어렵습니다 😭😭😭
