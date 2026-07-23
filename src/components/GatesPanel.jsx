import SketchButton from './SketchButton';
import CornerDoodle from './CornerDoodle';
import { H0, H1, X0, X1, CNOT } from '../constants/quantumGates';
import { GATE_INFO } from '../constants/gateInfo';

const GatesPanel = ({
  title = "Quantum Gates",
  applyNewGate,
  handleMeasure,
  handleUndo,
  handleReset,
  disabled = false,
  canUndo = false,
  resetLabel = "Reset Experiment",
  extraButton = null,
}) => (
  <div className="relative flex flex-col space-y-4 p-4 border-2 border-black bg-white rounded-lg shadow-xl" role="group" aria-label={title}>
    <CornerDoodle position="top-right" variant="star" />
    <h3 className="text-xl font-extrabold text-center border-b-2 border-dashed border-black pb-2">{title}</h3>
    <div className="grid grid-cols-2 gap-4">
      <SketchButton
        title={GATE_INFO.H0}
        aria-label="Apply Hadamard gate to Q0, creates superposition"
        onClick={() => applyNewGate('H0', H0)}
        disabled={disabled}
      >
        Hadamard (Q0)
        <span className="block text-xs font-normal">Superposition</span>
      </SketchButton>
      <SketchButton
        title={GATE_INFO.H1}
        aria-label="Apply Hadamard gate to Q1, creates superposition"
        onClick={() => applyNewGate('H1', H1)}
        disabled={disabled}
      >
        Hadamard (Q1)
        <span className="block text-xs font-normal">Superposition</span>
      </SketchButton>
      <SketchButton
        title={GATE_INFO.X0}
        aria-label="Apply Pauli-X gate to Q0, flips the qubit"
        onClick={() => applyNewGate('X0', X0)}
        disabled={disabled}
      >
        Pauli-X (Q0)
        <span className="block text-xs font-normal">Flips Qubit</span>
      </SketchButton>
      <SketchButton
        title={GATE_INFO.X1}
        aria-label="Apply Pauli-X gate to Q1, flips the qubit"
        onClick={() => applyNewGate('X1', X1)}
        disabled={disabled}
        variant="inverted"
      >
        Pauli-X (Q1)
        <span className="block text-xs font-normal">Flips Qubit</span>
      </SketchButton>
      <SketchButton
        title={GATE_INFO.CNOT}
        aria-label="Apply CNOT gate, control Q0 target Q1, creates entanglement"
        onClick={() => applyNewGate('CNOT', CNOT)}
        disabled={disabled}
      >
        CNOT (Q0 → Q1)
        <span className="block text-xs font-normal">Entanglement</span>
      </SketchButton>
    </div>

    {handleMeasure && (
      <SketchButton
        onClick={handleMeasure}
        disabled={disabled}
        variant="inverted"
        className="font-extrabold text-lg"
        aria-label="Perform measurement, collapses the quantum state"
      >
        Perform Measurement <span aria-hidden="true">🤯</span>
      </SketchButton>
    )}

    <div className="flex flex-wrap gap-2 justify-between pt-2 border-t-2 border-dashed border-black">
      {handleUndo && (
        <SketchButton onClick={handleUndo} disabled={!canUndo} aria-label="Undo last gate">
          Undo
        </SketchButton>
      )}
      <SketchButton onClick={handleReset} variant="inverted" aria-label={`${resetLabel}: clear the circuit`}>
        {resetLabel}
      </SketchButton>
      {extraButton}
    </div>
    <p className="text-center text-[11px] text-black/50 -mt-2" aria-hidden="true">
      Shortcuts: H · X · C · M · R
    </p>
  </div>
);

export default GatesPanel;
