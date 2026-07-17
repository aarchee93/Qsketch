import { useState } from 'react';
import SketchButton from './SketchButton';

/**
 * Short walkthrough shown once per session (in-memory flag, no storage).
 * Reopenable any time via a "?" help button.
 */
const OnboardingOverlay = ({ open, onClose, steps }) => {
  const [step, setStep] = useState(0);

  if (!open) return null;

  const isLast = step === steps.length - 1;
  const current = steps[step];

  const handleNext = () => {
    if (isLast) {
      setStep(0);
      onClose();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleSkip = () => {
    setStep(0);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        aria-describedby="onboarding-body"
        className="bg-white border-4 border-black rounded-xl p-6 md:p-8 shadow-[8px_8px_0_0_#000000] max-w-md w-full animate-bounce-in"
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-mono text-black/50">Step {step + 1} of {steps.length}</span>
          <button onClick={handleSkip} className="text-xs font-bold underline hover:no-underline" aria-label="Skip walkthrough">
            skip
          </button>
        </div>

        <h3 id="onboarding-title" className="text-2xl font-extrabold mb-3">
          {current.title}
        </h3>
        <p id="onboarding-body" className="text-sm mb-6">
          {current.body}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex gap-1.5" aria-hidden="true">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full border border-black ${i === step ? 'bg-black' : 'bg-white'}`}
              />
            ))}
          </div>
          <SketchButton onClick={handleNext} variant="inverted" className="font-extrabold">
            {isLast ? "Let's go!" : 'Next →'}
          </SketchButton>
        </div>
      </div>
    </div>
  );
};

export default OnboardingOverlay;
