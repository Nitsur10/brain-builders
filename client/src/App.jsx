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

  // Calculate days until NAPLAN
  const naplanDate = new Date('2026-03-11');
  const today = new Date();
  const daysUntilNaplan = Math.ceil((naplanDate - today) / (1000 * 60 * 60 * 24));

  // Check if already unlocked this session
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

  const startPractice = () => {
    QuestionAgent.setYear(5);
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
    setView('home');
  };

  // Show student PIN entry if not unlocked
  if (!isUnlocked) {
    return <PinEntry onSuccess={handleUnlock} isParent={false} />;
  }

  // Show parent PIN entry if trying to access dashboard
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
        borderBottom: '3px solid var(--brain-pink)'
      }}>
        <h1 
          style={{ 
            color: 'var(--brain-pink)', 
            margin: 0, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }} 
          onClick={goHome}
        >
          <span style={{ fontSize: '2rem' }}>🧠</span>
          Brain Builders
        </h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {daysUntilNaplan > 0 && (
            <span style={{
              background: daysUntilNaplan <= 7 ? '#ff6b6b' : 'var(--accent-gold)',
              color: 'white',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              {daysUntilNaplan} days until NAPLAN!
            </span>
          )}
          <button onClick={handleParentAccess} style={{
            padding: '0.5rem 1.5rem',
            borderRadius: '20px',
            border: '2px solid #eee',
            background: 'white',
            color: '#666',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Parents 🛡️
          </button>
          <button onClick={() => setView('collection')} style={{
            padding: '0.5rem 1.5rem',
            borderRadius: '20px',
            border: 'none',
            background: 'var(--brain-pink)',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            My Cards ✨
          </button>
        </div>
      </nav>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HOME VIEW */}
        {view === 'home' && (
          <div style={{ textAlign: 'center', paddingTop: '5vh' }}>
            {/* NAPLAN Countdown Card */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '2.5rem',
              maxWidth: '600px',
              margin: '0 auto 2rem',
              boxShadow: '0 10px 40px rgba(233, 137, 151, 0.2)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧠💪</div>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: '#333' }}>
                Hi Praptini! 👋
              </h2>
              <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1.5rem' }}>
                Let's build your brain for NAPLAN!
              </p>

              {/* Test Schedule */}
              <div style={{
                background: '#f8f9fa',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <h3 style={{ margin: '0 0 1rem', color: 'var(--brain-pink)' }}>📅 Your NAPLAN Schedule</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem', fontSize: '0.95rem' }}>
                  <div style={{ padding: '0.8rem', background: 'white', borderRadius: '8px', border: '2px solid #e8d4f8' }}>
                    <strong>Wed 11 Mar</strong><br/>✍️ Writing
                  </div>
                  <div style={{ padding: '0.8rem', background: 'white', borderRadius: '8px', border: '2px solid #d4e8f8' }}>
                    <strong>Thu 12 Mar</strong><br/>📖 Reading
                  </div>
                  <div style={{ padding: '0.8rem', background: 'white', borderRadius: '8px', border: '2px solid #d4f8e8' }}>
                    <strong>Fri 13 Mar</strong><br/>📝 Language
                  </div>
                  <div style={{ padding: '0.8rem', background: 'white', borderRadius: '8px', border: '2px solid #f8e8d4' }}>
                    <strong>Mon 16 Mar</strong><br/>🔢 Numeracy
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={startPractice}
                style={{
                  padding: '1.2rem 3rem',
                  fontSize: '1.5rem',
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
                🚀 START PRACTICE
              </button>
              
              <p style={{ marginTop: '1rem', color: '#999', fontSize: '0.9rem' }}>
                Complete your daily practice to earn mystery cards!
              </p>
            </div>

            {/* Motivational message */}
            <div style={{
              background: 'linear-gradient(135deg, var(--accent-gold) 0%, #ffc107 100%)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '16px',
              maxWidth: '500px',
              margin: '0 auto',
              fontWeight: '500'
            }}>
              🎯 Goal: <strong>Band 8</strong> — You can do this!
            </div>
          </div>
        )}

        {/* PRACTICE VIEW */}
        {view === 'practice' && (
          <QuestionSession onComplete={finishPractice} onExit={goHome} />
        )}

        {/* REWARDS VIEW */}
        {view === 'rewards' && (
          <div style={{ textAlign: 'center', paddingTop: '5vh' }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '3rem',
              maxWidth: '500px',
              margin: '0 auto',
              boxShadow: '0 10px 40px rgba(233, 137, 151, 0.2)'
            }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎉 Amazing Work!</h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                You've completed your daily practice! Here's your reward...
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
                ← Back to Home
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
