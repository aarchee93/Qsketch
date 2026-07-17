// Renders the applied gates as an actual circuit diagram (two wires + gate
// boxes), rather than just a row of text pills. CNOT is drawn as a control
// dot connected by a vertical line to a target on the other wire, matching
// standard circuit notation.

const GATE_STEP = 70;
const START_X = 90;
const WIRE_Q0_Y = 40;
const WIRE_Q1_Y = 110;
const BOX_SIZE = 36;

const GateBox = ({ x, y, label, ariaLabel }) => (
  <g role="img" aria-label={ariaLabel}>
    <rect
      x={x - BOX_SIZE / 2}
      y={y - BOX_SIZE / 2}
      width={BOX_SIZE}
      height={BOX_SIZE}
      fill="white"
      stroke="black"
      strokeWidth="2"
      rx="4"
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

const CnotGate = ({ x, controlY, targetY, ariaLabel }) => (
  <g role="img" aria-label={ariaLabel}>
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

const CircuitDiagram = ({ circuit, title = 'Circuit Diagram' }) => {
  const width = START_X + Math.max(circuit.length, 1) * GATE_STEP + 30;
  const height = 150;

  return (
    <div className="mt-6 p-4 border-2 border-black bg-white rounded-lg shadow-inner overflow-x-auto">
      <h3 className="text-xl font-extrabold mb-3">{title}</h3>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label={
          circuit.length === 0
            ? 'Empty circuit diagram, two wires labeled Q0 and Q1, no gates applied yet'
            : `Circuit diagram: ${circuit.map(gateAriaLabel).join(', then ')}`
        }
        className="min-w-[320px]"
      >
        {/* Wires */}
        <line x1={30} y1={WIRE_Q0_Y} x2={width - 20} y2={WIRE_Q0_Y} stroke="black" strokeWidth="2" />
        <line x1={30} y1={WIRE_Q1_Y} x2={width - 20} y2={WIRE_Q1_Y} stroke="black" strokeWidth="2" />

        {/* Wire labels */}
        <text x={10} y={WIRE_Q0_Y + 5} fontSize="14" fontWeight="bold" fontFamily="monospace">Q0</text>
        <text x={10} y={WIRE_Q1_Y + 5} fontSize="14" fontWeight="bold" fontFamily="monospace">Q1</text>

        {circuit.length === 0 && (
          <text x={START_X} y={(WIRE_Q0_Y + WIRE_Q1_Y) / 2 + 5} fontSize="13" fontStyle="italic" fill="#666">
            no gates yet — apply one to see it appear here
          </text>
        )}

        {circuit.map((gateName, index) => {
          const x = START_X + index * GATE_STEP;
          switch (gateName) {
            case 'H0':
              return <GateBox key={index} x={x} y={WIRE_Q0_Y} label="H" ariaLabel={gateAriaLabel(gateName)} />;
            case 'H1':
              return <GateBox key={index} x={x} y={WIRE_Q1_Y} label="H" ariaLabel={gateAriaLabel(gateName)} />;
            case 'X0':
              return <GateBox key={index} x={x} y={WIRE_Q0_Y} label="X" ariaLabel={gateAriaLabel(gateName)} />;
            case 'X1':
              return <GateBox key={index} x={x} y={WIRE_Q1_Y} label="X" ariaLabel={gateAriaLabel(gateName)} />;
            case 'CNOT':
              return (
                <CnotGate
                  key={index}
                  x={x}
                  controlY={WIRE_Q0_Y}
                  targetY={WIRE_Q1_Y}
                  ariaLabel={gateAriaLabel(gateName)}
                />
              );
            default:
              return <GateBox key={index} x={x} y={WIRE_Q0_Y} label="?" ariaLabel={gateName} />;
          }
        })}
      </svg>
    </div>
  );
};

export default CircuitDiagram;
