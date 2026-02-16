import React from 'react';
import QuestionAgent from '../agents/QuestionAgent';
import CollectionStore from '../logic/collectionStore';
import '../styles/design-system.css';

const ParentDashboard = () => {
    const profile = QuestionAgent.getPerformanceProfile();
    const collectedCards = CollectionStore.getCollection();
    const totalPossibleCards = 100; // Mock total

    const accuracyBySubject = {
        'Mathematical Reasoning': 85,
        'Reading': 78,
        'Thinking Skills': 92
    };

    return (
        <div className="parent-dashboard" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: 'var(--brain-pink-dark)', marginBottom: '2rem' }}>Parent Oversight Center 🛡️</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="premium-card">
                    <h3>Weekly Engagement</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--block-blue)' }}>
                        {profile.total} <span style={{ fontSize: '1rem', color: '#888' }}>Questions Solved</span>
                    </div>
                    <p>Current Level: Year {profile.year}</p>
                </div>

                <div className="premium-card">
                    <h3>Learning Accuracy</h3>
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Math Reasoning</span>
                            <span>{accuracyBySubject['Mathematical Reasoning']}%</span>
                        </div>
                        <div className="progress-container" style={{ height: '8px' }}>
                            <div className="progress-bar" style={{ width: `${accuracyBySubject['Mathematical Reasoning']}%`, background: 'var(--block-green)' }}></div>
                        </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Reading</span>
                            <span>{accuracyBySubject['Reading']}%</span>
                        </div>
                        <div className="progress-container" style={{ height: '8px' }}>
                            <div className="progress-bar" style={{ width: `${accuracyBySubject['Reading']}%`, background: 'var(--block-blue)' }}></div>
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Thinking Skills</span>
                            <span>{accuracyBySubject['Thinking Skills']}%</span>
                        </div>
                        <div className="progress-container" style={{ height: '8px' }}>
                            <div className="progress-bar" style={{ width: `${accuracyBySubject['Thinking Skills']}%`, background: 'var(--block-yellow)' }}></div>
                        </div>
                    </div>
                </div>

                <div className="premium-card" style={{ gridColumn: 'span 2' }}>
                    <h3>Collection Progress</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ flex: 1 }}>
                            <div className="progress-container">
                                <div className="progress-bar" style={{ width: `${(collectedCards.length / totalPossibleCards) * 100}%` }}></div>
                            </div>
                            <p>{collectedCards.length} / {totalPossibleCards} Cards Collected</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {collectedCards.slice(-5).map(card => (
                                <div key={card.id} style={{
                                    width: '40px',
                                    height: '60px',
                                    background: card.color,
                                    borderRadius: '5px',
                                    border: '1px solid #ddd'
                                }}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button
                    style={{
                        padding: '1rem 2rem',
                        background: 'white',
                        border: '2px solid #eee',
                        borderRadius: '12px',
                        cursor: 'not-allowed',
                        color: '#aaa'
                    }}
                    title="Phase 2 Feature"
                >
                    Setup Real Piggy Bank Rewards (Age 11+)
                </button>
            </div>
        </div>
    );
};

export default ParentDashboard;
