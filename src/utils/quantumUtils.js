// Matrix multiplication function (M * V)
export const applyGate = (matrix, vector) => {
  const result = new Array(vector.length).fill(0);
  const numericVector = vector.map(v => Number(v));

  for (let i = 0; i < matrix.length; i++) {
    let sum = 0;
    for (let j = 0; j < matrix[i].length; j++) {
      sum += matrix[i][j] * numericVector[j];
    }
    result[i] = sum;
  }
  return result;
};

// Check if two state vectors are "close enough" (handles floating point errors)
export const isTargetReached = (current, target, tolerance = 1e-9) => {
    if (current.length !== target.length) return false;
    for (let i = 0; i < current.length; i++) {
        // Compare the squared magnitude (probability) for safety
        const currentProb = Math.pow(current[i], 2);
        const targetProb = Math.pow(target[i], 2);
        if (Math.abs(currentProb - targetProb) > tolerance) {
            return false;
        }
    }
    return true;
};

/**
 * Simulates the act of measurement, collapsing the state vector 
 * into one classical basis state based on probabilities.
 * @param {number[]} stateVector - The 4-element amplitude vector.
 * @returns {{measuredState: number[], outcome: string}} - The collapsed state and the string representation.
 */
export const measureState = (stateVector) => {
    const probabilities = stateVector.map(amplitude => Math.pow(amplitude, 2));

    // Guard: degenerate all-zero or NaN state — fall back to |00⟩
    const sumProb = probabilities.reduce((sum, p) => sum + p, 0);
    if (!isFinite(sumProb) || sumProb < 1e-12) {
        return { measuredState: [1, 0, 0, 0], outcome: '|00⟩' };
    }

    const normalizedProbabilities = probabilities.map(p => p / sumProb);

    const basisStates = ['|00⟩', '|01⟩', '|10⟩', '|11⟩'];
    let randomValue = Math.random();
    let measuredIndex = -1;

    for (let i = 0; i < normalizedProbabilities.length; i++) {
        randomValue -= normalizedProbabilities[i];
        if (randomValue <= 0) {
            measuredIndex = i;
            break;
        }
    }

    if (measuredIndex === -1) {
        measuredIndex = normalizedProbabilities.length - 1;
    }

    const collapsedState = new Array(4).fill(0);
    collapsedState[measuredIndex] = 1;

    return {
        measuredState: collapsedState,
        outcome: basisStates[measuredIndex]
    };
};

