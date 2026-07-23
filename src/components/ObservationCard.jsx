import { OBSERVATION_APPLYING } from '../constants/labFlavorText';

const BASIS_LABELS = ['|00⟩', '|01⟩', '|10⟩', '|11⟩'];

// Turns the current state vector into a plain-language observation, the same
// way a lab notebook entry would read after watching an experiment settle.
const describeState = (stateVector, measurementOutcome) => {
  if (measurementOutcome) {
    return `Measurement collapsed the state to ${measurementOutcome}.`;
  }

  const probabilities = stateVector.map((amp) => Math.round(amp * amp * 100));
  const active = probabilities
    .map((p, i) => ({ p, label: BASIS_LABELS[i] }))
    .filter((s) => s.p > 0);

  if (active.length === 1) {
    return `Definite state: ${active[0].label} with 100% probability.`;
  }

  if (active.length === 2 && active.every((s) => Math.abs(s.p - active[0].p) < 2)) {
    return `Equal probability of measuring ${active[0].label} and ${active[1].label}.`;
  }

  if (active.length === 4 && active.every((s) => Math.abs(s.p - 25) < 2)) {
    return 'Equal probability across all four basis states.';
  }

  return active.map((s) => `${s.label}: ${s.p}%`).join('  ·  ');
};

/**
 * Observation Card — the simulator's lab-notebook moment. While a gate or
 * measurement is mid-animation it shows what's happening; once things
 * settle, it reports what was observed, in plain language.
 */
const ObservationCard = ({ pendingGate, isMeasuring, measurementOutcome, stateVector }) => {
  const inProgressKey = isMeasuring ? 'MEASURE' : pendingGate;
  const inProgressLines = inProgressKey ? OBSERVATION_APPLYING[inProgressKey] : null;

  return (
    <div className="mt-6 p-4 border-2 border-black bg-white rounded-lg shadow-inner">
      <h3 className="text-xl font-extrabold mb-2 flex items-center gap-2">
        <span aria-hidden="true">🔬</span> Observation
      </h3>
      {inProgressLines ? (
        <div className="space-y-1" aria-live="polite">
          {inProgressLines.map((line, i) => (
            <p key={i} className="italic text-black/70 animate-fade-in" style={{ animationDelay: `${i * 250}ms`, animationFillMode: 'backwards' }}>
              {line}
            </p>
          ))}
        </div>
      ) : (
        <p className="animate-fade-in" aria-live="polite">
          {describeState(stateVector, measurementOutcome)}
        </p>
      )}
    </div>
  );
};

export default ObservationCard;
