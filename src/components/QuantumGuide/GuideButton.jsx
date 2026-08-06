import { useState, useRef } from 'react';

/**
 * GuideButton
 *
 * Small circular button shown when the guide is closed.
 * Shows a hand-drawn scientist face (SVG) with idle breathing pulse.
 * Click compresses → calls onOpen().
 * Optional notification bubble floats above.
 */
const GuideButton = ({ onOpen, bubble = null }) => {
  const [pressing, setPressing] = useState(false);
  const timer = useRef(null);

  const handleClick = () => {
    clearTimeout(timer.current);
    setPressing(true);
    timer.current = setTimeout(() => {
      setPressing(false);
      onOpen?.();
    }, 200);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'flex-end', gap: 6,
      pointerEvents: 'auto',
    }}>

      {/* Notification bubble (achievement / lesson) */}
      {bubble && (
        <div
          className="guide-bubble guide-bubble-entering"
          role="status"
          aria-live="polite"
          style={{ marginBottom: 4 }}
        >
          {bubble}
          {/* Tail SVG */}
          <svg aria-hidden="true" viewBox="0 0 22 14" width={22} height={14}
            style={{ position:'absolute', bottom:-13, right:14, display:'block', overflow:'visible' }}>
            <polygon points="0,0 22,0 10,14" fill="#fff" stroke="#000" strokeWidth="2.5" strokeLinejoin="round"/>
            <polygon points="2,0 20,0 10,11" fill="#fff" stroke="none"/>
          </svg>
        </div>
      )}

      {/* The circular button */}
      <button
        onClick={handleClick}
        aria-label="Open Quantum Guide"
        title="Open Quantum Guide"
        className={pressing ? 'guide-btn-pressing' : 'guide-btn-idle'}
        style={{
          width: 62, height: 62,
          borderRadius: '50%',
          background: '#fff',
          border: '2.5px solid #000',
          boxShadow: '3px 3px 0 #000',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
          flexShrink: 0,
          outline: 'none',
        }}
      >
        {/* Scientist face — inlined SVG so it never breaks */}
        <svg
          viewBox="0 0 52 56"
          width={46}
          height={50}
          aria-hidden="true"
          style={{ display: 'block', overflow: 'visible' }}
        >
          {/* Hair */}
          <ellipse cx="26" cy="18" rx="18" ry="14" fill="#000"/>
          <ellipse cx="26" cy="22" rx="14" ry="13" fill="#fff"/>
          {/* Hair tufts */}
          <path d="M10 15 Q8 8 14 7 Q12 12 14 15" fill="#000"/>
          <path d="M18 9  Q20 2 26 5 Q23 10 22 13" fill="#000"/>
          <path d="M30 8  Q36 2 40 7 Q36 10 36 14" fill="#000"/>
          <path d="M40 14 Q46 10 44 18 Q41 15 38 16" fill="#000"/>
          {/* Face */}
          <ellipse cx="26" cy="32" rx="16" ry="18" fill="#fff" stroke="#000" strokeWidth="2.5"/>
          {/* Ears */}
          <ellipse cx="10" cy="32" rx="3.5" ry="4.5" fill="#fff" stroke="#000" strokeWidth="2"/>
          <ellipse cx="42" cy="32" rx="3.5" ry="4.5" fill="#fff" stroke="#000" strokeWidth="2"/>
          {/* Brows */}
          <path d="M16 24 Q21 21 24 24" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M28 24 Q31 21 36 24" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* Eyes */}
          <circle cx="21" cy="30" r="4.5" fill="#fff" stroke="#000" strokeWidth="2"/>
          <circle cx="22" cy="29" r="2"   fill="#000"/>
          <circle cx="23" cy="28" r="0.9" fill="#fff"/>
          <circle cx="31" cy="30" r="4.5" fill="#fff" stroke="#000" strokeWidth="2"/>
          <circle cx="32" cy="29" r="2"   fill="#000"/>
          <circle cx="33" cy="28" r="0.9" fill="#fff"/>
          {/* Smile */}
          <path d="M19 38 Q26 44 33 38" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* Freckles */}
          <circle cx="18" cy="34" r="1"   fill="#000" opacity="0.22"/>
          <circle cx="34" cy="34" r="1"   fill="#000" opacity="0.22"/>
          {/* Hoodie collar hint */}
          <path d="M14 49 Q26 54 38 49" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <line x1="26" y1="48" x2="26" y2="54" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Label */}
      <div aria-hidden="true" style={{
        fontSize: '0.58rem',
        fontFamily: "'Kalam', cursive",
        fontWeight: 700,
        color: '#000',
        textAlign: 'center',
        opacity: 0.5,
        letterSpacing: '0.04em',
      }}>
        Guide
      </div>
    </div>
  );
};

export default GuideButton;
