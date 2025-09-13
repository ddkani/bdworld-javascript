# 💡 간단한 계산기 만들기

사칙연산이 가능한 심플한 웹 계산기를 만들어봅시다. 버튼 클릭으로 숫자와 연산자를 입력하고 결과를 표시해야 합니다.

## 요구사항

### HTML 구조
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Calculator</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- 여기에 코드 작성 -->
    <script src="script.js"></script>
</body>
</html>
```

### 필요한 요소들

1. **컨테이너**
   - `<div class="calculator">` 계산기 전체를 감싸는 컨테이너

2. **디스플레이**
   - `<input type="text" class="display">` 입력값과 결과를 표시
   - readonly 속성 추가
   - 초기값은 "0"

3. **버튼 그리드**
   - `<div class="buttons">` 버튼들을 담을 컨테이너
   - 숫자 버튼: 0-9
   - 연산자 버튼: +, -, *, /
   - 기능 버튼: C (Clear), = (Equal)
   - 소수점 버튼: .

### JavaScript 기능

1. **변수 관리**
   - `currentValue`: 현재 입력된 값
   - `previousValue`: 이전 값
   - `operation`: 선택된 연산자

2. **필수 함수들**
   - `appendNumber(number)`: 숫자 입력
   - `selectOperation(op)`: 연산자 선택
   - `calculate()`: 계산 실행
   - `clear()`: 초기화
   - `updateDisplay()`: 화면 업데이트

3. **이벤트 처리**
   - 각 버튼에 클릭 이벤트 리스너 추가
   - 키보드 입력도 지원 (선택사항)

### CSS 스타일링
- 계산기 너비: 300px
- 그리드 레이아웃 사용 (4열)
- 버튼 크기: 70px × 70px
- 디스플레이: 큰 폰트, 우측 정렬
- 호버 효과로 버튼 강조

### 힌트
- `parseFloat()`로 문자열을 숫자로 변환
- `switch`문으로 연산 처리
- 0으로 나누기 예외 처리
- 연속 계산 지원 고려

### 참고 자료
- [함수의 의미와 사용법](https://www.yalco.kr/@javascript/4-1)
- [이벤트 핸들링](https://www.yalco.kr/@javascript/4-2)
- [조건문](https://www.yalco.kr/@javascript/3-2)
- [연산자](https://www.yalco.kr/@javascript/2-5)

### 보너스 도전과제
- 백스페이스 기능 추가
- 키보드 입력 지원
- 계산 히스토리 표시
- 괄호 연산 지원