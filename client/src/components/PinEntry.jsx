import React, { useState } from 'react';

// PINs - you can change these
const STUDENT_PIN = '1234';  // Praptini's PIN
const PARENT_PIN = '2026';   // Parent PIN for dashboard

const PinEntry = ({ onSuccess, isParent = false }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);

    const correctPin = isParent ? PARENT_PIN : STUDENT_PIN;

    const handleDigit = (digit) => {
        if (pin.length < 4) {
            const newPin = pin + digit;
            setPin(newPin);
            setError(false);

            if (newPin.length === 4) {
                if (newPin === correctPin) {
                    onSuccess();
                } else {
                    setError(true);
                    setShake(true);
                    setTimeout(() => {
                        setPin('');
                        setShake(false);
                    }, 500);
                }
            }
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
        setError(false);
    };

    const handleClear = () => {
        setPin('');
        setError(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #fff5f5 0%, #fff 50%, #f0f7ff 100%)',
            padding: '2rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '2.5rem',
                boxShadow: '0 10px 40px rgba(233, 137, 151, 0.2)',
                maxWidth: '350px',
                width: '100%',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    {isParent ? '🛡️' : '🧠'}
                </div>
                <h2 style={{ marginBottom: '0.5rem', color: '#333' }}>
                    {isParent ? 'Parent Access' : 'Hi Praptini!'}
                </h2>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                    {isParent ? 'Enter parent PIN' : 'Enter your PIN to start'}
                </p>

                {/* PIN Dots */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginBottom: '2rem',
                    animation: shake ? 'shake 0.5s ease-in-out' : 'none'
                }}>
                    {[0, 1, 2, 3].map(i => (
                        <div
                            key={i}
                            style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: i < pin.length 
                                    ? (error ? 'var(--wrong-orange)' : 'var(--brain-pink)') 
                                    : '#eee',
                                transition: 'all 0.2s ease',
                                transform: i < pin.length ? 'scale(1.1)' : 'scale(1)'
                            }}
                        />
                    ))}
                </div>

                {error && (
                    <p style={{ color: 'var(--wrong-orange)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        Wrong PIN, try again!
                    </p>
                )}

                {/* Keypad */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem',
                    maxWidth: '250px',
                    margin: '0 auto'
                }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                        <button
                            key={digit}
                            onClick={() => handleDigit(String(digit))}
                            style={{
                                padding: '1.2rem',
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                border: 'none',
                                borderRadius: '16px',
                                background: '#f8f9fa',
                                cursor: 'pointer',
                                transition: 'all 0.1s ease'
                            }}
                            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            {digit}
                        </button>
                    ))}
                    <button
                        onClick={handleClear}
                        style={{
                            padding: '1.2rem',
                            fontSize: '1rem',
                            border: 'none',
                            borderRadius: '16px',
                            background: '#f8f9fa',
                            cursor: 'pointer',
                            color: '#999'
                        }}
                    >
                        Clear
                    </button>
                    <button
                        onClick={() => handleDigit('0')}
                        style={{
                            padding: '1.2rem',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: '16px',
                            background: '#f8f9fa',
                            cursor: 'pointer'
                        }}
                    >
                        0
                    </button>
                    <button
                        onClick={handleDelete}
                        style={{
                            padding: '1.2rem',
                            fontSize: '1.2rem',
                            border: 'none',
                            borderRadius: '16px',
                            background: '#f8f9fa',
                            cursor: 'pointer',
                            color: '#999'
                        }}
                    >
                        ⌫
                    </button>
                </div>

                {!isParent && (
                    <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#bbb' }}>
                        Hint: Your lucky number! 🍀
                    </p>
                )}
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
            `}</style>
        </div>
    );
};

export default PinEntry;
