import { useEffect, useMemo, useRef, useState } from 'react';
import AnimatedNumber from './AnimatedNumber';

const EPSILON = 1e-6;

// State Visualization Component (Doodley Bar Chart)
// Amplitudes can be negative (quantum phase) — we show sign, not just |amplitude|^2,
// since the sign is what drives interference and is otherwise invisible to learners.
const StateVisualization = ({ stateVector, targetVector, measurementOutcome = null }) => {
  const probabilities = stateVector.map(amplitude => Math.pow(amplitude, 2));
  const targetProbabilities = targetVector ? targetVector.map(amplitude => Math.pow(amplitude, 2)) : [];

  const maxProb = Math.max(...probabilities, ...targetProbabilities, 0.01); // Ensure minimum value to avoid division by zero

  const basisStates = ['|00⟩', '|01⟩', '|10⟩', '|11⟩'];

  const getBarHeight = (prob) => maxProb > 0 ? `${Math.max(5, (prob / maxProb) * 90)}%` : '5%';

  const getSign = (amplitude) => {
    if (amplitude > EPSILON) return 1;
    if (amplitude < -EPSILON) return -1;
    return 0;
  };

  // Track which bars just changed so we can give them a brief glow pulse —
  // a lightweight "the machine just reacted to you" cue.
  const [glowingIndices, setGlowingIndices] = useState(new Set());
  const prevProbsRef = useRef(probabilities);

  useEffect(() => {
    const prev = prevProbsRef.current;
    const changed = new Set();
    probabilities.forEach((prob, index) => {
      if (Math.abs((prev[index] ?? 0) - prob) > 1e-6) {
        changed.add(index);
      }
    });

    if (changed.size > 0) {
      setGlowingIndices(changed);
      const timeout = setTimeout(() => setGlowingIndices(new Set()), 700);
      prevProbsRef.current = probabilities;
      return () => clearTimeout(timeout);
    }

    prevProbsRef.current = probabilities;
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateVector]);

  // Screen-reader-only summary announced whenever the state changes.
  const liveSummary = useMemo(() => {
    return probabilities
      .map((prob, i) => `${basisStates[i]}: ${(prob * 100).toFixed(0)} percent, amplitude ${getSign(stateVector[i]) < 0 ? 'negative' : 'positive'}`)
      .join('. ');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateVector]);

  const hasNegative = stateVector.some((a) => getSign(a) < 0);

  return (
    <div>
      <div
        className="flex justify-around items-end h-64 p-4 border-2 border-black bg-white rounded-lg shadow-lg mb-8"
        role="img"
        aria-label={`Probability distribution. ${liveSummary}`}
      >
        {probabilities.map((prob, index) => {
          const isTarget = targetVector && targetProbabilities[index] > 1e-9;
          const isGlowing = glowingIndices.has(index);
          const sign = getSign(stateVector[index]);
          const isNegative = sign < 0;
          const isCollapsedAway = measurementOutcome && basisStates[index] !== measurementOutcome;
          return (
            <div
              key={index}
              className={`flex flex-col items-center w-1/5 h-full relative ${
                isCollapsedAway ? 'opacity-15 transition-opacity duration-500' : 'transition-opacity duration-500'
              }`}
            >
              {/* Target Indicator (Game Mode Only) - Using pattern for black/white theme */}
              {isTarget && (
                 <div className="absolute top-[-10px] font-extrabold text-xl" aria-hidden="true">
                  ★
               </div>
              )}
              {isTarget && <span className="sr-only">Target basis state</span>}

              {/* Probability Text */}
              <div className="text-xs font-mono mb-1 absolute top-0">
                <AnimatedNumber value={prob * 100} formatter={(v) => `${v.toFixed(0)}%`} />
              </div>

              {/* Sign badge — negative amplitudes matter for interference */}
              {isNegative && (
                <div
                  className="absolute top-[16px] w-5 h-5 rounded-full border-2 border-black bg-white flex items-center justify-center text-xs font-extrabold"
                  aria-hidden="true"
                  title="Negative amplitude (phase flip)"
                >
                  −
                </div>
              )}

              {/* Doodley Bar — solid fill for positive amplitude, outlined for negative */}
              <div
                style={{ height: getBarHeight(prob) }}
                className={`w-full transition-all duration-500 ease-out rounded-t-sm absolute bottom-0 border-2 border-black ${
                  isNegative ? 'bg-white' : 'bg-black'
                } ${isGlowing ? 'animate-glow' : ''}`}
              >
                {/* Inner "interference" pattern - different pattern for targets */}
                <div className="absolute inset-0 bg-repeat" style={{
                  backgroundImage: isTarget
                    ? `repeating-linear-gradient(45deg, transparent, transparent 5px, ${isNegative ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.3)'} 5px, ${isNegative ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.3)'} 7px)`
                    : `repeating-linear-gradient(45deg, transparent, transparent 10px, ${isNegative ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)'} 10px, ${isNegative ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)'} 12px)`
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

      {hasNegative && (
        <p className="text-xs text-center mt-8 italic text-black/70">
          <span className="inline-block w-3 h-3 border-2 border-black bg-black align-middle mr-1" /> positive amplitude &nbsp;
          <span className="inline-block w-3 h-3 border-2 border-black bg-white align-middle mr-1" /> negative amplitude (phase flip) — cancels out on interference
        </p>
      )}

      {/* Live region for screen readers: announces state changes without visual clutter */}
      <p className="sr-only" aria-live="polite">{liveSummary}</p>
    </div>
  );
};

export default StateVisualization;
