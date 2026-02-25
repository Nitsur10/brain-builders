import React, { useState, useEffect } from 'react';
import { useParentDashboard } from '../hooks/useProgress';

const subjectIcons = {
  'Reading': '📖',
  'Language Conventions': '📝',
  'Numeracy': '🔢',
  'Writing': '✍️'
};

const naplanSchedule = [
  { date: 'Wed 11 Mar', subject: 'Writing', emoji: '✍️', color: '#e8d4f8' },
  { date: 'Thu 12 Mar', subject: 'Reading', emoji: '📖', color: '#d4e8f8' },
  { date: 'Fri 13 Mar', subject: 'Language Conventions', emoji: '📝', color: '#d4f8e8' },
  { date: 'Mon 16 Mar', subject: 'Numeracy', emoji: '🔢', color: '#f8e8d4' }
];

export default function SmartHomePage({ onStartPractice, daysUntilNaplan }) {
  const { subjectBreakdown, loading } = useParentDashboard();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (subjectBreakdown && subjectBreakdown.length > 0) {
      // Calculate recommendations based on performance
      const recs = subjectBreakdown
        .map(s => ({
          subject: s.subject,
          accuracy: s.accuracy,
          total: s.total,
          priority: calculatePriority(s)
        }))
        .sort((a, b) => b.priority - a.priority);
      
      setRecommendations(recs);
    } else {
      // No data yet - recommend starting with Reading (first test)
      setRecommendations([
        { subject: 'Reading', priority: 100, reason: 'Test is coming first (Thu 12 Mar)' },
        { subject: 'Writing', priority: 90, reason: 'Test is first (Wed 11 Mar)' },
        { subject: 'Language Conventions', priority: 80, reason: 'Test on Fri 13 Mar' },
        { subject: 'Numeracy', priority: 70, reason: 'Test on Mon 16 Mar' }
      ]);
    }
  }, [subjectBreakdown]);

  const calculatePriority = (subjectData) => {
    // Priority factors:
    // 1. Low accuracy = higher priority
    // 2. Low practice volume = needs attention
    // 3. Days until that subject's test
    
    const accuracyScore = 100 - subjectData.accuracy; // Lower accuracy = higher score
    const volumeScore = Math.max(0, 50 - subjectData.total); // Less than 50 questions = needs more
    
    // Test date urgency
    const testDateScore = {
      'Writing': 40, // Wed (2 weeks away)
      'Reading': 30,
      'Language Conventions': 20,
      'Numeracy': 10
    }[subjectData.subject] || 0;

    return accuracyScore + volumeScore + testDateScore;
  };

  const getPriorityBadge = (subject) => {
    const rec = recommendations.find(r => r.subject === subject);
    if (!rec) return null;

    if (rec.priority > 120) {
      return { label: '🔥 Focus Now', color: '#ff6b6b', textColor: 'white' };
    } else if (rec.priority > 80) {
      return { label: '⚡ High Priority', color: '#ffd93d', textColor: '#333' };
    } else if (rec.priority > 50) {
      return { label: '✓ Good Progress', color: '#6bcf7f', textColor: 'white' };
    }
    return { label: '✓ On Track', color: '#95e1d3', textColor: '#333' };
  };

  const getSubjectStats = (subject) => {
    const stats = subjectBreakdown.find(s => s.subject === subject);
    if (!stats) return null;
    return stats;
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Welcome Card */}
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '2rem',
        maxWidth: '700px',
        margin: '0 auto 1.5rem',
        boxShadow: '0 10px 40px rgba(233, 137, 151, 0.15)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🧠💪</div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#333' }}>
          Hi Praptini! 👋
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '0' }}>
          What do you want to practice today?
        </p>
      </div>

      {/* Smart Recommendations */}
      {!loading && recommendations.length > 0 && recommendations[0].priority > 80 && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          maxWidth: '700px',
          margin: '0 auto 1.5rem',
          boxShadow: '0 8px 30px rgba(102, 126, 234, 0.3)'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💡 Smart Suggestion</div>
          <p style={{ fontSize: '1rem', marginBottom: '1rem', opacity: 0.95 }}>
            Based on your progress, we recommend focusing on:
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '12px',
            padding: '1rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {subjectIcons[recommendations[0].subject]}
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {recommendations[0].subject}
            </div>
            {recommendations[0].reason && (
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                {recommendations[0].reason}
              </div>
            )}
            {recommendations[0].accuracy !== undefined && (
              <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.9 }}>
                Current: {recommendations[0].accuracy}% • {recommendations[0].total} questions practiced
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subject Selection Grid */}
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '2rem',
        maxWidth: '700px',
        margin: '0 auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#666' }}>
          Or choose any subject you like:
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {naplanSchedule.map((item, i) => {
            const badge = getPriorityBadge(item.subject);
            const stats = getSubjectStats(item.subject);
            
            return (
              <button
                key={i}
                onClick={() => onStartPractice(item.subject)}
                style={{
                  padding: '1.5rem 1rem',
                  background: `linear-gradient(135deg, ${item.color} 0%, white 100%)`,
                  borderRadius: '16px',
                  border: '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                  position: 'relative'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Priority Badge */}
                {badge && (
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: badge.color,
                    color: badge.textColor,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold'
                  }}>
                    {badge.label}
                  </div>
                )}

                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{item.emoji}</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>
                  {item.subject === 'Language Conventions' ? 'Language' : item.subject}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                  {item.date}
                </div>
                
                {/* Performance Stats */}
                {stats && (
                  <div style={{
                    marginTop: '0.75rem',
                    fontSize: '0.8rem',
                    color: stats.accuracy >= 80 ? '#27ae60' : stats.accuracy >= 60 ? '#f39c12' : '#e74c3c',
                    fontWeight: '600'
                  }}>
                    {stats.accuracy}% ({stats.total} questions)
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Mixed Practice Button */}
        <button
          onClick={() => onStartPractice(null)}
          style={{
            padding: '1rem 2.5rem',
            fontSize: '1.2rem',
            borderRadius: '30px',
            border: 'none',
            background: 'linear-gradient(135deg, var(--brain-pink) 0%, #ff6b9d 100%)',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: '0 6px 20px rgba(233, 137, 151, 0.4)',
            width: '100%'
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(233, 137, 151, 0.5)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(233, 137, 151, 0.4)';
          }}
        >
          🎲 Mixed Practice (All Subjects)
        </button>
        
        <p style={{ marginTop: '1rem', color: '#999', fontSize: '0.85rem' }}>
          Complete 15 questions to earn a mystery card!
        </p>
      </div>

      {/* Progress Overview (if data exists) */}
      {!loading && subjectBreakdown.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          maxWidth: '700px',
          margin: '1.5rem auto 0',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#666' }}>
            📊 Your Progress Overview
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem'
          }}>
            {subjectBreakdown.map((s, i) => (
              <div key={i} style={{
                padding: '0.75rem',
                background: '#f8f9fa',
                borderRadius: '10px',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>
                  {subjectIcons[s.subject]} {s.subject}
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: s.accuracy >= 80 ? '#27ae60' : s.accuracy >= 60 ? '#f39c12' : '#e74c3c'
                }}>
                  {s.accuracy}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#999' }}>
                  {s.correct}/{s.total} correct
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goal Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent-gold) 0%, #ffc107 100%)',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '16px',
        maxWidth: '500px',
        margin: '1.5rem auto 0',
        fontWeight: '500'
      }}>
        🎯 Goal: <strong>Band 8</strong> — {daysUntilNaplan} days to go!
      </div>
    </div>
  );
}
