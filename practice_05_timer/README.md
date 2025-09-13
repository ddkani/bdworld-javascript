# 💡 타이머 & 스톱워치

다양한 기능을 가진 타이머와 스톱워치 앱을 만들어봅시다. 정확한 시간 측정과 알람 기능을 구현합니다.

## 요구사항

### HTML 구조
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Timer & Stopwatch</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- 여기에 코드 작성 -->
    <script src="script.js"></script>
</body>
</html>
```

### 필요한 요소들

1. **모드 선택 탭**
   - 타이머 모드
   - 스톱워치 모드
   - 포모도로 타이머

2. **타이머 섹션**
   - 시간 입력 (시/분/초)
   - 시작/일시정지/리셋 버튼
   - 원형 프로그레스 바
   - 프리셋 버튼 (1분, 5분, 10분)

3. **스톱워치 섹션**
   - 시간 표시 (00:00:00.00)
   - 시작/일시정지/리셋 버튼
   - 랩 타임 버튼
   - 랩 타임 목록

4. **포모도로 섹션**
   - 작업 시간 설정 (25분)
   - 휴식 시간 설정 (5분)
   - 세션 카운터
   - 시작/일시정지 버튼

### JavaScript 기능

1. **타이머 함수**
   - `setTimer(hours, minutes, seconds)`: 타이머 설정
   - `startTimer()`: 타이머 시작
   - `pauseTimer()`: 일시정지
   - `resetTimer()`: 리셋
   - `updateDisplay()`: 화면 업데이트

2. **스톱워치 함수**
   - `startStopwatch()`: 스톱워치 시작
   - `recordLap()`: 랩 타임 기록
   - `calculateLapTime()`: 랩 타임 계산
   - `formatTime(milliseconds)`: 시간 포맷팅

3. **포모도로 함수**
   - `startPomodoro()`: 포모도로 시작
   - `switchSession()`: 작업/휴식 전환
   - `updateSessionCount()`: 세션 카운트
   - `playNotification()`: 알림음 재생

### CSS 스타일링
- 원형 프로그레스 바 (SVG)
- 디지털 시계 폰트
- 네온 효과 텍스트
- 다크 모드 디자인
- 애니메이션 효과

### 힌트
- `setInterval()` vs `requestAnimationFrame()`
- `Date.now()`로 정확한 시간 측정
- `performance.now()`로 밀리초 단위 측정
- SVG circle의 `stroke-dasharray` 활용
- Web Audio API로 알림음 생성

### 참고 자료
- [Date 객체](https://www.yalco.kr/@javascript/6-6)
- [타이머 함수](https://www.yalco.kr/@javascript/6-2)
- [Math 객체](https://www.yalco.kr/@javascript/6-5)
- [이벤트 처리](https://www.yalco.kr/@javascript/4-2)

### 보너스 도전과제
- 키보드 단축키
- 전체화면 모드
- 사용자 정의 알림음
- 시간 기록 내보내기
- 다중 타이머 관리