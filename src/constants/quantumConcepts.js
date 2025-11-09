// CMS/Local Storage Constants
export const STORAGE_KEY = 'qubitSketchpadConcepts';

/**
 * Initial documentation content structured as an array of objects.
 * This is the seed data loaded into localStorage the first time.
 */
export const QUANTUM_CONCEPTS = [
    {
        id: 'superposition',
        title: '1. Superposition (H Gate)',
        subTitle: 'Both |0⟩ and |1⟩ at once.',
        content: "A fundamental concept where a quantum object (qubit) exists in a combination of all its possible states simultaneously. The **Hadamard (H) gate** is used to create this equal superposition, giving a 50% chance of measuring |0⟩ and 50% chance of measuring |1⟩.",
        color: 'yellow-50',
    },
    {
        id: 'pauli_x',
        title: '2. The Pauli-X Gate (X)',
        subTitle: 'The Quantum NOT Gate.',
        content: "The Pauli-X gate performs the same function as a classical NOT gate, flipping the state of the qubit. **X** transforms |0⟩ to |1⟩ and |1⟩ to |0⟩. In a two-qubit system, X₀ is X ⊗ I and X₁ is I ⊗ X.",
        color: 'blue-50',
    },
    {
        id: 'multi_qubit_ops',
        title: '3. Multi-Qubit Operations (X₁ and H₁)',
        subTitle: 'Targeting specific qubits with the Identity gate.',
        content: "To perform operations on a specific qubit in a multi-qubit system, we use the **Tensor Product (⊗)** with the **Identity Gate (I)**. I acts as a placeholder, ensuring the other qubit's state is preserved while the target qubit is transformed. This allows independent control over Q₀ and Q₁.",
        color: 'purple-50',
    },
    {
        id: 'entanglement',
        title: '4. Entanglement (CNOT Gate)',
        subTitle: 'Correlation between two qubits.',
        content: "Entanglement is a deep, non-classical correlation between two or more qubits. Once two qubits are entangled, they share a single quantum state. The **CNOT (Controlled-NOT) gate** is essential for creating Bell States (e.g., |00⟩ + |11⟩), where only correlated outcomes are possible.",
        color: 'green-50',
    },
    {
        id: 'measurement',
        title: '5. Measurement and Collapse',
        subTitle: 'The transition to classical reality.',
        content: "Before measurement, a qubit is in superposition. **Measurement** is the act of reading the state, which forces the qubit to 'collapse' instantly into a single classical state (|0⟩ or |1⟩) based on its probability distribution. The simulator's visualization shows the probabilities *before* the collapse.",
        color: 'red-50',
    },
    {
        id: 'interference',
        title: '6. Quantum Interference',
        subTitle: 'Amplitudes reinforce or cancel.',
        content: "Interference occurs because probability amplitudes are complex numbers, allowing them to have phase. We design quantum circuits to cause **destructive interference** on wrong answers and **constructive interference** on the right answer, making quantum algorithms efficient.",
        color: 'orange-50',
    },
];

