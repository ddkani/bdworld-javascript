# 💡 JavaScript 퀴즈 게임

JavaScript 지식을 테스트하는 객관식 퀴즈 게임을 만들어봅시다. 점수와 진행 상황을 표시합니다.

## 요구사항

### HTML 구조
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JavaScript Quiz Game</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- 여기에 코드 작성 -->
    <script src="script.js"></script>
</body>
</html>
```

### 필요한 요소들

1. **시작 화면**
   - 게임 제목
   - 난이도 선택 (쉬움/보통/어려움)
   - 시작 버튼
   - 최고 점수 표시

2. **게임 화면**
   - 문제 번호와 진행 바
   - 문제 텍스트
   - 4개의 선택지 버튼
   - 남은 시간 표시
   - 현재 점수

3. **결과 화면**
   - 최종 점수
   - 정답률
   - 다시하기 버튼
   - 홈으로 버튼

### JavaScript 기능

1. **퀴즈 데이터 구조**
   ```javascript
   const question = {
       id: 1,
       difficulty: 'easy',
       question: '질문 내용',
       options: ['선택지1', '선택지2', '선택지3', '선택지4'],
       correct: 0,
       explanation: '설명'
   };
   ```

2. **필수 함수들**
   - `startGame()`: 게임 시작
   - `loadQuestion()`: 문제 로드
   - `checkAnswer(selected)`: 답 확인
   - `nextQuestion()`: 다음 문제
   - `showResult()`: 결과 표시
   - `updateTimer()`: 타이머 업데이트
   - `calculateScore()`: 점수 계산

3. **게임 로직**
   - 난이도별 문제 필터링
   - 제한 시간 (문제당 30초)
   - 연속 정답 보너스 점수
   - 최고 점수 저장

### CSS 스타일링
- 선택지 호버 효과
- 정답/오답 애니메이션
- 진행 바 애니메이션
- 카드 형태의 문제 디자인
- 반응형 레이아웃

### 힌트
- `setTimeout()`으로 타이머 구현
- `filter()`로 난이도별 문제 선택
- 배열 셔플: `sort(() => Math.random() - 0.5)`
- CSS 애니메이션으로 피드백
- LocalStorage로 최고 점수 저장

### 참고 자료
- [배열 메서드](https://www.yalco.kr/@javascript/7-2)
- [타이머 함수](https://www.yalco.kr/@javascript/6-2)
- [조건문](https://www.yalco.kr/@javascript/3-2)
- [객체 활용](https://www.yalco.kr/@javascript/5-1)

### 보너스 도전과제
- 문제 카테고리 추가
- 힌트 시스템
- 생명 시스템
- 리더보드
- 음향 효과