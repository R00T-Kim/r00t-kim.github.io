## Blind SQL Injection

-   기존 SQL Injection 취약점과는 달리, 추출하려는 데이터가 눈에 보이지 않을 때 True인 쿼리문과 False인 쿼리문의 응답이 다른 점을 이용해 데이터를 추출해낸다
    
-   substr, left, right 등의 함수를 활용하여 분리하여 한 글자씩 추출해내는 것이 포인트
    
-   아래는 전체적인 동작 과정 ![출처:https://blog.naver.com/sk_shieldus/222851685540](/blog/blind-sql-injection-time-based/01.png)
    

```sql
if(substr(SELECT password FROM user WHERE username='admin'),1,1)='a',"admin","no-admin")
```

#### 위 쿼리문의 동작을 살펴보자.

1.  서브쿼리 실행
    
    ```sql
    SELECT password FROM user WHERE username='admin'
    ```
    

-   user 테이블에서 username이 'admin'인 사용자의 비밀번호를 가져옴

2.  문자열 추출
    
    ```sql
    substr( ... ,1,1)
    ```
    

-   가져온 비밀번호의 문자열의 첫 번째 문자만 추출함.

3.  조건 비교
    
    ```sql
    ... = 'a'
    ```
    

-   추출한 첫 번째 문자가 문자 'a'와 동일한지 비교함

4.  조건에 따른 결과 반환
    
    ```sql
    if({조건문},"admin,"no-admin")
    ```
    

-   조건이 참이면 "admin"을, 거짓이면 "no-admin"을 반환함.

위 과정을 통해 원하는 데이터를 추출해낼 수 있음.

## +Time-Based SQL Injection

-   원리는 Blind SQL Injection과 같음
    
-   하지만 쿼리문의 True, False를 눈에 보이는 데이터로 반환하지 않을 때, sleep()등의 시간으로 참/거짓을 판단하는 방식
    
    ```sql
    if(substr(SELECT password FROM user WHERE username='admin'),1,1)='a',"sleep(1)","no-admin")
    ```
    

## 효율적인 접근 방법

-   무차별 대입(brute force)은 로그를 많이 남길 수 밖에 없음.
    
-   이진 탐색(Binary Search)을 활용하면 시행을 log 수준으로 낮출 수 있음.
    

## Mitigation

-   Sanitize / Filtering 함수 활용 or 정규 표현식 등
    
-   Prepared Statement SQL 입력에 대해 특정 Type(문자열 등)으로 바인딩하게 하는 방법
    

> 궁금하신 점이나, 잘못된 정보가 있다면 댓글로 알려주세요. 감사합니다!

---

Refrence : [https://blog.naver.com/sk\_shieldus/222851685540](https://blog.naver.com/sk_shieldus/222851685540)
