/*
 * 할일 관리 애플리케이션 (Todo List Application)
 * Week 3-4 주제: DOM 조작과 이벤트 처리
 * Week 5-6 주제: 배열과 객체 활용
 * Week 7-8 주제: 고급 JavaScript 기능 (localStorage, 필터링)
 */

// 전역 변수 선언 (Week 1-2: 변수와 자료형)
let todos = []; // 할일 목록을 저장하는 배열 (Week 5-6: 배열 활용)
let currentFilter = 'all'; // 현재 필터 상태를 저장하는 변수

// DOM 요소 선택 (Week 3-4: DOM 선택자)
const todoInput = document.getElementById('todoInput'); // 할일 입력 필드
const addBtn = document.getElementById('addBtn'); // 추가 버튼
const todoList = document.getElementById('todoList'); // 할일 목록 컨테이너
const filterBtns = document.querySelectorAll('.filter-btn'); // 필터 버튼들 (NodeList)
const clearCompletedBtn = document.getElementById('clearCompleted'); // 완료된 할일 삭제 버튼

/*
 * 날짜 업데이트 함수 (Week 5-6: 함수 정의와 활용)
 * Date 객체를 사용하여 현재 날짜를 한국어 형식으로 표시
 */
function updateDate() {
    const currentDate = document.getElementById('currentDate'); // 날짜 표시 요소 선택
    const today = new Date(); // 현재 날짜 객체 생성 (Week 7-8: 내장 객체 활용)
    
    // 날짜 형식 옵션 객체 (Week 7-8: 객체 리터럴)
    const options = { 
        year: 'numeric',    // 년도를 숫자로 표시
        month: 'long',      // 월을 긴 형식으로 표시 (예: 12월)
        day: 'numeric',     // 일을 숫자로 표시
        weekday: 'long'     // 요일을 긴 형식으로 표시 (예: 금요일)
    };
    
    // 한국어 로케일로 날짜 형식화하여 DOM에 반영 (Week 3-4: DOM 조작)
    currentDate.textContent = today.toLocaleDateString('ko-KR', options);
}

/*
 * 할일 추가 함수 (Week 5-6: 함수와 배열 조작)
 * 사용자가 입력한 텍스트를 새로운 할일 객체로 생성하여 배열에 추가
 */
function addTodo() {
    // 입력값 가져오기 및 공백 제거 (Week 1-2: 문자열 메서드)
    const text = todoInput.value.trim();
    
    // 입력값 검증 (Week 1-2: 조건문)
    if (text === '') {
        alert('할 일을 입력해주세요!'); // 사용자에게 알림 표시
        return; // 함수 종료 (Week 5-6: 함수 제어)
    }
    
    // 새로운 할일 객체 생성 (Week 7-8: 객체 리터럴)
    const todo = {
        id: Date.now(),          // 고유 ID로 현재 타임스탬프 사용
        text: text,              // 사용자가 입력한 할일 텍스트
        completed: false,        // 완료 상태 (기본값: false)
        createdAt: new Date()    // 생성 시간 저장
    };
    
    // 배열에 새 할일 추가 (Week 5-6: 배열 메서드)
    todos.push(todo);
    
    // 입력 필드 초기화 (Week 3-4: DOM 조작)
    todoInput.value = '';
    
    // 데이터 저장 및 화면 업데이트
    saveTodos();   // localStorage에 저장
    renderTodos(); // 화면에 렌더링
}

/*
 * 할일 완료 상태 토글 함수 (Week 5-6: 배열 메서드와 함수)
 * 특정 ID를 가진 할일의 완료 상태를 반전시킴
 */
function toggleComplete(id) {
    // find 메서드로 해당 ID의 할일 찾기 (Week 5-6: 배열 고차함수)
    const todo = todos.find(t => t.id === id);
    
    // 할일이 존재하는지 확인 (Week 1-2: 조건문)
    if (todo) {
        // 완료 상태 반전 (Week 1-2: 논리 연산자)
        todo.completed = !todo.completed;
        
        // 변경사항 저장 및 화면 업데이트
        saveTodos();   // localStorage에 저장
        renderTodos(); // 화면 재렌더링
    }
}

/*
 * 할일 삭제 함수 (Week 5-6: 배열 필터링)
 * 특정 ID를 가진 할일을 배열에서 제거
 */
function deleteTodo(id) {
    // filter 메서드로 해당 ID가 아닌 할일들만 남기기 (Week 5-6: 배열 고차함수)
    // 조건: t.id !== id (해당 ID가 아닌 것들만 포함)
    todos = todos.filter(t => t.id !== id);
    
    // 변경사항 저장 및 화면 업데이트
    saveTodos();   // localStorage에 저장
    renderTodos(); // 화면 재렌더링
}

/*
 * 할일 목록을 localStorage에 저장하는 함수 (Week 7-8: 웹 스토리지 활용)
 * JSON.stringify를 사용하여 객체 배열을 문자열로 변환 후 저장
 */
function saveTodos() {
    // JSON.stringify: JavaScript 객체를 JSON 문자열로 변환 (Week 7-8: JSON 처리)
    // localStorage.setItem: 브라우저 로컬 저장소에 데이터 저장
    localStorage.setItem('todos', JSON.stringify(todos));
}

/*
 * localStorage에서 할일 목록을 불러오는 함수 (Week 7-8: 웹 스토리지와 JSON 파싱)
 * 저장된 문자열을 다시 객체 배열로 변환하여 메모리에 로드
 */
function loadTodos() {
    // localStorage에서 저장된 할일 목록 가져오기
    const savedTodos = localStorage.getItem('todos');
    
    // 저장된 데이터가 있는지 확인 (Week 1-2: 조건문)
    if (savedTodos) {
        // JSON.parse: JSON 문자열을 JavaScript 객체로 변환 (Week 7-8: JSON 처리)
        todos = JSON.parse(savedTodos);
        
        // 날짜 문자열을 Date 객체로 복원 (Week 5-6: 배열 순회)
        todos.forEach(todo => {
            // 문자열로 저장된 날짜를 다시 Date 객체로 변환
            todo.createdAt = new Date(todo.createdAt);
        });
    }
}

/*
 * 할일 목록 필터링 함수 (Week 5-6: 배열 필터링과 조건문)
 * 현재 선택된 필터 조건에 맞는 할일들만 반환
 */
function filterTodos() {
    // 전개 연산자로 배열 복사본 생성 (Week 7-8: 전개 연산자)
    // 원본 배열을 변경하지 않기 위해 복사본 사용
    let filtered = [...todos];
    
    // 현재 필터 상태에 따른 조건부 필터링 (Week 1-2: 조건문)
    if (currentFilter === 'active') {
        // 완료되지 않은 할일들만 필터링 (Week 5-6: 배열 고차함수)
        filtered = filtered.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        // 완료된 할일들만 필터링
        filtered = filtered.filter(t => t.completed);
    }
    // 'all' 상태일 때는 모든 할일 반환 (별도 필터링 없음)
    
    return filtered; // 필터링된 배열 반환
}

/*
 * 할일 개수 업데이트 함수 (Week 5-6: 배열 메서드와 통계)
 * 전체, 활성, 완료된 할일의 개수를 계산하여 DOM에 표시
 */
function updateCounts() {
    // 전체 할일 개수 (Week 5-6: 배열 length 속성)
    const allCount = todos.length;
    
    // 완료되지 않은 할일 개수 (Week 5-6: filter 메서드 활용)
    const activeCount = todos.filter(t => !t.completed).length;
    
    // 완료된 할일 개수
    const completedCount = todos.filter(t => t.completed).length;
    
    // DOM 요소에 개수 업데이트 (Week 3-4: DOM 조작)
    document.getElementById('allCount').textContent = allCount;
    document.getElementById('activeCount').textContent = activeCount;
    document.getElementById('completedCount').textContent = completedCount;
}

/*
 * 시간 포맷팅 함수 (Week 1-2: 문자열 메서드와 템플릿 리터럴)
 * Date 객체에서 시간을 추출하여 HH:MM 형식으로 변환
 */
function formatTime(date) {
    // 시간 추출 및 문자열 변환 (Week 7-8: Date 객체 메서드)
    const hours = date.getHours().toString().padStart(2, '0');
    
    // 분 추출 및 문자열 변환
    // padStart: 문자열 앞에 '0'을 추가하여 2자리로 만드는 메서드
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    // 템플릿 리터럴로 HH:MM 형식 문자열 반환 (Week 1-2: 템플릿 리터럴)
    return `${hours}:${minutes}`;
}

/*
 * 할일 목록 렌더링 함수 (Week 3-4: DOM 조작과 동적 HTML 생성)
 * 필터링된 할일 목록을 HTML로 변환하여 화면에 표시
 */
function renderTodos() {
    // 현재 필터 상태에 맞는 할일들 가져오기
    const filtered = filterTodos();
    
    // 할일 개수 업데이트
    updateCounts();
    
    // 비어있는 경우 처리 (Week 1-2: 조건문)
    if (filtered.length === 0) {
        // 빈 상태 메시지 표시 (Week 3-4: innerHTML 사용)
        todoList.innerHTML = `
            <div class="empty-state">
                할 일이 없습니다. 새로운 할 일을 추가해보세요!
            </div>
        `;
        return; // 함수 종료
    }
    
    // 할일 목록을 HTML로 렌더링 (Week 5-6: 배열 map 메서드)
    todoList.innerHTML = filtered.map(todo => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}">
            <input type="checkbox" 
                   class="todo-checkbox" 
                   ${todo.completed ? 'checked' : ''} 
                   onchange="toggleComplete(${todo.id})">
            <span class="todo-text">${todo.text}</span>
            <span class="todo-time">${formatTime(todo.createdAt)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">삭제</button>
        </li>
    `).join(''); // join 메서드로 배열을 문자열로 결합
}

/*
 * 완료된 할일 모두 삭제 함수 (Week 5-6: 배열 필터링)
 * 완료되지 않은 할일들만 남기고 나머지는 모두 제거
 */
function clearCompleted() {
    // 완료되지 않은 할일들만 남기고 필터링 (Week 5-6: 배열 고차함수)
    todos = todos.filter(t => !t.completed);
    
    // 변경사항 저장 및 화면 업데이트
    saveTodos();   // localStorage에 저장
    renderTodos(); // 화면 재렌더링
}

/*
 * 이벤트 리스너 등록 (Week 3-4: 이벤트 처리)
 * 사용자 상호작용에 대한 이벤트 핸들러 연결
 */

// 추가 버튼 클릭 이벤트 (Week 3-4: 이벤트 리스너)
addBtn.addEventListener('click', addTodo);

// 입력 필드에서 Enter 키 눌렀을 때 할일 추가 (Week 3-4: 키보드 이벤트)
todoInput.addEventListener('keypress', (e) => {
    // 이벤트 객체에서 key 속성 확인 (Week 7-8: 이벤트 객체)
    if (e.key === 'Enter') {
        addTodo(); // Enter 키 눈렀을 때 할일 추가 함수 호출
    }
});

// 필터 버튼들에 이벤트 리스너 추가 (Week 5-6: 배열 순회)
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 모든 필터 버튼에서 active 클래스 제거 (Week 3-4: CSS 클래스 조작)
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // 클릭된 버튼에 active 클래스 추가
        btn.classList.add('active');
        
        // 데이터 속성에서 필터 값 가져오기 (Week 3-4: dataset 속성)
        currentFilter = btn.dataset.filter;
        
        // 화면 재렌더링
        renderTodos();
    });
});

// 완료된 할일 삭제 버튼 이벤트
clearCompletedBtn.addEventListener('click', clearCompleted);

/*
 * 애플리케이션 초기화 (Week 5-6: 함수 호출 순서)
 * 페이지 로드 시 실행되는 초기 설정 함수들
 */

// 현재 날짜 표시 업데이트
updateDate();

// localStorage에서 저장된 할일 목록 로드
loadTodos();

// 초기 화면 렌더링
renderTodos();