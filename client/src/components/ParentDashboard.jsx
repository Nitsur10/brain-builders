import React from 'react';
import { useParentDashboard } from '../hooks/useProgress';

const ParentDashboard = () => {
    const { stats, sessions, subjectBreakdown, loading, refresh } = useParentDashboard();

    // NAPLAN dates
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

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
                <p>Loading Praptini's progress...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>🛡️ Parent Dashboard</h2>
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

            {/* Overview Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <StatCard 
                    label="Sessions" 
                    value={stats?.totalSessions || 0} 
                    icon="📚" 
                    color="#e8f4f8"
                />
                <StatCard 
                    label="Questions" 
                    value={stats?.totalQuestions || 0} 
                    icon="❓" 
                    color="#f8f4e8"
                />
                <StatCard 
                    label="Correct" 
                    value={stats?.totalCorrect || 0} 
                    icon="✅" 
                    color="#e8f8ea"
                />
                <StatCard 
                    label="Accuracy" 
                    value={`${stats?.accuracy || 0}%`} 
                    icon="🎯" 
                    color="#f8e8f4"
                />
            </div>

            {/* NAPLAN Countdown */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
                <h3 style={{ margin: '0 0 1rem' }}>📅 NAPLAN Schedule</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    {naplanSchedule.map((item, i) => (
                        <div key={i} style={{
                            padding: '1rem',
                            background: '#f8f9fa',
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.emoji}</div>
                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.date}</div>
                            <div style={{ color: '#666', fontSize: '0.85rem' }}>{item.subject}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subject Performance */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
                <h3 style={{ margin: '0 0 1rem' }}>📊 Performance by Subject</h3>
                {subjectBreakdown.length === 0 ? (
                    <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
                        No practice data yet. Praptini needs to complete some questions!
                    </p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {subjectBreakdown.map((subject, i) => (
                            <SubjectBar key={i} {...subject} />
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Sessions */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
                <h3 style={{ margin: '0 0 1rem' }}>🕐 Recent Sessions</h3>
                {sessions.length === 0 ? (
                    <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
                        No sessions yet. Share the link with Praptini to get started!
                    </p>
                ) : (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {sessions.slice(0, 10).map((session, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                background: '#f8f9fa',
                                borderRadius: '12px'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '600' }}>
                                        {formatDate(session.started_at)}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                        {session.total_questions || 0} questions
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ 
                                        fontWeight: 'bold',
                                        color: session.total_questions > 0 
                                            ? (session.correct_answers / session.total_questions >= 0.7 ? 'var(--correct-green)' : 'var(--wrong-orange)')
                                            : '#999'
                                    }}>
                                        {session.correct_answers || 0}/{session.total_questions || 0} correct
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                        {session.total_questions > 0 
                                            ? `${Math.round((session.correct_answers / session.total_questions) * 100)}%`
                                            : '-'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Last Practice */}
            {stats?.lastPractice && (
                <div style={{ textAlign: 'center', marginTop: '2rem', color: '#999' }}>
                    Last practice: {formatDate(stats.lastPractice)}
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
        padding: '1.5rem',
        textAlign: 'center'
    }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{value}</div>
        <div style={{ fontSize: '0.85rem', color: '#666' }}>{label}</div>
    </div>
);

// Subject Progress Bar
const SubjectBar = ({ subject, total, correct, accuracy }) => {
    const getColor = (acc) => {
        if (acc >= 80) return 'var(--correct-green)';
        if (acc >= 60) return 'var(--accent-gold)';
        return 'var(--wrong-orange)';
    };

    const subjectIcons = {
        'Reading': '📖',
        'Language Conventions': '📝',
        'Numeracy': '🔢',
        'Writing': '✍️'
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600' }}>
                    {subjectIcons[subject] || '📚'} {subject}
                </span>
                <span style={{ color: '#666' }}>
                    {correct}/{total} ({accuracy}%)
                </span>
            </div>
            <div style={{
                background: '#eee',
                borderRadius: '8px',
                height: '12px',
                overflow: 'hidden'
            }}>
                <div style={{
                    background: getColor(accuracy),
                    height: '100%',
                    width: `${accuracy}%`,
                    borderRadius: '8px',
                    transition: 'width 0.5s ease'
                }}></div>
            </div>
        </div>
    );
};

export default ParentDashboard;
