import React, { useState } from 'react';
import '../styles/design-system.css';
import { rarityConfig } from '../logic/cardData';

const CardPack = ({ onOpen }) => {
    const [isOpening, setIsOpening] = useState(false);
    const [card, setCard] = useState(null);
    const [confetti, setConfetti] = useState([]);

    const handleOpen = () => {
        setIsOpening(true);
        // Simulate ripping sound/delay
        setTimeout(() => {
            const drawnCard = onOpen();
            setCard(drawnCard);
            triggerConfetti();
        }, 1500);
    };

    const triggerConfetti = () => {
        const newConfetti = Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 2,
            color: ['#FF85A1', '#FFD93D', '#6BCBFF', '#6BCB77'][Math.floor(Math.random() * 4)]
        }));
        setConfetti(newConfetti);
    };

    return (
        <div className="pack-container" style={{ textAlign: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
            {confetti.map(c => (
                <div
                    key={c.id}
                    className="confetti"
                    style={{
                        left: `${c.left}%`,
                        backgroundColor: c.color,
                        animation: `confetti-fall 3s linear forwards`,
                        animationDelay: `${c.delay}s`
                    }}
                />
            ))}

            {!card ? (
                <div
                    className={`card-pack ${isOpening ? 'ripping' : ''}`}
                    onClick={!isOpening ? handleOpen : null}
                    style={{
                        width: '180px',
                        height: '260px',
                        background: 'linear-gradient(135deg, var(--block-blue), var(--brain-pink))',
                        borderRadius: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-premium)',
                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        margin: '0 auto',
                        border: '8px solid white',
                        transform: isOpening ? 'scale(1.1)' : 'scale(1)'
                    }}
                    onMouseOver={e => !isOpening && (e.currentTarget.style.transform = 'scale(1.05) rotate(2deg)')}
                    onMouseOut={e => !isOpening && (e.currentTarget.style.transform = 'scale(1) rotate(0deg)')}
                >
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
                    {isOpening ? 'RIPPING...' : 'TAP TO OPEN!'}
                </div>
            ) : (
                <div
                    className="revealed-card"
                    style={{
                        width: '200px',
                        height: '300px',
                        background: 'white',
                        borderRadius: '20px',
                        padding: '1.5rem',
                        margin: '0 auto',
                        border: rarityConfig[card.rarity].border,
                        boxShadow: rarityConfig[card.rarity].shadow,
                        animation: 'bounce-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        position: 'relative',
                        zIndex: 10
                    }}
                >
                    <div style={{
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        color: card.rarity === 'Ultra Rare' ? 'var(--accent-gold)' : '#666',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>{card.rarity}</div>

                    <div style={{
                        height: '140px',
                        backgroundColor: card.color,
                        borderRadius: '15px',
                        marginTop: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '4rem',
                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
                    }}>
                        {card.name[0]}
                    </div>

                    <h3 style={{ margin: '1rem 0 0.5rem', fontSize: '1.4rem' }}>{card.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic' }}>{card.show}</p>

                    {card.isNew && (
                        <div style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            background: 'var(--brain-pink)',
                            color: 'white',
                            padding: '5px 12px',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 10px rgba(255, 133, 161, 0.4)',
                            animation: 'float 2s infinite ease-in-out'
                        }}>
                            NEW!
                        </div>
                    )}
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
        .card-pack.ripping {
          animation: shake-heavy 0.2s infinite;
        }
        @keyframes shake-heavy {
          0% { transform: translate(2px, 2px) rotate(0deg) scale(1.1); }
          25% { transform: translate(-2px, -3px) rotate(-2deg) scale(1.1); }
          50% { transform: translate(-4px, 1px) rotate(2deg) scale(1.1); }
          75% { transform: translate(4px, 3px) rotate(-1deg) scale(1.1); }
          100% { transform: translate(2px, -3px) rotate(1deg) scale(1.1); }
        }
      `}} />
        </div>
    );
};

export default CardPack;
