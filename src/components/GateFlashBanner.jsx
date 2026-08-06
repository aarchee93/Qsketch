import { useEffect, useRef, useState } from 'react';

/**
 * GateFlashBanner
 *
 * Shows a single plain-English sentence immediately above the probability
 * chart each time a gate commits or a measurement occurs. The sentence fades
 * in on change and fades out after a short pause, leaving no persistent
 * clutter. During a pending animation it shows the "in-progress" copy.
 *
 * Props
 * ─────
 * lastAction   {string}        'START' | 'H0' | 'X0' | 'CNOT' | 'MEASURE' | …
 * circuit      {string[]}      committed gate list — used to provide context
 * stateVector  {number[]}      for plain-language state description
 * measurementOutcome {string|null}
 * pendingGate  {string|null}   gate mid-animation
 * isMeasuring  {boolean}
 */

// Plain-language gate event sentences.
// Keyed by action name; each value is a function(circuit) → string so the
// copy can reference circuit context when helpful.
const FLASH_COPY = {
  START: () => 'Both qubits reset to |00⟩ — ready for a new experiment.',
  H0:  (c) => c.length === 1
    ? 'Q0 is now in superposition — it has a 50% chance of measuring |0⟩ or |1⟩.'
    : 'Hadamard applied to Q0 — superposition engaged.',
  H1:  (c) => c.length === 1
    ? 'Q1 is now in superposition — 50% chance each way.'
    : 'Hadamard applied to Q1.',
  X0:  () => 'Q0 flipped — this is the quantum equivalent of a classical NOT.',
  X1:  () => 'Q1 flipped — classical NOT on the second qubit.',
  CNOT: (c) => {
    const hasH = c.includes('H0') || c.includes('H1');
    return hasH
      ? 'The qubits are now entangled — measuring one instantly determines the other.'
      : 'CNOT applied — Q1 flipped because Q0 was |1⟩.';
  },
  MEASURE: () => 'The superposition collapsed into a single classical outcome.',
};

// In-progress copy while the gate animation is playing.
const PENDING_COPY = {
  H0:     'Applying Hadamard to Q0…',
  H1:     'Applying Hadamard to Q1…',
  X0:     'Flipping Q0…',
  X1:     'Flipping Q1…',
  CNOT:   'Applying CNOT…',
  MEASURE:'Collapsing the wavefunction…',
};

const DISPLAY_MS = 4500; // how long the flash stays visible after settling

const GateFlashBanner = ({
  lastAction,
  circuit,
  measurementOutcome,
  pendingGate,
  isMeasuring,
}) => {
  const [visible, setVisible]     = useState(false);
  const [text, setText]           = useState('');
  const [isPending, setIsPending] = useState(false);
  const hideTimer   = useRef(null);
  const prevAction  = useRef(lastAction);

  /* Show banner while gate animation is playing */
  useEffect(() => {
    const key = isMeasuring ? 'MEASURE' : pendingGate;
    if (key && PENDING_COPY[key]) {
      clearTimeout(hideTimer.current);
      setText(PENDING_COPY[key]);
      setIsPending(true);
      setVisible(true);
    } else if (!key) {
      setIsPending(false);
    }
  }, [pendingGate, isMeasuring]);

  /* Show settled copy once the action commits */
  useEffect(() => {
    if (lastAction === prevAction.current && lastAction !== 'START') return;
    prevAction.current = lastAction;

    const copyFn = FLASH_COPY[lastAction];
    if (!copyFn) return;

    clearTimeout(hideTimer.current);
    setText(copyFn(circuit));
    setIsPending(false);
    setVisible(true);

    hideTimer.current = setTimeout(() => setVisible(false), DISPLAY_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastAction]);

  /* Cleanup */
  useEffect(() => () => clearTimeout(hideTimer.current), []);

  if (!visible || !text) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`
        flex items-start gap-2 px-4 py-3 mb-3
        border-2 border-black rounded-lg bg-white
        shadow-[3px_3px_0_0_#000]
        animate-bounce-up
      `}
    >
      {/* Small sketch-style pulse dot — conveys "just happened" */}
      <span
        aria-hidden="true"
        className={`
          mt-0.5 shrink-0 w-2.5 h-2.5 rounded-full border-2 border-black
          ${isPending ? 'animate-pulse bg-white' : 'bg-black'}
        `}
      />
      <p className={`text-sm font-bold leading-snug ${isPending ? 'text-black/60 italic' : 'text-black'}`}>
        {text}
      </p>
    </div>
  );
};

export default GateFlashBanner;
