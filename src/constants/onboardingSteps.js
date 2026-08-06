export const SIMULATOR_ONBOARDING_STEPS = [
  {
    title: 'Your first quantum experiment',
    body: "We'll do one complete experiment together right now. It takes three actions. Follow the steps below — the guide will track your progress.",
  },
  {
    title: 'Step 1 — Create superposition',
    body: "Click 'Hadamard (Q0)' in the gate panel on the left. Watch the probability bars change: Q0 now has a 50% chance of measuring 0 or 1.",
  },
  {
    title: 'Step 2 — Notice the bars',
    body: "The two bars for |00⟩ and |10⟩ are now equal. That means if you measured right now, the outcome would be completely random — unlike a classical bit, which always has a definite value.",
  },
  {
    title: 'Step 3 — Measure',
    body: "Click 'Perform Measurement'. The superposition collapses — all the probability snaps into one outcome. Run the experiment again (Reset) and it may land differently.",
  },
  {
    title: "You've run a quantum experiment",
    body: "That's the core loop: prepare a state → apply gates → measure. Everything else in QSketch is a variation on this. Try CNOT after Hadamard next — that creates entanglement.",
  },
];

export const GAME_ONBOARDING_STEPS = [
  {
    title: 'Welcome to the Puzzle Solver',
    body: "Each level gives you a target state (marked with a ★). Apply gates to reach it within the move limit.",
  },
  {
    title: 'Watching your progress',
    body: "The chart compares your current state to the target. Solid vs. outlined bars show amplitude sign — sometimes you need a negative amplitude to cancel out the wrong outcomes.",
  },
  {
    title: 'Moves, undo, and hints',
    body: "Undo reverts your last gate, Reset starts the level over, and hints are shown right below the level description if you get stuck.",
  },
];
