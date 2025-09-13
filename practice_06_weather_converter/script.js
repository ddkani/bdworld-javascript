/*
 * 온도 변환기 애플리케이션 (Temperature Converter)
 * Week 1-2 주제: 변수, 수학 연산, 함수 정의
 * Week 3-4 주제: DOM 조작과 이벤트 처리
 * Week 5-6 주제: 함수와 배열 활용
 * Week 7-8 주제: localStorage, 실시간 업데이트
 */

// DOM 요소 선택 (Week 3-4: DOM 선택자)
const celsiusInput = document.getElementById('celsius');           // 섭씨 온도 입력 필드
const fahrenheitInput = document.getElementById('fahrenheit');     // 화씨 온도 입력 필드  
const kelvinInput = document.getElementById('kelvin');             // 켈빈 온도 입력 필드
const waterStateElement = document.getElementById('water-state');   // 물의 상태 표시 요소
const feelDescriptionElement = document.getElementById('feel-description'); // 체감 온도 설명
const gaugeFill = document.getElementById('gauge-fill');           // 온도 게이지 채우기 요소
const datetimeElement = document.getElementById('datetime');       // 현재 시간 표시 요소
const historyList = document.getElementById('history-list');       // 변환 기록 목록
const clearHistoryBtn = document.getElementById('clear-history');  // 기록 삭제 버튼

// 변환 기록 저장 배열 (Week 5-6: 배열 활용)
let conversionHistory = [];

/*
 * 온도 변환 함수들 (Week 1-2: 수학 연산과 함수 정의)
 * 각기 다른 온도 단위 간의 변환 공식을 구현
 */

// 섭씨에서 화씨로 변환 (Week 1-2: 수학 공식)
// 공식: °F = (°C × 9/5) + 32
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// 섭씨에서 켈빈으로 변환 (Week 1-2: 수학 공식)
// 공식: K = °C + 273.15 (절대온도)
function celsiusToKelvin(celsius) {
    return celsius + 273.15;
}

// 화씨에서 섭씨로 변환 (Week 1-2: 수학 공식)
// 공식: °C = (°F - 32) × 5/9
function fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
}

// 켈빈에서 섭씨로 변환 (Week 1-2: 수학 공식)
// 공식: °C = K - 273.15
function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
}

/*
 * 메인 온도 업데이트 함수 (Week 1-2: 조건문과 수학 연산)
 * 사용자가 입력한 온도를 기준으로 모든 단위로 변환하고 UI 업데이트
 * 입력 값 검증, 변환, UI 업데이트, 기록 추가를 종합적으로 처리
 */
function updateTemperatures(value, unit) {
    // 입력값 유효성 검사 (Week 1-2: 조건문과 숫자 판별)
    if (isNaN(value) || value === '') {
        return; // 유효하지 않은 값이면 함수 종료
    }
    
    let celsius; // 모든 변환의 기준이 되는 섭씨 온도
    
    // 입력된 단위에 따라 섭씨로 변환 (Week 1-2: switch 문)
    switch(unit) {
        case 'celsius':
            celsius = parseFloat(value);                    // 이미 섭씨이므로 그대로 사용
            break;
        case 'fahrenheit':
            celsius = fahrenheitToCelsius(parseFloat(value)); // 화씨를 섭씨로 변환
            break;
        case 'kelvin':
            celsius = kelvinToCelsius(parseFloat(value));     // 켈빈을 섭씨로 변환
            break;
    }
    
    // 물리적 한계 검사: 절대영도 이하는 불가능 (Week 1-2: 조건문)
    if (celsius < -273.15) {
        alert('온도는 절대영도(-273.15°C) 이상이어야 합니다!');
        return;
    }
    
    // 섭씨를 기준으로 다른 단위들 계산 (Week 5-6: 함수 호출)
    const fahrenheit = celsiusToFahrenheit(celsius);
    const kelvin = celsiusToKelvin(celsius);
    
    // 입력한 필드를 제외한 나머지 필드들 업데이트 (Week 3-4: DOM 조작)
    // 무한 루프 방지를 위해 입력한 필드는 업데이트하지 않음
    if (unit !== 'celsius') {
        celsiusInput.value = celsius.toFixed(2);    // 소수점 2자리까지 표시
    }
    if (unit !== 'fahrenheit') {
        fahrenheitInput.value = fahrenheit.toFixed(2);
    }
    if (unit !== 'kelvin') {
        kelvinInput.value = kelvin.toFixed(2);
    }
    
    // 부가 기능들 업데이트 (Week 5-6: 함수 호출)
    updateWaterState(celsius);       // 물의 상태 업데이트
    updateFeelDescription(celsius);  // 체감 온도 업데이트
    updateGauge(celsius);           // 온도 게이지 업데이트
    addToHistory(celsius, fahrenheit, kelvin); // 변환 기록 추가
}

function getWaterState(celsius) {
    if (celsius <= 0) {
        return '고체 (얼음) 🧊';
    } else if (celsius >= 100) {
        return '기체 (수증기) ☁️';
    } else {
        return '액체 (물) 💧';
    }
}

function updateWaterState(celsius) {
    waterStateElement.textContent = getWaterState(celsius);
}

function getFeelDescription(celsius) {
    if (celsius < -20) {
        return '극도로 추움 🥶';
    } else if (celsius < 0) {
        return '매우 추움 ❄️';
    } else if (celsius < 10) {
        return '추움 🧥';
    } else if (celsius < 20) {
        return '서늘함 🍃';
    } else if (celsius < 25) {
        return '쾌적함 😊';
    } else if (celsius < 30) {
        return '따뜻함 ☀️';
    } else if (celsius < 35) {
        return '더움 🥵';
    } else if (celsius < 40) {
        return '매우 더움 🔥';
    } else {
        return '극도로 더움 🌋';
    }
}

function updateFeelDescription(celsius) {
    feelDescriptionElement.textContent = getFeelDescription(celsius);
}

function updateGauge(celsius) {
    const minTemp = -50;
    const maxTemp = 150;
    const clampedTemp = Math.max(minTemp, Math.min(maxTemp, celsius));
    const percentage = ((clampedTemp - minTemp) / (maxTemp - minTemp)) * 100;
    
    gaugeFill.style.left = `${percentage}%`;
}

function updateDateTime() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    datetimeElement.textContent = now.toLocaleString('ko-KR', options);
}

function addToHistory(celsius, fahrenheit, kelvin) {
    const historyItem = {
        celsius: celsius.toFixed(2),
        fahrenheit: fahrenheit.toFixed(2),
        kelvin: kelvin.toFixed(2),
        time: new Date().toLocaleTimeString('ko-KR')
    };
    
    conversionHistory.unshift(historyItem);
    if (conversionHistory.length > 10) {
        conversionHistory.pop();
    }
    
    saveHistory();
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    
    conversionHistory.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.time}: ${item.celsius}°C = ${item.fahrenheit}°F = ${item.kelvin}K`;
        historyList.appendChild(li);
    });
}

function saveHistory() {
    localStorage.setItem('temperatureHistory', JSON.stringify(conversionHistory));
}

function loadHistory() {
    const saved = localStorage.getItem('temperatureHistory');
    if (saved) {
        conversionHistory = JSON.parse(saved);
        renderHistory();
    }
}

function clearHistory() {
    conversionHistory = [];
    localStorage.removeItem('temperatureHistory');
    renderHistory();
}

celsiusInput.addEventListener('input', (e) => {
    updateTemperatures(e.target.value, 'celsius');
});

fahrenheitInput.addEventListener('input', (e) => {
    updateTemperatures(e.target.value, 'fahrenheit');
});

kelvinInput.addEventListener('input', (e) => {
    updateTemperatures(e.target.value, 'kelvin');
});

clearHistoryBtn.addEventListener('click', clearHistory);

celsiusInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        celsiusInput.value = (parseFloat(celsiusInput.value) || 0) + 1;
        updateTemperatures(celsiusInput.value, 'celsius');
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        celsiusInput.value = (parseFloat(celsiusInput.value) || 0) - 1;
        updateTemperatures(celsiusInput.value, 'celsius');
    }
});

/*
 * 애플리케이션 초기화 및 실시간 기능 시작 (Week 7-8: 타이머와 초기화)
 * 페이지 로드 시 필요한 초기 설정과 실시간 업데이트 시작
 */

// 1초마다 현재 시간 업데이트 (Week 7-8: setInterval)
setInterval(updateDateTime, 1000);

// 초기 시간 표시
updateDateTime();

// 저장된 변환 기록 불러오기 (Week 7-8: localStorage)
loadHistory();

// 기본값으로 20도 섭씨 온도 설정 (Week 5-6: 함수 호출)
updateTemperatures(20, 'celsius');