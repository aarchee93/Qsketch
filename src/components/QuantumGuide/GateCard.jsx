import { useEffect, useRef, useState } from 'react';

/**
 * GateCard
 *
 * A single floating gate card. Key fixes vs previous version:
 *
 *  • pointer-events: auto always — card is ALWAYS clickable once mounted
 *  • Floating phase uses plain inline transform (no CSS-var dependency)
 *  • Hover wiggle applied via CSS class (no translate vars in keyframe)
 *  • Click bounce uses CSS class that resets cleanly
 *  • z-index elevates on hover
 *
 * Animation phases
 * ────────────────
 * 'popping'  → CSS-var driven pop-out animation (guide-card-popping)
 * 'floating' → inline transform stays put; guide-card-floating adds margin-top oscillation
 * 'folding'  → CSS-var driven fold-back (guide-card-folding)
 *
 * Props
 * ─────
 * gateId       {string}
 * symbol       {string}   displayed in black square
 * label        {string}   gate name
 * sublabel     {string}   e.g. "Q0"
 * translateX   {number}   final X offset from anchor origin (px, negative = left)
 * translateY   {number}   final Y offset from anchor origin (px, negative = up)
 * tiltDeg      {number}   resting rotation in degrees
 * delay        {number}   stagger delay (ms)
 * closing      {boolean}  triggers fold animation
 * onClick      {fn}       (gateId) => void
 * onHoverEnter {fn}       (gateId) => void
 * onHoverLeave {fn}       () => void
 */
const GateCard = ({
  gateId,
  symbol,
  label,
  sublabel  = '',
  translateX = 0,
  translateY = -120,
  tiltDeg    = 2,
  delay      = 0,
  closing    = false,
  onClick,
  onHoverEnter,
  onHoverLeave,
}) => {
  const [phase, setPhase]       = useState('popping');
  const [hovered, setHovered]   = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const phaseTimer  = useRef(null);
  const bounceTimer = useRef(null);

  /* Switch from popping → floating once the pop animation finishes */
  useEffect(() => {
    phaseTimer.current = setTimeout(() => {
      if (!closing) setPhase('floating');
    }, delay + 560);           /* pop duration 520ms + stagger */
    return () => clearTimeout(phaseTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Parent signals close → fold */
  useEffect(() => {
    if (closing) setPhase('folding');
  }, [closing]);

  /* Cleanup */
  useEffect(() => () => {
    clearTimeout(phaseTimer.current);
    clearTimeout(bounceTimer.current);
  }, []);

  // Clamp translateX on mobile so cards don't fly off-screen
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
  const clampedX = isMobile ? Math.max(-100, Math.min(20, translateX)) : translateX;
  const clampedY = isMobile ? Math.max(-200, translateY) : translateY;

  /* ── CSS custom properties (used only during pop + fold) ── */
  const osX = clampedX * 1.28;
  const osY = clampedY * 1.28;
  const cssVars = {
    '--card-final':     `translate(${clampedX}px, ${clampedY}px)`,
    '--card-overshoot': `translate(${osX}px, ${osY}px)`,
    '--card-tilt':      `${tiltDeg}deg`,
  };

  /* ── Decide animation classes ── */
  let animClass = '';
  if (phase === 'popping') animClass = 'guide-card-popping';
  if (phase === 'folding') animClass = 'guide-card-folding';
  if (phase === 'floating' && hovered)  animClass = 'guide-card-hovered';
  if (phase === 'floating' && !hovered) animClass = 'guide-card-floating';
  if (bouncing) animClass = 'guide-card-bouncing';

  /* ── Inline transform — only active in floating phase ── */
  const floatTransform =
    phase === 'floating'
      ? `translate(${clampedX}px, ${clampedY}px) rotate(${tiltDeg}deg)`
      : undefined;

  /* ── Event handlers ── */
  const handleClick = (e) => {
    e.stopPropagation();
    setBouncing(true);
    clearTimeout(bounceTimer.current);
    bounceTimer.current = setTimeout(() => setBouncing(false), 300);
    onClick?.(gateId);
  };

  const handleHoverEnter = () => {
    setHovered(true);
    onHoverEnter?.(gateId);
  };

  const handleHoverLeave = () => {
    setHovered(false);
    onHoverLeave?.();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Learn about ${label}${sublabel ? ` (${sublabel})` : ''}`}
      className={`guide-gate-card ${animClass}`}
      style={{
        ...cssVars,
        animationDelay: phase === 'popping' ? `${delay}ms` : '0ms',
        /* Floating phase: transform is inline, animation only does margin-top bob */
        ...(phase === 'floating' ? { transform: floatTransform } : {}),
        /* Hover elevation */
        zIndex: hovered ? 20 : 10,
        /* Box shadow lift on hover */
        boxShadow: hovered ? '5px 5px 0 #000' : '3px 3px 0 #000',
        /* Transition shadow only */
        transition: 'box-shadow 0.15s ease',
      }}
      onClick={handleClick}
      onMouseEnter={handleHoverEnter}
      onMouseLeave={handleHoverLeave}
      onFocus={handleHoverEnter}
      onBlur={handleHoverLeave}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(e); } }}
    >
      {/* Symbol badge */}
      <div className="guide-gate-card__symbol" aria-hidden="true">
        {symbol}
      </div>

      {/* Gate name */}
      <div className="guide-gate-card__name">{label}</div>

      {/* Qubit qualifier */}
      {sublabel && (
        <div className="guide-gate-card__sub">{sublabel}</div>
      )}

      {/* Hover: tiny up-arrow doodle above card */}
      {hovered && (
        <svg
          aria-hidden="true"
          viewBox="0 0 12 7"
          width={12}
          height={7}
          style={{
            position: 'absolute',
            top: -11,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'block',
            pointerEvents: 'none',
          }}
        >
          <polyline
            points="1,6 6,1 11,6"
            fill="none"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* Hover: sparkle in corner */}
      {hovered && (
        <span
          aria-hidden="true"
          className="guide-sparkle"
          style={{ position: 'absolute', top: 2, right: 4, fontSize: '0.6rem', pointerEvents: 'none' }}
        >
          ✦
        </span>
      )}
    </div>
  );
};

export default GateCard;
