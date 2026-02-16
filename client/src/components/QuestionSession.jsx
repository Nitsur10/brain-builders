import React, { useState, useEffect } from 'react';
import QuestionAgent from '../agents/QuestionAgent';
import CoachingAgent from '../agents/CoachingAgent';
import BrainMascot from './BrainMascot';
import '../styles/design-system.css';

// Subject icons
const subjectIcons = {
    'Reading': '📖',
    'Language Conventions': '📝',
    'Numeracy': '🔢',
    'Writing': '✍️'
};

const QuestionSession = ({ onComplete, onExit }) => {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [mascotState, setMascotState] = useState('idle');
    const [secondsSpent, setSecondsSpent] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    
    const DAILY_GOAL_QUESTIONS = 15; // Complete 15 questions for reward

    useEffect(() => {
        QuestionAgent.reset();
        setCurrentQuestion(QuestionAgent.getNextQuestion());
        setFeedback(CoachingAgent.getFeedback(null));

        const timer = setInterval(() => {
            setSecondsSpent(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const progress = Math.min((questionsAnswered / DAILY_GOAL_QUESTIONS) * 100, 100);

    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (option) => {
        if (selectedOption) return;

        setSelectedOption(option);
        const isCorrect = option === currentQuestion.correctAnswer;
        const result = { isCorrect, subject: currentQuestion.subject };

        setQuestionsAnswered(prev => prev + 1);
        if (isCorrect) setCorrectAnswers(prev => prev + 1);

        const profile = QuestionAgent.getPerformanceProfile();
        const newFeedback = CoachingAgent.getFeedback(profile, result);

        setFeedback(newFeedback);
        setMascotState(isCorrect ? 'celebrate' : 'wrong');
        setShowExplanation(true);

        // Wait for user to see explanation
        setTimeout(() => {
            if (questionsAnswered + 1 >= DAILY_GOAL_QUESTIONS) {
                onComplete();
            } else {
                setCurrentQuestion(QuestionAgent.getNextQuestion(result));
                setSelectedOption(null);
                setMascotState('idle');
                setShowExplanation(false);
            }
        }, 3500);
    };

    if (!currentQuestion) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>;

    const subjectIcon = subjectIcons[currentQuestion.subject] || '📚';
    const difficultyLabel = currentQuestion.difficulty > 2 ? 'Hard 🔥' : (currentQuestion.difficulty > 1 ? 'Medium ⭐' : 'Easy 🌱');

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {/* Header Stats */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                padding: '1rem 1.5rem',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
                <div>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Progress</span>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {questionsAnswered}/{DAILY_GOAL_QUESTIONS} questions
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Time</span>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        ⏱️ {formatTime(secondsSpent)}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Score</span>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--correct-green)' }}>
                        ✓ {correctAnswers}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{
                background: '#eee',
                borderRadius: '10px',
                height: '12px',
                marginBottom: '1.5rem',
                overflow: 'hidden'
            }}>
                <div style={{
                    background: 'linear-gradient(90deg, var(--brain-pink) 0%, #ff6b9d 100%)',
                    height: '100%',
                    width: `${progress}%`,
                    transition: 'width 0.5s ease',
                    borderRadius: '10px'
                }}></div>
            </div>

            {/* Mascot */}
            <BrainMascot state={mascotState} message={feedback} />

            {/* Question Card */}
            <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '2rem',
                marginTop: '1.5rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
            }}>
                {/* Subject & Difficulty */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem'
                }}>
                    <span style={{
                        background: '#f0f7ff',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#4a90d9'
                    }}>
                        {subjectIcon} {currentQuestion.subject}
                    </span>
                    <span style={{
                        background: '#fff5f0',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        color: '#e67e22'
                    }}>
                        {difficultyLabel}
                    </span>
                </div>

                {/* Question */}
                <h2 style={{
                    fontSize: '1.4rem',
                    lineHeight: '1.6',
                    marginBottom: '2rem',
                    color: '#333'
                }}>
                    {currentQuestion.question}
                </h2>

                {/* Options */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem'
                }}>
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedOption === option;
                        const isCorrect = option === currentQuestion.correctAnswer;
                        const showCorrect = selectedOption && isCorrect;

                        let bgColor = 'white';
                        let borderColor = '#eee';
                        let textColor = '#333';

                        if (selectedOption) {
                            if (isSelected && isCorrect) {
                                bgColor = 'var(--correct-green)';
                                borderColor = 'var(--correct-green)';
                                textColor = 'white';
                            } else if (isSelected && !isCorrect) {
                                bgColor = 'var(--wrong-orange)';
                                borderColor = 'var(--wrong-orange)';
                                textColor = 'white';
                            } else if (showCorrect) {
                                borderColor = 'var(--correct-green)';
                                bgColor = '#e8f8e8';
                            }
                        }

                        return (
                            <button
                                key={option}
                                onClick={() => handleAnswer(option)}
                                style={{
                                    padding: '1.2rem',
                                    border: `2px solid ${borderColor}`,
                                    borderRadius: '16px',
                                    background: bgColor,
                                    color: textColor,
                                    cursor: selectedOption ? 'default' : 'pointer',
                                    fontSize: '1.1rem',
                                    transition: 'all 0.2s ease',
                                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                    fontWeight: isSelected ? 'bold' : 'normal'
                                }}
                                disabled={!!selectedOption}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>

                {/* Explanation */}
                {showExplanation && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1.2rem',
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        borderLeft: '4px solid var(--brain-pink)'
                    }}>
                        <strong>💡 Explanation:</strong>
                        <p style={{ margin: '0.5rem 0 0', color: '#555' }}>
                            {currentQuestion.explanation}
                        </p>
                    </div>
                )}
            </div>

            {/* Exit button */}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                    onClick={onExit || onComplete}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#999',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    Exit Session
                </button>
            </div>
        </div>
    );
};

export default QuestionSession;
