/**
 * A tiny hand-drawn-looking squiggle/star, purely decorative — dropped into
 * the corner of cards to reinforce the notebook-doodle aesthetic.
 * position: which corner to anchor to.
 */
const POSITION_CLASSES = {
  'top-right': 'top-1 right-1 rotate-6',
  'top-left': 'top-1 left-1 -rotate-6',
  'bottom-right': 'bottom-1 right-1 rotate-3',
  'bottom-left': 'bottom-1 left-1 -rotate-3',
};

const CornerDoodle = ({ position = 'top-right', variant = 'squiggle' }) => (
  <svg
    className={`absolute w-6 h-6 opacity-30 pointer-events-none ${POSITION_CLASSES[position] || POSITION_CLASSES['top-right']}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="black"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    {variant === 'star' ? (
      <path d="M12 3 L13.5 9 L20 9.5 L14.5 13.5 L16.5 20 L12 16 L7.5 20 L9.5 13.5 L4 9.5 L10.5 9 Z" />
    ) : (
      <path d="M3 12 Q6 6, 9 12 T15 12 T21 12" />
    )}
  </svg>
);

export default CornerDoodle;
