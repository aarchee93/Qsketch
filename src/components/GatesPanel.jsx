import SketchButton from './SketchButton';
import { H0, H1, X0, X1, CNOT } from '../constants/quantumGates';

// Gates Panel Component for Simulator
const GatesPanel = ({ applyNewGate, handleMeasure, handleUndo, handleReset, measurementOutcome, history }) => (
  <div className="flex flex-col space-y-4 p-4 border-2 border-black bg-white rounded-lg shadow-xl">
    <h3 className="text-xl font-extrabold text-center border-b-2 border-dashed border-black pb-2">Quantum Gates</h3>
    <div className="grid grid-cols-2 gap-4">
      {/* Disable all gate application buttons if measurementOutcome is set */}
      <SketchButton onClick={() => applyNewGate('H0', H0)} disabled={!!measurementOutcome}>
        Hadamard (Q0)
        <span className="block text-xs font-normal">Superposition</span>
      </SketchButton>
      <SketchButton onClick={() => applyNewGate('H1', H1)} disabled={!!measurementOutcome} variant="inverted">
        Hadamard (Q1)
        <span className="block text-xs font-normal">Superposition</span>
      </SketchButton>
      <SketchButton onClick={() => applyNewGate('X0', X0)} disabled={!!measurementOutcome}>
        Pauli-X (Q0)
        <span className="block text-xs font-normal">Flips Qubit</span>
      </SketchButton>
      <SketchButton onClick={() => applyNewGate('X1', X1)} disabled={!!measurementOutcome} variant="inverted">
        Pauli-X (Q1)
        <span className="block text-xs font-normal">Flips Qubit</span>
      </SketchButton>
      <SketchButton onClick={() => applyNewGate('CNOT', CNOT)} disabled={!!measurementOutcome}>
        CNOT (Q0 → Q1)
        <span className="block text-xs font-normal">Entanglement</span>
      </SketchButton>
    </div>
    
    {/* Measure Interaction Button */}
    <SketchButton 
        onClick={handleMeasure} 
        disabled={!!measurementOutcome} 
        variant="inverted"
        className="font-extrabold text-lg"
    >
        Measure Qubits! 🤯
    </SketchButton>

    <div className="flex justify-between pt-2 border-t-2 border-dashed border-black">
      <SketchButton onClick={handleUndo} disabled={history.length === 1}>Undo</SketchButton>
      <SketchButton onClick={handleReset} variant="inverted">Reset</SketchButton>
    </div>
  </div>
);

export default GatesPanel;

