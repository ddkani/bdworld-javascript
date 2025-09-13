// ====== 계산기 상태 관리 변수들 ======
// JavaScript 기초: 변수 선언과 데이터 타입 (Week 1-2)

let currentValue = '0';        // 현재 화면에 표시되는 값을 저장하는 문자열
let previousValue = '';        // 연산을 위해 저장된 이전 값
let operation = null;          // 현재 선택된 연산자 (+, -, *, /)
let shouldResetScreen = false; // 새로운 숫자 입력 시 화면을 초기화해야 하는지를 나타내는 플래그

// DOM 조작: HTML 요소 선택 (Week 3-4)
// getElementById()는 HTML의 id 속성으로 요소를 찾아 JavaScript 객체로 반환
const display = document.getElementById('display');

// ====== 화면 업데이트 함수 ======
// 함수 선언과 DOM 조작 (Week 1-2, Week 3-4)
function updateDisplay() {
    // HTML input 요소의 value 속성을 변경하여 화면에 현재 값을 표시
    // 이는 사용자 인터페이스를 동적으로 변경하는 DOM 조작의 기본 예제
    display.value = currentValue;
}

// ====== 계산기 초기화 함수 ======
// 상태 관리와 함수 호출 (Week 1-2)
function clearDisplay() {
    // 모든 계산기 상태 변수를 초기값으로 재설정
    // 이는 계산기의 "C" (Clear) 버튼 기능을 구현
    currentValue = '0';     // 현재 값을 0으로 초기화
    previousValue = '';     // 이전 값을 빈 문자열로 초기화
    operation = null;       // 연산자를 null로 초기화
    updateDisplay();        // 함수 호출: 변경된 상태를 화면에 반영
}

// ====== 숫자 입력 처리 함수 ======
// 조건문, 문자열 조작, 매개변수 활용 (Week 1-2, Week 5-6)
function appendNumber(number) {
    // 매개변수 number: 사용자가 입력한 숫자나 소수점
    
    // 조건문: 화면 초기화가 필요한 경우 처리
    if (shouldResetScreen) {
        currentValue = '0';     // 현재 값을 0으로 재설정
        shouldResetScreen = false; // 플래그를 false로 변경
    }
    
    // 소수점(.) 입력 처리
    if (number === '.') {
        // 문자열 메서드 includes(): 이미 소수점이 있는지 확인
        if (currentValue.includes('.')) return; // 이미 소수점이 있으면 함수 종료
        
        // 현재 값이 '0'인 경우 '0.'으로 변경
        if (currentValue === '0') {
            currentValue = '0.';
            updateDisplay();
            return; // 조기 반환으로 함수 종료
        }
    }
    
    // 일반 숫자 입력 처리
    if (currentValue === '0' && number !== '.') {
        // 현재 값이 '0'이고 소수점이 아닌 경우, 0을 대체
        currentValue = number;
    } else {
        // 문자열 연결: 기존 값에 새 숫자를 붙임
        currentValue += number;
    }
    
    updateDisplay(); // 변경된 값을 화면에 업데이트
}

// ====== 연산자 선택 함수 ======
// 논리 연산자와 상태 관리 (Week 1-2)
function selectOperation(op) {
    // 매개변수 op: 선택된 연산자 문자열 (+, -, *, /)
    
    // 논리 AND 연산자(&&)와 NOT 연산자(!) 활용
    // 이미 연산자가 선택되어 있고 화면 리셋이 필요하지 않은 경우 계산 실행
    if (operation !== null && !shouldResetScreen) {
        calculate(); // 연속 계산 지원: 5 + 3 + 2 = 10
    }
    
    // 현재 값을 이전 값으로 저장 (첫 번째 피연산자로 사용)
    previousValue = currentValue;
    operation = op;          // 선택된 연산자 저장
    shouldResetScreen = true; // 다음 숫자 입력 시 화면을 초기화하도록 플래그 설정
}

// ====== 계산 실행 함수 ======
// 수학 연산, 타입 변환, switch문, 에러 처리 (Week 1-2, Week 5-6)
function calculate() {
    // 가드 클로즈: 계산에 필요한 조건이 만족되지 않으면 함수 종료
    // 논리 OR 연산자(||) 사용: 연산자나 이전 값이 없으면 return
    if (operation === null || previousValue === '') return;
    
    let result; // 계산 결과를 저장할 변수
    
    // 타입 변환: 문자열을 숫자로 변환
    // parseFloat()는 문자열을 부동소수점 숫자로 변환하는 내장 함수
    const prev = parseFloat(previousValue);    // 첫 번째 피연산자
    const current = parseFloat(currentValue);  // 두 번째 피연산자
    
    // 에러 처리: 숫자 변환이 실패했는지 확인
    // isNaN()은 값이 "Not a Number"인지 검사하는 내장 함수
    if (isNaN(prev) || isNaN(current)) return;
    
    // switch문: 선택된 연산자에 따라 계산 수행
    // 이는 여러 조건을 효율적으로 처리하는 제어 구조
    switch (operation) {
        case '+':
            result = prev + current; // 덧셈 연산
            break;
        case '-':
            result = prev - current; // 뺄셈 연산
            break;
        case '*':
            result = prev * current; // 곱셈 연산
            break;
        case '/':
            // 0으로 나누기 에러 처리
            if (current === 0) {
                alert('0으로 나눌 수 없습니다!'); // 사용자에게 경고 메시지 표시
                clearDisplay(); // 계산기 상태 초기화
                return; // 함수 종료
            }
            result = prev / current; // 나눗셈 연산
            break;
        default:
            return; // 알 수 없는 연산자인 경우 함수 종료
    }
    
    // 부동소수점 정밀도 문제 해결
    // Math.round()와 곱셈/나눗셈을 이용해 소수점 8자리까지 반올림
    currentValue = Math.round(result * 100000000) / 100000000 + '';
    
    // 계산 완료 후 상태 초기화
    operation = null;         // 연산자 초기화
    previousValue = '';       // 이전 값 초기화  
    shouldResetScreen = true; // 다음 입력 시 화면 초기화 플래그 설정
    updateDisplay();          // 결과를 화면에 표시
}

// ====== 마지막 문자 삭제 함수 ======
// 문자열 조작, 배열 인덱싱, slice 메서드 (Week 5-6)
function deleteLast() {
    // 복합 조건문: 현재 값이 한 자리 숫자이거나 음수 한 자리인 경우
    // 문자열의 length 속성과 배열 인덱싱 [0] 활용
    if (currentValue.length === 1 || (currentValue.length === 2 && currentValue[0] === '-')) {
        currentValue = '0'; // 한 자리 숫자를 삭제하면 0으로 설정
    } else {
        // 문자열 slice 메서드: 마지막 문자를 제외한 부분 추출
        // slice(0, -1)은 처음부터 끝에서 두 번째까지를 의미
        currentValue = currentValue.slice(0, -1);
    }
    updateDisplay(); // 변경된 값을 화면에 반영
}

// ====== 키보드 이벤트 처리 ======
// 이벤트 리스너, 화살표 함수, 이벤트 객체 (Week 3-4, Week 5-6)
document.addEventListener('keydown', (e) => {
    // addEventListener: HTML 문서에 이벤트 리스너 등록
    // 'keydown': 키보드 키를 누를 때 발생하는 이벤트
    // (e) => { }: 화살표 함수 문법으로 이벤트 핸들러 정의
    // e: 이벤트 객체, 키 입력에 대한 정보 포함
    
    // 숫자 키 입력 처리 (0-9)
    // 문자열 비교를 통해 숫자 키 범위 확인
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    
    // 소수점 키 입력 처리
    if (e.key === '.') appendNumber('.');
    
    // 계산 실행 키: = 또는 Enter
    // 논리 OR 연산자(||)로 두 조건 중 하나라도 만족하면 실행
    if (e.key === '=' || e.key === 'Enter') calculate();
    
    // 백스페이스 키: 마지막 문자 삭제
    if (e.key === 'Backspace') deleteLast();
    
    // ESC 키: 계산기 초기화
    if (e.key === 'Escape') clearDisplay();
    
    // 연산자 키 입력 처리
    // 복합 조건문으로 모든 연산자 키 확인
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        selectOperation(e.key);
    }
});

// ====== 계산기 구현 완료 ======
// 이 계산기는 다음 JavaScript 개념들을 활용합니다:
// 1. 변수와 데이터 타입 (let, const, string, number, boolean)
// 2. 함수 선언과 호출 (function, parameters, return)
// 3. 조건문 (if, switch, 논리 연산자)
// 4. DOM 조작 (getElementById, addEventListener, value 속성)
// 5. 문자열 조작 (includes, slice, 문자열 연결)
// 6. 타입 변환 (parseFloat, toString)
// 7. 에러 처리 (isNaN, alert)
// 8. 이벤트 처리 (keydown, click events)
// 9. 화살표 함수와 콜백 함수