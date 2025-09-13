/*
 * 텍스트 분석기 애플리케이션 (Text Analyzer Application)
 * Week 7-8 주제: 클래스, 복잡한 문자열 처리, 고급 알고리즘
 * Week 5-6 주제: 배열 메서드, 정규표현식, 함수 체이닝
 * Week 3-4 주제: DOM 조작, 실시간 업데이트, 이벤트 처리
 * Week 1-2 주제: 문자열 메서드, 수학 연산, 조건문
 */

/*
 * 텍스트 분석기 클래스 (Week 7-8: ES6 클래스와 고급 문자열 분석)
 * 텍스트의 다양한 통계 정보를 실시간으로 분석하는 도구
 * 단어 개수, 가독성 분석, 단어 빈도, 읽기 시간 계산 등 종합적인 텍스트 분석 기능
 */
class TextAnalyzer {
    /*
     * 생성자: 분석기 초기 설정 및 DOM 요소 연결 (Week 7-8: 생성자와 초기화)
     */
    constructor() {
        // 메인 텍스트 입력 요소 (Week 3-4: DOM 요소 선택)
        this.textInput = document.getElementById('textInput');
        
        // 자동 분석 활성화 여부 (Week 1-2: 불린 변수)
        this.autoAnalysis = true;
        
        // 디바운스 타이머 (Week 7-8: 성능 최적화를 위한 타이머)
        this.debounceTimeout = null;
        this.currentView = 'basic';
        this.readingSpeed = 200; // 분당 단어 수
        this.sessionStartTime = null;
        this.sessionDuration = 0;
        this.timerInterval = null;
        this.timerRunning = false;
        
        // 글쓰기 목표
        this.dailyWordGoal = this.loadGoal('dailyWordGoal') || 500;
        this.sessionTimeGoal = this.loadGoal('sessionTimeGoal') || 25; // 분
        
        // 일반적인 불용어
        this.stopWords = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
            'by', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
            'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
            'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
            'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
        ]);

        // 샘플 텍스트
        this.sampleText = `글쓰기의 기술은 자신이 믿는 것을 발견하는 기술입니다. 글쓰기는 종이 위에서 생각하는 것입니다. 그것은 당신의 생각을 정리하고, 아이디어를 명확히 하며, 효과적으로 소통하도록 강요합니다. 소설을 쓰든, 이메일을 작성하든, 메모를 적든, 종이에 단어를 적는 행위는 추상적인 생각을 구체적인 표현으로 변화시킵니다.

        좋은 글쓰기는 단순히 문법과 어휘에 관한 것이 아닙니다. 그것은 독자와 연결하고, 메시지를 명확하게 전달하며, 청중의 참여를 이끌어내는 것입니다. 모든 문장은 목적을 가져야 하고, 모든 단락은 이전 단락을 바탕으로 해야 하며, 모든 장은 전체적인 이야기나 논증을 발전시켜야 합니다.

        오늘날의 디지털 시대에서 글쓰기는 그 어느 때보다 중요해졌습니다. 소셜 미디어 게시물부터 전문 보고서까지, 학술 논문부터 창작 이야기까지, 우리는 끊임없이 글을 쓰고 우리의 서면 소통 능력으로 평가받고 있습니다. 잘 쓰는 능력은 기회의 문을 열고, 관계를 구축하며, 기회를 창조합니다.`;

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
        this.updateGoalDisplay();
    }

    bindEvents() {
        // 텍스트 입력 분석
        this.textInput.addEventListener('input', () => {
            this.debouncedAnalysis();
        });

        // 텍스트 입력 작업
        document.getElementById('clearText').addEventListener('click', () => this.clearText());
        document.getElementById('pasteText').addEventListener('click', () => this.pasteText());
        document.getElementById('loadSample').addEventListener('click', () => this.loadSampleText());

        // View controls
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchView(e.target.dataset.view));
        });

        // Toggle controls
        document.getElementById('toggleWrap').addEventListener('click', () => this.toggleWordWrap());
        document.getElementById('toggleNumbers').addEventListener('click', () => this.toggleLineNumbers());

        // File operations
        document.getElementById('importFile').addEventListener('click', () => this.importFile());
        document.getElementById('exportText').addEventListener('click', () => this.exportText());
        document.getElementById('exportReport').addEventListener('click', () => this.exportReport());
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileImport(e));

        // Reading speed control
        document.getElementById('readingSpeed').addEventListener('input', (e) => {
            this.readingSpeed = parseInt(e.target.value);
            document.getElementById('readingSpeedValue').textContent = this.readingSpeed;
            this.updateReadingTime();
        });

        // Frequency controls
        document.getElementById('excludeStopWords').addEventListener('change', () => this.updateWordFrequency());
        document.getElementById('topWordsCount').addEventListener('change', () => this.updateWordFrequency());

        // Writing goals
        document.getElementById('setGoal').addEventListener('click', () => this.openGoalModal());
        document.getElementById('saveGoal').addEventListener('click', () => this.saveGoalSettings());

        // Timer controls
        document.getElementById('startTimer').addEventListener('click', () => this.startTimer());
        document.getElementById('pauseTimer').addEventListener('click', () => this.pauseTimer());
        document.getElementById('resetTimer').addEventListener('click', () => this.resetTimer());

        // Modal controls
        document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        document.querySelector('.btn-secondary').addEventListener('click', () => this.closeModal());

        // Auto-analysis toggle
        document.getElementById('analysisToggle').addEventListener('click', () => this.toggleAutoAnalysis());
    }

    // Text analysis methods
    debouncedAnalysis() {
        if (!this.autoAnalysis) return;
        
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
            this.updateDisplay();
        }, 300);
    }

    analyzeText(text) {
        if (!text.trim()) {
            return {
                wordCount: 0,
                charCount: 0,
                charNoSpaces: 0,
                sentenceCount: 0,
                paragraphCount: 0,
                lineCount: 0,
                words: [],
                sentences: [],
                paragraphs: []
            };
        }

        // Basic counts
        const words = this.extractWords(text);
        const sentences = this.extractSentences(text);
        const paragraphs = this.extractParagraphs(text);
        const lines = text.split('\n');

        return {
            wordCount: words.length,
            charCount: text.length,
            charNoSpaces: text.replace(/\s/g, '').length,
            sentenceCount: sentences.length,
            paragraphCount: paragraphs.filter(p => p.trim().length > 0).length,
            lineCount: lines.length,
            words: words,
            sentences: sentences,
            paragraphs: paragraphs
        };
    }

    extractWords(text) {
        // Remove extra whitespace and split by word boundaries
        return text.trim()
            .replace(/[^\w\s'-]/g, ' ')
            .replace(/\s+/g, ' ')
            .split(' ')
            .filter(word => word.length > 0)
            .map(word => word.toLowerCase());
    }

    extractSentences(text) {
        // Split by sentence-ending punctuation
        return text.split(/[.!?]+/)
            .map(sentence => sentence.trim())
            .filter(sentence => sentence.length > 0);
    }

    extractParagraphs(text) {
        return text.split(/\n\s*\n/)
            .map(para => para.trim())
            .filter(para => para.length > 0);
    }

    calculateAdvancedStats(analysis) {
        if (analysis.wordCount === 0) {
            return {
                avgWordsPerSentence: 0,
                avgCharsPerWord: 0,
                avgSentencesPerParagraph: 0,
                uniqueWords: 0,
                longestWord: '',
                shortestWord: '',
                readingTime: 0,
                speakingTime: 0
            };
        }

        const uniqueWords = new Set(analysis.words).size;
        const wordLengths = analysis.words.map(word => word.length);
        const longestWord = analysis.words.reduce((a, b) => a.length > b.length ? a : b, '');
        const shortestWord = analysis.words.reduce((a, b) => a.length < b.length ? a : b, analysis.words[0] || '');

        return {
            avgWordsPerSentence: analysis.sentenceCount > 0 ? (analysis.wordCount / analysis.sentenceCount).toFixed(1) : 0,
            avgCharsPerWord: analysis.wordCount > 0 ? (analysis.charNoSpaces / analysis.wordCount).toFixed(1) : 0,
            avgSentencesPerParagraph: analysis.paragraphCount > 0 ? (analysis.sentenceCount / analysis.paragraphCount).toFixed(1) : 0,
            uniqueWords: uniqueWords,
            longestWord: longestWord,
            shortestWord: shortestWord,
            readingTime: this.calculateReadingTime(analysis.wordCount),
            speakingTime: this.calculateSpeakingTime(analysis.wordCount)
        };
    }

    calculateReadingTime(wordCount) {
        const minutes = wordCount / this.readingSpeed;
        if (minutes < 1) {
            return `${Math.round(minutes * 60)}s`;
        } else if (minutes < 60) {
            return `${Math.round(minutes)} min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = Math.round(minutes % 60);
            return `${hours}h ${mins}m`;
        }
    }

    calculateSpeakingTime(wordCount) {
        const speakingWPM = 150;
        const minutes = wordCount / speakingWPM;
        if (minutes < 1) {
            return `${Math.round(minutes * 60)}s`;
        } else if (minutes < 60) {
            return `${Math.round(minutes)} min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = Math.round(minutes % 60);
            return `${hours}h ${mins}m`;
        }
    }

    calculateReadability(analysis) {
        if (analysis.wordCount === 0 || analysis.sentenceCount === 0) {
            return {
                fleschScore: 0,
                fleschInterpretation: 'N/A',
                gradeLevel: 'N/A',
                complexity: 0
            };
        }

        // Flesch Reading Ease Score
        const avgSentenceLength = analysis.wordCount / analysis.sentenceCount;
        const avgSyllables = this.estimateAverageSyllables(analysis.words);
        
        const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllables);
        const clampedScore = Math.max(0, Math.min(100, fleschScore));

        const fleschInterpretation = this.interpretFleschScore(clampedScore);
        const gradeLevel = this.calculateGradeLevel(avgSentenceLength, avgSyllables);
        
        // Complexity score (0-100)
        const complexity = Math.max(0, Math.min(100, 100 - clampedScore));

        return {
            fleschScore: clampedScore.toFixed(1),
            fleschInterpretation,
            gradeLevel,
            complexity
        };
    }

    estimateAverageSyllables(words) {
        if (words.length === 0) return 0;
        
        const totalSyllables = words.reduce((sum, word) => {
            return sum + this.countSyllables(word);
        }, 0);
        
        return totalSyllables / words.length;
    }

    countSyllables(word) {
        // Simple syllable counting algorithm
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        
        const vowels = 'aeiouy';
        let count = 0;
        let previousWasVowel = false;
        
        for (let i = 0; i < word.length; i++) {
            const isVowel = vowels.includes(word[i]);
            if (isVowel && !previousWasVowel) count++;
            previousWasVowel = isVowel;
        }
        
        // Handle silent e
        if (word.endsWith('e')) count--;
        
        return Math.max(1, count);
    }

    interpretFleschScore(score) {
        if (score >= 90) return 'Very Easy';
        if (score >= 80) return 'Easy';
        if (score >= 70) return 'Fairly Easy';
        if (score >= 60) return 'Standard';
        if (score >= 50) return 'Fairly Difficult';
        if (score >= 30) return 'Difficult';
        return 'Very Difficult';
    }

    calculateGradeLevel(avgSentenceLength, avgSyllables) {
        // Flesch-Kincaid Grade Level
        const gradeLevel = 0.39 * avgSentenceLength + 11.8 * avgSyllables - 15.59;
        const clampedGrade = Math.max(1, Math.min(18, gradeLevel));
        return `Grade ${Math.round(clampedGrade)}`;
    }

    calculateWordFrequency(words) {
        const frequency = new Map();
        const excludeStopWords = document.getElementById('excludeStopWords').checked;
        
        words.forEach(word => {
            if (excludeStopWords && this.stopWords.has(word)) return;
            if (word.length < 2) return; // Skip very short words
            
            frequency.set(word, (frequency.get(word) || 0) + 1);
        });
        
        // Convert to array and sort by frequency
        const topWordsCount = parseInt(document.getElementById('topWordsCount').value);
        return Array.from(frequency.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, topWordsCount);
    }

    // Display update methods
    updateDisplay() {
        const text = this.textInput.value;
        const analysis = this.analyzeText(text);
        
        this.updateQuickStats(analysis);
        this.updateBasicStats(analysis);
        this.updateAdvancedStats(analysis);
        this.updateReadabilityStats(analysis);
        this.updateWordFrequency();
        this.updateWordGoalProgress(analysis.wordCount);
    }

    updateQuickStats(analysis) {
        document.getElementById('quickWordCount').textContent = `${analysis.wordCount} words`;
        document.getElementById('quickCharCount').textContent = `${analysis.charCount} characters`;
    }

    updateBasicStats(analysis) {
        document.getElementById('wordCount').textContent = analysis.wordCount.toLocaleString();
        document.getElementById('charCount').textContent = analysis.charCount.toLocaleString();
        document.getElementById('charNoSpaces').textContent = analysis.charNoSpaces.toLocaleString();
        document.getElementById('sentenceCount').textContent = analysis.sentenceCount.toLocaleString();
        document.getElementById('paragraphCount').textContent = analysis.paragraphCount.toLocaleString();
        document.getElementById('lineCount').textContent = analysis.lineCount.toLocaleString();
    }

    updateAdvancedStats(analysis) {
        const advanced = this.calculateAdvancedStats(analysis);
        
        document.getElementById('avgWordsPerSentence').textContent = advanced.avgWordsPerSentence;
        document.getElementById('avgCharsPerWord').textContent = advanced.avgCharsPerWord;
        document.getElementById('avgSentencesPerParagraph').textContent = advanced.avgSentencesPerParagraph;
        document.getElementById('uniqueWords').textContent = advanced.uniqueWords.toLocaleString();
        document.getElementById('longestWord').textContent = advanced.longestWord || '-';
        document.getElementById('shortestWord').textContent = advanced.shortestWord || '-';
        
        this.updateReadingTime();
    }

    updateReadingTime() {
        const text = this.textInput.value;
        const analysis = this.analyzeText(text);
        const advanced = this.calculateAdvancedStats(analysis);
        
        document.getElementById('readingTime').textContent = advanced.readingTime;
        document.getElementById('speakingTime').textContent = advanced.speakingTime;
    }

    updateReadabilityStats(analysis) {
        const readability = this.calculateReadability(analysis);
        
        document.getElementById('fleschScore').textContent = readability.fleschScore;
        document.getElementById('fleschInterpretation').textContent = readability.fleschInterpretation;
        document.getElementById('gradeLevel').textContent = readability.gradeLevel;
        
        // Update complexity meter
        const complexityFill = document.getElementById('complexityFill');
        complexityFill.style.width = `${readability.complexity}%`;
    }

    updateWordFrequency() {
        const text = this.textInput.value;
        const analysis = this.analyzeText(text);
        const frequency = this.calculateWordFrequency(analysis.words);
        
        const frequencyList = document.getElementById('frequencyList');
        
        if (frequency.length === 0) {
            frequencyList.innerHTML = '<div class="no-data">No words to analyze</div>';
            return;
        }
        
        const maxCount = frequency[0][1];
        
        frequencyList.innerHTML = frequency.map(([word, count]) => {
            const percentage = (count / maxCount) * 100;
            return `
                <div class="frequency-item">
                    <span class="word-text">${word}</span>
                    <div class="frequency-bar">
                        <div class="frequency-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="frequency-count">${count}</span>
                </div>
            `;
        }).join('');
    }

    // View management
    switchView(view) {
        this.currentView = view;
        
        // Update button states
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Show/hide views
        document.querySelectorAll('.stats-view').forEach(viewEl => {
            viewEl.style.display = 'none';
        });
        
        const targetView = document.getElementById(`${view}Stats`);
        if (targetView) {
            targetView.style.display = 'block';
        }
    }

    // Text input controls
    clearText() {
        if (this.textInput.value.length > 0) {
            if (confirm('Are you sure you want to clear all text?')) {
                this.textInput.value = '';
                this.updateDisplay();
            }
        }
    }

    async pasteText() {
        try {
            const text = await navigator.clipboard.readText();
            this.textInput.value = text;
            this.updateDisplay();
            this.showNotification('Text pasted successfully!', 'success');
        } catch (err) {
            this.showNotification('Failed to paste text. Please paste manually.', 'error');
        }
    }

    loadSampleText() {
        this.textInput.value = this.sampleText;
        this.updateDisplay();
        this.showNotification('Sample text loaded!', 'success');
    }

    toggleWordWrap() {
        const btn = document.getElementById('toggleWrap');
        const textarea = this.textInput;
        
        if (textarea.style.whiteSpace === 'nowrap') {
            textarea.style.whiteSpace = 'normal';
            btn.classList.remove('active');
        } else {
            textarea.style.whiteSpace = 'nowrap';
            btn.classList.add('active');
        }
    }

    toggleLineNumbers() {
        const btn = document.getElementById('toggleNumbers');
        // This is a placeholder - line numbers would require more complex implementation
        btn.classList.toggle('active');
        this.showNotification('Line numbers feature coming soon!', 'info');
    }

    // File operations
    importFile() {
        document.getElementById('fileInput').click();
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.textInput.value = e.target.result;
            this.updateDisplay();
            this.showNotification(`File "${file.name}" imported successfully!`, 'success');
        };
        
        reader.onerror = () => {
            this.showNotification('Error reading file', 'error');
        };
        
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    }

    exportText() {
        const text = this.textInput.value;
        if (!text.trim()) {
            this.showNotification('No text to export', 'error');
            return;
        }

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = `text-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showNotification('Text exported successfully!', 'success');
    }

    exportReport() {
        const text = this.textInput.value;
        if (!text.trim()) {
            this.showNotification('No text to analyze', 'error');
            return;
        }

        const analysis = this.analyzeText(text);
        const advanced = this.calculateAdvancedStats(analysis);
        const readability = this.calculateReadability(analysis);
        
        const report = this.generateTextReport(analysis, advanced, readability);
        
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = `text-analysis-report-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showNotification('Analysis report exported!', 'success');
    }

    generateTextReport(analysis, advanced, readability) {
        return `TEXT ANALYSIS REPORT
Generated on: ${new Date().toLocaleString()}

BASIC STATISTICS
================
Words: ${analysis.wordCount.toLocaleString()}
Characters: ${analysis.charCount.toLocaleString()}
Characters (no spaces): ${analysis.charNoSpaces.toLocaleString()}
Sentences: ${analysis.sentenceCount.toLocaleString()}
Paragraphs: ${analysis.paragraphCount.toLocaleString()}
Lines: ${analysis.lineCount.toLocaleString()}

ADVANCED STATISTICS
==================
Average words per sentence: ${advanced.avgWordsPerSentence}
Average characters per word: ${advanced.avgCharsPerWord}
Average sentences per paragraph: ${advanced.avgSentencesPerParagraph}
Unique words: ${advanced.uniqueWords.toLocaleString()}
Longest word: ${advanced.longestWord}
Shortest word: ${advanced.shortestWord}

READING TIME
============
Reading time (${this.readingSpeed} WPM): ${advanced.readingTime}
Speaking time (150 WPM): ${advanced.speakingTime}

READABILITY
===========
Flesch Reading Ease: ${readability.fleschScore} (${readability.fleschInterpretation})
Grade Level: ${readability.gradeLevel}
Text Complexity: ${readability.complexity}%

ANALYSIS SETTINGS
================
Reading Speed: ${this.readingSpeed} WPM
Exclude Stop Words: ${document.getElementById('excludeStopWords').checked ? 'Yes' : 'No'}
Top Words Shown: ${document.getElementById('topWordsCount').value}

Generated by Text Analyzer
`;
    }

    // Goals and timer functionality
    updateGoalDisplay() {
        document.getElementById('targetWords').textContent = this.dailyWordGoal;
        this.updateWordGoalProgress(this.analyzeText(this.textInput.value).wordCount);
    }

    updateWordGoalProgress(currentWords) {
        const percentage = Math.min((currentWords / this.dailyWordGoal) * 100, 100);
        
        document.getElementById('currentWords').textContent = currentWords;
        document.getElementById('wordGoalPercentage').textContent = Math.round(percentage) + '%';
        document.getElementById('wordGoalProgress').style.width = percentage + '%';
    }

    openGoalModal() {
        document.getElementById('dailyWordGoal').value = this.dailyWordGoal;
        document.getElementById('sessionTimeGoal').value = this.sessionTimeGoal;
        document.getElementById('goalModal').classList.add('active');
    }

    closeModal() {
        document.getElementById('goalModal').classList.remove('active');
    }

    saveGoalSettings() {
        this.dailyWordGoal = parseInt(document.getElementById('dailyWordGoal').value) || 500;
        this.sessionTimeGoal = parseInt(document.getElementById('sessionTimeGoal').value) || 25;
        
        this.saveGoal('dailyWordGoal', this.dailyWordGoal);
        this.saveGoal('sessionTimeGoal', this.sessionTimeGoal);
        
        this.updateGoalDisplay();
        this.closeModal();
        this.showNotification('Goals updated successfully!', 'success');
    }

    startTimer() {
        if (!this.timerRunning) {
            this.sessionStartTime = new Date();
            this.timerRunning = true;
            
            this.timerInterval = setInterval(() => {
                this.updateTimer();
            }, 1000);
            
            this.updateTimerButtons();
            this.showNotification('Writing session started!', 'success');
        }
    }

    pauseTimer() {
        if (this.timerRunning) {
            this.timerRunning = false;
            clearInterval(this.timerInterval);
            this.sessionDuration += (new Date() - this.sessionStartTime) / 1000;
            this.updateTimerButtons();
            this.showNotification('Timer paused', 'info');
        }
    }

    resetTimer() {
        this.timerRunning = false;
        clearInterval(this.timerInterval);
        this.sessionDuration = 0;
        this.sessionStartTime = null;
        this.updateTimer();
        this.updateTimerButtons();
        this.showNotification('Timer reset', 'info');
    }

    updateTimer() {
        let totalSeconds = this.sessionDuration;
        if (this.timerRunning && this.sessionStartTime) {
            totalSeconds += (new Date() - this.sessionStartTime) / 1000;
        }
        
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        
        document.getElementById('sessionTimer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateTimerButtons() {
        const startBtn = document.getElementById('startTimer');
        const pauseBtn = document.getElementById('pauseTimer');
        
        startBtn.disabled = this.timerRunning;
        pauseBtn.disabled = !this.timerRunning;
    }

    toggleAutoAnalysis() {
        this.autoAnalysis = !this.autoAnalysis;
        const fab = document.getElementById('analysisToggle');
        
        fab.classList.toggle('auto-enabled', this.autoAnalysis);
        fab.title = this.autoAnalysis ? 'Auto-Analysis: ON' : 'Auto-Analysis: OFF';
        
        if (this.autoAnalysis) {
            this.updateDisplay();
        }
        
        this.showNotification(`Auto-analysis ${this.autoAnalysis ? 'enabled' : 'disabled'}`, 'info');
    }

    // Utility methods
    saveGoal(key, value) {
        try {
            localStorage.setItem(`textAnalyzer_${key}`, value.toString());
        } catch (error) {
            console.error('Failed to save goal:', error);
        }
    }

    loadGoal(key) {
        try {
            const value = localStorage.getItem(`textAnalyzer_${key}`);
            return value ? parseInt(value) : null;
        } catch (error) {
            console.error('Failed to load goal:', error);
            return null;
        }
    }

    showNotification(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'var(--danger-color)' : 
                           type === 'success' ? 'var(--success-color)' : 
                           type === 'warning' ? 'var(--warning-color)' :
                           'var(--info-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            z-index: 1001;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide toast
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Utility functions for text analysis
const TextUtils = {
    // Clean text for analysis
    cleanText(text) {
        return text
            .replace(/\s+/g, ' ')
            .replace(/[^\w\s.!?;:,-]/g, '')
            .trim();
    },
    
    // Extract sentences with better accuracy
    extractSentencesAdvanced(text) {
        // More sophisticated sentence splitting
        return text
            .split(/(?<=[.!?])\s+(?=[A-Z])/)
            .map(s => s.trim())
            .filter(s => s.length > 0);
    },
    
    // Calculate text density
    calculateDensity(text) {
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const uniqueWords = new Set(words.map(w => w.toLowerCase()));
        return words.length > 0 ? uniqueWords.size / words.length : 0;
    },
    
    // Find repeated phrases
    findRepeatedPhrases(text, minLength = 3) {
        const words = text.toLowerCase().split(/\s+/);
        const phrases = new Map();
        
        for (let len = minLength; len <= 5; len++) {
            for (let i = 0; i <= words.length - len; i++) {
                const phrase = words.slice(i, i + len).join(' ');
                phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
            }
        }
        
        return Array.from(phrases.entries())
            .filter(([phrase, count]) => count > 1)
            .sort((a, b) => b[1] - a[1]);
    },
    
    // Format time duration
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }
};

// Initialize the text analyzer
document.addEventListener('DOMContentLoaded', () => {
    window.textAnalyzer = new TextAnalyzer();
});