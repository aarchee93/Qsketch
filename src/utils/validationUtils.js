/**
 * Validation utilities for quantum state vectors and user inputs
 */

const TOLERANCE = 1e-9;
const MAX_VALUE = 1e10;

/**
 * Check if a number is valid (not NaN, not Infinity, within reasonable bounds)
 * @param {number} value - Value to validate
 * @returns {boolean}
 */
export const isValidNumber = (value) => {
  return (
    typeof value === 'number' &&
    !isNaN(value) &&
    !isNaN(parseFloat(value)) &&
    isFinite(value) &&
    Math.abs(value) < MAX_VALUE
  );
};

/**
 * Validate and normalize a quantum state vector
 * @param {number[]} stateVector - State vector to validate
 * @returns {{valid: boolean, normalized: number[], error: string|null}}
 */
export const validateStateVector = (stateVector) => {
  // Check if it's an array
  if (!Array.isArray(stateVector)) {
    return {
      valid: false,
      normalized: null,
      error: 'State vector must be an array',
    };
  }

  // Check length for 2-qubit system
  if (stateVector.length !== 4) {
    return {
      valid: false,
      normalized: null,
      error: `State vector must have 4 elements for 2-qubit system, got ${stateVector.length}`,
    };
  }

  // Check all elements are valid numbers
  for (let i = 0; i < stateVector.length; i++) {
    if (!isValidNumber(stateVector[i])) {
      return {
        valid: false,
        normalized: null,
        error: `Invalid number at index ${i}: ${stateVector[i]}`,
      };
    }
  }

  // Calculate norm (should be close to 1)
  const norm = Math.sqrt(
    stateVector.reduce((sum, val) => sum + val * val, 0)
  );

  if (norm < TOLERANCE) {
    return {
      valid: false,
      normalized: null,
      error: 'State vector norm is zero',
    };
  }

  // Normalize the state vector
  const normalized = stateVector.map(val => val / norm);

  return {
    valid: true,
    normalized,
    error: null,
  };
};

/**
 * Validate a 4x4 matrix (for quantum gates)
 * @param {number[][]} matrix - Matrix to validate
 * @returns {{valid: boolean, error: string|null}}
 */
export const validateMatrix = (matrix) => {
  if (!Array.isArray(matrix) || matrix.length !== 4) {
    return { valid: false, error: 'Matrix must be a 4x4 array' };
  }

  for (let i = 0; i < 4; i++) {
    if (!Array.isArray(matrix[i]) || matrix[i].length !== 4) {
      return { valid: false, error: `Row ${i} is not an array of length 4` };
    }

    for (let j = 0; j < 4; j++) {
      if (!isValidNumber(matrix[i][j])) {
        return {
          valid: false,
          error: `Invalid number at [${i}][${j}]: ${matrix[i][j]}`,
        };
      }
    }
  }

  return { valid: true, error: null };
};

/**
 * Validate user input string (prevent injection, excessive length)
 * @param {string} input - Input string
 * @param {number} maxLength - Maximum allowed length
 * @returns {{valid: boolean, error: string|null, cleaned: string}}
 */
export const validateStringInput = (input, maxLength = 1000) => {
  if (typeof input !== 'string') {
    return {
      valid: false,
      error: 'Input must be a string',
      cleaned: '',
    };
  }

  const cleaned = input.trim();

  if (cleaned.length === 0) {
    return {
      valid: false,
      error: 'Input cannot be empty',
      cleaned: '',
    };
  }

  if (cleaned.length > maxLength) {
    return {
      valid: false,
      error: `Input exceeds maximum length of ${maxLength} characters`,
      cleaned: cleaned.substring(0, maxLength),
    };
  }

  // Remove potentially harmful characters
  const sanitized = cleaned
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '');

  return {
    valid: true,
    error: null,
    cleaned: sanitized,
  };
};

/**
 * Normalize floating-point numbers to prevent precision issues
 * @param {number} value - Value to normalize
 * @param {number} decimals - Number of decimal places
 * @returns {number}
 */
export const normalizeNumber = (value, decimals = 10) => {
  if (!isValidNumber(value)) return 0;
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Normalize all values in an array
 * @param {number[]} array - Array to normalize
 * @param {number} decimals - Number of decimal places
 * @returns {number[]}
 */
export const normalizeArray = (array, decimals = 10) => {
  if (!Array.isArray(array)) return [];
  return array.map(val => normalizeNumber(val, decimals));
};
