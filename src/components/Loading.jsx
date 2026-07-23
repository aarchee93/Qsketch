/**
 * Loading Spinner Component — a hand-drawn-style wobbly ring instead of a
 * perfectly uniform circle, to match the sketch aesthetic.
 */
export const Spinner = ({ size = 'md', color = 'text-black' }) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size];

  return (
    <div className={`animate-spin-fast ${sizeClass} ${color}`}>
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        {/* Slightly irregular path instead of a perfect circle, for a hand-drawn feel */}
        <path
          className="opacity-25"
          d="M12 2.5 C 17.5 2.2, 21.8 6.4, 21.5 12 C 21.8 17.6, 17.5 21.8, 12 21.5 C 6.4 21.8, 2.2 17.6, 2.5 12 C 2.2 6.4, 6.4 2.2, 12 2.5 Z"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M12 2.5 C 15.5 2.3, 18.8 4.2, 20.4 7.2 L 17 9.2 C 15.9 7.3, 14 6.1, 12 6.2 Z"
        />
      </svg>
    </div>
  );
};

/**
 * Loading Overlay Component
 */
export const LoadingOverlay = ({ visible = false, message = 'Preparing Laboratory...' }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
      <div className="bg-white border-4 border-black rounded-xl p-8 shadow-[8px_8px_0_0_#000000]">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="font-bold text-lg">{message}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Achievement Stamp — replaces confetti with a single hand-stamped "thunk"
 * mark, matching the lab-notebook aesthetic better than falling particles.
 * Keeps the same trigger/onComplete API so existing call sites don't change.
 */
export const Confetti = ({ trigger = false, onComplete }) => {
  if (!trigger) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-40">
      <div
        className="animate-badge-pop"
        onAnimationEnd={onComplete}
      >
        <div
          className="w-40 h-40 rounded-full border-8 border-black flex flex-col items-center justify-center text-black bg-white/90 shadow-[6px_6px_0_0_#000000] -rotate-12"
          style={{ borderStyle: 'double' }}
        >
          <span className="text-3xl" aria-hidden="true">✓</span>
          <span className="font-extrabold text-sm tracking-widest">VERIFIED</span>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
