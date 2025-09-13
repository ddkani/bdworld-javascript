# 💡 온도 변환기

섭씨, 화씨, 켈빈 온도를 서로 변환하는 도구를 만들어봅시다. 실시간 변환과 차트 표시 기능을 구현합니다.

## 요구사항

### HTML 구조
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather Converter</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- 여기에 코드 작성 -->
    <script src="script.js"></script>
</body>
</html>
```

### 필요한 요소들

1. **헤더 영역**
   - `<h1>` "온도 변환기"
   - 현재 날짜와 시간

2. **입력 섹션**
   - 세 개의 입력 필드 (섭씨, 화씨, 켈빈)
   - 각 필드에 단위 표시
   - 실시간 동기화

3. **온도 정보 표시**
   - 물의 상태 (얼음/물/수증기)
   - 체감 설명 (매우 추움 ~ 매우 더움)
   - 온도 게이지 바

4. **참고 온도 표**
   - 주요 온도 포인트 표시
   - 절대영도, 물의 어는점/끓는점
   - 인체 정상 체온

### JavaScript 기능

1. **변환 함수**
   - `celsiusToFahrenheit(c)`: 섭씨→화씨
   - `celsiusToKelvin(c)`: 섭씨→켈빈
   - `fahrenheitToCelsius(f)`: 화씨→섭씨
   - `kelvinToCelsius(k)`: 켈빈→섭씨

2. **필수 함수들**
   - `updateTemperatures(value, unit)`: 모든 필드 업데이트
   - `getWaterState(celsius)`: 물의 상태 판단
   - `getFeelDescription(celsius)`: 체감 설명
   - `updateGauge(celsius)`: 게이지 업데이트
   - `validateInput(value)`: 입력값 검증

3. **추가 기능**
   - 최소/최대값 제한
   - 소수점 2자리 반올림
   - 잘못된 입력 처리
   - 히스토리 저장

### CSS 스타일링
- 온도별 색상 변화 (파랑→빨강)
- 게이지 바 애니메이션
- 입력 필드 포커스 효과
- 카드 레이아웃
- 그라디언트 배경

### 힌트
- `toFixed(2)`로 소수점 처리
- `isNaN()`으로 숫자 검증
- CSS 변수로 동적 색상 변경
- `input` 이벤트로 실시간 변환
- 삼항 연산자로 조건부 처리

### 참고 자료
- [Number 객체](https://www.yalco.kr/@javascript/6-4)
- [Math 객체](https://www.yalco.kr/@javascript/6-5)
- [조건문](https://www.yalco.kr/@javascript/3-2)
- [이벤트 처리](https://www.yalco.kr/@javascript/4-2)

### 보너스 도전과제
- 풍속 냉각 지수 계산
- 체감 온도 계산
- 온도 변환 히스토리
- 그래프 시각화
- 날씨 API 연동