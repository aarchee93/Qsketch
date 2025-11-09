import { INITIAL_STATE, ONE_OVER_SQRT2 } from './quantumGates';

// Level Definitions for the Game
export const LEVELS = [
    // Level 1: Classical NOT on Qubit 0 (Target |10>)
    {
        name: "Classical Flip",
        targetVector: [0, 0, 1, 0], 
        maxMoves: 3,
        description: "Your goal is to flip the first qubit (Q0) from |0> to |1>. Find the single gate that accomplishes this, using 3 moves or less.",
    },
    // Level 2: Superposition on Qubit 0 (Target Bell State |+> \otimes |0>)
    {
        name: "First Superposition",
        targetVector: [ONE_OVER_SQRT2, 0, ONE_OVER_SQRT2, 0],
        maxMoves: 2,
        description: "Create an equal superposition state on Qubit 0. The probability of measuring |0> or |1> should be 50%.",
    },
    // Level 3: Entanglement (Target Bell State |00> + |11>)
    {
        name: "Entangled Bell State",
        targetVector: [ONE_OVER_SQRT2, 0, 0, ONE_OVER_SQRT2],
        maxMoves: 4,
        description: "Create the famous Bell State where the two qubits are perfectly correlated. Only the |00> and |11> outcomes should have probability.",
    },
    // Level 4: The Anti-Bell State (Target Bell State |01> + |10>)
    {
        name: "The Anti-Bell State",
        // Target state: |Φ-> = (1/√2)(|01> + |10>) 
        // Corresponds to state vector: [0, 1/√2, 1/√2, 0]
        targetVector: [0, ONE_OVER_SQRT2, ONE_OVER_SQRT2, 0], 
        maxMoves: 5,
        description: "Create the Bell State where the qubits are anti-correlated. If Qubit 0 is |0>, Qubit 1 must be |1>, and vice versa. Hint: You will need to use a new gate!",
        // Solution: X1, H0, CNOT 
    },
];

