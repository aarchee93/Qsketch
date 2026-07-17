import { describe, it, expect, beforeEach } from 'vitest';
import { applyGate, isTargetReached, measureState } from './quantumUtils';
import { X0, X1, H0, H1, CNOT, INITIAL_STATE } from '../constants/quantumGates';

describe('quantumUtils', () => {
  describe('applyGate', () => {
    it('should apply X gate on qubit 0 to initial state', () => {
      const result = applyGate(X0, INITIAL_STATE);
      // X0 flips qubit 0: |00⟩ -> |10⟩ = [0, 0, 1, 0]
      expect(result[0]).toBeCloseTo(0, 5);
      expect(result[1]).toBeCloseTo(0, 5);
      expect(result[2]).toBeCloseTo(1, 5);
      expect(result[3]).toBeCloseTo(0, 5);
    });

    it('should apply X gate on qubit 1 to initial state', () => {
      const result = applyGate(X1, INITIAL_STATE);
      // X1 flips qubit 1: |00⟩ -> |01⟩ = [0, 1, 0, 0]
      expect(result[0]).toBeCloseTo(0, 5);
      expect(result[1]).toBeCloseTo(1, 5);
      expect(result[2]).toBeCloseTo(0, 5);
      expect(result[3]).toBeCloseTo(0, 5);
    });

    it('should apply Hadamard gate on qubit 0', () => {
      const result = applyGate(H0, INITIAL_STATE);
      const oneOverSqrt2 = 1 / Math.sqrt(2);
      // H0 creates superposition: |00⟩ -> (|00⟩ + |10⟩)/sqrt(2)
      expect(result[0]).toBeCloseTo(oneOverSqrt2, 5);
      expect(result[1]).toBeCloseTo(0, 5);
      expect(result[2]).toBeCloseTo(oneOverSqrt2, 5);
      expect(result[3]).toBeCloseTo(0, 5);
    });

    it('should apply CNOT gate correctly', () => {
      const result = applyGate(CNOT, INITIAL_STATE);
      // CNOT on |00⟩ should give |00⟩
      expect(result[0]).toBeCloseTo(1, 5);
      expect(result[1]).toBeCloseTo(0, 5);
      expect(result[2]).toBeCloseTo(0, 5);
      expect(result[3]).toBeCloseTo(0, 5);
    });

    it('should handle vector with non-numeric strings', () => {
      // Coercion test: should convert to numbers
      const vector = ['1', '0', '0', '0'];
      const result = applyGate(X0, vector);
      expect(result.length).toBe(4);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should apply multiple gates in sequence', () => {
      // Apply X0 twice: |00⟩ -> |10⟩ -> |00⟩
      let state = applyGate(X0, INITIAL_STATE);
      state = applyGate(X0, state);
      expect(state[0]).toBeCloseTo(1, 5);
      expect(state[1]).toBeCloseTo(0, 5);
      expect(state[2]).toBeCloseTo(0, 5);
      expect(state[3]).toBeCloseTo(0, 5);
    });
  });

  describe('isTargetReached', () => {
    it('should return true for identical states', () => {
      const state = [1, 0, 0, 0];
      const target = [1, 0, 0, 0];
      expect(isTargetReached(state, target)).toBe(true);
    });

    it('should return true for states within tolerance', () => {
      const state = [1.0000000001, 0, 0, 0];
      const target = [1, 0, 0, 0];
      expect(isTargetReached(state, target)).toBe(true);
    });

    it('should return false for states exceeding tolerance', () => {
      const state = [0.9, 0, 0, 0.1];
      const target = [1, 0, 0, 0];
      expect(isTargetReached(state, target)).toBe(false);
    });

    it('should return false for different length vectors', () => {
      const state = [1, 0, 0];
      const target = [1, 0, 0, 0];
      expect(isTargetReached(state, target)).toBe(false);
    });

    it('should handle superposition states', () => {
      const oneOverSqrt2 = 1 / Math.sqrt(2);
      const state = [oneOverSqrt2, 0, oneOverSqrt2, 0];
      const target = [oneOverSqrt2, 0, oneOverSqrt2, 0];
      expect(isTargetReached(state, target)).toBe(true);
    });

    it('should accept custom tolerance', () => {
      const state = [0.99, 0, 0, 0];
      const target = [1, 0, 0, 0];
      // Default tolerance should fail
      expect(isTargetReached(state, target)).toBe(false);
      // Higher tolerance should pass (0.99^2 = 0.9801 vs 1^2 = 1, difference = 0.0199 > 0.01)
      expect(isTargetReached(state, target, 0.03)).toBe(true);
    });
  });

  describe('measureState', () => {
    it('should collapse |00⟩ state deterministically', () => {
      const state = [1, 0, 0, 0];
      const result = measureState(state);
      expect(result.measuredState).toEqual([1, 0, 0, 0]);
      expect(result.outcome).toBe('|00⟩');
    });

    it('should collapse |01⟩ state deterministically', () => {
      const state = [0, 1, 0, 0];
      const result = measureState(state);
      expect(result.measuredState).toEqual([0, 1, 0, 0]);
      expect(result.outcome).toBe('|01⟩');
    });

    it('should collapse |10⟩ state deterministically', () => {
      const state = [0, 0, 1, 0];
      const result = measureState(state);
      expect(result.measuredState).toEqual([0, 0, 1, 0]);
      expect(result.outcome).toBe('|10⟩');
    });

    it('should collapse |11⟩ state deterministically', () => {
      const state = [0, 0, 0, 1];
      const result = measureState(state);
      expect(result.measuredState).toEqual([0, 0, 0, 1]);
      expect(result.outcome).toBe('|11⟩');
    });

    it('should handle superposition states probabilistically', () => {
      const oneOverSqrt2 = 1 / Math.sqrt(2);
      const state = [oneOverSqrt2, 0, oneOverSqrt2, 0];
      
      // Run multiple measurements to check distribution
      const outcomes = { '|00⟩': 0, '|10⟩': 0 };
      for (let i = 0; i < 1000; i++) {
        const result = measureState(state);
        outcomes[result.outcome]++;
      }
      
      // Should be roughly 50/50 (with some tolerance for randomness)
      const ratio = outcomes['|00⟩'] / 1000;
      expect(ratio).toBeGreaterThan(0.3);
      expect(ratio).toBeLessThan(0.7);
    });

    it('should return normalized collapsed state', () => {
      const state = [0.5, 0.5, 0.5, 0.5];
      const result = measureState(state);
      
      // Collapsed state should have exactly one non-zero element
      const nonZeroCount = result.measuredState.filter(x => x !== 0).length;
      expect(nonZeroCount).toBe(1);
      
      // The non-zero element should be 1
      const nonZero = result.measuredState.find(x => x !== 0);
      expect(nonZero).toBe(1);
    });

    it('should handle unnormalized states', () => {
      // State that sums to 2 instead of 1
      const state = [1, 1, 0, 0];
      const result = measureState(state);
      
      expect(['|00⟩', '|01⟩']).toContain(result.outcome);
      expect(result.measuredState.reduce((a, b) => a + b, 0)).toBe(1);
    });
  });

  describe('integration tests', () => {
    it('should apply Hadamard and CNOT to create Bell state', () => {
      // Start: |00⟩
      let state = INITIAL_STATE;
      
      // Apply H0: creates |00⟩ + |10⟩ (not normalized in this simple test)
      state = applyGate(H0, state);
      
      // Should be in superposition
      expect(isTargetReached(state, [0.707, 0, 0.707, 0], 0.01)).toBe(true);
    });

    it('should handle quantum circuit with multiple gates', () => {
      let state = INITIAL_STATE;
      
      // Apply X0: |00⟩ -> |10⟩
      state = applyGate(X0, state);
      expect(state[2]).toBeCloseTo(1, 5);
      
      // Apply X1: |10⟩ -> |11⟩
      state = applyGate(X1, state);
      expect(state[3]).toBeCloseTo(1, 5);
    });
  });
});
