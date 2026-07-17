import { useState, useCallback, useEffect } from 'react';
import { PAGES } from './constants/pages';
import { INITIAL_STATE } from './constants/quantumGates';
import { STORAGE_KEY, QUANTUM_CONCEPTS } from './constants/quantumConcepts';
import { safeApplyGate, safeMeasureState } from './utils/quantumUtilsEnhanced';
import { safeGetStorage, safeSetStorage } from './utils/storageUtils';
import { useConfirm } from './hooks/useConfirm';
import { useToast, ToastContainer } from './components/Toast';
import ConfirmModal from './components/ConfirmModal';
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

const App = () => {
  const [currentPage, setCurrentPage] = useState(PAGES.LANDING);
  const [circuit, setCircuit] = useState([]);
  const [history, setHistory] = useState([INITIAL_STATE]);
  const [measurementOutcome, setMeasurementOutcome] = useState(null);
  const [lastAction, setLastAction] = useState("START");
  const [resourceLessonId, setResourceLessonId] = useState(null);

  // Jumps to the Quantum Learning Centre and opens the lesson matching the
  // gate the assistant is currently explaining — closes the Simulator → Resources loop.
  const handleViewLesson = useCallback((lessonId) => {
    setResourceLessonId(lessonId);
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
    } catch (error) {
      console.error('Error adding concept:', error);
      showToast('Failed to add concept. Please try again.', 'error');
    }
  }, [showToast]);

  // Delete handler
  const handleDeleteConcept = useCallback(async (conceptId) => {
    try {
      const confirmed = await requestConfirm({
          title: 'Delete this concept?',
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
    }

}, [requestConfirm, showToast]);
  
  // Current state is the last item in history
  const currentState = history[history.length - 1];

  // Logic for applying gates
  const applyNewGate = useCallback(async (gateName, matrix) => {
    try {
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

      // Apply gate with error handling
      const gateResult = safeApplyGate(matrix, currentState);
      
      if (!gateResult.success) {
        console.error('Gate application failed:', gateResult.error);
        showToast(`Error: ${gateResult.error}`, 'error');
        return;
      }

      setCircuit(prev => [...prev, gateName]);
      setLastAction(gateName);
      setHistory(prev => [...prev, gateResult.result]);
    } catch (error) {
      console.error('Unexpected error applying gate:', error);
      showToast('An unexpected error occurred. Please try again.', 'error');
    }
  }, [currentState, measurementOutcome, requestConfirm, showToast]);

  // Measurement handler
  const handleMeasure = useCallback(() => {
    try {
      // Prevent measurement if already collapsed
      if (measurementOutcome) return; 

      const measureResult = safeMeasureState(currentState);
      
      if (!measureResult.success) {
        console.error('Measurement failed:', measureResult.error);
        showToast(`Measurement error: ${measureResult.error}`, 'error');
        return;
      }

      // Update history with the collapsed state (new step, but no new gate)
      setHistory(prev => [...prev, measureResult.measuredState]); 

      setLastAction("MEASURE");
      setMeasurementOutcome(measureResult.outcome);
    } catch (error) {
      console.error('Unexpected error during measurement:', error);
      showToast('An unexpected error occurred during measurement. Please try again.', 'error');
    }
  }, [currentState, measurementOutcome, showToast]);

  // Reset handler
  const handleReset = useCallback(async () => {
    try {
      const confirmed = await requestConfirm({
          title: 'Reset the circuit?',
          message: 'This will clear all applied gates and return to the initial |00⟩ state.',
          confirmLabel: 'Reset',
          cancelLabel: 'Cancel',
      });

      if (!confirmed) {
          return;
      }

      setCircuit([]);
      setHistory([INITIAL_STATE]);
      setMeasurementOutcome(null);
      setLastAction("START");
    } catch (error) {
      console.error('Error resetting circuit:', error);
      showToast('An error occurred while resetting. Please try again.', 'error');
    }
  }, [requestConfirm, showToast]);

  // Undo handler
  const handleUndo = useCallback(() => {
    try {
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
      showToast('An error occurred while undoing. Please try again.', 'error');
    }
  }, [history.length, measurementOutcome, showToast]);

  // Conditional Rendering based on the current page state
  const renderPage = () => {
    switch (currentPage) {
      case PAGES.GAME:
        return <GameView setPage={setCurrentPage} />;
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
     {/* Header (Visible on all pages except Landing) */}
      <header className={`text-center p-6 bg-white ${currentPage === PAGES.LANDING ? 'hidden' : 'border-b-4 border-double border-black shadow-md'}`}>
        <h1 className="text-3xl font-extrabold tracking-tight">QUBIT SKETCHPAD</h1>
      </header>
      
      <main className="max-w-6xl mx-auto">
        {renderPage()}
      </main>
      
      <footer className="mt-12 text-center text-sm text-black border-t pt-4 pb-4">
        {(currentPage === PAGES.SIMULATOR || currentPage === PAGES.GAME) && (
          <p>System Note: State vector calculations use matrix multiplication for amplitude distribution.</p>
        )}
      </footer>

      <ConfirmModal dialogState={dialogState} onConfirm={handleConfirm} onCancel={handleCancel} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default App;
