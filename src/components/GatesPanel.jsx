import { useState } from 'react';
import SketchButton from './SketchButton';
import CornerDoodle from './CornerDoodle';
import GateTooltip from './GateTooltip';
import { H0, H1, X0, X1, CNOT } from '../constants/quantumGates';
import { GATE_INFO } from '../constants/gateInfo';

const GatesPanel = ({
  mode = 'guided',
  title = "Quantum Gates",
  applyNewGate,
  handleMeasure,
  handleUndo,
  handleReset,
  disabled = false,
  canUndo = false,
  resetLabel = "Reset Experiment",
  extraButton = null,
  allowedGates = null, // null/undefined = all gates; array = restrict toolbox (guided mode)
}) => {
  const [hoveredGate, setHoveredGate] = useState(null);
  const isAllowed = (gateId) => !allowedGates || allowedGates.includes(gateId);
  const showTooltips = mode === 'guided'; // Tooltips only in guided mode
  
  return (
  <div className="relative flex flex-col space-y-4 p-4 border-2 border-black bg-white rounded-lg shadow-xl overflow-visible" role="group" aria-label={title}>
    <CornerDoodle position="top-right" variant="star" />
    <h3 className="text-xl font-extrabold text-center border-b-2 border-dashed border-black pb-2">{title}</h3>
    <div className="grid grid-cols-2 gap-4 overflow-visible">
      {isAllowed('H0') && (
      <div 
        className="relative"
        onMouseEnter={() => setHoveredGate('H0')}
        onMouseLeave={() => setHoveredGate(null)}
        onTouchStart={(e) => {
          e.preventDefault();
          setHoveredGate(hoveredGate === 'H0' ? null : 'H0');
        }}
      >
        <SketchButton
          aria-label="Apply Hadamard gate to Q0, creates superposition"
          onClick={() => applyNewGate('H0', H0)}
          disabled={disabled}
        >
          Hadamard (Q0)
          <span className="block text-xs font-normal">Superposition</span>
        </SketchButton>
        <GateTooltip gateId="H0" text={hoveredGate === 'H0' && showTooltips ? GATE_INFO.H0 : null} enabled={showTooltips} />
      </div>
      )}
      {isAllowed('H1') && (
      <div 
        className="relative"
        onMouseEnter={() => setHoveredGate('H1')}
        onMouseLeave={() => setHoveredGate(null)}
        onTouchStart={(e) => {
          e.preventDefault();
          setHoveredGate(hoveredGate === 'H1' ? null : 'H1');
        }}
      >
        <SketchButton
          aria-label="Apply Hadamard gate to Q1, creates superposition"
          onClick={() => applyNewGate('H1', H1)}
          disabled={disabled}
        >
          Hadamard (Q1)
          <span className="block text-xs font-normal">Superposition</span>
        </SketchButton>
        <GateTooltip gateId="H1" text={hoveredGate === 'H1' && showTooltips ? GATE_INFO.H1 : null} enabled={showTooltips} />
      </div>
      )}
      {isAllowed('X0') && (
      <div 
        className="relative"
        onMouseEnter={() => setHoveredGate('X0')}
        onMouseLeave={() => setHoveredGate(null)}
        onTouchStart={(e) => {
          e.preventDefault();
          setHoveredGate(hoveredGate === 'X0' ? null : 'X0');
        }}
      >
        <SketchButton
          aria-label="Apply Pauli-X gate to Q0, flips the qubit"
          onClick={() => applyNewGate('X0', X0)}
          disabled={disabled}
        >
          Pauli-X (Q0)
          <span className="block text-xs font-normal">Flips Qubit</span>
        </SketchButton>
        <GateTooltip gateId="X0" text={hoveredGate === 'X0' && showTooltips ? GATE_INFO.X0 : null} enabled={showTooltips} />
      </div>
      )}
      {isAllowed('X1') && (
      <div 
        className="relative"
        onMouseEnter={() => setHoveredGate('X1')}
        onMouseLeave={() => setHoveredGate(null)}
        onTouchStart={(e) => {
          e.preventDefault();
          setHoveredGate(hoveredGate === 'X1' ? null : 'X1');
        }}
      >
        <SketchButton
          aria-label="Apply Pauli-X gate to Q1, flips the qubit"
          onClick={() => applyNewGate('X1', X1)}
          disabled={disabled}
        >
          Pauli-X (Q1)
          <span className="block text-xs font-normal">Flips Qubit</span>
        </SketchButton>
        <GateTooltip gateId="X1" text={hoveredGate === 'X1' && showTooltips ? GATE_INFO.X1 : null} enabled={showTooltips} />
      </div>
      )}
      {isAllowed('CNOT') && (
      <div 
        className="relative col-span-2"
        onMouseEnter={() => setHoveredGate('CNOT')}
        onMouseLeave={() => setHoveredGate(null)}
        onTouchStart={(e) => {
          e.preventDefault();
          setHoveredGate(hoveredGate === 'CNOT' ? null : 'CNOT');
        }}
      >
        <SketchButton
          aria-label="Apply CNOT gate, control Q0 target Q1, creates entanglement"
          onClick={() => applyNewGate('CNOT', CNOT)}
          disabled={disabled}
        >
          CNOT (Q0 → Q1)
          <span className="block text-xs font-normal">Entanglement</span>
        </SketchButton>
        <GateTooltip gateId="CNOT" text={hoveredGate === 'CNOT' && showTooltips ? GATE_INFO.CNOT : null} enabled={showTooltips} />
      </div>
      )}
    </div>

    {handleMeasure && (
      <SketchButton
        onClick={handleMeasure}
        disabled={disabled}
        variant="inverted"
        className="font-extrabold text-lg hover:bg-white hover:text-black"
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
};

export default GatesPanel;
