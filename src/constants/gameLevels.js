import { INITIAL_STATE, ONE_OVER_SQRT2 } from './quantumGates';

// Difficulty levels
const DIFFICULTY = {
  BEGINNER: 'beginner',
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert',
};

// Tier structure for game progression
const TIER = {
  TIER_1: 'tier_1', // Tutorial-paced with heavy guidance
  TIER_2: 'tier_2', // Multi-gate puzzles with lighter guidance
  TIER_3: 'tier_3', // Open-ended sandbox challenges, minimal hand-holding
};

// Level Definitions for the Game (11 Levels organized by Tier)
export const LEVELS = [
    // ========== TIER 1: TUTORIAL-PACED (Levels 1-3) ==========
    // Heavy guidance, single gates, learning fundamentals
    {
        name: "Classical Flip",
        difficulty: DIFFICULTY.BEGINNER,
        tier: TIER.TIER_1,
        lessonId: 3,
        targetVector: [0, 0, 1, 0], 
        maxMoves: 3,
        description: "Your goal is to flip the first qubit (Q0) from |0> to |1>. Find the single gate that accomplishes this, using 3 moves or less.",
        hint: "Look for the 'X' gate - it's the quantum NOT gate!",
        learningPoints: "Introduces the Pauli-X gate for bit flipping.",
        guidance: "💡 The X gate flips a qubit. Try it on Q0!",
    },
    {
        name: "Second Qubit Flip",
        difficulty: DIFFICULTY.BEGINNER,
        tier: TIER.TIER_1,
        lessonId: 3,
        targetVector: [0, 1, 0, 0], 
        maxMoves: 3,
        description: "Now flip the second qubit (Q1) from |0> to |1>. You'll need to apply the X gate to Q1 instead.",
        hint: "Use Pauli-X on Q1, not Q0!",
        learningPoints: "Learn how to apply gates to different qubits.",
        guidance: "💡 Each qubit can have its own gate. Apply X to Q1 this time!",
    },
    {
        name: "First Superposition",
        difficulty: DIFFICULTY.EASY,
        tier: TIER.TIER_1,
        lessonId: 2,
        targetVector: [ONE_OVER_SQRT2, 0, ONE_OVER_SQRT2, 0],
        maxMoves: 2,
        description: "Create an equal superposition state on Qubit 0. The probability of measuring |0> or |1> should be 50%.",
        hint: "Use the Hadamard (H) gate on Q0 to create superposition!",
        learningPoints: "Hadamard gate creates equal superposition.",
        guidance: "💡 Hadamard (H) puts a qubit in superposition - 50/50 chance of |0> or |1>!",
    },

    // ========== TIER 2: MULTI-GATE PUZZLES (Levels 4-7) ==========
    // Lighter guidance, combining multiple gates, building intuition
    {
        name: "Second Superposition",
        difficulty: DIFFICULTY.EASY,
        tier: TIER.TIER_2,
        lessonId: 2,
        targetVector: [ONE_OVER_SQRT2, ONE_OVER_SQRT2, 0, 0],
        maxMoves: 2,
        description: "Create superposition on Qubit 1. Both qubits |0> and |1> should have 50% probability.",
        hint: "Apply Hadamard to Q1!",
        learningPoints: "Apply Hadamard to different qubits.",
        guidance: "🔧 You know H creates superposition. Try applying it to a different qubit.",
    },
    {
        name: "Double Superposition",
        difficulty: DIFFICULTY.MEDIUM,
        tier: TIER.TIER_2,
        lessonId: 2,
        targetVector: [0.5, 0.5, 0.5, 0.5],
        maxMoves: 3,
        description: "Create superposition on BOTH qubits. All four outcomes |00>, |01>, |10>, |11> should have equal 25% probability each.",
        hint: "Apply Hadamard to Q0, then Hadamard to Q1!",
        learningPoints: "Multiple Hadamard gates create uniform superposition.",
        guidance: "🔧 What happens when you apply H to both qubits?",
    },
    {
        name: "Entangled Bell State",
        difficulty: DIFFICULTY.MEDIUM,
        tier: TIER.TIER_2,
        lessonId: 4,
        targetVector: [ONE_OVER_SQRT2, 0, 0, ONE_OVER_SQRT2],
        maxMoves: 4,
        description: "Create the famous Bell State where the two qubits are perfectly correlated. Only the |00> and |11> outcomes should have probability.",
        hint: "Use H0 followed by CNOT to entangle!",
        learningPoints: "CNOT gate creates entanglement.",
        guidance: "🔧 CNOT links two qubits together. What does superposition + CNOT create?",
    },
    {
        name: "Anti-Bell State",
        difficulty: DIFFICULTY.MEDIUM,
        tier: TIER.TIER_2,
        lessonId: 4,
        targetVector: [0, ONE_OVER_SQRT2, ONE_OVER_SQRT2, 0], 
        maxMoves: 5,
        description: "Create the Bell State where qubits are anti-correlated. If Q0 is |0>, Q1 must be |1>, and vice versa.",
        hint: "Start with X1, then H0, then CNOT!",
        learningPoints: "Combine gates to create different entangled states.",
        guidance: "🔧 Try flipping one qubit first, then create superposition and entanglement.",
    },

    // ========== TIER 3: OPEN-ENDED SANDBOX (Levels 8-11) ==========
    // Minimal hand-holding, complex combinations, mastery puzzles
    {
        name: "Flip After Superposition",
        difficulty: DIFFICULTY.HARD,
        tier: TIER.TIER_3,
        lessonId: 3,
        targetVector: [0, 0, ONE_OVER_SQRT2, ONE_OVER_SQRT2],
        maxMoves: 5,
        description: "Create superposition on Q0, then flip Q1. The final state should only show |10> and |11> outcomes with 50% each.",
        hint: "H0, then X1!",
        learningPoints: "Combine superposition and bit-flip operations.",
        guidance: "",
    },
    {
        name: "Superposition on Q0",
        difficulty: DIFFICULTY.HARD,
        tier: TIER.TIER_3,
        lessonId: 2,
        targetVector: [ONE_OVER_SQRT2, 0, ONE_OVER_SQRT2, 0],
        maxMoves: 6,
        description: "Create a superposition on Q0 while leaving Q1 in state |0⟩. Only |00⟩ and |10⟩ should have probability, each at 50%.",
        hint: "A single Hadamard on Q0 is the key.",
        learningPoints: "Hadamard on Q0 in a 2-qubit system leaves Q1 unchanged.",
        guidance: "",
    },
    {
        name: "Quantum XOR Puzzle",
        difficulty: DIFFICULTY.EXPERT,
        tier: TIER.TIER_3,
        lessonId: 7,
        targetVector: [ONE_OVER_SQRT2, ONE_OVER_SQRT2, ONE_OVER_SQRT2, -ONE_OVER_SQRT2],
        maxMoves: 7,
        description: "Create a complex state with interference: |00> + |01> + |10> - |11>. This demonstrates quantum interference!",
        hint: "Start with H on both, then use X gates strategically.",
        learningPoints: "Understand quantum interference and relative phases.",
        guidance: "",
    },
    {
        name: "Master Quantum Designer",
        difficulty: DIFFICULTY.EXPERT,
        tier: TIER.TIER_3,
        lessonId: 4,
        targetVector: [ONE_OVER_SQRT2, 0, 0, ONE_OVER_SQRT2],
        maxMoves: 8,
        description: "Return to the Bell State, but with only 8 moves. By now you know all the gates - prove you're a quantum master!",
        hint: "Think of the most efficient path to entanglement.",
        learningPoints: "Optimize quantum circuits for minimum gate count.",
        guidance: "",
    },
];

export { TIER };
