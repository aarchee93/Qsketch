import { useState, useMemo } from 'react';
import SketchButton from '../components/SketchButton';
import StateVisualization from '../components/StateVisualization';
import GatesPanel from '../components/GatesPanel';
import CircuitDisplay from '../components/CircuitDisplay';
import CircuitDiagram from '../components/CircuitDiagram';
import QuantumLearningAssistant from '../components/QuantumLearningAssistant';
import LabConsole from '../components/LabConsole';
import IdleQubit from '../components/IdleQubit';
import DidYouKnow from '../components/DidYouKnow';
import CornerDoodle from '../components/CornerDoodle';
import ResearchNote from '../components/ResearchNote';
import OnboardingOverlay from '../components/OnboardingOverlay';
import GateFlashBanner from '../components/GateFlashBanner';
import GuidedStepper from '../components/GuidedStepper';
import StateStoryBar from '../components/StateStoryBar';
import { RESEARCH_NOTES } from '../constants/labFlavorText';
import { useLabConsole } from '../hooks/useLabConsole';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { PAGES } from '../constants/pages';
import { SIMULATOR_ONBOARDING_STEPS } from '../constants/onboardingSteps';
import { hasSeenOnboarding, markOnboardingSeen } from '../utils/sessionFlags';

/* ── Plain-language state description ─────────────────────────── */
// Reuses the same logic as ObservationCard.describeState but produces a
// slightly shorter title-friendly version for the chart heading.

const BASIS_LABELS = ['|00⟩', '|01⟩', '|10⟩', '|11⟩'];

const describeStateTitle = (stateVector, measurementOutcome) => {
  if (measurementOutcome) {
    return `Collapsed to ${measurementOutcome}`;
  }
  const probabilities = stateVector.map((amp) => Math.round(amp * amp * 100));
  const active = probabilities
    .map((p, i) => ({ p, label: BASIS_LABELS[i] }))
    .filter((s) => s.p > 0);

  if (active.length === 1) return `Definite state: ${active[0].label}`;

  if (active.length === 2 && active.every((s) => Math.abs(s.p - active[0].p) < 2)) {
    return `Equal superposition: ${active[0].label} and ${active[1].label}`;
  }
  if (active.length === 4 && active.every((s) => Math.abs(s.p - 25) < 2)) {
    return 'Equal probability across all four states';
  }
  return active.map((s) => `${s.label} ${s.p}%`).join(' · ');
};

/* ────────────────────────────────────────────────────────────── */

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
  pendingGate   = null,
  isMeasuring   = false,
  isResetting   = false,
  guidedConfig  = null,
  onExitGuided,
  onViewLesson,
}) => {
  const consoleEntries = useLabConsole(circuit, measurementOutcome);
  const [showOnboarding, setShowOnboarding] = useState(!hasSeenOnboarding('simulator'));

  const closeOnboarding = () => {
    markOnboardingSeen('simulator');
    setShowOnboarding(false);
  };

  const isBusy     = !!pendingGate || isMeasuring || isResetting;
  const qubitMode  = isResetting ? 'reset' : isMeasuring ? 'collapse' : pendingGate ? 'pulse' : 'idle';

  // Feature #5: live plain-language chart title
  const stateTitle = useMemo(
    () => describeStateTitle(currentState, measurementOutcome),
    [currentState, measurementOutcome]
  );

  useKeyboardShortcuts({
    applyNewGate,
    handleMeasure,
    handleReset,
    disabled: isBusy || !!measurementOutcome || isMeasuring,
  });

  return (
    <div className="p-4 md:p-8">
      {/* Top nav */}
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

      <section className="bg-white p-6 md:p-8 border-4 border-solid border-black rounded-xl overflow-x-hidden shadow-[8px_8px_0_0_#000000]">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
          <h2 className="text-3xl font-extrabold text-center md:text-left">
            {guidedConfig ? 'Guided Practice' : 'The 2-Qubit Free Simulator'}
          </h2>
          <IdleQubit activityKey={`${circuit.length}-${measurementOutcome}`} mode={qubitMode} />
        </div>

        {/* Feature #2: GuidedStepper replaces the flat guided banner */}
        {guidedConfig ? (
          <GuidedStepper
            steps={guidedConfig.steps}
            lastAction={lastAction}
            instruction={guidedConfig.instruction}
            onExit={onExitGuided}
          />
        ) : (
          <p className="text-center text-black mb-6 italic">
            Experiment freely by applying gates to the initial |00⟩ state.
          </p>
        )}

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
              allowedGates={guidedConfig?.allowedGates ?? null}
            />
          </div>

          {/* Visualization column */}
          <div className="lg:w-2/3 space-y-6">

            {/* Feature #1: Gate Flash Banner — sits above the chart */}
            <GateFlashBanner
              lastAction={lastAction}
              circuit={circuit}
              measurementOutcome={measurementOutcome}
              pendingGate={pendingGate}
              isMeasuring={isMeasuring}
            />

            {/* Probability Chart */}
            <div className="relative p-4 bg-white rounded-lg border-2 border-black shadow-xl">
              <CornerDoodle position="top-right" />

              {/* Feature #5: live plain-language title */}
              <h3 className="text-xl font-extrabold mb-0.5 text-center leading-tight">
                {stateTitle}
              </h3>
              <p className="text-xs text-center text-black/40 font-mono mb-4">
                Probability Distribution (|α|²)
              </p>

              {measurementOutcome && (
                <div className="mb-4 p-3 bg-black text-white rounded-lg text-center font-bold animate-bounce-in">
                  Measurement Result:
                  <span className="ml-2 text-2xl font-mono">{measurementOutcome}</span>
                </div>
              )}

              <StateVisualization stateVector={currentState} measurementOutcome={measurementOutcome} />
            </div>

            {/* Feature #6: State Story Bar — conceptual progress breadcrumb */}
            <StateStoryBar circuit={circuit} measurementOutcome={measurementOutcome} />

            {/* Quantum Learning Assistant */}
            <QuantumLearningAssistant
              action={lastAction}
              seed={circuit.length}
              onViewLesson={onViewLesson}
            />

            <ResearchNote>
              {RESEARCH_NOTES[lastAction] || RESEARCH_NOTES.START}
            </ResearchNote>

            {/* Feature #3: CircuitDiagram now shows Bell State example when empty */}
            <CircuitDiagram
              circuit={circuit}
              pendingGate={pendingGate}
              applyNewGate={applyNewGate}
              handleMeasure={handleMeasure}
              disabled={!!measurementOutcome || isBusy}
            />

            <LabConsole entries={consoleEntries} />
            <CircuitDisplay circuit={circuit} />

          </div>
        </div>
      </section>

      <OnboardingOverlay
        open={showOnboarding}
        onClose={closeOnboarding}
        steps={SIMULATOR_ONBOARDING_STEPS}
        character="lab"
      />
    </div>
  );
};

export default SimulatorView;
