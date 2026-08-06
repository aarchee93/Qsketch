import { useEffect, useRef, useState } from 'react';
import SketchButton from './SketchButton';
import MascotCharacter from './MascotCharacter';

/**
 * GuidedStepper
 *
 * Replaces the static guided-mode banner with a live step-by-step walkthrough.
 * Each step has:
 *   instruction  {string}  what to do right now
 *   expectAction {string}  gate/event name that counts as "completing" this step
 *   observation  {string}  what the user should notice once it fires
 *
 * As `lastAction` changes, the stepper automatically advances when the
 * correct action is performed. The user can never advance by clicking —
 * they must actually apply the gate.
 *
 * Props
 * ─────
 * steps        {Array}          array of { instruction, expectAction, observation }
 * lastAction   {string}         current last action from App state
 * onComplete   {fn?}            called when all steps are done
 * onExit       {fn?}            "Back to Learn" handler
 * instruction  {string}         fallback flat instruction (legacy, no steps)
 */

const GuidedStepper = ({ steps, lastAction, onComplete, onExit, instruction }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [justCompleted, setJustCompleted] = useState(false);
  const prevAction = useRef(null);
  const celebTimer  = useRef(null);

  // Flat mode — no steps array, just the old static instruction banner
  if (!steps || steps.length === 0) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 border-2 border-black rounded-lg p-3 bg-white">
        <div className="flex items-center gap-2">
          <MascotCharacter mood="excited" size={32} />
          <p className="font-bold">{instruction}</p>
        </div>
        {onExit && (
          <SketchButton variant="outlined" onClick={onExit}>
            &larr; Back to Learn
          </SketchButton>
        )}
      </div>
    );
  }

  const current   = steps[stepIndex];
  const isLast    = stepIndex === steps.length - 1;
  const isDone    = stepIndex >= steps.length;

  // Advance when the expected action fires
  useEffect(() => {
    if (!current) return;
    if (lastAction === prevAction.current) return;
    prevAction.current = lastAction;

    if (lastAction === current.expectAction) {
      setJustCompleted(true);
      clearTimeout(celebTimer.current);
      celebTimer.current = setTimeout(() => {
        setJustCompleted(false);
        if (isLast) {
          onComplete?.();
        } else {
          setStepIndex(prev => prev + 1);
        }
      }, 1800);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastAction]);

  useEffect(() => () => clearTimeout(celebTimer.current), []);

  if (isDone) return null;

  return (
    <div className="mb-6 border-2 border-black rounded-lg bg-white overflow-hidden">
      {/* Header row: step counter + back button */}
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-dashed border-black">
        <div className="flex items-center gap-2">
          <MascotCharacter
            mood={justCompleted ? 'excited' : 'idle'}
            size={28}
          />
          <span className="text-xs font-extrabold font-mono tracking-widest uppercase">
            Step {stepIndex + 1} / {steps.length}
          </span>
        </div>
        {/* Step dots */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`
                inline-block rounded-full border-2 border-black transition-all duration-300
                ${i < stepIndex   ? 'w-2 h-2 bg-black'  : ''}
                ${i === stepIndex ? 'w-3 h-3 bg-black'  : ''}
                ${i > stepIndex   ? 'w-2 h-2 bg-white'  : ''}
              `}
            />
          ))}
        </div>
        {onExit && (
          <button
            onClick={onExit}
            className="text-xs font-bold underline hover:no-underline"
            aria-label="Exit guided mode"
          >
            &larr; Exit
          </button>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        {justCompleted ? (
          /* Completion flash */
          <div className="flex items-center gap-2 animate-bounce-up" aria-live="polite">
            <span aria-hidden="true" className="text-xl">✦</span>
            <p className="font-bold text-sm">{current.observation}</p>
          </div>
        ) : (
          <div aria-live="polite">
            <p className="font-bold text-sm leading-snug">{current.instruction}</p>
            {/* Dashed arrow hint — subtle push */}
            <div className="mt-2 flex items-center gap-2 opacity-50">
              <svg viewBox="0 0 32 6" width={32} height={6} aria-hidden="true">
                <line x1="0" y1="3" x2="26" y2="3"
                  stroke="#000" strokeWidth="1.5"
                  strokeDasharray="3 2" strokeLinecap="round" />
                <polyline points="22,1 28,3 22,5"
                  fill="none" stroke="#000"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs font-bold">apply the gate above</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuidedStepper;
