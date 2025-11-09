// Linear Algebra Core & Gates

// Initial state: |00> (100% probability of 00)
export const INITIAL_STATE = [1, 0, 0, 0];

export const ONE_OVER_SQRT2 = 1 / Math.sqrt(2);

// Pauli-X (NOT) Gate on Qubit 0 (X ⊗ I)
export const X0 = [
  [0, 0, 1, 0],
  [0, 0, 0, 1],
  [1, 0, 0, 0],
  [0, 1, 0, 0]
];

// Pauli-X (NOT) Gate on Qubit 1 (I ⊗ X)
export const X1 = [
  [0, 1, 0, 0],
  [1, 0, 0, 0],
  [0, 0, 0, 1],
  [0, 0, 1, 0]
];

// Hadamard Gate on Qubit 0 (H ⊗ I)
export const H0 = [
  [ONE_OVER_SQRT2, 0, ONE_OVER_SQRT2, 0],
  [0, ONE_OVER_SQRT2, 0, ONE_OVER_SQRT2],
  [ONE_OVER_SQRT2, 0, -ONE_OVER_SQRT2, 0],
  [0, ONE_OVER_SQRT2, 0, -ONE_OVER_SQRT2]
];

// Hadamard Gate on Qubit 1 (I ⊗ H)
export const H1 = [
  [ONE_OVER_SQRT2, ONE_OVER_SQRT2, 0, 0],
  [ONE_OVER_SQRT2, -ONE_OVER_SQRT2, 0, 0],
  [0, 0, ONE_OVER_SQRT2, ONE_OVER_SQRT2],
  [0, 0, ONE_OVER_SQRT2, -ONE_OVER_SQRT2]
];

// CNOT Gate (Control Qubit 0, Target Qubit 1)
export const CNOT = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 0, 1],
  [0, 0, 1, 0]
];

