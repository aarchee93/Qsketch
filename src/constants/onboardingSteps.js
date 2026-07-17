export const SIMULATOR_ONBOARDING_STEPS = [
  {
    title: 'Welcome to the Free Simulator',
    body: "Two qubits start at |00⟩. Apply gates from the panel on the left and watch the state react in real time.",
  },
  {
    title: 'Reading the probability chart',
    body: "Each bar shows how likely a measurement is to land on that outcome. A solid black bar means a positive amplitude; an outlined bar with a − badge means a negative one — negative amplitudes are what cause interference.",
  },
  {
    title: 'Circuit diagram & lab console',
    body: "Your gates are drawn as an actual circuit below the chart, and the lab console ticks with a log of every action — like a real machine, not a static form.",
  },
  {
    title: 'Measuring',
    body: "Hit \"Measure Qubits\" to collapse the state into one classical outcome. Reset any time to start a fresh experiment.",
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
