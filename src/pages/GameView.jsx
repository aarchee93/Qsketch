import { useState, useEffect, useCallback } from 'react';
import SketchButton from '../components/SketchButton';
import StateVisualization from '../components/StateVisualization';
import { PAGES } from '../constants/pages';
import { INITIAL_STATE, H0, H1, X0, X1, CNOT } from '../constants/quantumGates';
import { LEVELS } from '../constants/gameLevels';
import { applyGate, isTargetReached } from '../utils/quantumUtils';

const GameView = ({ setPage }) => {
    const [level, setLevel] = useState(0); // Current level index
    const [circuit, setCircuit] = useState([]); // Array of applied gate names
    const [history, setHistory] = useState([INITIAL_STATE]); // State vector history
    const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
    const [moves, setMoves] = useState(0);

    const currentLevel = LEVELS[level];
    const currentState = history[history.length - 1];

    useEffect(() => {
        // Check win condition whenever the state updates
        if (isTargetReached(currentState, currentLevel.targetVector)) {
            setGameStatus('won');
        } else if (moves >= currentLevel.maxMoves) {
            setGameStatus('lost');
        }
    }, [currentState, currentLevel, moves]);

    const applyNewGate = useCallback((gateName, matrix) => {
        if (gameStatus !== 'playing') return;
        setCircuit(prev => [...prev, gateName]);
        const newState = applyGate(matrix, currentState);
        setHistory(prev => [...prev, newState]);
        setMoves(prev => prev + 1);
    }, [currentState, gameStatus]);

    const handleReset = useCallback(() => {
        setCircuit([]);
        setHistory([INITIAL_STATE]);
        setMoves(0);
        setGameStatus('playing');
    }, []);

    const handleNextLevel = useCallback(() => {
        if (level < LEVELS.length - 1) {
            setLevel(prev => prev + 1);
            handleReset();
        } else {
            setPage(PAGES.LANDING);
        }
    }, [level, handleReset, setPage]);

    const GameGatesPanel = () => (
        <div className="flex flex-col space-y-4 p-4 border-2 border-black bg-white rounded-lg shadow-xl">
            <h3 className="text-xl font-extrabold text-center border-b-2 border-dashed border-black pb-2">Available Gates</h3>
            <div className="grid grid-cols-2 gap-4">
                <SketchButton onClick={() => applyNewGate('H0', H0)} disabled={gameStatus !== 'playing'}>
                    Hadamard (Q0)
                </SketchButton>
                <SketchButton onClick={() => applyNewGate('H1', H1)} disabled={gameStatus !== 'playing'} variant="inverted">
                    Hadamard (Q1)
                </SketchButton>
                <SketchButton onClick={() => applyNewGate('X0', X0)} disabled={gameStatus !== 'playing'}>
                    Pauli-X (Q0)
                </SketchButton>
                <SketchButton onClick={() => applyNewGate('X1', X1)} disabled={gameStatus !== 'playing'} variant="inverted">
                    Pauli-X (Q1)
                </SketchButton>
                <SketchButton onClick={() => applyNewGate('CNOT', CNOT)} disabled={gameStatus !== 'playing'}>
                    CNOT
                </SketchButton>
            </div>
            
            <div className="flex justify-between pt-2 border-t-2 border-dashed border-black">
                <SketchButton onClick={handleReset} variant="inverted">
                    Reset Level
                </SketchButton>
                {gameStatus === 'won' && (
                    <SketchButton onClick={handleNextLevel} className="font-extrabold animate-pulse">
                        Next Level &rarr;
                    </SketchButton>
                )}
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8">
            <SketchButton className="mb-8" onClick={() => setPage(PAGES.LANDING)}>
                &larr; Back to Home
            </SketchButton>
            
            <section className="bg-white p-6 md:p-8 border-4 border-solid border-black rounded-xl shadow-[8px_8px_0_0_#000000]">
                <h2 className="text-3xl font-extrabold mb-4 text-center">Quantum Puzzle Solver</h2>
                
                {/* Level Status Box */}
                <div className={`p-4 mb-6 border-2 border-black font-bold ${gameStatus === 'won' ? 'bg-black text-white' : gameStatus === 'lost' ? 'bg-white border-black' : 'bg-white border-black'}`}>
                    <h3 className="text-2xl">Level {level + 1}: {currentLevel.name}</h3>
                    <p className="text-sm italic">{currentLevel.description}</p>
                    <p className="mt-2">
                        Moves: <strong>{moves} / {currentLevel.maxMoves}</strong> | Status: 
                        {gameStatus === 'won' && <span className="font-bold"> PUZZLE SOLVED!</span>}
                        {gameStatus === 'lost' && <span className="font-bold"> FAILED (Too Many Moves)</span>}
                        {gameStatus === 'playing' && <span> Playing...</span>}
                    </p>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Gates Panel */}
                    <div className="lg:w-1/3">
                        <GameGatesPanel />
                    </div>

                    {/* Visualization and Circuit */}
                    <div className="lg:w-2/3">
                        
                        {/* Visualization */}
                        <div className="p-4 bg-white rounded-lg border-2 border-black shadow-xl">
                            <h3 className="text-xl font-extrabold mb-8 text-center">Current State vs. Target State</h3>
                            <StateVisualization 
                                stateVector={currentState} 
                                targetVector={currentLevel.targetVector} 
                            />
                        </div>

                        {/* Circuit History */}
                        <div className="mt-6 p-4 border-2 border-black bg-white rounded-lg min-h-[100px] shadow-inner">
                            <h3 className="text-xl font-extrabold mb-3">Circuit Applied</h3>
                            <div className="flex flex-wrap gap-2 min-h-[40px]">
                                {circuit.length === 0 ? (
                                    <p className="text-gray-500 italic">Apply your first gate to Qubit 0!</p>
                                ) : (
                                    circuit.map((gate, index) => (
                                        <span key={index} className="px-3 py-1 bg-black text-white rounded-full text-sm font-mono shadow-md">
                                            {gate}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GameView;

