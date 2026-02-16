# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brain Builders is an AI-powered daily practice app for Australian children (ages 8-12) preparing for OC (Opportunity Class) and Selective School tests. Phase 1 covers Maths and English with a gamification system (collectible cards). The full PRD is in `Brain-Builders-PRD.md`.

## Development Commands

All commands run from the `client/` directory:

```bash
cd client
npm run dev      # Start Vite dev server with HMR
npm run build    # Production build to client/dist/
npm run preview  # Preview production build locally
npm run lint     # ESLint (flat config, React hooks + refresh plugins)
```

Validate the question bank (runs via Node, not browser):
```bash
node client/src/logic/validateQuestions.js
```

## Tech Stack

- **React 19** with JSX (no TypeScript)
- **Vite 7** for bundling/dev server
- **ESLint 9** flat config with react-hooks and react-refresh plugins
- **No router** - view state managed via `useState('home')` in `App.jsx`
- **No backend** - all state is client-side; card collection persists to `localStorage`
- **Font**: Outfit (loaded from Google Fonts in `index.html`)

## Architecture

### Views (managed in `App.jsx` via `view` state)

`home` -> `practice` -> `rewards` -> `home` (main loop)
`home` -> `collection` (card gallery)
`home` -> `parent` (parent dashboard)

### Agent Pattern (singleton classes, not React state)

The app uses a custom "agent" pattern — plain JS classes exported as singletons that hold session state outside React:

- **`agents/QuestionAgent.js`** — Adaptive difficulty engine. Tracks answer history, cycles through subjects (Reading, Mathematical Reasoning, Thinking Skills), adjusts difficulty 1-3 based on streak performance. Filters `mockQuestions` by year/subject/difficulty with fallback cascades.
- **`agents/CoachingAgent.js`** — Returns growth-mindset feedback strings based on performance profile (streak, difficulty, correctness).

These agents are imported and called imperatively from components. They are **not** tied to React state — `QuestionAgent` mutates its own `history` and `currentDifficulty` internally.

### Logic Layer (`logic/`)

- **`mockQuestions.js`** — Static question bank array. Each question has: `id`, `subject`, `year` (3-6), `difficulty` (1-3), `question`, `options[]`, `correctAnswer`, `explanation`. Currently ~7 questions (MVP seed data).
- **`cardData.js`** — Card definitions with rarity tiers (Common 60%, Uncommon 25%, Rare 10%, Ultra Rare 5%) and visual config (borders, shadows).
- **`collectionStore.js`** — Singleton managing card collection. Persists owned card IDs to `localStorage` under key `brain_builders_collection`. Weighted random draw based on `rarityConfig`.
- **`validateQuestions.js`** — Node.js script (uses `process.exit`) that validates question bank integrity: required fields, duplicate IDs, answer-in-options check, valid subjects.

### Components (`components/`)

- **`QuestionSession`** — Main practice loop. Runs a 30-minute timer, renders questions from `QuestionAgent`, handles answer selection with 3-second feedback delay, calls `onComplete` when daily goal met.
- **`CardPack`** — Mystery card pack opening animation (confetti, shake, reveal). Calls parent's `onOpen` callback to draw a card.
- **`CollectionBook`** — Grid gallery of all cards. Owned cards shown in color; unowned shown greyed/dashed.
- **`BrainMascot`** — Emoji-based mascot with state-driven transforms (idle/celebrate/wrong) and speech bubble.
- **`ParentDashboard`** — Shows engagement stats and per-subject accuracy (currently hardcoded mock data).

### Styling

- **`styles/design-system.css`** — CSS custom properties for the brand palette and shared animations. Key variables: `--brain-pink`, `--correct-green`, `--wrong-orange`, `--accent-gold`, `--block-*` (rainbow building block colors).
- Most component styling is inline via `style` props, not CSS classes.
- Animations defined in CSS: `float`, `bounce-pop`, `sparkle`, `confetti-fall`, `success-pop`, `error-shake`, `fade-slide-in`.

### Assets

- `src/assets/background.png` — Home screen background
- `src/assets/brain-mascot.png` — Mascot image (imported in `BrainMascot.jsx` but currently using emoji fallback)

## Key Conventions

- **Subjects** must be one of: `Reading`, `Mathematical Reasoning`, `Thinking Skills`
- **Question difficulty** is 1 (Easy), 2 (Medium), 3 (Hard)
- **Year levels** are 3-6 (3-4 = OC prep, 5-6 = Selective prep)
- **Card rarity** levels: Common, Uncommon, Rare, Ultra Rare
- **ESLint rule**: unused vars starting with uppercase or `_` are allowed (`varsIgnorePattern: '^[A-Z_]'`)
- Wrong answers use orange (`--wrong-orange`), never harsh red, per the PRD's child-friendly design
- Feedback uses growth mindset language (never punitive)
