### 🎯 Objective

myuser 테이블에 저장된 <strong>ID/PW</strong> 를 획득하거나, 테이블 구조 자체를 삭제(DROP) 하여 보호장치 없는 DB 저장을 검증하라.

---

## 1️⃣ 코드 & 취약점 분석

전체 코드

```java
public class InsecureDataStorage2Activity extends AppCompatActivity {
    private SQLiteDatabase mDB;

    @Override // android.support.v7.app.AppCompatActivity, android.support.v4.app.FragmentActivity, android.support.v4.app.BaseFragmentActivityDonut, android.app.Activity
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            this.mDB = openOrCreateDatabase("ids2", 0, null);
            this.mDB.execSQL("CREATE TABLE IF NOT EXISTS myuser(user VARCHAR, password VARCHAR);");
        } catch (Exception e) {
            Log.d("Diva", "Error occurred while creating database: " + e.getMessage());
        }
        setContentView(R.layout.activity_insecure_data_storage2);
    }

    public void saveCredentials(View view) {
        EditText usr = (EditText) findViewById(R.id.ids2Usr);
        EditText pwd = (EditText) findViewById(R.id.ids2Pwd);
        try {
            this.mDB.execSQL("INSERT INTO myuser VALUES ('" + usr.getText().toString() + "', '" + pwd.getText().toString() + "');");
            this.mDB.close();
        } catch (Exception e) {
            Log.d("Diva", "Error occurred while inserting into database: " + e.getMessage());
        }
        Toast.makeText(this, "3rd party credentials saved successfully!", 0).show();
    }
}
```

![](/blog/diva-4-insecure-data-storage-2/01.png)

<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft"><tbody><tr><td><b>취약 요소</b></td><td><b>영향</b></td></tr><tr><td><b>직접 문자열 연결</b></td><td>사용자가 ',); DROP …-- 등 SQL 문법 삽입 가능</td></tr><tr><td><b>입력 검증/인코딩 부재</b></td><td><b>SQL Injection</b> → 임의 쿼리 실행, 데이터 변조·삭제</td></tr><tr><td><b>암호화·해시 부재</b></td><td>암호, ID 그대로 <b>평문</b> SQLite DB 내 보관</td></tr></tbody></table>

---

## 2️⃣ 실습-공격 시나리오

![](/blog/diva-4-insecure-data-storage-2/02.png)

<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft"><tbody><tr><td><b>단계</b></td><td><b>내용</b></td><td><b>결과</b></td></tr><tr><td>① 앱 입력</td><td><b>aaa'); DROP TABLE myuser;--</b> 입력 후 <b>SAVE</b></td><td>코드가 그대로 execSQL 에 전달</td></tr><tr><td>② SQL Injection</td><td>INSERT … 'aaa'); DROP TABLE myuser;--'); → 세미콜론 뒤 <b>DROP</b> 실행</td><td>테이블 myuser 삭제, 이후 정상 기능 오류</td></tr><tr><td>③ 평문 DB 확인</td><td>adb shell run-as jakhar.aseem.divacd databases &amp;&amp; sqlite3 ids2</td><td>SELECT * FROM myuser; → ID/PW 평문 조회 가능 (삭제 전)</td></tr></tbody></table>

![](/blog/diva-4-insecure-data-storage-2/03.png)

> <strong>TIP</strong> : 루트 권한 없이도 debuggable APK 는 <strong>run-as</strong> 로 DB 파일에 접근 가능.

---

## 3️⃣ Root Cause

1.  <strong>Raw SQL 문자열</strong> : 매개변수 바인딩(PreparedStatement) 미사용
2.  <strong>입력 검증 실패</strong> : 정규식·화이트리스트 등 무효
3.  <strong>민감정보 평문 저장</strong> : 해시(scrypt/bcrypt)·암호화 누락
4.  <strong>Debuggable + world-readable DB</strong> : 파일 권한 강화 안됨

---

## 4️⃣ Mitigation & Hardening

<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft"><tbody><tr><td><b>영역</b></td><td><b>권장 조치</b></td><td><b>코드 스니펫</b></td></tr><tr><td><b>SQLi 방어</b></td><td>SQLiteStatement 파라미터 바인딩</td><td>SQLiteStatement st = db.compileStatement("INSERT INTO myuser VALUES (?, ?)"); st.bindString(1, user);</td></tr><tr><td><b>암호 보호</b></td><td>비밀번호 → <b>해시</b>(bcrypt/Argon2)고정키 대신 <b>Android Keystore AES</b> 암호화</td><td>EncryptedFile, CipherOutputStream</td></tr><tr><td><b>파일권한</b></td><td>MODE_PRIVATE + noBackup dir 사용</td><td>openOrCreateDatabase(name, Context.MODE_PRIVATE, null);</td></tr><tr><td><b>Debuggable OFF</b></td><td>android:debuggable="false" 릴리스 빌드</td><td>buildTypes.release { debuggable false }</td></tr><tr><td><b>백업 차단</b></td><td>android:allowBackup="false"</td><td>AndroidManifest.xml</td></tr></tbody></table>

---

## ✅ 체크리스트

-   모든 DB 쿼리 <strong>바인딩 변수</strong> 사용
-   비밀번호·토큰은 <strong>One-way 해시</strong> 저장
-   DB 파일 접근권한 -rw-—— (앱 전용) 확인
-   adb backup, root 환경에서 데이터 노출 시험
-   릴리스 APK 빌드 시 Debuggable·Log 제거
