import { useEffect } from 'react';
import { H0, X0, CNOT } from '../constants/quantumGates';

/**
 * Power-user keyboard shortcuts for the simulator:
 *   H — Hadamard on Q0        X — Pauli-X on Q0
 *   C — CNOT (Q0 control, Q1 target)
 *   M — Measure               R — Reset
 * Ignored while typing in an input/textarea, and while disabled (e.g. mid
 * gate-animation) so a fast typist can't queue up conflicting actions.
 */
export const useKeyboardShortcuts = ({ applyNewGate, handleMeasure, handleReset, disabled }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (disabled) return;
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      switch (event.key.toLowerCase()) {
        case 'h':
          applyNewGate?.('H0', H0);
          break;
        case 'x':
          applyNewGate?.('X0', X0);
          break;
        case 'c':
          applyNewGate?.('CNOT', CNOT);
          break;
        case 'm':
          handleMeasure?.();
          break;
        case 'r':
          handleReset?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [applyNewGate, handleMeasure, handleReset, disabled]);
};
