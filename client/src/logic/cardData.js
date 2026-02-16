export const cardData = [
    { id: 1, name: "Violet Baudelaire", rarity: "Common", show: "A Series of Unfortunate Events", color: "#A29BFE" },
    { id: 2, name: "Klaus Baudelaire", rarity: "Common", show: "A Series of Unfortunate Events", color: "#74B9FF" },
    { id: 3, name: "Sunny Baudelaire", rarity: "Uncommon", show: "A Series of Unfortunate Events", color: "#55EFC4" },
    { id: 4, name: "Carmen Sandiego", rarity: "Rare", show: "Carmen Sandiego", color: "#FF7675" },
    { id: 5, name: "Shadow Carmen", rarity: "Ultra Rare", show: "Carmen Sandiego", color: "#2D3436" },
    { id: 6, name: "Sam Puckett", rarity: "Uncommon", show: "Sam & Cat", color: "#FDCB6E" },
    { id: 7, name: "Cat Valentine", rarity: "Uncommon", show: "Sam & Cat", color: "#E84393" },
    { id: 8, name: "Golden Brain", rarity: "Ultra Rare", show: "Brain Builders", color: "#FFEAA7" }
];

export const rarityConfig = {
    Common: { weight: 60, shadow: "none", border: "2px solid #ddd" },
    Uncommon: { weight: 25, shadow: "0 0 10px rgba(107, 203, 255, 0.5)", border: "2px solid #b2bec3" },
    Rare: { weight: 10, shadow: "0 0 15px rgba(255, 215, 0, 0.7)", border: "3px solid gold" },
    "Ultra Rare": { weight: 5, shadow: "0 0 25px rgba(255, 133, 161, 0.9)", border: "4px solid #FF85A1" }
};
