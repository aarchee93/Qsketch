/**
 * StateStoryBar
 *
 * A 4-stage horizontal breadcrumb showing the conceptual arc of the current
 * experiment: Start → Superposition → Entanglement → Measured.
 *
 * The active stage is derived purely from circuit contents and
 * measurementOutcome — no additional state needed.
 *
 * Stages
 * ──────
 * 0  Start        |00⟩, nothing applied yet
 * 1  Superposition  any H gate is in the circuit
 * 2  Entanglement   both an H gate AND CNOT are in the circuit
 * 3  Measured       measurementOutcome is set
 *
 * The bar is purely informational — no interactivity.
 *
 * Props
 * ─────
 * circuit            {string[]}
 * measurementOutcome {string|null}
 */

const STAGES = [
  {
    id:    'start',
    label: 'Start',
    icon:  '|00⟩',
    tip:   'Both qubits begin in the ground state.',
  },
  {
    id:    'superposition',
    label: 'Superposition',
    icon:  'H',
    tip:   'A Hadamard gate put a qubit into superposition — it now has 50% probability of each outcome.',
  },
  {
    id:    'entanglement',
    label: 'Entanglement',
    icon:  '⊕',
    tip:   'CNOT after Hadamard creates entanglement — both qubits are now correlated.',
  },
  {
    id:    'measured',
    label: 'Measured',
    icon:  'M',
    tip:   'Measurement collapsed the superposition into one classical outcome.',
  },
];

const deriveStage = (circuit, measurementOutcome) => {
  if (measurementOutcome) return 3;
  const hasH    = circuit.some(g => g === 'H0' || g === 'H1');
  const hasCNOT = circuit.includes('CNOT');
  if (hasH && hasCNOT) return 2;
  if (hasH)            return 1;
  return 0;
};

const StateStoryBar = ({ circuit, measurementOutcome }) => {
  const activeIndex = deriveStage(circuit, measurementOutcome);

  return (
    <div
      aria-label="Experiment progress"
      className="flex items-center gap-0 mb-4 overflow-x-auto"
    >
      {STAGES.map((stage, i) => {
        const isPast   = i < activeIndex;
        const isActive = i === activeIndex;
        const isFuture = i > activeIndex;

        return (
          <div key={stage.id} className="flex items-center flex-shrink-0">
            {/* Stage pill */}
            <div
              title={stage.tip}
              className={`
                flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold
                border-2 border-black rounded-full transition-all duration-300
                ${isPast   ? 'bg-black text-white'   : ''}
                ${isActive ? 'bg-black text-white shadow-[2px_2px_0_0_#000] scale-105' : ''}
                ${isFuture ? 'bg-white text-black/40 border-dashed' : ''}
              `}
              aria-current={isActive ? 'step' : undefined}
            >
              {/* Icon badge */}
              <span
                aria-hidden="true"
                className={`
                  w-5 h-5 rounded-full flex items-center justify-center
                  font-mono text-[0.6rem] font-extrabold
                  border border-current
                  ${isPast || isActive ? 'border-white text-white' : 'border-black/30 text-black/30'}
                `}
              >
                {isPast ? '✓' : stage.icon}
              </span>
              <span className="whitespace-nowrap">{stage.label}</span>
            </div>

            {/* Connector arrow between stages */}
            {i < STAGES.length - 1 && (
              <svg
                viewBox="0 0 20 8"
                width={20}
                height={8}
                aria-hidden="true"
                className="mx-0.5 flex-shrink-0"
              >
                <line
                  x1="0" y1="4" x2="14" y2="4"
                  stroke={i < activeIndex ? '#000' : '#ccc'}
                  strokeWidth="1.5"
                  strokeDasharray={i >= activeIndex ? '3 2' : undefined}
                  strokeLinecap="round"
                />
                <polyline
                  points="10,1 16,4 10,7"
                  fill="none"
                  stroke={i < activeIndex ? '#000' : '#ccc'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StateStoryBar;
