import { useEffect, useRef, useState } from 'react';
import { CONSOLE_LINES, collapsedOutcomeLine, pickVariant } from '../constants/labFlavorText';

const MAX_ENTRIES = 40;

/**
 * Derives a live "lab console" ticker purely from state that already exists
 * (circuit array + measurementOutcome). Nothing here is persisted — it's an
 * in-memory feed that starts fresh every time the component mounts.
 */
export const useLabConsole = (circuit, measurementOutcome) => {
  const [entries, setEntries] = useState(() => [
    { id: 'boot', text: pickVariant(CONSOLE_LINES.BOOT, Date.now()) },
  ]);
  const seedRef = useRef(0);
  const prevCircuitLenRef = useRef(circuit.length);
  const prevMeasurementRef = useRef(measurementOutcome);
  const prevLastGateRef = useRef(circuit[circuit.length - 1]);

  const push = (text) => {
    seedRef.current += 1;
    setEntries((prev) => {
      const next = [...prev, { id: `${Date.now()}-${seedRef.current}`, text }];
      return next.length > MAX_ENTRIES ? next.slice(next.length - MAX_ENTRIES) : next;
    });
  };

  useEffect(() => {
    const prevLen = prevCircuitLenRef.current;
    const prevLastGate = prevLastGateRef.current;
    const currLen = circuit.length;
    const currLastGate = circuit[circuit.length - 1];

    if (currLen > prevLen) {
      const variants = CONSOLE_LINES[currLastGate] || [`${currLastGate} applied`];
      push(pickVariant(variants, seedRef.current + currLen));
    } else if (currLen === 0 && prevLen > 0) {
      push(pickVariant(CONSOLE_LINES.RESET, seedRef.current));
    } else if (currLen < prevLen) {
      push(pickVariant(CONSOLE_LINES.UNDO, seedRef.current));
    }

    prevCircuitLenRef.current = currLen;
    prevLastGateRef.current = currLastGate;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circuit.length, circuit[circuit.length - 1]]);

  useEffect(() => {
    const prevOutcome = prevMeasurementRef.current;
    if (measurementOutcome && measurementOutcome !== prevOutcome) {
      push(pickVariant(collapsedOutcomeLine(measurementOutcome), seedRef.current));
    }
    prevMeasurementRef.current = measurementOutcome;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measurementOutcome]);

  return entries;
};
