/*
 * 성적 계산기 애플리케이션 (Grade Calculator Application)
 * Week 7-8 주제: 클래스, 복잡한 데이터 구조, 통계 계산
 * Week 5-6 주제: 배열 고차함수, 수학 계산, 객체 조작
 * Week 3-4 주제: DOM 조작, 폼 처리, 동적 테이블 생성
 * Week 1-2 주제: 수학 연산, 조건문, 변수 관리
 */

/*
 * 성적 계산기 클래스 (Week 7-8: ES6 클래스와 교육 도구)
 * 가중평균 계산, 성적 척도 변환, 목표 성적 계산 등 교육용 통계 도구
 * 학습자의 성적 관리와 분석을 위한 종합적인 시스템
 */
class GradeCalculator {
    /*
     * 생성자: 성적 데이터 초기화 및 설정 (Week 7-8: 생성자와 복잡한 초기화)
     */
    constructor() {
        // 저장된 성적 데이터 로드 (Week 7-8: localStorage 활용)
        this.grades = this.loadGrades();
        
        // 현재 입력 모드 (숫자/문자 성적) (Week 1-2: 변수 초기화)
        this.currentInputMode = 'numerical';
        
        // 성적 척도
        this.gradingScales = {
            standard: {
                'A': { min: 90, max: 100, gpa: 4.0 },
                'B': { min: 80, max: 89, gpa: 3.0 },
                'C': { min: 70, max: 79, gpa: 2.0 },
                'D': { min: 60, max: 69, gpa: 1.0 },
                'F': { min: 0, max: 59, gpa: 0.0 }
            },
            'plus-minus': {
                'A+': { min: 97, max: 100, gpa: 4.3 },
                'A': { min: 93, max: 96, gpa: 4.0 },
                'A-': { min: 90, max: 92, gpa: 3.7 },
                'B+': { min: 87, max: 89, gpa: 3.3 },
                'B': { min: 83, max: 86, gpa: 3.0 },
                'B-': { min: 80, max: 82, gpa: 2.7 },
                'C+': { min: 77, max: 79, gpa: 2.3 },
                'C': { min: 73, max: 76, gpa: 2.0 },
                'C-': { min: 70, max: 72, gpa: 1.7 },
                'D+': { min: 67, max: 69, gpa: 1.3 },
                'D': { min: 63, max: 66, gpa: 1.0 },
                'D-': { min: 60, max: 62, gpa: 0.7 },
                'F': { min: 0, max: 59, gpa: 0.0 }
            }
        };
        
        this.currentScale = 'plus-minus';
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
    }

    bindEvents() {
        // 폼 제출
        document.getElementById('gradeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addGrade();
        });

        // 입력 모드 토글
        document.querySelectorAll('input[name="inputMode"]').forEach(radio => {
            radio.addEventListener('change', (e) => this.toggleInputMode(e.target.value));
        });

        // 가중치 템플릿
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.applyWeightTemplate(e.target.dataset.template));
        });

        // 모든 성적 삭제
        document.getElementById('clearAll').addEventListener('click', () => this.clearAllGrades());

        // 내보내기/가져오기
        document.getElementById('exportData').addEventListener('click', () => this.exportGrades());
        document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importData').click());
        document.getElementById('importData').addEventListener('change', (e) => this.importGrades(e));

        // 목표 계산기
        document.getElementById('calculateGoal').addEventListener('click', () => this.calculateGoal());

        // 설정
        document.getElementById('settingsFab').addEventListener('click', () => this.openSettings());

        // 모달 컨트롤
        document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        document.querySelector('.btn-secondary').addEventListener('click', () => this.closeModal());
        document.querySelector('.btn-primary').addEventListener('click', () => this.saveSettings());

        // 성적 작업을 위한 이벤트 위임
        document.getElementById('gradesTableBody').addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn')) {
                this.editGrade(parseInt(e.target.dataset.gradeId));
            } else if (e.target.classList.contains('delete-btn')) {
                this.deleteGrade(parseInt(e.target.dataset.gradeId));
            }
        });
    }

    toggleInputMode(mode) {
        this.currentInputMode = mode;
        const numericalInput = document.querySelector('.numerical-input');
        const letterInput = document.querySelector('.letter-input');
        
        if (mode === 'numerical') {
            numericalInput.style.display = 'block';
            letterInput.style.display = 'none';
            document.getElementById('numericalGrade').required = true;
            document.getElementById('letterGrade').required = false;
        } else {
            numericalInput.style.display = 'none';
            letterInput.style.display = 'block';
            document.getElementById('numericalGrade').required = false;
            document.getElementById('letterGrade').required = true;
        }
    }

    addGrade() {
        const form = document.getElementById('gradeForm');
        const formData = new FormData(form);
        
        const assignmentName = formData.get('assignmentName') || 'Assignment';
        const category = formData.get('category') || 'other';
        const weight = parseFloat(formData.get('weight')) || 0;
        
        let grade;
        if (this.currentInputMode === 'numerical') {
            grade = parseFloat(document.getElementById('numericalGrade').value);
            if (isNaN(grade) || grade < 0 || grade > 100) {
                this.showNotification('0과 100 사이의 유효한 성적을 입력하세요', 'error');
                return;
            }
        } else {
            const letterGrade = document.getElementById('letterGrade').value;
            if (!letterGrade) {
                this.showNotification('문자 성적을 선택하세요', 'error');
                return;
            }
            grade = this.letterToNumerical(letterGrade);
        }

        if (weight <= 0 || weight > 100) {
            this.showNotification('가중치는 0과 100 사이여야 합니다', 'error');
            return;
        }

        const newGrade = {
            id: Date.now(),
            name: assignmentName,
            category,
            grade,
            weight,
            dateAdded: new Date().toISOString()
        };

        this.grades.push(newGrade);
        this.saveGrades();
        this.updateDisplay();
        
        // 폼 리셋
        form.reset();
        document.getElementById('weight').value = 10;
        
        this.showNotification(`${assignmentName}이(가) 성공적으로 추가되었습니다!`, 'success');
    }

    editGrade(gradeId) {
        const grade = this.grades.find(g => g.id === gradeId);
        if (!grade) return;

        // 기존 데이터로 폼 채우기
        document.getElementById('assignmentName').value = grade.name;
        document.getElementById('category').value = grade.category;
        document.getElementById('weight').value = grade.weight;
        document.getElementById('numericalGrade').value = grade.grade;

        // 편집을 위해 성적을 일시적으로 제거
        this.deleteGrade(gradeId, false);
        
        // 폼으로 스크롤
        document.querySelector('.grade-input-section').scrollIntoView({ behavior: 'smooth' });
    }

    deleteGrade(gradeId, showNotification = true) {
        const gradeIndex = this.grades.findIndex(g => g.id === gradeId);
        if (gradeIndex === -1) return;

        const gradeName = this.grades[gradeIndex].name;
        this.grades.splice(gradeIndex, 1);
        this.saveGrades();
        this.updateDisplay();
        
        if (showNotification) {
            this.showNotification(`${gradeName} 삭제됨`, 'success');
        }
    }

    clearAllGrades() {
        if (this.grades.length === 0) return;
        
        if (confirm('정말로 모든 성적을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            this.grades = [];
            this.saveGrades();
            this.updateDisplay();
            this.showNotification('모든 성적이 삭제되었습니다', 'success');
        }
    }

    applyWeightTemplate(template) {
        if (this.grades.length === 0) {
            this.showNotification('템플릿을 적용하기 전에 먼저 성적을 추가하세요', 'error');
            return;
        }

        const templates = {
            equal: () => {
                const equalWeight = 100 / this.grades.length;
                this.grades.forEach(grade => grade.weight = equalWeight);
            },
            'exam-heavy': () => {
                this.grades.forEach(grade => {
                    switch (grade.category) {
                        case 'exam': grade.weight = 40; break;
                        case 'project': grade.weight = 25; break;
                        case 'homework': grade.weight = 20; break;
                        case 'quiz': grade.weight = 10; break;
                        case 'participation': grade.weight = 5; break;
                        default: grade.weight = 10;
                    }
                });
            },
            'homework-heavy': () => {
                this.grades.forEach(grade => {
                    switch (grade.category) {
                        case 'homework': grade.weight = 35; break;
                        case 'project': grade.weight = 30; break;
                        case 'exam': grade.weight = 25; break;
                        case 'quiz': grade.weight = 7; break;
                        case 'participation': grade.weight = 3; break;
                        default: grade.weight = 10;
                    }
                });
            },
            balanced: () => {
                this.grades.forEach(grade => {
                    switch (grade.category) {
                        case 'exam': grade.weight = 30; break;
                        case 'project': grade.weight = 25; break;
                        case 'homework': grade.weight = 25; break;
                        case 'quiz': grade.weight = 15; break;
                        case 'participation': grade.weight = 5; break;
                        default: grade.weight = 10;
                    }
                });
            }
        };

        if (templates[template]) {
            templates[template]();
            this.normalizeWeights();
            this.saveGrades();
            this.updateDisplay();
            this.showNotification(`${template.charAt(0).toUpperCase() + template.slice(1)} template applied`, 'success');
        }
    }

    normalizeWeights() {
        const totalWeight = this.grades.reduce((sum, grade) => sum + grade.weight, 0);
        if (totalWeight !== 100 && totalWeight > 0) {
            this.grades.forEach(grade => {
                grade.weight = (grade.weight / totalWeight) * 100;
            });
        }
    }

    calculateWeightedAverage() {
        if (this.grades.length === 0) return null;
        
        const totalWeightedPoints = this.grades.reduce((sum, grade) => sum + (grade.grade * grade.weight), 0);
        const totalWeight = this.grades.reduce((sum, grade) => sum + grade.weight, 0);
        
        return totalWeight > 0 ? totalWeightedPoints / totalWeight : 0;
    }

    calculateStatistics() {
        if (this.grades.length === 0) {
            return {
                highest: null,
                lowest: null,
                average: null,
                total: 0
            };
        }

        const gradeValues = this.grades.map(g => g.grade);
        return {
            highest: Math.max(...gradeValues),
            lowest: Math.min(...gradeValues),
            average: gradeValues.reduce((sum, grade) => sum + grade, 0) / gradeValues.length,
            total: this.grades.length
        };
    }

    calculateCategoryBreakdown() {
        const breakdown = {};
        
        this.grades.forEach(grade => {
            if (!breakdown[grade.category]) {
                breakdown[grade.category] = {
                    grades: [],
                    totalWeight: 0,
                    weightedAverage: 0
                };
            }
            breakdown[grade.category].grades.push(grade);
            breakdown[grade.category].totalWeight += grade.weight;
        });

        // Calculate weighted average for each category
        Object.keys(breakdown).forEach(category => {
            const categoryData = breakdown[category];
            const totalWeightedPoints = categoryData.grades.reduce((sum, grade) => sum + (grade.grade * grade.weight), 0);
            categoryData.weightedAverage = categoryData.totalWeight > 0 ? totalWeightedPoints / categoryData.totalWeight : 0;
        });

        return breakdown;
    }

    numericalToLetter(grade) {
        const scale = this.gradingScales[this.currentScale];
        for (const [letter, range] of Object.entries(scale)) {
            if (grade >= range.min && grade <= range.max) {
                return letter;
            }
        }
        return 'F';
    }

    letterToNumerical(letter) {
        const scale = this.gradingScales[this.currentScale];
        if (scale[letter]) {
            // Return the midpoint of the range
            const range = scale[letter];
            return (range.min + range.max) / 2;
        }
        return 0;
    }

    calculateGPA(grade) {
        const letterGrade = this.numericalToLetter(grade);
        const scale = this.gradingScales[this.currentScale];
        return scale[letterGrade]?.gpa || 0;
    }

    calculateGoal() {
        const targetGrade = parseFloat(document.getElementById('targetGrade').value);
        const remainingWeight = parseFloat(document.getElementById('remainingWeight').value);
        
        if (isNaN(targetGrade) || isNaN(remainingWeight)) {
            this.showNotification('Please enter valid numbers for target grade and remaining weight', 'error');
            return;
        }

        if (remainingWeight <= 0 || remainingWeight > 100) {
            this.showNotification('Remaining weight must be between 0 and 100', 'error');
            return;
        }

        const currentWeightedAverage = this.calculateWeightedAverage();
        const currentWeight = this.grades.reduce((sum, grade) => sum + grade.weight, 0);
        
        if (currentWeight + remainingWeight > 100) {
            this.showNotification('Total weight cannot exceed 100%', 'error');
            return;
        }

        // Calculate needed grade: targetGrade = (current weighted points + needed grade * remaining weight) / total weight
        const currentWeightedPoints = currentWeightedAverage * currentWeight;
        const totalWeight = currentWeight + remainingWeight;
        const neededWeightedPoints = (targetGrade * totalWeight) - currentWeightedPoints;
        const neededGrade = neededWeightedPoints / remainingWeight;

        const resultDiv = document.getElementById('goalResult');
        
        if (neededGrade > 100) {
            resultDiv.innerHTML = `
                <div style="color: var(--danger-color);">
                    <strong>Target Not Achievable</strong><br>
                    You would need ${neededGrade.toFixed(1)}% on remaining assignments.
                </div>
            `;
        } else if (neededGrade < 0) {
            resultDiv.innerHTML = `
                <div style="color: var(--success-color);">
                    <strong>Target Already Achieved!</strong><br>
                    Your current average (${currentWeightedAverage.toFixed(1)}%) already meets your target.
                </div>
            `;
        } else {
            const letterGrade = this.numericalToLetter(neededGrade);
            resultDiv.innerHTML = `
                <div style="color: var(--primary-color);">
                    <strong>Needed Grade: ${neededGrade.toFixed(1)}% (${letterGrade})</strong><br>
                    You need an average of ${neededGrade.toFixed(1)}% on your remaining ${remainingWeight}% of assignments to reach your target of ${targetGrade}%.
                </div>
            `;
        }
    }

    updateDisplay() {
        this.updateGradesTable();
        this.updateWeightSummary();
        this.updateResults();
        this.updateCalculationBreakdown();
    }

    updateGradesTable() {
        const tableBody = document.getElementById('gradesTableBody');
        const noGrades = document.getElementById('noGrades');
        const table = document.getElementById('gradesTable');
        
        if (this.grades.length === 0) {
            table.style.display = 'none';
            noGrades.style.display = 'block';
            return;
        }

        table.style.display = 'table';
        noGrades.style.display = 'none';
        
        tableBody.innerHTML = this.grades.map(grade => {
            const letterGrade = this.numericalToLetter(grade.grade);
            const gradeClass = `grade-${letterGrade.charAt(0).toLowerCase()}`;
            const weightedPoints = (grade.grade * grade.weight / 100).toFixed(2);
            
            return `
                <tr>
                    <td>${grade.name}</td>
                    <td><span class="category-badge ${grade.category}">${grade.category}</span></td>
                    <td><span class="grade-value ${gradeClass}">${grade.grade.toFixed(1)}% (${letterGrade})</span></td>
                    <td>${grade.weight.toFixed(1)}%</td>
                    <td>${weightedPoints}</td>
                    <td>
                        <div class="grade-actions">
                            <button class="edit-btn" data-grade-id="${grade.id}">Edit</button>
                            <button class="delete-btn" data-grade-id="${grade.id}">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    updateWeightSummary() {
        const totalWeight = this.grades.reduce((sum, grade) => sum + grade.weight, 0);
        const totalWeightElement = document.getElementById('totalWeight');
        const weightStatus = document.getElementById('weightStatus');
        
        totalWeightElement.textContent = totalWeight.toFixed(1) + '%';
        
        let statusText = '';
        let statusClass = '';
        
        if (totalWeight === 0) {
            statusText = 'No grades added yet';
            statusClass = '';
        } else if (totalWeight < 100) {
            statusText = `${(100 - totalWeight).toFixed(1)}% remaining`;
            statusClass = 'warning';
        } else if (totalWeight === 100) {
            statusText = 'Weights are perfectly balanced';
            statusClass = 'success';
        } else {
            statusText = `${(totalWeight - 100).toFixed(1)}% over 100%`;
            statusClass = 'error';
        }
        
        weightStatus.className = `weight-status ${statusClass}`;
        weightStatus.innerHTML = `<span class="status-text">${statusText}</span>`;
    }

    updateResults() {
        const weightedAverage = this.calculateWeightedAverage();
        const stats = this.calculateStatistics();
        const categoryBreakdown = this.calculateCategoryBreakdown();
        
        // Main result
        if (weightedAverage !== null) {
            const letterGrade = this.numericalToLetter(weightedAverage);
            const gpa = this.calculateGPA(weightedAverage);
            const gradeClass = `grade-${letterGrade.charAt(0).toLowerCase()}`;
            
            document.getElementById('finalGrade').textContent = weightedAverage.toFixed(1) + '%';
            document.getElementById('finalGrade').className = `numerical-grade ${gradeClass}`;
            document.getElementById('finalLetterGrade').textContent = letterGrade;
            document.getElementById('finalLetterGrade').className = `letter-grade ${gradeClass}`;
            document.getElementById('gpaValue').textContent = gpa.toFixed(2);
        } else {
            document.getElementById('finalGrade').textContent = '--%';
            document.getElementById('finalGrade').className = 'numerical-grade';
            document.getElementById('finalLetterGrade').textContent = '--';
            document.getElementById('finalLetterGrade').className = 'letter-grade';
            document.getElementById('gpaValue').textContent = '--';
        }
        
        // Statistics
        document.getElementById('highestGrade').textContent = stats.highest !== null ? `${stats.highest.toFixed(1)}%` : '--';
        document.getElementById('lowestGrade').textContent = stats.lowest !== null ? `${stats.lowest.toFixed(1)}%` : '--';
        document.getElementById('averageGrade').textContent = stats.average !== null ? `${stats.average.toFixed(1)}%` : '--';
        document.getElementById('totalAssignments').textContent = stats.total;
        
        // Category breakdown
        const categoryBreakdownElement = document.getElementById('categoryBreakdown');
        const categoryEntries = Object.entries(categoryBreakdown);
        
        if (categoryEntries.length === 0) {
            categoryBreakdownElement.innerHTML = '<p>No grades to analyze</p>';
        } else {
            categoryBreakdownElement.innerHTML = categoryEntries.map(([category, data]) => {
                return `
                    <div class="category-item">
                        <span class="category-badge ${category}">${category}</span>
                        <span>${data.weightedAverage.toFixed(1)}% (${data.totalWeight.toFixed(1)}%)</span>
                    </div>
                `;
            }).join('');
        }
    }

    updateCalculationBreakdown() {
        const breakdownContent = document.querySelector('.breakdown-content');
        
        if (this.grades.length === 0) {
            breakdownContent.textContent = 'Add grades to see calculation details';
            return;
        }

        let breakdown = 'Weighted Average Calculation:\n\n';
        
        this.grades.forEach((grade, index) => {
            const weightedPoints = grade.grade * grade.weight;
            breakdown += `${index + 1}. ${grade.name}:\n`;
            breakdown += `   ${grade.grade.toFixed(1)}% × ${grade.weight.toFixed(1)}% = ${weightedPoints.toFixed(2)} points\n\n`;
        });
        
        const totalPoints = this.grades.reduce((sum, grade) => sum + (grade.grade * grade.weight), 0);
        const totalWeight = this.grades.reduce((sum, grade) => sum + grade.weight, 0);
        const weightedAverage = this.calculateWeightedAverage();
        
        breakdown += `Total Points: ${totalPoints.toFixed(2)}\n`;
        breakdown += `Total Weight: ${totalWeight.toFixed(1)}%\n`;
        breakdown += `Weighted Average: ${totalPoints.toFixed(2)} ÷ ${totalWeight.toFixed(1)} = ${weightedAverage.toFixed(2)}%\n`;
        breakdown += `Letter Grade: ${this.numericalToLetter(weightedAverage)}`;
        
        breakdownContent.textContent = breakdown;
    }

    exportGrades() {
        if (this.grades.length === 0) {
            this.showNotification('No grades to export', 'error');
            return;
        }

        const data = {
            grades: this.grades,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `grades-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showNotification('Grades exported successfully', 'success');
    }

    importGrades(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.grades && Array.isArray(data.grades)) {
                    if (this.grades.length > 0) {
                        if (!confirm('This will replace all existing grades. Continue?')) {
                            return;
                        }
                    }
                    
                    this.grades = data.grades;
                    this.saveGrades();
                    this.updateDisplay();
                    this.showNotification('Grades imported successfully', 'success');
                } else {
                    this.showNotification('Invalid file format', 'error');
                }
            } catch (error) {
                this.showNotification('Error reading file: ' + error.message, 'error');
            }
        };
        
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    }

    openSettings() {
        document.getElementById('gradingScaleModal').classList.add('active');
    }

    closeModal() {
        document.getElementById('gradingScaleModal').classList.remove('active');
    }

    saveSettings() {
        const selectedScale = document.querySelector('input[name="scale"]:checked').value;
        this.currentScale = selectedScale;
        this.updateDisplay();
        this.closeModal();
        this.showNotification('Settings saved', 'success');
    }

    saveGrades() {
        try {
            localStorage.setItem('grades', JSON.stringify(this.grades));
        } catch (error) {
            console.error('Failed to save grades:', error);
        }
    }

    loadGrades() {
        try {
            const saved = localStorage.getItem('grades');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to load grades:', error);
            return [];
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
                           'var(--info-color)'};
            color: white;
            padding: 1rem;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            z-index: 1001;
            transform: translateX(400px);
            transition: transform 0.3s ease;
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

// Utility functions
const GradeUtils = {
    // Validate grade range
    isValidGrade(grade) {
        return !isNaN(grade) && grade >= 0 && grade <= 100;
    },
    
    // Round to specified decimal places
    round(number, decimals = 2) {
        return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },
    
    // Calculate standard deviation
    calculateStandardDeviation(grades) {
        if (grades.length <= 1) return 0;
        
        const mean = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
        const squaredDifferences = grades.map(grade => Math.pow(grade - mean, 2));
        const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / (grades.length - 1);
        
        return Math.sqrt(variance);
    },
    
    // Generate grade distribution data
    getGradeDistribution(grades) {
        const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
        
        grades.forEach(grade => {
            if (grade >= 90) distribution.A++;
            else if (grade >= 80) distribution.B++;
            else if (grade >= 70) distribution.C++;
            else if (grade >= 60) distribution.D++;
            else distribution.F++;
        });
        
        return distribution;
    },
    
    // Format percentage
    formatPercentage(number, decimals = 1) {
        return number.toFixed(decimals) + '%';
    }
};

// Initialize the grade calculator
document.addEventListener('DOMContentLoaded', () => {
    window.gradeCalculator = new GradeCalculator();
});