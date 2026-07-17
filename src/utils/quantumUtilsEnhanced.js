/**
 * Enhanced quantum utilities with error handling and validation
 */

import {
  validateStateVector,
  validateMatrix,
  normalizeNumber,
} from './validationUtils';

/**
 * Safe matrix multiplication with validation
 * @param {number[][]} matrix - 4x4 quantum gate matrix
 * @param {number[]} vector - 4-element state vector
 * @returns {{success: boolean, result: number[]|null, error: string|null}}
 */
export const safeApplyGate = (matrix, vector) => {
  try {
    // Validate inputs
    const matrixValidation = validateMatrix(matrix);
    if (!matrixValidation.valid) {
      return {
        success: false,
        result: null,
        error: `Invalid matrix: ${matrixValidation.error}`,
      };
    }

    const stateValidation = validateStateVector(vector);
    if (!stateValidation.valid) {
      return {
        success: false,
        result: null,
        error: `Invalid state vector: ${stateValidation.error}`,
      };
    }

    // Use normalized state for calculation
    const normalizedVector = stateValidation.normalized;

    // Perform matrix multiplication
    const result = new Array(4).fill(0);
    for (let i = 0; i < 4; i++) {
      let sum = 0;
      for (let j = 0; j < 4; j++) {
        sum += matrix[i][j] * normalizedVector[j];
      }
      result[i] = normalizeNumber(sum, 15);
    }

    // Validate result
    const resultValidation = validateStateVector(result);
    if (!resultValidation.valid) {
      return {
        success: false,
        result: null,
        error: `Gate application produced invalid state: ${resultValidation.error}`,
      };
    }

    return {
      success: true,
      result: resultValidation.normalized,
      error: null,
    };
  } catch (e) {
    console.error('Error applying gate:', e);
    return {
      success: false,
      result: null,
      error: `Unexpected error: ${e.message}`,
    };
  }
};

/**
 * Safe measurement with validation
 * @param {number[]} stateVector - State vector to measure
 * @returns {{success: boolean, measuredState: number[]|null, outcome: string|null, error: string|null}}
 */
export const safeMeasureState = (stateVector) => {
  try {
    // Validate state
    const validation = validateStateVector(stateVector);
    if (!validation.valid) {
      return {
        success: false,
        measuredState: null,
        outcome: null,
        error: `Invalid state vector: ${validation.error}`,
      };
    }

    const normalizedVector = validation.normalized;
    const basisStates = ['|00⟩', '|01⟩', '|10⟩', '|11⟩'];

    // Calculate probabilities
    const probabilities = normalizedVector.map((amplitude) =>
      normalizeNumber(Math.pow(amplitude, 2), 15)
    );

    // Ensure sum is 1 (handle floating point drift)
    const sumProb = probabilities.reduce((sum, p) => sum + p, 0);
    const normalizedProbabilities = probabilities.map((p) => p / sumProb);

    // Random selection based on probability
    let randomValue = Math.random();
    let measuredIndex = -1;

    for (let i = 0; i < normalizedProbabilities.length; i++) {
      randomValue -= normalizedProbabilities[i];
      if (randomValue <= 0) {
        measuredIndex = i;
        break;
      }
    }

    // Fallback (shouldn't happen, but safety net)
    if (measuredIndex === -1) {
      measuredIndex = normalizedProbabilities.length - 1;
    }

    // Create collapsed state
    const collapsedState = new Array(4).fill(0);
    collapsedState[measuredIndex] = 1;

    return {
      success: true,
      measuredState: collapsedState,
      outcome: basisStates[measuredIndex],
      error: null,
    };
  } catch (e) {
    console.error('Error measuring state:', e);
    return {
      success: false,
      measuredState: null,
      outcome: null,
      error: `Unexpected error: ${e.message}`,
    };
  }
};

/**
 * Safe target state check with tolerance
 * @param {number[]} current - Current state vector
 * @param {number[]} target - Target state vector
 * @param {number} tolerance - Tolerance for comparison
 * @returns {{reached: boolean, error: string|null}}
 */
export const safeIsTargetReached = (current, target, tolerance = 1e-9) => {
  try {
    const currentValidation = validateStateVector(current);
    const targetValidation = validateStateVector(target);

    if (!currentValidation.valid) {
      return {
        reached: false,
        error: `Invalid current state: ${currentValidation.error}`,
      };
    }

    if (!targetValidation.valid) {
      return {
        reached: false,
        error: `Invalid target state: ${targetValidation.error}`,
      };
    }

    // Compare probabilities
    const currentProbs = currentValidation.normalized.map((a) => a * a);
    const targetProbs = targetValidation.normalized.map((a) => a * a);

    for (let i = 0; i < currentProbs.length; i++) {
      if (Math.abs(currentProbs[i] - targetProbs[i]) > tolerance) {
        return {
          reached: false,
          error: null,
        };
      }
    }

    return {
      reached: true,
      error: null,
    };
  } catch (e) {
    console.error('Error checking target state:', e);
    return {
      reached: false,
      error: `Unexpected error: ${e.message}`,
    };
  }
};
