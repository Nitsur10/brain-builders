import { cardData, rarityConfig } from './cardData';

class CollectionStore {
    constructor() {
        this.collection = new Set(); // Stores card IDs
        this.load();
    }

    load() {
        const saved = localStorage.getItem('brain_builders_collection');
        if (saved) {
            const ids = JSON.parse(saved);
            ids.forEach(id => this.collection.add(id));
        }
    }

    save() {
        localStorage.setItem('brain_builders_collection', JSON.stringify([...this.collection]));
    }

    drawCard() {
        const rand = Math.random() * 100;
        let cumulative = 0;
        let selectedRarity = "Common";

        for (const [rarity, config] of Object.entries(rarityConfig)) {
            cumulative += config.weight;
            if (rand <= cumulative) {
                selectedRarity = rarity;
                break;
            }
        }

        const available = cardData.filter(c => c.rarity === selectedRarity);
        const card = available[Math.floor(Math.random() * available.length)];

        const isNew = !this.collection.has(card.id);
        this.collection.add(card.id);
        this.save();

        return { ...card, isNew };
    }

    getCollection() {
        return cardData.map(card => ({
            ...card,
            owned: this.collection.has(card.id)
        }));
    }
}

export default new CollectionStore();
