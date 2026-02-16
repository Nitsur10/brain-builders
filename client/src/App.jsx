import React, { useState, useEffect } from 'react';
import QuestionSession from './components/QuestionSession';
import CardPack from './components/CardPack';
import CollectionBook from './components/CollectionBook';
import CollectionStore from './logic/collectionStore';
import PinEntry from './components/PinEntry';
import './styles/design-system.css';
import ParentDashboard from './components/ParentDashboard';
import QuestionAgent from './agents/QuestionAgent';

function App() {
  const [view, setView] = useState('home');
  const [earnedCard, setEarnedCard] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showParentPin, setShowParentPin] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Calculate days until NAPLAN
  const naplanDate = new Date('2026-03-11');
  const today = new Date();
  const daysUntilNaplan = Math.ceil((naplanDate - today) / (1000 * 60 * 60 * 24));

  // NAPLAN Schedule
  const naplanSchedule = [
    { date: 'Wed 11 Mar', subject: 'Writing', emoji: '✍️', color: '#e8d4f8' },
    { date: 'Thu 12 Mar', subject: 'Reading', emoji: '📖', color: '#d4e8f8' },
    { date: 'Fri 13 Mar', subject: 'Language Conventions', emoji: '📝', color: '#d4f8e8' },
    { date: 'Mon 16 Mar', subject: 'Numeracy', emoji: '🔢', color: '#f8e8d4' }
  ];

  useEffect(() => {
    const unlocked = sessionStorage.getItem('brain_builders_unlocked');
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    sessionStorage.setItem('brain_builders_unlocked', 'true');
  };

  const handleParentAccess = () => {
    setShowParentPin(true);
  };

  const handleParentUnlock = () => {
    setShowParentPin(false);
    setView('parent');
  };

  const startPractice = (subject = null) => {
    QuestionAgent.setYear(5);
    if (subject) {
      QuestionAgent.setSubject(subject);
    }
    setSelectedSubject(subject);
    setView('practice');
  };

  const finishPractice = () => {
    const card = CollectionStore.drawCard();
    setEarnedCard(card);
    setView('rewards');
  };

  const goHome = () => {
    setEarnedCard(null);
    setShowParentPin(false);
    setSelectedSubject(null);
    setView('home');
  };

  if (!isUnlocked) {
    return <PinEntry onSuccess={handleUnlock} isParent={false} />;
  }

  if (showParentPin) {
    return (
      <div>
        <button 
          onClick={() => setShowParentPin(false)}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--brain-pink)',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          ← Back
        </button>
        <PinEntry onSuccess={handleParentUnlock} isParent={true} />
      </div>
    );
  }

  return (
    <div className="app-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff5f5 0%, #fff 50%, #f0f7ff 100%)',
    }}>
      {/* Navigation */}
      <nav style={{
        padding: '1rem 2rem',
        background: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        borderBottom: '3px solid var(--brain-pink)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h1 
          style={{ 
            color: 'var(--brain-pink)', 
            margin: 0, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.5rem'
          }} 
          onClick={goHome}
        >
          <span style={{ fontSize: '1.8rem' }}>🧠</span>
          Brain Builders
        </h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {daysUntilNaplan > 0 && (
            <span style={{
              background: daysUntilNaplan <= 7 ? '#ff6b6b' : 'var(--accent-gold)',
              color: 'white',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '0.85rem'
            }}>
              {daysUntilNaplan} days to NAPLAN!
            </span>
          )}
          <button onClick={handleParentAccess} style={{
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            border: '2px solid #eee',
            background: 'white',
            color: '#666',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}>
            Parents 🛡️
          </button>
          <button onClick={() => setView('collection')} style={{
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            border: 'none',
            background: 'var(--brain-pink)',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}>
            My Cards ✨
          </button>
        </div>
      </nav>

      <main style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HOME VIEW */}
        {view === 'home' && (
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
              <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1.5rem' }}>
                Choose a subject to practice for NAPLAN!
              </p>

              {/* Subject Selection Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                {naplanSchedule.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => startPractice(item.subject)}
                    style={{
                      padding: '1.5rem 1rem',
                      background: `linear-gradient(135deg, ${item.color} 0%, white 100%)`,
                      borderRadius: '16px',
                      border: '2px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'center'
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
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{item.emoji}</div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>
                      {item.subject === 'Language Conventions' ? 'Language' : item.subject}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                      {item.date}
                    </div>
                  </button>
                ))}
              </div>

              {/* Mixed Practice Button */}
              <button
                onClick={() => startPractice(null)}
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
                  boxShadow: '0 6px 20px rgba(233, 137, 151, 0.4)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(233, 137, 151, 0.5)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(233, 137, 151, 0.4)';
                }}
              >
                🎲 Mixed Practice
              </button>
              
              <p style={{ marginTop: '1rem', color: '#999', fontSize: '0.85rem' }}>
                Complete 15 questions to earn a mystery card!
              </p>
            </div>

            {/* Goal Banner */}
            <div style={{
              background: 'linear-gradient(135deg, var(--accent-gold) 0%, #ffc107 100%)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '16px',
              maxWidth: '500px',
              margin: '0 auto',
              fontWeight: '500'
            }}>
              🎯 Goal: <strong>Band 8</strong> — You've got this!
            </div>
          </div>
        )}

        {/* PRACTICE VIEW */}
        {view === 'practice' && (
          <QuestionSession 
            onComplete={finishPractice} 
            onExit={goHome}
            focusSubject={selectedSubject}
          />
        )}

        {/* REWARDS VIEW */}
        {view === 'rewards' && (
          <div style={{ textAlign: 'center', paddingTop: '3vh' }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '2.5rem',
              maxWidth: '500px',
              margin: '0 auto',
              boxShadow: '0 10px 40px rgba(233, 137, 151, 0.2)'
            }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>🎉 Amazing Work!</h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                You've completed your practice! Here's your reward...
              </p>
              
              <CardPack 
                onOpen={() => {
                  if (!earnedCard) {
                    const card = CollectionStore.drawCard();
                    setEarnedCard(card);
                  }
                  return earnedCard;
                }} 
                earnedCard={earnedCard}
              />
              
              <button
                onClick={goHome}
                style={{
                  marginTop: '2rem',
                  padding: '1rem 2.5rem',
                  borderRadius: '25px',
                  border: '2px solid var(--brain-pink)',
                  background: 'white',
                  color: 'var(--brain-pink)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                ← Practice More
              </button>
            </div>
          </div>
        )}

        {/* COLLECTION VIEW */}
        {view === 'collection' && (
          <div>
            <button 
              onClick={goHome} 
              style={{ 
                marginBottom: '1.5rem', 
                background: 'none', 
                border: 'none', 
                color: 'var(--brain-pink)', 
                cursor: 'pointer', 
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              ← Back to Home
            </button>
            <CollectionBook />
          </div>
        )}

        {/* PARENT DASHBOARD VIEW */}
        {view === 'parent' && (
          <div>
            <button 
              onClick={goHome} 
              style={{ 
                marginBottom: '1.5rem', 
                background: 'none', 
                border: 'none', 
                color: 'var(--brain-pink)', 
                cursor: 'pointer', 
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              ← Back to Home
            </button>
            <ParentDashboard />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
