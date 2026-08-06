import { useState } from 'react';
import { H0 as H0_MATRIX, CNOT as CNOT_MATRIX } from '../constants/quantumGates';

// Renders the applied gates as an actual circuit diagram (two wires + gate
// boxes). CNOT is drawn as a control dot connected by a vertical line to a
// ⊕ target, matching standard notation.
//
// When the circuit is empty and no gate is pending, the diagram shows a
// Bell State worked example: a static H + CNOT sketch with annotation and
// clickable shortcut buttons so beginners have a concrete first goal.

const GATE_STEP = 70;
const START_X  = 90;
const WIRE_Q0_Y = 40;
const WIRE_Q1_Y = 110;
const BOX_SIZE  = 36;

/* ── Primitive gate renderers ─────────────────────────────────── */

const GateBox = ({ x, y, label, ariaLabel, ghost, faded }) => (
  <g
    role="img"
    aria-label={ariaLabel}
    className={ghost ? 'animate-gate-slide-in' : ''}
    opacity={ghost ? 0.55 : faded ? 0.28 : 1}
  >
    <rect
      x={x - BOX_SIZE / 2}
      y={y - BOX_SIZE / 2}
      width={BOX_SIZE}
      height={BOX_SIZE}
      fill="white"
      stroke="black"
      strokeWidth={faded ? 1.5 : 2}
      rx="4"
      strokeDasharray={ghost || faded ? '4 3' : undefined}
    />
    <text
      x={x}
      y={y + 6}
      textAnchor="middle"
      fontSize="16"
      fontWeight="bold"
      fontFamily="monospace"
      fill={faded ? '#888' : '#000'}
    >
      {label}
    </text>
  </g>
);

const CnotGate = ({ x, controlY, targetY, ariaLabel, ghost, faded }) => (
  <g
    role="img"
    aria-label={ariaLabel}
    className={ghost ? 'animate-gate-slide-in' : ''}
    opacity={ghost ? 0.55 : faded ? 0.28 : 1}
  >
    <line x1={x} y1={controlY} x2={x} y2={targetY} stroke={faded ? '#888' : 'black'} strokeWidth={faded ? 1.5 : 2} strokeDasharray={faded ? '4 3' : undefined} />
    <circle cx={x} cy={controlY} r="6" fill={faded ? '#ccc' : 'black'} />
    <circle cx={x} cy={targetY} r="14" fill="white" stroke={faded ? '#888' : 'black'} strokeWidth={faded ? 1.5 : 2} strokeDasharray={faded ? '4 3' : undefined} />
    <line x1={x} y1={targetY - 14} x2={x} y2={targetY + 14} stroke={faded ? '#888' : 'black'} strokeWidth={faded ? 1.5 : 2} />
    <line x1={x - 14} y1={targetY} x2={x + 14} y2={targetY} stroke={faded ? '#888' : 'black'} strokeWidth={faded ? 1.5 : 2} />
  </g>
);

/* ── Aria labels ──────────────────────────────────────────────── */

const gateAriaLabel = (gateName) => ({
  H0:   'Hadamard gate on Q0',
  H1:   'Hadamard gate on Q1',
  X0:   'Pauli-X gate on Q0',
  X1:   'Pauli-X gate on Q1',
  CNOT: 'Controlled-NOT gate, control Q0, target Q1',
})[gateName] ?? gateName;

const gateWires = (gateName) => {
  if (gateName === 'H0' || gateName === 'X0') return [WIRE_Q0_Y];
  if (gateName === 'H1' || gateName === 'X1') return [WIRE_Q1_Y];
  if (gateName === 'CNOT') return [WIRE_Q0_Y, WIRE_Q1_Y];
  return [];
};

const renderGateAt = (gateName, x, y0, y1, key, ghost = false, faded = false) => {
  switch (gateName) {
    case 'H0':   return <GateBox key={key} x={x} y={y0} label="H"  ariaLabel={gateAriaLabel(gateName)} ghost={ghost} faded={faded} />;
    case 'H1':   return <GateBox key={key} x={x} y={y1} label="H"  ariaLabel={gateAriaLabel(gateName)} ghost={ghost} faded={faded} />;
    case 'X0':   return <GateBox key={key} x={x} y={y0} label="X"  ariaLabel={gateAriaLabel(gateName)} ghost={ghost} faded={faded} />;
    case 'X1':   return <GateBox key={key} x={x} y={y1} label="X"  ariaLabel={gateAriaLabel(gateName)} ghost={ghost} faded={faded} />;
    case 'CNOT': return <CnotGate key={key} x={x} controlY={y0} targetY={y1} ariaLabel={gateAriaLabel(gateName)} ghost={ghost} faded={faded} />;
    default:     return <GateBox key={key} x={x} y={y0} label="?" ariaLabel={gateName} ghost={ghost} faded={faded} />;
  }
};

/* ── Bell State Worked Example ────────────────────────────────── */
// Shown only when circuit is empty and no gate is pending.
// Three clickable buttons (H → CNOT → Measure) let the user apply the
// Bell circuit sequence in one click each.

const BELL_SEQUENCE = [
  { label: 'H', gate: 'H0',   tip: 'Apply Hadamard to Q0 — creates superposition' },
  { label: '⊕', gate: 'CNOT', tip: 'Apply CNOT — entangles the two qubits' },
];

const BellStateExample = ({ onApplyGate, applyNewGate, handleMeasure, disabled }) => {
  const [hoveredGate, setHoveredGate] = useState(null);

  // Bell State example SVG: static faded H on Q0 wire + CNOT
  const exWidth  = START_X + 2 * GATE_STEP + 60;
  const exHeight = 150;

  return (
    <div className="mt-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-black/50 italic">
          Worked example — Bell Pair: <span className="font-mono">H(Q0) → CNOT</span>
        </p>
        <svg viewBox="0 0 40 8" width={40} height={8} aria-hidden="true" className="opacity-40">
          <line x1="0" y1="4" x2="30" y2="4" stroke="#000" strokeWidth="1.5" strokeDasharray="3 2" strokeLinecap="round" />
          <polyline points="25,1 33,4 25,7" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Static faded circuit illustration */}
      <svg
        viewBox={`0 0 ${exWidth} ${exHeight}`}
        width="100%"
        height={exHeight}
        aria-label="Bell Pair example: Hadamard on Q0, then CNOT"
        role="img"
        style={{ maxWidth: exWidth }}
      >
        {/* Wires */}
        <line x1={30} y1={WIRE_Q0_Y} x2={exWidth - 20} y2={WIRE_Q0_Y} stroke="#ccc" strokeWidth="2" />
        <line x1={30} y1={WIRE_Q1_Y} x2={exWidth - 20} y2={WIRE_Q1_Y} stroke="#ccc" strokeWidth="2" />
        {/* Labels */}
        <text x={10} y={WIRE_Q0_Y + 5} fontSize="14" fontWeight="bold" fontFamily="monospace" fill="#bbb">Q0</text>
        <text x={10} y={WIRE_Q1_Y + 5} fontSize="14" fontWeight="bold" fontFamily="monospace" fill="#bbb">Q1</text>

        {/* Example gates — faded */}
        {renderGateAt('H0',   START_X,             WIRE_Q0_Y, WIRE_Q1_Y, 'ex-h',    false, true)}
        {renderGateAt('CNOT', START_X + GATE_STEP, WIRE_Q0_Y, WIRE_Q1_Y, 'ex-cnot', false, true)}

        {/* Annotation arrows + labels */}
        {/* H annotation */}
        <line x1={START_X} y1={WIRE_Q0_Y - 24} x2={START_X} y2={WIRE_Q0_Y - 20} stroke="#bbb" strokeWidth="1.2" strokeLinecap="round" />
        <text x={START_X} y={WIRE_Q0_Y - 28} textAnchor="middle" fontSize="10" fill="#aaa" fontFamily="sans-serif">superposition</text>

        {/* CNOT annotation */}
        <line x1={START_X + GATE_STEP} y1={WIRE_Q1_Y + 22} x2={START_X + GATE_STEP} y2={WIRE_Q1_Y + 18} stroke="#bbb" strokeWidth="1.2" strokeLinecap="round" />
        <text x={START_X + GATE_STEP} y={WIRE_Q1_Y + 32} textAnchor="middle" fontSize="10" fill="#aaa" fontFamily="sans-serif">entanglement</text>

        {/* Result label */}
        <text x={START_X + 2 * GATE_STEP + 10} y={WIRE_Q0_Y - 4} fontSize="11" fill="#bbb" fontFamily="monospace">Bell</text>
        <text x={START_X + 2 * GATE_STEP + 10} y={WIRE_Q0_Y + 10} fontSize="11" fill="#bbb" fontFamily="monospace">Pair</text>
        <line x1={START_X + 2 * GATE_STEP} y1={WIRE_Q0_Y} x2={exWidth - 22} y2={WIRE_Q0_Y} stroke="#bbb" strokeWidth="1.5" strokeDasharray="3 2" />
      </svg>

      {/* Clickable shortcut buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t-2 border-dashed border-black/20">
        <span className="text-xs font-bold text-black/40 shrink-0">Try it:</span>
        {BELL_SEQUENCE.map(({ label, gate, tip }) => (
          <button
            key={gate}
            onClick={() => onApplyGate(gate)}
            disabled={disabled}
            title={tip}
            aria-label={tip}
            className="
              px-3 py-1 border-2 border-black rounded font-mono font-extrabold text-sm
              bg-white hover:bg-black hover:text-white
              disabled:opacity-30 disabled:cursor-not-allowed
              transition-colors duration-100
              shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
            "
          >
            {label}
          </button>
        ))}
        <span className="text-xs text-black/30 font-mono">→</span>
        <button
          onClick={handleMeasure}
          disabled={disabled}
          title="Measure — collapse the quantum state"
          aria-label="Measure — collapse the quantum state"
          className="
            px-3 py-1 border-2 border-black rounded font-mono font-extrabold text-sm
            bg-black text-white hover:bg-white hover:text-black
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-colors duration-100
            shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
          "
        >
          M
        </button>
      </div>
    </div>
  );
};

/* ── Main CircuitDiagram ──────────────────────────────────────── */

/**
 * Props
 * ─────
 * circuit      {string[]}   applied gate names
 * title        {string}     panel heading
 * pendingGate  {string|null} gate mid-animation (shows ghost + wire pulse)
 * applyNewGate {fn|null}    (gateName, matrix) => void  — for Bell shortcut
 * handleMeasure {fn|null}   () => void                  — for Measure shortcut
 * disabled     {boolean}    whether shortcuts are locked (isBusy/measured)
 */
const CircuitDiagram = ({
  circuit,
  title       = 'Circuit Diagram',
  pendingGate = null,
  applyNewGate,
  handleMeasure,
  disabled    = false,
}) => {
  const isEmpty  = circuit.length === 0 && !pendingGate;
  const totalSlots = circuit.length + (pendingGate ? 1 : 0);
  const width    = START_X + Math.max(totalSlots, 1) * GATE_STEP + 30;
  const height   = 150;
  const pendingX = START_X + circuit.length * GATE_STEP;

  const handleShortcut = (gateName) => {
    if (!applyNewGate) return;
    const matrices = { H0: H0_MATRIX, CNOT: CNOT_MATRIX };
    const matrix = matrices[gateName];
    if (matrix) applyNewGate(gateName, matrix);
  };

  return (
    <div className="mt-6 p-4 border-2 border-black bg-white rounded-lg shadow-inner overflow-x-auto">
      <h3 className="text-xl font-extrabold mb-3">{title}</h3>

      {isEmpty && applyNewGate ? (
        /* Empty state: show Bell State worked example */
        <BellStateExample
          onApplyGate={handleShortcut}
          handleMeasure={handleMeasure}
          disabled={disabled}
        />
      ) : (
        /* Active circuit */
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          role="img"
          aria-label={
            circuit.length === 0 && !pendingGate
              ? 'Empty circuit diagram, two wires labeled Q0 and Q1, no gates applied yet'
              : `Circuit diagram: ${circuit.map(gateAriaLabel).join(', then ')}`
          }
          className="min-w-[320px]"
        >
          {/* Wires */}
          <line x1={30} y1={WIRE_Q0_Y} x2={width - 20} y2={WIRE_Q0_Y} stroke="black" strokeWidth="2" />
          <line x1={30} y1={WIRE_Q1_Y} x2={width - 20} y2={WIRE_Q1_Y} stroke="black" strokeWidth="2" />

          {/* Wire pulse */}
          {pendingGate && gateWires(pendingGate).map((wireY) => (
            <line
              key={`pulse-${wireY}`}
              x1={30} y1={wireY} x2={pendingX} y2={wireY}
              stroke="black" strokeWidth="4"
              strokeDasharray="10 390"
              className="animate-wire-pulse"
            />
          ))}

          {/* Labels */}
          <text x={10} y={WIRE_Q0_Y + 5} fontSize="14" fontWeight="bold" fontFamily="monospace">Q0</text>
          <text x={10} y={WIRE_Q1_Y + 5} fontSize="14" fontWeight="bold" fontFamily="monospace">Q1</text>

          {circuit.map((gateName, index) =>
            renderGateAt(gateName, START_X + index * GATE_STEP, WIRE_Q0_Y, WIRE_Q1_Y, index)
          )}

          {pendingGate && renderGateAt(pendingGate, pendingX, WIRE_Q0_Y, WIRE_Q1_Y, 'pending', true)}
        </svg>
      )}
    </div>
  );
};

export default CircuitDiagram;
