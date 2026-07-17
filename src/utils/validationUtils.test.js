import { describe, it, expect } from 'vitest';
import {
  isValidNumber,
  validateStateVector,
  validateMatrix,
  validateStringInput,
  normalizeNumber,
  normalizeArray,
} from './validationUtils';

describe('validationUtils', () => {
  describe('isValidNumber', () => {
    it('should return true for valid positive numbers', () => {
      expect(isValidNumber(0)).toBe(true);
      expect(isValidNumber(1)).toBe(true);
      expect(isValidNumber(0.5)).toBe(true);
      expect(isValidNumber(3.14159)).toBe(true);
    });

    it('should return true for valid negative numbers', () => {
      expect(isValidNumber(-1)).toBe(true);
      expect(isValidNumber(-0.5)).toBe(true);
      expect(isValidNumber(-1000)).toBe(true);
    });

    it('should return false for NaN', () => {
      expect(isValidNumber(NaN)).toBe(false);
    });

    it('should return false for Infinity', () => {
      expect(isValidNumber(Infinity)).toBe(false);
      expect(isValidNumber(-Infinity)).toBe(false);
    });

    it('should return false for non-numbers', () => {
      expect(isValidNumber('1')).toBe(false);
      expect(isValidNumber(null)).toBe(false);
      expect(isValidNumber(undefined)).toBe(false);
      expect(isValidNumber({})).toBe(false);
    });

    it('should return false for values exceeding MAX_VALUE', () => {
      expect(isValidNumber(1e11)).toBe(false);
    });

    it('should handle values close to MAX_VALUE', () => {
      expect(isValidNumber(1e9)).toBe(true);
    });
  });

  describe('validateStateVector', () => {
    it('should validate correct state vector', () => {
      const state = [1, 0, 0, 0];
      const result = validateStateVector(state);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.normalized).toEqual([1, 0, 0, 0]);
    });

    it('should normalize non-normalized state vectors', () => {
      const state = [2, 0, 0, 0];
      const result = validateStateVector(state);
      expect(result.valid).toBe(true);
      expect(result.normalized[0]).toBeCloseTo(1, 5);
    });

    it('should reject non-array input', () => {
      const result = validateStateVector('not an array');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('array');
    });

    it('should reject vectors with wrong length', () => {
      const result1 = validateStateVector([1, 0, 0]);
      expect(result1.valid).toBe(false);
      expect(result1.error).toContain('4 elements');

      const result2 = validateStateVector([1, 0, 0, 0, 0]);
      expect(result2.valid).toBe(false);
    });

    it('should reject vectors with invalid numbers', () => {
      const result = validateStateVector([1, 0, NaN, 0]);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid number');
    });

    it('should reject zero vectors', () => {
      const result = validateStateVector([0, 0, 0, 0]);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('norm is zero');
    });

    it('should handle superposition states', () => {
      const oneOverSqrt2 = 1 / Math.sqrt(2);
      const state = [oneOverSqrt2, 0, oneOverSqrt2, 0];
      const result = validateStateVector(state);
      expect(result.valid).toBe(true);
      expect(result.normalized).toBeDefined();
    });

    it('should normalize to unit vector', () => {
      const state = [3, 4, 0, 0]; // norm = 5
      const result = validateStateVector(state);
      expect(result.valid).toBe(true);
      const norm = Math.sqrt(
        result.normalized.reduce((sum, val) => sum + val * val, 0)
      );
      expect(norm).toBeCloseTo(1, 5);
    });
  });

  describe('validateMatrix', () => {
    it('should validate correct 4x4 matrix', () => {
      const matrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ];
      const result = validateMatrix(matrix);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should reject non-array input', () => {
      const result = validateMatrix('not a matrix');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('4x4');
    });

    it('should reject matrices with wrong dimensions', () => {
      const result1 = validateMatrix([
        [1, 0],
        [0, 1],
      ]);
      expect(result1.valid).toBe(false);

      const result2 = validateMatrix([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        // missing row
      ]);
      expect(result2.valid).toBe(false);
    });

    it('should reject rows with wrong length', () => {
      const matrix = [
        [1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ];
      const result = validateMatrix(matrix);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('length 4');
    });

    it('should reject matrices with invalid numbers', () => {
      const matrix = [
        [1, 0, 0, 0],
        [0, 1, NaN, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ];
      const result = validateMatrix(matrix);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid number');
    });
  });

  describe('validateStringInput', () => {
    it('should validate clean strings', () => {
      const result = validateStringInput('Hello World');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.cleaned).toBe('Hello World');
    });

    it('should reject non-string input', () => {
      const result = validateStringInput(123);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('must be a string');
    });

    it('should reject empty strings', () => {
      const result = validateStringInput('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('cannot be empty');
    });

    it('should trim whitespace', () => {
      const result = validateStringInput('  Hello  ');
      expect(result.valid).toBe(true);
      expect(result.cleaned).toBe('Hello');
    });

    it('should reject strings exceeding max length', () => {
      const longString = 'a'.repeat(1001);
      const result = validateStringInput(longString);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum');
    });

    it('should accept custom max length', () => {
      const result = validateStringInput('Hello', 3);
      expect(result.valid).toBe(false);
    });

    it('should sanitize script tags', () => {
      const result = validateStringInput('<script>alert("xss")</script>Hello');
      expect(result.cleaned).not.toContain('<script>');
    });

    it('should sanitize event handlers', () => {
      const result = validateStringInput('Hello <img onclick="alert()" />');
      expect(result.cleaned).not.toContain('onclick');
    });
  });

  describe('normalizeNumber', () => {
    it('should round to specified decimals', () => {
      const result = normalizeNumber(0.123456789, 3);
      expect(result).toBe(0.123);
    });

    it('should default to 10 decimals', () => {
      const result = normalizeNumber(0.12345678901234);
      expect(result).toBeCloseTo(0.1234567890, 10);
    });

    it('should handle negative numbers', () => {
      const result = normalizeNumber(-3.14159, 2);
      expect(result).toBe(-3.14);
    });

    it('should return 0 for invalid numbers', () => {
      expect(normalizeNumber(NaN)).toBe(0);
      expect(normalizeNumber(Infinity)).toBe(0);
      expect(normalizeNumber('abc')).toBe(0);
    });

    it('should handle zero decimals', () => {
      const result = normalizeNumber(3.7, 0);
      expect(result).toBe(4);
    });
  });

  describe('normalizeArray', () => {
    it('should normalize all elements in array', () => {
      const array = [0.123456, 0.234567, 0.345678];
      const result = normalizeArray(array, 2);
      expect(result).toEqual([0.12, 0.23, 0.35]);
    });

    it('should return empty array for non-array input', () => {
      expect(normalizeArray('not an array')).toEqual([]);
      expect(normalizeArray(null)).toEqual([]);
    });

    it('should handle invalid numbers', () => {
      const array = [0.5, NaN, 1, Infinity];
      const result = normalizeArray(array, 2);
      expect(result[0]).toBeCloseTo(0.5, 2);
      expect(result[1]).toBe(0); // NaN converted to 0
      expect(result[2]).toBe(1);
      expect(result[3]).toBe(0); // Infinity converted to 0
    });

    it('should preserve array length', () => {
      const array = [1, 2, 3, 4, 5];
      const result = normalizeArray(array, 1);
      expect(result.length).toBe(5);
    });
  });

  describe('integration tests', () => {
    it('should validate and normalize a state vector with all helpers', () => {
      const state = [2, 0, 0, 0];
      const validation = validateStateVector(state);
      
      expect(validation.valid).toBe(true);
      const normalized = validation.normalized;
      
      // Check all elements are valid numbers
      normalized.forEach(val => {
        expect(isValidNumber(val)).toBe(true);
      });
      
      // Check norm
      const norm = Math.sqrt(
        normalized.reduce((sum, val) => sum + val * val, 0)
      );
      expect(norm).toBeCloseTo(1, 5);
    });

    it('should handle quantum state edge cases', () => {
      const states = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ];
      
      states.forEach(state => {
        const result = validateStateVector(state);
        expect(result.valid).toBe(true);
      });
    });
  });
});
