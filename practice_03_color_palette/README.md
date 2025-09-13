# 💡 색상 팔레트 생성기

랜덤 색상 팔레트를 생성하고 HEX, RGB 값을 복사할 수 있는 도구를 만들어봅시다.

## 요구사항

### HTML 구조
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Color Palette Generator</title>
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
   - `<h1>` "Color Palette Generator"
   - 스페이스바 안내 문구

2. **컨트롤 영역**
   - 팔레트 생성 버튼
   - 색상 개수 선택 (3-8개)
   - 색상 모드 선택 (랜덤/파스텔/다크)

3. **팔레트 영역**
   - 색상 박스들을 담을 컨테이너
   - 각 색상 박스:
     - 색상 미리보기
     - HEX 코드 표시
     - RGB 값 표시
     - 복사 버튼
     - 잠금 기능

### JavaScript 기능

1. **색상 생성**
   - `generateRandomColor()`: 랜덤 색상 생성
   - `generatePastelColor()`: 파스텔톤 생성
   - `generateDarkColor()`: 다크톤 생성
   - `rgbToHex()`: RGB를 HEX로 변환

2. **필수 함수들**
   - `generatePalette()`: 팔레트 생성
   - `copyToClipboard(text)`: 클립보드 복사
   - `lockColor(index)`: 색상 잠금
   - `savePalette()`: 팔레트 저장
   - `loadPalette()`: 저장된 팔레트 불러오기

3. **인터랙션**
   - 스페이스바로 새 팔레트 생성
   - 클릭으로 색상 코드 복사
   - 잠긴 색상은 새로고침 시 유지

### CSS 스타일링
- 색상 박스: 그라디언트 배경
- 호버 시 확대 효과
- 복사 완료 시 애니메이션
- 반응형 그리드 레이아웃
- 부드러운 전환 효과

### 힌트
- `Math.random()`으로 랜덤 값 생성
- `toString(16)`으로 16진수 변환
- `navigator.clipboard.writeText()` 활용
- CSS Grid로 레이아웃 구성
- `transition` 속성으로 애니메이션

### 참고 자료
- [Math 객체](https://www.yalco.kr/@javascript/6-5)
- [문자열 메서드](https://www.yalco.kr/@javascript/6-3)
- [배열 메서드](https://www.yalco.kr/@javascript/7-2)
- [이벤트 처리](https://www.yalco.kr/@javascript/4-2)

### 보너스 도전과제
- 색상 하모니 생성 (보색, 유사색)
- 그라디언트 생성 기능
- 색상 팔레트 내보내기 (CSS, JSON)
- 색상 조정 슬라이더
- 즐겨찾기 팔레트 저장