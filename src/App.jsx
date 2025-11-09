import { useState, useCallback, useEffect } from 'react';
import { PAGES } from './constants/pages';
import { INITIAL_STATE } from './constants/quantumGates';
import { STORAGE_KEY, QUANTUM_CONCEPTS } from './constants/quantumConcepts';
import { applyGate, measureState } from './utils/quantumUtils';
import LandingPage from './pages/LandingPage';
import CMSPage from './pages/CMSPage';
import ResourcesPage from './pages/ResourcesPage';
import SimulatorView from './pages/SimulatorView';
import GameView from './pages/GameView';

const App = () => {
  const [currentPage, setCurrentPage] = useState(PAGES.LANDING);
  const [circuit, setCircuit] = useState([]);
  const [history, setHistory] = useState([INITIAL_STATE]);
  const [measurementOutcome, setMeasurementOutcome] = useState(null);
  
  // CMS/LOCAL STORAGE LOGIC
  const [concepts, setConcepts] = useState([]);

  // Load concepts from localStorage on component mount
  useEffect(() => {
    const storedConcepts = localStorage.getItem(STORAGE_KEY);
    if (storedConcepts) {
      setConcepts(JSON.parse(storedConcepts));
    } else {
      // Initialize with hardcoded data if nothing is stored
      localStorage.setItem(STORAGE_KEY, JSON.stringify(QUANTUM_CONCEPTS));
      setConcepts(QUANTUM_CONCEPTS);
    }
  }, []);

  // Handler to add a new concept (passed down to the editor component)
  const handleAddConcept = useCallback((newConcept) => {
    const conceptWithId = { 
        ...newConcept, 
        id: Date.now().toString() // Simple unique ID
    };

    setConcepts(prev => {
        const updatedConcepts = [...prev, conceptWithId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConcepts));
        return updatedConcepts;
    });
  }, []);

  // Delete handler
  const handleDeleteConcept = useCallback((conceptId) => {
    setConcepts(prev => {
        // Filter out the concept with the matching ID
        const updatedConcepts = prev.filter(c => c.id !== conceptId);
        
        // Update Local Storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConcepts));
        
        // Return the new list for the state
        return updatedConcepts;
    });
  }, []);
  
  // Current state is the last item in history
  const currentState = history[history.length - 1];

  // Logic for applying gates
  const applyNewGate = useCallback((gateName, matrix) => {
    // Reset measurement on new gate
    if (measurementOutcome !== null) {
        setMeasurementOutcome(null);
    }
    setCircuit(prev => [...prev, gateName]);
    const newState = applyGate(matrix, currentState);
    setHistory(prev => [...prev, newState]);
  }, [currentState, measurementOutcome]);

  // Measurement handler
  const handleMeasure = useCallback(() => {
    // Prevent measurement if already collapsed
    if (measurementOutcome) return; 

    const { measuredState, outcome } = measureState(currentState);

    // Update history with the collapsed state (new step, but no new gate)
    setHistory(prev => [...prev, measuredState]); 

    setMeasurementOutcome(outcome);
  }, [currentState, measurementOutcome]);

  const handleReset = useCallback(() => {
    setCircuit([]);
    setHistory([INITIAL_STATE]);
    setMeasurementOutcome(null);
  }, []);

  const handleUndo = useCallback(() => {
    if (measurementOutcome) {
        // If the last step was a measurement, simply undo the collapse
        setHistory(prev => prev.slice(0, -1));
        setMeasurementOutcome(null);
    } else if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
      setCircuit(prev => prev.slice(0, -1));
    }
  }, [history.length, measurementOutcome]);

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
            applyNewGate={applyNewGate}
            handleReset={handleReset}
            handleUndo={handleUndo}
            currentState={currentState}
            measurementOutcome={measurementOutcome}
            handleMeasure={handleMeasure}
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
        return <ResourcesPage setPage={setCurrentPage} />;
      case PAGES.LANDING:
      default:
        return <LandingPage setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <style>{`
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      
      {/* Header (Visible on all pages except Landing) */}
      <header className={`text-center p-6 bg-white ${currentPage === PAGES.LANDING ? 'hidden' : 'border-b-4 border-double border-black shadow-md'}`}>
        <h1 className="text-3xl font-extrabold tracking-tight">QUBIT SKETCHPAD</h1>
      </header>
      
      <main className="max-w-6xl mx-auto">
        {renderPage()}
      </main>
      
      <footer className="mt-12 text-center text-sm text-gray-500 border-t pt-4 pb-4">
        {(currentPage === PAGES.SIMULATOR || currentPage === PAGES.GAME) && (
          <p>System Note: State vector calculations use matrix multiplication for amplitude distribution.</p>
        )}
      </footer>
    </div>
  );
};

export default App;
