import React, { useState, useEffect } from 'react';
import mascotImg from '../assets/brain-mascot.png';
import '../styles/design-system.css';

const BrainMascot = ({ state = 'idle', message }) => {
    // Determine animation based on state
    const mascotStyle = {
        fontSize: '4rem',
        display: 'inline-block',
        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    };

    if (state === 'celebrate') {
        mascotStyle.transform = 'translateY(-20px) scale(1.2) rotate(10deg)';
    } else if (state === 'wrong') {
        mascotStyle.transform = 'rotate(-15deg) scale(0.9)';
        mascotStyle.opacity = '0.8';
    }

    return (
        <div className="mascot-container" style={{ textAlign: 'center', minHeight: '180px', padding: '1rem' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={mascotStyle}>
                    🧠
                    <div style={{
                        position: 'absolute',
                        top: '-15px',
                        right: '-10px',
                        fontSize: '1.5rem',
                        opacity: state === 'wrong' ? 0.3 : 1,
                        transition: 'opacity 0.3s ease'
                    }}>
                        💡
                    </div>
                </div>
                {/* Decorative arms/legs (simplified) */}
                <div style={{ position: 'absolute', bottom: '5px', left: '-10px', fontSize: '1rem' }}>💪</div>
                <div style={{ position: 'absolute', bottom: '5px', right: '-10px', fontSize: '1rem' }}>🤳</div>
            </div>

            <div className="speech-bubble" style={{
                background: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '20px',
                marginTop: '1rem',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                position: 'relative',
                display: 'inline-block',
                maxWidth: '80%',
                border: '2px solid var(--brain-pink-light)',
                animation: 'bounce-pop 0.4s ease'
            }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{message}</span>
                {/* Bubble tail */}
                <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '10px solid transparent',
                    borderRight: '10px solid transparent',
                    borderBottom: '10px solid var(--brain-pink-light)'
                }}></div>
            </div>
        </div>
    );
};

export default BrainMascot;
