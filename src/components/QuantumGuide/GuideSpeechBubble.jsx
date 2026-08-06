import { useEffect, useRef, useState } from 'react';

/**
 * GuideSpeechBubble
 *
 * Scales in when `text` is set, plays an exit animation before unmounting.
 * Tail points down-right toward the character.
 *
 * Props
 * ─────
 * text      {string|null}
 * className {string}
 * style     {object}
 */
const GuideSpeechBubble = ({ text = null, className = '', style = {} }) => {
  const [displayed, setDisplayed] = useState(text);
  const [phase, setPhase]         = useState(text ? 'entering' : 'hidden');
  const exitTimer  = useRef(null);
  const enterTimer = useRef(null);

  useEffect(() => {
    clearTimeout(exitTimer.current);
    clearTimeout(enterTimer.current);

    if (text) {
      setDisplayed(text);
      setPhase('entering');
      enterTimer.current = setTimeout(() => setPhase('visible'), 260);
    } else if (displayed) {
      setPhase('exiting');
      exitTimer.current = setTimeout(() => {
        setPhase('hidden');
        setDisplayed(null);
      }, 180);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => () => {
    clearTimeout(exitTimer.current);
    clearTimeout(enterTimer.current);
  }, []);

  if (phase === 'hidden') return null;

  const animClass =
    phase === 'entering' ? 'guide-bubble-entering' :
    phase === 'exiting'  ? 'guide-bubble-exiting'  : '';

  return (
    <div
      className={`guide-bubble ${animClass} ${className}`}
      role="status"
      aria-live="polite"
      style={{ transformOrigin: 'bottom right', ...style }}
    >
      {/* Decorative star */}
      <span
        aria-hidden="true"
        className="guide-star"
        style={{ position:'absolute', top:4, left:8, fontSize:'0.58rem', opacity:0.38 }}
      >
        ✦
      </span>

      {/* Text */}
      <span style={{ position:'relative', zIndex:1 }}>{displayed}</span>

      {/* SVG tail — hand-drawn triangle pointing down-right */}
      <svg
        aria-hidden="true"
        viewBox="0 0 22 14"
        width={22}
        height={14}
        style={{
          position:'absolute', bottom:-13, right:14,
          display:'block', overflow:'visible', pointerEvents:'none',
        }}
      >
        <polygon points="0,0 22,0 10,14"
          fill="#fff" stroke="#000" strokeWidth="2.5" strokeLinejoin="round"/>
        <polygon points="2,0 20,0 10,11"
          fill="#fff" stroke="none"/>
      </svg>
    </div>
  );
};

export default GuideSpeechBubble;
