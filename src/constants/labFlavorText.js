/**
 * Flavor-text data used purely for UI liveliness:
 * - console log line variants (lab console ticker)
 * - assistant commentary variants (so it doesn't repeat verbatim)
 * - "did you know" facts
 * None of this is tracked/persisted — it's regenerated fresh every load.
 */

// Multiple phrasings per event so the console doesn't feel like a static log.
export const CONSOLE_LINES = {
  H0: [
    'Hadamard applied to Q0 → superposition engaged',
    '> H(Q0) executed, amplitudes redistributed',
    'Q0 pushed into superposition',
  ],
  H1: [
    'Hadamard applied to Q1 → superposition engaged',
    '> H(Q1) executed, amplitudes redistributed',
    'Q1 pushed into superposition',
  ],
  X0: [
    'Pauli-X applied to Q0 → bit flipped',
    '> X(Q0) executed, state inverted',
    'Q0 flipped, classical NOT behavior',
  ],
  X1: [
    'Pauli-X applied to Q1 → bit flipped',
    '> X(Q1) executed, state inverted',
    'Q1 flipped, classical NOT behavior',
  ],
  CNOT: [
    'CNOT applied → entanglement check running',
    '> Controlled-NOT executed on Q0→Q1',
    'Entanglement gate fired, correlating qubits',
  ],
  MEASURE: [
    'Measurement triggered → state collapsing',
    '> Wavefunction collapse in progress',
    'Observation event: superposition destroyed',
  ],
  UNDO: [
    'Last operation reverted',
    '> Undo signal received, rolling back state',
    'State rewound one step',
  ],
  RESET: [
    'Circuit cleared, state reset to |00⟩',
    '> System reinitialized',
    'Fresh start: all qubits zeroed',
  ],
  BOOT: [
    'Lab console online',
    'State engine initialized at |00⟩',
    'Standing by for input...',
  ],
};

export const collapsedOutcomeLine = (outcome) =>
  [
    `Measurement collapsed to |${outcome}⟩`,
    `> Result locked in: |${outcome}⟩`,
    `Classical outcome recorded: |${outcome}⟩`,
  ];

// Deterministic-but-varied pick: same event won't always print the same line.
export const pickVariant = (variants, seed) => {
  if (!variants || variants.length === 0) return '';
  const index = Math.abs(seed) % variants.length;
  return variants[index];
};

// Several phrasings per gate for the Quantum Learning Assistant, so re-applying
// the same gate later in a session doesn't read like a lookup table.
export const ASSISTANT_VARIANTS = {
  START: [
    {
      title: 'Welcome to the Simulator',
      happened: 'Your circuit is currently in the initial |00⟩ state.',
      why: 'Every quantum circuit starts from a known initial state.',
      next: 'Try applying the Hadamard gate on Q0.',
    },
    {
      title: 'Fresh Circuit',
      happened: 'Both qubits are sitting at |00⟩, waiting for input.',
      why: 'A clean initial state means 100% certainty before any gate runs.',
      next: 'Pick a gate on the left to see the probabilities shift.',
    },
  ],
  H0: [
    {
      title: 'Hadamard Gate (Q0)',
      happened: 'Qubit Q0 entered superposition.',
      why: 'Hadamard creates an equal probability of measuring |0⟩ and |1⟩.',
      next: 'Apply CNOT to create entanglement.',
    },
    {
      title: 'Hadamard Gate (Q0)',
      happened: 'Q0 is now split evenly between |0⟩ and |1⟩.',
      why: 'This is the classic "50/50 coin-flip" quantum state.',
      next: 'Try CNOT next to link Q0 and Q1 together.',
    },
    {
      title: 'Hadamard Gate (Q0)',
      happened: 'Q0 no longer has a definite value — it is in superposition.',
      why: 'Hadamard rotates the basis state to an equal-weight mixture.',
      next: 'See how the probability bars for Q0 evened out?',
    },
  ],
  H1: [
    {
      title: 'Hadamard Gate (Q1)',
      happened: 'Qubit Q1 entered superposition.',
      why: 'This allows Q1 to exist in multiple possible states.',
      next: 'Observe how the probability graph changes.',
    },
    {
      title: 'Hadamard Gate (Q1)',
      happened: 'Q1 is now spread across |0⟩ and |1⟩ evenly.',
      why: 'Same effect as H0, just applied to the second qubit.',
      next: 'Try combining this with a gate on Q0.',
    },
  ],
  X0: [
    {
      title: 'Pauli-X Gate (Q0)',
      happened: 'Qubit Q0 was flipped.',
      why: 'Pauli-X works like the classical NOT gate.',
      next: 'Try applying Hadamard after this.',
    },
    {
      title: 'Pauli-X Gate (Q0)',
      happened: 'Q0 swapped from its previous value to the opposite.',
      why: 'X is a full bit-flip — no superposition involved.',
      next: 'Stack a Hadamard on top to add superposition.',
    },
  ],
  X1: [
    {
      title: 'Pauli-X Gate (Q1)',
      happened: 'Qubit Q1 was flipped.',
      why: 'The state of the second qubit has been inverted.',
      next: 'Measure the system to observe the result.',
    },
    {
      title: 'Pauli-X Gate (Q1)',
      happened: 'Q1 just swapped to its opposite classical value.',
      why: 'This is a deterministic flip, not a probabilistic one.',
      next: 'Try measuring now to lock in the result.',
    },
  ],
  CNOT: [
    {
      title: 'CNOT Gate',
      happened: 'A controlled operation was applied.',
      why: 'CNOT is used to create entanglement when the control qubit is in superposition.',
      next: 'Measure the qubits.',
    },
    {
      title: 'CNOT Gate',
      happened: 'Q1 flipped conditionally, based on Q0.',
      why: "If Q0 was already in superposition, the qubits are now entangled — measuring one instantly tells you the other.",
      next: 'Go ahead and measure to collapse the entangled pair.',
    },
  ],
  MEASURE: [
    {
      title: 'Measurement',
      happened: 'The quantum state collapsed into one classical state.',
      why: 'Measurement destroys superposition.',
      next: 'Reset the simulator to begin another experiment.',
    },
    {
      title: 'Measurement',
      happened: 'The probabilistic state resolved to a single definite outcome.',
      why: 'Observing a qubit forces it to "choose" a classical value.',
      next: 'Hit reset to run a fresh experiment.',
    },
  ],
};

// Short "in progress" phrasing for the Observation Card while a gate/measurement
// is mid-animation — the "before" half of the Observation Card pattern.
export const OBSERVATION_APPLYING = {
  H0: ['Applying Hadamard to Q0…', 'Creating superposition…'],
  H1: ['Applying Hadamard to Q1…', 'Creating superposition…'],
  X0: ['Applying Pauli-X to Q0…', 'Flipping the qubit…'],
  X1: ['Applying Pauli-X to Q1…', 'Flipping the qubit…'],
  CNOT: ['Applying CNOT…', 'Entangling Q0 and Q1…'],
  MEASURE: ['Measuring the qubits…', 'Collapsing the wavefunction…'],
};

export const DID_YOU_KNOW_FACTS = [
  'A single qubit in superposition can represent both 0 and 1 at once — but measuring it always returns a classical answer.',
  'The Hadamard gate is one of the most-used gates in quantum computing because it creates equal superposition from a definite state.',
  'Entangled qubits stay correlated no matter how far apart they are — Einstein called this "spooky action at a distance."',
  'CNOT plus Hadamard is the standard recipe for creating a Bell pair, the simplest form of entanglement.',
  'Unlike classical bits, qubits can hold negative amplitudes, which is how quantum interference cancels out wrong answers.',
  'Measuring a qubit is irreversible — once collapsed, the original superposition is gone for good.',
  'Two entangled qubits need only one measurement to reveal information about both of them.',
  'Quantum computers don\u2019t replace classical ones — they\u2019re expected to specialize in problems like factoring and simulation.',
];

export const RESEARCH_NOTES = {
  START: 'Every quantum circuit begins in a known, definite state — there is no superposition until a gate creates one.',
  H0: 'A single Hadamard spreads Q0 into 50/50 — apply it twice and the two spreads interfere back into a definite value.',
  H1: 'Applying H twice returns the qubit to its original basis — the two 50/50 spreads interfere and cancel back to a definite value.',
  X0: 'Pauli-X just flips |0⟩↔|1⟩ — no superposition here, it behaves exactly like a classical NOT gate.',
  X1: 'Pauli-X just flips |0⟩↔|1⟩ — no superposition here, it behaves exactly like a classical NOT gate.',
  CNOT: 'CNOT only flips Q1 when Q0 is |1⟩ — combined with a Hadamard first, this is how entanglement is created.',
  MEASURE: 'Once measured, the superposition is gone for good — repeating the measurement will keep giving the same collapsed result.',
};