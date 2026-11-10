![AAOS Teardown #1 Android Security Basics](/blog/aaos-explainer/aaos_teardown_1.webp)

Hi, I'm Gnosis, a researcher at Out of Bounds. In this series, I take Android Automotive OS (AAOS) apart from an attacker's point of view. This first post covers the Android security architecture that AAOS inherits largely unchanged.

To treat AAOS as an attack target, I need to know not only which code receives input, but also the identity under which that code runs. The same bug can expose different data and services depending on the process in which it occurs. AAOS uses Android's security architecture almost unchanged to enforce these distinctions.

The process list on the vehicle emulator also contained details that names alone could not explain. One `com.android.car` process was running for user 0 and another for user 10, while CarService and CarSettings both belonged to the system UID family but ran in different SELinux domains. Descriptions such as “vehicle service” or “system privilege” were not enough to determine what each process could actually do.

This post records how I compared UIDs, Android permissions, Binder, and SELinux against both source code and device output to understand those differences. It then examines how seccomp and capabilities vary with the way a process is launched, and what boundaries exist around hardware and storage.

I ran the experiments on an Android 15 vehicle emulator (`AAI5.260516.001.A1`, userdebug). I launched it with `-read-only` so that a restart would restore the original state, and used `adb root` to look inside. For source, I read the `android-automotiveos-15.0.0_lts5` tag, which has the same security patch level.

I quote short passages from the official documentation verbatim, with links. Where AAOS documentation explains the same concept specifically for cars, I place it alongside the Android documentation. The AAOS documentation itself says that AAOS uses the existing Android security model from phones[^1].

---

## UID

On Linux, a file has an owner UID and permission bits (`rwx`), and a process accesses the file under its own UID. Android uses this mechanism for app isolation. By default, when an app is installed, Android assigns it a UID of its own and makes that UID the owner of both the app process and its data directory. The official documentation calls this structure the Application Sandbox.

> "Android assigns a unique user ID (UID) to each Android app and runs it in its own process. Android uses the UID to set up a kernel-level Application Sandbox."
>
> [Application Sandbox](https://source.android.com/docs/security/app-sandbox)

The app data directories on the vehicle emulator look like this.

```text
$ ls -lndZ /data/user/10/com.google.android.tts /data/user/10/com.android.car.carlauncher
drwx------ 8 1010218 1010218 u:object_r:app_data_file:s0:c218,c256,c522,c768  ... /data/user/10/com.google.android.tts
drwx------ 5 1010174 1010174 u:object_r:app_data_file:s0:c522,c768            ... /data/user/10/com.android.car.carlauncher
```

The permissions are `drwx------` (owner access only), and the owner differs for each app. The TTS app (UID 1010218) cannot open the launcher's directory (UID 1010174). According to the same documentation, this has been the default for apps with targetSdkVersion 24 (Android 7.0) or later; before that, it was `751` (“For apps with targetSdkVersion >= 24, default DAC permissions on an app's home dir changed from 751 to 700”). The `u:object_r:...` field on the right is the SELinux label.

### Calculating a UID

The UIDs in that output (1010218 and 1010174) are in the millions. In `/data/system/packages.list` (shown below), however, the number for the TTS app is 10218. This is because Android forms a UID by combining the user number with the app number, called the appId. `UserHandle.getUid` performs the calculation.

```java
// frameworks/base/core/java/android/os/UserHandle.java
public static final int PER_USER_RANGE = 100000;

public static int getUid(@UserIdInt int userId, @AppIdInt int appId) {
    if (MU_ENABLED && appId >= 0) {
        return userId * PER_USER_RANGE + (appId % PER_USER_RANGE);
```

The AAOS training material (the Car Framework Core PDF published on source.android.com) gives the same formula.

> "UID != User ID : uid = fn(userid, appid) = 100,000 * userid + appid"
>
> [Car framework core](https://source.android.com/docs/automotive/car-framework-core) (PDF)

The appId is what remains of the UID once the user number is removed; it identifies the app or component. A given package on a given device has the same appId for every user, and the sharedUserId packages discussed later share this number as well. The following list shows the two categories relevant here.

- **Fixed numbers (below 10000):** These are assigned in source code for system components (`system/core/libcutils/include/private/android_filesystem_config.h`). Examples include `AID_SYSTEM 1000`, `AID_BLUETOOTH 1002`, `AID_WIFI 1010`, `AID_MEDIA_EX 1040` (media extractor), `AID_VEHICLE_NETWORK 1054` (VHAL), and `AID_SHELL 2000` (adb shell).
- **Numbers assigned at installation (10000 to 19999):** When an ordinary app is installed, PackageManager assigns an unused number from this range (`AID_APP_START 10000`, `AID_APP_END 19999`). The result is recorded in `/data/system/packages.list`.

```text
$ grep ... /data/system/packages.list
com.google.android.tts    10218 ... default:targetSdkVersion=36:partition=product ...
android.car.usb.handler   10156 ... platform:privapp:targetSdkVersion=33:partition=system ...
com.android.bluetooth     1002  ... bluetooth:privapp:targetSdkVersion=35:partition=system ...
com.android.car           1000  ... platform:privapp:targetSdkVersion=33:partition=system ...
com.android.car.settings  1000  ... platform:privapp:targetSdkVersion=33:partition=system ...
```

The second column is the appId. The `platform:privapp:...` field describes the signing type and installation location; it appears again later, when we look at how the SELinux domain is chosen.

### Per-user UIDs

Android divides a single device into users so that multiple people can use it. User 0 is the system user. This emulator uses headless system user mode (`ro.fw.mu.headless_system_user=true`): user 0 performs system work in the background, while the actual driver uses user 10, so both users are active at the same time.

The same app gets a different UID for each user it runs under. The PID column changes on every boot.

```text
$ ps -A -o USER,UID,PID,NAME
u0_a226         10226   1622 com.android.providers.media.module
u10_a226      1010226   2091 com.android.providers.media.module
system           1000   1269 com.android.car
u10_system    1001000   1126 com.android.car
u10_bluetooth 1001002   1345 com.android.bluetooth
```

`u10_a226` means “app 226 for user 10.” Its appId is 10000+226=10226, and its UID is 10×100000+10226=1010226. Apps with the system UID follow the same calculation. The `com.android.car` process for user 10 has UID 1001000; it runs CarPerUserService, which handles work specific to that user. The main CarService (`.CarService`) has `android:singleUser="true"` in its manifest, so it runs only for user 0 with UID 1000.

One user-management slide in the AAOS training material presents both the formula and the in-car user arrangement.

![Users in Cars: UID formula and headless system user](/blog/aaos-explainer/carfw-s26.png)

*Source: Google, “Car Framework Core” (Google Automotive Partner Bootcamp material), page 26, “User Management in Cars.” [source.android.com/docs/automotive/car-framework-core](https://source.android.com/docs/automotive/car-framework-core)*

The text on the left says “UID != User ID : uid = fn(userid, appid) = 100,000 * userid + appid” and “In AAOS, user 0 is started first and then the current user is switched to user 10.” The diagram on the right shows the same package A running as UID 012345 for user 0 and UID 112345 for user 1. The media-provider app above (10226 and 1010226) is exactly this case. The data directories in the diagram are both labeled `data/user.1/`, but the actual paths on the device differ by user, such as `/data/user/0/...` and `/data/user/10/...`.

The same slide, however, says, “The System Server, Car Service and native services run in their own processes under the system UID.” On the device, system_server and CarService do run with UID 1000. Native services, however, do not. For example, the VHAL runs as `vehicle_network` (1054) and the Wi-Fi daemon as `wifi` (1010). When analyzing an attack path, I need to inspect each process's actual UID instead of grouping them all under “system UID.”

The same app runs under a different UID for each user and has its own data directory. At first I took this to be something like a Linux user namespace, a per-user isolated space. It works differently. In a user namespace, the kernel translates UIDs: a process that appears as 10226 inside a container is recorded under a different number outside it. Android multi-user has no such translation. It simply partitions the UID space into blocks of 100,000 per user, so an app for user 10 sees its own UID as 1010226 and the kernel uses that value as is. To the kernel, 1010226 and 10226 are simply different users. The boundary between users comes from this UID difference combined with per-user data directories (`/data/user/0/...`, `/data/user/10/...`) and the SELinux user categories.

### sharedUserId

Apps that declare the same `android:sharedUserId="..."` value in their manifests and are signed with the same key **share a single UID.** They do not receive individual UIDs; they are installed under the shared UID from the outset. This is why `com.android.car` and `com.android.car.settings` both have 1000 in `packages.list` above.

> "if this attribute is set to the same value for two or more apps, they all share the same ID, provided that their certificate sets are identical. Apps with the same user ID can access each other's data and, if desired, run in the same process."
>
> [`<manifest>` element, `android:sharedUserId`](https://developer.android.com/guide/topics/manifest/manifest-element)

The shared-user list from `dumpsys package` shows that 13 packages use `android.uid.system` (appId 1000) on this emulator.

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

The platform package (`android`) is the framework itself (`framework-res.apk`). These 13 packages share the system appId (1000). When they run for the same Android user, their full UIDs are also identical, so they share the file-owner permissions enforced by discretionary access control (DAC) and the Android permissions granted to that UID. User 0's UID 1000 must still be distinguished from user 10's UID 1001000, and even processes with the same full UID can face additional restrictions from different SELinux domains. If an attacker executes code in one of these packages, that code is effectively running in a system-UID process for that user, but it does not automatically obtain the permissions of other SELinux domains. Among vehicle-specific apps, CarSettings and CarService are in this group, which is why most published AAOS vulnerabilities in CarSettings were rated as privilege escalation. In this post, the published AAOS vulnerabilities are the 36 CVEs from the Android Automotive OS Update Bulletin that come from AAOS-specific code (vehicle apps and services such as CarSettings and CarService), classified using their CVE descriptions and fix commits.

The list also contains `com.android.car.developeroptions`. CarDeveloperOptions was copied from the phone Settings app and inherited bugs from it, resulting in seven CVEs.

The same documentation says that `sharedUserId` was deprecated in API 29 (Android 10): “This constant is deprecated as of API level 29.” API 33 (Android 13) added the `sharedUserMaxSdkVersion` attribute; an app that sets it stops using the shared UID when it is newly installed on a device whose SDK version is higher than that value. Existing system apps continue to use it, however, because “Existing apps can't remove this value, as migrating off a shared user ID isn't supported.” The 13 packages above remain for that reason.

---

## Permissions

Separating apps by UID is enough to prevent them from directly interfering with one another. But apps still need access to system-owned functions such as location, contacts, and vehicle speed. Android therefore defines string labels called permissions. An app lists the permissions it needs in its manifest with `<uses-permission android:name="..."/>`, and the system grants them to the app's UID when the applicable conditions are met. Whenever a request arrives, the service providing the function checks whether the calling UID has the required permission.

### The package that defines a permission

A package defines a permission with a `<permission>` tag in its manifest and assigns a protection level (`protectionLevel`) at the same time. The device reports the following.

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

The `gids=[3003]` on the `INTERNET` permission stands out. Some permissions add a Linux supplementary group to the UID that receives them. `INTERNET` is associated with the `inet` group (3003), with the mapping defined in `/system/etc/permissions/platform.xml`.

```xml
<permission name="android.permission.INTERNET" >
    <group gid="inet" />
</permission>
```

The groups for an ordinary app (the TTS app with UID 1010218) do in fact include 3003.

```text
$ cat /proc/<tts_pid>/status
Uid:    1010218 1010218 1010218 1010218
Groups: 3003 20218 50218 1009997
```

Older kernels used this group to block socket creation, but the enforcement point has since moved. In the Android 13 to 15 source, the Connectivity module installs a BPF program, `inet_socket_create`, in the kernel; a BPF program is a small program that the kernel verifies and then runs inside itself. This program consults a per-UID permission table (`uid_permission_map`) and rejects socket creation by apps that lack `INTERNET`. Google's Generic Kernel Image (GKI) is the kernel shared across devices, and the networking and security code in its Linux 6.6 branch for Android 15 (`android15-6.6`) contains no check that enforces this through group 3003. Either way, network access is enforced in the kernel socket layer, not by Binder permission checks.

The remaining three groups mark cache data and grant access to shared resources. Group 20218 marks the app's cache data. Group 50218 is a shared group that the app receives identically under every user, so no user number is added (`getSharedAppGid(getAppId(uid))`). Group 1009997 is shared by every app belonging to user 10 and is derived from `AID_EVERYBODY` (9997); see `android_filesystem_config.h` and `ProcessList.computeGidsForProcess`.

The grant conditions for each protection level are as follows.

- **normal:** Granted at installation when listed in the manifest. `CAR_INFO`, which covers basic information such as manufacturer and model, is one example.
- **dangerous:** Listed in the manifest, then requested by the app at runtime and granted by the user through a dialog. `CAR_SPEED` is one example.
- **signature**, **privileged:** Explained separately below. `signature|privileged` means that satisfying either side is sufficient. However, when a privileged app requests such a permission defined by the platform package (`android`) or the CarService package, an allowlist is required even if the signature matches (see the privileged subsection below).

The developer documentation groups these into install-time permissions (normal and signature), runtime permissions (that is, dangerous), and special permissions.

> "These permissions allow access to data and actions that extend beyond your app's sandbox but present very little risk to the user's privacy and the operation of other apps. The system assigns the normal protection level to normal permissions."
>
> "Runtime permissions, also known as dangerous permissions, give your app additional access to restricted data or let your app perform restricted actions that more substantially affect the system and other apps."
>
> [Permissions on Android](https://developer.android.com/guide/topics/permissions/overview)

The documentation also defines the `signature|privileged` notation: signature is the base type and privileged is an attached flag (“a combination of the ‘signature’ base permission type and the ‘privileged’ flag”). Its older name, `signatureOrSystem`, was deprecated in API 23[^3].

AppOps adds another layer of checks independent of permissions[^2]. For some sensitive operations (drawing over other windows, accessing background location, reading usage history, and so on), AppOps keeps a separate mode (allow, ignore, or default) that applies even when the permission has been granted. On the device, it looks like this.

```text
$ cmd appops get --user 10 com.google.android.tts SYSTEM_ALERT_WINDOW
SYSTEM_ALERT_WINDOW: default; rejectTime=...
```

Both the permission and AppOps must allow the operation. Service analysis therefore needs to consider AppOps alongside permissions. Tapjacking, in which an attacker overlays a window so that the user presses a button they cannot see, relies on `SYSTEM_ALERT_WINDOW`. It is the largest class among published AAOS vulnerabilities.

### Signature permissions

An APK is signed with the developer's private key. Android verifies the signature during installation and remembers the app's signing certificate. A signature permission is granted according to the app's signing relationships. The check passes not only when the app has a qualifying signing relationship with the package that defines the permission, but also when it has certain relationships with the platform package. The relevant code is as follows.

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

The first branch examines the signing relationship with the package that defined the permission. The second and third examine the relationship with the platform package (`android`). The check considers not only whether the current certificates match, but also signing history and trust conditions during key rotation. `CertCapabilities.PERMISSION` in this code refers to permission trust in that signing relationship; it is unrelated to Linux capabilities. The developer documentation likewise defines the app and OS cases.

> "The system grants a signature permission to an app only when the app is signed by the same certificate as the app or the OS that defines the permission."
>
> [Permissions on Android](https://developer.android.com/guide/topics/permissions/overview)

The documentation's “or the OS” corresponds to the second and third branches in the code. Consequently, an app signed with the **platform key** (the key used to sign the platform package, `android`) passes this signature check even if it is not signed with the same key as the package that defined the permission. Additional conditions, including the allowlist below, still apply to the actual permission grant. Android 15 adds one condition on user builds: if an app is signed with the platform key but is not a system app, it must appear in the manufacturer's allowlist to receive a signature permission defined by the platform package[^4]. This emulator is a userdebug build, so it does not apply that condition. Which apps can obtain permissions this way therefore depends on which apps the manufacturer signs with the platform key and which apps it places in that allowlist.

CVE-2023-20927 involves this rule. Vehicle permissions are defined by the updatable CarService package, which is signed with a separate key rather than the platform key. On this emulator, `com.android.car` has signature `b4addb29`, while `com.android.car.updatable` has `d7f1f224`. Under the check above, apps signed with the same key as the updatable package can also receive signature permissions defined by that package. The published description is a single line, “there is a possible way to grant signature permissions due to a permissions bypass,” so the exact exploitation method is not public. The fix commit (`198e836b08bb`, “Moved Signature permission to built-in service”) moved signature-only permissions to the platform-signed `com.android.car` side and left this comment in the manifest.

```xml
<!-- service-builtin/AndroidManifest.xml -->
<!-- Do not add any new permission here.
     Update ../service/AndroidManifest instead (Except signature only permission).
     Signature only permission should be associated with platform signature, not module
     signature. -->
<permission android:name="android.car.permission.BIND_PROJECTION_SERVICE"
     android:protectionLevel="signature" .../>
```

### Privileged permissions and the allowlist

Privileged permissions are granted on the basis of **installation location and an allowlist**, rather than a signature.

> "Privileged apps are system apps located in a priv-app directory on a system image partition."
>
> [Privileged permission allowlisting](https://source.android.com/docs/core/permissions/perms-allowlist)

There are three conditions.

1. The app is preinstalled in the system image. User-installed apps do not qualify.
2. It is installed in a privileged-app directory, such as `/system/priv-app`, `/product/priv-app`, or `/system_ext/priv-app`.
3. An allowlist XML file on the device (such as `/system/etc/permissions/*.xml` or `/product/etc/permissions/privapp-permissions-*.xml`) lists that permission for that app.

Here is how the vehicle launcher (`com.android.car.carlauncher`) ends up with the climate-control permission.

```text
$ dumpsys package com.android.car.carlauncher
    codePath=/system/priv-app/GASCarLauncher
    privateFlags=[ ... PRIVILEGED ... ]
    signatures=PackageSignatures{... signatures:[b4addb29] ...}
      android.car.permission.CONTROL_CAR_CLIMATE: granted=true

$ grep -n CONTROL_CAR_CLIMATE /system/etc/permissions/com.android.car.carlauncher.xml
32:        <permission name="android.car.permission.CONTROL_CAR_CLIMATE"/>
```

The launcher is also signed with the platform key. Even so, it needs an allowlist entry to receive this permission. When granting install permissions, the lts5 `PermissionManagerServiceImpl` requires `bp.isSignature() && (!bp.isPrivileged() || present in the allowlist)`. The launcher is a privileged app, and `CONTROL_CAR_CLIMATE` is a `signature|privileged` permission defined by the CarService package, so it is subject to the allowlist check in the code below. Line 32 of the allowlist file above is the actual basis for the grant.

The allowlist file must be on the same partition as the app (“The privapp-permissions.xml file can only grant or deny permissions for privileged apps on the same partition”). Accordingly, the launcher is in `/system/priv-app`, and the allowlist is in `/system/etc/permissions`. The documentation names `/system`, `/product`, and `/vendor` as target partitions, while this device also has allowlists under `/system_ext/etc/permissions`, such as `com.android.carsystemui.xml`.

Whether the allowlist is actually enforced is controlled by `ro.control_privapp_permissions`. Its value on this device is `enforce`. The documentation describes what happens when the allowlist is incomplete.

> "As of Android 9, implementors can explicitly grant or deny all privileged permissions. If privileged permissions are not granted, the device won't boot."
>
> [Privileged permission allowlisting](https://source.android.com/docs/core/permissions/perms-allowlist)

The AAOS training material includes both a vehicle-permission example and the actual error message. Its allowlist example uses `CONTROL_CAR_CLIMATE` itself.

![Privileged Permissions: privapp-permissions XML example](/blog/aaos-explainer/carfw-s23.png)

*Source: Google, “Car Framework Core” (Google Automotive Partner Bootcamp material), page 23, “Privileged Permissions.” [source.android.com/docs/automotive/car-framework-core](https://source.android.com/docs/automotive/car-framework-core)*

The XML format on the slide matches the `/system/etc/permissions/com.android.car.carlauncher.xml` file observed above. The `prebuilt_etc`/`android_app` blocks below it show how a manufacturer includes the allowlist file when building an app. If the file is omitted, system_server crashes during boot with the following error (page 24 of the same material).

```text
java.lang.IllegalStateException: Signature|privileged permissions not in
privapp-permissions allowlist: {com.android.car.messenger
(/system/priv-app/CarMessengerApp):
android.car.permission.ACCESS_CAR_PROJECTION_STATUS}
```

([Car framework core](https://source.android.com/docs/automotive/car-framework-core) PDF, “Privileged Permissions” section)

Not every privileged permission passes through this allowlist. A note in the same documentation narrows the scope.

> "Note: Permissions defined by the core platform (the android package) and CarService (com.android.car.updatable) must be allowlisted. Privileged permissions defined by device manufacturers are automatically granted."

The lts5 code implements exactly that. An allowlist check is required only when the package defining the permission is `android`, or, on an automotive device, when it is the package named by `ro.android.car.carservice.package`.

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
            return true;                       // Permissions defined by other packages pass without an allowlist
        }
        ...
        // Only enforce the allowlist on boot
        if (!mSystemReady) {
```

The code shows that vehicle permissions (defined by `com.android.car.updatable`) are genuinely constrained by the allowlist. A privileged permission defined by a manufacturer's own package is granted to any privileged app that requests it, with no allowlist entry needed. If a manufacturer protects a vehicle function with a permission of its own, the set of apps holding that permission becomes “every privileged app that requests it.” The boot-blocking check runs only before `mSystemReady` is set. After that, a violation simply means the permission is silently withheld in `enforce` mode (the function ends with `return !RoSystemProperties.CONTROL_PRIVAPP_PERMISSIONS_ENFORCE;`). The final section of the same documentation still contains the sentence “Allowlisting is required only for permissions declared by apps with package="android",” which conflicts with the note above. In the actual code, permissions defined by the CarService package are also subject to the allowlist.

On this emulator, `CONTROL_CAR_CLIMATE` is held by the launcher, the vehicle assistant (`com.google.android.carassistant`), shell, SystemUI, and the `com.google.uid.shared` shared user. Every system-UID app is effectively added to that set. This is because the Context permission-checking path used by CarPropertyService has a special branch that allows the system appId.

### Three paths to high privilege

An ordinary app installed from a store (a third-party app) is neither present in the system image nor signed with the platform key, so it can receive only normal and dangerous permissions. Matching the read and write permissions CarService requires for each of the emulator's 273 vehicle properties (`CarSvcProps.json`) against the device's protection level for each permission (`pm list permissions -g -f`) shows that all 136 writable vehicle properties require `signature|privileged` permissions. No property is writable with the permissions available to an ordinary app.

A deep link does not cross this boundary. A deep link is a URL-shaped intent (an execution-request message exchanged between apps) that opens a screen in another app. The opened screen runs with that app's own UID and permissions, but those permissions do not transfer to the requesting app. This is, however, where one attack path begins. When a highly privileged app accepts an external intent or URI and acts on it with its own permissions without validating it, the app becomes a confused deputy: the attacker uses it to perform operations that require permissions the attacker does not hold.

The Application Sandbox documentation says that escaping the sandbox generally requires compromising the kernel.

> "Generally, to break out of the Application Sandbox in a properly configured device, one must compromise the security of the Linux kernel. However, similar to other security features, individual protections enforcing the app sandbox are not invulnerable ..."
>
> [Application Sandbox](https://source.android.com/docs/security/app-sandbox)

Breaking the boundary of one's own process is indeed a kernel problem in the sense described there. The first two paths below, however, do not break the sandbox. They borrow another process's permissions by causing code in that process to use them. Of the 36 published AAOS vulnerabilities, seven are confused deputies, eight omit or bypass caller or permission checks, and two are memory bugs (one heap out-of-bounds read and one double free in a kernel USB CAN driver that requires a physically attached adapter).

That leaves an ordinary app three paths to high privilege. The first two have real examples among published AAOS vulnerabilities.

1. **Use a privileged app as a confused deputy.** CVE-2021-1035 was a flaw in `BluetoothDevicePickerPreferenceController.setLaunchIntent` in CarSettings (system UID) that let an attacker invoke an attacker-selected broadcast receiver with system permissions. CVE-2022-20223 is a bug in the phone Settings `AppRestrictionsFragment` that survived in the CarDeveloperOptions copy; it allowed any activity to be launched with system permissions, and thus a phone call to be placed without permission. The phone issue appeared in the System section of the general July 2022 Android bulletin[^5], and the vehicle issue appeared under the same CVE in the December 2022 AAOS bulletin[^6]. The bulletins contain no commit link; the fix I found through the bug ID is `5c5b062147e7`, which modifies `packages/services/Car/tests/CarDeveloperOptions`.
2. **Find a missing permission check in a service.** CVE-2025-26418 was a missing permission check in `CarDevicePolicyService.setUserDisclaimerAcknowledged` in CarService, allowing any app to bypass the user-confirmation screen shown on a managed device.
3. **Execute code inside a process that has the permission.** Taking control of a process through a memory-corruption bug or similar flaw gives the attacker that process's UID, permissions, and SELinux domain. The Bluetooth app (`com.android.bluetooth`), for example, runs as the `android.uid.bluetooth` shared user (appId 1002) and has permissions such as `BLUETOOTH_PRIVILEGED` and `MODIFY_PHONE_STATE`, as well as Linux capabilities such as NET_ADMIN and NET_RAW. One memory bug in an automotive bulletin, CVE-2021-39677, was a heap out-of-bounds read in the EVS manager, the native service that handles external camera video; the bulletin classifies it as information disclosure (ID). An out-of-bounds read does not provide code execution by itself. In an exploit chain, it may serve as the step that obtains information such as an address.

---

## Binder and system services

I now know which UIDs received which permissions. The next question is how the service providing a function learns the requester's UID. Which code to examine depends on whether the service trusts an identity value carried in the request or obtains the caller's identity from the call path itself. On Android, Binder provides that call path.

### System services

When an app asks for its current location, the location service (not the app process) performs the actual work. A system service is an object that implements a particular interface and lives in a different process from the app. Most system services are collected in one process called `system_server`: the activity service (app startup and lifecycle), the package service (installation and permissions), the window service, the location service, and others. CarService, which provides vehicle functions, lives in a separate `com.android.car` process. Each HAL that handles hardware also has its own process.

```text
$ ps -A -o LABEL,USER,UID,PID,PPID,NAME
u:r:system_server:s0       system          1000  708  416 system_server
u:r:carservice_app:s0      system          1000 1269  416 com.android.car
u:r:hal_vehicle_default:s0 vehicle_network 1054  222    1 android.hardware.automotive.vehicle@V3-emulator-service
```

For an app to call a method on one of these objects, the call must cross a process boundary.

> "On Android, one process can't normally access the memory of another process. To talk, they need to decompose their objects into primitives that the operating system can understand and marshall the objects across that boundary for you."
>
> [Android Interface Definition Language (AIDL)](https://developer.android.com/develop/background-work/services/aidl)

Binder is Android's mechanism for these inter-process calls. It consists of a kernel driver (`/dev/binder`) and a user-space library (`libbinder`). A service process starts several Binder threads and waits for requests on them. This emulator's `system_server` has 32 Binder threads. The documentation likewise says that remote calls arrive concurrently through this thread pool (“Calls from a remote process are dispatched from a thread pool the platform maintains inside your own process. Be prepared for incoming calls from unknown threads, with multiple calls happening at the same time.”). If service code mishandles this concurrency, it can create a race condition bug.

### Service manager

An app does not inherently know which object inside `system_server` is the location service. A separate registry maps names to objects: the `servicemanager` process (UID system, SELinux domain `servicemanager`). In Binder, handle 0 always points to this process, so every process can contact it from the outset.

- When a service starts, it registers itself by calling `addService("name", object)`. CarService registers under the name `car_service`.
- An app calls `getService("name")` to receive a Binder reference to that object.

The registered objects can be viewed with `service list`. When I counted them on this emulator, there were 288.

```text
$ service list
5	activity: [android.app.IActivityManager]
26	android.hardware.automotive.vehicle.IVehicle/default: [android.hardware.automotive.vehicle.IVehicle]
98	car_service: [android.car.ICar]
199	package: [android.content.pm.IPackageManager]
```

The name in brackets is the interface implemented by the object. When registration or lookup is requested, the service manager uses SELinux policy to decide whether the process may register or look up that name (`canAdd` and `canFind` in `frameworks/native/cmds/servicemanager/Access.cpp`). The `service_contexts` file assigns a label to each name.

> "service_contexts assigns labels to Android binder services to control what processes can add (register) and find (lookup) a binder reference for the service. This configuration is read by the servicemanager process during startup."
>
> [Implementing SELinux](https://source.android.com/docs/security/features/selinux/implement)

To run experiments as an ordinary app, I constructed an ordinary app identity as follows. From a root shell, I used `su 1010218` to change the UID to that of the TTS app, then changed the shell's SELinux context to `untrusted_app` by writing to `/proc/self/attr/current`. This was not an actual app process, but the calling UID and SELinux context observed by the service manager and CarService were the same as those of an actual ordinary app. Every ordinary-app experiment in this section used this identity.

Under this ordinary app identity, `car_service` can be found but the VHAL cannot.

```text
$ service check car_service
Service car_service: found
$ service check android.hardware.automotive.vehicle.IVehicle/default
Service android.hardware.automotive.vehicle.IVehicle/default: not found

$ logcat -d | grep avc
SELinux: avc:  denied  { find } for pid=4804 uid=1010218 name=android.hardware.automotive.vehicle.IVehicle/default scontext=u:r:untrusted_app:s0:c218,c256,c522,c768 tcontext=u:object_r:hal_vehicle_service:s0 tclass=service_manager permissive=0
```

The service manager, not the kernel, makes this denial decision and writes it to logcat under the `SELinux` tag and to the event log. This is why the denial is found in logcat rather than `dmesg`.

### AIDL

An AIDL (Android Interface Definition Language) file defines what can be called through Binder. The actual definition of `android.car.ICar`, implemented by `car_service`, is as follows.

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

At build time, the AIDL compiler generates two classes from this file (“This interface has an inner abstract class named Stub”). The app-side Proxy converts a method call into a byte sequence and sends it. The service-side Stub decodes that byte sequence and invokes the real implementation, such as `ICarImpl.getCarConnectionType()`.

One sentence in the AOSP documentation deserves an attacker's attention.

> "AIDL can be used between any process in Android: between platform components or between apps. However, it is never used as an API for apps."
>
> [AIDL overview](https://source.android.com/docs/core/architecture/aidl)

`ICar` is also an internal interface marked `/** @hide */` in source, so it does not appear in the SDK documentation; app developers use Java APIs such as `Car` and `CarPropertyManager`. But “not an API for apps” is only a documentation contract, not access control. As the experiment below shows, an ordinary app identity can directly call Binder methods on `car_service`. The security boundary lies at each individual AIDL method, not at the public API. Each method has a number called a transaction code. For a method declared with an explicit `= 12`, the code is `FIRST_CALL_TRANSACTION` (1) + 12 = 13. Ultimately, the app sends a message that says, in effect, “code 13, with these arguments.”

The `getCarService` method accepts a name and returns another Binder object. The app obtains only `car_service` from the service manager; it then uses this method to get the individual services for vehicle properties, audio, power, and other functions.

### Parcel

A Parcel is the serialization format that carries method arguments and return values.

> "Container for a message (data and object references) that can be sent through an IBinder. A Parcel can contain both flattened data ... and references to live IBinder objects that will result in the other side receiving a proxy IBinder connected with the original IBinder in the Parcel. Parcel is not a general-purpose serialization mechanism."
>
> [Parcel](https://developer.android.com/reference/android/os/Parcel)

What matters here is that a Parcel can carry not only values but also references to Binder objects. The response from `getCarService("property")` contains a reference to the property-service object, which the caller receives as a proxy (`BinderProxy`) object and then calls into.

As for the layout, every value is aligned to a 4-byte boundary. An integer occupies 4 bytes. A string (String16) is laid out as “4-byte character count + UTF-16 characters + terminating zero + padding to 4 bytes.”

- A **request Parcel** begins with an interface token. `Parcel::writeInterfaceToken` writes, in order, a 4-byte StrictMode policy, a 4-byte work-source UID, a 4-byte `SYST` header, and the interface-name string (`android.car.ICar`). The service first verifies that this name matches its interface, then reads the arguments in order.
- A **reply Parcel** begins with a 4-byte exception code. A value of 0 (`EX_NONE`) means success, while -1 (`EX_SECURITY`) denotes a security exception such as permission denial. The return value follows.

The `service call` command sends a transaction directly from the shell and displays the reply Parcel in hexadecimal. I sent two calls to `car_service` under the ordinary app identity.

```text
$ service call car_service 13          # getCarConnectionType()
Result: Parcel(00000000 00000005   '........')
```

`00000000` means no exception, and `00000005` is the return value 5. The source defines `Car.CONNECTION_TYPE_EMBEDDED = 5`, meaning “Android embedded in the vehicle.”

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

`ffffffff` is -1, indicating a `SecurityException`. It is followed by the character count `0x34` (52) and the message “requires android.car.permission.CONTROL_CAR_FEATURES” in UTF-16. This permission's protection level is `signature|privileged`. Sending the same call from a root shell (UID 0) produces a different result.

```text
$ service call car_service 17          # from the root shell
Result: Parcel(
0x00000000: 00000000 00000022 0000000a 00720070 '....".......p.r.'
0x00000010: 006a006f 00630065 00690074 006e006f 'o.j.e.c.t.i.o.n.'
0x00000020: 00000000 0000000d 00610063 005f0072 '........c.a.r._.'
...
```

This decodes as no exception (0), list length `0x22` (34 entries), the first entry “projection” (10 characters), and the second entry “car_bluetooth” (13 characters).

### Calling identity

The same call produced different results because CarService knew who had called it. That information is not inside the Parcel. When the kernel Binder driver creates a transaction, it records the sending process's UID itself.

```c
// kernel/common (android15-6.6) drivers/android/binder.c, binder_transaction()
	t->from_pid = proc->pid;
	t->from_tid = thread->pid;
	t->sender_euid = task_euid(proc->tsk);
```

The callee's libbinder stores these values in per-thread variables, and service code retrieves them with `Binder.getCallingUid()`.

```cpp
// frameworks/native/libs/binder/IPCThreadState.cpp, handling BR_TRANSACTION in executeCommand()
            mCallingPid = tr.sender_pid;
            ...
            mCallingUid = tr.sender_euid;
```

> "Return the Linux UID assigned to the process that sent you the current transaction that is being processed. This UID can be used with higher-level system services to determine its identity and check permissions."
>
> [Binder.getCallingUid()](https://developer.android.com/reference/android/os/Binder)

No matter how the sender constructs the Parcel contents, it cannot change this UID. In contrast, values inside the Parcel, such as a package name or user number passed as an argument, are under the sender's control. If a service trusts a package name supplied as an argument without comparing it with the calling UID, that is a bug.

PIDs are another matter. The same reference documentation warns about `getCallingPid()`.

> "Warning do not use this as a security identifier! PID is unreliable as it may be re-used. This should mostly be used for debugging. oneway transactions do not receive PID. Even if you expect a transaction to be synchronous, a misbehaving client could send it as a asynchronous call and result in a 0 PID here."

A `oneway` call does not wait for a reply (“When it is used, a remote call does not block. It sends the transaction data and immediately returns.”). Even if a method is declared synchronous, a caller can send it with the `oneway` flag, and the service then sees PID 0. Any service code that identifies its caller by PID therefore deserves scrutiny. Code that compares PIDs, such as `checkComponentPermission` (shown below), must also be examined for how it behaves when the PID is 0 or has been reused.

### Permission checks by the callee

It is up to the service to decide which methods check permissions against the Binder-supplied UID. This is a separate layer from the SELinux check on the Binder call itself. In the experiment above, the difference between `getCarConnectionType` being allowed and `getAllEnabledFeatures` being denied comes from the service code.

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

The first method returns the vehicle connection type without a separate permission check. The second delegates the check to the controller. If a required check is missing from a method that should be protected, the operation becomes available to any client that can obtain the service reference and call it. CVE-2025-26418, described earlier, was such a case. Not every unchecked method is vulnerable, however, and not every app can necessarily call it directly. The basic task in analyzing a service is therefore to enumerate the AIDL methods and determine which checks apply to each one.

### checkCallingOrSelfPermission and clearCallingIdentity

Services use two similarly named functions for permission checks: `checkCallingPermission` and `checkCallingOrSelfPermission`. Their implementations make the difference clear.

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

`checkCallingPermission` denies the request when the caller is the process itself, that is, when it is not handling a Binder request. `checkCallingOrSelfPermission` makes no such distinction and checks whichever UID `getCallingUid()` currently returns. The reference documentation explains the same difference and attaches a warning to the latter.

> checkCallingPermission: "One important difference is that if you are not currently processing an IPC, this function will always fail. This is done to protect against accidentally leaking permissions; you can use checkCallingOrSelfPermission(String) to avoid this protection."
>
> checkCallingOrSelfPermission: "This is the same as checkCallingPermission(String), except it grants your own permissions if you are not currently processing an IPC. Use with care!"
>
> [Context](https://developer.android.com/reference/android/content/Context)

What does `getCallingUid()` return when the thread is not processing a Binder request? The reference documentation says, “If the current thread is not currently executing an incoming transaction, then its own UID is returned.” At the code level, libbinder fills the caller fields with the process's own values when there is no request.

```cpp
// IPCThreadState.cpp
void IPCThreadState::clearCaller()
{
    mCallingPid = getpid();
    mCallingSid = nullptr;  // expensive to lookup
    mCallingUid = getuid();
}
```

`Binder.clearCallingIdentity()` relies on the same function. Suppose a service, while handling another process's request, calls another object in the same process and wants that object's permission check to see the service's own identity. It then calls `Binder.clearCallingIdentity()`. This saves the current calling UID in a token and uses `clearCaller()` to replace the caller fields with the service's own UID. When the work is complete, `restoreCallingIdentity(token)` restores the original values. For a Binder request sent to another process, the kernel inserts the sending process's UID, so the process on the other end sees the service's own UID regardless of this function.

> "Reset the identity of the incoming IPC on the current thread. This can be useful if, while handling an incoming call, you will be calling on interfaces of other objects that may be local to your process and need to do permission checks on the calls coming into them (so they will check the permission of your own local process, and not whatever process originally called you)."
>
> [Binder.clearCallingIdentity()](https://developer.android.com/reference/android/os/Binder)

The documentation explains the purpose of this function but does not explicitly state the ordering rule “finish checking the caller before clearing the identity.” It is up to the code to follow that order. Here is a correct example from CarService.

```java
// packages/services/Car/service/src/com/android/car/CarOccupantZoneService.java
    public int assignVisibleUserToOccupantZone(int occupantZoneId, UserHandle user) {
        CarServiceUtils.assertAnyPermission(mContext, android.Manifest.permission.MANAGE_USERS,
                Car.PERMISSION_MANAGE_OCCUPANT_ZONE);           // 1. Check the caller's permission
        Preconditions.checkNotNull(user);
        long token = Binder.clearCallingIdentity();             // 2. Switch to my own identity
        try {
            return assignVisibleUserToOccupantZoneUnchecked(occupantZoneId, user);  // 3. Perform the operation
        } finally {
            Binder.restoreCallingIdentity(token);               // 4. Restore the original identity
        }
    }
```

If steps 1 and 2 were swapped, the permission check would use CarService's own UID. CarService has the system UID, and the system UID passes the check unconditionally. Following the permission-decision path to its end reveals that special case.

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

If the appId is 0 (root) or 1000 (system), the code grants access without even examining the permission name. The root shell's `getAllEnabledFeatures` call above also passed at this check.

The same problem can take other forms. The caller fields belong to a thread, not a process, so the UID used for a decision depends on the thread and state in which the check runs.

- **Checking on a Handler thread:** If a service receives a request on a Binder thread, hands it to an internal worker thread (a Handler), and checks there, that thread is not processing a Binder request. `getCallingUid()` therefore returns the service's own UID.
- **Directly calling an AIDL method in the same process:** A local call executes directly on the calling thread (“Calls made from the local process execute in the same thread that is making the call.”, AIDL documentation). If it is made from the Binder thread handling an app's request, the called method's check also sees the app's UID.
- **Calling after clearing the identity:** If the caller first invoked `clearCallingIdentity()`, the called method's check uses the service's own UID.

When dozens of services share one process, as they do in CarService, the third case creates paths in which one service clears the identity and directly calls a method on another service. If the callee uses a check shaped like `checkCallingOrSelfPermission`, it passes under the system UID.

This matters especially in a vehicle: CarService checks vehicle-property permissions with exactly this kind of check (`checkCallingOrSelfPermission`, below), and the AAOS training material states that every permission check for the vehicle APIs happens inside CarService[^7].

```java
// packages/services/Car/service/src/com/android/car/hal/property/PropertyPermissionInfo.java
    public static final class SinglePermission implements PermissionCondition {
        ...
        public boolean isMet(Context context) {
            return context.checkCallingOrSelfPermission(mPermission)
                    == PackageManager.PERMISSION_GRANTED;
        }
```

For this check to work correctly, it must run *on the Binder thread, before clearing the calling identity*.

---

## App components and intents

So far, I have examined direct Binder calls between processes. Apps also use a looser path: components and intents. Of the 36 published AAOS vulnerabilities, 22 (including two whose affected component was inferred) came from a single app, CarSettings, and seven confused-deputy vulnerabilities entered through this path. Understanding this side is necessary to map the attack surface.

### The four component types and `exported`

Android apps are built from four types of components: an activity (one screen), a service (background work), a broadcast receiver (an entry point that receives events), and a content provider (an interface that exposes data to other apps). Each component has an `android:exported` attribute that determines whether other apps may access it[^8]. Since Android 12, this value must be explicitly declared for components that have intent filters.

> "If your app targets Android 12 or higher and contains activities, services, or broadcast receivers that use intent filters, you must explicitly declare the android:exported attribute for these app components."
>
> [Behavior changes: Android 12](https://developer.android.com/about/versions/12/behavior-changes-12)

An exported activity with no permission requirement is a screen that another app can open directly. Because CarSettings has the system UID, those screens run with the system UID.

I tested this on the device. I wrote a small program that invokes `IActivityTaskManager.startActivity` through reflection and ran it under the ordinary app UID (the TTS app, 1010218) to open CarSettings components.

```text
## target: com.android.car.settings/.common.CarSettingActivities$WifiSettingsActivity   (exported)
uid=1010218 result=0
ActivityTaskManager: Background activity launch blocked! [callingPackage: com.google.android.tts; ... callingUidHasVisibleActivity: false; ...
ActivityTaskManager: START u10 {... cmp=com.android.car.settings/.common.CarSettingActivities$WifiSettingsActivity} with LAUNCH_MULTIPLE from uid 1010218 (BAL_BLOCK) result code=102

## target: com.android.car.settings/.security.ChooseLockPinActivity   (private)
uid=1010218 java.lang.SecurityException: Permission Denial: starting Intent { flg=0x10000000 cmp=com.android.car.settings/.security.ChooseLockPinActivity } from null (pid=3980, uid=1010218) not exported from uid 1001000
```

(Only the relevant lines from the call result and system_server log are reproduced.)

The two requests were stopped at different checks. ActivityManager rejected the private screen at the export check with “not exported from uid 1001000.” The exported screen passed the export check, and the call returned `result=0`, but the next stage, the Background Activity Launch (BAL) restriction, blocked it, so the screen never actually appeared. Because the request came from a process with no visible screen, the log recorded `callingUidHasVisibleActivity: false`, and BAL denied the launch on that basis. Since Android 10, apps with no visible window have been blocked in this way from launching screens from the background[^9]. I did not test what happens when the same request comes from an app the user can see. For an ordinary app to actually bring up that screen, it must satisfy the BAL conditions as well as pass the export check.

The system UID bypasses the export check entirely. The export check used when launching an activity goes through the `checkComponentPermission` seen earlier; the first check inside `ActivityManager.checkComponentPermission`, `canAccessUnexportedComponents`, allows access regardless of the target app when the appId is root (0) or system (1000). Consequently, an attacker with code execution in any of the 13 packages sharing the system UID would pass the export check for private activities in every app, not just CarSettings. I did not test this behavior.

### Explicit and implicit intents

An intent is the message used to invoke a component. It is explicit when it names the receiving component, and implicit when it specifies only an action or data type and lets the system select the target. Another app that registers itself to handle the same action or data type can intercept an implicit intent.

> "If the intent contains any private data, then data can be leaked to third-party apps installed on the same device when implicit intents are used."
>
> (Oversecured, "Interception of Android implicit intents", 2020, [blog.oversecured.com](https://blog.oversecured.com/Interception-of-Android-implicit-intents/))

The official documentation also warns that a service should always be invoked with an explicit intent[^10].

### Intent redirection

Earlier, I described how a privileged app can be abused as a confused deputy. Intent redirection is one concrete form of that pattern. Because an intent is serialized into a Parcel, one intent can carry another intent inside it. If a privileged app passes an externally supplied intent directly to a function such as `startActivity` without validation, the attacker can make that app open an arbitrary component under its own identity.

> "An intent redirection occurs when an attacker can partly or fully control the contents of an intent used to launch a new component in the context of a vulnerable app."
>
> [Intent redirection](https://developer.android.com/privacy-and-security/risks/intent-redirection)

Oversecured describes the impact: “an attacker can force the app to launch a non-exported component that cannot be launched directly ... or to grant the attacker access to its content providers”[^11]. In other words, going through a confused deputy lets an attacker cross the “not exported” barrier observed above. Published vulnerabilities of this type include CVE-2021-1035, in which CarSettings invoked a caller-specified broadcast receiver with system permissions, and CVE-2022-20223, a bug inherited from phone Settings that survived in CarDeveloperOptions and let any activity be launched with system permissions.

### PendingIntent

A PendingIntent is a token that says, in effect, *this intent may be executed later under my identity*. Its recipient executes the intent with the UID and permissions of the app that issued the token.

> "By giving a PendingIntent to another application, you are granting it the right to perform the operation you have specified as if the other application was yourself (with the same permissions and identity)."
>
> [PendingIntent](https://developer.android.com/reference/android/app/PendingIntent)

The intent inside the token should therefore name its target explicitly. If the target is left blank and the token is mutable (`FLAG_MUTABLE`), an attacker who receives it can fill in the missing fields and open an arbitrary component with the permissions of the app that created the token. If the creator is a system app, those are system permissions. Because of this risk, Android 12 began requiring an explicit choice between `FLAG_MUTABLE` and `FLAG_IMMUTABLE`[^12].

### Content providers and URI permissions

A content provider exposes data through URIs (`content://...`). URI permission delegation temporarily grants another app access to a specific URI. Access control can be bypassed if a privileged app accepts an attacker-supplied URI and reads it without validation, or grants overly broad access to one of its own URIs.

> "If the grantUriPermissions attribute is true, permission can be granted for any of the data under the provider's purview."
>
> [`<grant-uri-permission>`](https://developer.android.com/guide/topics/manifest/grant-uri-permission-element)

Published vulnerabilities in this class include CVE-2021-0481, which abused the result URI returned when changing the user photo to reach an otherwise inaccessible file, and CVE-2022-20144, which exposed data from a system content provider.

The Binder method checks seen earlier form a barrier against direct calls; calls through a confused deputy instead enter through the component, intent, and URI surfaces described here. These surfaces account for the seven confused-deputy vulnerabilities mentioned at the start of this section. The largest group of published AAOS vulnerabilities, 10 tapjacking vulnerabilities, consists of screen-overlay issues that intercept a user's tap by placing another window over the target. These relate to the AppOps operation `SYSTEM_ALERT_WINDOW` discussed earlier.

---

## SELinux

UIDs and Android permissions do not fully describe what a process can do. CarSettings and CarService both belong to the system UID family, but their SELinux domains on the device were `system_app` and `carservice_app`, respectively. Whether the two processes can access the same target must be checked independently of their UIDs. The same applies to root. Even when a process has a capability such as `DAC_OVERRIDE`, which bypasses file permission bits, SELinux policy still governs the use of that capability, and Android runs SELinux in enforcing mode.

> "Android uses Security-Enhanced Linux (SELinux) to enforce mandatory access control (MAC) over all processes, even processes running with root/superuser privileges (Linux capabilities). ... SELinux operates on the principle of default denial: Anything not explicitly allowed is denied."
>
> [Security-Enhanced Linux in Android](https://source.android.com/docs/security/features/selinux)

I could not find a dedicated SELinux page in the AAOS documentation under `source.android.com/docs/automotive`. The automotive security overview simply refers readers to the Android security-model documentation. Vehicle-specific policy additions, such as `carservice_app.te`, can be seen only in the source and device policy files.

### How SELinux works

SELinux runs inside the kernel. It rests on three principles.

1. **Everything has a label.** Processes, files, sockets, and even Binder service names have labels of the form `user:role:type:level`. On Android, the third field (the type) is the important one. The type of a process is called its domain.
2. **Only operations present in allow rules pass.** A policy is a list of `allow` rules that say, “domain A may perform operation D, in class C, on a target of type B.” Anything absent from those rules is denied.
3. **The policy is checked on every access.** Whenever a process opens a file, uses a capability, or sends a Binder call, the kernel consults the policy. User-space managers such as servicemanager also query the policy. A denial produces an `avc: denied` log entry.

The documentation defines the rule format and the term domain as follows.

> "A policy rule comes in the form: allow source target:class permissions; ... An example of a rule is: allow untrusted_app app_data_file:file { read write }; ... For a process, its type is also known as its domain."
>
> [SELinux concepts](https://source.android.com/docs/security/features/selinux/concepts)

UID-based checks are discretionary access control (DAC): the owner decides who gets access. SELinux checks are mandatory access control (MAC): the policy decides. The two run independently, and access is allowed only if both pass.

### Labels observed on the device

The first column of `ps -A -Z` is the process label.

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

- `init`, `vold`, `netd`, and `zygote` all run as root, but each has a different domain. Even processes with the same root UID can perform different operations.
- CarService (`carservice_app`) and CarSettings (`system_app`) both belong to the system UID family (1000 and 1001000), but their domains differ. Earlier, I said that “the 13 packages in the shared user have the same permissions”; SELinux separates them again at this layer. The policy on this device permits VHAL Binder calls from `carservice_app` and blocks them from `system_app`. This does not mean that the 13 packages can run only in those two domains. Processes such as `system_server` in the list above use the same UID 1000 but a different domain.

Files have labels in the same format.

```text
$ ls -Z
u:object_r:packages_list_file:s0       /data/system/packages.list
u:object_r:zygote_exec:s0              /system/bin/app_process64
u:object_r:servicemanager_exec:s0      /system/bin/servicemanager
u:object_r:hal_vehicle_default_exec:s0 /vendor/bin/hw/android.hardware.automotive.vehicle@V3-emulator-service
```

### How a domain is selected

For a **native daemon**, the domain is selected by a policy transition rule when init executes the binary. The VHAL executable above has the label `hal_vehicle_default_exec`, and the policy extracted from the device contains the following rule (in CIL format).

```text
(typetransition init hal_vehicle_default_exec process hal_vehicle_default)
```

This means, “when init executes a file labeled `hal_vehicle_default_exec`, the new process enters the `hal_vehicle_default` domain.” Daemons whose PPID is 1 (init) receive domains matching their executable labels through rules of this kind.

An **app** is not created by executing a new binary. It is forked from zygote, so it cannot use that mechanism. Instead, immediately after fork, Android consults the `seapp_contexts` rules and assigns the domain directly.

> "seapp_contexts assigns labels to app processes and /data/data directories. This configuration is read by the zygote process on each app launch and by installd during startup."
>
> "mac_permissions.xml assigns a seinfo tag to apps based on their signature and optionally their package name. The seinfo tag can then be used as a key in the seapp_contexts file ..."
>
> [Implementing SELinux](https://source.android.com/docs/security/features/selinux/implement)

These are some of the actual rules on the device.

```text
user=system seinfo=platform domain=system_app type=system_app_data_file
user=system seinfo=platform name=com.android.car domain=carservice_app type=system_app_data_file
user=_app seinfo=platform domain=platform_app type=app_data_file levelFrom=user
user=_app isPrivApp=true domain=priv_app type=privapp_data_file levelFrom=user
user=_app minTargetSdkVersion=34 domain=untrusted_app type=app_data_file levelFrom=all
```

`user=system` means that the UID is system, while `user=_app` means that it is in the ordinary app UID range. `seinfo=platform` means that the app was signed with the platform key. As the documentation above describes, `mac_permissions.xml` examines the signature and attaches the `platform` seinfo tag; the `platform:` field in the `packages.list` shown earlier is the result. `isPrivApp=true` means that the app is installed in a privileged directory, and `name=` is the package name. The most specific matching rule takes precedence. An app with the system UID, a platform signature, and the name `com.android.car` therefore enters `carservice_app`; one with any other name enters `system_app`. Platform-signed apps enter `platform_app`, apps in privileged directories enter `priv_app`, and the rest enter `untrusted_app`. A store-installed app always belongs to the `untrusted_app` family.

**Even root cannot arbitrarily change domains.** When I attempted to use `runcon` from a root shell to execute `sh` in the `untrusted_app` domain, SELinux denied it as follows.

```text
avc:  denied  { entrypoint } for comm="runcon" path="/system/bin/sh" scontext=u:r:untrusted_app:s0:c218,c256,c522,c768 tcontext=u:object_r:shell_exec:s0 tclass=file permissive=0
```

Each domain has a defined set of executable files, called entrypoints, through which a process may enter that domain. The shell executable is not an entrypoint for `untrusted_app`. In the earlier Binder experiments, I used a different method, which works only because this emulator is a userdebug build: the root shell's `su` domain has permission to change its own context directly. Production user builds have no `su` domain.

### Root and SELinux

I changed only the domain of a root shell (UID 0) to `untrusted_app`, then tried to read `packages.list`.

```text
$ id
uid=0(root) gid=0(root) ... context=u:r:untrusted_app:s0:c218,c256,c522,c768
$ cat /data/system/packages.list
cat: /data/system/packages.list: Permission denied

avc:  denied  { dac_read_search } for comm="cat" capability=2  scontext=u:r:untrusted_app:s0:c218,c256,c522,c768 tcontext=u:r:untrusted_app:s0:c218,c256,c522,c768 tclass=capability permissive=0
avc:  denied  { dac_override } for comm="cat" capability=1  scontext=u:r:untrusted_app:s0:c218,c256,c522,c768 tcontext=u:r:untrusted_app:s0:c218,c256,c522,c768 tclass=capability permissive=0
```

The documentation gives an analogous example.

> "In a traditional DAC-based Linux environment, if the root user becomes compromised that user can write to every raw block device. However, SELinux can be used to label these devices so the process assigned the root privilege can write to only those specified in the associated policy."
>
> [SELinux concepts](https://source.android.com/docs/security/features/selinux/concepts)

Because this file is not owned by root, root would normally read it using `DAC_OVERRIDE`, the capability that ignores file permission bits. But SELinux also governs the use of capabilities. The `untrusted_app` domain lacks that permission, so the read was blocked even with UID 0. A kernel exploit that only sets the UID to 0 is therefore not enough; the domain must also be changed. For this reason, the final stage of an Android kernel exploit commonly also disables SELinux enforcing mode or overwrites the attacking process's security context.

### Binder service access control

The policy explains the service-lookup results seen earlier. Service names are labeled in the `service_contexts` file.

```text
car_service                                           u:object_r:carservice_service:s0
android.hardware.automotive.vehicle.IVehicle/default  u:object_r:hal_vehicle_service:s0
```

The policy contains these rules.

```text
(allow carservice_app carservice_service (service_manager (add find)))
(neverallow base_typeattr_1070 carservice_service (service_manager (add)))
(typeattributeset app_api_service ( ... carservice_service ))
(allow untrusted_app_all app_api_service (service_manager (find)))
```

- `carservice_app` is the only domain allowed to register (`add`) `car_service`. A `neverallow` rule is a prohibition that says, “fail the policy build if an allow rule like this is introduced.” It prevents another process from registering a fake service under the same name. When the device compiles policy during boot, init passes `-N` to secilc, skipping the neverallow check (`system/core/init/selinux.cpp`), so actual enforcement occurs during the build and in the Compatibility Test Suite (CTS). The documentation likewise says that compatibility testing enforces these rules across devices[^13]. On a device that must pass CTS certification, a manufacturer cannot get around this prohibition even by modifying the policy.
- `carservice_service` belongs to an attribute (a group of types) called `app_api_service`. Every ordinary app domain (`untrusted_app_all`) can find services in this group. This is why an ordinary app could find `car_service`.
- `hal_vehicle_service` is not in that group, so an ordinary app could not find the VHAL.

Actually calling an object after finding it is governed by a separate `binder call` rule, so a process may be able to find an object yet be unable to call it.

### Separating apps and users with categories

All `untrusted_app` apps share the same domain, so the domain alone cannot tell them apart. SELinux therefore adds categories in the fourth label field. The formula appears in libselinux.

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

Here, libselinux's appid variable, unlike the appId above, is the app's ordinal within the app UID range (10218−10000=218). For the TTS app (user 10, appid 218) the formula produces `c218,c256,c522,c768`, exactly matching both the `ps` output above and the data-directory label (`app_data_file:s0:c218,c256,c522,c768`). SELinux denies access between a process and a file whose categories do not match. Ordinary apps are thus separated by two layers: UID and category.

Looking again at `seapp_contexts`, `untrusted_app` uses `levelFrom=all`, which includes both app categories and user categories. `platform_app` and `priv_app` use `levelFrom=user`, which includes only user categories, so the launcher and the radio app both have `c522,c768`. Apps in the `platform_app` and `priv_app` domains are separated from one another only by UID, not by categories. Some privileged apps receive separate domains, including `permissioncontroller_app`, `mediaprovider_app`, and `rkpdapp`; these use `levelFrom=all` in the lts5 `seapp_contexts`. The TTS app used as the ordinary-app example in this post is preinstalled on the product partition, but it lies outside a privileged directory and is not signed with the platform key, as the `default:` field in `packages.list` shows. It therefore runs as `untrusted_app` with four categories. I chose it as the example because it receives the same rule as a store-installed app.

The history in the Application Sandbox documentation maps directly onto these rules.

> "In Android 6.0, the SELinux sandbox was extended to isolate apps across the per-physical-user boundary."
>
> "In Android 9 all nonprivileged apps with targetSdkVersion >= 28 must run in individual SELinux sandboxes, providing MAC on a per-app basis."
>
> [Application Sandbox](https://source.android.com/docs/security/app-sandbox)

The user categories at c512 and above implement the Android 6.0 separation between users, while the app categories implement Android 9's per-app separation. The documentation's “nonprivileged” qualifier is reflected in the actual rules: `platform_app` and `priv_app` keep `levelFrom=user`. In the device policy, only rules with `minTargetSdkVersion=28` or later use `levelFrom=all`; the older rules, `untrusted_app_27` for targetSdk 26 and 27 and `untrusted_app_25` below that, use `levelFrom=user` (targetSdk 28 apps also run as `untrusted_app_27`, but with `levelFrom=all`). The category formula itself does not appear in the documentation; it exists only in the libselinux code above.

---

## zygote, seccomp, and capabilities

Even after accounting for UID and domain, one difference remained. CarService and the VHAL both provide vehicle functions, but CarService had a seccomp filter while the VHAL did not. Understanding this difference requires examining how each process starts. The following sections trace what init and zygote launch, and how that startup path determines filters and capabilities.

### init and zygote

The init process is the first user-space process launched by the kernel (PID 1). It reads `.rc` configuration files and launches native daemons. One of the daemons it launches is zygote.

```text
# /system/etc/init/hw/init.zygote64.rc
service zygote /system/bin/app_process64 -Xzygote /system/bin --zygote --start-system-server --socket-name=zygote
    class main
    priority -20
```

The zygote process starts the Java runtime (ART), preloads framework classes and resources into memory, and waits on a socket for requests to create app processes. On receiving a request, it calls fork to create a child process. The child inherits the preloaded memory directly, allowing it to start quickly. `system_server` is created the same way. The PPID column in the earlier `ps` output shows the distinction: native daemons have PPID 1 (init), while `system_server` and every app have the PID of zygote64 as their PPID.

> "Each app process is forked from an existing process called Zygote. The Zygote process starts when the system boots and loads common framework code and resources (such as activity themes). ... This approach allows most of the RAM pages allocated for framework code and resources to be shared across all app processes."
>
> [Overview of memory management](https://developer.android.com/topic/performance/memory-overview)

The zygote process itself runs as root, holds all capabilities, and has no seccomp filter. The native zygote code shows the sequence in which a forked child process is turned into an app.

```cpp
// frameworks/base/core/jni/com_android_internal_os_Zygote.cpp, SpecializeCommon()
    if (setresgid(gid, gid, gid) == -1) { ... }                  // 1. Change groups to the app's groups

    // Must be called when the new process still has CAP_SYS_ADMIN, in this case,
    // before changing uid from 0, which clears capabilities.  The other
    // alternative is to call prctl(PR_SET_NO_NEW_PRIVS, 1) afterward, but that
    // breaks SELinux domain transition (see b/71859146).  As the result,
    // privileged syscalls used below still need to be accessible in app process.
    SetUpSeccompFilter(uid, is_child_zygote);                    // 2. seccomp filter
    ...
    if (setresuid(uid, uid, uid) == -1) { ... }                  // 3. Change the UID to the app's UID
    ...
    SetCapabilities(permitted_capabilities, effective_capabilities, ...);   // 4. Reduce capabilities
    ...
    if (selinux_android_setcontext(uid, is_system_server, se_info_ptr, nice_name_ptr) == -1) {  // 5. SELinux domain
```

The filter is installed before the UID changes, while the process still has root privileges (`CAP_SYS_ADMIN`). As the final line of the original code comment explains, privileged system calls used after the filter is installed, such as `setresuid`, must remain allowed by the app filter. This is why the app filter described below blocks other set\*id calls but allows `setresuid`.

```text
$ grep -E 'Uid|CapEff|Seccomp' /proc/<pid>/status
416  zygote64         Uid: 0        CapEff: 000001ffffffffff  Seccomp: 0
708  system_server    Uid: 1000     CapEff: 0000001806897c20  Seccomp: 2
1269 com.android.car  Uid: 1000     CapEff: 0000000000000000  Seccomp: 2
2221 tts              Uid: 1010218  CapEff: 0000000000000000  Seccomp: 2
```

This fork model also has a security cost. Child processes inherit zygote's memory layout, so the library locations chosen by ASLR are identical across them. An attacker who can install an ordinary app can learn the libc addresses in CarService and the launcher merely by reading the libc address in the attacker's own process. The memory-management documentation quoted above presents page sharing only as a memory saving and does not mention this side effect.

### seccomp

A seccomp filter restricts which system calls a process may request from the kernel. Once a filter is installed, neither that process nor its children can remove it. In `/proc/<pid>/status`, `Seccomp: 2` means a filter is active, while 0 means no filter.

App seccomp filters were introduced in Android 8.0. The official blog post published at the time described them as follows.

> "Android O includes a single seccomp filter installed into zygote, the process from which all the Android applications are derived. ... The seccomp filter allows: all the syscalls exposed via bionic (the C runtime for Android). ... Android O's seccomp filter blocks certain syscalls, such as swapon/swapoff, which have been implicated in some security attacks, and the key control syscalls, which are not useful to apps."
>
> [Seccomp filter in Android O](https://android-developers.googleblog.com/2017/07/seccomp-filter-in-android-o.html) (Android Developers Blog, 2017)

The phrase “installed into zygote” does not match the current device. In the `/proc` output above, zygote64 itself has `Seccomp: 0`. As the zygote code shows, the filter is installed in each child created by fork. The UID determines which filter is installed.

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

Apps with UIDs of 10000 or higher receive the app filter. Processes below that threshold, including system_server and CarService (UID 1000), receive the system filter. The comparison uses the full UID, including the user ID, not the appId; the same `uid` is also passed to the `setresuid` call that follows it in `SpecializeCommon()`. Thus, system-UID processes running for user 10 (CarSettings and CarPerUserService at 1001000, and Bluetooth at 1001002) receive the app filter even though their appIds are below 10000. Both filters appear as `Seccomp: 2`, so `/proc` output alone does not distinguish them.

The first branch also shows that when SELinux is not in enforcing mode (`setenforce 0`), zygote installs no filter at all. The Android Developers Blog post quoted earlier also describes using `setenforce 0` on userdebug and eng builds to turn the seccomp filter off. When checking seccomp state, first confirm that SELinux is enforcing.

The filter is generated by bionic, Android's C library. A source comment describes the construction.

```text
# bionic/libc/SECCOMP_BLOCKLIST_COMMON.TXT
# The final seccomp allowlist is SYSCALLS.TXT - SECCOMP_BLOCKLIST.TXT + SECCOMP_ALLOWLIST.TXT
int     swapon(const char*, int) all
int     swapoff(const char*) all
```

The generated filter starts by allowing the system calls that bionic exposes through wrapper functions (`SYSCALLS.TXT`), then removes some and adds others. A call absent from the allowlist makes the filter return `SECCOMP_RET_TRAP`. The process receives `SIGSYS` and normally dies immediately. The crash log in the blog post shows this result: `signal 31 (SIGSYS), code 1 (SYS_SECCOMP)`, `Cause: seccomp prevented call to disallowed system call 55`. Comparing the list files in the lts5 source sorts the calls into three groups:

- **Blocked by both filters:** `keyctl`, `add_key` (kernel keyring), `io_uring_setup`, `kexec_load`, and `finit_module`. They appear in none of the lists, so both the app and system filters block them. The kernel keyring and io_uring have had multiple kernel privilege-escalation vulnerabilities, so neither filter allows them.
- **Blocked only by the app filter:** `mount` and `setuid`. Both appear in `SECCOMP_BLOCKLIST_APP.TXT`, which removes calls only from the app filter. This file contains the set\*id family that changes UIDs or groups (except `setresuid`), `mount`/`umount2`, `chroot`, `init_module`, `reboot`, time-setting calls such as `settimeofday`, and others.
- **Allowed:** `ptrace`, `bpf`, `perf_event_open`, and `setresuid`. SELinux and capabilities, rather than seccomp, restrict these calls. The app seccomp filter removes some kernel functions that apps do not need; it does not block every dangerous call.

The “key control syscalls” in the blog post are the `keyctl` and `add_key` calls listed above. Because the system filter does not subtract `SECCOMP_BLOCKLIST_APP.TXT`, calls such as `mount` and `setuid` pass its seccomp stage. `SECCOMP_ALLOWLIST_SYSTEM.TXT`, which adds entries only to the system filter, contains one line for `bpf`; however, `bpf` is already in `SYSCALLS.TXT`, so this entry changes nothing in practice. The five calls blocked above remain unavailable under the system filter as well.

Daemons launched by init do not pass through zygote, so they do not receive this filter. Only daemons that install a filter themselves have one.

```text
222  VHAL            Uid: 1054  CapEff: 0000000000000000  NoNewPrivs: 0  Seccomp: 0
413  netd            Uid: 0     CapEff: 00000000000074ef  NoNewPrivs: 0  Seccomp: 0
1587 wpa_supplicant  Uid: 1010  CapEff: 0000000000003000  NoNewPrivs: 0  Seccomp: 0
580  mediaextractor  Uid: 1040  CapEff: 0000000000000000  NoNewPrivs: 1  Seccomp: 2
```

The media extractor (registered as the service `media.extractor`; its process appears as `mediaextractor` in the output above) parses untrusted media files and therefore installs its own filter. `NoNewPrivs: 1` means the no_new_privs flag is set, which prevents any program the process later executes from gaining privileges. On Linux, a process without `CAP_SYS_ADMIN` must first enable this flag before installing a seccomp filter.

> "In order to use the SECCOMP_SET_MODE_FILTER operation, either the calling thread must have the CAP_SYS_ADMIN capability in its user namespace, or the thread must already have the no_new_privs bit set."
>
> [seccomp(2)](https://man7.org/linux/man-pages/man2/seccomp.2.html)

As the zygote code comment explains, zygote still holds `CAP_SYS_ADMIN` when it installs the filter, so it does not need this flag and app processes remain at `NoNewPrivs: 0`. The VHAL, netd, and the Wi-Fi daemon (`wpa_supplicant`) have no filter. An attacker who gains code execution in one of these daemons faces no seccomp restrictions; only SELinux, capabilities, and file permissions remain.

### Capabilities

Linux divides root privileges into roughly 40 separate units called capabilities. A non-root process can hold some of these capabilities as well.

> "Starting with Linux 2.2, Linux divides the privileges traditionally associated with superuser into distinct units, known as capabilities, which can be independently enabled and disabled."
>
> [capabilities(7)](https://man7.org/linux/man-pages/man7/capabilities.7.html)

`CapEff` is a bit mask of the capabilities currently in effect. Converting the bit numbers to names gives the following table.

| Process | CapEff | Capabilities |
| --- | --- | --- |
| wpa_supplicant | `0x3000` | NET_ADMIN, NET_RAW |
| netd | `0x74ef` | CHOWN, DAC_OVERRIDE, DAC_READ_SEARCH, FOWNER, KILL, SETGID, SETUID, NET_BIND_SERVICE, NET_ADMIN, NET_RAW, IPC_LOCK |
| system_server | `0x1806897c20` | KILL, NET_BIND_SERVICE, NET_BROADCAST, NET_ADMIN, NET_RAW, IPC_LOCK, SYS_MODULE, SYS_PTRACE, SYS_NICE, SYS_TIME, SYS_TTY_CONFIG, WAKE_ALARM, BLOCK_SUSPEND |
| Apps, CarService, VHAL | `0` | None |

In binary, `0x3000` has bits 12 (NET_ADMIN) and 13 (NET_RAW) set. The same man page defines them as follows.

> CAP_NET_ADMIN: "Perform various network-related operations: interface configuration; administration of IP firewall, masquerading, and accounting; modify routing tables; ..."
>
> CAP_NET_RAW: "Use RAW and PACKET sockets; bind to any address for transparent proxying."
>
> CAP_DAC_OVERRIDE: "Bypass file read, write, and execute permission checks."
>
> CAP_SETUID: "Make arbitrary manipulations of process UIDs (setuid(2), setreuid(2), setresuid(2), setfsuid(2)) ..."

NET_ADMIN permits changes to network interfaces, routing, and firewall rules. NET_RAW permits raw sockets, which can construct and inspect arbitrary packets. DAC_OVERRIDE permits bypassing file permission bits, and SETUID permits changing UIDs.

Compromising the Wi-Fi daemon gives an attacker network-configuration privileges even though its UID is only wifi (1010). As shown earlier, however, SELinux checks each use of a capability against the process's domain as well. A daemon can actually use only the capabilities permitted by that domain's policy. To determine what an attacker gains by taking control of a process, I therefore need to examine four things together: UID, capabilities, SELinux domain, and the presence or absence of seccomp.

### Native code inside Java processes

Apps and CarService are written in Java (more precisely, they run as bytecode executed by [ART](https://source.android.com/docs/core/runtime), the Android Runtime), but native C and C++ code also runs inside them. JNI is the interface between the two.

> "JNI is the Java Native Interface. It defines a way for the bytecode that Android compiles from managed code ... to interact with native code (written in C/C++)."
>
> [JNI tips](https://developer.android.com/training/articles/perf-jni)

Even a Java app contains a large amount of native code. CarService alone maps more than 300 shared libraries (`.so` files), and the core of the Bluetooth stack inside the Bluetooth app is native.

```text
$ grep '\.so' /proc/<bt_pid>/maps | awk '{print $6}' | sort -u | head
/apex/com.android.btservices/lib64/libbluetooth_jni.so
/apex/com.android.btservices/lib64/libcrypto.so
...
```

Code that parses wireless packets or media files is almost entirely native, so memory corruption such as a heap overflow or use-after-free can occur even when the target is a Java process. Mitigations such as ASLR, Scudo, and PAC/BTI apply to this native code. Protections on the code ART generates from bytecode, such as mapping the JIT code cache so that no region is both writable and executable, form another layer.

---

## init and system properties

In addition to launching daemons as specified in `.rc` files, the init process discussed earlier reacts to changes in system properties. The `.rc` file syntax has five kinds of statements.

> "The Android Init Language consists of five broad classes of statements: Actions, Commands, Services, Options, and Imports."
>
> (AOSP `system/core/init/README.md`)

Actions with `on property:` triggers are how init reacts to property changes. The `service ... user ... group ... capabilities ...` blocks that define vehicle daemons are Services statements; they determine each daemon's UID, groups, and capabilities.

### System properties

Android stores key-value settings as system properties[^14]. Common prefixes include `ro.*` (read-only, set at boot), `persist.*` (retained across reboots), and `sys.*`/`boot.*` (runtime state). This post has already used `ro.android.car.carservice.package` (the package implementing CarService) and `ro.fw.mu.headless_system_user`.

Properties also have SELinux labels, and policy determines who may read and write them. The mappings are in the `property_contexts` file.

```text
$ getprop -Z ro.serialno              → u:object_r:serialno_prop:s0
$ getprop -Z boot.car_service_created → u:object_r:system_prop:s0
```

Reading and writing them as an ordinary app gives different results depending on the label.

```text
# Under an ordinary app context (untrusted_app)
$ getprop ro.serialno                 → (empty value)
  avc: denied { read } ... name="u:object_r:serialno_prop:s0" scontext=u:r:untrusted_app ...
$ getprop ro.android.car.carservice.package  → com.android.car.updatable   (readable)
$ setprop debug.test 1                → Failed to set property
  avc: denied { write } ... scontext=u:r:untrusted_app ... tclass=sock_file
```

An ordinary app cannot read the serial number because it is labeled `serialno_prop`, while the CarService package name is readable because it is labeled `default_prop`. Property writes pass through init's property socket. An ordinary app lacks SELinux permission to write to that socket, so all such writes are blocked. The policy lists the domains that may write `system_prop`:

```text
(allow carservice_app system_prop (property_service (set)))
(allow system_app   system_prop (property_service (set)))
(allow system_server system_prop (property_service (set)))
```

Only a few domains, including carservice_app (CarService), system_app, and system_server, can write `system_prop`, so an arbitrary app cannot manipulate state properties such as `boot.car_service_created`. An attacker may collect device information by reading properties with permissive labels. On the write side, if an `.rc` file starts an operation when a specific property changes (an `on property:...` trigger), controlling a domain that can write that property would allow the attacker to trigger the operation.

---

## HAL and the system/vendor separation

### HAL

Vehicle signals, cameras, audio devices, and Wi-Fi chips differ across manufacturers and components. Android isolates hardware-specific code behind a HAL, or Hardware Abstraction Layer, and the Android side calls only the HAL interface. Most modern HALs run in separate processes and expose Binder interfaces defined in AIDL.

> "A hardware abstraction layer (HAL) is type of abstraction layer with a standard interface for hardware vendors to implement. ... Binderized HALs run in a separate process from the client that uses them. Binderized HALs are registered with a service manager so that clients can access their capabilities."
>
> [Hardware abstraction layer (HAL) overview](https://source.android.com/docs/core/architecture/hal)

The AAOS documentation describes the VHAL in the same terms. It is a HAL that represents each vehicle function as a “property,” and it has been defined in AIDL since Android 13.

> "The vehicle hardware abstraction layer (VHAL) interface defines the properties OEMs can implement and contains property metadata. ... The VHAL interface is based on accessing (reading, writing, and subscribing) a property, which is an abstraction for a specific function. In Android 13 and higher, VHAL migrated to AIDL at IVehicle.aidl ... CarService and Android native components support HIDL and AIDL backend and prefer the AIDL backend when it's available."
>
> [Vehicle HAL (VHAL) overview](https://source.android.com/docs/automotive/vhal)

This preference for AIDL is visible in the CarService code (`VehicleStub.newVehicleStub`). The VHAL interface for vehicle signals is defined as follows.

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

There are only seven methods: reading vehicle properties (`getValues`), writing them (`setValues`), subscribing to changes (`subscribe`), and the supporting operations. Whether the function is climate temperature or door locking, every request goes through these methods as a property ID and a value.

### The boundary between system and vendor

The system partition contains the common Android platform produced by Google. The vendor partition contains HALs and hardware-related files produced by the manufacturer. The vendor partition itself existed before Android 8. Project Treble in Android 8 made a stable interface between system and vendor mandatory so that Android could be updated without rebuilding the manufacturer's side.

> "This is achieved by the introduction of a new vendor interface between the Android OS framework and the vendor implementation. The new vendor interface is validated by a Vendor Test Suite (VTS), analogous to the CTS, to ensure forward compatibility of the vendor implementation."
>
> [Here comes Treble](https://android-developers.googleblog.com/2017/05/here-comes-treble-modular-base-for.html) (Android Developers Blog, 2017)

This requires a fixed contract between the two sides. The VINTF object (the Vendor Interface object) describes that contract[^15]. Two files from the device illustrate it.

The vendor-side manifest declares, “I provide this HAL at this version.”

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

The system-side compatibility matrix declares, “I accept this HAL within this version range.”

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

The AIDL HAL documentation spells out these two roles, and the XML files above follow the same format as its examples.

> "@VintfStability AIDL servers must be declared in the VINTF manifest ... AIDL clients must declare themselves in the compatibility matrix ..."
>
> "By convention, AIDL HAL services have an instance name of the format $package.$type/$instance. For example, an instance of the vibrator HAL is registered as android.hardware.vibrator.IVibrator/default."
>
> [AIDL for HALs](https://source.android.com/docs/core/architecture/aidl/aidl-hals)

Compatibility between the two is checked during builds and updates. Once exported, an interface version is frozen. AOSP keeps separate version definitions under the `1`, `2`, and `3` directories in `aidl_api/android.hardware.automotive.vehicle/`, and exported versions cannot be edited[^16]. The `@VintfStability` annotation on the AIDL file marks it as a stable interface crossing a partition boundary. This also explains why the VHAL name in the earlier `service list` output was `android.hardware.automotive.vehicle.IVehicle/default`, matching the documentation's `$package.$type/$instance` form.

The same documentation describes the mechanism that controls who may call a HAL. The SELinux macro `hal_attribute(foo)` creates two attributes, or groups of types: `hal_foo_client` and `hal_foo_server`. Each domain is then placed into a client or server group.

> "This macro defines attributes hal_foo_client and hal_foo_server. For a given domain, the hal_client_domain and hal_server_domain macros associate a domain with a given HAL attribute. ... This means that hal_foo_client processes can get ahold of the HAL, and hal_foo_server processes can register the HAL. The enforcement of these registration rules is done by the context manager (servicemanager)."
>
> [AIDL for HALs](https://source.android.com/docs/core/architecture/aidl/aidl-hals)

For the VHAL, these are `hal_vehicle_client` and `hal_vehicle_server`. The actual device policy is broader than this model: some domains outside the group can still find the VHAL.

Binder is also divided across three device nodes.

```text
$ ls /dev/binderfs
binder  binder-control  binder_logs  features  hwbinder  vndbinder
```

- `/dev/binder`: Used by apps, the framework, and AIDL HALs. The VHAL is registered here as well.
- `/dev/hwbinder`: Used by the older HIDL HAL format and managed by `hwservicemanager`.
- `/dev/vndbinder`: A channel used only between vendor processes and managed by `vndservicemanager`.

The Binder IPC documentation explains both why these devices are separate and how their roles have changed.

> "Each binder context has its own device node and its own context (service) manager. You can access the context manager only through the device node to which it belongs ..."
>
> "In Android 10, Stable AIDL allows all processes to use /dev/binder while also solving for the stability guarantees HIDL and /dev/hwbinder solved."
>
> [Using binder IPC](https://source.android.com/docs/core/architecture/hidl/binder-ipc)

For HALs, the main change has been a move away from hwbinder. Older HIDL HALs communicated through `/dev/hwbinder`. After Stable AIDL was introduced, new HALs such as the VHAL were defined in AIDL, registered on `/dev/binder`, and subjected to the same service-manager SELinux checks described earlier. The vndbinder device is a separate case: it served as the AIDL channel between vendor processes. The same documentation says that this mechanism has been deprecated since Android 11 ("This functionality is deprecated as of Android 11") and recommends the NDK or Rust AIDL backends instead.

Under this split, the VHAL implementation under `/vendor/bin/hw/...` is manufacturer code. The emulator VHAL is Google's reference implementation; a production vehicle replaces it with the manufacturer's implementation. The connection between that implementation and the vehicle network also differs from vehicle to vehicle. Code on the system side, by contrast, is nearly identical across vehicle models running the same Android version. From an attacker's perspective, a system-side flaw such as a CarService permission-check bug is likely to apply to multiple vehicles, while a flaw in a VHAL implementation applies only to vehicles using that manufacturer's implementation.

---

## Partitions, Verified Boot, APEX, and build types

### Partitions and Verified Boot

Partitions determine where code comes from and what can be modified. The main partitions are system (common Android), vendor (manufacturer HALs and drivers), product and system_ext (system apps and resources added by the manufacturer), and odm (ODM customizations).

> "system_ext partition. This partition contains system resources and proprietary system modules that extend the common system image in the system partition."
>
> [Partitions overview](https://source.android.com/docs/core/architecture/partitions)

As seen earlier, the privileged-permission allowlists also live on this partition, under `/system_ext/etc/permissions`. Verified Boot protects these partitions[^17]. [dm-verity](https://source.android.com/docs/security/features/verifiedboot/dm-verity) verifies every block of a read-only partition against a hash tree. The verity mode determines what happens when a modified block is read. On this device, enforcing mode is active:

```text
$ getprop ro.boot.veritymode          → enforcing
$ getprop partition.system.verified   → 2
```

When `veritymode=enforcing`, fs_mgr passes `restart_on_corruption` to dm-verity, and init writes the mode as a number in `partition.<name>.verified`. The value 2 is fs_mgr's `VERITY_MODE_RESTART`. In this mode, the kernel restarts the device as soon as a modified block is read (`kernel_restart("dm-verity device corrupted")`).

This is what backs the assumption that “a system app lives on the system partition, so an ordinary app cannot tamper with it.” An attacker who wants to modify a file on the partition must first defeat Verified Boot, the same barrier that stands in the way of persisting across reboots.

### APEX and Mainline modules

Some low-level components on the system partition are packaged as signed [APEX](https://source.android.com/docs/core/ota/apex) modules that can be updated without a full operating-system update[^18]. The device contains 38 APEX modules, many of which are part of the attack surface.

```text
$ pm list packages --apex-only
com.android.btservices      ← Bluetooth stack
com.android.media.swcodec   ← Software media codec
com.android.wifi            ← Wi-Fi
com.android.adbd, com.android.art, com.android.conscrypt, ...
```

Bluetooth, Wi-Fi, and media are all delivered as modules. The path of the Bluetooth app's APK shows that it comes from inside a module.

```text
$ pm path com.android.bluetooth
package:/apex/com.android.btservices/app/Bluetooth@AAI5.260516.001.A1/Bluetooth.apk
```

From an attacker's perspective, these components may be patched faster than the complete operating system, which can shorten the useful life of a 1-day vulnerability. Conversely, if a manufacturer does not keep up with module updates, the modules can remain outdated. Determining which case applies requires inspecting the module versions on the actual vehicle.

### Build types

Android has three build types: user, userdebug, and eng. The differences matter for the attack model.

> "userdebug. The same as user, with these exceptions: Also installs modules tagged with debug. ro.debuggable=1. adb is enabled by default."
>
> [Build a new device](https://source.android.com/docs/setup/create/new-device)

This emulator is a userdebug build (`ro.build.type=userdebug`, `ro.debuggable=1`). Everything this post used for observation (`adb root`; changing the UID and SELinux context from the shell's `su` domain, which is also how I reproduced Binder calls under different permissions; and the fake VHAL enabled only on userdebug and eng builds) is researcher-only access that the userdebug build provides. A production vehicle's user build has neither `adb root` nor an `su` domain, so an actual attacker would first need to compromise a process with a given UID to reach the same position. The experiments in this post should therefore be read as “what the researcher observed about the structure,” not “what an attacker can already do.”

---

## FBE and Direct Boot

Assessing information disclosure requires knowing when user data becomes readable. Android uses File-Based Encryption (FBE) and divides storage into two locations.

> "Credential Encrypted (CE) storage, which is the default storage location and only available after the user has unlocked the device. Device Encrypted (DE) storage, which is a storage location available both during Direct Boot mode and after the user has unlocked the device."
>
> [File-based encryption](https://source.android.com/docs/security/features/encryption/file-based)

CE storage holds most app data and becomes available only after the user unlocks the device. DE storage is available immediately after boot. The device has separate directories for both types under each user.

```text
$ ls -ldZ /data/user/10 /data/user_de/10
drwxrwx--x 256 system system ... /data/user/10       ← CE
drwxrwx--x 256 system system ... /data/user_de/10    ← DE
```

### Direct Boot and CarService

A component that must run immediately after boot, before the user unlocks the device, is marked `android:directBootAware="true"` and operates using only DE storage[^19]. Vehicle functions must remain available before unlock, so CarService participates in Direct Boot. The `dumpsys` output shows that CarService has this flag:

```text
$ dumpsys package com.android.car | grep privateFlags
    privateFlags=[ ... DIRECT_BOOT_AWARE PRIVILEGED ... ]
```

### When CE storage opens in a vehicle

The CE key is ordinarily protected by the user's screen-lock credential (PIN, pattern, or password), called the LSKF (Lock Screen Knowledge Factor). For a user with no screen lock, however, CE storage opens automatically during boot. That is the case for the driver, user 10, on this emulator. Even after CE storage opens, reading the data still requires passing both the file-permission (UID) check and the SELinux check.

Public analyses discuss the strength of the CE key itself, including how the TEE limits credential-guessing speed when a lock is configured[^20]. This post is concerned not with key recovery but with when the storage is open.

---

## Closing

In this post, I checked the security architecture AAOS inherits from Android against emulator output and source, one piece at a time. What a process can do is not decided by its UID alone. Android permissions and AppOps, caller checks in Binder services, SELinux domains and categories, seccomp, and capabilities stack on top of one another. So even with the same system UID, what a process can reach depends on which user it runs for and how it was started. Processes in the same system UID family can belong to different users and domains, while two vehicle components, CarService and the VHAL, differ in seccomp because they start through different paths. Taken together, this shows why a process name or a UID alone cannot describe what an attacker gains by compromising a process. That is why, when weighing an attack path, the first question is not just what the bug is, but which process it triggers in.

Thanks for reading.

[^1]: "enabling it to leverage the existing security model", [What is Android Automotive?](https://source.android.com/docs/automotive/start/what_automotive)
[^2]: [AppOpsManager](https://developer.android.com/reference/android/app/AppOpsManager)
[^3]: [`<permission>` element](https://developer.android.com/guide/topics/manifest/permission-element)
[^4]: [Signature permission allowlist](https://source.android.com/docs/core/permissions/signature-permission-allowlist)
[^5]: System entry "CVE-2022-20223 A-223578534 EoP High", [Android Security Bulletin, July 2022](https://source.android.com/docs/security/bulletin/2022-07-01)
[^6]: Platform apps entry "CVE-2022-20223 A-223578534 EoP High", [Android Automotive OS Update Bulletin, December 2022](https://source.android.com/docs/security/bulletin/aaos/2022-12-01)
[^7]: "Car Service runs as 'com.android.car' process and is highly privileged. All permission checks for Car APIs are performed in Car Service.", [Car framework core](https://source.android.com/docs/automotive/car-framework-core) PDF
[^8]: [`<activity>` element](https://developer.android.com/guide/topics/manifest/activity-element)
[^9]: "Since Android 10 (API level 29), the platform has placed restrictions on when apps can start activities from the background.", [Activity security](https://developer.android.com/guide/components/activities/secure-bal)
[^10]: "always use an explicit intent when starting a Service and do not declare intent filters for your services", [Intents and intent filters](https://developer.android.com/guide/components/intents-filters)
[^11]: [Access to app protected components](https://blog.oversecured.com/Android-Access-to-app-protected-components/)
[^12]: [PendingIntent risks](https://developer.android.com/privacy-and-security/risks/pending-intent)
[^13]: "SELinux neverallow rules prohibit behavior that should never occur. With compatibility testing, SELinux neverallow rules are now enforced across devices.", [Customizing SELinux](https://source.android.com/docs/security/features/selinux/customize)
[^14]: [Add system properties](https://source.android.com/docs/core/architecture/configuration/add-system-properties)
[^15]: "the vendor interface object (VINTF object), which aggregates relevant information about a device and makes that information available through a queryable API", [Vendor interface object](https://source.android.com/docs/core/architecture/vintf)
[^16]: "Starting in Android 11, the versions are frozen under aidl_api/name.", [Stable AIDL](https://source.android.com/docs/core/architecture/aidl/stable-aidl)
[^17]: [Boot flow](https://source.android.com/docs/security/features/verifiedboot/boot-flow)
[^18]: [Project Mainline](https://source.android.com/docs/core/ota/modular-system)
[^19]: [Direct Boot](https://developer.android.com/privacy-and-security/direct-boot)
[^20]: Quarkslab, "Android Data Encryption in depth", 2023, [blog.quarkslab.com](https://blog.quarkslab.com/android-data-encryption-in-depth.html)
