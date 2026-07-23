import { useState } from 'react';
import SketchButton from '../components/SketchButton';
import StateVisualization from '../components/StateVisualization';
import GatesPanel from '../components/GatesPanel';
import CircuitDisplay from '../components/CircuitDisplay';
import CircuitDiagram from '../components/CircuitDiagram';
import QuantumLearningAssistant from '../components/QuantumLearningAssistant';
import LabConsole from '../components/LabConsole';
import IdleQubit from '../components/IdleQubit';
import DidYouKnow from '../components/DidYouKnow';
import ObservationCard from '../components/ObservationCard';
import CornerDoodle from '../components/CornerDoodle';
import ResearchNote from '../components/ResearchNote';
import OnboardingOverlay from '../components/OnboardingOverlay';
import { RESEARCH_NOTES } from '../constants/labFlavorText';
import { useLabConsole } from '../hooks/useLabConsole';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { PAGES } from '../constants/pages';
import { SIMULATOR_ONBOARDING_STEPS } from '../constants/onboardingSteps';
import { hasSeenOnboarding, markOnboardingSeen } from '../utils/sessionFlags';

const SimulatorView = ({ 
  setPage, 
  circuit, 
  applyNewGate, 
  handleReset, 
  handleUndo, 
  currentState, 
  measurementOutcome, 
  handleMeasure,
  history,
  lastAction,
  pendingGate = null,
  isMeasuring = false,
  isResetting = false,
}) => {
  const consoleEntries = useLabConsole(circuit, measurementOutcome);
  const [showOnboarding, setShowOnboarding] = useState(!hasSeenOnboarding('simulator'));

  const closeOnboarding = () => {
    markOnboardingSeen('simulator');
    setShowOnboarding(false);
  };

  // While a gate is sliding in, being measured, or resetting, treat the whole
  // panel as busy so a second click can't stack on top of the animation.
  const isBusy = !!pendingGate || isMeasuring || isResetting;

  const qubitMode = isResetting ? 'reset' : isMeasuring ? 'collapse' : pendingGate ? 'pulse' : 'idle';

  // Keyboard shortcuts for power users: H (Hadamard Q0), X (Pauli-X Q0),
  // C (CNOT), M (Measure), R (Reset).
  useKeyboardShortcuts({
    applyNewGate,
    handleMeasure,
    handleReset,
    disabled: isBusy || !!measurementOutcome,
  });

  return (
  <div className="p-4 md:p-8">
    <div className="flex items-center justify-between mb-8 gap-2">
      <SketchButton onClick={() => setPage(PAGES.LANDING)}>
        &larr; Back to Home
      </SketchButton>
      <SketchButton
        onClick={() => setShowOnboarding(true)}
        variant="outlined"
        aria-label="Open walkthrough"
        className="!px-3"
      >
        ?
      </SketchButton>
    </div>

    <DidYouKnow />
    
    <section className="bg-white p-6 md:p-8 border-4 border-solid border-black rounded-xl shadow-[8px_8px_0_0_#000000]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <h2 className="text-3xl font-extrabold text-center md:text-left">The 2-Qubit Free Simulator</h2>
        <IdleQubit activityKey={`${circuit.length}-${measurementOutcome}`} mode={qubitMode} />
      </div>
      <p className="text-center text-black mb-6 italic">Experiment freely by applying gates to the initial |00⟩ state.</p>
      
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Gates Panel */}
        <div className="lg:w-1/3">
          <GatesPanel 
            applyNewGate={applyNewGate}
            handleMeasure={handleMeasure}
            handleUndo={handleUndo}
            handleReset={handleReset}
            disabled={!!measurementOutcome || isBusy}
            canUndo={history.length > 1 && !isBusy}
          />
        </div>

        {/* Visualization and Circuit */}
        <div className="lg:w-2/3 space-y-6">
          
          {/* Visualization */}
         <div className="space-y-6">

    {/* Probability Graph */}

    <div className="relative p-4 bg-white rounded-lg border-2 border-black shadow-xl">
        <CornerDoodle position="top-right" />

        <h3 className="text-xl font-extrabold mb-4 text-center">
            Probability Distribution (|α|²)
        </h3>

        {measurementOutcome && (
            <div className="mb-4 p-3 bg-black text-white rounded-lg text-center font-bold animate-bounce-in">
                Measurement Result:
                <span className="ml-2 text-2xl font-mono">
                    {measurementOutcome}
                </span>
            </div>
        )}

        <StateVisualization stateVector={currentState} measurementOutcome={measurementOutcome} />

    </div>

    {/* Observation Card: the simulator's lab-notebook moment */}
    <ObservationCard
      pendingGate={pendingGate}
      isMeasuring={isMeasuring}
      measurementOutcome={measurementOutcome}
      stateVector={currentState}
    />

    {/* Quantum Assistant */}
    <QuantumLearningAssistant action={lastAction} seed={circuit.length} />

    <ResearchNote>
  {RESEARCH_NOTES[lastAction] || RESEARCH_NOTES.START}
</ResearchNote>

    {/* Circuit Diagram */}
    <CircuitDiagram circuit={circuit} pendingGate={pendingGate} />

    {/* Lab Console */}
    <LabConsole entries={consoleEntries} />

</div>
          {/* Experiment Log (text list) */}
          <CircuitDisplay circuit={circuit} />

        </div>
      </div>
    </section>

    <OnboardingOverlay
      open={showOnboarding}
      onClose={closeOnboarding}
      steps={SIMULATOR_ONBOARDING_STEPS}
    />
  </div>
  );
};

export default SimulatorView;
