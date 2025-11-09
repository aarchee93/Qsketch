import SketchButton from '../components/SketchButton';
import StateVisualization from '../components/StateVisualization';
import GatesPanel from '../components/GatesPanel';
import CircuitDisplay from '../components/CircuitDisplay';
import { PAGES } from '../constants/pages';

const SimulatorView = ({ 
  setPage, 
  circuit, 
  applyNewGate, 
  handleReset, 
  handleUndo, 
  currentState, 
  measurementOutcome, 
  handleMeasure,
  history 
}) => (
  <div className="p-4 md:p-8">
    <SketchButton className="mb-8" onClick={() => setPage(PAGES.LANDING)}>
      &larr; Back to Home
    </SketchButton>
    
    <section className="bg-white p-6 md:p-8 border-4 border-solid border-black rounded-xl shadow-[8px_8px_0_0_#000000]">
      <h2 className="text-3xl font-extrabold mb-6 text-center">The 2-Qubit Free Simulator</h2>
      <p className="text-center text-gray-700 mb-6 italic">Experiment freely by applying gates to the initial |00⟩ state.</p>
      
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Gates Panel */}
        <div className="lg:w-1/3">
          <GatesPanel 
            applyNewGate={applyNewGate}
            handleMeasure={handleMeasure}
            handleUndo={handleUndo}
            handleReset={handleReset}
            measurementOutcome={measurementOutcome}
            history={history}
          />
        </div>

        {/* Visualization and Circuit */}
        <div className="lg:w-2/3">
          
          {/* Visualization */}
          <div className="p-4 bg-white rounded-lg border-2 border-black shadow-xl">
            <h3 className="text-xl font-extrabold mb-4 text-center">Probability Distribution (|α|²)</h3>
            
            {/* OUTCOME DISPLAY */}
            {measurementOutcome && (
                <div className="mb-4 p-3 bg-black text-white border-2 border-black font-bold text-center rounded-lg shadow-inner animate-pulse">
                    MEASUREMENT COLLAPSE! The result was: 
                    <span className="text-2xl font-mono ml-2">
                        {measurementOutcome}
                    </span>
                </div>
            )}
            
            <StateVisualization stateVector={currentState} />
          </div>

          {/* Circuit History */}
          <CircuitDisplay circuit={circuit} />
        </div>
      </div>
    </section>
  </div>
);

export default SimulatorView;

