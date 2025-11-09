// State Visualization Component (Doodley Bar Chart)
const StateVisualization = ({ stateVector, targetVector }) => {
  const probabilities = stateVector.map(amplitude => Math.pow(amplitude, 2));
  const targetProbabilities = targetVector ? targetVector.map(amplitude => Math.pow(amplitude, 2)) : [];
  
  const maxProb = Math.max(...probabilities, ...targetProbabilities, 0.01); // Ensure minimum value to avoid division by zero

  const basisStates = ['|00⟩', '|01⟩', '|10⟩', '|11⟩'];
  
  const getBarHeight = (prob) => maxProb > 0 ? `${Math.max(5, (prob / maxProb) * 90)}%` : '5%';

  return (
    <div className="flex justify-around items-end h-64 p-4 border-2 border-black bg-white rounded-lg shadow-lg">
      {probabilities.map((prob, index) => {
        const isTarget = targetVector && targetProbabilities[index] > 1e-9;
        return (
          <div key={index} className="flex flex-col items-center w-1/5 h-full relative">
            {/* Target Indicator (Game Mode Only) - Using pattern for black/white theme */}
            {isTarget && (
               <div className="absolute top-[-10px] font-extrabold text-xl">
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
              className={`w-full transition-all duration-500 ease-out rounded-t-sm absolute bottom-0 ${isTarget ? 'bg-black' : 'bg-black'}`}
            >
              {/* Inner "interference" pattern - different pattern for targets */}
              <div className="absolute inset-0 bg-repeat" style={{ 
                backgroundImage: isTarget 
                  ? 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 7px)'
                  : 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 12px)' 
              }} />
            </div>

            {/* Label */}
            <div className="text-sm font-bold mt-2 absolute bottom-[-30px]">
              {basisStates[index]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StateVisualization;

