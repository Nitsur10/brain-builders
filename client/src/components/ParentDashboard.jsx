import React, { useState, useEffect } from 'react';
import { useParentDashboard } from '../hooks/useProgress';

const ParentDashboard = () => {
    const { stats, sessions, subjectBreakdown, loading, refresh } = useParentDashboard();
    const [activeTab, setActiveTab] = useState('overview');

    // NAPLAN dates & countdown
    const naplanDate = new Date('2026-03-11');
    const today = new Date();
    const daysUntilNaplan = Math.ceil((naplanDate - today) / (1000 * 60 * 60 * 24));

    const naplanSchedule = [
        { date: 'Wed 11 Mar', subject: 'Writing', emoji: '✍️' },
        { date: 'Thu 12 Mar', subject: 'Reading', emoji: '📖' },
        { date: 'Fri 13 Mar', subject: 'Language', emoji: '📝' },
        { date: 'Mon 16 Mar', subject: 'Numeracy', emoji: '🔢' }
    ];

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-AU', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0 min';
        const mins = Math.floor(seconds / 60);
        if (mins < 60) return `${mins} min`;
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return `${hours}h ${remainingMins}m`;
    };

    // Calculate goals progress
    const calculateGoals = () => {
        const todaySessions = sessions.filter(s => {
            const sessionDate = new Date(s.started_at).toDateString();
            return sessionDate === new Date().toDateString();
        });
        
        const todayQuestions = todaySessions.reduce((sum, s) => sum + (s.total_questions || 0), 0);
        const todayMinutes = todaySessions.reduce((sum, s) => sum + ((s.duration_seconds || 0) / 60), 0);
        
        // Weekly stats
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekSessions = sessions.filter(s => new Date(s.started_at) > weekAgo);
        const uniqueDays = new Set(weekSessions.map(s => new Date(s.started_at).toDateString())).size;
        
        return {
            todayQuestions,
            todayMinutes: Math.round(todayMinutes),
            weekDays: uniqueDays,
            totalSessions: sessions.length
        };
    };

    const goals = stats ? calculateGoals() : null;

    // Achievement badges
    const badges = [
        { 
            id: 'first_session', 
            name: 'First Steps', 
            emoji: '🌟', 
            desc: 'Complete first session',
            unlocked: (stats?.totalSessions || 0) >= 1
        },
        { 
            id: '10_questions', 
            name: 'Question Master', 
            emoji: '❓', 
            desc: 'Answer 10 questions',
            unlocked: (stats?.totalQuestions || 0) >= 10
        },
        { 
            id: '50_questions', 
            name: 'Brain Builder', 
            emoji: '🧠', 
            desc: 'Answer 50 questions',
            unlocked: (stats?.totalQuestions || 0) >= 50
        },
        { 
            id: '100_questions', 
            name: 'Century Club', 
            emoji: '💯', 
            desc: 'Answer 100 questions',
            unlocked: (stats?.totalQuestions || 0) >= 100
        },
        { 
            id: '70_accuracy', 
            name: 'Sharp Mind', 
            emoji: '🎯', 
            desc: 'Reach 70% accuracy',
            unlocked: (stats?.accuracy || 0) >= 70
        },
        { 
            id: '90_accuracy', 
            name: 'Genius Level', 
            emoji: '🏆', 
            desc: 'Reach 90% accuracy',
            unlocked: (stats?.accuracy || 0) >= 90
        },
        { 
            id: '5_sessions', 
            name: 'Dedicated', 
            emoji: '📚', 
            desc: 'Complete 5 sessions',
            unlocked: (stats?.totalSessions || 0) >= 5
        },
        { 
            id: '7_day_streak', 
            name: 'Week Warrior', 
            emoji: '🔥', 
            desc: 'Practice 7 days in a row',
            unlocked: (goals?.weekDays || 0) >= 7
        }
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
                <p>Loading Praptini's progress...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🛡️ Parent Dashboard
                    </h2>
                    <p style={{ margin: '0.25rem 0 0', color: '#666', fontSize: '0.9rem' }}>
                        Monitoring Praptini's NAPLAN preparation
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{
                        background: daysUntilNaplan <= 7 ? '#ff6b6b' : 'var(--accent-gold)',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                    }}>
                        {daysUntilNaplan} days to NAPLAN
                    </span>
                    <button 
                        onClick={refresh}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            background: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                marginBottom: '1.5rem',
                borderBottom: '2px solid #eee',
                paddingBottom: '0.5rem'
            }}>
                {['overview', 'goals', 'subjects', 'sessions'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            background: activeTab === tab ? 'var(--brain-pink)' : 'transparent',
                            color: activeTab === tab ? 'white' : '#666',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <>
                    {/* Key Stats */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '1rem',
                        marginBottom: '2rem'
                    }}>
                        <StatCard label="Sessions" value={stats?.totalSessions || 0} icon="📚" color="#e8f4f8" />
                        <StatCard label="Questions" value={stats?.totalQuestions || 0} icon="❓" color="#f8f4e8" />
                        <StatCard label="Correct" value={stats?.totalCorrect || 0} icon="✅" color="#e8f8ea" />
                        <StatCard label="Accuracy" value={`${stats?.accuracy || 0}%`} icon="🎯" color="#f8e8f4" />
                    </div>

                    {/* Today's Progress */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}>
                        <h3 style={{ margin: '0 0 1rem' }}>📅 Today's Progress</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                            <GoalProgress 
                                label="Questions" 
                                current={goals?.todayQuestions || 0} 
                                target={15} 
                                emoji="❓"
                            />
                            <GoalProgress 
                                label="Minutes" 
                                current={goals?.todayMinutes || 0} 
                                target={30} 
                                emoji="⏱️"
                            />
                            <GoalProgress 
                                label="This Week" 
                                current={goals?.weekDays || 0} 
                                target={7} 
                                emoji="📆"
                                unit=" days"
                            />
                        </div>
                    </div>

                    {/* NAPLAN Schedule */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}>
                        <h3 style={{ margin: '0 0 1rem' }}>📋 NAPLAN Schedule</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            {naplanSchedule.map((item, i) => (
                                <div key={i} style={{
                                    padding: '1rem',
                                    background: '#f8f9fa',
                                    borderRadius: '12px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.emoji}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{item.date}</div>
                                    <div style={{ color: '#666', fontSize: '0.8rem' }}>{item.subject}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* GOALS TAB */}
            {activeTab === 'goals' && (
                <>
                    {/* Daily Goals */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}>
                        <h3 style={{ margin: '0 0 1.5rem' }}>🎯 Daily Goals</h3>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <GoalBar 
                                label="Complete 15 questions" 
                                current={goals?.todayQuestions || 0} 
                                target={15}
                                reward="1 Mystery Card"
                            />
                            <GoalBar 
                                label="Practice for 30 minutes" 
                                current={goals?.todayMinutes || 0} 
                                target={30}
                                reward="Bonus XP"
                            />
                        </div>
                    </div>

                    {/* Weekly Goals */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}>
                        <h3 style={{ margin: '0 0 1.5rem' }}>📆 Weekly Goals</h3>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <GoalBar 
                                label="Practice 5 days this week" 
                                current={goals?.weekDays || 0} 
                                target={5}
                                reward="Rare Card Chance ⬆️"
                            />
                            <GoalBar 
                                label="Answer 100 questions" 
                                current={stats?.totalQuestions || 0} 
                                target={100}
                                reward="Achievement Badge"
                            />
                        </div>
                    </div>

                    {/* Achievements */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}>
                        <h3 style={{ margin: '0 0 1rem' }}>🏆 Achievements</h3>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
                            gap: '1rem' 
                        }}>
                            {badges.map(badge => (
                                <div 
                                    key={badge.id}
                                    style={{
                                        padding: '1rem',
                                        background: badge.unlocked ? '#f0fff4' : '#f8f9fa',
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        opacity: badge.unlocked ? 1 : 0.5,
                                        border: badge.unlocked ? '2px solid var(--correct-green)' : '2px solid transparent'
                                    }}
                                >
                                    <div style={{ 
                                        fontSize: '2rem', 
                                        marginBottom: '0.5rem',
                                        filter: badge.unlocked ? 'none' : 'grayscale(100%)'
                                    }}>
                                        {badge.emoji}
                                    </div>
                                    <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{badge.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                                        {badge.desc}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* SUBJECTS TAB */}
            {activeTab === 'subjects' && (
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}>
                    <h3 style={{ margin: '0 0 1.5rem' }}>📊 Performance by Subject</h3>
                    {subjectBreakdown.length === 0 ? (
                        <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
                            No practice data yet. Praptini needs to complete some questions!
                        </p>
                    ) : (
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {subjectBreakdown.map((subject, i) => (
                                <SubjectCard key={i} {...subject} />
                            ))}
                        </div>
                    )}

                    {/* Recommendations */}
                    {subjectBreakdown.length > 0 && (
                        <div style={{
                            marginTop: '2rem',
                            padding: '1rem',
                            background: '#fff8e8',
                            borderRadius: '12px',
                            borderLeft: '4px solid var(--accent-gold)'
                        }}>
                            <strong>💡 Recommendation:</strong>
                            <p style={{ margin: '0.5rem 0 0', color: '#666' }}>
                                {(() => {
                                    const weakest = subjectBreakdown.reduce((a, b) => a.accuracy < b.accuracy ? a : b);
                                    if (weakest.accuracy < 60) {
                                        return `Focus more on ${weakest.subject} (${weakest.accuracy}% accuracy). Practice makes perfect!`;
                                    } else if (weakest.accuracy < 80) {
                                        return `${weakest.subject} could use some attention (${weakest.accuracy}%). Almost there!`;
                                    } else {
                                        return `Great job! All subjects are above 80%. Keep up the excellent work!`;
                                    }
                                })()}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* SESSIONS TAB */}
            {activeTab === 'sessions' && (
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}>
                    <h3 style={{ margin: '0 0 1rem' }}>🕐 Practice Sessions</h3>
                    {sessions.length === 0 ? (
                        <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
                            No sessions yet. Share the link with Praptini to get started!
                        </p>
                    ) : (
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {sessions.map((session, i) => {
                                const accuracy = session.total_questions > 0 
                                    ? Math.round((session.correct_answers / session.total_questions) * 100) 
                                    : 0;
                                return (
                                    <div key={i} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem 1.25rem',
                                        background: '#f8f9fa',
                                        borderRadius: '12px'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>
                                                {formatDate(session.started_at)}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                                {session.total_questions || 0} questions • {formatDuration(session.duration_seconds)}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ 
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem',
                                                color: accuracy >= 70 ? 'var(--correct-green)' : 'var(--wrong-orange)'
                                            }}>
                                                {accuracy}%
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                                {session.correct_answers || 0}/{session.total_questions || 0}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Stat Card Component
const StatCard = ({ label, value, icon, color }) => (
    <div style={{
        background: color,
        borderRadius: '16px',
        padding: '1.25rem',
        textAlign: 'center'
    }}>
        <div style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>{icon}</div>
        <div style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '0.15rem' }}>{value}</div>
        <div style={{ fontSize: '0.8rem', color: '#666' }}>{label}</div>
    </div>
);

// Goal Progress Circle
const GoalProgress = ({ label, current, target, emoji, unit = '' }) => {
    const progress = Math.min((current / target) * 100, 100);
    const isComplete = current >= target;
    
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: `conic-gradient(${isComplete ? 'var(--correct-green)' : 'var(--brain-pink)'} ${progress}%, #eee ${progress}%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                position: 'relative'
            }}>
                <div style={{
                    width: '65px',
                    height: '65px',
                    borderRadius: '50%',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                }}>
                    {isComplete ? '✅' : emoji}
                </div>
            </div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{current}{unit}/{target}{unit}</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>{label}</div>
        </div>
    );
};

// Goal Bar
const GoalBar = ({ label, current, target, reward }) => {
    const progress = Math.min((current / target) * 100, 100);
    const isComplete = current >= target;
    
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600' }}>{label}</span>
                <span style={{ color: isComplete ? 'var(--correct-green)' : '#666' }}>
                    {current}/{target} {isComplete ? '✅' : ''}
                </span>
            </div>
            <div style={{
                background: '#eee',
                borderRadius: '8px',
                height: '16px',
                overflow: 'hidden',
                marginBottom: '0.5rem'
            }}>
                <div style={{
                    background: isComplete 
                        ? 'linear-gradient(90deg, var(--correct-green), #4ade80)' 
                        : 'linear-gradient(90deg, var(--brain-pink), #ff6b9d)',
                    height: '100%',
                    width: `${progress}%`,
                    borderRadius: '8px',
                    transition: 'width 0.5s ease'
                }}></div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#999' }}>
                🎁 Reward: {reward}
            </div>
        </div>
    );
};

// Subject Card
const SubjectCard = ({ subject, total, correct, accuracy }) => {
    const getColor = (acc) => {
        if (acc >= 80) return 'var(--correct-green)';
        if (acc >= 60) return 'var(--accent-gold)';
        return 'var(--wrong-orange)';
    };

    const getGrade = (acc) => {
        if (acc >= 90) return { grade: 'A+', label: 'Excellent!' };
        if (acc >= 80) return { grade: 'A', label: 'Great!' };
        if (acc >= 70) return { grade: 'B', label: 'Good' };
        if (acc >= 60) return { grade: 'C', label: 'Needs work' };
        return { grade: 'D', label: 'Focus here!' };
    };

    const subjectIcons = {
        'Reading': '📖',
        'Language Conventions': '📝',
        'Numeracy': '🔢',
        'Writing': '✍️'
    };

    const { grade, label } = getGrade(accuracy);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '1.25rem',
            background: '#f8f9fa',
            borderRadius: '12px'
        }}>
            <div style={{ fontSize: '2.5rem' }}>{subjectIcons[subject] || '📚'}</div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{subject}</div>
                <div style={{
                    background: '#e0e0e0',
                    borderRadius: '6px',
                    height: '10px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        background: getColor(accuracy),
                        height: '100%',
                        width: `${accuracy}%`,
                        borderRadius: '6px'
                    }}></div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                    {correct}/{total} correct
                </div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold',
                    color: getColor(accuracy)
                }}>
                    {accuracy}%
                </div>
                <div style={{ 
                    fontSize: '0.75rem', 
                    color: getColor(accuracy),
                    fontWeight: '600'
                }}>
                    {grade} - {label}
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
