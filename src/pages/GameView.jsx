import { useState, useEffect, useCallback } from 'react';
import SketchButton from '../components/SketchButton';
import StateVisualization from '../components/StateVisualization';
import GatesPanel from '../components/GatesPanel';
import CircuitDisplay from '../components/CircuitDisplay';
import CircuitDiagram from '../components/CircuitDiagram';
import { AchievementUnlock } from '../components/AchievementBadge';
import { Confetti } from '../components/Loading';
import { useToast, ToastContainer } from '../components/Toast';
import LabConsole from '../components/LabConsole';
import IdleQubit from '../components/IdleQubit';
import DidYouKnow from '../components/DidYouKnow';
import AnimatedNumber from '../components/AnimatedNumber';
import OnboardingOverlay from '../components/OnboardingOverlay';
import { useLabConsole } from '../hooks/useLabConsole';
import { PAGES } from '../constants/pages';
import { GAME_ONBOARDING_STEPS } from '../constants/onboardingSteps';
import { hasSeenOnboarding, markOnboardingSeen } from '../utils/sessionFlags';
import { INITIAL_STATE, H0, H1, X0, X1, CNOT } from '../constants/quantumGates';
import { LEVELS } from '../constants/gameLevels';
import { safeApplyGate, safeIsTargetReached } from '../utils/quantumUtilsEnhanced';
import { ACHIEVEMENTS, checkAchievements } from '../constants/achievements';
import {
  initializeGameProgress,
  saveLevelCompletion,
  saveAchievements,
  getAchievements,
  getLevelBestStats,
} from '../utils/gameProgressUtils';

const GameView = ({ setPage }) => {
    const { toasts, showToast, removeToast } = useToast();
    const [level, setLevel] = useState(0);
    const [circuit, setCircuit] = useState([]);
    const [history, setHistory] = useState([INITIAL_STATE]);
    const [gameStatus, setGameStatus] = useState('playing');
    const [moves, setMoves] = useState(0);
    const [startTime] = useState(Date.now());
    const [usedUndo, setUsedUndo] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [unlockedAchievement, setUnlockedAchievement] = useState(null);
    const [completedLevels, setCompletedLevels] = useState([]);
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

    const currentLevel = LEVELS[level];
    const currentState = history[history.length - 1];
    const levelBestStats = getLevelBestStats(level);
    const difficulty = currentLevel.difficulty;

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

                    const timeSpent = Math.round((Date.now() - startTime) / 1000);
                    saveLevelCompletion(level, moves, timeSpent, usedUndo);

                    const newCompletedLevels = [...completedLevels, level];
                    const newAchievements = checkAchievements(
                      level,
                      moves,
                      currentLevel.maxMoves,
                      usedUndo,
                      newCompletedLevels
                    );

                    const unlockedIds = getAchievements();
                    const actualNewAchievements = newAchievements.filter(
                      id => !unlockedIds.includes(id)
                    );

                    if (actualNewAchievements.length > 0) {
                      saveAchievements(actualNewAchievements);
                      const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === actualNewAchievements[0]);
                      setUnlockedAchievement(achievement);
                    }

                    showToast(
                      `🎉 Level ${level + 1} Complete! ${moves} moves used.`,
                      'success'
                    );
                } else if (moves >= currentLevel.maxMoves) {
                    setGameStatus('lost');
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
    }, [currentState, currentLevel, moves, gameStatus, startTime, usedUndo, completedLevels, level, showToast]);

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
                    <h2 className="text-3xl font-extrabold text-center md:text-left">🎮 Quantum Puzzle Solver</h2>
                    <IdleQubit activityKey={`${circuit.length}-${gameStatus}`} />
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
                    <h3 className="text-2xl mb-2">📌 {currentLevel.name}</h3>
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

            <ToastContainer toasts={toasts} onRemove={removeToast} />

            <OnboardingOverlay
                open={showOnboarding}
                onClose={closeOnboarding}
                steps={GAME_ONBOARDING_STEPS}
            />
        </div>
    );
};

export default GameView;
