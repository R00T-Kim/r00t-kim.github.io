### 1일차 (일) – 개발 환경 구축 및 기초 앱 만들기

목표: Android Studio 설치, 에뮬레이터 설정, 기본 “Hello World” 앱 작성 활동: Android Studio 설치 가이드 참고 ([https://developer.android.com/studio/install?hl=ko](https://developer.android.com/studio/install?hl=ko)) 에뮬레이터(AVD) 생성 및 “Hello World” 앱 빌드, 실행 및 디버깅 실습: 간단한 앱을 직접 만들어보고 로그캣을 확인

### 시작

아 참고로 이 글은 공부를 하면서 실시간으로 쓸 겁니다. 정리가 안 된 글일 수 있습니다.

일단 안드로이드 스튜디오를 설치해봅시다. [https://developer.android.com/studio/install?hl=ko](https://developer.android.com/studio/install?hl=ko)

자 다운 받는 데 시간이 걸리니 다음 걸 보니 에뮬레이터(AVD) 설정을 하라네요. 에뮬레이터가 뭘까요 [https://developer.android.com/studio/run/managing-avds?hl=ko](https://developer.android.com/studio/run/managing-avds?hl=ko) 공식 document에 자세히 설명이 되어 있네요

Android Virtual Device(AVD) -> 아 앱이 돌아갈 안드로이드의 환경을 설정할 수 있는 건가봐요.

아마 오늘 뿐만 아니라 앞으로 공식 문서를 많이 참고할 것 같네요.

안드로이드 스튜디오가 설치가 되었어요. ![](/blog/android-hacking-intro-1/01.png) 네.. ![](/blog/android-hacking-intro-1/02.png) avd 설정도 해야 한다고 했으니 당연히 깔아야 하겠죠? ![](/blog/android-hacking-intro-1/03.png) 끝난 줄 알았는데 setup wizard가 튀어 나왔네요. ![](/blog/android-hacking-intro-1/04.png) 이래서 pwn할 때도 고생 많이 했는데.. non-ASCII에 대한 세상의 대우가 각박하네요.. 옮길게요. ![](/blog/android-hacking-intro-1/05.png) 아 맛 갔네 ㅋㅋ 다시 시도했는데 또 똑같은 증상이 나타나네요. C드라이브 하위에 바로 만들면 안되나봐요. 4트짼데, 왜 자꾸 같은 증상이 반복될까요. 시작부터 하기 싫어지려고 하네.. 아 됐네요. 설치하는 중 ~ (WSL 업데이트가 안 되어 있었나 봐요)

아 설치 중에 할 게 없어서 그냥 글을 써볼게요. 화이트햇 스쿨 3기를 신청했는데, 심층면접을 어제 봤어요. 질문에 대답을 너무 짧게 한 것 같아 그게 맘에 좀 걸리네요. 붙었으면 좋겠어요. 전 아직 감자이기 때문이죠. 아직 설치가 좀 남았네요. 뒤에 간단한 코드 작성을 하는 것 같은데, 코틀린을 해야 하나봐요. 지금 코틀린을 좀 찾아보려구요.

코틀린은 자바 기반 언어인가봐요. 자바를 학교 수업에서 간단하게 배우긴 했는데 잘 기억은 안나네요. ![](/blog/android-hacking-intro-1/06.png) 아 설치가 됐네요. 한 번 해봅시다. [https://developer.android.com/codelabs/basic-android-kotlin-compose-first-app?hl=ko#2](https://developer.android.com/codelabs/basic-android-kotlin-compose-first-app?hl=ko#2) 요 공식 문서 따라서 한 번 만들어 볼게요.

![](/blog/android-hacking-intro-1/07.png) Minimum SDK라는 걸 선택할 수 있어요. 안드로이드 버전이네요 롤리팝 되게 오랜만에 들어보는데요. (들어봤으면 최소 저랑 동년배시겠죠?) 네 또 non-ASCII 혐오로 폴더 옮겨 줬어요.. ![](/blog/android-hacking-intro-1/08.png) 그럼 이런 창이 나오네요.

Project 뷰(1)는 프로젝트의 파일과 폴더를 보여줍니다. Code 뷰(2)에서는 코드를 수정합니다. Design 뷰(3)에서는 앱이 어떻게 표시되는지 미리 봅니다. 라고 합니다.

근데 왜 벌써 에러가 뜨는 거죠. 저 아무것도 안 했는 걸요. 뭐 플러그인 업데이트하고 이것 저것 하니까 에러 메세지가 사라졌어요. 그래서 ctrl+shift+F5가 build & refresh 라길래 했는데, 뭐 아무 일이 일어나질 않아요. 안드로이드 고인물 분들이 저를 보면 얼마나 답답하실까요.

![](/blog/android-hacking-intro-1/09.png)

일단 해봅시다. 공식 문서를 따라 가볼게요.

```
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyFirstApplicationTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    Greeting(
                        name = "Android",
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }
}
```

`onCreate()` 함수는 앱의 진입점이래요. 그리고 `setContent()` 함수는 레이아웃을 정의한다고 하네요. `@Compsable` 주석으로 표시된 모든 함수는 `setContent()` 또는 다른 구성 가능한 함수에서 호출할 수 있다고 합니다.

다음은 `Greeting()` 함수를 볼게요. 위에는 `@Compsable` 주석이 표시되어 있으니 구성 가능한 함수에서 호출이 되겠네요.

`@Composable` 함수 이름은 대문자로 표기됩니다. 함수 앞에 `@Composable` 주석을 추가합니다. `@Composable` 함수는 아무것도 반환할 수 없습니다.

라는 특징을 가지고 있대요. 이건 코틀린을 공부해봐야 할 것 같아요.

근데 디자인 창에서 자꾸 안나와요. 찾아 보니까 `Unable to launch Medium Phone API 35 - The emulator process for AVD Medium_Phone_API_35 has terminated.` 라는 오류가 뜨네요. SDK 문제인가 찾아봤는데, 또 non-ASCII 혐오가 여기서.. AVD 환경 변수 설정을 다시 해줬어요. 드디어 에뮬레이터가 동작하는 군요 하하.

![](/blog/android-hacking-intro-1/10.png)

감격스럽네요. 처음으로 뭔가 해냈어요.

![](/blog/android-hacking-intro-1/11.png)

지피티 선생님이 로그캣도 확인해보라고 하셔서 확인해봤는데, 사실 아직 뭔지 잘 모르겠어요. 일단 오늘은 여기서 마무리 지어야하겠네요. 내일 봅시다.
