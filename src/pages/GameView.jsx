import { useState, useEffect, useCallback, useRef } from 'react';
import SketchButton from '../components/SketchButton';
import StateVisualization from '../components/StateVisualization';
import GatesPanel from '../components/GatesPanel';
import CircuitDisplay from '../components/CircuitDisplay';
import CircuitDiagram from '../components/CircuitDiagram';
import { AchievementUnlock, AchievementsGrid } from '../components/AchievementBadge';
import { Confetti } from '../components/Loading';
import LabConsole from '../components/LabConsole';
import IdleQubit from '../components/IdleQubit';
import DidYouKnow from '../components/DidYouKnow';
import AnimatedNumber from '../components/AnimatedNumber';
import OnboardingOverlay from '../components/OnboardingOverlay';
import { useLabConsole } from '../hooks/useLabConsole';
import { PAGES } from '../constants/pages';
import { GAME_ONBOARDING_STEPS } from '../constants/onboardingSteps';
import { hasSeenOnboarding, markOnboardingSeen } from '../utils/sessionFlags';
import { INITIAL_STATE } from '../constants/quantumGates';
import { LEVELS } from '../constants/gameLevels';
import { safeApplyGate, safeIsTargetReached } from '../utils/quantumUtilsEnhanced';
import { ACHIEVEMENTS, checkAchievements, getAchievementsWithStatus } from '../constants/achievements';
import { playSuccessSound, playAchievementSound, playErrorSound } from '../utils/soundUtils';
import {
  initializeGameProgress,
  saveLevelCompletion,
  saveAchievements,
  getAchievements,
  getLevelBestStats,
} from '../utils/gameProgressUtils';
import { useToast, ToastContainer } from '../components/Toast';

// Total achievement count for the badge counter denominator
const TOTAL_ACHIEVEMENTS = Object.keys(ACHIEVEMENTS).length;

const GameView = ({ setPage, onGameStateChange, onViewLesson }) => {
    const { toasts, showToast, removeToast } = useToast();
    const [level, setLevel] = useState(0);
    const [circuit, setCircuit] = useState([]);
    const [history, setHistory] = useState([INITIAL_STATE]);
    const [gameStatus, setGameStatus] = useState('playing');
    const [moves, setMoves] = useState(0);
    const startTimeRef = useRef(Date.now());
    const [usedUndo, setUsedUndo] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [unlockedAchievement, setUnlockedAchievement] = useState(null);
    const [completedLevels, setCompletedLevels] = useState([]);
    const [showAchievements, setShowAchievements] = useState(false);
    // Feature #8: live badge counter — re-read from storage when achievements change
    const [badgeCount, setBadgeCount] = useState(() => getAchievements().length);
    const consoleEntries = useLabConsole(circuit, null);
    const [showOnboarding, setShowOnboarding] = useState(!hasSeenOnboarding('game'));

    const closeOnboarding = () => {
        markOnboardingSeen('game');
        setShowOnboarding(false);
    };

    useEffect(() => {
        initializeGameProgress();
        const progress = initializeGameProgress();
        setCompletedLevels(progress.completedLevels);
    }, []);

    const currentLevel = LEVELS[level] ?? LEVELS[0]; // fallback keeps hooks stable
    const currentState = history[history.length - 1];
    const levelBestStats = getLevelBestStats(level);
    const difficulty = currentLevel.difficulty;

    // Lift game state up to App so QuantumGuide can react to challenge progress
    useEffect(() => {
        onGameStateChange?.({ gameStatus, circuit, level });
    }, [gameStatus, circuit, level]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        try {
            if (gameStatus === 'playing' && currentLevel) {
                const targetCheckResult = safeIsTargetReached(currentState, currentLevel.targetVector);
                
                if (targetCheckResult.error) {
                    console.error('Error checking target:', targetCheckResult.error);
                    return;
                }

                if (targetCheckResult.reached) {
                    setGameStatus('won');
                    setShowConfetti(true);

                    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
                    saveLevelCompletion(level, moves, timeSpent, usedUndo);

                    const newCompletedLevels = [...completedLevels, level];
                    const newAchievements = checkAchievements(
                      level,
                      moves,
                      currentLevel.maxMoves,
                      usedUndo,
                      newCompletedLevels,
                      timeSpent
                    );

                    const unlockedIds = getAchievements();
                    const actualNewAchievements = newAchievements.filter(
                      id => !unlockedIds.includes(id)
                    );

                    if (actualNewAchievements.length > 0) {
                      saveAchievements(actualNewAchievements);
                      const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === actualNewAchievements[0]);
                      setUnlockedAchievement(achievement);
                      playAchievementSound();
                      // Update live badge counter
                      setBadgeCount(getAchievements().length);
                    } else {
                      playSuccessSound();
                    }

                    showToast(
                      `🎉 Level ${level + 1} Complete! ${moves} moves used.`,
                      'success'
                    );
                } else if (moves >= currentLevel.maxMoves) {
                    setGameStatus('lost');
                    playErrorSound();
                    showToast(
                      `Too many moves! (${moves}/${currentLevel.maxMoves})`,
                      'error'
                    );
                }
            }
        } catch (error) {
            console.error('Error in win/loss check:', error);
            showToast('An error occurred. Please try again.', 'error');
        }
    }, [currentState, currentLevel, moves, gameStatus, usedUndo, completedLevels, level, showToast]);

    const applyNewGate = useCallback((gateName, matrix) => {
        try {
            if (gameStatus !== 'playing') return;
            
            const gateResult = safeApplyGate(matrix, currentState);
            
            if (!gateResult.success) {
                console.error('Gate application failed:', gateResult.error);
                showToast(`Error: ${gateResult.error}`, 'error');
                return;
            }

            setCircuit(prev => [...prev, gateName]);
            setHistory(prev => [...prev, gateResult.result]);
            setMoves(prev => prev + 1);
        } catch (error) {
            console.error('Unexpected error applying gate:', error);
            showToast('An unexpected error occurred. Please try again.', 'error');
        }
    }, [currentState, gameStatus, showToast]);

    const handleReset = useCallback(() => {
        setCircuit([]);
        setHistory([INITIAL_STATE]);
        setMoves(0);
        setGameStatus('playing');
        setShowConfetti(false);
        setUnlockedAchievement(null);
        setUsedUndo(false);
        startTimeRef.current = Date.now(); // reset per-attempt timer
    }, []);

    const handleUndo = useCallback(() => {
        if (history.length > 1 && gameStatus === 'playing') {
            setHistory(prev => prev.slice(0, -1));
            setCircuit(prev => prev.slice(0, -1));
            setMoves(prev => Math.max(0, prev - 1));
            setUsedUndo(true);
            showToast('Move undone!', 'info');
        }
    }, [history.length, gameStatus, showToast]);

    const handleNextLevel = useCallback(() => {
        if (level < LEVELS.length - 1) {
            setLevel(prev => prev + 1);
            setShowConfetti(false);
            setUnlockedAchievement(null);
            setUsedUndo(false);
            startTimeRef.current = Date.now();
            handleReset();
        } else {
            showToast('🎊 You completed all levels! Amazing!', 'success');
            setTimeout(() => setPage(PAGES.LANDING), 1000);
        }
    }, [level, showToast, setPage, handleReset]);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen animate-fade-in">
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
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                    <h2 className="text-3xl font-extrabold text-center md:text-left">Quantum Puzzle Solver</h2>
                    <div className="flex items-center gap-3">
                      <IdleQubit activityKey={`${circuit.length}-${gameStatus}`} />
                      {/* Feature #8: live badge counter */}
                      <button
                        onClick={() => setShowAchievements(true)}
                        className="flex items-center gap-1.5 border-2 border-black px-3 py-1 font-bold text-sm hover:bg-black hover:text-white transition-colors"
                        aria-label={`View achievements — ${badgeCount} of ${TOTAL_ACHIEVEMENTS} unlocked`}
                        title="View achievements"
                      >
                        <span aria-hidden="true">★</span>
                        <AnimatedNumber value={badgeCount} duration={400} />
                        <span className="font-normal opacity-60">/ {TOTAL_ACHIEVEMENTS}</span>
                      </button>
                    </div>
                </div>
                
                <div className="mb-6 p-3 bg-white border-2 border-black rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Progress: Level {level + 1} / {LEVELS.length}</span>
                    <span className="text-sm font-mono bg-black text-white px-2 py-1 rounded border border-black">
                      {difficulty.toUpperCase()}
                    </span>
                  </div>
                  <div className="bg-white border-2 border-black h-4 rounded overflow-hidden">
                    <div
                      className="bg-black h-full transition-all duration-500"
                      style={{ width: `${((level + 1) / LEVELS.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className={`p-4 mb-6 border-2 border-black font-bold rounded-lg ${gameStatus === 'won' ? 'bg-white animate-bounce-in' : gameStatus === 'lost' ? 'bg-gray-200' : 'bg-white'}`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-2xl">📌 {currentLevel.name}</h3>
                      {/* Feature #4: Learn-why deep-link to matching Resources lesson */}
                      {currentLevel.lessonId && onViewLesson && (
                        <button
                          onClick={() => onViewLesson(currentLevel.lessonId)}
                          className="shrink-0 text-xs font-bold border-2 border-black px-2 py-1 hover:bg-black hover:text-white transition-colors whitespace-nowrap"
                          title="Read the lesson behind this level"
                          aria-label="Read the related lesson in the Learning Centre"
                        >
                          📖 Learn why
                        </button>
                      )}
                    </div>
                    <p className="text-sm italic mb-3">{currentLevel.description}</p>
                    {currentLevel.hint && (
                      <p className="text-xs bg-white border border-black p-2 rounded mb-3 font-mono">
                        💡 Hint: {currentLevel.hint}
                      </p>
                    )}
                    {currentLevel.learningPoints && (
                      <p className="text-xs bg-white border border-black p-2 rounded mb-3 font-mono">
                        📚 Learning: {currentLevel.learningPoints}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <div>
                        Moves: <strong><AnimatedNumber value={moves} duration={250} /> / {currentLevel.maxMoves}</strong>
                      </div>
                      <div>
                        Status: 
                        {gameStatus === 'won' && <span className="font-bold ml-2 text-black">✓ SOLVED!</span>}
                        {gameStatus === 'lost' && <span className="font-bold ml-2 text-black">✗ FAILED</span>}
                        {gameStatus === 'playing' && <span className="ml-2">Playing...</span>}
                      </div>
                    </div>

                    {levelBestStats.completed && (
                      <div className="mt-3 pt-3 border-t text-xs text-black">
                        Best: {levelBestStats.bestMoves} moves | Attempts: {levelBestStats.attempts}
                      </div>
                    )}
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6">
                    
                    <div className="lg:w-1/3">
                        <GatesPanel
                            title="Available Gates"
                            applyNewGate={applyNewGate}
                            handleUndo={handleUndo}
                            handleReset={handleReset}
                            disabled={gameStatus !== 'playing'}
                            canUndo={history.length > 1 && gameStatus === 'playing'}
                            resetLabel="Reset Level"
                            extraButton={gameStatus === 'won' && (
    <SketchButton onClick={handleNextLevel} variant="inverted" className="font-extrabold animate-bounce-in">
        {level < LEVELS.length - 1 ? 'Next Level →' : '🏆 Complete!'}
    </SketchButton>
)}
                        />
                    </div>

                    <div className="lg:w-2/3 space-y-4">
                        
                        <div className="p-4 bg-white rounded-lg border-2 border-black shadow-xl">
                            <h3 className="text-xl font-extrabold mb-4 text-center">📊 Current vs. Target State</h3>
                            <StateVisualization 
                                stateVector={currentState} 
                                targetVector={currentLevel.targetVector} 
                            />
                        </div>

                        <CircuitDiagram circuit={circuit} />

                        <CircuitDisplay
                            circuit={circuit}
                            title="Circuit Applied"
                            emptyMessage="Apply your first gate to start!"
                        />

                        <LabConsole entries={consoleEntries} />
                    </div>
                </div>
            </section>

            <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

            {unlockedAchievement && (
              <AchievementUnlock
                achievement={unlockedAchievement}
                onClose={() => setUnlockedAchievement(null)}
              />
            )}

            {/* Achievements Drawer — shows all badges, toggled via button */}
            {showAchievements && (
              <div
                className="fixed inset-0 bg-black/40 z-40 flex items-end justify-center p-4"
                onClick={() => setShowAchievements(false)}
                role="presentation"
              >
                <div
                  className="bg-white border-4 border-black rounded-xl p-6 w-full max-w-2xl max-h-[70vh] overflow-y-auto shadow-[8px_8px_0_0_#000] animate-bounce-in"
                  onClick={e => e.stopPropagation()}
                  role="dialog"
                  aria-label="Achievements"
                  aria-modal="true"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-extrabold">Achievements</h2>
                    <button
                      onClick={() => setShowAchievements(false)}
                      className="border-2 border-black px-3 py-1 font-bold text-sm hover:bg-black hover:text-white transition-colors"
                      aria-label="Close achievements"
                    >✕</button>
                  </div>
                  <AchievementsGrid achievements={getAchievementsWithStatus(getAchievements())} />
                </div>
              </div>
            )}

            {/* Single ToastContainer for game-local toasts */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            <OnboardingOverlay
                open={showOnboarding}
                onClose={closeOnboarding}
                steps={GAME_ONBOARDING_STEPS}
                character="referee"
            />
        </div>
    );
};

export default GameView;