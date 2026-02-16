import { naplanQuestions, naplanSubjects } from '../logic/naplanQuestions';

class QuestionAgent {
    constructor() {
        this.history = [];
        this.currentDifficulty = 1;
        this.subjects = naplanSubjects; // Reading, Language Conventions, Numeracy, Writing
        this.currentSubjectIndex = 0;
        this.currentYear = 5; // Year 5 for NAPLAN
        this.askedQuestionIds = new Set(); // Track asked questions to avoid repeats
    }

    setYear(year) {
        this.currentYear = parseInt(year);
    }

    reset() {
        this.history = [];
        this.currentDifficulty = 1;
        this.currentSubjectIndex = 0;
        this.askedQuestionIds.clear();
    }

    getNextQuestion(lastResult = null) {
        if (lastResult) {
            this.history.push(lastResult);
            this.adjustDifficulty(lastResult.isCorrect);
        }

        // Switch subject to keep it fresh
        this.currentSubjectIndex = (this.currentSubjectIndex + 1) % this.subjects.length;
        const subject = this.subjects[this.currentSubjectIndex];

        // Filter by subject, year, and difficulty - exclude already asked questions
        let available = naplanQuestions.filter(q =>
            q.subject === subject && 
            q.year === this.currentYear && 
            q.difficulty === this.currentDifficulty &&
            !this.askedQuestionIds.has(q.id)
        );

        // Fallback: same subject/year but any difficulty
        if (available.length === 0) {
            available = naplanQuestions.filter(q => 
                q.subject === subject && 
                q.year === this.currentYear &&
                !this.askedQuestionIds.has(q.id)
            );
        }

        // Fallback: same subject, any year (Year 5 questions work for Year 4-6)
        if (available.length === 0) {
            available = naplanQuestions.filter(q => 
                q.subject === subject &&
                !this.askedQuestionIds.has(q.id)
            );
        }

        // Last resort: any unasked question
        if (available.length === 0) {
            available = naplanQuestions.filter(q => !this.askedQuestionIds.has(q.id));
        }

        // If all questions asked, reset tracking (allow repeats)
        if (available.length === 0) {
            this.askedQuestionIds.clear();
            available = naplanQuestions.filter(q => q.subject === subject);
        }

        const selected = available.length > 0
            ? available[Math.floor(Math.random() * available.length)]
            : naplanQuestions[0];

        // Track this question as asked
        this.askedQuestionIds.add(selected.id);

        return selected;
    }

    adjustDifficulty(isCorrect) {
        if (isCorrect) {
            // Level up after 2 correct in a row
            const lastTwo = this.history.slice(-2);
            if (lastTwo.length === 2 && lastTwo.every(h => h.isCorrect)) {
                this.currentDifficulty = Math.min(this.currentDifficulty + 1, 3);
            }
        } else {
            // Level down after wrong answer
            this.currentDifficulty = Math.max(this.currentDifficulty - 1, 1);
        }
    }

    getPerformanceProfile() {
        const total = this.history.length;
        const correct = this.history.filter(h => h.isCorrect).length;
        
        // Per-subject breakdown
        const bySubject = {};
        this.subjects.forEach(subject => {
            const subjectHistory = this.history.filter(h => h.subject === subject);
            const subjectCorrect = subjectHistory.filter(h => h.isCorrect).length;
            bySubject[subject] = {
                total: subjectHistory.length,
                correct: subjectCorrect,
                accuracy: subjectHistory.length > 0 ? Math.round((subjectCorrect / subjectHistory.length) * 100) : 0
            };
        });

        return {
            total,
            correct,
            accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
            difficulty: this.currentDifficulty,
            streak: this.getStreak(),
            year: this.currentYear,
            bySubject
        };
    }

    getStreak() {
        let streak = 0;
        for (let i = this.history.length - 1; i >= 0; i--) {
            if (this.history[i].isCorrect) streak++;
            else break;
        }
        return streak;
    }

    // Get stats for parent dashboard
    getSessionStats() {
        return {
            questionsAnswered: this.history.length,
            performance: this.getPerformanceProfile(),
            sessionDate: new Date().toISOString()
        };
    }
}

export default new QuestionAgent();
