/*
 * JavaScript 퀴즈 게임 애플리케이션 (Quiz Game Application)
 * Week 5-6 주제: 배열과 객체 활용, 함수 정의
 * Week 7-8 주제: 고급 JavaScript (타이머, 상태 관리, localStorage)
 * Week 1-2 주제: 조건문, 반복문, 변수 활용
 * Week 3-4 주제: DOM 조작과 이벤트 처리
 */

// 퀴즈 문제 데이터베이스 (Week 7-8: 복잡한 객체 배열)
// 각 문제는 객체 형태로 저장되며 id, difficulty, question, options, correct, explanation 속성을 포함
const questions = [
    {
        id: 1,
        difficulty: 'easy',        // 난이도 (Week 1-2: 문자열)
        question: 'JavaScript에서 변수를 선언하는 키워드가 아닌 것은?', // 문제 내용
        options: ['var', 'let', 'const', 'int'], // 선택지 배열 (Week 5-6: 배열)
        correct: 3,               // 정답 인덱스 (Week 1-2: 숫자)
        explanation: 'int는 JavaScript의 변수 선언 키워드가 아닙니다.' // 해설
    },
    {
        id: 2,
        difficulty: 'easy',
        question: '다음 중 JavaScript의 데이터 타입이 아닌 것은?',
        options: ['string', 'boolean', 'float', 'number'],
        correct: 2,
        explanation: 'JavaScript에는 float 타입이 없고, 모든 숫자는 number 타입입니다.'
    },
    {
        id: 3,
        difficulty: 'easy',
        question: '배열의 길이를 구하는 속성은?',
        options: ['size', 'length', 'count', 'len'],
        correct: 1,
        explanation: '배열의 길이는 length 속성으로 구합니다.'
    },
    {
        id: 4,
        difficulty: 'medium',
        question: 'null과 undefined의 차이점은?',
        options: [
            '차이가 없다',
            'null은 값이 없음을 명시적으로, undefined는 값이 할당되지 않음',
            'undefined는 값이 없음을 명시적으로, null은 값이 할당되지 않음',
            'null은 숫자, undefined는 문자열'
        ],
        correct: 1,
        explanation: 'null은 의도적으로 값이 없음을 나타내고, undefined는 값이 할당되지 않은 상태입니다.'
    },
    {
        id: 5,
        difficulty: 'medium',
        question: '화살표 함수에서 this는 어떻게 동작하나요?',
        options: [
            '호출한 객체를 가리킨다',
            '전역 객체를 가리킨다',
            '상위 스코프의 this를 그대로 사용한다',
            'undefined이다'
        ],
        correct: 2,
        explanation: '화살표 함수는 자신만의 this를 가지지 않고 상위 스코프의 this를 사용합니다.'
    },
    {
        id: 6,
        difficulty: 'medium',
        question: '배열 메서드 중 원본 배열을 변경하지 않는 것은?',
        options: ['push', 'pop', 'map', 'sort'],
        correct: 2,
        explanation: 'map은 새로운 배열을 반환하며 원본 배열을 변경하지 않습니다.'
    },
    {
        id: 7,
        difficulty: 'hard',
        question: '클로저(Closure)란 무엇인가요?',
        options: [
            '함수가 종료되는 것',
            '함수가 선언된 환경의 변수를 기억하는 것',
            '메모리 누수를 방지하는 것',
            '변수를 비공개로 만드는 것'
        ],
        correct: 1,
        explanation: '클로저는 함수가 선언된 렉시컬 환경을 기억하여 외부 변수에 접근할 수 있게 합니다.'
    },
    {
        id: 8,
        difficulty: 'hard',
        question: 'Promise의 상태가 아닌 것은?',
        options: ['pending', 'fulfilled', 'rejected', 'cancelled'],
        correct: 3,
        explanation: 'Promise는 pending, fulfilled, rejected 세 가지 상태만 가집니다.'
    },
    {
        id: 9,
        difficulty: 'easy',
        question: '문자열을 숫자로 변환하는 함수는?',
        options: ['toString()', 'parseInt()', 'toNumber()', 'convertInt()'],
        correct: 1,
        explanation: 'parseInt()는 문자열을 정수로 변환합니다.'
    },
    {
        id: 10,
        difficulty: 'hard',
        question: 'async/await에서 에러 처리는 어떻게 하나요?',
        options: [
            '.catch() 메서드만 사용',
            'try...catch 블록 사용',
            '.then() 메서드 사용',
            '에러 처리가 불가능'
        ],
        correct: 1,
        explanation: 'async/await에서는 try...catch 블록으로 에러를 처리합니다.'
    }
];

// 게임 상태 관리 변수들 (Week 1-2: 변수와 자료형)
let currentQuestionIndex = 0;  // 현재 문제 인덱스 (Week 1-2: 숫자)
let score = 0;                 // 현재 점수 (Week 1-2: 숫자)
let correctAnswers = 0;        // 맞춘 문제 개수 (Week 1-2: 숫자)
let selectedDifficulty = null; // 선택된 난이도 (Week 1-2: null 값)
let filteredQuestions = [];    // 난이도에 따라 필터링된 문제 배열 (Week 5-6: 배열)
let timer = null;              // 타이머 참조 변수 (Week 7-8: 타이머 관리)
let timeLeft = 30;             // 남은 시간 (초 단위)

// 화면 전환을 위한 스크린 객체 (Week 7-8: 객체 리터럴)
const screens = {
    start: document.getElementById('startScreen'),   // 시작 화면
    game: document.getElementById('gameScreen'),     // 게임 화면  
    result: document.getElementById('resultScreen')  // 결과 화면
};

// 게임에서 사용하는 모든 DOM 요소들을 객체로 관리 (Week 3-4: DOM 선택자)
// 객체로 그룹화하여 코드 가독성과 유지보수성 향상 (Week 7-8: 객체 활용)
const elements = {
    // 시작 화면 요소들
    startBtn: document.getElementById('startBtn'),                          // 시작 버튼
    difficultyBtns: document.querySelectorAll('.difficulty-btn'),         // 난이도 선택 버튼들
    highScore: document.getElementById('highScore'),                       // 최고 점수 표시
    
    // 게임 화면 요소들
    currentQuestion: document.getElementById('currentQuestion'),           // 현재 문제 번호
    totalQuestions: document.getElementById('totalQuestions'),             // 전체 문제 수
    score: document.getElementById('score'),                               // 현재 점수
    progressFill: document.getElementById('progressFill'),                 // 진행률 바
    timeLeft: document.getElementById('timeLeft'),                         // 남은 시간
    questionText: document.getElementById('questionText'),                 // 문제 텍스트
    optionsContainer: document.getElementById('optionsContainer'),         // 선택지 컨테이너
    feedback: document.getElementById('feedback'),                         // 정답/오답 피드백
    
    // 결과 화면 요소들
    finalScore: document.getElementById('finalScore'),                     // 최종 점수
    accuracy: document.getElementById('accuracy'),                         // 정답률
    correctAnswersText: document.getElementById('correctAnswers'),         // 맞춘 문제 수
    newHighScore: document.getElementById('newHighScore'),                 // 신기록 알림
    restartBtn: document.getElementById('restartBtn'),                     // 재시작 버튼
    homeBtn: document.getElementById('homeBtn')                            // 홈으로 버튼
};

/*
 * 애플리케이션 초기화 함수 (Week 5-6: 함수 정의와 호출)
 * 게임 시작 시 필요한 초기 설정들을 수행
 */
function init() {
    loadHighScore();      // localStorage에서 최고 점수 불러오기
    setupEventListeners(); // 이벤트 리스너 설정
}

function setupEventListeners() {
    elements.difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => selectDifficulty(btn));
    });
    
    elements.startBtn.addEventListener('click', startGame);
    elements.restartBtn.addEventListener('click', () => {
        showScreen('start');
        resetGame();
    });
    elements.homeBtn.addEventListener('click', () => {
        showScreen('start');
        resetGame();
    });
}

function selectDifficulty(btn) {
    elements.difficultyBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedDifficulty = btn.dataset.difficulty;
    elements.startBtn.disabled = false;
}

/*
 * 게임 시작 함수 (Week 5-6: 배열 필터링과 조건문)
 * 난이도에 따라 문제를 필터링하고 게임 상태를 초기화하여 게임 시작
 */
function startGame() {
    // 난이도가 선택되지 않았으면 함수 종료 (Week 1-2: 조건문)
    if (!selectedDifficulty) return;
    
    // 난이도에 따른 문제 필터링 (Week 5-6: 배열 filter 메서드)
    filteredQuestions = questions.filter(q => 
        // easy 난이도일 때는 모든 문제, 나머지는 해당 난이도만
        selectedDifficulty === 'easy' ? true : q.difficulty === selectedDifficulty || q.difficulty === 'medium'
    );
    
    // 문제 순서 섮기 후 5문제만 선택 (Week 5-6: 배열 메서드 체이닝)
    filteredQuestions = shuffleArray(filteredQuestions).slice(0, 5);
    
    // 게임 상태 초기화 (Week 1-2: 변수 할당)
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    
    // UI 업데이트 (Week 3-4: DOM 조작)
    elements.totalQuestions.textContent = filteredQuestions.length;
    elements.score.textContent = score;
    
    // 게임 화면으로 전환 후 첫 문제 로드
    showScreen('game');
    loadQuestion();
}

/*
 * 문제 로드 함수 (Week 3-4: DOM 조작과 동적 요소 생성)
 * 현재 문제를 화면에 표시하고 선택지 버튼들을 동적으로 생성
 */
function loadQuestion() {
    // 모든 문제를 다 풀었으면 게임 종료 (Week 1-2: 조건문)
    if (currentQuestionIndex >= filteredQuestions.length) {
        endGame();
        return;
    }
    
    // 현재 문제 객체 가져오기 (Week 5-6: 배열 인덱스 접근)
    const question = filteredQuestions[currentQuestionIndex];
    
    // UI 업데이트: 문제 번호와 내용 (Week 3-4: DOM textContent)
    elements.currentQuestion.textContent = currentQuestionIndex + 1;
    elements.questionText.textContent = question.question;
    
    // 진행률 바 업데이트 (Week 1-2: 수학 연산)
    const progress = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;
    elements.progressFill.style.width = `${progress}%`;
    
    // 선택지 순서 섮기 (매번 다른 순서로 표시) (Week 5-6: 배열 map과 shuffle)
    const shuffledOptions = shuffleArray([...question.options.map((opt, idx) => ({text: opt, index: idx}))]);
    
    // 기존 선택지 버튼들 제거 (Week 3-4: DOM 조작)
    elements.optionsContainer.innerHTML = '';
    
    // 섮인 선택지들을 버튼으로 동적 생성 (Week 5-6: 배열 forEach)
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');  // 버튼 요소 생성
        button.className = 'option-btn';
        button.textContent = option.text;
        button.dataset.index = option.index;             // 데이터 속성에 인덱스 저장
        
        // 각 버튼에 클릭 이벤트 리스너 추가 (Week 3-4: 이벤트 리스너)
        button.addEventListener('click', () => checkAnswer(option.index));
        
        elements.optionsContainer.appendChild(button);    // 컨테이너에 버튼 추가
    });
    
    // 피드백 메시지 숨김 및 타이머 시작
    elements.feedback.classList.add('hidden');
    startTimer();
}

/*
 * 정답 확인 함수 (Week 1-2: 조건문과 수학 연산)
 * 사용자가 선택한 답을 확인하고 점수 계산, UI 업데이트 수행
 * 타이머 정지, 정답/오답 표시, 점수 계산 등 게임 로직의 핵심
 */
function checkAnswer(selectedIndex) {
    // 타이머 정지 (Week 7-8: 타이머 관리)
    clearInterval(timer);
    
    // 현재 문제와 정답 여부 확인 (Week 5-6: 객체 속성 접근)
    const question = filteredQuestions[currentQuestionIndex];
    const correct = selectedIndex === question.correct; // 정답 여부 판단 (Week 1-2: 비교 연산자)
    const buttons = elements.optionsContainer.querySelectorAll('.option-btn');
    
    // 모든 선택지 버튼에 대한 시각적 피드백 (Week 5-6: 배열 순회)
    buttons.forEach(btn => {
        btn.classList.add('disabled');  // 버튼 비활성화 표시
        btn.disabled = true;            // 버튼 클릭 방지
        
        // 정답 버튼 하이라이트 (Week 3-4: CSS 클래스 조작)
        if (parseInt(btn.dataset.index) === question.correct) {
            btn.classList.add('correct');
        } 
        // 사용자가 선택한 오답 하이라이트
        else if (parseInt(btn.dataset.index) === selectedIndex) {
            btn.classList.add('incorrect');
        }
    });
    
    // 정답/오답에 따른 점수 계산 및 피드백 (Week 1-2: 조건문)
    if (correct) {
        correctAnswers++;                           // 정답 개수 증가
        const points = Math.ceil(timeLeft * 10);    // 남은 시간에 비례한 점수 (Week 1-2: Math 객체)
        score += points;                            // 총 점수에 추가
        elements.score.textContent = score;         // UI에 점수 업데이트
        showFeedback('정답입니다! +' + points + '점', true);
    } else {
        // 오답일 때 해설 표시
        showFeedback('오답입니다. ' + question.explanation, false);
    }
    
    // 2초 후 다음 문제로 이동 (Week 7-8: setTimeout 타이머)
    setTimeout(() => {
        currentQuestionIndex++;  // 문제 인덱스 증가
        loadQuestion();         // 다음 문제 로드
    }, 2000);
}

function showFeedback(message, isCorrect) {
    elements.feedback.textContent = message;
    elements.feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    elements.feedback.classList.remove('hidden');
}

function startTimer() {
    timeLeft = 30;
    elements.timeLeft.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        elements.timeLeft.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(-1);
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    
    const accuracy = Math.round((correctAnswers / filteredQuestions.length) * 100);
    
    elements.finalScore.textContent = score;
    elements.accuracy.textContent = `${accuracy}%`;
    elements.correctAnswersText.textContent = `${correctAnswers}/${filteredQuestions.length}`;
    
    const highScore = localStorage.getItem('quizHighScore') || 0;
    if (score > highScore) {
        localStorage.setItem('quizHighScore', score);
        elements.newHighScore.classList.remove('hidden');
    } else {
        elements.newHighScore.classList.add('hidden');
    }
    
    showScreen('result');
}

function resetGame() {
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    selectedDifficulty = null;
    filteredQuestions = [];
    
    elements.difficultyBtns.forEach(btn => btn.classList.remove('selected'));
    elements.startBtn.disabled = true;
    loadHighScore();
}

function loadHighScore() {
    const highScore = localStorage.getItem('quizHighScore') || 0;
    elements.highScore.textContent = highScore;
}

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    screens[screenName].classList.remove('hidden');
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

init();