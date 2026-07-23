// Renders the applied gates as an actual circuit diagram (two wires + gate
// boxes), rather than just a row of text pills. CNOT is drawn as a control
// dot connected by a vertical line to a target on the other wire, matching
// standard circuit notation.
//
// When `pendingGate` is set, a translucent "ghost" gate slides into the next
// slot and a pulse sweeps down the affected wire(s) before the real gate
// commits — see App.jsx's GATE_ANIMATION_MS sequencing.

const GATE_STEP = 70;
const START_X = 90;
const WIRE_Q0_Y = 40;
const WIRE_Q1_Y = 110;
const BOX_SIZE = 36;

const GateBox = ({ x, y, label, ariaLabel, ghost }) => (
  <g role="img" aria-label={ariaLabel} className={ghost ? 'animate-gate-slide-in' : ''} opacity={ghost ? 0.55 : 1}>
    <rect
      x={x - BOX_SIZE / 2}
      y={y - BOX_SIZE / 2}
      width={BOX_SIZE}
      height={BOX_SIZE}
      fill="white"
      stroke="black"
      strokeWidth="2"
      rx="4"
      strokeDasharray={ghost ? '4 3' : undefined}
    />
    <text
      x={x}
      y={y + 6}
      textAnchor="middle"
      fontSize="16"
      fontWeight="bold"
      fontFamily="monospace"
    >
      {label}
    </text>
  </g>
);

const CnotGate = ({ x, controlY, targetY, ariaLabel, ghost }) => (
  <g role="img" aria-label={ariaLabel} className={ghost ? 'animate-gate-slide-in' : ''} opacity={ghost ? 0.55 : 1}>
    <line x1={x} y1={controlY} x2={x} y2={targetY} stroke="black" strokeWidth="2" />
    {/* control dot */}
    <circle cx={x} cy={controlY} r="6" fill="black" />
    {/* target: circle with cross, standard CNOT notation */}
    <circle cx={x} cy={targetY} r="14" fill="white" stroke="black" strokeWidth="2" />
    <line x1={x} y1={targetY - 14} x2={x} y2={targetY + 14} stroke="black" strokeWidth="2" />
    <line x1={x - 14} y1={targetY} x2={x + 14} y2={targetY} stroke="black" strokeWidth="2" />
  </g>
);

const gateAriaLabel = (gateName) => {
  const labels = {
    H0: 'Hadamard gate on Q0',
    H1: 'Hadamard gate on Q1',
    X0: 'Pauli-X gate on Q0',
    X1: 'Pauli-X gate on Q1',
    CNOT: 'Controlled-NOT gate, control Q0, target Q1',
  };
  return labels[gateName] || gateName;
};

const gateWires = (gateName) => {
  if (gateName === 'H0' || gateName === 'X0') return [WIRE_Q0_Y];
  if (gateName === 'H1' || gateName === 'X1') return [WIRE_Q1_Y];
  if (gateName === 'CNOT') return [WIRE_Q0_Y, WIRE_Q1_Y];
  return [];
};

const renderGateAt = (gateName, x, y0, y1, key, ghost = false) => {
  switch (gateName) {
    case 'H0':
      return <GateBox key={key} x={x} y={y0} label="H" ariaLabel={gateAriaLabel(gateName)} ghost={ghost} />;
    case 'H1':
      return <GateBox key={key} x={x} y={y1} label="H" ariaLabel={gateAriaLabel(gateName)} ghost={ghost} />;
    case 'X0':
      return <GateBox key={key} x={x} y={y0} label="X" ariaLabel={gateAriaLabel(gateName)} ghost={ghost} />;
    case 'X1':
      return <GateBox key={key} x={x} y={y1} label="X" ariaLabel={gateAriaLabel(gateName)} ghost={ghost} />;
    case 'CNOT':
      return (
        <CnotGate key={key} x={x} controlY={y0} targetY={y1} ariaLabel={gateAriaLabel(gateName)} ghost={ghost} />
      );
    default:
      return <GateBox key={key} x={x} y={y0} label="?" ariaLabel={gateName} ghost={ghost} />;
  }
};

const CircuitDiagram = ({ circuit, title = 'Circuit Diagram', pendingGate = null }) => {
  const totalSlots = circuit.length + (pendingGate ? 1 : 0);
  const width = START_X + Math.max(totalSlots, 1) * GATE_STEP + 30;
  const height = 150;
  const pendingX = START_X + circuit.length * GATE_STEP;

  return (
    <div className="mt-6 p-4 border-2 border-black bg-white rounded-lg shadow-inner overflow-x-auto">
      <h3 className="text-xl font-extrabold mb-3">{title}</h3>
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

        {/* Wire pulse: sweeps toward the slot the pending gate is landing in */}
        {pendingGate && gateWires(pendingGate).map((wireY) => (
          <line
            key={`pulse-${wireY}`}
            x1={30}
            y1={wireY}
            x2={pendingX}
            y2={wireY}
            stroke="black"
            strokeWidth="4"
            strokeDasharray="10 390"
            className="animate-wire-pulse"
          />
        ))}

        {/* Wire labels */}
        <text x={10} y={WIRE_Q0_Y + 5} fontSize="14" fontWeight="bold" fontFamily="monospace">Q0</text>
        <text x={10} y={WIRE_Q1_Y + 5} fontSize="14" fontWeight="bold" fontFamily="monospace">Q1</text>

        {circuit.length === 0 && !pendingGate && (
          <text x={START_X} y={(WIRE_Q0_Y + WIRE_Q1_Y) / 2 + 5} fontSize="13" fontStyle="italic" fill="#666">
            no gates yet — apply one to see it appear here
          </text>
        )}

        {circuit.map((gateName, index) =>
          renderGateAt(gateName, START_X + index * GATE_STEP, WIRE_Q0_Y, WIRE_Q1_Y, index)
        )}

        {pendingGate && renderGateAt(pendingGate, pendingX, WIRE_Q0_Y, WIRE_Q1_Y, 'pending', true)}
      </svg>
    </div>
  );
};

export default CircuitDiagram;
