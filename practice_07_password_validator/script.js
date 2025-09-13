/*
 * 비밀번호 검증기 애플리케이션 (Password Validator Application)
 * Week 7-8 주제: 클래스, 정규표현식, 고급 JavaScript 패턴
 * Week 1-2 주제: 조건문, 수학 연산, 변수
 * Week 3-4 주제: DOM 조작과 이벤트 처리
 * Week 5-6 주제: 객체와 메서드 활용
 */

/*
 * 비밀번호 검증기 클래스 (Week 7-8: ES6 클래스)
 * 객체지향 프로그래밍 개념을 활용한 코드 구조화
 * 비밀번호 강도 분석, 요구사항 검증, 시각적 피드백 제공
 */
class PasswordValidator {
    /*
     * 클래스 생성자 (Week 7-8: 생성자 함수)
     * 인스턴스 생성 시 필요한 DOM 요소들을 선택하고 초기화
     */
    constructor() {
        // 주요 DOM 요소들 선택 및 저장 (Week 3-4: DOM 선택자)
        this.passwordInput = document.getElementById('password');         // 비밀번호 입력 필드
        this.toggleButton = document.getElementById('togglePassword');    // 비밀번호 보이기/숨기기 버튼
        this.strengthFill = document.getElementById('strengthFill');      // 강도 바 채우기 요소
        this.strengthText = document.getElementById('strengthText');      // 강도 텍스트 표시 요소
        
        // 비밀번호 요구사항 체크박스들을 객체로 그룹화 (Week 7-8: 객체 활용)
        this.requirements = {
            length: document.getElementById('lengthReq'),       // 길이 요구사항
            uppercase: document.getElementById('uppercaseReq'), // 대문자 요구사항
            lowercase: document.getElementById('lowercaseReq'), // 소문자 요구사항
            number: document.getElementById('numberReq'),       // 숫자 요구사항
            special: document.getElementById('specialReq')     // 특수문자 요구사항
        };

        // 초기화 메서드 호출
        this.init();
    }

    init() {
        // 이벤트 리스너 추가
        this.passwordInput.addEventListener('input', (e) => this.validatePassword(e.target.value));
        this.toggleButton.addEventListener('click', () => this.togglePasswordVisibility());
        
        // 상태 초기화
        this.validatePassword('');
    }

    validatePassword(password) {
        const validations = this.checkRequirements(password);
        this.updateRequirementsDisplay(validations);
        this.updateStrengthMeter(password, validations);
    }

    /*
     * 비밀번호 요구사항 검증 메서드 (Week 7-8: 정규표현식과 객체 반환)
     * 다양한 조건들을 정규표현식으로 검사하여 결과를 객체로 반환
     */
    checkRequirements(password) {
        return {
            // 비밀번호 길이 검사 (Week 1-2: 비교 연산자)
            length: password.length >= 8,
            
            // 대문자 포함 여부 (Week 7-8: 정규표현식)
            // /[A-Z]/: A부터 Z까지의 대문자 하나 이상
            uppercase: /[A-Z]/.test(password),
            
            // 소문자 포함 여부
            // /[a-z]/: a부터 z까지의 소문자 하나 이상
            lowercase: /[a-z]/.test(password),
            
            // 숫자 포함 여부
            // /[0-9]/: 0부터 9까지의 숫자 하나 이상
            number: /[0-9]/.test(password),
            
            // 특수문자 포함 여부
            // 대괄호 안의 다양한 특수문자들 중 하나 이상
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
    }

    updateRequirementsDisplay(validations) {
        Object.keys(validations).forEach(requirement => {
            const element = this.requirements[requirement];
            const isValid = validations[requirement];
            
            // 기존 클래스 제거
            element.classList.remove('valid', 'invalid');
            
            // 적절한 클래스 추가
            if (isValid) {
                element.classList.add('valid');
            } else {
                element.classList.add('invalid');
            }
        });
    }

    /*
     * 비밀번호 강도 계산 메서드 (Week 1-2: 복잡한 수학 연산과 조건문)
     * 여러 기준을 종합하여 비밀번호의 강도를 0-100 점수로 평가
     * 요구사항 충족도, 길이, 다양성, 일반적 패턴 회피 등을 고려
     */
    calculateStrength(password, validations) {
        // 빈 비밀번호 처리 (Week 1-2: 조건문)
        if (password.length === 0) {
            return { score: 0, level: 'none', text: '비밀번호를 입력하여 강도를 확인하세요' };
        }

        let score = 0; // 최종 점수
        
        // 충족된 요구사항 개수 계산 (Week 7-8: Object.values와 filter)
        const validCount = Object.values(validations).filter(Boolean).length;
        
        // 충족된 요구사항을 기반으로 한 기본 점수 (Week 1-2: 수학 연산)
        // 각 요구사항당 20점 (최대 100점)
        score = validCount * 20;
        
        // 최소 길이 초과 시 보너스 점수 (Week 1-2: Math 객체)
        if (password.length > 8) {
            // 8자 초과 시 초과 글자당 2점, 최대 8점(4글자)
            score += Math.min(password.length - 8, 4) * 2;
        }
        
        // 다양한 문자 유형에 대한 보너스 (Week 7-8: Set 자료구조)
        const uniqueChars = new Set(password.toLowerCase()).size; // 고유 문자 개수
        if (uniqueChars > 6) score += 5; // 6개 이상의 서로 다른 문자 사용 시 보너스
        
        // 일반적인 약한 패턴에 대한 패널티 (Week 7-8: 정규표현식)
        if (/(.)\1{2,}/.test(password)) score -= 10;         // 반복되는 문자 (aaa, 111 등)
        if (/123|abc|qwe|password/i.test(password)) score -= 15; // 일반적인 순서나 단어
        
        // 점수를 0-100 범위로 제한 (Week 1-2: Math.max, Math.min)
        score = Math.max(0, Math.min(100, score));
        
        // 점수에 따른 강도 레벨 결정 (Week 1-2: 조건문)
        let level, text;
        if (score < 20) {
            level = 'very-weak';
            text = '매우 약함';
        } else if (score < 40) {
            level = 'weak';
            text = '약함';
        } else if (score < 60) {
            level = 'fair';
            text = '보통';
        } else if (score < 80) {
            level = 'good';
            text = '좋음';
        } else {
            level = 'strong';
            text = '강함';
        }

        // 결과 객체 반환 (Week 7-8: 객체 리터럴)
        return { score, level, text };
    }

    updateStrengthMeter(password, validations) {
        const strength = this.calculateStrength(password, validations);
        
        // 강도 바 업데이트
        this.strengthFill.className = 'strength-fill';
        if (strength.level !== 'none') {
            this.strengthFill.classList.add(strength.level);
        }
        
        // 강도 텍스트 업데이트
        this.strengthText.textContent = strength.text;
        this.strengthText.className = 'strength-text';
        if (strength.level !== 'none') {
            this.strengthText.classList.add(strength.level);
        }
    }

    togglePasswordVisibility() {
        const isPassword = this.passwordInput.type === 'password';
        const cursorPosition = this.passwordInput.selectionStart;
        
        // 입력 타입 토글
        this.passwordInput.type = isPassword ? 'text' : 'password';
        
        // 버튼 모양 토글
        this.toggleButton.classList.toggle('hidden', !isPassword);
        
        // 커서 위치 복원
        this.passwordInput.focus();
        this.passwordInput.setSelectionRange(cursorPosition, cursorPosition);
    }
}

// 추가 유틸리티 함수
const PasswordUtils = {
    // 강력한 비밀번호 제안 생성
    generateStrongPassword(length = 12) {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        let password = '';
        
        // 각 범주에서 최소 한 문자 보장
        password += this.getRandomChar(uppercase);
        password += this.getRandomChar(lowercase);
        password += this.getRandomChar(numbers);
        password += this.getRandomChar(special);
        
        // 나머지를 무작위로 채움
        const allChars = lowercase + uppercase + numbers + special;
        for (let i = 4; i < length; i++) {
            password += this.getRandomChar(allChars);
        }
        
        // 비밀번호 섞기
        return password.split('').sort(() => Math.random() - 0.5).join('');
    },
    
    getRandomChar(str) {
        return str.charAt(Math.floor(Math.random() * str.length));
    },
    
    // 비밀번호가 일반적인 약한 패턴을 포함하는지 확인
    hasWeakPatterns(password) {
        const weakPatterns = [
            /password/i,
            /123456/,
            /qwerty/i,
            /abc123/i,
            /(.)\1{2,}/, // 반복되는 문자
            /^.{1,7}$/, // 너무 짧음
        ];
        
        return weakPatterns.some(pattern => pattern.test(password));
    },
    
    // 비밀번호 크랙 시간 추정 (단순화됨)
    estimateCrackTime(password) {
        const charsetSizes = {
            lowercase: 26,
            uppercase: 26,
            numbers: 10,
            special: 32
        };
        
        let charsetSize = 0;
        if (/[a-z]/.test(password)) charsetSize += charsetSizes.lowercase;
        if (/[A-Z]/.test(password)) charsetSize += charsetSizes.uppercase;
        if (/[0-9]/.test(password)) charsetSize += charsetSizes.numbers;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) charsetSize += charsetSizes.special;
        
        const combinations = Math.pow(charsetSize, password.length);
        const guessesPerSecond = 1000000000; // 초당 10억 번 추측
        const secondsToCrack = combinations / (2 * guessesPerSecond);
        
        if (secondsToCrack < 60) return '1분 미만';
        if (secondsToCrack < 3600) return `${Math.round(secondsToCrack / 60)}분`;
        if (secondsToCrack < 86400) return `${Math.round(secondsToCrack / 3600)}시간`;
        if (secondsToCrack < 31536000) return `${Math.round(secondsToCrack / 86400)}일`;
        return `${Math.round(secondsToCrack / 31536000)}년`;
    }
};

// DOM이 로드될 때 비밀번호 검증기 초기화
document.addEventListener('DOMContentLoaded', () => {
    new PasswordValidator();
});

// 선택사항: 키보드 단축키 추가
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Shift + P로 강력한 비밀번호 생성
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        const passwordInput = document.getElementById('password');
        const strongPassword = PasswordUtils.generateStrongPassword(12);
        passwordInput.value = strongPassword;
        passwordInput.dispatchEvent(new Event('input'));
        
        // 알림 표시
        console.log('강력한 비밀번호가 생성되었습니다! 복사할 수 있습니다: ' + strongPassword);
    }
});