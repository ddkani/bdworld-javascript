/*
 * 다기능 타이머 애플리케이션 (Multi-Timer Application)
 * Week 7-8 주제: 타이머 관리, setInterval, clearInterval
 * Week 1-2 주제: 변수, 수학 연산, 조건문
 * Week 3-4 주제: DOM 조작과 이벤트 처리
 * Week 5-6 주제: 함수 정의와 활용
 */

// 타이머 인터벌 참조 변수들 (Week 7-8: 타이머 관리)
let timerInterval = null;     // 카운트다운 타이머 인터벌
let stopwatchInterval = null; // 스톱워치 인터벌
let pomodoroInterval = null;  // 포모도로 타이머 인터벌

// 카운트다운 타이머 관련 변수들 (Week 1-2: 변수와 숫자)
let timerSeconds = 0;      // 현재 남은 시간 (초)
let timerTotalSeconds = 0; // 설정된 전체 시간 (초)

// 스톱워치 관련 변수들 (Week 1-2: 변수와 숫자)
let stopwatchStartTime = 0;    // 스톱워치 시작 시간 (타임스탬프)
let stopwatchElapsedTime = 0;  // 경과된 시간 (밀리초)
let lapStartTime = 0;          // 랩 시작 시간
let lapCount = 0;              // 랩 카운트

// 포모도로 타이머 관련 변수들 (Week 1-2: 변수와 불린값)
let pomodoroSeconds = 25 * 60;      // 포모도로 시간 (25분 = 1500초)
let pomodoroTotalSeconds = 25 * 60; // 전체 포모도로 시간
let isWorkSession = true;           // 작업 세션 여부 (true: 작업, false: 휴식)
let sessionCount = 1;               // 세션 카운트

// DOM 요소 선택 (Week 3-4: DOM 선택자)
const tabBtns = document.querySelectorAll('.tab-btn');       // 탭 버튼들
const tabContents = document.querySelectorAll('.tab-content'); // 탭 내용들

/*
 * 탭 전환 이벤트 리스너 (Week 3-4: 이벤트 처리와 DOM 조작)
 * 사용자가 클릭한 탭에 따라 화면을 전환하는 기능
 */
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 데이터 속성에서 탭 ID 가져오기 (Week 3-4: dataset 속성)
        const tab = btn.dataset.tab;
        
        // 모든 탭에서 active 클래스 제거 (Week 5-6: 배열 forEach)
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // 선택된 탭에 active 클래스 추가 (Week 3-4: CSS 클래스 조작)
        btn.classList.add('active');
        document.getElementById(tab).classList.add('active');
    });
});

const timerDisplay = document.getElementById('timerDisplay');
const timerProgress = document.getElementById('timerProgress');
const hoursInput = document.getElementById('hoursInput');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const timerStartBtn = document.getElementById('timerStart');
const timerPauseBtn = document.getElementById('timerPause');
const timerResetBtn = document.getElementById('timerReset');

const presetBtns = document.querySelectorAll('.preset-btn');
presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const seconds = parseInt(btn.dataset.time);
        hoursInput.value = Math.floor(seconds / 3600);
        minutesInput.value = Math.floor((seconds % 3600) / 60);
        secondsInput.value = seconds % 60;
    });
});

/*
 * 타이머 디스플레이 업데이트 함수 (Week 1-2: 수학 연산과 문자열 처리)
 * 초 단위 시간을 시:분:초 형식으로 변환하여 화면에 표시
 * 또한 원형 진행률 바도 업데이트
 */
function updateTimerDisplay() {
    // 시간 계산 (Week 1-2: 수학 연산)
    const hours = Math.floor(timerSeconds / 3600);        // 시간 = 전체초 / 3600
    const minutes = Math.floor((timerSeconds % 3600) / 60); // 분 = (나머지초 % 3600) / 60
    const seconds = timerSeconds % 60;                     // 초 = 나머지초 % 60
    
    // HH:MM:SS 형식으로 표시 (Week 1-2: 문자열 메서드)
    // padStart(2, '0'): 2자리수로 만들기 위해 앞에 0 추가
    timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // SVG 원형 진행률 바 업데이트 (Week 1-2: 원주율 계산)
    const circumference = 2 * Math.PI * 116;  // 원의 둥레 (2πr, r=116)
    
    // 진행률에 따른 오프셋 계산
    const offset = circumference - (timerSeconds / timerTotalSeconds) * circumference;
    timerProgress.style.strokeDashoffset = offset;
}

/*
 * 카운트다운 타이머 시작 함수 (Week 7-8: 타이머와 인터벌)
 * 사용자가 설정한 시간에 따라 카운트다운 타이머를 시작
 * 매초마다 시간을 감소시키고 0에 도달하면 알림
 */
function startTimer() {
    // 이미 타이머가 실행 중이면 종료 (Week 1-2: 조건문)
    if (timerInterval) return;
    
    // 사용자 입력값 가져오기 (Week 3-4: DOM 값 읽기)
    const hours = parseInt(hoursInput.value) || 0;   // 시간 (기본값 0)
    const minutes = parseInt(minutesInput.value) || 0; // 분 (기본값 0)
    const seconds = parseInt(secondsInput.value) || 0; // 초 (기본값 0)
    
    // 최초 시작 시에만 시간 설정 (Week 1-2: 조건문)
    if (timerSeconds === 0) {
        // 시:분:초를 초 단위로 변환 (Week 1-2: 수학 연산)
        timerSeconds = hours * 3600 + minutes * 60 + seconds;
        timerTotalSeconds = timerSeconds; // 진행률 계산용
    }
    
    // 시간이 설정되지 않았으면 에러 메시지 (Week 1-2: 조건문)
    if (timerSeconds === 0) {
        alert('타이머 시간을 설정해주세요!');
        return;
    }
    
    // 버튼 상태 업데이트 (Week 3-4: DOM 조작)
    timerStartBtn.disabled = true;   // 시작 버튼 비활성화
    timerPauseBtn.disabled = false;  // 일시정지 버튼 활성화
    
    // 1초마다 실행되는 인터벌 설정 (Week 7-8: setInterval)
    timerInterval = setInterval(() => {
        timerSeconds--;        // 시간 1초 감소
        updateTimerDisplay();  // 화면 업데이트
        
        // 시간이 다 되었을 때 (Week 1-2: 조건문)
        if (timerSeconds <= 0) {
            clearInterval(timerInterval); // 인터벌 정지
            timerInterval = null;         // 변수 초기화
            
            // 버튼 상태 복원
            timerStartBtn.disabled = false;
            timerPauseBtn.disabled = true;
            
            // 알림 소리 및 메시지
            playNotification();
            alert('타이머가 종료되었습니다!');
        }
    }, 1000); // 1000ms = 1초
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerStartBtn.disabled = false;
    timerPauseBtn.disabled = true;
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerSeconds = 0;
    timerTotalSeconds = 0;
    updateTimerDisplay();
    timerStartBtn.disabled = false;
    timerPauseBtn.disabled = true;
    hoursInput.value = 0;
    minutesInput.value = 0;
    secondsInput.value = 0;
    timerProgress.style.strokeDashoffset = 730;
}

timerStartBtn.addEventListener('click', startTimer);
timerPauseBtn.addEventListener('click', pauseTimer);
timerResetBtn.addEventListener('click', resetTimer);

const stopwatchDisplay = document.getElementById('stopwatchDisplay');
const stopwatchStartBtn = document.getElementById('stopwatchStart');
const stopwatchPauseBtn = document.getElementById('stopwatchPause');
const stopwatchLapBtn = document.getElementById('stopwatchLap');
const stopwatchResetBtn = document.getElementById('stopwatchReset');
const lapList = document.getElementById('lapList');

function formatStopwatchTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}

function updateStopwatchDisplay() {
    const currentTime = Date.now() - stopwatchStartTime + stopwatchElapsedTime;
    const hours = Math.floor(currentTime / 3600000);
    const displayTime = currentTime % 3600000;
    
    stopwatchDisplay.textContent = `${String(hours).padStart(2, '0')}:${formatStopwatchTime(displayTime)}`;
}

function startStopwatch() {
    if (stopwatchInterval) return;
    
    stopwatchStartTime = Date.now();
    stopwatchStartBtn.disabled = true;
    stopwatchPauseBtn.disabled = false;
    stopwatchLapBtn.disabled = false;
    
    if (lapStartTime === 0) {
        lapStartTime = Date.now();
    }
    
    stopwatchInterval = setInterval(updateStopwatchDisplay, 10);
}

function pauseStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    stopwatchElapsedTime += Date.now() - stopwatchStartTime;
    stopwatchStartBtn.disabled = false;
    stopwatchPauseBtn.disabled = true;
}

function recordLap() {
    if (!stopwatchInterval) return;
    
    lapCount++;
    const currentTime = Date.now() - stopwatchStartTime + stopwatchElapsedTime;
    const lapTime = currentTime - lapStartTime + (stopwatchElapsedTime - lapStartTime);
    
    const lapItem = document.createElement('li');
    lapItem.innerHTML = `
        <span>랩 ${lapCount}</span>
        <span>${formatStopwatchTime(currentTime)}</span>
    `;
    
    lapList.insertBefore(lapItem, lapList.firstChild);
    lapStartTime = currentTime;
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    stopwatchStartTime = 0;
    stopwatchElapsedTime = 0;
    lapStartTime = 0;
    lapCount = 0;
    stopwatchDisplay.textContent = '00:00:00.00';
    lapList.innerHTML = '';
    stopwatchStartBtn.disabled = false;
    stopwatchPauseBtn.disabled = true;
    stopwatchLapBtn.disabled = true;
}

stopwatchStartBtn.addEventListener('click', startStopwatch);
stopwatchPauseBtn.addEventListener('click', pauseStopwatch);
stopwatchLapBtn.addEventListener('click', recordLap);
stopwatchResetBtn.addEventListener('click', resetStopwatch);

const pomodoroDisplay = document.getElementById('pomodoroDisplay');
const sessionType = document.getElementById('sessionType');
const sessionCountDisplay = document.getElementById('sessionCount');
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');
const pomodoroStartBtn = document.getElementById('pomodoroStart');
const pomodoroPauseBtn = document.getElementById('pomodoroPause');
const pomodoroResetBtn = document.getElementById('pomodoroReset');

function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoroSeconds / 60);
    const seconds = pomodoroSeconds % 60;
    
    pomodoroDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startPomodoro() {
    if (pomodoroInterval) return;
    
    pomodoroStartBtn.disabled = true;
    pomodoroPauseBtn.disabled = false;
    
    pomodoroInterval = setInterval(() => {
        pomodoroSeconds--;
        updatePomodoroDisplay();
        
        if (pomodoroSeconds <= 0) {
            clearInterval(pomodoroInterval);
            pomodoroInterval = null;
            playNotification();
            
            if (isWorkSession) {
                alert('작업 시간이 끝났습니다! 휴식 시간입니다.');
                isWorkSession = false;
                sessionType.textContent = '휴식 시간';
                pomodoroSeconds = parseInt(breakTimeInput.value) * 60;
            } else {
                sessionCount++;
                sessionCountDisplay.textContent = `세션 #${sessionCount}`;
                alert('휴식 시간이 끝났습니다! 다시 작업을 시작하세요.');
                isWorkSession = true;
                sessionType.textContent = '작업 시간';
                pomodoroSeconds = parseInt(workTimeInput.value) * 60;
            }
            
            updatePomodoroDisplay();
            pomodoroStartBtn.disabled = false;
            pomodoroPauseBtn.disabled = true;
        }
    }, 1000);
}

function pausePomodoro() {
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
    pomodoroStartBtn.disabled = false;
    pomodoroPauseBtn.disabled = true;
}

function resetPomodoro() {
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
    isWorkSession = true;
    sessionCount = 1;
    pomodoroSeconds = parseInt(workTimeInput.value) * 60;
    sessionType.textContent = '작업 시간';
    sessionCountDisplay.textContent = '세션 #1';
    updatePomodoroDisplay();
    pomodoroStartBtn.disabled = false;
    pomodoroPauseBtn.disabled = true;
}

pomodoroStartBtn.addEventListener('click', startPomodoro);
pomodoroPauseBtn.addEventListener('click', pausePomodoro);
pomodoroResetBtn.addEventListener('click', resetPomodoro);

workTimeInput.addEventListener('change', () => {
    if (!pomodoroInterval && isWorkSession) {
        pomodoroSeconds = parseInt(workTimeInput.value) * 60;
        updatePomodoroDisplay();
    }
});

breakTimeInput.addEventListener('change', () => {
    if (!pomodoroInterval && !isWorkSession) {
        pomodoroSeconds = parseInt(breakTimeInput.value) * 60;
        updatePomodoroDisplay();
    }
});

/*
 * 알림 소리 재생 함수 (Week 7-8: Web Audio API 활용)
 * 타이머 종료 시 비프 소리를 생성하여 사용자에게 알림
 * 브라우저의 Web Audio API를 사용한 고급 소리 생성
 */
function playNotification() {
    // 오디오 컨텍스트 생성 (Week 7-8: Web Audio API)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // 오디오 노드들 생성
    const oscillator = audioContext.createOscillator(); // 주파수 생성기
    const gainNode = audioContext.createGain();         // 볼륨 조절기
    
    // 오디오 노드 연결 (oscillator → gainNode → 스피커)
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // 소리 설정 (Week 1-2: 숫자 값 설정)
    oscillator.frequency.value = 800; // 800Hz 주파수 (비프 소리)
    
    // 볼륨 설정 및 페이드 인/아웃 효과 (Week 7-8: 오디오 제어)
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);                    // 시작 볼륨
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5); // 0.5초에 걸쳐 볼륨 감소
    
    // 소리 재생 시작과 종료
    oscillator.start(audioContext.currentTime);       // 지금 재생 시작
    oscillator.stop(audioContext.currentTime + 0.5);  // 0.5초 후 재생 중지
}

/*
 * 애플리케이션 초기화 (Week 5-6: 함수 호출)
 * 페이지 로드 시 각 타이머의 초기 디스플레이 상태 설정
 */

// 각 타이머의 초기 디스플레이 업데이트
updateTimerDisplay();    // 카운트다운 타이머 디스플레이 초기화
updatePomodoroDisplay(); // 포모도로 타이머 디스플레이 초기화