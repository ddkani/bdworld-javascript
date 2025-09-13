# 💡 할 일 목록 관리 앱

할 일을 추가, 완료, 삭제할 수 있는 Todo List 애플리케이션을 만들어봅시다. LocalStorage를 활용해 데이터를 저장합니다.

## 요구사항

### HTML 구조
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List App</title>
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
   - `<h1>` "오늘의 할 일"
   - 현재 날짜 표시

2. **입력 영역**
   - `<input type="text" id="todoInput">` 할 일 입력
   - `<button id="addBtn">` 추가 버튼
   - Enter 키로도 추가 가능

3. **필터 탭**
   - 전체 보기
   - 진행 중
   - 완료됨
   - 각 탭에 개수 표시

4. **할 일 목록**
   - `<ul id="todoList">` 목록 컨테이너
   - 각 항목:
     - 체크박스 (완료 표시)
     - 할 일 텍스트
     - 삭제 버튼
     - 생성 시간

### JavaScript 기능

1. **데이터 구조**
   ```javascript
   const todo = {
       id: Date.now(),
       text: '할 일 내용',
       completed: false,
       createdAt: new Date()
   };
   ```

2. **필수 함수들**
   - `addTodo()`: 할 일 추가
   - `toggleComplete(id)`: 완료 상태 토글
   - `deleteTodo(id)`: 할 일 삭제
   - `saveTodos()`: LocalStorage 저장
   - `loadTodos()`: LocalStorage 불러오기
   - `renderTodos()`: 화면 렌더링
   - `filterTodos(filter)`: 필터링

3. **LocalStorage 활용**
   - 페이지 새로고침 시에도 데이터 유지
   - JSON.stringify()와 JSON.parse() 활용

### CSS 스타일링
- 완료된 항목: 취소선, 회색 텍스트
- 호버 효과: 항목 배경색 변경
- 체크박스 커스텀 스타일
- 반응형 디자인
- 부드러운 애니메이션 효과

### 힌트
- `filter()` 메서드로 필터링 구현
- `map()` 메서드로 목록 렌더링
- `find()` 메서드로 특정 항목 찾기
- 이벤트 위임으로 동적 요소 처리
- `classList.toggle()` 활용

### 참고 자료
- [배열 고차함수 메서드](https://www.yalco.kr/@javascript/7-3)
- [객체 기본 사용법](https://www.yalco.kr/@javascript/5-1)
- [LocalStorage 활용](https://www.yalco.kr/@javascript/6-2)
- [이벤트 처리](https://www.yalco.kr/@javascript/4-2)

### 보너스 도전과제
- 드래그 앤 드롭으로 순서 변경
- 할 일 수정 기능
- 우선순위 설정
- 카테고리 분류
- 검색 기능