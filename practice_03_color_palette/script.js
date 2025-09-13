/*
 * 색상 팔레트 생성기 애플리케이션 (Color Palette Generator)
 * Week 1-2 주제: 변수, 자료형, 수학 연산
 * Week 3-4 주제: DOM 조작과 이벤트 처리  
 * Week 5-6 주제: 배열과 함수 활용
 * Week 7-8 주제: 고급 JavaScript (객체, 클래스, localStorage)
 */

// 전역 변수 선언 (Week 1-2: 변수와 자료형)
let colors = [];        // 현재 생성된 색상들을 저장하는 배열 (Week 5-6: 배열)
let lockedColors = [];  // 각 색상의 잠금 상태를 저장하는 배열 (Week 1-2: 불린 자료형)
let savedPalettes = []; // 저장된 팔레트들을 관리하는 배열 (Week 7-8: 중첩 배열)

// DOM 요소 선택 (Week 3-4: DOM 선택자)
const generateBtn = document.getElementById('generateBtn');     // 색상 생성 버튼
const colorCountSelect = document.getElementById('colorCount'); // 색상 개수 선택 드롭다운
const colorModeSelect = document.getElementById('colorMode');   // 색상 모드 선택 드롭다운
const paletteDiv = document.getElementById('palette');          // 팔레트 표시 컨테이너
const savedListDiv = document.getElementById('savedList');     // 저장된 팔레트 목록
const toast = document.getElementById('toast');                // 알림 메시지 요소

/*
 * 랜덤 색상 생성 함수 (Week 1-2: 수학 연산과 Math 객체)
 * RGB 값을 각각 0-255 범위에서 무작위로 생성
 */
function generateRandomColor() {
    // Math.random(): 0-1 사이의 무작위 소수 생성 (Week 1-2: Math 객체)
    // Math.floor(): 소수점 이하 버림 (정수 변환)
    // 256을 곱하여 0-255 범위의 정수 생성 (RGB 색상 범위)
    const r = Math.floor(Math.random() * 256); // Red 값 (0-255)
    const g = Math.floor(Math.random() * 256); // Green 값 (0-255) 
    const b = Math.floor(Math.random() * 256); // Blue 값 (0-255)
    
    // 객체 단축 표기법으로 RGB 객체 반환 (Week 7-8: 객체 리터럴)
    // { r, g, b }는 { r: r, g: g, b: b }와 동일
    return { r, g, b };
}

/*
 * 파스텔 색상 생성 함수 (Week 1-2: 수학 연산과 범위 제한)
 * 127-255 범위의 밝은 색상들로 부드러운 파스텔 톤 생성
 */
function generatePastelColor() {
    // 파스텔 색상 알고리즘: 127-255 범위 사용 (밝은 색조)
    // Math.random() * 127: 0-127 범위의 무작위 값
    // + 127: 127을 더하여 최종 범위를 127-254로 만듦
    const r = Math.floor((Math.random() * 127) + 127);
    const g = Math.floor((Math.random() * 127) + 127);
    const b = Math.floor((Math.random() * 127) + 127);
    
    return { r, g, b };
}

/*
 * 어두운 색상 생성 함수 (Week 1-2: 수학 연산과 범위 제한)
 * 0-127 범위의 낮은 RGB 값으로 어두운 색조 생성
 */
function generateDarkColor() {
    // 어두운 색상 알고리즘: 0-127 범위 사용 (어두운 색조)
    // 128을 곱하여 0-127 범위의 정수 생성
    const r = Math.floor(Math.random() * 128);
    const g = Math.floor(Math.random() * 128);
    const b = Math.floor(Math.random() * 128);
    
    return { r, g, b };
}

/*
 * 선명한 색상 생성 함수 (Week 1-2: 복잡한 수학 연산과 조건문)
 * HSL(Hue, Saturation, Lightness) 색상 모델을 RGB로 변환하여 선명한 색상 생성
 * 색상학 이론을 활용한 고급 색상 생성 알고리즘
 */
function generateVibrantColor() {
    // HSL 색상 모델 매개변수 설정 (Week 1-2: 변수와 수학 연산)
    const hue = Math.random() * 360;          // 색상: 0-360도 (색상환)
    const saturation = 70 + Math.random() * 30; // 채도: 70-100% (선명한 색상)
    const lightness = 50 + Math.random() * 10;  // 명도: 50-60% (적당한 밝기)
    
    // HSL에서 RGB로 변환하는 수학 공식 (Week 1-2: 고급 수학 연산)
    const c = (1 - Math.abs(2 * lightness / 100 - 1)) * saturation / 100;
    const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
    const m = lightness / 100 - c / 2;
    
    // 색상각(후)에 따른 RGB 값 계산 (Week 1-2: 조건문)
    let r, g, b;
    if (hue < 60) {           // 빨간색 ~ 노란색 구간
        r = c; g = x; b = 0;
    } else if (hue < 120) {   // 노란색 ~ 초록색 구간
        r = x; g = c; b = 0;
    } else if (hue < 180) {   // 초록색 ~ 청록색 구간
        r = 0; g = c; b = x;
    } else if (hue < 240) {   // 청록색 ~ 파란색 구간
        r = 0; g = x; b = c;
    } else if (hue < 300) {   // 파란색 ~ 자주색 구간
        r = x; g = 0; b = c;
    } else {                  // 자주색 ~ 빨간색 구간
        r = c; g = 0; b = x;
    }
    
    // 최종 RGB 값 계산 및 0-255 범위로 변환 (Week 7-8: 객체 반환)
    return {
        r: Math.floor((r + m) * 255), // Red 값
        g: Math.floor((g + m) * 255), // Green 값
        b: Math.floor((b + m) * 255)  // Blue 값
    };
}

/*
 * RGB를 HEX 색상 코드로 변환하는 함수 (Week 5-6: 배열 메서드와 문자열 처리)
 * 예: RGB(255, 0, 0) → #FF0000 (16진수 변환)
 */
function rgbToHex(r, g, b) {
    // 배열로 RGB 값들을 묶어서 map 메서드로 처리 (Week 5-6: 배열 고차함수)
    return '#' + [r, g, b].map(x => {
        // 10진수를 16진수 문자열로 변환 (Week 1-2: 진수 변환)
        const hex = x.toString(16);
        
        // 16진수가 한 자리수이면 앞에 '0' 추가 (Week 1-2: 조건문)
        // 예: 'F' → '0F', '10' → '10'
        return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase(); // 배열을 문자열로 결합 후 대문자로 변환
}

/*
 * 메인 팀레트 생성 함수 (Week 5-6: 반복문, 배열, 조건문 종합)
 * 사용자가 선택한 설정에 따라 색상 팔레트를 생성
 * 잠긴 색상은 유지하고 나머지만 새로 생성
 */
function generatePalette() {
    // 사용자 입력값 가져오기 (Week 3-4: DOM 값 읽기)
    const count = parseInt(colorCountSelect.value); // 색상 개수
    const mode = colorModeSelect.value;             // 색상 모드
    const newColors = [];                           // 새로 생성될 색상 배열
    
    // 색상 개수만큼 반복하여 색상 생성 (Week 1-2: for 반복문)
    for (let i = 0; i < count; i++) {
        // 해당 인덱스의 색상이 잠겨있는지 확인 (Week 1-2: 조건문)
        if (lockedColors[i]) {
            // 잠긴 색상은 기존 색상 유지 (Week 5-6: 배열 인덱스 접근)
            newColors.push(colors[i]);
        } else {
            // 잠기지 않은 색상은 새로 생성
            let color;
            
            // 선택된 모드에 따라 다른 색상 생성 함수 호출 (Week 1-2: switch 문)
            switch (mode) {
                case 'pastel':
                    color = generatePastelColor();   // 파스텔 색상
                    break;
                case 'dark':
                    color = generateDarkColor();     // 어두운 색상
                    break;
                case 'vibrant':
                    color = generateVibrantColor();  // 선명한 색상
                    break;
                default:
                    color = generateRandomColor();   // 기본: 랜덤 색상
            }
            newColors.push(color); // 새 색상을 배열에 추가
        }
    }
    
    // 색상 배열 업데이트
    colors = newColors;
    
    // 잠금 배열을 현재 색상 개수에 맞게 조정 (Week 5-6: 배열 slice 메서드)
    lockedColors = lockedColors.slice(0, count);
    
    // 화면에 팔레트 렌더링
    renderPalette();
}

/*
 * 팔레트 렌더링 함수 (Week 3-4: DOM 조작과 동적 HTML 생성)
 * 색상 배열을 순회하며 시각적인 색상 박스로 변환하여 화면에 표시
 */
function renderPalette() {
    // 기존 팔레트 내용 초기화 (Week 3-4: DOM 조작)
    paletteDiv.innerHTML = '';
    
    // 색상 배열을 순회하며 각 색상 박스 생성 (Week 5-6: 배열 forEach)
    colors.forEach((color, index) => {
        // 색상 포맷 변환 (Week 5-6: 함수 호출)
        const hex = rgbToHex(color.r, color.g, color.b);        // HEX 포맷 (#FF0000)
        const rgb = `rgb(${color.r}, ${color.g}, ${color.b})`; // CSS RGB 포맷
        
        // 동적으로 색상 박스 요소 생성 (Week 3-4: createElement)
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        
        // HTML 내용 동적 생성 (Week 3-4: innerHTML과 템플릿 리터럴)
        colorBox.innerHTML = `
            <div class="color-preview" style="background-color: ${rgb}">
                <button class="lock-btn ${lockedColors[index] ? 'locked' : ''}" data-index="${index}">
                    ${lockedColors[index] ? '🔒' : '🔓'}
                </button>
            </div>
            <div class="color-info">
                <div class="color-value">${hex}</div>
                <div class="color-rgb">${rgb}</div>
                <button class="copy-btn" data-color="${hex}">복사하기</button>
            </div>
        `;
        
        // 생성한 요소를 팔레트 컨테이너에 추가 (Week 3-4: appendChild)
        paletteDiv.appendChild(colorBox);
    });
    
    // 동적으로 생성된 요소들에 이벤트 리스너 추가
    attachEventListeners();
}

function attachEventListeners() {
    document.querySelectorAll('.lock-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            lockedColors[index] = !lockedColors[index];
            btn.classList.toggle('locked');
            btn.textContent = lockedColors[index] ? '🔒' : '🔓';
        });
    });
    
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            copyToClipboard(color);
        });
    });
    
    document.querySelectorAll('.color-preview').forEach((preview, index) => {
        preview.addEventListener('click', (e) => {
            if (!e.target.classList.contains('lock-btn')) {
                const hex = rgbToHex(colors[index].r, colors[index].g, colors[index].b);
                copyToClipboard(hex);
            }
        });
    });
}

/*
 * 클립보드 복사 함수 (Week 7-8: 비동기 처리와 Promise)
 * 색상 코드를 시스템 클립보드로 복사하고 사용자에게 피드백 제공
 */
function copyToClipboard(text) {
    // 클립보드 API를 사용한 비동기 복사 (Week 7-8: Promise와 비동기)
    navigator.clipboard.writeText(text)
        .then(() => {
            // 복사 성공 시 토스트 메시지 표시 (Week 7-8: Promise then)
            showToast(`${text} 복사됨!`);
        })
        .catch(err => {
            // 오류 발생 시 콘솔에 로그 출력 (Week 7-8: Promise catch)
            console.error('복사 실패:', err);
        });
}

/*
 * 토스트 메시지 표시 함수 (Week 3-4: DOM 조작과 타이머)
 * 사용자에게 짧은 알림 메시지를 2초간 표시 후 자동 숨김
 */
function showToast(message) {
    // 토스트 내용 설정 (Week 3-4: DOM textContent)
    toast.textContent = message;
    
    // 토스트 표시 (Week 3-4: CSS 클래스 조작)
    toast.classList.add('show');
    
    // 2초 후 자동으로 토스트 숨김 (Week 7-8: setTimeout 타이머)
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

function savePalette() {
    if (colors.length === 0) return;
    
    savedPalettes.push([...colors]);
    if (savedPalettes.length > 10) {
        savedPalettes.shift();
    }
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
    renderSavedPalettes();
    showToast('팔레트가 저장되었습니다!');
}

function loadSavedPalettes() {
    const saved = localStorage.getItem('savedPalettes');
    if (saved) {
        savedPalettes = JSON.parse(saved);
        renderSavedPalettes();
    }
}

function renderSavedPalettes() {
    savedListDiv.innerHTML = '';
    
    savedPalettes.forEach((palette, index) => {
        const paletteDiv = document.createElement('div');
        paletteDiv.className = 'saved-palette';
        paletteDiv.dataset.index = index;
        
        palette.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'saved-color';
            colorDiv.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
            paletteDiv.appendChild(colorDiv);
        });
        
        paletteDiv.addEventListener('click', () => {
            colors = [...palette];
            lockedColors = [];
            colorCountSelect.value = palette.length;
            renderPalette();
        });
        
        savedListDiv.appendChild(paletteDiv);
    });
}

/*
 * 메인 이벤트 리스너 등록 (Week 3-4: 이벤트 처리)
 * 사용자 인터랙션에 대한 이벤트 핸들러 연결
 */

// 색상 생성 버튼 클릭 이벤트
generateBtn.addEventListener('click', generatePalette);

// 색상 개수 변경 이벤트 (Week 3-4: change 이벤트)
colorCountSelect.addEventListener('change', () => {
    const newCount = parseInt(colorCountSelect.value);
    
    // 색상 개수가 줄어들면 기존 배열들도 조정 (Week 5-6: 배열 slice)
    if (newCount < colors.length) {
        colors = colors.slice(0, newCount);       // 색상 배열 자르기
        lockedColors = lockedColors.slice(0, newCount); // 잠금 배열도 자르기
    }
    
    // 새로운 설정으로 팔레트 재생성
    generatePalette();
});

// 색상 모드 변경 시 즉시 새 팔레트 생성
colorModeSelect.addEventListener('change', generatePalette);

/*
 * 키보드 단축키 이벤트 리스너 (Week 3-4: 키보드 이벤트)
 * 사용자 편의를 위한 키보드 단축키 기능
 */
document.addEventListener('keydown', (e) => {
    // 스페이스바 눌렀을 때 새 팔레트 생성 (Week 3-4: 이벤트 객체)
    if (e.code === 'Space') {
        e.preventDefault(); // 기본 동작(스크롤) 방지 (Week 7-8: 이벤트 제어)
        generatePalette();
    } 
    // Ctrl + S로 팔레트 저장 (Week 3-4: 수식키 조합)
    else if (e.ctrlKey && e.key === 's') {
        e.preventDefault(); // 기본 저장 대화상자 방지
        savePalette();
    }
});

/*
 * 애플리케이션 초기화 (Week 5-6: 함수 호출 순서)
 * 페이지 로드 시 실행되는 초기 설정 함수들
 */

// 저장된 팔레트 로드
loadSavedPalettes();

// 초기 팔레트 생성
generatePalette();