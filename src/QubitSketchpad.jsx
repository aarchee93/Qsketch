import React, { useState, useMemo, useCallback, useEffect } from 'react';

// --- Page Definitions ---
const PAGES = {
  LANDING: 'landing',
  SIMULATOR: 'simulator',
  DOCS: 'documentation',
  GAME: 'game',
};

// --- Linear Algebra Core & Gates ---

// Initial state: |00> (100% probability of 00)
const INITIAL_STATE = [1, 0, 0, 0]; 

const ONE_OVER_SQRT2 = 1 / Math.sqrt(2);

// Pauli-X (NOT) Gate on Qubit 0 (X ⊗ I)
const X0 = [
  [0, 0, 1, 0],
  [0, 0, 0, 1],
  [1, 0, 0, 0],
  [0, 1, 0, 0]
];

// Hadamard Gate on Qubit 0 (H ⊗ I)
const H0 = [
  [ONE_OVER_SQRT2, 0, ONE_OVER_SQRT2, 0],
  [0, ONE_OVER_SQRT2, 0, ONE_OVER_SQRT2],
  [ONE_OVER_SQRT2, 0, -ONE_OVER_SQRT2, 0],
  [0, ONE_OVER_SQRT2, 0, -ONE_OVER_SQRT2]
];

// CNOT Gate (Control Qubit 0, Target Qubit 1)
const CNOT = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 0, 1],
  [0, 0, 1, 0]
];

// --- Level Definitions for the Game ---

const LEVELS = [
    // Level 1: Classical NOT on Qubit 0 (Target |10>)
    {
        name: "Classical Flip",
        targetVector: [0, 0, 1, 0], 
        maxMoves: 3,
        description: "Your goal is to flip the first qubit (Q0) from |0> to |1>. Find the single gate that accomplishes this, using 3 moves or less.",
    },
    // Level 2: Superposition on Qubit 0 (Target Bell State |+> \otimes |0>)
    {
        name: "First Superposition",
        targetVector: [ONE_OVER_SQRT2, 0, ONE_OVER_SQRT2, 0],
        maxMoves: 2,
        description: "Create an equal superposition state on Qubit 0. The probability of measuring |0> or |1> should be 50%.",
    },
    // Level 3: Entanglement (Target Bell State |00> + |11>)
    {
        name: "Entangled Bell State",
        targetVector: [ONE_OVER_SQRT2, 0, 0, ONE_OVER_SQRT2],
        maxMoves: 4,
        description: "Create the famous Bell State where the two qubits are perfectly correlated. Only the |00> and |11> outcomes should have probability.",
    },
];

// --- Utility Functions ---

// Matrix multiplication function (M * V)
const applyGate = (matrix, vector) => {
  const result = new Array(vector.length).fill(0);
  const numericVector = vector.map(v => Number(v));

  for (let i = 0; i < matrix.length; i++) {
    let sum = 0;
    for (let j = 0; j < matrix[i].length; j++) {
      sum += matrix[i][j] * numericVector[j];
    }
    result[i] = sum;
  }
  return result;
};

// Check if two state vectors are "close enough" (handles floating point errors)
const isTargetReached = (current, target, tolerance = 1e-9) => {
    if (current.length !== target.length) return false;
    for (let i = 0; i < current.length; i++) {
        // Compare the squared magnitude (probability) for safety
        const currentProb = Math.pow(current[i], 2);
        const targetProb = Math.pow(target[i], 2);
        if (Math.abs(currentProb - targetProb) > tolerance) {
            return false;
        }
    }
    return true;
};

// --- UI Components ---

// Button styled for the "doodley" aesthetic
const SketchButton = ({ onClick, children, className = '', disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      px-4 py-2 border-2 border-gray-900 shadow-[4px_4px_0_0_#000000] 
      font-bold transition-all duration-100 ease-out 
      hover:shadow-[2px_2px_0_0_#000000] hover:translate-x-[2px] hover:translate-y-[2px]
      active:shadow-none active:translate-x-[4px] active:translate-y-[4px] 
      bg-white text-gray-900 text-sm md:text-base ${className} whitespace-nowrap
      disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed
    `}
  >
    {children}
  </button>
);

// State Visualization Component (Doodley Bar Chart)
const StateVisualization = ({ stateVector, targetVector }) => {
  const probabilities = stateVector.map(amplitude => Math.pow(amplitude, 2));
  const targetProbabilities = targetVector ? targetVector.map(amplitude => Math.pow(amplitude, 2)) : [];
  
  const maxProb = Math.max(...probabilities, ...targetProbabilities, 0.01); // Ensure minimum value to avoid division by zero

  const basisStates = ['|00⟩', '|01⟩', '|10⟩', '|11⟩'];
  
  const getBarHeight = (prob) => maxProb > 0 ? `${Math.max(5, (prob / maxProb) * 90)}%` : '5%';

  return (
    <div className="flex justify-around items-end h-64 p-4 border-2 border-gray-900 bg-gray-50 rounded-lg shadow-lg">
      {probabilities.map((prob, index) => (
        <div key={index} className="flex flex-col items-center w-1/5 h-full relative">
          {/* Target Indicator (Game Mode Only) */}
          {targetVector && targetProbabilities[index] > 1e-9 && (
             <div className="absolute top-[-10px] text-yellow-600 font-extrabold text-xl">
                ★
             </div>
          )}

          {/* Probability Text */}
          <div className="text-xs font-mono mb-1 absolute top-0">
            {`${(prob * 100).toFixed(0)}%`}
          </div>
          
          {/* Doodley Bar */}
          <div 
            style={{ height: getBarHeight(prob) }} 
            className={`w-full transition-all duration-500 ease-out rounded-t-sm absolute bottom-0 ${targetVector && targetProbabilities[index] > 1e-9 ? 'bg-green-700' : 'bg-gray-900'}`}
          >
            {/* Inner "interference" pattern */}
            <div className="absolute inset-0 opacity-10 bg-repeat" style={{ 
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 12px)' 
            }} />
          </div>

          {/* Label */}
          <div className="text-sm font-bold mt-2 absolute bottom-[-30px]">
            {basisStates[index]}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Game Logic Component ---

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
            // Note: Using a custom modal/message box instead of alert() for better UX.
            // For this quick fix, we'll revert to setPage. 
            // A full implementation would use a state variable to show a victory modal.
            setPage(PAGES.LANDING);
        }
    }, [level, handleReset, setPage]);


    const GameGatesPanel = () => (
        <div className="flex flex-col space-y-4 p-4 border-2 border-gray-900 bg-gray-100 rounded-lg shadow-xl">
            <h3 className="text-xl font-extrabold text-center border-b-2 border-dashed border-gray-400 pb-2">Available Gates</h3>
            <div className="grid grid-cols-2 gap-4">
                <SketchButton onClick={() => applyNewGate('H0', H0)} disabled={gameStatus !== 'playing'}>
                    Hadamard (Q0)
                </SketchButton>
                <SketchButton onClick={() => applyNewGate('CNOT', CNOT)} disabled={gameStatus !== 'playing'}>
                    CNOT
                </SketchButton>
                <SketchButton onClick={() => applyNewGate('X0', X0)} disabled={gameStatus !== 'playing'}>
                    Pauli-X (Q0)
                </SketchButton>
            </div>
            
            <div className="flex justify-between pt-2 border-t-2 border-dashed border-gray-400">
                <SketchButton onClick={handleReset} className="bg-red-300">
                    Reset Level
                </SketchButton>
                {gameStatus === 'won' && (
                    <SketchButton onClick={handleNextLevel} className="bg-green-400 font-extrabold animate-pulse">
                        Next Level &rarr;
                    </SketchButton>
                )}
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8">
            <SketchButton className="mb-8 bg-gray-200" onClick={() => setPage(PAGES.LANDING)}>
                &larr; Back to Home
            </SketchButton>
            
            <section className="bg-white p-6 md:p-8 border-4 border-solid border-gray-900 rounded-xl shadow-[8px_8px_0_0_#000000]">
                <h2 className="text-3xl font-extrabold mb-4 text-center">Quantum Puzzle Solver</h2>
                
                {/* Level Status Box */}
                <div className={`p-4 mb-6 border-2 font-bold ${gameStatus === 'won' ? 'bg-green-100 border-green-700' : gameStatus === 'lost' ? 'bg-red-100 border-red-700' : 'bg-gray-100 border-gray-500'}`}>
                    <h3 className="text-2xl">Level {level + 1}: {currentLevel.name}</h3>
                    <p className="text-sm italic">{currentLevel.description}</p>
                    <p className="mt-2">
                        Moves: <strong>{moves} / {currentLevel.maxMoves}</strong> | Status: 
                        {gameStatus === 'won' && <span className="text-green-700 font-bold"> PUZZLE SOLVED!</span>}
                        {gameStatus === 'lost' && <span className="text-red-700 font-bold"> FAILED (Too Many Moves)</span>}
                        {gameStatus === 'playing' && <span className="text-gray-900"> Playing...</span>}
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
                        <div className="p-4 bg-gray-100 rounded-lg border-2 border-gray-900 shadow-xl">
                            <h3 className="text-xl font-extrabold mb-8 text-center">Current State vs. Target State</h3>
                            <StateVisualization 
                                stateVector={currentState} 
                                targetVector={currentLevel.targetVector} 
                            />
                        </div>

                        {/* Circuit History */}
                        <div className="mt-6 p-4 border-2 border-gray-900 bg-white rounded-lg min-h-[100px] shadow-inner">
                            <h3 className="text-xl font-extrabold mb-3">Circuit Applied</h3>
                            <div className="flex flex-wrap gap-2 min-h-[40px]">
                                {circuit.length === 0 ? (
                                    <p className="text-gray-500 italic">Apply your first gate to Qubit 0!</p>
                                ) : (
                                    circuit.map((gate, index) => (
                                        <span key={index} className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm font-mono shadow-md">
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


// --- Page Components ---

const LandingPage = ({ setPage }) => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
    <h2 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter">Q-SKETCH</h2>
    <p className="text-xl md:text-2xl font-semibold mb-10 text-gray-700 italic">
      Your Interactive Quantum Mechanics and Computing Playground
    </p>
    <div className="space-y-4 md:space-y-0 md:flex md:space-x-6">
      <SketchButton className="w-full md:w-auto text-lg" onClick={() => setPage(PAGES.GAME)}>
        Play Quantum Puzzle
      </SketchButton>
      <SketchButton className="w-full md:w-auto text-lg bg-gray-300" onClick={() => setPage(PAGES.SIMULATOR)}>
        Open Free Simulator
      </SketchButton>
      <SketchButton className="w-full md:w-auto text-lg bg-gray-300" onClick={() => setPage(PAGES.DOCS)}>
        View Documentation
      </SketchButton>
    </div>
  </div>
);

const DocumentationPage = ({ setPage }) => (
  <div className="p-4 md:p-8">
    <SketchButton className="mb-8 bg-gray-200" onClick={() => setPage(PAGES.LANDING)}>
      &larr; Back to Home
    </SketchButton>
    
    <h2 className="text-3xl font-extrabold text-center border-b-4 border-double border-gray-900 pb-4 mb-8">Quantum Concepts: Documentation</h2>
    
    <div className="max-w-3xl mx-auto space-y-10">
      
      {/* 1. Superposition */}
      <div className="p-5 border-2 border-gray-900 rounded-lg bg-yellow-50 shadow-md">
        <h3 className="text-2xl font-bold mb-2">1. Superposition (H Gate)</h3>
        <p className="text-gray-700">
          A fundamental concept where a quantum object (qubit) exists in a combination of all its possible states simultaneously. Unlike a classical bit (which is either 0 or 1), a qubit is both |0⟩ and |1⟩.
        </p>
        <p className="mt-2 font-medium">
          The <strong>Hadamard (H) gate</strong> is used to create this equal superposition, turning |0⟩ into (1/√2)(|0⟩ + |1⟩), meaning there's a 50% chance of measuring |0⟩ and a 50% chance of measuring |1⟩.
        </p>
      </div>

      {/* 2. Entanglement */}
      <div className="p-5 border-2 border-gray-900 rounded-lg bg-green-50 shadow-md">
        <h3 className="text-2xl font-bold mb-2">2. Entanglement (CNOT Gate)</h3>
        <p className="text-gray-700">
          Entanglement is a deep, non-classical correlation between two or more qubits. Once two qubits are entangled, they share a single quantum state. Measuring one instantly tells you the state of the other, regardless of the distance between them.
        </p>
        <p className="mt-2 font-medium">
          The <strong>CNOT (Controlled-NOT) gate</strong> is essential for creating entanglement. When applied after the H gate on the first qubit, it creates a <strong>Bell State</strong> (e.g., |00⟩ + |11⟩), where only correlated outcomes are possible.
        </p>
      </div>
      
      {/* 3. Measurement (Wavefunction Collapse) */}
      <div className="p-5 border-2 border-gray-900 rounded-lg bg-red-50 shadow-md">
        <h3 className="text-2xl font-bold mb-2">3. Measurement and Collapse</h3>
        <p className="text-gray-700">
          Before measurement, a qubit is in superposition. <strong>Measurement</strong> is the act of reading the state, which forces the qubit to "collapse" instantly into a single classical state (|0⟩ or |1⟩) based on its probability distribution. The visualization in the simulator shows the <em>probabilities</em> before the collapse occurs.
        </p>
      </div>
      
      {/* 4. Interference */}
      <div className="p-5 border-2 border-gray-900 rounded-lg bg-blue-50 shadow-md">
        <h3 className="text-2xl font-bold mb-2">4. Quantum Interference</h3>
        <p className="text-gray-700">
          Interference occurs because probability amplitudes (the numbers in the state vector) are complex numbers, allowing them to have phase. When amplitudes for different paths to the same state are added:
        </p>
        {/* UL is now correctly a sibling of P */}
        <ul className="list-disc list-inside mt-2 ml-4 font-mono">
          <li><strong>Constructive Interference:</strong> Amplitudes reinforce each other (e.g., 1+1=2).</li>
          <li><strong>Destructive Interference:</strong> Amplitudes cancel each other (e.g., 1-1=0).</li>
        </ul>
        <p className="mt-2 font-medium">
          This is crucial for quantum algorithms, where we design gates to cause destructive interference on wrong answers and constructive interference on the right answer.
        </p>
      </div>
    </div>
  </div>
);

// --- Simulator View Component ---

const SimulatorView = ({ setPage, circuit, history, applyNewGate, handleReset, handleUndo, currentState, GatesPanel, CircuitDisplay }) => (
  <div className="p-4 md:p-8">
    <SketchButton className="mb-8 bg-gray-200" onClick={() => setPage(PAGES.LANDING)}>
      &larr; Back to Home
    </SketchButton>
    
    <section className="bg-white p-6 md:p-8 border-4 border-solid border-gray-900 rounded-xl shadow-[8px_8px_0_0_#000000]">
      <h2 className="text-3xl font-extrabold mb-6 text-center">The 2-Qubit Free Simulator</h2>
      <p className="text-center text-gray-700 mb-6 italic">Experiment freely by applying gates to the initial |00⟩ state.</p>
      
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Gates Panel */}
        <div className="lg:w-1/3">
          <GatesPanel circuit={circuit} history={history} applyNewGate={applyNewGate} handleReset={handleReset} handleUndo={handleUndo} />
        </div>

        {/* Visualization and Circuit */}
        <div className="lg:w-2/3">
          
          {/* Visualization */}
          <div className="p-4 bg-gray-100 rounded-lg border-2 border-gray-900 shadow-xl">
            <h3 className="text-xl font-extrabold mb-8 text-center">Probability Distribution (|α|²)</h3>
            <StateVisualization stateVector={currentState} />
          </div>

          {/* Circuit History */}
          <CircuitDisplay circuit={circuit} />
        </div>
      </div>
    </section>
  </div>
);

// --- Main Application Component ---

const App = () => {
  const [currentPage, setCurrentPage] = useState(PAGES.LANDING);
  const [circuit, setCircuit] = useState([]);
  const [history, setHistory] = useState([INITIAL_STATE]);
  
  // Current state is the last item in history
  const currentState = history[history.length - 1];

  // Logic for applying gates
  const applyNewGate = useCallback((gateName, matrix) => {
    setCircuit(prev => [...prev, gateName]);
    const newState = applyGate(matrix, currentState);
    // Note: The gate application already handles the multiplication
    setHistory(prev => [...prev, newState]);
  }, [currentState]);

  const handleReset = useCallback(() => {
    setCircuit([]);
    setHistory([INITIAL_STATE]);
  }, []);

  const handleUndo = useCallback(() => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
      setCircuit(prev => prev.slice(0, -1));
    }
  }, [history.length]);
  
  // UI for applying gates (Used in Simulator View)
  const GatesPanel = () => (
    <div className="flex flex-col space-y-4 p-4 border-2 border-gray-900 bg-gray-100 rounded-lg shadow-xl">
      <h3 className="text-xl font-extrabold text-center border-b-2 border-dashed border-gray-400 pb-2">Quantum Gates</h3>
      <div className="grid grid-cols-2 gap-4">
        <SketchButton onClick={() => applyNewGate('H0', H0)}>
          Hadamard (Q0)
          <span className="block text-xs font-normal">Superposition</span>
        </SketchButton>
        <SketchButton onClick={() => applyNewGate('CNOT', CNOT)}>
          CNOT (Q0 → Q1)
          <span className="block text-xs font-normal">Entanglement</span>
        </SketchButton>
        <SketchButton onClick={() => applyNewGate('X0', X0)}>
          Pauli-X (Q0)
          <span className="block text-xs font-normal">Flips Qubit</span>
        </SketchButton>
      </div>
      <div className="flex justify-between pt-2 border-t-2 border-dashed border-gray-400">
        <SketchButton onClick={handleUndo} className="bg-yellow-200" disabled={history.length === 1}>Undo</SketchButton>
        <SketchButton onClick={handleReset} className="bg-red-300">Reset</SketchButton>
      </div>
    </div>
  );
  
  // Circuit History Display (Used in Simulator View)
  const CircuitDisplay = ({ circuit }) => (
    <div className="mt-6 p-4 border-2 border-gray-900 bg-white rounded-lg min-h-[100px] shadow-inner">
      <h3 className="text-xl font-extrabold mb-3">Circuit History</h3>
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {circuit.length === 0 ? (
          <p className="text-gray-500 italic">Start by applying a gate!</p>
        ) : (
          circuit.map((gate, index) => (
            <span key={index} className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm font-mono shadow-md">
              {gate}
            </span>
          ))
        )}
      </div>
    </div>
  );

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
            GatesPanel={GatesPanel}
            CircuitDisplay={CircuitDisplay}
          />
        );
      case PAGES.DOCS:
        return <DocumentationPage setPage={setCurrentPage} />;
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
      
      {/* Header (Visible on Docs/Simulator, full title on Landing) */}
      <header className={`text-center p-6 bg-white ${currentPage === PAGES.LANDING ? 'hidden' : 'border-b-4 border-double border-gray-900 shadow-md'}`}>
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