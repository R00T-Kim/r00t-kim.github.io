## MCP란?

-   Model Context Protocol의 약자
-   AI 모델이 다양한 데이터 소스와 연결되어 '실시간'으로 정보를 주고 받을 수 있도록 설계된 프로토콜
-   간단하게, 서비스와 AI간의 통신을 위한 규약

## 등장 배경

-   2024년 11월 Anthropic에서 오픈 소스로 공개함.
-   Anthropic에선 AI 애플리케이션을 위한 USB-C포트로 비유함.
-   Agents AI와 복잡한 Workflows 위에서도 LLM이 동작할 수 있게 도와줌.

> \[상황1\] LLM은 여러 서비스들과 연동되어 실시간 정보를 가져와야 한다.
> 
> \[문제\] 날씨, 시간, 환율, 웹 검색, 영화 추천 등 API가 여러 곳에 분산되어 있다.
> 
> \[문제2\] 분산된 API를 호출하는 방식(코드, 구조, 응답 등)이 각각 다르고, LLM은 각각의 API 인터페이스를 모른다.
> 
> \[해결방법\] 각각의 API를 호출하는 방법을 통일 = MCP
> 
> \[예시\] 만약 MCP가 없으면? 필요한 API는 매번 코딩해서 붙여야하고, 실시간 서비스 지원이 어렵다.

> \[상황2\] AI 비서에게 "오늘 날씨 알려줘", "최근 Github PR 리뷰 요약" 같은 요청을 처리하도록 한다.
> 
> \[문제\] 날씨 API, Github API, 내부 DB 등 호출 방식이 모두 달라 AI는 매번 복잡한 코드 작성이 필요하다.
> 
> \[해결방법\] MCP는 AI <-> 서비스 간 통신 규약을 표준화해, 통합 인터페이스를 제공함.

## MCP의 구조

MCP는 기본적으로 호스트 애플리케이션이 여러 서버에 연결할 수 있는 Client-Server 아키텍쳐를 따름 ![](/blog/learning-about-mcp/01.png)

-   <strong>MCP Hosts</strong> : IDE, AI 도구 등 MCP를 통해 데이터에 접근하려는 <strong>주체 프로그램</strong>, <strong>전체 흐름을 조율</strong>함.
    
-   <strong>MCP Clients</strong> : <strong>서버와 일대일(1:1) 연결</strong>을 유지하는 프로토콜 클라이언트
    
-   <strong>MCP Servers</strong> : 표준화된 MCP를 통해 특정 <strong>기능을 제공</strong>하는 프로그램
    
-   <strong>Local Data Sources</strong> : MCP 서버가 안전하게 접근할 수 있는 <strong>파일, 데이터베이스 및 서비스</strong>
    
-   <strong>Remote Services</strong> : API 등을 통해 인터넷 상에서 접근 가능한 <strong>외부 시스템</strong>
    

## 특징

-   <strong>Open Standard</strong> : <strong>오픈소스</strong>로 공개되어 있어 누구나 자유롭게 사용하고, 개선할 수 있음.
    
-   <strong>Two-way Connection</strong> : AI 모델과 데이터 소스간의 <strong>양방향 통신</strong>을 지원함.
    
-   <strong>Universality and Standardization</strong> : 다양한 데이터 소스 등을 <strong>단일 표준 프로토콜</strong>로 연결할 수 있게 해줌.
    
-   <strong>Security and Reliability</strong> : AI 모델과 데이터 소스 간의 <strong>안전하고 신뢰</strong>할 수 있는 연결 제공.
    

## 핵심 컴포넌트

### Protocol Layer

-   메시지 프레이밍, 요청/응답 매핑, JSON-RPC 2.0 규격 준수를 담당
    
-   typescript
    
    ```typescript
    import { Protocol } from "@modelcontextprotocol/sdk";
    ```
    

async function main() { const protocol = new Protocol();

// 요청 처리기 등록 protocol.setRequestHandler("echo", async ({ params }) => { return { echo: params.message }; });

// 알림 처리기 등록 protocol.setNotificationHandler("log", async ({ params }) => { console.log("Log:", params.message); });

// 요청 전송 및 응답 대기 const response = await protocol.request({ method: "echo", params: { message: "Hello, MCP!" } }); console.log("Response:", response);

// 알림 전송 (응답 없음) await protocol.notification({ method: "log", params: { message: "TypeScript MCP example" } }); }

main().catch(console.error);

````
- python
```python
import asyncio
from mcp.protocol import Protocol

async def main():
    protocol = Protocol()

    # 요청 처리기 등록
    async def echo_handler(request, extra):
        return {"echo": request["params"]["message"]}

    protocol.set_request_handler("echo", echo_handler)

    # 요청 전송 및 응답 대기
    response = await protocol.request({"method": "echo", "params": {"message": "Hello, MCP!"}})
    print("Response:", response)

    # 알림(Notification) 전송 (응답 없음)
    await protocol.notification({"method": "log", "params": {"message": "Python MCP example"}})

if __name__ == "__main__":
    asyncio.run(main())
````

### Transport Layer

1.  **Stdio** : 로컬 프로세스 간 표준 입출력
2.  **HTTP + SSE** : 원격 서버와 HTTP(S)기반 통신

-   모든 전송은 JSON-RPC 2.0을 사용함. ![](/blog/learning-about-mcp/02.png)
    
    ```python
    # Python SSE client 예시
    from mcp.client.sse import SSEClient
    client = SSEClient(url="http://localhost:8000/sse")
    ```
    

### 연결 생명주기

1️⃣ **Initialize** 2️⃣ **Message Exchange** 3️⃣ **Termination**

```
Client->Server: initialize
Server-->Client: initialized
Client->Server: request/notification
Client->Server: close
```

### 오류 처리

```python
from mcp.protocol import ErrorCode
try:
    await protocol.request({...})
except Exception as e:
    print(f"Error: {e}")
```

## 구현

-   Python, TypeScript, Java 등 다양한 SDK를 제공함
-   Python에서는 **fastmcp**라는 라이브러리를 통해 간단하게 MCP 서버를 구현할 수 있음.
-   [https://github.com/jlowin/fastmcp](https://github.com/jlowin/fastmcp)
    
    ```python
    # pip install fastmcp
    from mcp.server.fastmcp import FastMCP
    mcp = FastMCP("example")
    @mcp.tool()
    async def add(a:int, b:int)->int: return a+b
    mcp.run(transport="stdio")
    ```
    

## 결론

-   최근 MCP가 화제가 되는 이유는 오픈소스 생태계 성장, 호환성, 편의성, 접근성 등이 있음.
-   AI 생태계의 새로운 변화를 가져올 것으로 예측됨.

> 궁금하신 점이나, 잘못된 정보가 있다면 댓글로 알려주세요. 감사합니다!

---

Reference : [https://docs.anthropic.com/ko/docs/agents-and-tools/mcp](https://docs.anthropic.com/ko/docs/agents-and-tools/mcp) [https://modelcontextprotocol.io/docs/concepts/architecture](https://modelcontextprotocol.io/docs/concepts/architecture) [https://discuss.pytorch.kr/t/deep-research-model-context-protocol-mcp/6594](https://discuss.pytorch.kr/t/deep-research-model-context-protocol-mcp/6594) [https://dytis.tistory.com/112](https://dytis.tistory.com/112)
