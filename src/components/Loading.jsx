/**
 * Loading Spinner Component
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
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

/**
 * Loading Overlay Component
 */
export const LoadingOverlay = ({ visible = false, message = 'Loading...' }) => {
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
 * Confetti Component for celebration
 */
export const Confetti = ({ trigger = false, onComplete }) => {
  if (!trigger) return null;

  const confetti = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    duration: 2 + Math.random() * 1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map((c, index) => (
        <div
          key={c.id}
          className="absolute animate-confetti"
          style={{
            left: `${c.left}%`,
            top: '-20px',
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
          onAnimationEnd={index === confetti.length - 1 ? onComplete : undefined}
        >
          {['🎉', '🎊', '⭐', '✨', '🌟'][Math.floor(Math.random() * 5)]}
        </div>
      ))}
    </div>
  );
};

export default Spinner;
