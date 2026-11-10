![AAOS Teardown #1 Android 보안 기본기](/blog/aaos-explainer/aaos_teardown_1.webp)

안녕하세요, Out of Bounds의 연구원 Gnosis입니다. 이번 연재에서는 Android Automotive OS(AAOS)를 공격자의 시선으로 하나씩 뜯어봅니다. 첫 글은 AAOS가 그대로 물려받은 Android의 보안 구조입니다.

AAOS를 공격 대상으로 보려면, 입력을 받는 코드뿐 아니라 그 코드가 어떤 identity로 도는지도 알아야 한다. 같은 버그라도 어느 프로세스에서 생기느냐에 따라 읽을 수 있는 데이터와 호출할 수 있는 서비스가 달라진다. AAOS는 이 구분에 Android의 보안 구조를 거의 그대로 쓴다.

차량 에뮬레이터의 프로세스 목록에서도 이름만으로는 설명되지 않는 부분이 있었다. `com.android.car`가 사용자 0과 사용자 10에 하나씩 떠 있었고, CarService와 CarSettings는 둘 다 system UID 계열이면서 SELinux 도메인은 달랐다. "차량 서비스다", "system 권한이다"라는 설명만으로는 각 프로세스가 무엇을 할 수 있는지 알기 어려웠다.

이 글은 그 차이를 이해하려고 UID, Android 권한, Binder, SELinux를 소스와 기기 출력에 대어 본 기록이다. 이어서 프로세스를 띄우는 방식에 따라 seccomp와 capability가 어떻게 달라지는지, 하드웨어와 저장소에는 어떤 경계가 있는지 본다.

실험은 Android 15 차량 에뮬레이터(`AAI5.260516.001.A1`, userdebug)에서 했다. `-read-only`로 띄워 재시작하면 원래 상태로 돌아가게 했고, 내부를 들여다볼 때는 `adb root`를 썼다. 소스는 security patch level이 같은 `android-automotiveos-15.0.0_lts5` 태그를 기준으로 읽었다.

공식 문서는 영어 원문을 짧게 인용하고 링크를 붙였다. 같은 개념을 AAOS 문서가 차에 맞게 따로 설명하는 곳은 Android 문서와 나란히 붙였다. AAOS 문서 스스로 보안 모델은 폰 Android 것을 그대로 쓴다고 적는다[^1].

---

## UID

리눅스에서 파일은 소유자 UID와 권한 비트(rwx)를 갖고, 프로세스는 자기 UID로 파일에 접근한다. Android는 이 장치를 앱 격리에 쓴다. 앱을 설치하면 기본적으로 그 앱만의 UID를 정해주고 앱 프로세스와 데이터 디렉토리를 그 UID 소유로 만든다. 공식 문서는 이 구조를 앱 샌드박스(Application Sandbox)라고 부른다.

> "Android assigns a unique user ID (UID) to each Android app and runs it in its own process. Android uses the UID to set up a kernel-level Application Sandbox."
>
> [Application Sandbox](https://source.android.com/docs/security/app-sandbox)

차량 에뮬레이터에서 앱 데이터 디렉토리를 보면 이렇다.

```text
$ ls -lndZ /data/user/10/com.google.android.tts /data/user/10/com.android.car.carlauncher
drwx------ 8 1010218 1010218 u:object_r:app_data_file:s0:c218,c256,c522,c768  ... /data/user/10/com.google.android.tts
drwx------ 5 1010174 1010174 u:object_r:app_data_file:s0:c522,c768            ... /data/user/10/com.android.car.carlauncher
```

권한이 `drwx------`(소유자만 접근)이고 소유자가 앱마다 다르다. TTS 앱(UID 1010218)은 런처(UID 1010174)의 디렉토리를 열 수 없다. 같은 문서에 따르면 이 기본값은 targetSdkVersion 24(Android 7.0) 이상 앱부터 적용됐고 그 전에는 `751`이었다("For apps with targetSdkVersion >= 24, default DAC permissions on an app's home dir changed from 751 to 700"). 오른쪽의 `u:object_r:...`는 SELinux label이다.

### UID 계산

위 출력의 UID는 1010218, 1010174처럼 백만 단위다. 그런데 아래 `packages.list`에서 TTS 앱의 번호는 10218이다. Android가 사용자 번호와 앱 번호(appId)를 합쳐 UID를 만들기 때문이다. 계산은 `UserHandle.getUid`가 한다.

```java
// frameworks/base/core/java/android/os/UserHandle.java
public static final int PER_USER_RANGE = 100000;

public static int getUid(@UserIdInt int userId, @AppIdInt int appId) {
    if (MU_ENABLED && appId >= 0) {
        return userId * PER_USER_RANGE + (appId % PER_USER_RANGE);
```

AAOS 교육 자료(source.android.com에 공개된 Car Framework Core PDF)도 같은 식을 적는다.

> "UID != User ID : uid = fn(userid, appid) = 100,000 * userid + appid"
>
> [Car framework core](https://source.android.com/docs/automotive/car-framework-core) (PDF)

appId는 UID에서 사용자 번호를 제외한 앱, 구성요소 번호다. 같은 기기의 같은 패키지라면 사용자마다 appId가 같고, 뒤에서 볼 sharedUserId 패키지들은 이 번호도 공유한다. 아래 목록에서 먼저 볼 범주는 두 가지다.

- **고정 번호(10000 미만)**: 시스템 구성요소용으로 소스에 정해져 있다(`system/core/libcutils/include/private/android_filesystem_config.h`). `AID_SYSTEM 1000`, `AID_BLUETOOTH 1002`, `AID_WIFI 1010`, `AID_MEDIA_EX 1040`(미디어 추출기), `AID_VEHICLE_NETWORK 1054`(VHAL), `AID_SHELL 2000`(adb 셸) 같은 것들이다.
- **설치할 때 받는 번호(10000~19999)**: 일반 앱은 설치할 때 PackageManager가 이 범위에서 빈 번호를 준다(`AID_APP_START 10000`, `AID_APP_END 19999`). 결과는 `/data/system/packages.list`에 남는다.

```text
$ grep ... /data/system/packages.list
com.google.android.tts    10218 ... default:targetSdkVersion=36:partition=product ...
android.car.usb.handler   10156 ... platform:privapp:targetSdkVersion=33:partition=system ...
com.android.bluetooth     1002  ... bluetooth:privapp:targetSdkVersion=35:partition=system ...
com.android.car           1000  ... platform:privapp:targetSdkVersion=33:partition=system ...
com.android.car.settings  1000  ... platform:privapp:targetSdkVersion=33:partition=system ...
```

두 번째 열이 appId다. `platform:privapp:...` 칸은 서명 종류와 설치 위치인데, SELinux 도메인을 고를 때 다시 나온다.

### 사용자별 UID

Android는 기기 하나를 여러 사람이 쓸 수 있게 사용자(user)를 나눈다. 사용자 0은 시스템 사용자다. 이 에뮬레이터는 사용자 0이 백그라운드에서 시스템 일만 하고 실제 운전자는 사용자 10으로 쓰는 구성이라(headless system user mode, `ro.fw.mu.headless_system_user=true`) 두 사용자가 동시에 떠 있다.

같은 앱이 두 사용자에서 돌면 UID가 다르다. PID 열은 부팅할 때마다 바뀌는 값이다.

```text
$ ps -A -o USER,UID,PID,NAME
u0_a226         10226   1622 com.android.providers.media.module
u10_a226      1010226   2091 com.android.providers.media.module
system           1000   1269 com.android.car
u10_system    1001000   1126 com.android.car
u10_bluetooth 1001002   1345 com.android.bluetooth
```

`u10_a226`은 "사용자 10의 앱 226"이라는 뜻이다. appId는 10000+226=10226이고 UID는 10×100000+10226=1010226이다. system UID 앱도 같은 계산을 따른다. 사용자 10의 `com.android.car` 프로세스가 1001000인데, 이 프로세스에서 도는 것은 사용자별 일을 맡는 CarPerUserService다. CarService 본체(`.CarService`)는 매니페스트에 `android:singleUser="true"`가 있어 사용자 0에서 UID 1000으로만 돈다.

AAOS 교육 자료의 사용자 관리 슬라이드가 이 계산식과 차의 사용자 구성을 한 장에 정리한다.

![Users in Cars: UID 계산식과 headless system user](/blog/aaos-explainer/carfw-s26.png)

*출처: Google, "Car Framework Core"(Google Automotive Partner Bootcamp 자료) 26쪽 "User Management in Cars". [source.android.com/docs/automotive/car-framework-core](https://source.android.com/docs/automotive/car-framework-core)*

왼쪽 글에 "UID != User ID : uid = fn(userid, appid) = 100,000 * userid + appid"와 "In AAOS, user 0 is started first and then the current user is switched to user 10"이 있다. 오른쪽 그림은 같은 패키지 A가 사용자 0에서는 UID 012345, 사용자 1에서는 112345로 도는 모습이다. 위의 미디어 제공자 앱(10226, 1010226)이 정확히 그 경우다. 그림 속 데이터 디렉토리 표기는 두 사용자 모두 `data/user.1/`로 적혀 있는데, 기기의 실제 경로는 `/data/user/0/...`과 `/data/user/10/...`처럼 사용자마다 다르다.

그런데 같은 슬라이드는 "The System Server, Car Service and native services run in their own processes under the system UID"라고 적는다. system_server와 CarService는 기기에서도 UID 1000으로 돈다. 네이티브 서비스는 다르다. VHAL은 `vehicle_network`(1054), Wi-Fi 데몬은 `wifi`(1010)처럼 각자 UID가 따로 있다. 공격 경로를 따질 때는 "system UID"로 뭉뚱그리지 말고 프로세스마다 실제 UID를 봐야 한다.

같은 앱이 사용자마다 다른 UID로 돌고 데이터 디렉토리도 따로 갖는다. 그래서 처음에는 리눅스 user namespace처럼 사용자마다 격리된 공간을 만드는 기능이라고 생각했다. 실제 동작은 다르다. user namespace에서는 커널이 UID를 번역한다. 컨테이너 안에서 10226으로 보이는 프로세스가 바깥에서는 다른 번호로 기록된다. Android 다중 사용자에는 이런 번역이 없다. UID 공간을 사용자마다 10만 개씩 잘라 쓸 뿐이어서, 사용자 10의 앱은 자기 UID를 1010226으로 보고 커널도 그 값을 그대로 쓴다. 커널에게 1010226과 10226은 그냥 다른 사용자다. 사용자 사이의 경계는 이 UID 차이에 사용자별 데이터 디렉토리(`/data/user/0/...`, `/data/user/10/...`)와 SELinux 사용자 카테고리가 더해져 만들어진다.

### sharedUserId

앱이 매니페스트에 `android:sharedUserId="..."`를 선언하면, 같은 이름을 선언하고 같은 키로 서명된 앱들이 **UID 하나를 같이 쓴다.** 이 앱들은 자기만의 UID를 따로 갖지 않고 처음부터 그 공유 UID로 설치된다. 그래서 위 `packages.list`에서 `com.android.car`와 `com.android.car.settings`는 둘 다 1000이다.

> "if this attribute is set to the same value for two or more apps, they all share the same ID, provided that their certificate sets are identical. Apps with the same user ID can access each other's data and, if desired, run in the same process."
>
> [`<manifest>` 요소, `android:sharedUserId`](https://developer.android.com/guide/topics/manifest/manifest-element)

`dumpsys package`의 shared user 목록을 보면 이 에뮬레이터에서 `android.uid.system`(appId 1000)을 쓰는 패키지는 13개다.

```text
SharedUser [android.uid.system] (ac1b61c):
    appId=1000
    Packages
      com.android.car.developeroptions/1000
      com.android.providers.settings/1000
      com.android.server.telecom/1000
      com.android.car.cluster.osdouble/1000
      com.android.localtransport/1000
      com.android.inputdevices/1000
      android/1000
      com.android.emulator.multidisplay/1000
      com.android.car.settings/1000
      com.android.location.fused/1000
      com.google.android.car.networking.preferenceupdater/1000
      com.android.keychain/1000
      com.android.car/1000
```

`android`는 프레임워크 자체(`framework-res.apk`)다. 이 13개 패키지는 system appId(1000)를 공유한다. 같은 Android 사용자에서 실행되면 전체 UID도 같아서 파일의 소유자 권한(DAC)과 그 UID에 부여된 Android 권한을 함께 쓴다. 다만 사용자 0의 UID 1000과 사용자 10의 UID 1001000은 구분해야 하고, 전체 UID가 같더라도 SELinux 도메인에 따라 접근이 더 제한될 수 있다. 공격자는 이 중 하나에서 코드를 실행하면 해당 사용자의 system UID 프로세스에서 실행하는 셈이지만, 다른 도메인의 권한까지 자동으로 얻지는 않는다. 차량 전용 앱 중에서는 CarSettings와 CarService가 여기에 있어서 공개 AAOS 취약점에서 CarSettings 버그는 대부분 권한 상승으로 매겨졌다. 이 글에서 공개 AAOS 취약점은 Android Automotive OS 보안 공지(Update Bulletin)에 실린 CVE 가운데 AAOS 전용 코드(CarSettings, CarService 같은 차량 앱과 서비스)에서 나온 36개를 모아, CVE 설명과 수정 커밋으로 분류한 목록이다.

목록에 `com.android.car.developeroptions`도 있다. 폰 Settings를 복사해 만든 CarDeveloperOptions이고 과거에 폰 Settings의 버그를 그대로 물려받아 CVE 7개가 나온 앱이다.

같은 문서는 `sharedUserId`가 API 29(Android 10)부터 폐기(deprecated)됐다고 적는다("This constant is deprecated as of API level 29"). API 33(Android 13)에는 `sharedUserMaxSdkVersion` 속성이 추가됐다. 이 값을 적은 앱은 그보다 높은 SDK 버전의 기기에 새로 설치될 때 공유 UID를 쓰지 않는다. 다만 "Existing apps can't remove this value, as migrating off a shared user ID isn't supported"라서, 이미 공유 UID로 나간 시스템 앱들은 계속 쓴다. 위 13개도 그렇게 남아 있다.

---

## 권한

UID로 갈라놓으면 "앱끼리는 서로 못 건드린다"까지는 된다. 하지만 앱은 위치, 연락처, 차량 속도처럼 시스템이 가진 기능도 써야 한다. 이를 위해 Android는 권한(permission)이라는 문자열 이름표를 만들었다. 앱은 매니페스트에 `<uses-permission android:name="..."/>`로 필요한 권한을 적고, 시스템은 조건이 맞으면 그 앱의 UID에 권한을 준다. 기능을 제공하는 서비스는 요청이 올 때마다 "호출한 UID가 이 권한을 받았나"를 확인한다.

### 권한을 정의하는 쪽

권한도 어떤 패키지가 매니페스트의 `<permission>` 태그로 정의한다. 정의하면서 보호 수준(protectionLevel)을 정한다. 기기에서 직접 보면 이렇다.

```text
$ dumpsys package
  Permission [android.permission.INTERNET]:
    sourcePackage=android
    uid=1000 gids=[3003] type=0 prot=normal|instant
  Permission [android.car.permission.CAR_INFO]:
    sourcePackage=com.android.car.updatable
    uid=10168 gids=[] type=0 prot=normal
  Permission [android.car.permission.CAR_SPEED]:
    sourcePackage=com.android.car.updatable
    uid=10168 gids=[] type=0 prot=dangerous
  Permission [android.car.permission.CONTROL_CAR_CLIMATE]:
    sourcePackage=com.android.car.updatable
    uid=10168 gids=[] type=0 prot=signature|privileged
```

인터넷 권한의 `gids=[3003]`이 눈에 띈다. 일부 권한은 받으면 그 UID에 리눅스 supplementary group을 더해준다. `INTERNET`은 `inet` 그룹(3003)과 묶여 있고, 매핑은 `/system/etc/permissions/platform.xml`에 있다.

```xml
<permission name="android.permission.INTERNET" >
    <group gid="inet" />
</permission>
```

일반 앱(TTS, UID 1010218)의 그룹을 보면 실제로 3003이 들어 있다.

```text
$ cat /proc/<tts_pid>/status
Uid:    1010218 1010218 1010218 1010218
Groups: 3003 20218 50218 1009997
```

예전 커널은 이 그룹으로 소켓 생성을 막았다. 지금은 막는 곳이 바뀌었다. Android 13~15 소스에서는 Connectivity 모듈이 커널에 올리는 BPF 프로그램(커널이 검증한 뒤 커널 안에서 실행하는 작은 프로그램, `inet_socket_create`)이 UID별 권한 표(`uid_permission_map`)를 보고 INTERNET이 없는 앱의 소켓 생성을 거부한다. 모든 기기가 공유하는 Google 공통 커널(GKI) 중 Android 15용 리눅스 6.6 브랜치(`android15-6.6`)의 네트워크, 보안 코드에는 그룹 3003으로 막는 검사가 없다. 어느 쪽이든 네트워크 접근은 Binder 권한 검사가 아니라 커널 소켓 계층에서 걸린다.

뒤의 세 그룹은 캐시 표시와 공유 자원 접근에 쓰인다. 20218은 앱의 캐시 데이터를 표시하는 그룹이고, 50218은 같은 앱이 모든 사용자에서 똑같이 받는 공유 그룹이라 사용자 번호가 붙지 않는다(`getSharedAppGid(getAppId(uid))`). 1009997은 사용자 10의 모든 앱이 함께 갖는 그룹(`AID_EVERYBODY` 9997)이다(`android_filesystem_config.h`, `ProcessList.computeGidsForProcess`).

보호 수준별로 받는 조건은 이렇다.

- **normal**: 매니페스트에 적기만 하면 설치할 때 준다. `CAR_INFO`(제조사, 모델 같은 기본 정보)가 여기에 속한다.
- **dangerous**: 매니페스트에 적고, 실행 중에 앱이 요청해서 사용자가 대화상자에서 허용해야 준다. `CAR_SPEED`가 여기에 속한다.
- **signature**, **privileged**: 아래에서 따로 설명한다. `signature|privileged`는 둘 중 하나만 만족하면 된다는 뜻이다. 단, privileged 앱이 `android`나 CarService 패키지가 정의한 이 권한을 받을 때는 서명이 맞아도 allowlist가 추가로 필요하다(아래 privileged 절).

개발자 문서는 같은 구분을 설치 시 권한(install-time, normal과 signature), 실행 중 권한(runtime, 곧 dangerous), 특수 권한(special)으로 나눠 설명한다.

> "These permissions allow access to data and actions that extend beyond your app's sandbox but present very little risk to the user's privacy and the operation of other apps. The system assigns the normal protection level to normal permissions."
>
> "Runtime permissions, also known as dangerous permissions, give your app additional access to restricted data or let your app perform restricted actions that more substantially affect the system and other apps."
>
> [Permissions on Android](https://developer.android.com/guide/topics/permissions/overview)

`signature|privileged`라는 표기도 문서에 정의가 있다. signature가 기본 유형이고 privileged는 거기에 붙는 플래그다("a combination of the "signature" base permission type and the "privileged" flag"). 예전 이름 `signatureOrSystem`은 이것의 옛 동의어로, API 23에서 폐기됐다[^3].

권한과 별개로 한 겹 더 있는 검사가 AppOps다[^2]. 일부 민감한 동작(다른 창 위에 그리기, 백그라운드 위치, 사용 기록 읽기 등)은 권한을 받았더라도 AppOps에서 허용/무시/기본을 따로 정한다. 기기에서 보면 이렇다.

```text
$ cmd appops get --user 10 com.google.android.tts SYSTEM_ALERT_WINDOW
SYSTEM_ALERT_WINDOW: default; rejectTime=...
```

권한과 AppOps가 둘 다 통과해야 그 동작이 된다. 서비스를 분석할 때는 권한과 함께 AppOps도 봐야 한다. 공개된 AAOS 취약점에서 가장 많은 부류인 탭재킹(다른 창을 위에 겹쳐 띄워 사용자가 보이지 않는 버튼을 누르게 만드는 공격)이 이 `SYSTEM_ALERT_WINDOW`와 얽혀 있다.

### signature 권한

APK는 개발자의 개인 키로 서명된다. Android는 설치할 때 서명을 검증하고 그 앱의 서명 인증서를 기억해둔다. signature 권한은 앱의 서명 관계를 기준으로 준다. 권한을 정의한 패키지와의 관계뿐 아니라 플랫폼 패키지와의 관계를 허용하는 판정도 있다. 코드는 이렇다.

```java
// services/core/java/com/android/server/pm/permission/PermissionManagerServiceImpl.java
// shouldGrantPermissionBySignature()
        // check if the package is allow to use this signature permission.  A package is allowed to
        // use a signature permission if:
        //     - it has the same set of signing certificates as the source package
        //     ...
        //     - or it shares the above relationships with the system package
        return sourceSigningDetails.hasCommonSignerWithCapability(
                        pkg.getSigningDetails(),
                        SigningDetails.CertCapabilities.PERMISSION)
                || pkg.getSigningDetails().hasAncestorOrSelf(systemPackage.getSigningDetails())
                || systemPackage.getSigningDetails().checkCapability(...);
```

첫 갈래는 권한을 정의한 패키지와의 서명 관계를, 둘째와 셋째 갈래는 시스템 패키지(`android`)와의 관계를 본다. 현재 인증서의 일치만 보는 것이 아니라 서명 이력과 키 회전 때의 신뢰 조건도 확인한다. 코드의 `CertCapabilities.PERMISSION`은 그 서명 관계의 권한 신뢰를 가리키며 리눅스 capability와는 다르다. 개발자 문서의 정의도 앱과 OS 두 경우를 적는다.

> "The system grants a signature permission to an app only when the app is signed by the same certificate as the app or the OS that defines the permission."
>
> [Permissions on Android](https://developer.android.com/guide/topics/permissions/overview)

문서의 "or the OS"가 코드의 둘째, 셋째 갈래다. 이 때문에 **플랫폼 키**, 즉 프레임워크 `android` 패키지를 서명한 키로 서명된 앱은 권한을 정의한 패키지와 서명이 달라도 이 서명 판정을 통과한다. 실제 권한 부여에는 아래의 allowlist 같은 추가 조건도 적용된다. Android 15부터는 user 빌드에서 조건이 하나 붙는다. 플랫폼 키로 서명됐지만 시스템 앱이 아닌 앱이 `android` 패키지의 signature 권한을 받으려면 제조사의 allowlist에 올라 있어야 한다[^4]. userdebug인 이 에뮬레이터에서는 이 조건을 적용하지 않는다. 플랫폼 서명 경로로 권한을 받는 앱의 범위는 제조사가 어떤 앱에 플랫폼 키로 서명했느냐와, 해당 allowlist 조건에 무엇을 올렸느냐에 영향을 받는다.

이 규칙과 관련된 취약점이 CVE-2023-20927이다. 차량 권한은 업데이트 가능한 CarService 패키지가 정의하는데, 이 패키지는 플랫폼 키가 아닌 별도 키로 서명된다. 이 에뮬레이터에서도 `com.android.car`는 `b4addb29`, `com.android.car.updatable`은 `d7f1f224`로 서명이 다르다. 위 판정 코드대로라면 이 패키지가 정의한 signature 권한은 업데이트 가능 패키지와 같은 키로 서명된 앱도 받을 수 있다. 공개된 설명은 "there is a possible way to grant signature permissions due to a permissions bypass"라는 한 줄뿐이라 구체적인 악용 방법은 모른다. 수정 커밋(`198e836b08bb`, "Moved Signature permission to built-in service")은 signature 전용 권한들을 플랫폼 키로 서명된 `com.android.car` 쪽으로 옮기면서 매니페스트에 이 주석을 남겼다.

```xml
<!-- service-builtin/AndroidManifest.xml -->
<!-- Do not add any new permission here.
     Update ../service/AndroidManifest instead (Except signature only permission).
     Signature only permission should be associated with platform signature, not module
     signature. -->
<permission android:name="android.car.permission.BIND_PROJECTION_SERVICE"
     android:protectionLevel="signature" .../>
```

### privileged 권한과 allowlist

privileged 권한은 서명 대신 **설치 위치와 allowlist**로 준다.

> "Privileged apps are system apps located in a priv-app directory on a system image partition."
>
> [Privileged permission allowlisting](https://source.android.com/docs/core/permissions/perms-allowlist)

조건은 세 가지다.

1. 앱이 시스템 이미지에 미리 들어 있다. 사용자가 설치한 앱은 해당하지 않는다.
2. 설치 위치가 privileged 앱 디렉토리다. `/system/priv-app`, `/product/priv-app`, `/system_ext/priv-app` 등이다.
3. 기기의 allowlist XML(`/system/etc/permissions/*.xml`, `/product/etc/permissions/privapp-permissions-*.xml` 등)에 "이 앱에 이 권한"이 적혀 있다.

차 런처(`com.android.car.carlauncher`)가 공조 제어 권한을 받는 과정을 따라가 보면 이렇다.

```text
$ dumpsys package com.android.car.carlauncher
    codePath=/system/priv-app/GASCarLauncher
    privateFlags=[ ... PRIVILEGED ... ]
    signatures=PackageSignatures{... signatures:[b4addb29] ...}
      android.car.permission.CONTROL_CAR_CLIMATE: granted=true

$ grep -n CONTROL_CAR_CLIMATE /system/etc/permissions/com.android.car.carlauncher.xml
32:        <permission name="android.car.permission.CONTROL_CAR_CLIMATE"/>
```

이 런처는 플랫폼 키로도 서명돼 있다. 그래도 이 권한을 받으려면 allowlist가 있어야 한다. lts5 `PermissionManagerServiceImpl`은 install 권한을 줄 때 `bp.isSignature() && (!bp.isPrivileged() || allowlist에 있음)`을 요구한다. 런처는 privileged 앱이고 `CONTROL_CAR_CLIMATE`는 CarService 패키지가 정의한 `signature|privileged` 권한이라 allowlist 검사 대상이다(아래 코드). 위 allowlist 파일의 32행이 실제로 권한을 준 근거다.

allowlist 파일은 앱과 같은 파티션에 있어야 한다("The privapp-permissions.xml file can only grant or deny permissions for privileged apps on the same partition"). 이 규칙에 따라 런처는 `/system/priv-app`에, allowlist는 `/system/etc/permissions`에 있다. 문서는 대상 파티션을 `/system`, `/product`, `/vendor`로 적는데, 이 기기에는 `/system_ext/etc/permissions`에도 allowlist(예: `com.android.carsystemui.xml`)가 있다.

allowlist가 실제로 구속력이 있는지는 `ro.control_privapp_permissions`가 정한다. 이 기기의 값은 `enforce`다. 문서는 allowlist를 채우지 않았을 때의 결과를 이렇게 적는다.

> "As of Android 9, implementors can explicitly grant or deny all privileged permissions. If privileged permissions are not granted, the device won't boot."
>
> [Privileged permission allowlisting](https://source.android.com/docs/core/permissions/perms-allowlist)

AAOS 교육 자료에는 차량 권한으로 든 예와 실제 오류 메시지가 있다. allowlist 예시가 바로 `CONTROL_CAR_CLIMATE`다.

![Privileged Permissions: privapp-permissions XML 예시](/blog/aaos-explainer/carfw-s23.png)

*출처: Google, "Car Framework Core"(Google Automotive Partner Bootcamp 자료) 23쪽 "Privileged Permissions". [source.android.com/docs/automotive/car-framework-core](https://source.android.com/docs/automotive/car-framework-core)*

슬라이드의 XML 형식이 위에서 기기에서 본 `/system/etc/permissions/com.android.car.carlauncher.xml`과 같다. 아래 `prebuilt_etc`/`android_app` 블록은 제조사가 앱을 빌드할 때 allowlist 파일을 같이 넣는 방법이다. 빠뜨렸을 때는 부팅 중 system_server가 이렇게 죽는다(같은 자료 24쪽).

```text
java.lang.IllegalStateException: Signature|privileged permissions not in
privapp-permissions allowlist: {com.android.car.messenger
(/system/priv-app/CarMessengerApp):
android.car.permission.ACCESS_CAR_PROJECTION_STATUS}
```

([Car framework core](https://source.android.com/docs/automotive/car-framework-core) PDF, "Privileged Permissions" 장)

그런데 모든 privileged 권한이 allowlist를 거치는 건 아니다. 같은 문서의 주석이 범위를 좁힌다.

> "Note: Permissions defined by the core platform (the android package) and CarService (com.android.car.updatable) must be allowlisted. Privileged permissions defined by device manufacturers are automatically granted."

lts5 코드도 그대로다. allowlist 검사 대상은 권한을 정의한 패키지가 `android`이거나 차 기기에서 `ro.android.car.carservice.package`가 가리키는 패키지일 때뿐이다.

```java
// services/core/java/com/android/server/pm/permission/PermissionManagerServiceImpl.java
        mPrivilegedPermissionAllowlistSourcePackageNames.add(PLATFORM_PACKAGE_NAME);
        ...
        if (availableFeatures.containsKey(PackageManager.FEATURE_AUTOMOTIVE)) {
            String carServicePackage = SystemProperties.get("ro.android.car.carservice.package",
                    null);
            if (carServicePackage != null) {
                mPrivilegedPermissionAllowlistSourcePackageNames.add(carServicePackage);
            }
        }
    ...
    private boolean checkPrivilegedPermissionAllowlist(...) {
        ...
        if (!mPrivilegedPermissionAllowlistSourcePackageNames
                .contains(permission.getPackageName())) {
            return true;                       // 그 밖의 패키지가 정의한 권한은 허용 목록 없이 통과
        }
        ...
        // Only enforce the allowlist on boot
        if (!mSystemReady) {
```

코드를 보면 차량 권한(정의 패키지 `com.android.car.updatable`)은 allowlist가 실제로 구속한다. 제조사가 자기 패키지에서 정의한 privileged 권한은 그 권한을 요청한 privileged 앱이면 allowlist 없이 받는다. 제조사가 차량 기능을 자체 권한으로 보호한다면, 그 권한을 가진 앱의 범위는 "그 권한을 요청한 privileged 앱 전부"가 된다. 한편 부팅을 멈추는 처리는 부팅 중(`mSystemReady` 전)에만 한다. 그 뒤에 들어오는 위반은 `enforce` 모드에서 조용히 권한을 주지 않는 것으로 끝난다(함수 끝의 `return !RoSystemProperties.CONTROL_PRIVAPP_PERMISSIONS_ENFORCE;`). 덧붙여 같은 문서 끝 절에는 "Allowlisting is required only for permissions declared by apps with package="android""라는 문장도 남아 있어서 위 주석과 어긋난다. 실제 코드에서는 CarService 패키지가 정의한 권한도 allowlist 대상이다.

이 에뮬레이터에서 `CONTROL_CAR_CLIMATE`를 받은 쪽은 런처, 차량 어시스턴트(`com.google.android.carassistant`), shell, SystemUI, `com.google.uid.shared` shared user다. 여기에 system UID 앱 전부가 더해진다. CarPropertyService가 사용하는 Context 권한 검사 경로에는 system appId를 특례로 허용하는 분기가 있기 때문이다.

### 높은 권한에 닿는 세 경로

사용자가 스토어에서 설치한 일반 앱(서드파티 앱)은 시스템 이미지에 없고 플랫폼 키로 서명되지도 않아서 normal과 dangerous 권한까지만 받는다. 에뮬레이터의 차량 속성 273개마다 CarService가 요구하는 읽기, 쓰기 권한(`CarSvcProps.json`)을 기기의 권한별 보호 수준(`pm list permissions -g -f`)과 맞춰 보면, 쓰기가 허용된 136개는 전부 signature|privileged 권한이 필요하다. 일반 앱이 받을 수 있는 권한으로 쓸 수 있는 속성은 0개다.

딥링크로는 이 벽을 넘지 못한다. 딥링크는 URL 모양의 intent(앱 사이에 주고받는 실행 요청 메시지)로 다른 앱의 화면을 여는 것이다. 열린 화면은 그 앱 자신의 UID와 권한으로 돌지만, 그 권한이 요청을 보낸 앱으로 옮겨오지는 않는다. 그런데 이게 공격 경로 하나의 출발점이 된다. 권한이 높은 앱이 밖에서 받은 intent나 URI를 검사 없이 자기 권한으로 대신 실행해주는 결함을 confused deputy라고 부른다. 공격자는 그런 앱을 거쳐 자기에게 없는 권한으로 동작을 일으킨다.

앱 샌드박스 문서는 샌드박스를 벗어나는 일을 커널 장악으로 설명한다.

> "Generally, to break out of the Application Sandbox in a properly configured device, one must compromise the security of the Linux kernel. However, similar to other security features, individual protections enforcing the app sandbox are not invulnerable ..."
>
> [Application Sandbox](https://source.android.com/docs/security/app-sandbox)

자기 프로세스의 경계를 깨는 것은 그 말대로 커널 문제다. 하지만 아래 세 경로 중 앞의 둘은 샌드박스를 깨지 않고 다른 프로세스가 가진 권한을 그 프로세스의 코드로 빌려 쓴다. 공개 AAOS 취약점 36개 가운데 confused deputy가 7개, caller, 권한 검사 누락이나 우회가 8개이고, 메모리 버그는 2개(heap out-of-bounds read 1, 물리적으로 꽂은 어댑터가 필요한 커널 USB CAN 드라이버의 double free 1)다.

정리하면 일반 앱이 높은 권한에 닿는 길은 세 가지이고, 앞의 둘은 공개 AAOS 취약점에 실제 예가 있다.

1. **권한 있는 앱을 confused deputy로 쓴다.** CVE-2021-1035는 CarSettings(system UID)의 `BluetoothDevicePickerPreferenceController.setLaunchIntent` 결함으로, 공격자가 지정한 broadcast receiver를 system 권한으로 호출하게 만들 수 있었다. CVE-2022-20223은 폰 Settings `AppRestrictionsFragment`의 버그가 복사본인 CarDeveloperOptions에도 남아 있던 경우로, 아무 activity나 system 권한으로 띄워줘서 권한 없이 전화를 걸 수 있었다. 폰 쪽은 2022-07 일반 Android 공지의 System 항목에 실렸고[^5], 차 쪽은 같은 CVE로 2022-12 AAOS 공지에 실렸다[^6]. 공지에는 커밋 링크가 없고, 버그 ID로 찾은 수정은 `packages/services/Car/tests/CarDeveloperOptions`를 고친 `5c5b062147e7`이다.
2. **서비스의 권한 검사가 빠진 곳을 찾는다.** CVE-2025-26418은 CarService의 `CarDevicePolicyService.setUserDisclaimerAcknowledged`에 권한 검사가 없어서 아무 앱이나 관리 기기에서 뜨는 사용자 확인 화면을 건너뛰게 할 수 있었다.
3. **권한을 가진 프로세스 안에서 코드를 실행한다.** memory corruption 버그 등으로 그 프로세스를 장악하면 그 프로세스의 UID, 권한, SELinux 도메인을 그대로 얻는다. 예를 들어 블루투스 앱(`com.android.bluetooth`)은 shared user `android.uid.bluetooth`(appId 1002)로 돌고, `BLUETOOTH_PRIVILEGED`, `MODIFY_PHONE_STATE` 같은 권한과 NET_ADMIN, NET_RAW 같은 리눅스 capability를 가진다. 차량 공지에 실린 네이티브 서비스의 메모리 오류로는 EVS 매니저(외부 카메라 영상을 다루는 네이티브 서비스)의 heap out-of-bounds read(CVE-2021-39677)가 있고, 공지의 분류는 정보 노출(ID)이다. out-of-bounds read는 그 자체로 코드 실행을 주지 않고, exploit chain에서는 주소 같은 정보를 얻는 단계에 쓰인다.

---

## Binder와 system service

권한을 어느 UID에 줬는지까지는 알았다. 다음으로 볼 것은 기능을 제공하는 서비스가 요청자의 UID를 어떻게 아느냐다. 요청 안에 적힌 값을 믿는지, 호출 과정에서 다른 근거를 얻는지에 따라 확인할 코드가 달라진다. Android에서는 이 호출 경로를 Binder가 맡는다.

### system service

앱이 "현재 위치를 알려줘"라고 하면 실제 일은 앱 프로세스가 아니라 위치 서비스가 한다. system service는 특정 인터페이스를 구현한 객체이고 앱과 다른 프로세스에 산다. 대부분은 `system_server`라는 프로세스 하나에 모여 있다. activity(앱 실행과 생명주기), package(설치와 권한), window, location 같은 서비스다. 차량 기능을 제공하는 CarService는 별도 프로세스인 `com.android.car`에 산다. 하드웨어를 다루는 HAL도 각자 프로세스다.

```text
$ ps -A -o LABEL,USER,UID,PID,PPID,NAME
u:r:system_server:s0       system          1000  708  416 system_server
u:r:carservice_app:s0      system          1000 1269  416 com.android.car
u:r:hal_vehicle_default:s0 vehicle_network 1054  222    1 android.hardware.automotive.vehicle@V3-emulator-service
```

앱이 이런 객체의 메서드를 부르려면 프로세스 경계를 넘어야 한다.

> "On Android, one process can't normally access the memory of another process. To talk, they need to decompose their objects into primitives that the operating system can understand and marshall the objects across that boundary for you."
>
> [Android Interface Definition Language (AIDL)](https://developer.android.com/develop/background-work/services/aidl)

이 프로세스 간 호출 장치가 Binder다. 커널 드라이버(`/dev/binder`)와 user space 라이브러리(`libbinder`)로 이뤄진다. 서비스 쪽 프로세스는 요청을 받는 Binder 스레드를 여러 개 띄워두고 기다린다. 이 에뮬레이터의 `system_server`에 실제로 떠 있는 Binder 스레드는 32개다. 문서도 원격 호출이 이 스레드 풀에서 동시에 들어온다고 적는다("Calls from a remote process are dispatched from a thread pool the platform maintains inside your own process. Be prepared for incoming calls from unknown threads, with multiple calls happening at the same time."). 서비스 코드가 이 동시성을 잘못 다루면 race condition 버그가 된다.

### 서비스 매니저

앱은 `system_server` 안의 어느 객체가 위치 서비스인지 모른다. 이름과 객체를 이어주는 등록소가 따로 있다. `servicemanager`라는 프로세스다(UID system, 도메인 `servicemanager`). Binder에서 handle 0번은 항상 이 프로세스를 가리키므로 어떤 프로세스든 처음부터 이것에는 말을 걸 수 있다.

- 서비스 쪽은 시작할 때 `addService("이름", 객체)`로 등록한다. CarService는 `car_service`라는 이름으로 등록한다.
- 앱 쪽은 `getService("이름")`으로 그 객체의 Binder 참조를 받는다.

등록된 목록은 `service list`로 볼 수 있다. 내가 이 에뮬레이터에서 셌을 때는 288개였다.

```text
$ service list
5	activity: [android.app.IActivityManager]
26	android.hardware.automotive.vehicle.IVehicle/default: [android.hardware.automotive.vehicle.IVehicle]
98	car_service: [android.car.ICar]
199	package: [android.content.pm.IPackageManager]
```

대괄호 안은 그 객체가 구현한 인터페이스 이름이다. 서비스 매니저는 등록과 조회 요청이 올 때 SELinux 정책으로 "이 프로세스가 이 이름을 등록하거나 조회해도 되나"를 확인한다(`frameworks/native/cmds/servicemanager/Access.cpp`의 `canAdd`, `canFind`). 이름마다 label을 붙이는 파일이 `service_contexts`다.

> "service_contexts assigns labels to Android binder services to control what processes can add (register) and find (lookup) a binder reference for the service. This configuration is read by the servicemanager process during startup."
>
> [Implementing SELinux](https://source.android.com/docs/security/features/selinux/implement)

일반 앱 identity는 이렇게 만들었다. root 셸에서 `su 1010218`로 UID를 TTS 앱 것으로 바꾸고 셸 자신의 SELinux context를 `/proc/self/attr/current`에 써서 `untrusted_app`으로 바꿨다. 실제 앱 프로세스는 아니지만 서비스 매니저와 CarService가 보는 caller UID와 SELinux context는 실제 일반 앱과 같다. 이 절의 일반 앱 실험은 모두 이 identity로 했다.

이 일반 앱 identity로 조회해보면 `car_service`는 찾지만 VHAL은 못 찾는다.

```text
$ service check car_service
Service car_service: found
$ service check android.hardware.automotive.vehicle.IVehicle/default
Service android.hardware.automotive.vehicle.IVehicle/default: not found

$ logcat -d | grep avc
SELinux: avc:  denied  { find } for pid=4804 uid=1010218 name=android.hardware.automotive.vehicle.IVehicle/default scontext=u:r:untrusted_app:s0:c218,c256,c522,c768 tcontext=u:object_r:hal_vehicle_service:s0 tclass=service_manager permissive=0
```

이 거부는 커널이 아니라 servicemanager가 판정해서 logcat(`SELinux` 태그)과 event log에 쓴다. 그래서 `dmesg`가 아니라 logcat에서 찾는다.

### AIDL

Binder로 무엇을 부를 수 있는지는 AIDL(Android Interface Definition Language) 파일로 정의한다. `car_service`가 구현하는 `android.car.ICar`의 실제 정의는 이렇다.

```java
// packages/services/Car/car-lib/src/android/car/ICar.aidl
interface ICar {
    oneway void setSystemServerConnections(in ICarServiceHelper helper,
        in ICarResultReceiver receiver) = 0;

    // Rest of the calls are used for Apps to CarService communication
    @nullable IBinder getCarService(in String serviceName) = 11;
    int getCarConnectionType() = 12;
    boolean isFeatureEnabled(in String featureName) = 13;
    int enableFeature(in String featureName) = 14;
    int disableFeature(in String featureName) = 15;
    List<String> getAllEnabledFeatures() = 16;
    ...
}
```

빌드할 때 AIDL 컴파일러가 이 파일로 두 클래스를 만든다("This interface has an inner abstract class named Stub"). 앱 쪽 Proxy는 메서드 호출을 바이트열로 바꿔서 보내고, 서비스 쪽 Stub은 받은 바이트열을 풀어서 실제 구현(`ICarImpl.getCarConnectionType()` 등)을 부른다.

AOSP 문서에는 공격자 입장에서 눈여겨볼 문장이 하나 있다.

> "AIDL can be used between any process in Android: between platform components or between apps. However, it is never used as an API for apps."
>
> [AIDL overview](https://source.android.com/docs/core/architecture/aidl)

`ICar`도 소스에 `/** @hide */`가 붙은 내부 인터페이스라서 SDK 문서에는 없고, 앱 개발자는 `Car`, `CarPropertyManager` 같은 Java API만 쓴다. 하지만 앱용 API가 아니라는 건 문서상 약속일 뿐 접근을 통제하지는 않는다. 아래 실험처럼 일반 앱 identity로 `car_service`의 Binder 메서드를 직접 부를 수 있다. 보안 경계는 공개 API가 아니라 AIDL 메서드 하나하나에 있다. 메서드마다 트랜잭션 코드라는 번호가 붙는데, `= 12`처럼 번호를 적은 경우 코드는 `FIRST_CALL_TRANSACTION`(1)+12=13이다. 결국 앱이 보내는 건 "코드 13번, 인자는 이것"이라는 메시지다.

`getCarService`는 이름을 받아서 또 다른 Binder 객체를 돌려준다. 앱은 서비스 매니저에서 `car_service` 하나만 받고 차량 속성, 오디오, 전원 같은 세부 서비스는 이 메서드로 받는다.

### Parcel

메서드 인자와 반환값을 담는 직렬화 형식이 Parcel이다.

> "Container for a message (data and object references) that can be sent through an IBinder. A Parcel can contain both flattened data ... and references to live IBinder objects that will result in the other side receiving a proxy IBinder connected with the original IBinder in the Parcel. Parcel is not a general-purpose serialization mechanism."
>
> [Parcel](https://developer.android.com/reference/android/os/Parcel)

값만이 아니라 Binder 객체 참조도 실린다는 점이 중요하다. `getCarService("property")`의 응답에는 속성 서비스 객체의 참조가 들어 있고, caller는 그것을 프록시(`BinderProxy`) 객체로 받아 다시 호출한다.

배치를 보면 모든 값은 4바이트 단위로 정렬된다. 정수는 4바이트이고 문자열(String16)은 "글자 수 4바이트 + UTF-16 글자들 + 끝 표시 0 + 4바이트 맞춤"이다.

- **요청 Parcel**은 맨 앞에 인터페이스 토큰이 온다. `Parcel::writeInterfaceToken`을 보면 StrictMode 정책 4바이트, 작업 출처 UID 4바이트, `SYST` 헤더 4바이트, 그리고 인터페이스 이름 문자열(`android.car.ICar`) 순서다. 서비스는 이 이름이 자기 인터페이스와 맞는지 먼저 보고 그 뒤에 인자를 순서대로 읽는다.
- **응답 Parcel**은 맨 앞에 예외 코드 4바이트가 온다. 0(`EX_NONE`)이면 정상이고 -1(`EX_SECURITY`)이면 권한 거부 같은 보안 예외다. 그 뒤에 반환값이 온다.

`service call` 명령은 셸에서 트랜잭션을 직접 보내고 응답 Parcel을 16진수로 보여준다. 일반 앱 identity로 `car_service`에 두 번 보내봤다.

```text
$ service call car_service 13          # getCarConnectionType()
Result: Parcel(00000000 00000005   '........')
```

`00000000`은 예외 없음, `00000005`는 반환값 5다. 소스에 `Car.CONNECTION_TYPE_EMBEDDED = 5`, 즉 "차에 내장된 Android"라는 값으로 정의돼 있다.

```text
$ service call car_service 17          # getAllEnabledFeatures()
Result: Parcel(
0x00000000: ffffffff 00000034 00650072 00750071 '....4...r.e.q.u.'
0x00000010: 00720069 00730065 00610020 0064006e 'i.r.e.s. .a.n.d.'
0x00000020: 006f0072 00640069 0063002e 00720061 'r.o.i.d...c.a.r.'
0x00000030: 0070002e 00720065 0069006d 00730073 '..p.e.r.m.i.s.s.'
0x00000040: 006f0069 002e006e 004f0043 0054004e 'i.o.n...C.O.N.T.'
0x00000050: 004f0052 005f004c 00410043 005f0052 'R.O.L._.C.A.R._.'
0x00000060: 00450046 00540041 00520055 00530045 'F.E.A.T.U.R.E.S.'
0x00000070: 00000000 00000000                   '........        ')
```

`ffffffff`는 -1, 즉 `SecurityException`이다. 이어서 글자 수 `0x34`(52)와 메시지 "requires android.car.permission.CONTROL_CAR_FEATURES"가 UTF-16으로 들어 있다. 이 권한은 signature|privileged다. 같은 호출을 root 셸(UID 0)에서 보내면 결과가 달라진다.

```text
$ service call car_service 17          # root 셸에서
Result: Parcel(
0x00000000: 00000000 00000022 0000000a 00720070 '....".......p.r.'
0x00000010: 006a006f 00630065 00690074 006e006f 'o.j.e.c.t.i.o.n.'
0x00000020: 00000000 0000000d 00610063 005f0072 '........c.a.r._.'
...
```

예외 없음(0), 목록 길이 `0x22`(34개), 첫 항목 "projection"(10글자), 둘째 항목 "car_bluetooth"(13글자) 순서로 읽힌다.

### calling identity

같은 호출의 결과가 달랐던 건 CarService가 "누가 불렀나"를 알기 때문이다. 그런데 이 정보는 Parcel 안에 없다. 커널 Binder 드라이버가 트랜잭션을 만들 때 보낸 프로세스의 UID를 직접 적는다.

```c
// kernel/common (android15-6.6) drivers/android/binder.c, binder_transaction()
	t->from_pid = proc->pid;
	t->from_tid = thread->pid;
	t->sender_euid = task_euid(proc->tsk);
```

callee의 libbinder는 이 값을 스레드별 변수에 저장해두고, 서비스 코드는 `Binder.getCallingUid()`로 꺼내 쓴다.

```cpp
// frameworks/native/libs/binder/IPCThreadState.cpp, executeCommand()의 BR_TRANSACTION 처리
            mCallingPid = tr.sender_pid;
            ...
            mCallingUid = tr.sender_euid;
```

> "Return the Linux UID assigned to the process that sent you the current transaction that is being processed. This UID can be used with higher-level system services to determine its identity and check permissions."
>
> [Binder.getCallingUid()](https://developer.android.com/reference/android/os/Binder)

보내는 쪽이 Parcel 내용을 아무리 꾸며도 이 UID는 바꿀 수 없다. 반대로 Parcel에 들어 있는 값, 예를 들어 인자로 넘긴 패키지 이름이나 사용자 번호는 보내는 쪽 마음대로다. 서비스가 인자로 받은 패키지 이름을 caller UID와 대조하지 않고 그대로 믿으면 그게 버그가 된다.

PID는 다르다. 같은 참조 문서가 `getCallingPid()`에 대해 이렇게 경고한다.

> "Warning do not use this as a security identifier! PID is unreliable as it may be re-used. This should mostly be used for debugging. oneway transactions do not receive PID. Even if you expect a transaction to be synchronous, a misbehaving client could send it as a asynchronous call and result in a 0 PID here."

`oneway`는 응답을 기다리지 않는 호출이다("When it is used, a remote call does not block. It sends the transaction data and immediately returns."). caller가 동기 메서드도 `oneway` 플래그를 붙여 보내면 서비스가 보는 PID는 0이 된다. PID로 caller를 판단하는 서비스 코드는 그 자체로 확인할 지점이다. 아래에 나올 `checkComponentPermission`처럼 PID를 비교하는 코드도 있으니 PID가 0이거나 재사용된 경우 결과가 어떻게 되는지까지 따져야 한다.

### callee의 권한 검사

Binder가 전한 UID를 어떤 메서드의 권한 검사에 쓸지는 서비스가 정한다. Binder 호출 자체의 SELinux 검사와는 다른 층이다. 위 실험에서 `getCarConnectionType`은 허용되고 `getAllEnabledFeatures`는 거부된 차이는 서비스 코드에서 나온다.

```java
// packages/services/Car/service/src/com/android/car/ICarImpl.java
    public int getCarConnectionType() {
        return Car.CONNECTION_TYPE_EMBEDDED;
    }
    ...
    public List<String> getAllEnabledFeatures() {
        // permission check inside the controller
        return mFeatureController.getAllEnabledFeatures();
    }
```

앞의 것은 차량 연결 유형을 별도 권한 검사 없이 돌려주고, 뒤의 것은 안쪽 컨트롤러에서 검사한다. 보호해야 할 메서드에서 필요한 검사가 빠지면, 그 서비스 참조를 얻어 호출할 수 있는 클라이언트에게 동작이 노출될 수 있다. 앞에서 본 CVE-2025-26418이 그런 경우다. 다만 검사 없는 메서드가 모두 취약한 것도, 모든 앱이 곧바로 호출할 수 있는 것도 아니다. 그러니 서비스를 분석할 때는 AIDL 메서드 목록을 펼쳐놓고 메서드마다 어떤 검사가 있는지 확인하는 게 기본 작업이 된다.

### checkCallingOrSelfPermission과 clearCallingIdentity

서비스가 권한을 확인할 때 쓰는 함수 중 이름이 비슷한 두 개가 있다. 구현을 보면 차이가 분명하다.

```java
// frameworks/base/core/java/android/app/ContextImpl.java
    public int checkCallingPermission(String permission) {
        ...
        int pid = Binder.getCallingPid();
        if (pid != Process.myPid()) {
            return checkPermission(permission, pid, Binder.getCallingUid());
        }
        return PackageManager.PERMISSION_DENIED;
    }

    public int checkCallingOrSelfPermission(String permission) {
        ...
        return checkPermission(permission, Binder.getCallingPid(),
                Binder.getCallingUid());
    }
```

`checkCallingPermission`은 caller가 자기 자신이면, 즉 Binder 요청을 처리하는 중이 아니면 거부한다. `checkCallingOrSelfPermission`은 그런 구분 없이 지금 `getCallingUid()`가 돌려주는 UID를 그대로 검사한다. 참조 문서도 둘의 차이를 이렇게 설명하고 뒤의 것에는 주의 문구를 붙여뒀다.

> checkCallingPermission: "One important difference is that if you are not currently processing an IPC, this function will always fail. This is done to protect against accidentally leaking permissions; you can use checkCallingOrSelfPermission(String) to avoid this protection."
>
> checkCallingOrSelfPermission: "This is the same as checkCallingPermission(String), except it grants your own permissions if you are not currently processing an IPC. Use with care!"
>
> [Context](https://developer.android.com/reference/android/content/Context)

그럼 Binder 요청을 처리하는 중이 아닐 때 `getCallingUid()`는 무엇을 돌려줄까. 참조 문서는 "If the current thread is not currently executing an incoming transaction, then its own UID is returned."라고 적는다. 코드로 보면 libbinder가 요청이 없을 때 caller 칸을 자기 프로세스 값으로 채운다.

```cpp
// IPCThreadState.cpp
void IPCThreadState::clearCaller()
{
    mCallingPid = getpid();
    mCallingSid = nullptr;  // expensive to lookup
    mCallingUid = getuid();
}
```

"calling identity를 지운다"는 것도 이 함수를 쓰는 일이다. 서비스가 남의 요청을 처리하다가 같은 프로세스 안의 다른 객체를 부르고, 그쪽 권한 검사를 자기 identity로 받아야 할 때 `Binder.clearCallingIdentity()`를 부른다. 그러면 지금의 caller UID를 토큰에 보관하고 `clearCaller()`로 caller 칸을 자기 UID로 바꾼다. 일이 끝나면 `restoreCallingIdentity(token)`로 되돌린다. 다른 프로세스로 보내는 Binder 요청에는 커널이 보내는 프로세스의 UID를 채우므로, 그쪽은 이 함수와 상관없이 서비스 자신의 UID를 본다.

> "Reset the identity of the incoming IPC on the current thread. This can be useful if, while handling an incoming call, you will be calling on interfaces of other objects that may be local to your process and need to do permission checks on the calls coming into them (so they will check the permission of your own local process, and not whatever process originally called you)."
>
> [Binder.clearCallingIdentity()](https://developer.android.com/reference/android/os/Binder)

문서는 이 함수의 용도만 설명하고 "호출자 검사는 지우기 전에 끝내라"는 순서는 따로 적지 않는다. 그 순서는 코드가 지켜야 한다. CarService의 올바른 사용 예는 이렇다.

```java
// packages/services/Car/service/src/com/android/car/CarOccupantZoneService.java
    public int assignVisibleUserToOccupantZone(int occupantZoneId, UserHandle user) {
        CarServiceUtils.assertAnyPermission(mContext, android.Manifest.permission.MANAGE_USERS,
                Car.PERMISSION_MANAGE_OCCUPANT_ZONE);           // 1. 호출자 권한 확인
        Preconditions.checkNotNull(user);
        long token = Binder.clearCallingIdentity();             // 2. 내 신분으로 전환
        try {
            return assignVisibleUserToOccupantZoneUnchecked(occupantZoneId, user);  // 3. 실제 작업
        } finally {
            Binder.restoreCallingIdentity(token);               // 4. 원래대로
        }
    }
```

2번 뒤에 1번을 하면 검사는 CarService 자신의 UID로 이뤄진다. CarService는 system UID이고, system UID는 검사를 무조건 통과한다. 권한 판정 경로를 끝까지 따라가면 그 지점이 나온다.

```java
// frameworks/base/services/core/java/com/android/server/am/ActivityManagerService.java
    public static int checkComponentPermission(..., int pid, int uid, ...) {
        if (pid == MY_PID) {
            return PackageManager.PERMISSION_GRANTED;
        }
        ...
        return ActivityManager.checkComponentPermission(permission, uid, deviceId,
                owningUid, exported);

// frameworks/base/core/java/android/app/ActivityManager.java
    public static int checkComponentPermission(String permission, int uid, int deviceId,
            int owningUid, boolean exported) {
        // Root, system server get to do everything.
        if (canAccessUnexportedComponents(uid)) {
            return PackageManager.PERMISSION_GRANTED;
        }
    ...
    public static boolean canAccessUnexportedComponents(int uid) {
        final int appId = UserHandle.getAppId(uid);
        return (appId == Process.ROOT_UID || appId == Process.SYSTEM_UID);
    }
```

appId가 0(root)이거나 1000(system)이면 권한 이름을 보지도 않고 허용한다. 위에서 root 셸의 `getAllEnabledFeatures`도 이 줄에서 통과했다.

같은 문제는 다른 모양으로도 생긴다. caller 칸은 프로세스가 아니라 스레드에 붙어 있어서, 검사가 어느 스레드에서 어떤 상태로 불리느냐에 따라 판정에 쓰이는 UID가 달라진다.

- **Handler 스레드에서 검사할 때**: 서비스가 Binder 스레드에서 받은 요청을 내부 작업 스레드(Handler)로 넘긴 뒤 거기서 검사하면, 그 스레드에는 처리 중인 Binder 요청이 없으므로 `getCallingUid()`가 서비스 자신의 UID를 돌려준다.
- **같은 프로세스 안의 AIDL 메서드를 그대로 부를 때**: 로컬 호출은 부른 스레드에서 그대로 실행되므로("Calls made from the local process execute in the same thread that is making the call.", AIDL 문서), 앱의 요청을 처리하던 Binder 스레드에서 부르면 불린 쪽 검사도 앱의 UID를 본다.
- **identity를 지운 뒤 부를 때**: 부른 쪽이 먼저 `clearCallingIdentity()`를 했으면 불린 쪽 검사는 서비스 자신의 UID로 판정된다.

CarService처럼 서비스 수십 개가 한 프로세스에 있으면 셋째 경우, 즉 한 서비스가 identity를 지운 채 다른 서비스의 메서드를 직접 부르는 경로가 생긴다. 불린 서비스가 `checkCallingOrSelfPermission` 꼴로 검사하면 그 검사는 system UID로 통과한다.

차에서는 이 점이 특히 중요하다. CarService는 차량 속성 권한을 바로 이런 검사(아래 `checkCallingOrSelfPermission`)로 확인하고, AAOS 교육 자료는 차량 API의 권한 검사가 모두 CarService 안에서 이뤄진다고 적는다[^7].

```java
// packages/services/Car/service/src/com/android/car/hal/property/PropertyPermissionInfo.java
    public static final class SinglePermission implements PermissionCondition {
        ...
        public boolean isMet(Context context) {
            return context.checkCallingOrSelfPermission(mPermission)
                    == PackageManager.PERMISSION_GRANTED;
        }
```

이 검사가 올바르게 동작하려면 "Binder 스레드에서, calling identity를 지우기 전에" 불려야 한다.

---

## 앱 component와 intent

지금까지는 프로세스 사이를 Binder로 직접 부르는 길을 봤다. 앱끼리는 그보다 느슨한 길도 쓴다. component와 intent다. 공개 AAOS 취약점 36개 가운데 22개(구성요소를 추정한 2개 포함)가 CarSettings라는 앱 하나에서 나왔고, confused deputy 7개가 이 길로 들어온다. attack surface를 보려면 이쪽을 알아야 한다.

### 네 가지 component와 exported

앱은 네 종류의 component로 이뤄진다. activity(화면 하나), service(백그라운드 작업), broadcast receiver(이벤트를 받는 입구), content provider(데이터를 다른 앱에 내주는 창구)다. 각 component에는 다른 앱이 접근할 수 있는지를 정하는 `android:exported` 속성이 있다[^8]. Android 12부터는 intent 필터가 있는 component에 이 값을 반드시 명시해야 한다.

> "If your app targets Android 12 or higher and contains activities, services, or broadcast receivers that use intent filters, you must explicitly declare the android:exported attribute for these app components."
>
> [Behavior changes: Android 12](https://developer.android.com/about/versions/12/behavior-changes-12)

export됐고 권한 조건도 없는 activity가 "다른 앱이 직접 열 수 있는 화면"이다. CarSettings가 system UID라 그 화면들은 system UID로 돈다.

이것을 기기에서 직접 확인해봤다. `IActivityTaskManager.startActivity`를 리플렉션으로 부르는 작은 프로그램을 만들어 일반 앱 UID(TTS, 1010218)로 CarSettings의 component를 열어봤다.

```text
## target: com.android.car.settings/.common.CarSettingActivities$WifiSettingsActivity   (export됨)
uid=1010218 result=0
ActivityTaskManager: Background activity launch blocked! [callingPackage: com.google.android.tts; ... callingUidHasVisibleActivity: false; ...
ActivityTaskManager: START u10 {... cmp=com.android.car.settings/.common.CarSettingActivities$WifiSettingsActivity} with LAUNCH_MULTIPLE from uid 1010218 (BAL_BLOCK) result code=102

## target: com.android.car.settings/.security.ChooseLockPinActivity   (비공개)
uid=1010218 java.lang.SecurityException: Permission Denial: starting Intent { flg=0x10000000 cmp=com.android.car.settings/.security.ChooseLockPinActivity } from null (pid=3980, uid=1010218) not exported from uid 1001000
```

(호출 결과와 system_server 로그에서 해당 줄만 옮겼다.)

두 요청은 서로 다른 검사에서 갈렸다. 비공개 화면은 ActivityManager가 export 검사에서 "not exported from uid 1001000"으로 막았다. export된 화면은 export 검사를 통과했고 호출도 `result=0`을 돌려줬지만, 그다음 단계인 백그라운드 실행 제한(Background Activity Launch, 줄여서 BAL)에서 막혀 실제로 화면이 뜨지는 않았다. 이 실험은 화면이 없는 프로세스에서 요청을 보냈으므로 로그에 `callingUidHasVisibleActivity: false`가 찍혔고, BAL은 이 값을 보고 막았다. Android 10부터는 화면에 보이는 창이 없는 앱이 백그라운드에서 화면을 띄우려 하면 이렇게 막는다[^9]. 사용자가 보고 있는 앱이 같은 요청을 보낼 때의 결과는 시험하지 않았다. 일반 앱이 실제로 그 화면을 띄우려면 export 검사에 더해 BAL 조건도 넘어야 한다.

system UID는 이 export 검사를 통째로 건너뛴다. activity를 띄울 때의 export 검사도 앞에서 본 `checkComponentPermission`을 거치는데, 그 안에서 부르는 `ActivityManager.checkComponentPermission`의 첫 검사 `canAccessUnexportedComponents`는 appId가 root(0)나 system(1000)이면 대상 앱을 가리지 않고 허용한다. 그래서 system UID를 공유하는 13개 패키지 중 하나에서 코드를 실행하면 CarSettings뿐 아니라 모든 앱의 비공개 activity에 export 검사를 통과해 닿는다. 이 부분은 실험하지 않았다.

### 명시적 intent와 암시적 intent

component를 부를 때 쓰는 메시지가 intent다. 받을 component를 이름으로 지정하면 명시적(explicit), action이나 데이터 종류만 적고 시스템이 대상을 고르게 하면 암시적(implicit)이다. 암시적 intent는 같은 조건을 처리하겠다고 등록한 다른 앱이 가로챌 수 있다.

> "If the intent contains any private data, then data can be leaked to third-party apps installed on the same device when implicit intents are used."
>
> (Oversecured, "Interception of Android implicit intents", 2020, [blog.oversecured.com](https://blog.oversecured.com/Interception-of-Android-implicit-intents/))

공식 문서도 service는 늘 명시적 intent로 부르라고 경고한다[^10].

### intent redirection

앞에서 "권한 있는 앱을 confused deputy로 쓴다"를 말했다. 그 구체적 모양이 intent 리디렉션이다. intent는 Parcel로 직렬화되므로 intent 안에 다른 intent를 실어 보낼 수 있다. 권한 있는 앱이 밖에서 받은 intent를 검사 없이 `startActivity` 같은 데 그대로 넘기면, 공격자는 그 앱의 identity로 원하는 component를 열게 된다.

> "An intent redirection occurs when an attacker can partly or fully control the contents of an intent used to launch a new component in the context of a vulnerable app."
>
> [Intent redirection](https://developer.android.com/privacy-and-security/risks/intent-redirection)

Oversecured의 설명이 공격 효과를 짚는다. "an attacker can force the app to launch a non-exported component that cannot be launched directly ... or to grant the attacker access to its content providers"[^11]. 즉 confused deputy를 거치면 방금 본 "not exported" 벽도 넘는다. CVE-2021-1035(CarSettings가 지정된 broadcast receiver를 system 권한으로 호출), CVE-2022-20223(폰 Settings에서 물려받은 CarDeveloperOptions 버그로, 아무 activity나 system 권한으로 띄움)이 이 유형의 공개 취약점이다.

### PendingIntent

PendingIntent는 "나중에 내 identity로 이 intent를 실행해도 된다"는 토큰이다. 받은 쪽은 준 앱의 UID와 권한으로 그 intent를 실행한다.

> "By giving a PendingIntent to another application, you are granting it the right to perform the operation you have specified as if the other application was yourself (with the same permissions and identity)."
>
> [PendingIntent](https://developer.android.com/reference/android/app/PendingIntent)

그러니 안에 담는 intent는 대상을 명시해 고정해야 한다. 대상을 비워 두고 토큰을 변경 가능(`FLAG_MUTABLE`)으로 만들면, 받은 공격자가 빈 칸을 채워 토큰을 만든 앱의 권한으로 원하는 component를 열 수 있다. 토큰을 만든 쪽이 system 앱이면 그 권한은 system 권한이다. 이 위험 때문에 Android 12가 `FLAG_MUTABLE`/`FLAG_IMMUTABLE` 명시를 요구하게 됐다[^12].

### content provider와 URI 권한

content provider는 데이터를 URI로 내준다(`content://...`). 다른 앱에 특정 URI만 잠시 열어주는 장치가 URI 권한 위임이다. 권한 있는 앱이 공격자가 준 URI를 받아 그대로 읽거나, 자기 URI를 과하게 열어주면 접근 통제가 뚫린다.

> "If the grantUriPermissions attribute is true, permission can be granted for any of the data under the provider's purview."
>
> [`<grant-uri-permission>`](https://developer.android.com/guide/topics/manifest/grant-uri-permission-element)

CVE-2021-0481(사용자 사진 변경 결과 URI로 접근 불가 파일 접근), CVE-2022-20144(시스템 content provider 데이터 접근)가 이 부류의 공개 취약점이다.

앞에서 본 Binder 메서드 검사는 직접 호출을 막는 벽이다. confused deputy를 거치는 호출은 이 절의 component, intent, URI라는 표면으로 들어온다. 공개 AAOS 취약점 36개 가운데 confused deputy 7개가 이 표면에서 나왔다. 가장 많은 탭재킹 10개는 다른 창을 겹쳐 사용자의 탭을 가로채는 화면 겹침 부류로, 앞에서 본 AppOps(`SYSTEM_ALERT_WINDOW`)와 얽혀 있다.

---

## SELinux

UID와 Android 권한만으로는 프로세스가 할 수 있는 일을 다 설명하지 못한다. CarSettings와 CarService는 모두 system UID 계열이지만, 기기에서 본 SELinux 도메인은 각각 `system_app`과 `carservice_app`이었다. 두 프로세스가 같은 대상에 접근할 수 있는지는 UID와 별도로 확인해야 한다. root도 마찬가지다. 파일 권한 비트를 넘는 `DAC_OVERRIDE` 같은 capability가 있어도, 그 capability를 쓰는 데 SELinux 정책이 적용된다. Android는 이 정책을 enforcing 모드로 적용한다.

> "Android uses Security-Enhanced Linux (SELinux) to enforce mandatory access control (MAC) over all processes, even processes running with root/superuser privileges (Linux capabilities). ... SELinux operates on the principle of default denial: Anything not explicitly allowed is denied."
>
> [Security-Enhanced Linux in Android](https://source.android.com/docs/security/features/selinux)

AAOS 문서 목록(`source.android.com/docs/automotive` 아래)에서는 SELinux를 따로 다룬 페이지를 찾지 못했다. 자동차 보안 문서도 개요에서 Android 보안 모델 문서로 넘길 뿐이다. 차에서 더해진 정책(예: `carservice_app.te`)은 소스와 기기 정책 파일로만 볼 수 있다.

### SELinux의 동작

SELinux는 커널 안에서 돈다. 원리는 세 가지다.

1. **모든 것에 label이 붙는다.** 프로세스, 파일, 소켓, 심지어 Binder 서비스 이름까지 `사용자:역할:타입:수준` 형태의 label을 갖는다. Android에서 중요한 건 셋째 칸인 타입이다. 프로세스의 타입은 특별히 도메인이라고 부른다.
2. **허용 규칙에 있는 것만 통과한다.** 정책은 "도메인 A가 타입 B인 대상에게 클래스 C의 동작 D를 해도 된다"는 `allow` 규칙의 목록이다. 규칙에 없으면 거부다.
3. **접근할 때마다 확인한다.** 프로세스가 파일을 열거나, capability를 쓰거나, Binder 호출을 보낼 때마다 커널이 정책을 조회한다. 서비스 매니저처럼 user space에서 정책을 조회하는 관리자도 있다. 거부되면 `avc: denied` 로그가 남는다.

규칙의 형태와 도메인이라는 말은 문서가 이렇게 정의한다.

> "A policy rule comes in the form: allow source target:class permissions; ... An example of a rule is: allow untrusted_app app_data_file:file { read write }; ... For a process, its type is also known as its domain."
>
> [SELinux concepts](https://source.android.com/docs/security/features/selinux/concepts)

UID로 하는 검사(소유자가 정하는 접근 제어, DAC)와 SELinux 검사(정책이 강제하는 접근 제어, MAC)는 따로 돌고 둘 다 통과해야 접근할 수 있다.

### 기기에서 본 label

`ps -A -Z`의 맨 앞 열이 프로세스 label이다.

```text
LABEL                                     USER          UID     PID  PPID NAME
u:r:init:s0                               root            0       1     0 init
u:r:servicemanager:s0                     system       1000     174     1 servicemanager
u:r:vold:s0                               root            0     202     1 vold
u:r:hal_vehicle_default:s0                vehicle_network 1054  222     1 android.hardware.automotive.vehicle@V3-emulator-service
u:r:netd:s0                               root            0     413     1 netd
u:r:zygote:s0                             root            0     416     1 zygote64
u:r:system_server:s0                      system       1000     708   416 system_server
u:r:carservice_app:s0                     system       1000    1269   416 com.android.car
u:r:system_app:s0                         u10_system 1001000   3432   416 com.android.car.settings
u:r:bluetooth:s0                          u10_bluetooth 1001002 1345  416 com.android.bluetooth
u:r:platform_app:s0:c522,c768             u10_a174   1010174   2006   416 com.android.car.carlauncher
u:r:priv_app:s0:c522,c768                 u10_a154   1010154   1984   416 com.android.car.radio
u:r:untrusted_app:s0:c218,c256,c522,c768  u10_a218   1010218   2221   416 com.google.android.tts
```

- `init`, `vold`, `netd`, `zygote`는 모두 root인데 도메인은 다 다르다. 같은 root라도 할 수 있는 일이 다르다.
- CarService(`carservice_app`)와 CarSettings(`system_app`)는 둘 다 system UID 계열(1000, 1001000)인데 도메인이 다르다. 앞에서 "shared user 13개는 같은 권한을 갖는다"고 했는데, SELinux 수준에서는 다시 갈라진다. 이 기기 정책에서는 `carservice_app`의 VHAL Binder 호출을 허용하고 `system_app`의 호출은 막는다. 패키지 13개의 실행 도메인이 모두 이 둘뿐이라는 뜻은 아니다. 위 목록의 `system_server`처럼 같은 UID 1000을 쓰면서 다른 도메인인 프로세스도 있다.

파일에도 같은 형식의 label이 붙는다.

```text
$ ls -Z
u:object_r:packages_list_file:s0       /data/system/packages.list
u:object_r:zygote_exec:s0              /system/bin/app_process64
u:object_r:servicemanager_exec:s0      /system/bin/servicemanager
u:object_r:hal_vehicle_default_exec:s0 /vendor/bin/hw/android.hardware.automotive.vehicle@V3-emulator-service
```

### 도메인이 정해지는 방식

**네이티브 데몬**은 init이 실행 파일을 실행하는 순간 정책의 전환 규칙에 따라 도메인이 정해진다. 위 VHAL 실행 파일의 label은 `hal_vehicle_default_exec`이고, 기기에서 꺼낸 정책 파일(CIL 형식)에 이 규칙이 있다.

```text
(typetransition init hal_vehicle_default_exec process hal_vehicle_default)
```

"init이 `hal_vehicle_default_exec` 파일을 실행하면 새 프로세스는 `hal_vehicle_default` 도메인이 된다"는 뜻이다. PPID가 1(init)인 데몬들은 이런 규칙에 따라 각자 실행 파일 label에 맞는 도메인을 갖는다.

**앱**은 실행 파일을 새로 실행하지 않고 zygote에서 fork로 생성되므로 이 방식을 쓸 수 없다. 대신 fork 직후 `seapp_contexts` 규칙을 보고 도메인을 직접 정한다.

> "seapp_contexts assigns labels to app processes and /data/data directories. This configuration is read by the zygote process on each app launch and by installd during startup."
>
> "mac_permissions.xml assigns a seinfo tag to apps based on their signature and optionally their package name. The seinfo tag can then be used as a key in the seapp_contexts file ..."
>
> [Implementing SELinux](https://source.android.com/docs/security/features/selinux/implement)

기기에 있는 실제 규칙 일부다.

```text
user=system seinfo=platform domain=system_app type=system_app_data_file
user=system seinfo=platform name=com.android.car domain=carservice_app type=system_app_data_file
user=_app seinfo=platform domain=platform_app type=app_data_file levelFrom=user
user=_app isPrivApp=true domain=priv_app type=privapp_data_file levelFrom=user
user=_app minTargetSdkVersion=34 domain=untrusted_app type=app_data_file levelFrom=all
```

`user=system`은 UID가 system이라는 조건, `user=_app`은 일반 앱 UID 범위라는 조건이다. `seinfo=platform`은 플랫폼 키로 서명됐다는 조건이다. 위 문서대로 `mac_permissions.xml`이 서명을 보고 `platform`이라는 seinfo를 붙이고, 앞에서 본 `packages.list`의 `platform:` 칸이 그 결과다. `isPrivApp=true`는 privileged 디렉토리에 설치됐다는 조건, `name=`은 패키지 이름이다. 조건이 더 구체적인 규칙이 먼저 적용되므로 system UID에 플랫폼 서명이고 이름이 `com.android.car`이면 `carservice_app`, 이름이 다르면 `system_app`이 된다. 플랫폼 서명 앱은 `platform_app`, privileged 디렉토리의 앱은 `priv_app`, 나머지는 `untrusted_app`이다. 스토어에서 받은 앱은 항상 `untrusted_app` 계열이다.

**root도 도메인을 마음대로 바꿀 수 없다.** root 셸에서 `runcon`으로 `untrusted_app` 도메인의 `sh`를 실행하려 하면 이렇게 거부된다.

```text
avc:  denied  { entrypoint } for comm="runcon" path="/system/bin/sh" scontext=u:r:untrusted_app:s0:c218,c256,c522,c768 tcontext=u:object_r:shell_exec:s0 tclass=file permissive=0
```

도메인마다 그 도메인으로 들어올 수 있는 실행 파일(entrypoint)이 정해져 있고, `untrusted_app`에는 셸 실행 파일이 들어 있지 않다. 앞의 Binder 실험에서는 이 에뮬레이터가 userdebug 빌드라 root 셸의 `su` 도메인에 자기 context를 직접 바꾸는 권한이 있어서 그 방법을 썼다. 제품 빌드에는 `su` 도메인이 없다.

### root와 SELinux

root 셸(UID 0)이 자기 도메인만 `untrusted_app`으로 바꾸고 `packages.list`를 읽어봤다.

```text
$ id
uid=0(root) gid=0(root) ... context=u:r:untrusted_app:s0:c218,c256,c522,c768
$ cat /data/system/packages.list
cat: /data/system/packages.list: Permission denied

avc:  denied  { dac_read_search } for comm="cat" capability=2  scontext=u:r:untrusted_app:s0:c218,c256,c522,c768 tcontext=u:r:untrusted_app:s0:c218,c256,c522,c768 tclass=capability permissive=0
avc:  denied  { dac_override } for comm="cat" capability=1  scontext=u:r:untrusted_app:s0:c218,c256,c522,c768 tcontext=u:r:untrusted_app:s0:c218,c256,c522,c768 tclass=capability permissive=0
```

문서가 드는 예도 같은 구조다.

> "In a traditional DAC-based Linux environment, if the root user becomes compromised that user can write to every raw block device. However, SELinux can be used to label these devices so the process assigned the root privilege can write to only those specified in the associated policy."
>
> [SELinux concepts](https://source.android.com/docs/security/features/selinux/concepts)

이 파일은 root 소유가 아니라서 root는 원래 `DAC_OVERRIDE`(파일 권한 비트를 무시하는 capability)로 읽는다. 그런데 SELinux는 capability를 쓰는 것도 정책으로 확인한다. `untrusted_app` 도메인에는 그 허가가 없어서 UID가 0이어도 막혔다. 커널 버그로 UID만 0으로 만들어서는 부족하고 도메인까지 바꿔야 한다. 이 때문에 Android 커널 익스플로잇은 마지막 단계에서 보통 SELinux enforcing 모드를 끄거나 자기 프로세스의 security context까지 덮어쓴다.

### Binder 서비스 접근 제어

앞에서 본 서비스 조회 결과를 정책으로 확인해보자. 서비스 이름에도 label이 있다(`service_contexts` 파일).

```text
car_service                                           u:object_r:carservice_service:s0
android.hardware.automotive.vehicle.IVehicle/default  u:object_r:hal_vehicle_service:s0
```

정책에는 이런 규칙들이 있다.

```text
(allow carservice_app carservice_service (service_manager (add find)))
(neverallow base_typeattr_1070 carservice_service (service_manager (add)))
(typeattributeset app_api_service ( ... carservice_service ))
(allow untrusted_app_all app_api_service (service_manager (find)))
```

- `car_service`를 등록(add)할 수 있는 도메인은 `carservice_app`뿐이다. `neverallow`는 정책을 빌드할 때 "이런 허용 규칙이 생기면 빌드를 실패시켜라"라는 금지 조항이다. 다른 프로세스가 같은 이름으로 가짜 서비스를 등록하는 걸 막는다. 기기가 부팅하면서 정책을 컴파일할 때는 init이 secilc에 `-N`(neverallow 검사 생략)을 넘기므로(`system/core/init/selinux.cpp`), 실제 강제는 빌드 단계와 호환성 시험(CTS)에서 일어난다. 문서도 호환성 시험으로 기기마다 강제된다고 적는다[^13]. CTS 인증을 받아야 하는 기기라면 제조사가 정책을 고쳐도 이 금지 조항은 넘을 수 없다.
- `carservice_service`는 `app_api_service`라는 묶음(attribute)에 들어 있다. 모든 일반 앱 도메인(`untrusted_app_all`)은 이 묶음에 속한 서비스를 찾을(find) 수 있다. 그래서 일반 앱이 `car_service`를 찾았다.
- `hal_vehicle_service`는 그 묶음에 없어서 일반 앱은 VHAL을 찾지 못했다.

찾은 객체에 실제로 Binder 호출을 보내는 것은 `binder call` 규칙으로 따로 확인한다. 찾을 수는 있어도 호출은 못 하는 경우가 있다.

### 카테고리로 나뉘는 앱과 사용자

`untrusted_app` 앱이 둘이면 도메인이 같으니 도메인만으로는 둘을 가르지 못한다. 그래서 label 넷째 칸에 카테고리가 붙는다. 계산식은 libselinux에 있다.

```c
// external/selinux/libselinux/src/android/android_seapp.c
	case LEVELFROM_USER:
		snprintf(level, sizeof level, "s0:c%u,c%u",
			 512 + (userid & 0xff),
			 768 + (userid>>8 & 0xff));
		break;
	case LEVELFROM_ALL:
		snprintf(level, sizeof level, "s0:c%u,c%u,c%u,c%u",
			 appid & 0xff,
			 256 + (appid>>8 & 0xff),
			 512 + (userid & 0xff),
			 768 + (userid>>8 & 0xff));
```

여기서 libselinux의 appid 변수는 앞의 appId와 달리 앱 UID 범위 안의 순번이다(10218−10000=218). TTS 앱(사용자 10, appid 218)에 넣으면 `c218,c256,c522,c768`이 나오고, 위 `ps` 출력과 데이터 디렉토리 label(`app_data_file:s0:c218,c256,c522,c768`)이 정확히 이 값이다. 카테고리가 맞지 않는 프로세스와 파일 사이의 접근은 SELinux가 거부한다. 일반 앱끼리는 이렇게 UID와 카테고리, 두 겹으로 갈라진다.

`seapp_contexts`를 다시 보면 `untrusted_app`은 `levelFrom=all`(앱 카테고리 + 사용자 카테고리)이다. `platform_app`과 `priv_app`은 `levelFrom=user`(사용자 카테고리만)라서 런처와 라디오 앱이 둘 다 `c522,c768`이다. `platform_app`, `priv_app` 도메인 앱끼리는 카테고리로 갈라지지 않고 UID로만 갈라진다. privileged 앱이라도 따로 도메인을 받은 `permissioncontroller_app`, `mediaprovider_app`, `rkpdapp` 등은 lts5 `seapp_contexts`에서 `levelFrom=all`이다. 이 글에서 일반 앱의 예로 쓴 TTS는 product 파티션에 미리 들어 있지만 privileged 디렉토리 밖에 있고 플랫폼 키로 서명되지 않은 앱이라(`packages.list`의 `default:` 칸) `untrusted_app`으로 돌고 카테고리가 네 개 붙는다. 스토어에서 받은 앱과 같은 규칙을 받으므로 관찰 대상으로 골랐다.

앱 샌드박스 문서의 연혁이 이 규칙과 그대로 맞는다.

> "In Android 6.0, the SELinux sandbox was extended to isolate apps across the per-physical-user boundary."
>
> "In Android 9 all nonprivileged apps with targetSdkVersion >= 28 must run in individual SELinux sandboxes, providing MAC on a per-app basis."
>
> [Application Sandbox](https://source.android.com/docs/security/app-sandbox)

사용자 카테고리(c512 이상)가 Android 6.0의 사용자 간 분리이고, 앱 카테고리는 Android 9의 앱별 분리다. 문서의 "nonprivileged"가 실제 규칙에서는 `platform_app`, `priv_app`이 `levelFrom=user`로 남는 것으로 나타난다. 기기 규칙에서도 `minTargetSdkVersion=28` 이상 줄만 `levelFrom=all`이고, 그보다 낮은 targetSdk 26, 27용 `untrusted_app_27` 줄과 그 아래의 `untrusted_app_25` 줄은 `levelFrom=user`다. targetSdk 28 앱도 `untrusted_app_27` 도메인으로 돌지만 그 줄은 `levelFrom=all`이다. 카테고리를 계산하는 식 자체는 문서에 없고 위 libselinux 코드에만 있다.

---

## zygote, seccomp, capability

UID와 도메인을 확인한 뒤에도 차이가 남았다. CarService와 VHAL은 둘 다 차량 기능을 맡지만, CarService에는 seccomp 필터가 있고 VHAL에는 없었다. 이 차이를 이해하려면 프로세스가 시작되는 경로를 함께 봐야 한다. 아래에서는 init과 zygote가 각각 무엇을 띄우고, 그 과정에서 필터와 capability가 어떻게 정해지는지 따라간다.

### init과 zygote

init은 커널이 맨 처음 띄우는 user space 프로세스(PID 1)다. `.rc` 설정 파일을 읽고 네이티브 데몬들을 띄운다. zygote도 init이 띄우는 데몬 중 하나다.

```text
# /system/etc/init/hw/init.zygote64.rc
service zygote /system/bin/app_process64 -Xzygote /system/bin --zygote --start-system-server --socket-name=zygote
    class main
    priority -20
```

zygote는 Java 런타임(ART)을 띄우고 프레임워크 클래스와 리소스를 미리 메모리에 올려둔 뒤, 소켓으로 "앱 프로세스를 하나 만들어달라"는 요청을 기다린다. 요청이 오면 fork를 실행해 child 프로세스를 만든다. child 프로세스는 미리 올려둔 것을 그대로 물려받으니 시작이 빠르다. `system_server`도 이렇게 만들어진다. 앞의 `ps` 출력에서 PPID 열을 보면 구분이 보인다. 네이티브 데몬은 PPID가 1(init)이고, `system_server`와 모든 앱은 PPID가 zygote64의 PID다.

> "Each app process is forked from an existing process called Zygote. The Zygote process starts when the system boots and loads common framework code and resources (such as activity themes). ... This approach allows most of the RAM pages allocated for framework code and resources to be shared across all app processes."
>
> [Overview of memory management](https://developer.android.com/topic/performance/memory-overview)

zygote 자신은 root이고 capability를 전부 가졌으며 seccomp 필터도 없다. fork로 만들어진 child 프로세스가 앱으로 바뀌는 순서는 zygote의 네이티브 코드에 있다.

```cpp
// frameworks/base/core/jni/com_android_internal_os_Zygote.cpp, SpecializeCommon()
    if (setresgid(gid, gid, gid) == -1) { ... }                  // 1. 그룹을 앱 것으로

    // Must be called when the new process still has CAP_SYS_ADMIN, in this case,
    // before changing uid from 0, which clears capabilities.  The other
    // alternative is to call prctl(PR_SET_NO_NEW_PRIVS, 1) afterward, but that
    // breaks SELinux domain transition (see b/71859146).  As the result,
    // privileged syscalls used below still need to be accessible in app process.
    SetUpSeccompFilter(uid, is_child_zygote);                    // 2. seccomp 필터
    ...
    if (setresuid(uid, uid, uid) == -1) { ... }                  // 3. UID를 앱 것으로
    ...
    SetCapabilities(permitted_capabilities, effective_capabilities, ...);   // 4. capability 정리
    ...
    if (selinux_android_setcontext(uid, is_system_server, se_info_ptr, nice_name_ptr) == -1) {  // 5. SELinux 도메인
```

UID를 바꾸기 전, 아직 root 권한(CAP_SYS_ADMIN)이 있을 때 필터를 건다. 주석 마지막 줄대로, 그 때문에 필터를 건 뒤에 쓰는 `setresuid` 같은 privilege가 필요한 syscall은 앱 필터에서도 열려 있어야 한다. 아래 seccomp 절에서 앱 필터가 다른 set\*id 호출은 막고 `setresuid`만 열어 두는 것도 이 때문이다.

```text
$ grep -E 'Uid|CapEff|Seccomp' /proc/<pid>/status
416  zygote64         Uid: 0        CapEff: 000001ffffffffff  Seccomp: 0
708  system_server    Uid: 1000     CapEff: 0000001806897c20  Seccomp: 2
1269 com.android.car  Uid: 1000     CapEff: 0000000000000000  Seccomp: 2
2221 tts              Uid: 1010218  CapEff: 0000000000000000  Seccomp: 2
```

fork에는 대가도 있다. child 프로세스들은 zygote의 memory layout을 그대로 물려받으므로 ASLR로 정해진 라이브러리 위치가 모두 같다. 일반 앱 하나를 설치한 공격자는 자기 프로세스의 libc 주소만 읽어도 CarService와 런처의 libc 주소를 안다. 위 메모리 문서는 페이지 공유를 메모리 절약으로만 설명한다.

### seccomp

seccomp는 프로세스가 커널에 요청할 수 있는 syscall을 걸러내는 필터다. 한 번 걸면 그 프로세스와 child 프로세스들은 필터를 풀 수 없다. `/proc/<pid>/status`의 `Seccomp: 2`는 필터가 걸려 있다는 뜻이고 0은 없다는 뜻이다.

앱 seccomp 필터는 Android 8.0에서 들어왔다. 도입 당시 공식 블로그 글은 이렇게 설명한다.

> "Android O includes a single seccomp filter installed into zygote, the process from which all the Android applications are derived. ... The seccomp filter allows: all the syscalls exposed via bionic (the C runtime for Android). ... Android O's seccomp filter blocks certain syscalls, such as swapon/swapoff, which have been implicated in some security attacks, and the key control syscalls, which are not useful to apps."
>
> [Seccomp filter in Android O](https://android-developers.googleblog.com/2017/07/seccomp-filter-in-android-o.html) (Android Developers Blog, 2017)

"zygote에 설치한다"는 표현은 지금 기기와 맞지 않는다. 위 `/proc` 출력에서 zygote64 자신은 `Seccomp: 0`이다. 위 zygote 코드대로 필터는 fork로 만들어진 child 프로세스에 걸린다. 어떤 필터를 거는지는 UID로 갈린다.

```cpp
// com_android_internal_os_Zygote.cpp
static void SetUpSeccompFilter(uid_t uid, bool is_child_zygote) {
  if (!gIsSecurityEnforced) {
    ALOGI("seccomp disabled by setenforce 0");
    return;
  }
  // Apply system or app filter based on uid.
  if (uid >= AID_APP_START) {
    ...
      set_app_seccomp_filter();
  } else {
    set_system_seccomp_filter();
  }
}
```

UID 10000 이상인 앱은 앱 필터, 그 아래인 system_server와 CarService(UID 1000) 같은 프로세스는 시스템 필터를 받는다. 비교하는 값은 appId가 아니라 사용자 번호까지 포함한 전체 UID다(같은 `uid`가 바로 아래 `setresuid`에도 쓰인다). 그래서 사용자 10에서 도는 system UID 프로세스(CarSettings와 CarPerUserService 1001000, 블루투스 1001002)는 appId가 10000보다 작아도 앱 필터를 받는다. 둘 다 `Seccomp: 2`로 보이므로 `/proc` 출력만으로는 어느 필터인지 구분하지 못한다.

첫 줄을 보면 SELinux가 enforcing 모드가 아닐 때(`setenforce 0`) zygote는 필터를 아예 걸지 않는다. 앞에서 인용한 Android 개발자 블로그 글도 userdebug, eng 빌드에서는 `setenforce 0`으로 seccomp 필터를 끌 수 있다고 소개한다. 그래서 seccomp 상태를 볼 때는 SELinux가 enforcing인지부터 확인해야 한다.

필터의 내용은 bionic(Android의 C 라이브러리)이 만든다. 만드는 방식이 소스 주석에 적혀 있다.

```text
# bionic/libc/SECCOMP_BLOCKLIST_COMMON.TXT
# The final seccomp allowlist is SYSCALLS.TXT - SECCOMP_BLOCKLIST.TXT + SECCOMP_ALLOWLIST.TXT
int     swapon(const char*, int) all
int     swapoff(const char*) all
```

bionic이 함수로 감싸서 제공하는 syscall 목록(`SYSCALLS.TXT`)을 기본으로 허용한 뒤 몇 개를 빼고 몇 개를 더한다. allowlist에 없는 호출을 하면 필터가 `SECCOMP_RET_TRAP`을 돌려주고, 프로세스는 `SIGSYS` 신호를 받아 보통 그대로 죽는다. 블로그 글에 실린 크래시 로그가 그 모습이다(`signal 31 (SIGSYS), code 1 (SYS_SECCOMP)`, `Cause: seccomp prevented call to disallowed system call 55`). lts5 소스의 목록 파일들을 대조하면 앱에서 막힌 것과 열린 것이 갈린다. 아래는 소스에서 뽑은 목록이다.

- **막힘(두 필터 모두)**: `keyctl`, `add_key`(커널 키링), `io_uring_setup`, `kexec_load`, `finit_module`. 어느 목록에도 없어서 앱 필터와 시스템 필터 모두에서 막힌다. 커널 키링과 io_uring은 커널 권한 상승 취약점이 여러 번 나온 기능이라 앱에서는 아예 부를 수 없게 했다.
- **앱 필터에서만 막힘**: `mount`, `setuid`. 둘 다 앱 필터에서만 빼는 목록인 `SECCOMP_BLOCKLIST_APP.TXT`에 있다. 이 목록에는 UID, 그룹을 바꾸는 set\*id 계열(`setresuid` 제외), `mount`/`umount2`, `chroot`, `init_module`, 시간 설정(`settimeofday` 등), `reboot` 등이 들어 있다.
- **열림**: `ptrace`, `bpf`, `perf_event_open`, `setresuid`. 이런 호출은 seccomp가 아니라 SELinux와 capability가 막는다. 앱 seccomp 필터는 앱이 쓸 일이 없는 커널 기능 일부를 잘라낼 뿐 위험한 호출을 전부 막지는 않는다.

Android 개발자 블로그 글이 말한 "key control syscalls"가 위의 `keyctl`, `add_key`다. 시스템 필터는 `SECCOMP_BLOCKLIST_APP.TXT`를 빼지 않으므로 `mount`, `setuid` 같은 호출이 seccomp 단계를 통과한다. 시스템 필터에만 더하는 `SECCOMP_ALLOWLIST_SYSTEM.TXT`는 `bpf` 한 줄인데, `bpf`는 `SYSCALLS.TXT`에 이미 있다. 위에서 막힌 다섯 개는 시스템 필터에서도 열리지 않는다.

init이 띄우는 데몬은 zygote를 거치지 않으므로 이 필터가 없다. 스스로 필터를 거는 데몬만 필터를 갖는다.

```text
222  VHAL            Uid: 1054  CapEff: 0000000000000000  NoNewPrivs: 0  Seccomp: 0
413  netd            Uid: 0     CapEff: 00000000000074ef  NoNewPrivs: 0  Seccomp: 0
1587 wpa_supplicant  Uid: 1010  CapEff: 0000000000003000  NoNewPrivs: 0  Seccomp: 0
580  mediaextractor  Uid: 1040  CapEff: 0000000000000000  NoNewPrivs: 1  Seccomp: 2
```

미디어 추출기(`media.extractor`)는 신뢰할 수 없는 미디어 파일을 파싱하는 프로세스라서 스스로 필터를 건다. `NoNewPrivs: 1`은 이후 실행하는 프로그램이 권한을 늘릴 수 없게 하는 플래그다. 리눅스에서는 `CAP_SYS_ADMIN`이 없는 프로세스가 seccomp 필터를 걸려면 이 플래그를 먼저 켜야 한다.

> "In order to use the SECCOMP_SET_MODE_FILTER operation, either the calling thread must have the CAP_SYS_ADMIN capability in its user namespace, or the thread must already have the no_new_privs bit set."
>
> [seccomp(2)](https://man7.org/linux/man-pages/man2/seccomp.2.html)

zygote는 위 코드 주석대로 아직 CAP_SYS_ADMIN이 있을 때 필터를 걸기 때문에 이 플래그가 필요 없고, 앱 프로세스는 `NoNewPrivs: 0`으로 남는다. VHAL, netd, Wi-Fi 데몬(wpa_supplicant)에는 필터가 없다. 이런 데몬 안에서 코드를 실행하면 seccomp로 걸러지는 syscall이 없고, 남은 제한은 SELinux, capability, 파일 권한이다.

### capability

리눅스는 root의 privilege를 40개 남짓한 조각으로 나눠뒀다. root가 아닌 프로세스도 일부 조각을 가질 수 있다.

> "Starting with Linux 2.2, Linux divides the privileges traditionally associated with superuser into distinct units, known as capabilities, which can be independently enabled and disabled."
>
> [capabilities(7)](https://man7.org/linux/man-pages/man7/capabilities.7.html)

`CapEff`는 지금 유효한 조각을 비트로 표시한 값이다. 비트 번호를 이름으로 바꾸면 이렇다.

| 프로세스 | CapEff | capability |
| --- | --- | --- |
| wpa_supplicant | `0x3000` | NET_ADMIN, NET_RAW |
| netd | `0x74ef` | CHOWN, DAC_OVERRIDE, DAC_READ_SEARCH, FOWNER, KILL, SETGID, SETUID, NET_BIND_SERVICE, NET_ADMIN, NET_RAW, IPC_LOCK |
| system_server | `0x1806897c20` | KILL, NET_BIND_SERVICE, NET_BROADCAST, NET_ADMIN, NET_RAW, IPC_LOCK, SYS_MODULE, SYS_PTRACE, SYS_NICE, SYS_TIME, SYS_TTY_CONFIG, WAKE_ALARM, BLOCK_SUSPEND |
| 앱, CarService, VHAL | `0` | 없음 |

`0x3000`은 2진수로 12번(NET_ADMIN)과 13번(NET_RAW) 비트가 켜진 값이다. 같은 man 페이지의 정의는 이렇다.

> CAP_NET_ADMIN: "Perform various network-related operations: interface configuration; administration of IP firewall, masquerading, and accounting; modify routing tables; ..."
>
> CAP_NET_RAW: "Use RAW and PACKET sockets; bind to any address for transparent proxying."
>
> CAP_DAC_OVERRIDE: "Bypass file read, write, and execute permission checks."
>
> CAP_SETUID: "Make arbitrary manipulations of process UIDs (setuid(2), setreuid(2), setresuid(2), setfsuid(2)) ..."

NET_ADMIN은 네트워크 인터페이스, 라우팅, 방화벽 규칙을 바꾸는 권한이다. NET_RAW는 raw socket을 열어서 임의의 패킷을 만들고 엿보는 권한이다. DAC_OVERRIDE는 파일 권한 비트를 무시하는 권한, SETUID는 UID를 바꾸는 권한이다.

Wi-Fi 데몬을 장악하면 UID는 wifi(1010)여도 네트워크 설정 권한이 생긴다. 다만 앞에서 봤듯이 capability를 쓰는 것도 SELinux가 도메인별로 다시 확인한다. 데몬이 가진 capability 중 실제로 쓸 수 있는 건 그 도메인의 정책이 허용한 것뿐이다. 그러니 공격자가 프로세스 하나를 장악했을 때 무엇을 얻는지는 UID, capability, SELinux 도메인, seccomp 유무 네 가지를 같이 봐야 한다.

### Java 프로세스 안의 네이티브 코드

앱과 CarService는 Java(정확히는 [ART](https://source.android.com/docs/core/runtime), Android RunTime이 실행하는 바이트코드)로 돌지만, 그 안에서 C/C++ 네이티브 코드도 돈다. 둘을 잇는 규약이 JNI다.

> "JNI is the Java Native Interface. It defines a way for the bytecode that Android compiles from managed code ... to interact with native code (written in C/C++)."
>
> [JNI tips](https://developer.android.com/training/articles/perf-jni)

Java 앱도 안을 보면 네이티브 코드가 크다. CarService 하나의 메모리 지도에만 공유 라이브러리(`.so`)가 300개 넘게 올라와 있고, 블루투스 앱은 블루투스 stack의 핵심이 네이티브다.

```text
$ grep '\.so' /proc/<bt_pid>/maps | awk '{print $6}' | sort -u | head
/apex/com.android.btservices/lib64/libbluetooth_jni.so
/apex/com.android.btservices/lib64/libcrypto.so
...
```

무선 패킷이나 미디어 파일을 파싱하는 코드는 거의 다 이 네이티브 쪽이라서 Java 프로세스를 상대로도 heap overflow나 use-after-free 같은 memory corruption이 성립한다. ASLR, Scudo, PAC/BTI 같은 보호 기법은 이 네이티브 코드에 걸린다. ART가 바이트코드로 만든 코드에 거는 보호(JIT 코드 캐시를 쓰기용과 실행용으로 나눠 쓰기와 실행이 동시에 되는 매핑을 두지 않는 것 등)는 또 다른 층이다.

---

## init과 시스템 속성

앞에서 본 init은 `.rc` 파일에 적힌 대로 데몬을 띄우는 것 말고도 시스템 속성의 변화에 반응한다. `.rc` 파일의 문법은 다섯 종류의 구문으로 이뤄진다.

> "The Android Init Language consists of five broad classes of statements: Actions, Commands, Services, Options, and Imports."
>
> (AOSP `system/core/init/README.md`)

init이 속성 변화에 반응하는 것은 `on property:` 트리거가 붙은 Actions 구문을 통해서다. 차량 데몬의 `service ... user ... group ... capabilities ...` 블록도 이 Services 구문이다. 각 데몬의 UID, 그룹, capability가 거기서 정해진다.

### 시스템 속성

Android는 키-값 설정을 시스템 속성으로 들고 다닌다[^14]. `ro.*`(읽기 전용, 부팅 때 정함), `persist.*`(재부팅 넘어 유지), `sys.*`/`boot.*`(런타임 상태) 식이다. 이 글에도 이미 `ro.android.car.carservice.package`(CarService 구현 패키지)와 `ro.fw.mu.headless_system_user`가 나왔다.

속성에도 SELinux label이 붙어서 누가 읽고 쓸 수 있는지를 정책이 정한다. 매핑은 `property_contexts` 파일에 있다.

```text
$ getprop -Z ro.serialno              → u:object_r:serialno_prop:s0
$ getprop -Z boot.car_service_created → u:object_r:system_prop:s0
```

일반 앱 identity로 시험해보면 label에 따라 갈린다.

```text
# 일반 앱 문맥(untrusted_app)에서
$ getprop ro.serialno                 → (빈 값)
  avc: denied { read } ... name="u:object_r:serialno_prop:s0" scontext=u:r:untrusted_app ...
$ getprop ro.android.car.carservice.package  → com.android.car.updatable   (읽힘)
$ setprop debug.test 1                → Failed to set property
  avc: denied { write } ... scontext=u:r:untrusted_app ... tclass=sock_file
```

일련번호는 label이 `serialno_prop`이라 일반 앱이 못 읽고, CarService 패키지 이름은 `default_prop`이라 읽힌다. 속성 쓰기는 init의 속성 소켓을 거치는데, 일반 앱은 그 소켓에 쓸 SELinux 권한이 없어 전부 막힌다. 쓸 수 있는 도메인은 정책에 적혀 있다.

```text
(allow carservice_app system_prop (property_service (set)))
(allow system_app   system_prop (property_service (set)))
(allow system_server system_prop (property_service (set)))
```

`system_prop`을 쓸 수 있는 건 CarService, system_app, system_server 등 몇 도메인뿐이라 `boot.car_service_created` 같은 상태 속성은 아무 앱이나 조작할 수 없다. 공격자는 label이 느슨한 속성을 읽어 기기 정보를 모을 수 있다. 쓰기 쪽에서는 어떤 데몬이 특정 속성 변화에 반응해 동작을 시작한다면(`on property:...` 구문) 그 속성을 쓸 수 있는 도메인을 장악했을 때 그 동작을 끌어낼 수 있다.

---

## HAL과 system/vendor 분리

### HAL

차량 신호, 카메라, 오디오, Wi-Fi 칩은 제조사와 부품마다 다르다. Android는 하드웨어를 다루는 코드를 HAL(Hardware Abstraction Layer)로 분리하고 Android 쪽은 HAL 인터페이스만 부른다. 요즘 HAL은 대부분 별도 프로세스로 돌면서 AIDL로 정의된 인터페이스를 Binder로 제공한다.

> "A hardware abstraction layer (HAL) is type of abstraction layer with a standard interface for hardware vendors to implement. ... Binderized HALs run in a separate process from the client that uses them. Binderized HALs are registered with a service manager so that clients can access their capabilities."
>
> [Hardware abstraction layer (HAL) overview](https://source.android.com/docs/core/architecture/hal)

AAOS 문서는 VHAL을 같은 틀로 설명한다. 차량 기능 하나하나를 "속성"으로 추상화한 HAL이고 Android 13부터 AIDL로 정의된다.

> "The vehicle hardware abstraction layer (VHAL) interface defines the properties OEMs can implement and contains property metadata. ... The VHAL interface is based on accessing (reading, writing, and subscribing) a property, which is an abstraction for a specific function. In Android 13 and higher, VHAL migrated to AIDL at IVehicle.aidl ... CarService and Android native components support HIDL and AIDL backend and prefer the AIDL backend when it's available."
>
> [Vehicle HAL (VHAL) overview](https://source.android.com/docs/automotive/vhal)

"AIDL을 먼저 쓴다"는 문장은 CarService 코드(`VehicleStub.newVehicleStub`)와 그대로 맞는다. 차량 신호를 다루는 VHAL의 인터페이스 정의는 이렇다.

```java
// hardware/interfaces/automotive/vehicle/aidl/android/hardware/automotive/vehicle/IVehicle.aidl
@VintfStability
interface IVehicle {
    VehiclePropConfigs getAllPropConfigs();
    VehiclePropConfigs getPropConfigs(in int[] props);
    void getValues(IVehicleCallback callback, in GetValueRequests requests);
    void setValues(IVehicleCallback callback, in SetValueRequests requests);
    void subscribe(in IVehicleCallback callback, in SubscribeOptions[] options,
            int maxSharedMemoryFileCount);
    void unsubscribe(in IVehicleCallback callback, in int[] propIds);
    void returnSharedMemory(in IVehicleCallback callback, long sharedMemoryId);
}
```

차량 속성을 읽고(`getValues`), 쓰고(`setValues`), 변화를 구독하는(`subscribe`) 메서드 7개가 전부다. 공조 온도든 문 잠금이든 모두 "속성 ID + 값" 형태로 이 메서드들을 지나간다.

### system과 vendor의 경계

system 파티션에는 Google이 만드는 공통 Android가, vendor 파티션에는 제조사가 만드는 HAL과 하드웨어 관련 파일이 들어간다. vendor 파티션 자체는 Android 8 전에도 있었다. Android 8의 Project Treble은 system과 vendor 사이에 안정된 인터페이스를 두도록 의무화했다. Android를 업데이트할 때 제조사 부분을 다시 만들지 않아도 되게 하려는 것이다.

> "This is achieved by the introduction of a new vendor interface between the Android OS framework and the vendor implementation. The new vendor interface is validated by a Vendor Test Suite (VTS), analogous to the CTS, to ensure forward compatibility of the vendor implementation."
>
> [Here comes Treble](https://android-developers.googleblog.com/2017/05/here-comes-treble-modular-base-for.html) (Android Developers Blog, 2017)

그러려면 둘 사이의 약속이 고정돼 있어야 한다. 그 약속을 기술하는 것이 VINTF 객체다[^15]. 실제 파일 두 개로 확인할 수 있다.

vendor 쪽 manifest는 "나는 이 HAL을 이 버전으로 제공한다"고 선언한다.

```xml
<!-- /vendor/etc/vintf/manifest/vhal-emulator-service.xml -->
<manifest version="8.0" type="device">
    <hal format="aidl">
        <name>android.hardware.automotive.vehicle</name>
        <version>3</version>
        <fqname>IVehicle/default</fqname>
    </hal>
</manifest>
```

system 쪽 compatibility matrix는 "나는 이 HAL을 이 버전 범위로 받아들인다"고 선언한다.

```xml
<!-- /system/etc/vintf/compatibility_matrix.202404.xml -->
    <hal format="aidl" optional="true">
        <name>android.hardware.automotive.vehicle</name>
        <version>1-3</version>
        <interface>
            <name>IVehicle</name>
            <instance>default</instance>
        </interface>
    </hal>
```

AIDL HAL 문서가 두 파일의 역할을 그대로 정해둔다. 위 두 XML이 문서 예시와 같은 형식이다.

> "@VintfStability AIDL servers must be declared in the VINTF manifest ... AIDL clients must declare themselves in the compatibility matrix ..."
>
> "By convention, AIDL HAL services have an instance name of the format $package.$type/$instance. For example, an instance of the vibrator HAL is registered as android.hardware.vibrator.IVibrator/default."
>
> [AIDL for HALs](https://source.android.com/docs/core/architecture/aidl/aidl-hals)

둘이 맞는지는 빌드와 업데이트 때 검사한다. 인터페이스 버전은 한 번 내보내면 고정된다. AOSP에는 `aidl_api/android.hardware.automotive.vehicle/` 아래에 `1`, `2`, `3` 디렉토리로 버전별 정의가 따로 보관돼 있고, 내보낸 버전은 고칠 수 없다[^16]. AIDL 파일의 `@VintfStability`가 "파티션 경계를 넘는 안정 인터페이스"라는 표시다. 앞의 `service list`에서 VHAL 이름이 `android.hardware.automotive.vehicle.IVehicle/default`, 즉 위 문서의 "$package.$type/$instance" 형식이었던 것도 이 때문이다.

HAL을 누가 부를 수 있는지도 같은 문서에 틀이 있다. SELinux 매크로 `hal_attribute(foo)`가 `hal_foo_client`, `hal_foo_server` 두 묶음을 만들고, 각 도메인을 클라이언트나 서버 묶음에 넣는다.

> "This macro defines attributes hal_foo_client and hal_foo_server. For a given domain, the hal_client_domain and hal_server_domain macros associate a domain with a given HAL attribute. ... This means that hal_foo_client processes can get ahold of the HAL, and hal_foo_server processes can register the HAL. The enforcement of these registration rules is done by the context manager (servicemanager)."
>
> [AIDL for HALs](https://source.android.com/docs/core/architecture/aidl/aidl-hals)

VHAL이면 `hal_vehicle_client`, `hal_vehicle_server`다. 실제 기기 정책은 이 그림보다 넓어서 묶음 밖 도메인도 VHAL을 찾을 수는 있다.

Binder 장치도 셋으로 나뉜다.

```text
$ ls /dev/binderfs
binder  binder-control  binder_logs  features  hwbinder  vndbinder
```

- `/dev/binder`: 앱, 프레임워크, AIDL HAL이 쓴다. VHAL도 여기에 등록돼 있다.
- `/dev/hwbinder`: 예전 형식(HIDL) HAL용이다. `hwservicemanager`가 관리한다.
- `/dev/vndbinder`: vendor 프로세스끼리만 쓰는 통로다. `vndservicemanager`가 관리한다.

장치를 나눈 이유와 지금의 상태는 Binder IPC 문서에 있다.

> "Each binder context has its own device node and its own context (service) manager. You can access the context manager only through the device node to which it belongs ..."
>
> "In Android 10, Stable AIDL allows all processes to use /dev/binder while also solving for the stability guarantees HIDL and /dev/hwbinder solved."
>
> [Using binder IPC](https://source.android.com/docs/core/architecture/hidl/binder-ipc)

HAL 쪽에서는 hwbinder를 벗어나는 변화가 있었다. 예전 HIDL HAL은 `/dev/hwbinder`로 통했지만, Stable AIDL이 들어온 뒤로 새 HAL은 VHAL처럼 AIDL로 정의돼 `/dev/binder`에 등록되고 앞에서 본 서비스 매니저 SELinux 검사를 그대로 받는다. vndbinder는 이와 별개로 vendor 프로세스끼리 AIDL로 주고받던 통로다. 같은 문서는 이 방식이 Android 11부터 폐기됐다고 적고("This functionality is deprecated as of Android 11"), 그 대신 AIDL의 NDK, Rust 백엔드를 쓰라고 권한다.

이 분리에서 VHAL 구현(`/vendor/bin/hw/...`)은 제조사 코드다. 에뮬레이터의 VHAL은 Google의 참조 구현이고, 실제 차에서는 그 자리에 제조사가 자기 구현을 넣는다. 그 구현이 차량 네트워크와 어떻게 이어지는지도 차마다 다르다. 반면 system 쪽 코드는 Android 버전이 같으면 차종이 달라도 거의 같다. 공격자 관점에서 보면 CarService의 권한 검사 같은 system 쪽 결함은 여러 차에 공통으로 적용될 가능성이 높고, VHAL 구현의 결함은 그 제조사 차에만 해당한다.

---

## 파티션, Verified Boot, APEX, 빌드 종류

### 파티션과 Verified Boot

코드가 어디서 오고 무엇을 바꿀 수 있는지는 파티션이 정한다. system(공통 Android), vendor(제조사 HAL, 드라이버), product, system_ext(제조사가 얹는 시스템 앱과 자원), odm(ODM 커스터마이즈)로 나뉜다.

> "system_ext partition. This partition contains system resources and proprietary system modules that extend the common system image in the system partition."
>
> [Partitions overview](https://source.android.com/docs/core/architecture/partitions)

앞에서 privileged allowlist가 `/system_ext/etc/permissions`에도 있었던 게 이 파티션이다. 이 파티션들은 Verified Boot로 보호된다[^17]. [dm-verity](https://source.android.com/docs/security/features/verifiedboot/dm-verity)가 읽기 전용 파티션의 모든 블록을 해시 트리로 검증한다. 바뀐 블록을 읽었을 때 어떻게 할지는 verity 모드가 정한다. 기기에서 켜져 있는 걸 볼 수 있다.

```text
$ getprop ro.boot.veritymode          → enforcing
$ getprop partition.system.verified   → 2
```

`veritymode=enforcing`이면 fs_mgr이 dm-verity에 `restart_on_corruption`을 넘기고, init은 그 모드를 `partition.<이름>.verified`에 숫자로 적는다. 2는 fs_mgr의 `VERITY_MODE_RESTART`다. 이 모드에서는 바뀐 블록을 읽는 순간 커널이 기기를 재시작한다(`kernel_restart("dm-verity device corrupted")`).

"시스템 앱은 시스템 파티션에 있어서 일반 앱이 끼어들 수 없다"는 판단의 근거가 이것이다. 공격자가 파티션의 파일을 바꾸려면 Verified Boot부터 넘어야 하고, 이건 "재부팅 뒤에도 남기" 문제와 같은 벽이다.

### APEX와 Mainline 모듈

system 파티션 안의 일부 저수준 구성요소는 [APEX](https://source.android.com/docs/core/ota/apex)라는 서명된 모듈로 묶여 전체 OS 업데이트 없이 따로 갱신된다[^18]. 기기에 APEX가 38개 있고 attack surface와 겹치는 것이 많다.

```text
$ pm list packages --apex-only
com.android.btservices      ← 블루투스 스택
com.android.media.swcodec   ← 소프트웨어 미디어 코덱
com.android.wifi            ← Wi-Fi
com.android.adbd, com.android.art, com.android.conscrypt, ...
```

블루투스, Wi-Fi, 미디어가 전부 모듈이다. 블루투스 앱의 APK 경로를 보면 모듈 안에서 온다.

```text
$ pm path com.android.bluetooth
package:/apex/com.android.btservices/app/Bluetooth@AAI5.260516.001.A1/Bluetooth.apk
```

공격자 관점에서는 이 구성요소들이 OS 전체보다 빨리 패치될 수 있어서 1-day 수명이 짧을 수 있다. 반대로 제조사가 모듈 업데이트를 따라가지 않으면 오래된 채로 남는다. 어느 쪽인지는 실제 차의 모듈 버전을 봐야 안다.

### 빌드 종류

Android 빌드는 user, userdebug, eng로 나뉜다. 차이가 공격 모델을 바꾼다.

> "userdebug. The same as user, with these exceptions: Also installs modules tagged with debug. ro.debuggable=1. adb is enabled by default."
>
> [Build a new device](https://source.android.com/docs/setup/create/new-device)

이 에뮬레이터는 userdebug다(`ro.build.type=userdebug`, `ro.debuggable=1`). 이 글에서 관찰에 쓴 것들, 즉 `adb root`, 셸의 `su` 도메인으로 UID, SELinux context 바꾸기(권한별 Binder 호출도 이렇게 UID를 바꿔 흉내 냈다), userdebug, eng에서만 켜지는 가짜 VHAL은 전부 userdebug라서 가능한 연구자 권한이다. 양산 차의 user 빌드에는 `adb root`도 `su` 도메인도 없으니, 실제 공격자는 원하는 UID를 가진 프로세스를 먼저 장악해야 같은 자리에 선다. 그러니 이 글의 실험은 "공격자가 이미 할 수 있는 일"이 아니라 "연구자가 구조를 들여다본 결과"로 읽어야 한다.

---

## FBE와 Direct Boot

정보 유출을 따지려면 사용자 데이터가 언제 읽을 수 있는 상태가 되는지를 알아야 한다. Android는 FBE(File-Based Encryption)를 쓰고 저장 위치를 둘로 나눈다.

> "Credential Encrypted (CE) storage, which is the default storage location and only available after the user has unlocked the device. Device Encrypted (DE) storage, which is a storage location available both during Direct Boot mode and after the user has unlocked the device."
>
> [File-based encryption](https://source.android.com/docs/security/features/encryption/file-based)

CE는 사용자가 잠금을 푼 뒤에야 열리는 저장소이고(앱 데이터 대부분이 여기), DE는 부팅 직후부터 열리는 저장소다. 기기에서 두 디렉토리가 사용자마다 따로 있는 걸 볼 수 있다.

```text
$ ls -ldZ /data/user/10 /data/user_de/10
drwxrwx--x 256 system system ... /data/user/10       ← CE
drwxrwx--x 256 system system ... /data/user_de/10    ← DE
```

### Direct Boot와 CarService

부팅 직후 잠금을 풀기 전에도 돌아야 하는 component는 `android:directBootAware="true"`로 표시해 DE 저장소만 쓰며 동작한다[^19]. 차량 기능은 잠금 해제 전에도 살아 있어야 하므로 CarService가 Direct Boot 대상이다. `dumpsys` 출력을 보면 CarService에 이 플래그가 있다.

```text
$ dumpsys package com.android.car | grep privateFlags
    privateFlags=[ ... DIRECT_BOOT_AWARE PRIVILEGED ... ]
```

### 차에서 CE가 열리는 시점

CE 키는 원래 사용자의 화면 잠금 수단인 PIN, 패턴, 비밀번호(LSKF, Lock Screen Knowledge Factor)로 보호된다. 그런데 화면 잠금이 없는 사용자는 부팅하면서 CE가 자동으로 열린다. 이 에뮬레이터의 운전자(사용자 10)가 그 경우다. CE가 열린 뒤에도 그 데이터를 읽으려면 파일 권한(UID) 검사와 SELinux 검사를 둘 다 넘어야 한다.

CE 키 자체의 세기(잠금이 있을 때 TEE가 잠금 수단 추측 속도를 제한하는 방식 등)는 공개 분석이 있다[^20]. 이 글은 키 복구 대신 저장소가 언제 열려 있는지를 본다.

---

## 마치며

이 글에서는 AAOS가 Android에서 물려받은 보안 구조를 에뮬레이터 출력과 소스로 하나씩 확인했다. 프로세스가 할 수 있는 일은 UID 하나로 정해지지 않는다. Android 권한과 AppOps, Binder 서비스의 caller 검사, SELinux 도메인과 카테고리, seccomp와 capability가 겹겹이 붙는다. 그래서 같은 system UID라도 어느 사용자에서, 어떤 경로로 떴는지에 따라 닿는 범위가 달라진다. 같은 system UID 계열이어도 사용자와 도메인이 다르고, 차량 기능을 맡는 CarService와 VHAL도 시작 경로가 달라 seccomp 적용 여부가 다르다. 그러니 프로세스 이름이나 UID 하나만으로는 그 프로세스를 장악한 공격자가 무엇을 얻는지 설명할 수 없다. 공격 경로를 따질 때 어떤 버그인지만큼 그 버그가 어느 프로세스에서 터지는지를 먼저 물어야 하는 이유다.

읽어주셔서 감사합니다.

[^1]: "enabling it to leverage the existing security model", [What is Android Automotive?](https://source.android.com/docs/automotive/start/what_automotive)
[^2]: [AppOpsManager](https://developer.android.com/reference/android/app/AppOpsManager)
[^3]: [`<permission>` 요소](https://developer.android.com/guide/topics/manifest/permission-element)
[^4]: [Signature permission allowlist](https://source.android.com/docs/core/permissions/signature-permission-allowlist)
[^5]: System 항목 "CVE-2022-20223 A-223578534 EoP High", [Android Security Bulletin, July 2022](https://source.android.com/docs/security/bulletin/2022-07-01)
[^6]: Platform apps 항목 "CVE-2022-20223 A-223578534 EoP High", [Android Automotive OS Update Bulletin, December 2022](https://source.android.com/docs/security/bulletin/aaos/2022-12-01)
[^7]: "Car Service runs as 'com.android.car' process and is highly privileged. All permission checks for Car APIs are performed in Car Service.", [Car framework core](https://source.android.com/docs/automotive/car-framework-core) PDF
[^8]: [`<activity>` 요소](https://developer.android.com/guide/topics/manifest/activity-element)
[^9]: "Since Android 10 (API level 29), the platform has placed restrictions on when apps can start activities from the background.", [Activity security](https://developer.android.com/guide/components/activities/secure-bal)
[^10]: "always use an explicit intent when starting a Service and do not declare intent filters for your services", [Intents and intent filters](https://developer.android.com/guide/components/intents-filters)
[^11]: [Access to app protected components](https://blog.oversecured.com/Android-Access-to-app-protected-components/)
[^12]: [PendingIntent 위험](https://developer.android.com/privacy-and-security/risks/pending-intent)
[^13]: "SELinux neverallow rules prohibit behavior that should never occur. With compatibility testing, SELinux neverallow rules are now enforced across devices.", [Customizing SELinux](https://source.android.com/docs/security/features/selinux/customize)
[^14]: [Add system properties](https://source.android.com/docs/core/architecture/configuration/add-system-properties)
[^15]: "the vendor interface object (VINTF object), which aggregates relevant information about a device and makes that information available through a queryable API", [Vendor interface object](https://source.android.com/docs/core/architecture/vintf)
[^16]: "Starting in Android 11, the versions are frozen under aidl_api/name.", [Stable AIDL](https://source.android.com/docs/core/architecture/aidl/stable-aidl)
[^17]: [Boot flow](https://source.android.com/docs/security/features/verifiedboot/boot-flow)
[^18]: [Project Mainline](https://source.android.com/docs/core/ota/modular-system)
[^19]: [Direct Boot](https://developer.android.com/privacy-and-security/direct-boot)
[^20]: Quarkslab, "Android Data Encryption in depth", 2023, [blog.quarkslab.com](https://blog.quarkslab.com/android-data-encryption-in-depth.html)
