# Q-Sketch (Qubit Sketchpad)

Q-Sketch is a browser-based quantum computing simulator and puzzle game, built as a 7th-semester minor project. It lets you apply gates to a 2-qubit system and watch the probability distribution change live, instead of just reading about superposition, entanglement, and measurement in a textbook. There's also a small notes editor for writing down your own understanding of each concept, and a Learning Centre with structured lessons, a glossary, and curated external resources.

Accounts are optional. You can use Q-Sketch as a guest with progress and notes stored locally via `localStorage`, or sign up with email/password to sync your game progress, achievements, and concept notes to the cloud via Supabase — so your work follows you across devices and survives a cleared browser cache.

## Features

- **2-Qubit Free Simulator** — apply Hadamard, Pauli-X, and CNOT gates starting from the |00⟩ state and watch the probability bars update in real time.
- **Signed amplitude visualization** — bars are solid for positive amplitudes and outlined for negative ones, so interference is actually visible instead of hidden behind squared probabilities.
- **Live circuit diagram** — gates you apply render as an actual circuit (two qubit wires, gate boxes, CNOT control/target dots), not just a list of names.
- **Quantum Learning Assistant** — after each gate, a short explanation of what just happened and why, with a link into the matching Learning Centre lesson.
- **Lab console** — a small terminal-style log at the bottom of the Simulator showing every gate, undo, reset, and measurement as it happens.
- **Quantum Puzzle Solver** — 11 levels where you have to reach a target state within a move limit, with hints, difficulty tags, and achievements for things like finishing without Undo or well under the move limit.
- **Quantum Learning Centre** — a Learning Path of 7 milestones (Bit → Qubit → Superposition → Gates → Entanglement → Measurement → Algorithms) that jump straight to the matching lesson when clicked, a 9-lesson Learn tab, a 24-term Glossary tagged by difficulty, and curated Blogs, Papers, and Videos (with YouTube thumbnails), all searchable from one search bar.
- **Concept notes (CMS)** — add, color-tag, and delete your own quantum concept notes. Synced to Supabase when signed in, saved to `localStorage` as a guest.
- **Accounts & cloud sync** — email/password signup and login via Supabase Auth, with session persistence across refreshes. Game progress, achievements, and concept notes automatically sync to the cloud when authenticated, and gracefully fall back to `localStorage` when offline or used as a guest.
- **Profile page** — view account info, a summary of game progress (levels completed, achievements, stats), export progress/concepts as JSON, reset all progress, and log out.
- **Welcome & Auth pages** — a quantum-themed onboarding and sign-in/sign-up flow with animated backgrounds (orbiting fields, pulsing state-indicator dots) that match the Q-Sketch brand.
- **Guest mode** — skip account creation entirely and use the app fully offline-first, with the option to sign up later without losing local progress.
- **One-time onboarding** — a short walkthrough shown once per visit (reopenable via the "?" button), held only in memory so it resets on refresh rather than nagging you every time.
- **Accessibility** — ARIA labels on interactive controls, live regions for state changes, visible keyboard-focus outlines, and screen-reader-friendly state summaries.

## Tech Stack

- **Core logic**: plain JavaScript, using real-valued 4×4 matrices acting on a 4-element state vector to simulate 2-qubit gates.
- **Frontend**: React 18 (function components, hooks — `useState`, `useCallback`, `useEffect`, `useMemo`, plus a couple of small custom hooks), with React Router for page navigation.
- **Styling**: Tailwind CSS, tuned into a consistent black-and-white "sketch" look (thick borders, offset drop shadows) rather than default Tailwind styling.
- **Build tool**: Vite.
- **Testing**: Vitest, covering the quantum math, validation, and game-progress utilities.
- **Backend / Auth / Database**: Supabase — email/password authentication, PostgreSQL tables with Row Level Security for per-user data isolation.
- **Persistence**: hybrid model — Supabase for signed-in users (game progress, achievements, concept notes), `localStorage` as an offline/guest fallback. Nothing is ever shared between users; each user's cloud data is isolated via RLS policies.

## Getting Started

### Prerequisites

Node.js (v18+) and npm, plus a free [Supabase](https://supabase.com) account if you want cloud sync (optional — the app also runs fully in guest/local mode without it).

### Setup

```bash
git clone https://github.com/<your-username>/Qsketch.git
cd Qsketch
npm install
```

### Supabase configuration (optional, for accounts + cloud sync)

1. Create a project at [supabase.com](https://supabase.com).
2. Copy the environment template and fill in your credentials (found under Supabase → Settings → API):
   ```bash
   cp .env.example .env.local
   ```
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
3. In the Supabase SQL editor, create the three required tables (`game_progress`, `user_achievements`, `user_concepts`), each with Row Level Security enabled and per-user policies. See `IMPLEMENTATION_GUIDE.md` for the exact SQL.
4. Enable the **Email** provider under Authentication → Providers.

If you skip this step, Q-Sketch still works fully as a guest, storing everything locally.

### Run

```bash
npm run dev
```
The app runs at `http://localhost:5173` by default.

Run the test suite:
```bash
npm test
```

Build for production:
```bash
npm run build
```

## Quantum Gates

The simulator represents a 2-qubit system as a 4-element real-valued vector `[α₀₀, α₀₁, α₁₀, α₁₁]`, and builds each gate as a 4×4 matrix using the tensor (Kronecker) product.

| Gate | What it does | Matrix form |
|---|---|---|
| Hadamard (H0, H1) | Puts Qubit 0 or Qubit 1 into equal superposition | H ⊗ I or I ⊗ H |
| Pauli-X (X0, X1) | Flips a qubit — the quantum NOT gate | X ⊗ I or I ⊗ X |
| CNOT | Flips the target qubit only if the control qubit is 1 — used to create entanglement | CNOT₀₁ |

One deliberate scope decision: this simulator only uses real-valued amplitudes, not complex numbers. The three gates above are enough to demonstrate superposition, entanglement, and constructive/destructive interference, which is the actual point of the project, without needing complex arithmetic. Gates that require a complex phase (Pauli-Y, S, T) are intentionally left out.

## Project Structure

```
src/
├── components/   # Gates panel, state chart, circuit diagram, lab console, gate tooltips,
│                 # mode toggle, tier selector, quantum auth layout, modals, etc.
├── contexts/     # Guest mode context
├── pages/        # Welcome, Auth, Landing, Simulator, Game, CMS, Learning Centre, Profile
├── constants/    # Gate matrices, game levels, learning content, achievements, pages
├── hooks/        # useLabConsole, useConfirm
├── utils/        # Quantum math, validation, storage, game progress, Supabase client/auth/concepts (each with tests)
```

## Limitations & Future Scope

- **Real-valued amplitudes only** — moving to complex amplitudes would unlock phase gates (S, T) and a proper Bloch sphere visualization.
- **Joint measurement only** — the simulator always measures both qubits at once; per-qubit measurement would let you measure just Q0 and watch Q1's distribution resolve instantly, which is a clearer demonstration of entanglement than what's here now.
- **Password reset & social auth** — not yet implemented; planned as a post-MVP improvement alongside profile pictures, leaderboards, and shareable achievements.

## Credits

- **Developers**: Aarchee, Mehul
- **Course**: B.Tech Computer Science Engineering — 7th Semester Minor Project
- **Inspiration**: Google Quantum AI's Qubit Game and the Qiskit Textbook
