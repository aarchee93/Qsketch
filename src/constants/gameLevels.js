import { INITIAL_STATE, ONE_OVER_SQRT2 } from './quantumGates';

// Difficulty levels
const DIFFICULTY = {
  BEGINNER: 'beginner',
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert',
};

// Level Definitions for the Game (11 Levels with Progressive Difficulty)
export const LEVELS = [
    // ========== BEGINNER (Levels 1-2) ==========
    // Level 1: Classical NOT on Qubit 0 (Target |10>)
    {
        name: "Classical Flip",
        difficulty: DIFFICULTY.BEGINNER,
        targetVector: [0, 0, 1, 0], 
        maxMoves: 3,
        description: "Your goal is to flip the first qubit (Q0) from |0> to |1>. Find the single gate that accomplishes this, using 3 moves or less.",
        hint: "Look for the 'X' gate - it's the quantum NOT gate!",
        learningPoints: "Introduces the Pauli-X gate for bit flipping.",
    },
    // Level 2: Flip Qubit 1
    {
        name: "Second Qubit Flip",
        difficulty: DIFFICULTY.BEGINNER,
        targetVector: [0, 1, 0, 0], 
        maxMoves: 3,
        description: "Now flip the second qubit (Q1) from |0> to |1>. You'll need to apply the X gate to Q1 instead.",
        hint: "Use Pauli-X on Q1, not Q0!",
        learningPoints: "Learn how to apply gates to different qubits.",
    },

    // ========== EASY (Levels 3-4) ==========
    // Level 3: Superposition on Qubit 0
    {
        name: "First Superposition",
        difficulty: DIFFICULTY.EASY,
        targetVector: [ONE_OVER_SQRT2, 0, ONE_OVER_SQRT2, 0],
        maxMoves: 2,
        description: "Create an equal superposition state on Qubit 0. The probability of measuring |0> or |1> should be 50%.",
        hint: "Use the Hadamard (H) gate on Q0 to create superposition!",
        learningPoints: "Hadamard gate creates equal superposition.",
    },
    // Level 4: Superposition on Qubit 1
    {
        name: "Second Superposition",
        difficulty: DIFFICULTY.EASY,
        targetVector: [ONE_OVER_SQRT2, ONE_OVER_SQRT2, 0, 0],
        maxMoves: 2,
        description: "Create superposition on Qubit 1. Both qubits |0> and |1> should have 50% probability.",
        hint: "Apply Hadamard to Q1!",
        learningPoints: "Apply Hadamard to different qubits.",
    },

    // ========== MEDIUM (Levels 5-7) ==========
    // Level 5: Both Qubits in Superposition
    {
        name: "Double Superposition",
        difficulty: DIFFICULTY.MEDIUM,
        targetVector: [0.5, 0.5, 0.5, 0.5],
        maxMoves: 3,
        description: "Create superposition on BOTH qubits. All four outcomes |00>, |01>, |10>, |11> should have equal 25% probability each.",
        hint: "Apply Hadamard to Q0, then Hadamard to Q1!",
        learningPoints: "Multiple Hadamard gates create uniform superposition.",
    },
    // Level 6: Entangled Bell State
    {
        name: "Entangled Bell State",
        difficulty: DIFFICULTY.MEDIUM,
        targetVector: [ONE_OVER_SQRT2, 0, 0, ONE_OVER_SQRT2],
        maxMoves: 4,
        description: "Create the famous Bell State where the two qubits are perfectly correlated. Only the |00> and |11> outcomes should have probability.",
        hint: "Use H0 followed by CNOT to entangle!",
        learningPoints: "CNOT gate creates entanglement.",
    },
    // Level 7: Anti-Bell State
    {
        name: "The Anti-Bell State",
        difficulty: DIFFICULTY.MEDIUM,
        targetVector: [0, ONE_OVER_SQRT2, ONE_OVER_SQRT2, 0], 
        maxMoves: 5,
        description: "Create the Bell State where qubits are anti-correlated. If Q0 is |0>, Q1 must be |1>, and vice versa.",
        hint: "Start with X1, then H0, then CNOT!",
        learningPoints: "Combine gates to create different entangled states.",
    },

    // ========== HARD (Levels 8-9) ==========
    // Level 8: Superposition then Flip
    {
        name: "Flip After Superposition",
        difficulty: DIFFICULTY.HARD,
        targetVector: [0, 0, ONE_OVER_SQRT2, ONE_OVER_SQRT2],
        maxMoves: 5,
        description: "Create superposition on Q0, then flip Q1. The final state should only show |10> and |11> outcomes with 50% each.",
        hint: "H0, then X1!",
        learningPoints: "Combine superposition and bit-flip operations.",
    },
    // Level 9: Complex Entanglement
    {
        name: "Complex Entanglement",
        difficulty: DIFFICULTY.HARD,
        targetVector: [ONE_OVER_SQRT2, 0, ONE_OVER_SQRT2, 0],
        maxMoves: 6,
        description: "Create a state where measuring Q0 always gives the same result as measuring Q1. Q0 and Q1 are fully correlated!",
        hint: "H0 creates superposition, but you need to correlate both qubits. Try H0 → CNOT!",
        learningPoints: "Design quantum circuits for specific correlation patterns.",
    },

    // ========== EXPERT (Levels 10-11) ==========
    // Level 10: Quantum XOR Pattern
    {
        name: "Quantum XOR Puzzle",
        difficulty: DIFFICULTY.EXPERT,
        targetVector: [ONE_OVER_SQRT2, ONE_OVER_SQRT2, ONE_OVER_SQRT2, -ONE_OVER_SQRT2],
        maxMoves: 7,
        description: "Create a complex state with interference: |00> + |01> + |10> - |11>. This demonstrates quantum interference!",
        hint: "Start with H on both, then use X gates strategically.",
        learningPoints: "Understand quantum interference and relative phases.",
    },
    // Level 11: Master Challenge - Create Any State
    {
        name: "Master Quantum Designer",
        difficulty: DIFFICULTY.EXPERT,
        targetVector: [ONE_OVER_SQRT2, 0, 0, ONE_OVER_SQRT2],
        maxMoves: 8,
        description: "Return to the Bell State, but with only 8 moves. By now you know all the gates - prove you're a quantum master!",
        hint: "Think of the most efficient path to entanglement.",
        learningPoints: "Optimize quantum circuits for minimum gate count.",
    },
];

