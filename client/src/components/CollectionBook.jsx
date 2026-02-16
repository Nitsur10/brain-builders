import React from 'react';
import CollectionStore from '../logic/collectionStore';
import '../styles/design-system.css';
import { rarityConfig } from '../logic/cardData';

const CollectionBook = () => {
    const cards = CollectionStore.getCollection();

    return (
        <div className="collection-book" style={{ padding: '2rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Your Card Collection</h2>
            <div className="card-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '1.5rem'
            }}>
                {cards.map(card => (
                    <div
                        key={card.id}
                        style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            background: card.owned ? 'white' : '#f0f0f0',
                            border: card.owned ? rarityConfig[card.rarity].border : '1px dashed #ccc',
                            opacity: card.owned ? 1 : 0.6,
                            filter: card.owned ? 'none' : 'grayscale(100%)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{
                            height: '80px',
                            backgroundColor: card.owned ? card.color : '#ccc',
                            borderRadius: '8px',
                            marginBottom: '0.5rem'
                        }} />
                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                            {card.owned ? card.name : '???'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#666' }}>
                            {card.rarity}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CollectionBook;
