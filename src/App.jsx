import { useState, useCallback, useEffect } from 'react';
import { PAGES } from './constants/pages';
import { INITIAL_STATE } from './constants/quantumGates';
import { STORAGE_KEY, QUANTUM_CONCEPTS } from './constants/quantumConcepts';
import { safeApplyGate, safeMeasureState } from './utils/quantumUtilsEnhanced';
import { safeGetStorage, safeSetStorage } from './utils/storageUtils';
import { useConfirm } from './hooks/useConfirm';
import { useToast, ToastContainer } from './components/Toast';
import { playMeasureSound, playSuccessSound, playErrorSound, isMuted, setMuted } from './utils/soundUtils';
import ConfirmModal from './components/ConfirmModal';
import QuantumGuide from './components/QuantumGuide/QuantumGuide';
import LandingPage from './pages/LandingPage';
import CMSPage from './pages/CMSPage';
import ResourcesPage from './pages/ResourcesPage';
import SimulatorView from './pages/SimulatorView';
import GameView from './pages/GameView';

const initializeConcepts = () => {
    try {
        const storedConcepts = safeGetStorage(STORAGE_KEY, null);

        if (storedConcepts && Array.isArray(storedConcepts)) {
            return storedConcepts;
        }

        safeSetStorage(STORAGE_KEY, QUANTUM_CONCEPTS);
        return QUANTUM_CONCEPTS;

    } catch (error) {
        console.error("Failed to load concepts:", error);
        return QUANTUM_CONCEPTS;
    }
};

// Timings for the "alive" experiment sequence: press -> slide -> wire pulse -> qubit reacts -> state updates.
const GATE_ANIMATION_MS = 550;
const MEASURE_ANIMATION_MS = 600;
const RESET_ANIMATION_MS = 450;

const App = () => {
  const [currentPage, setCurrentPage] = useState(PAGES.LANDING);
  const [circuit, setCircuit] = useState([]);
  const [history, setHistory] = useState([INITIAL_STATE]);
  const [measurementOutcome, setMeasurementOutcome] = useState(null);
  const [lastAction, setLastAction] = useState("START");
  const [resourceLessonId, setResourceLessonId] = useState(null);
  const [guidedConfig, setGuidedConfig] = useState(null);

  // Lifted game state so QuantumGuide can react during challenge mode
  const [gameStatus, setGameStatus] = useState(null);
  const [gameCircuit, setGameCircuit] = useState([]);
  const [gameLevel, setGameLevel] = useState(0);

  // Animation-timing state: while these are set, the visible circuit/state
  // hasn't committed yet — the UI is mid gate-slide / collapse / reset, so the
  // experiment feels like it's actually happening rather than snapping instantly.
  const [pendingGate, setPendingGate] = useState(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [muted, setMutedState] = useState(() => isMuted());
  const toggleMute = useCallback(() => {
    setMuted(!isMuted());
    setMutedState(isMuted());
  }, []);

  // Jumps to the Quantum Learning Centre and opens the lesson matching the
  // gate the assistant is currently explaining — closes the Simulator → Resources loop.
  const handleViewLesson = useCallback((lessonId) => {
    setResourceLessonId(lessonId);
    setCurrentPage(PAGES.RESOURCES);
  }, []);

  // Opens the Simulator pre-loaded for one topic/gate: restricted toolbox,
  // fresh |00⟩ state. config=null means the free-play simulator (no restriction).
  const handleTryInSimulator = useCallback((config = null) => {
    setCircuit([]);
    setHistory([INITIAL_STATE]);
    setMeasurementOutcome(null);
    setLastAction("START");
    setGuidedConfig(config);
    setCurrentPage(PAGES.SIMULATOR);
  }, []);

  const handleExitGuided = useCallback(() => {
    setGuidedConfig(null);
    setCurrentPage(PAGES.RESOURCES);
  }, []);

  // Custom confirm modal + toast notifications, replacing window.confirm()/alert()
  const { dialogState, requestConfirm, handleConfirm, handleCancel } = useConfirm();
  const { toasts, showToast, removeToast } = useToast();

  // CMS/LOCAL STORAGE LOGIC
  const [concepts, setConcepts] = useState([]);

  // Load concepts from localStorage on component mount
  useEffect(() => {
    setConcepts(initializeConcepts());
}, []);

  // Page navigation is in-app rather than a full browser navigation, so retain
  // neither the previous page's scroll position nor its lower viewport.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [currentPage]);

  // Handler to add a new concept (passed down to the editor component)
  const handleAddConcept = useCallback((newConcept) => {
    try {
      const conceptWithId = { 
          ...newConcept, 
          id: crypto.randomUUID() // Simple unique ID
      };

      setConcepts(prev => {
          const updatedConcepts = [...prev, conceptWithId];
          const saved = safeSetStorage(STORAGE_KEY, updatedConcepts);
          if (!saved) {
              console.warn('Concept saved in memory only (localStorage unavailable)');
          }
          return updatedConcepts;
      });
      showToast('Concept added to your research library.', 'success');
      playSuccessSound();
    } catch (error) {
      console.error('Error adding concept:', error);
      showToast('Failed to add concept. Please try again.', 'error');
      playErrorSound();
    }
  }, [showToast]);

  // Delete handler
  const handleDeleteConcept = useCallback(async (conceptId) => {
    try {
      const confirmed = await requestConfirm({
          title: 'Delete this concept from your research library?',
          message: 'This will remove the concept from your library. This cannot be undone.',
          confirmLabel: 'Delete',
          cancelLabel: 'Cancel',
          danger: true,
      });

      if (!confirmed) {
          return;
      }

      setConcepts(prev => {
          const updatedConcepts = prev.filter(c => c.id !== conceptId);
          const saved = safeSetStorage(STORAGE_KEY, updatedConcepts);
          if (!saved) {
              console.warn('Change saved in memory only (localStorage unavailable)');
          }
          return updatedConcepts;
      });
      showToast('Concept deleted.', 'success');
    } catch (error) {
      console.error('Error deleting concept:', error);
      showToast('Failed to delete concept. Please try again.', 'error');
      playErrorSound();
    }

}, [requestConfirm, showToast]);
  
  // Current state is the last item in history
  const currentState = history[history.length - 1];

  // Logic for applying gates. The gate is "played into" the circuit over
  // GATE_ANIMATION_MS before the state actually commits, so the button
  // press, the slide-in, the wire pulse, and the qubit's reaction all have
  // time to happen in sequence instead of everything updating in one frame.
  const applyNewGate = useCallback(async (gateName, matrix) => {
    try {
      if (pendingGate || isMeasuring || isResetting) return;

      // Reset measurement on new gate
      if (measurementOutcome !== null) {
        const continueCircuit = await requestConfirm({
            title: 'Start a new experiment?',
            message: 'The circuit has already been measured.\n\nApplying a new gate will start a new experiment.',
            confirmLabel: 'Start New Experiment',
            cancelLabel: 'Cancel',
        });

        if (!continueCircuit) {
            return;
        }

        setCircuit([]);
        setHistory([INITIAL_STATE]);
        setMeasurementOutcome(null);
      }

      // Apply gate with error handling (computed now, committed after the animation)
      const gateResult = safeApplyGate(matrix, currentState);
      
      if (!gateResult.success) {
        console.error('Gate application failed:', gateResult.error);
        showToast(`Error: ${gateResult.error}`, 'error');
        playErrorSound();
        return;
      }

      setPendingGate(gateName);
      setLastAction(gateName);

      setTimeout(() => {
        setCircuit(prev => [...prev, gateName]);
        setHistory(prev => [...prev, gateResult.result]);
        setPendingGate(null);
        showToast('Gate successfully applied.', 'success');
      }, GATE_ANIMATION_MS);
    } catch (error) {
      console.error('Unexpected error applying gate:', error);
      showToast('The experiment could not be completed. Please reset the laboratory.', 'error');
      playErrorSound();
    }
  }, [currentState, measurementOutcome, pendingGate, isMeasuring, isResetting, requestConfirm, showToast]);

  // Measurement handler — plays the collapse animation before the outcome
  // and updated (collapsed) state vector are committed.
  const handleMeasure = useCallback(() => {
    try {
      if (measurementOutcome || pendingGate || isMeasuring || isResetting) return;

      const measureResult = safeMeasureState(currentState);
      
      if (!measureResult.success) {
        console.error('Measurement failed:', measureResult.error);
        showToast(`Measurement error: ${measureResult.error}`, 'error');
        playErrorSound();
        return;
      }

      setIsMeasuring(true);
      setLastAction("MEASURE");
      playMeasureSound();

      setTimeout(() => {
        setHistory(prev => [...prev, measureResult.measuredState]);
        setMeasurementOutcome(measureResult.outcome);
        setIsMeasuring(false);
      }, MEASURE_ANIMATION_MS);
    } catch (error) {
      console.error('Unexpected error during measurement:', error);
      showToast('The experiment could not be completed. Please reset the laboratory.', 'error');
      playErrorSound();
    }
  }, [currentState, measurementOutcome, pendingGate, isMeasuring, isResetting, showToast]);

  // Reset handler — plays the qubit's reset spin before clearing the circuit.
  const handleReset = useCallback(async () => {
    try {
      const confirmed = await requestConfirm({
          title: 'Reset Experiment?',
          message: 'This will clear all applied gates and return to the initial |00⟩ state.',
          confirmLabel: 'Reset Experiment',
          cancelLabel: 'Cancel',
      });

      if (!confirmed) {
          return;
      }

      setIsResetting(true);
      setTimeout(() => {
        setCircuit([]);
        setHistory([INITIAL_STATE]);
        setMeasurementOutcome(null);
        setLastAction("START");
        setIsResetting(false);
      }, RESET_ANIMATION_MS);
    } catch (error) {
      console.error('Error resetting circuit:', error);
      showToast('The experiment could not be completed. Please reset the laboratory.', 'error');
      playErrorSound();
    }
  }, [requestConfirm, showToast]);

  // Undo handler
  const handleUndo = useCallback(() => {
    try {
      if (pendingGate || isMeasuring || isResetting) return;
      if (measurementOutcome) {
          // If the last step was a measurement, simply undo the collapse
          setHistory(prev => prev.slice(0, -1));
          setMeasurementOutcome(null);
      } else if (history.length > 1) {
        setHistory(prev => prev.slice(0, -1));
        setCircuit(prev => prev.slice(0, -1));
      }
    } catch (error) {
      console.error('Error during undo:', error);
      showToast('The experiment could not be completed. Please reset the laboratory.', 'error');
      playErrorSound();
    }
  }, [history.length, measurementOutcome, pendingGate, isMeasuring, isResetting, showToast]);

  // Conditional Rendering based on the current page state
  const renderPage = () => {
    switch (currentPage) {
      case PAGES.GAME:
        return (
          <GameView
            setPage={setCurrentPage}
            onViewLesson={handleViewLesson}
            onGameStateChange={({ gameStatus, circuit: gameCircuit, level }) => {
              setGameStatus(gameStatus);
              setGameCircuit(gameCircuit);
              setGameLevel(level);
            }}
          />
        );
      case PAGES.SIMULATOR:
        return (
          <SimulatorView
            setPage={setCurrentPage}
            circuit={circuit}
            history={history}
            lastAction={lastAction}
            applyNewGate={applyNewGate}
            handleReset={handleReset}
            handleUndo={handleUndo}
            currentState={currentState}
            measurementOutcome={measurementOutcome}
            handleMeasure={handleMeasure}
            onViewLesson={handleViewLesson}
            pendingGate={pendingGate}
            isMeasuring={isMeasuring}
            isResetting={isResetting}
            guidedConfig={guidedConfig}
            onExitGuided={handleExitGuided}
          />
        );
      case PAGES.CMS:
        return <CMSPage 
                   setPage={setCurrentPage} 
                   concepts={concepts}
                   onAddConcept={handleAddConcept}
                   onDeleteConcept={handleDeleteConcept}
               />;
      case PAGES.RESOURCES:
        return (
          <ResourcesPage
            setPage={setCurrentPage}
            deepLinkLessonId={resourceLessonId}
            onDeepLinkHandled={() => setResourceLessonId(null)}
            onTryInSimulator={handleTryInSimulator}
          />
        );
      case PAGES.LANDING:
      default:
        return <LandingPage setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <style>{`
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      
      {/* Header (Visible on all pages except Landing) */}
      <header className={`relative text-center p-6 bg-white ${currentPage === PAGES.LANDING ? 'hidden' : 'border-b-4 border-double border-black shadow-md'}`}>
        <h1 className="text-3xl font-extrabold tracking-tight">QUBIT SKETCHPAD</h1>
        <button
          onClick={toggleMute}
          title={muted ? 'Unmute lab sounds' : 'Mute lab sounds'}
          aria-label={muted ? 'Unmute lab sounds' : 'Mute lab sounds'}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center border-2 border-black rounded-full bg-white hover:bg-black hover:text-white transition-colors"
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </header>
      
      <main key={currentPage} className="max-w-6xl mx-auto animate-page-transition">
        {renderPage()}
      </main>
      
      <footer className="mt-12 text-center text-sm text-black border-t pt-4 pb-4">
        {(currentPage === PAGES.SIMULATOR || currentPage === PAGES.GAME) && (
          <p>System Note: State vector calculations use matrix multiplication for amplitude distribution.</p>
        )}
      </footer>

      <ConfirmModal dialogState={dialogState} onConfirm={handleConfirm} onCancel={handleCancel} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {(currentPage === PAGES.SIMULATOR || currentPage === PAGES.GAME) && (
        <QuantumGuide
          onTryInSimulator={handleTryInSimulator}
          lastAction={lastAction}
          circuit={currentPage === PAGES.GAME ? gameCircuit : circuit}
          measurementOutcome={measurementOutcome}
          gameStatus={currentPage === PAGES.GAME ? gameStatus : null}
          gameLevel={currentPage === PAGES.GAME ? gameLevel : 0}
          pageContext={currentPage === PAGES.GAME ? 'GAME' : 'SIMULATOR'}
        />
      )}
    </div>
  );
};

export default App;
