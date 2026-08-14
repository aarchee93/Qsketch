import { useState, useCallback, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { INITIAL_STATE } from './constants/quantumGates';
import { STORAGE_KEY, QUANTUM_CONCEPTS } from './constants/quantumConcepts';
import { safeApplyGate, safeMeasureState } from './utils/quantumUtilsEnhanced';
import { safeGetStorage, safeSetStorage } from './utils/storageUtils';
import { useConfirm } from './hooks/useConfirm';
import { useToast, ToastContainer } from './components/Toast';
import { playMeasureSound, playSuccessSound, playErrorSound, isMuted, setMuted, playClickSound } from './utils/soundUtils';
import ConfirmModal from './components/ConfirmModal';
import QuantumGuide from './components/QuantumGuide/QuantumGuide';
import LandingPage from './pages/LandingPage';
import CMSPage from './pages/CMSPage';
import ResourcesPage from './pages/ResourcesPage';
import SimulatorView from './pages/SimulatorView';
import GameView from './pages/GameView';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import { 
  initializeConcepts as initializeConceptsFromSupabase,
  addConcept as addConceptToSupabase,
  deleteConcept as deleteConceptFromSupabase
} from './utils/supabaseConceptsUtils';
import { onAuthStateChange, signOut } from './utils/supabaseAuth';

const GATE_ANIMATION_MS = 550;
const MEASURE_ANIMATION_MS = 600;
const RESET_ANIMATION_MS = 450;

// Profile Menu Button Component
const ProfileMenuButton = ({ user, muted, onToggleMute, onProfile, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleProfileClick = () => {
    playClickSound();
    onProfile();
    setIsOpen(false);
  };

  const handleMuteClick = () => {
    playClickSound();
    onToggleMute();
  };

  const handleLogoutClick = () => {
    playClickSound();
    onLogout();
    setIsOpen(false);
  };

  return (
    <div className="fixed top-6 right-6 z-40" ref={menuRef}>
      <button
        onClick={() => {
          playClickSound();
          setIsOpen(!isOpen);
        }}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-white border-2 border-black text-black font-bold text-lg hover:bg-black hover:text-white hover:shadow-[4px_4px_0_0_#000000] transition-all duration-100 active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        title="Profile menu"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </button>

      {/* Dropdown Menu - Click-based with fade transition */}
      {isOpen && (
        <div className="absolute top-14 right-0 w-52 bg-white border-2 border-black rounded-lg shadow-[8px_8px_0_0_#000000] z-50 animate-fade-in">
          <button
            onClick={handleProfileClick}
            className="w-full text-left px-4 py-3 border-b-2 border-black hover:bg-black hover:text-white transition-colors font-semibold text-black flex items-center gap-3 active:translate-x-[1px] active:translate-y-[1px]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Profile
          </button>

          <button
            onClick={handleMuteClick}
            className="w-full text-left px-4 py-3 border-b-2 border-black hover:bg-black hover:text-white transition-colors font-semibold text-black flex items-center justify-between gap-3 active:translate-x-[1px] active:translate-y-[1px]"
            title={muted ? 'Unmute' : 'Mute'}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
              Sound
            </div>
            <span className="text-sm font-bold">{muted ? '✕' : '✓'}</span>
          </button>

          <button
            onClick={handleLogoutClick}
            className="w-full text-left px-4 py-3 hover:bg-black hover:text-white transition-colors font-semibold text-black flex items-center gap-3 active:translate-x-[1px] active:translate-y-[1px]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ children, user, isGuest, isAuthLoading, requiredAuth = true }) => {
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-spin">⟳</div>
          <p className="text-xl font-bold">Initializing Quantum Sketchpad...</p>
        </div>
      </div>
    );
  }

  // If authentication is required and user is not authenticated/guest
  if (requiredAuth && !user && !isGuest) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

// App Content (uses Router hooks)
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Guest mode state
  const [isGuest, setIsGuest] = useState(() => {
    try {
      return sessionStorage.getItem('isGuestMode') === 'true';
    } catch {
      return false;
    }
  });
  const [guestHasData, setGuestHasData] = useState(false);
  const [savedSimulatorState, setSavedSimulatorState] = useState(null);

  // Circuit and game state
  const [circuit, setCircuit] = useState([]);
  const [history, setHistory] = useState([INITIAL_STATE]);
  const [measurementOutcome, setMeasurementOutcome] = useState(null);
  const [lastAction, setLastAction] = useState("START");
  const [resourceLessonId, setResourceLessonId] = useState(null);
  const [guidedConfig, setGuidedConfig] = useState(null);

  // Auth state
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Lifted game state
  const [gameStatus, setGameStatus] = useState(null);
  const [gameCircuit, setGameCircuit] = useState([]);
  const [gameLevel, setGameLevel] = useState(0);

  // Animation state
  const [pendingGate, setPendingGate] = useState(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [muted, setMutedState] = useState(() => isMuted());

  const toggleMute = useCallback(() => {
    setMuted(!isMuted());
    setMutedState(isMuted());
  }, []);

  // Guest mode handlers
  const startGuestMode = useCallback(() => {
    try {
      sessionStorage.setItem('isGuestMode', 'true');
      setIsGuest(true);
      navigate('/');
    } catch (error) {
      console.error('Failed to start guest mode:', error);
    }
  }, [navigate]);

  const exitGuestMode = useCallback(() => {
    try {
      sessionStorage.removeItem('isGuestMode');
      setIsGuest(false);
      setGuestHasData(false);
      navigate('/auth');
    } catch (error) {
      console.error('Failed to exit guest mode:', error);
    }
  }, [navigate]);

  const handleGuestSignIn = useCallback(() => {
    if (guestHasData) {
      const confirmed = window.confirm(
        'You have unsaved progress. If you sign in now, your guest progress will be lost (not carried over to your account).\n\nContinue to sign in?'
      );
      if (!confirmed) return;
    }
    exitGuestMode();
  }, [guestHasData, exitGuestMode]);

  // Save/restore simulator state
  const saveSimulatorState = useCallback(() => {
    if (isGuest && (circuit.length > 0 || measurementOutcome)) {
      setSavedSimulatorState({ circuit, history, measurementOutcome, lastAction });
      setGuestHasData(true);
    }
  }, [isGuest, circuit, history, measurementOutcome, lastAction]);

  const restoreSimulatorState = useCallback(() => {
    if (savedSimulatorState) {
      setCircuit(savedSimulatorState.circuit);
      setHistory(savedSimulatorState.history);
      setMeasurementOutcome(savedSimulatorState.measurementOutcome);
      setLastAction(savedSimulatorState.lastAction);
    }
  }, [savedSimulatorState]);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange((event, currentUser, session) => {
      setUser(currentUser);
      setIsAuthLoading(false);

      if (currentUser) {
        setIsGuest(false);
        // Only navigate to landing on initial auth (from /auth page during signup)
        // Don't force redirect if already authenticated
      } else if (!isGuest) {
        navigate('/auth');
      }
    });

    return () => unsubscribe?.();
  }, [isGuest, navigate]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  // Restore simulator on route to simulator
  useEffect(() => {
    if (location.pathname === '/simulator') {
      restoreSimulatorState();
    }
  }, [location.pathname, restoreSimulatorState]);

  // Warn guest before unload
  useEffect(() => {
    if (!isGuest || !guestHasData) return;

    const handleBeforeUnload = (e) => {
      const message = 'You have unsaved progress. Sign in to save your quantum learning journey!';
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isGuest, guestHasData]);

  // Concepts management
  const [concepts, setConcepts] = useState([]);

  useEffect(() => {
    initializeConceptsFromSupabase().then(conceptsList => {
      setConcepts(conceptsList);
    }).catch(err => {
      console.error('Error loading concepts:', err);
      const storedConcepts = safeGetStorage(STORAGE_KEY, null);
      if (storedConcepts && Array.isArray(storedConcepts)) {
        setConcepts(storedConcepts);
      }
    });
  }, []);

  // Modal and toast
  const { dialogState, requestConfirm, handleConfirm, handleCancel } = useConfirm();
  const { toasts, showToast, removeToast } = useToast();

  // Concept handlers
  const handleAddConcept = useCallback((newConcept) => {
    try {
      addConceptToSupabase(newConcept).then(result => {
        if (result.success) {
          setConcepts(prev => {
            const updated = [...prev, result.data];
            safeSetStorage(STORAGE_KEY, updated);
            return updated;
          });
          showToast('Concept added to your research library.', 'success');
          playSuccessSound();
        } else {
          showToast(`Failed to add concept: ${result.error}`, 'error');
          playErrorSound();
        }
      });
    } catch (error) {
      console.error('Error adding concept:', error);
      showToast('Failed to add concept. Please try again.', 'error');
      playErrorSound();
    }
  }, [showToast]);

  const handleDeleteConcept = useCallback(async (conceptId) => {
    try {
      const confirmed = await requestConfirm({
        title: 'Delete this concept from your research library?',
        message: 'This will remove the concept from your library. This cannot be undone.',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        danger: true,
      });

      if (!confirmed) return;

      const result = await deleteConceptFromSupabase(conceptId);
      if (result.success) {
        setConcepts(prev => {
          const updatedConcepts = prev.filter(c => c.id !== conceptId);
          safeSetStorage(STORAGE_KEY, updatedConcepts);
          return updatedConcepts;
        });
        showToast('Concept deleted.', 'success');
      } else {
        showToast(`Failed to delete: ${result.error}`, 'error');
        playErrorSound();
      }
    } catch (error) {
      console.error('Error deleting concept:', error);
      showToast('Failed to delete concept. Please try again.', 'error');
      playErrorSound();
    }
  }, [requestConfirm, showToast]);

  // Quantum logic
  const currentState = history[history.length - 1];

  const handleViewLesson = useCallback((lessonId) => {
    saveSimulatorState();
    setResourceLessonId(lessonId);
    navigate(`/resources/${lessonId}`);
  }, [saveSimulatorState, navigate]);

  const handleTryInSimulator = useCallback((config = null) => {
    setCircuit([]);
    setHistory([INITIAL_STATE]);
    setMeasurementOutcome(null);
    setLastAction("START");
    setGuidedConfig(config);
    navigate('/simulator');
  }, [navigate]);

  const handleExitGuided = useCallback(() => {
    setGuidedConfig(null);
    navigate('/resources');
  }, [navigate]);

  const applyNewGate = useCallback(async (gateName, matrix) => {
    try {
      if (pendingGate || isMeasuring || isResetting) return;

      if (measurementOutcome !== null) {
        const continueCircuit = await requestConfirm({
          title: 'Start a new experiment?',
          message: 'The circuit has already been measured.\n\nApplying a new gate will start a new experiment.',
          confirmLabel: 'Start New Experiment',
          cancelLabel: 'Cancel',
        });

        if (!continueCircuit) return;

        setCircuit([]);
        setHistory([INITIAL_STATE]);
        setMeasurementOutcome(null);
      }

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

  const handleReset = useCallback(async () => {
    try {
      const confirmed = await requestConfirm({
        title: 'Reset Experiment?',
        message: 'This will clear all applied gates and return to the initial |00⟩ state.',
        confirmLabel: 'Reset Experiment',
        cancelLabel: 'Cancel',
      });

      if (!confirmed) return;

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

  const handleUndo = useCallback(() => {
    try {
      if (pendingGate || isMeasuring || isResetting) return;
      if (measurementOutcome) {
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

  const isLandingOrAuth = location.pathname === '/' || location.pathname === '/auth';

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <style>{`body { font-family: 'Inter', sans-serif; }`}</style>

      <main className="max-w-6xl mx-auto animate-page-transition">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/auth" 
            element={<AuthPage onAuthSuccess={() => startGuestMode()} />} 
          />
          <Route
            path="/simulator"
            element={
              <ProtectedRoute user={user} isGuest={isGuest} isAuthLoading={isAuthLoading}>
                <SimulatorView
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
                  onLeavePage={() => saveSimulatorState()}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game"
            element={
              <ProtectedRoute user={user} isGuest={isGuest} isAuthLoading={isAuthLoading}>
                <GameView
                  onViewLesson={handleViewLesson}
                  onGameStateChange={({ gameStatus, circuit: gameCircuit, level }) => {
                    setGameStatus(gameStatus);
                    setGameCircuit(gameCircuit);
                    setGameLevel(level);
                    if (isGuest) setGuestHasData(true);
                  }}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute user={user} isGuest={isGuest} isAuthLoading={isAuthLoading}>
                <ResourcesPage
                  deepLinkLessonId={resourceLessonId}
                  onDeepLinkHandled={() => setResourceLessonId(null)}
                  onTryInSimulator={handleTryInSimulator}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources/:lessonId"
            element={
              <ProtectedRoute user={user} isGuest={isGuest} isAuthLoading={isAuthLoading}>
                <ResourcesPage
                  deepLinkLessonId={resourceLessonId}
                  onDeepLinkHandled={() => setResourceLessonId(null)}
                  onTryInSimulator={handleTryInSimulator}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cms"
            element={
              <ProtectedRoute user={user} isGuest={isGuest} isAuthLoading={isAuthLoading}>
                <CMSPage
                  concepts={concepts}
                  onAddConcept={handleAddConcept}
                  onDeleteConcept={handleDeleteConcept}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user} isGuest={isGuest} isAuthLoading={isAuthLoading}>
                <ProfilePage user={user} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Profile Button - Show on all pages */}
      {user && (
        <ProfileMenuButton
          user={user}
          muted={muted}
          onToggleMute={toggleMute}
          onProfile={() => navigate('/profile')}
          onLogout={async () => {
            saveSimulatorState();
            const result = await signOut();
            if (result.success) {
              playSuccessSound();
              showToast('Logged out successfully', 'success');
            } else {
              playErrorSound();
              showToast(`Logout failed: ${result.error}`, 'error');
            }
          }}
        />
      )}

      {/* Sign In Button - Show on landing for guests */}
      {isGuest && location.pathname === '/' && (
        <div className="fixed top-6 right-6 z-40">
          <button
            onClick={() => {
              playClickSound();
              handleGuestSignIn();
            }}
            className="px-6 py-3 bg-white border-2 border-black rounded-lg font-bold hover:bg-black hover:text-white hover:shadow-[4px_4px_0_0_#000000] transition-all text-sm active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            title="Sign in to save progress"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Modals and Components */}
      <footer className="mt-12 text-center text-sm text-black border-t pt-4 pb-4">
        {(location.pathname === '/simulator' || location.pathname === '/game') && (
          <p>System Note: State vector calculations use matrix multiplication for amplitude distribution.</p>
        )}
      </footer>

      <ConfirmModal dialogState={dialogState} onConfirm={handleConfirm} onCancel={handleCancel} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {(location.pathname === '/simulator' || location.pathname === '/game') && (
        <QuantumGuide
          onTryInSimulator={handleTryInSimulator}
          lastAction={lastAction}
          circuit={location.pathname === '/game' ? gameCircuit : circuit}
          measurementOutcome={measurementOutcome}
          gameStatus={location.pathname === '/game' ? gameStatus : null}
          gameLevel={location.pathname === '/game' ? gameLevel : 0}
          pageContext={location.pathname === '/game' ? 'GAME' : 'SIMULATOR'}
        />
      )}
    </div>
  );
};

// Root App with Router
const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
