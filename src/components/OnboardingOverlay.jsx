import { useState, useEffect, useRef } from 'react';
import SketchButton from './SketchButton';

// ---------------------------------------------------------------------------
// Mascots: one per section, each with a signature accent color and a set of
// poses ('greet' | 'point' | 'think' | 'cheer') driven by the current step,
// so the same character reacts differently as the walkthrough progresses.
// Bodies are built on symmetric coordinates (mirrored around x=100) so
// nothing looks lopsided.
// ---------------------------------------------------------------------------

const poseForStep = (step, total) => {
  if (step === 0) return 'greet';
  if (step === total - 1) return 'cheer';
  return step % 2 === 1 ? 'point' : 'think';
};

// "Lab Bot" — simulator mascot: goggles + bubbling flask, cyan accent.
const LabBot = ({ pose = 'greet' }) => (
  <svg viewBox="0 0 200 210" width="132" height="139" aria-hidden="true" className="mascot-figure">
    {/* legs */}
    <g stroke="#000" strokeWidth="5" fill="#fff" strokeLinejoin="round" strokeLinecap="round">
      <path d="M88 176 L84 200" />
      <path d="M112 176 L116 200" />
    </g>
    <g stroke="#000" strokeWidth="5" fill="#fff" strokeLinejoin="round">
      <ellipse cx="82" cy="204" rx="14" ry="9" />
      <ellipse cx="118" cy="204" rx="14" ry="9" />
    </g>

    {/* torso / lab coat */}
    <path
      d="M100,108 C 124,108 138,124 138,148 C 138,172 121,190 100,190
         C 79,190 62,172 62,148 C 62,124 76,108 100,108 Z"
      fill="#fff" stroke="#000" strokeWidth="5.5" strokeLinejoin="round"
    />
    {/* coat collar */}
    <path d="M86,112 L100,132 L114,112" stroke="#000" strokeWidth="4" fill="none" strokeLinejoin="round" />
    {/* accent pocket badge */}
    <circle cx="100" cy="152" r="9" fill="var(--lab-accent)" stroke="#000" strokeWidth="2.5" />
    <path d="M96 152 L99 155 L105 148" stroke="#000" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

    {/* right arm — tucked */}
    <path d="M134,126 C 148,130 152,142 148,152 C 144,158 136,154 134,146 C 132,138 132,132 134,126 Z"
      fill="#fff" stroke="#000" strokeWidth="5" strokeLinejoin="round" />

    {/* left arm — pose-dependent */}
    {pose === 'point' ? (
      <path d="M66,128 C 44,120 28,104 16,84 C 20,78 30,78 36,84 C 48,98 58,112 72,122 Z"
        fill="#fff" stroke="#000" strokeWidth="5" strokeLinejoin="round" />
    ) : pose === 'think' ? (
      <path d="M66,128 C 54,112 54,96 66,84 C 74,80 80,86 76,94 C 70,104 68,116 72,124 Z"
        fill="#fff" stroke="#000" strokeWidth="5" strokeLinejoin="round" />
    ) : (
      <g className="mascot-wave" style={{ transformOrigin: '66px 128px' }}>
        <path d="M66,128 C 50,122 40,108 36,90 C 40,84 48,86 51,92 C 56,104 64,116 74,124 Z"
          fill="#fff" stroke="#000" strokeWidth="5" strokeLinejoin="round" />
      </g>
    )}

    {/* flask held in tucked hand, always bubbling a little */}
    <g transform="translate(150 118)">
      <path d="M-6,-14 L-6,-2 L-14,16 A9 9 0 0 0 -6,28 L6,28 A9 9 0 0 0 14,16 L6,-2 L6,-14 Z"
        fill="#fff" stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M-9,20 A9 9 0 0 0 9,20 L9,16 L-9,16 Z" fill="var(--lab-accent)" opacity="0.75" />
      <circle className="mascot-bubble" cx="-2" cy="10" r="2" fill="var(--lab-accent)" />
      <circle className="mascot-bubble mascot-bubble-delay" cx="3" cy="14" r="1.6" fill="var(--lab-accent)" />
    </g>

    {/* head */}
    <circle cx="100" cy="72" r="54" fill="#fff" stroke="#000" strokeWidth="5.5" />
    {/* antenna */}
    <line x1="100" y1="20" x2="100" y2="8" stroke="#000" strokeWidth="4" strokeLinecap="round" />
    <circle cx="100" cy="6" r="6" fill="var(--lab-accent)" stroke="#000" strokeWidth="3.5" className="mascot-antenna" />

    {/* goggles — symmetric, colored lenses */}
    <g stroke="#000" strokeWidth="4">
      <circle cx="80" cy="72" r="14" fill="#fff" />
      <circle cx="120" cy="72" r="14" fill="#fff" />
      <line x1="94" y1="72" x2="106" y2="72" />
      <circle cx="80" cy="72" r="7" fill="var(--lab-accent)" opacity={pose === 'think' ? 0.35 : 0.6} />
      <circle cx="120" cy="72" r="7" fill="var(--lab-accent)" opacity={pose === 'think' ? 0.35 : 0.6} />
    </g>

    {pose === 'cheer' ? (
      <path d="M84 96 Q100 110 116 96" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round" />
    ) : pose === 'think' ? (
      <path d="M88 98 Q100 96 112 98" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round" />
    ) : (
      <path d="M88 96 Q100 104 112 96" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round" />
    )}
  </svg>
);

// "Ref Bot" — challenges mascot: cap + whistle + checklist flag, amber accent.
const RefBot = ({ pose = 'greet' }) => (
  <svg viewBox="0 0 200 210" width="132" height="139" aria-hidden="true" className="mascot-figure">
    {/* legs */}
    <g stroke="#000" strokeWidth="5" fill="#fff" strokeLinejoin="round" strokeLinecap="round">
      <path d="M88 176 L84 200" />
      <path d="M112 176 L116 200" />
    </g>
    <g stroke="#000" strokeWidth="5" fill="#fff" strokeLinejoin="round">
      <ellipse cx="82" cy="204" rx="14" ry="9" />
      <ellipse cx="118" cy="204" rx="14" ry="9" />
    </g>

    {/* torso */}
    <path
      d="M100,108 C 124,108 138,124 138,148 C 138,172 121,190 100,190
         C 79,190 62,172 62,148 C 62,124 76,108 100,108 Z"
      fill="#fff" stroke="#000" strokeWidth="5.5" strokeLinejoin="round"
    />
    {/* whistle cord + whistle */}
    <path d="M88,112 Q100,124 112,112" stroke="#000" strokeWidth="3" fill="none" />
    <circle cx="100" cy="126" r="7" fill="var(--ref-accent)" stroke="#000" strokeWidth="2.5" />
    {/* scoreboard chevron badge */}
    <path d="M92 156 L100 148 L108 156 M92 164 L100 156 L108 164"
      stroke="var(--ref-accent)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

    {/* right arm — tucked, holding clipboard */}
    <path d="M134,126 C 148,130 152,142 148,152 C 144,158 136,154 134,146 C 132,138 132,132 134,126 Z"
      fill="#fff" stroke="#000" strokeWidth="5" strokeLinejoin="round" />
    <g transform="translate(150 116) rotate(8)">
      <rect x="-11" y="-16" width="22" height="30" rx="3" fill="#fff" stroke="#000" strokeWidth="3" />
      <rect x="-5" y="-20" width="10" height="6" rx="1.5" fill="#fff" stroke="#000" strokeWidth="2.5" />
      <path d="M-6 -5 L-1 0 L7 -9 M-6 5 L-1 10 L7 1" stroke="var(--ref-accent)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    {/* left arm — pose-dependent */}
    {pose === 'point' ? (
      <path d="M66,128 C 44,120 28,104 16,84 C 20,78 30,78 36,84 C 48,98 58,112 72,122 Z"
        fill="#fff" stroke="#000" strokeWidth="5" strokeLinejoin="round" />
    ) : pose === 'think' ? (
      <path d="M66,128 C 54,112 54,96 66,84 C 74,80 80,86 76,94 C 70,104 68,116 72,124 Z"
        fill="#fff" stroke="#000" strokeWidth="5" strokeLinejoin="round" />
    ) : pose === 'cheer' ? (
      <path d="M66,128 C 50,110 44,88 46,66 C 52,60 62,62 63,70 C 62,90 64,110 74,124 Z"
        fill="#fff" stroke="#000" strokeWidth="5" strokeLinejoin="round" />
    ) : (
      <g className="mascot-wave" style={{ transformOrigin: '66px 128px' }}>
        <path d="M66,128 C 50,122 40,108 36,90 C 40,84 48,86 51,92 C 56,104 64,116 74,124 Z"
          fill="#fff" stroke="#000" strokeWidth="5" strokeLinejoin="round" />
      </g>
    )}

    {/* head */}
    <circle cx="100" cy="72" r="54" fill="#fff" stroke="#000" strokeWidth="5.5" />
    {/* referee cap */}
    <path d="M50,58 Q100,20 150,58 Q100,44 50,58 Z" fill="var(--ref-accent)" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
    <path d="M46,58 Q100,42 154,58" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />

    {pose === 'cheer' ? (
      <>
        <path d="M74 68 L88 76 M74 84 L88 76" stroke="#000" strokeWidth="5" strokeLinecap="round" />
        <path d="M126 68 L112 76 M126 84 L112 76" stroke="#000" strokeWidth="5" strokeLinecap="round" />
        <path d="M82 96 Q100 112 118 96" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx="80" cy="76" r="6.5" fill="#000" />
        <circle cx="120" cy="76" r="6.5" fill="#000" />
        <path d={pose === 'think' ? 'M86 98 Q100 96 114 98' : 'M82 96 Q100 106 118 96'} stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round" />
      </>
    )}
  </svg>
);

const MASCOTS = {
  // Accents replaced with #000 so the overlays stay B&W.
  lab:      { Figure: LabBot,  accentVar: '--lab-accent',  accent: '#000', label: 'Lab Bot' },
  referee:  { Figure: RefBot,  accentVar: '--ref-accent',  accent: '#000', label: 'Ref Bot' },
};

/**
 * Short walkthrough shown once per session (in-memory flag, no storage).
 * Reopenable any time via a "?" help button.
 *
 * `character` picks which mascot peeks over the card ('lab' | 'referee').
 * Falls back to no mascot if omitted, so other call sites keep working.
 */
const OnboardingOverlay = ({ open, onClose, steps, character }) => {
  const [step, setStep] = useState(0);
  const dialogRef = useRef(null);

  // Focus trap — keep keyboard focus inside the dialog while it's open.
  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const el = dialogRef.current;
    const focusable = el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    // Shift focus to first element on open
    first?.focus();

    const trap = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus(); }
      }
    };
    el.addEventListener('keydown', trap);
    return () => el.removeEventListener('keydown', trap);
  }, [open, step]);

  if (!open) return null;

  const isLast = step === steps.length - 1;
  const current = steps[step];
  const mascot = character ? MASCOTS[character] : null;
  const pose = mascot ? poseForStep(step, steps.length) : null;

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
      className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fade-in"
      role="presentation"
      style={mascot ? { [mascot.accentVar]: mascot.accent } : undefined}
    >
      <style>{`
        @keyframes mascot-float {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes mascot-wave-swing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-16deg); }
          50% { transform: rotate(4deg); }
          75% { transform: rotate(-8deg); }
        }
        @keyframes mascot-bubble-rise {
          0% { transform: translateY(0); opacity: 0.9; }
          100% { transform: translateY(-14px); opacity: 0; }
        }
        @keyframes mascot-glow-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.08); }
        }
        @keyframes sparkle-pop {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          40% { transform: scale(1.1) rotate(20deg); opacity: 1; }
          100% { transform: scale(0.9) rotate(30deg); opacity: 0; }
        }
        @keyframes step-slide-in {
          0% { opacity: 0; transform: translateX(10px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .mascot-figure { filter: drop-shadow(3px 5px 0 rgba(0,0,0,0.12)); }
        .mascot-wrap { animation: mascot-float 3.2s ease-in-out infinite; }
        .mascot-wave { animation: mascot-wave-swing 1.6s ease-in-out infinite; }
        .mascot-bubble { animation: mascot-bubble-rise 1.6s ease-out infinite; }
        .mascot-bubble-delay { animation-delay: .6s; }
        .mascot-antenna { animation: mascot-glow-pulse 1.8s ease-in-out infinite; }
        .mascot-glow { animation: mascot-glow-pulse 2.6s ease-in-out infinite; }
        .sparkle { animation: sparkle-pop 1s ease-out infinite; }
        .step-body { animation: step-slide-in .25s ease-out both; }
      `}</style>

      <div className="relative w-full max-w-md">
        {/* Peeking mascot, half-overlapping the top edge of the card */}
        {mascot && (
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none">
            <div className="mascot-wrap relative">
              <mascot.Figure pose={pose} />
              {pose === 'cheer' && (
                <>
                  <span className="sparkle absolute -top-2 -left-3 text-lg text-white" aria-hidden="true">✦</span>
                  <span className="sparkle absolute top-2 -right-4 text-sm text-white" style={{ animationDelay: '.3s' }} aria-hidden="true">✦</span>
                  <span className="sparkle absolute -top-6 right-6 text-xs text-white" style={{ animationDelay: '.6s' }} aria-hidden="true">✦</span>
                </>
              )}
            </div>
          </div>
        )}

        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
          aria-describedby="onboarding-body"
          className={`relative bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0_0_#000000] w-full animate-bounce-in overflow-hidden ${mascot ? 'pt-14 px-6 pb-6 md:px-8 md:pb-8' : 'p-6 md:p-8'}`}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-extrabold tracking-widest uppercase px-2 py-1 rounded-full border-2 border-black bg-white">
              {mascot ? `${mascot.label} · Guided tour` : 'Guided tour'}
            </span>
            <button onClick={handleSkip} className="text-xs font-bold underline hover:no-underline" aria-label="Skip walkthrough">
              skip
            </button>
          </div>

          <div key={step} className="step-body">
            <h3 id="onboarding-title" className="text-2xl font-extrabold mb-2 leading-tight">
              {current.title}
            </h3>
            <p id="onboarding-body" className="text-sm text-black/70 mb-6 leading-relaxed">
              {current.body}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-1.5" aria-hidden="true">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className="h-2 rounded-full border border-black transition-all duration-300"
                  style={{
                    width: i === step ? '20px' : '8px',
                    background: i === step ? '#000' : '#fff',
                  }}
                />
              ))}
            </div>
            <SketchButton onClick={handleNext} variant="inverted" className="font-extrabold">
              {isLast ? "Let's go!" : 'Next →'}
            </SketchButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingOverlay;