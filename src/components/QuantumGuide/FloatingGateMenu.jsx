import { useState } from 'react';
import GateCard from './GateCard';
import SketchButton from '../SketchButton';
import { GATE_INFO } from '../../constants/gateInfo';
import { GATE_GUIDED_CONFIG } from '../../constants/learningContent';

/**
 * FloatingGateMenu
 *
 * Renders 4 gate cards spreading outward from the character's position,
 * plus a slide-in detail panel when a card is selected.
 *
 * Key fixes
 * ─────────
 * • Card wrapper has pointer-events: auto — clicks reach individual cards
 * • Detail panel renders in normal document flow ABOVE the card layer,
 *   not inside the absolute-positioned card stack
 * • z-index layering: detail panel > cards > character
 *
 * Card layout (offsets from bottom-right anchor)
 * ───────────────────────────────────────────────
 *        [Hadamard]          ← top-centre (up & slightly left)
 *  [Pauli-X]    [CNOT]       ← mid-left / mid-right
 *        [Measure]           ← lower-centre (above character)
 */

export const CARDS = [
  {
    gateId:    'H0',
    symbol:    'H',
    label:     'Hadamard',
    sublabel:  'Q0',
    hoverHint: 'Superposition starts here.',
    /* Desktop offsets — clamped for mobile via CSS clamp() */
    translateX: -150,
    translateY: -220,
    tiltDeg:   -4,
    delay:      0,
  },
  {
    gateId:    'H1',
    symbol:    'H',
    label:     'Hadamard',
    sublabel:  'Q1',
    hoverHint: 'Superposition on the second qubit.',
    translateX: -40,
    translateY: -260,
    tiltDeg:    2,
    delay:      55,
  },
  {
    gateId:    'X0',
    symbol:    'X',
    label:     'Pauli-X',
    sublabel:  'Q0',
    hoverHint: 'This flips the qubit.',
    translateX: -160,
    translateY: -110,
    tiltDeg:    3,
    delay:     110,
  },
  {
    gateId:    'X1',
    symbol:    'X',
    label:     'Pauli-X',
    sublabel:  'Q1',
    hoverHint: 'Flips the second qubit.',
    translateX:  20,
    translateY: -170,
    tiltDeg:   -3,
    delay:     165,
  },
  {
    gateId:    'CNOT',
    symbol:    '⊕',
    label:     'CNOT',
    sublabel:  'Q0→Q1',
    hoverHint: 'This creates entanglement.',
    translateX: -80,
    translateY:  -80,
    tiltDeg:   -2,
    delay:     220,
  },
];

/* Hover hints keyed by gateId — consumed by parent for speech bubble */
export const GATE_HOVER_HINTS = Object.fromEntries(
  CARDS.map((c) => [c.gateId, c.hoverHint])
);

/* ------------------------------------------------------------------ */

const FloatingGateMenu = ({
  closing          = false,
  onGateHover,      /* (gateId|null) => void */
  onGateClick,      /* (gateId|null) => void  null = back */
  onTryInSimulator, /* (config) => void        */
}) => {
  const [selectedGate, setSelectedGate] = useState(null);

  /* ── Card click ─────────────────────────────────────────── */
  const handleCardClick = (gateId) => {
    setSelectedGate(gateId);
    onGateClick?.(gateId);
  };

  /* ── Back from detail panel ─────────────────────────────── */
  const handleBack = () => {
    setSelectedGate(null);
    onGateClick?.(null);
  };

  /* ── Try in Simulator ───────────────────────────────────── */
  const handleTry = () => {
    const config = GATE_GUIDED_CONFIG[selectedGate] ?? null;
    onTryInSimulator?.(config);
  };

  /* ── Detail panel ───────────────────────────────────────── */
  const renderDetailPanel = () => {
    if (!selectedGate) return null;
    const card = CARDS.find((c) => c.gateId === selectedGate);
    const info = GATE_INFO[selectedGate] ?? '';

    return (
      <div
        className="guide-detail-panel guide-panel-entering"
        role="region"
        aria-label={`Gate info: ${card?.label}`}
        style={{ marginBottom: 10, position: 'relative', zIndex: 30 }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="guide-detail-panel__symbol" aria-hidden="true">
              {card?.symbol}
            </div>
            <div>
              <span style={{
                fontWeight: 800, fontSize: '0.88rem',
                fontFamily: "'Kalam', cursive",
              }}>
                {card?.label}
              </span>
              {card?.sublabel && (
                <span style={{
                  fontWeight: 400, fontSize: '0.7rem',
                  color: '#555', marginLeft: 5,
                  fontFamily: "'Kalam', cursive",
                }}>
                  ({card.sublabel})
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleBack}
            aria-label="Back to gates"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontWeight: 800, fontSize: '0.78rem',
              fontFamily: "'Kalam', cursive",
              textDecoration: 'underline', padding: '2px 4px',
              color: '#000',
            }}
          >
            ← Back
          </button>
        </div>

        <hr className="guide-dashed-rule" />

        {/* Description — reuses existing GATE_INFO */}
        <p style={{
          fontSize: '0.8rem', lineHeight: 1.5,
          fontFamily: "'Kalam', cursive",
          color: '#222', margin: '6px 0 10px',
        }}>
          {info}
        </p>

        {/* Dashed arrow → Try it */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
          fontFamily: "'Kalam', cursive", fontSize: '0.7rem', color: '#555',
        }}>
          <svg viewBox="0 0 40 8" width={40} height={8} aria-hidden="true">
            <line x1="0" y1="4" x2="32" y2="4"
              stroke="#000" strokeWidth="1.5"
              strokeDasharray="3 2" strokeLinecap="round"/>
            <polyline points="27,1 35,4 27,7"
              fill="none" stroke="#000"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Try it yourself</span>
        </div>

        <SketchButton
          variant="outlined"
          onClick={handleTry}
          style={{ width: '100%', fontSize: '0.76rem' }}
        >
          Try in Simulator →
        </SketchButton>

        {/* Decorative sparkles */}
        <div style={{
          marginTop: 8, display: 'flex', justifyContent: 'flex-end',
          gap: 4, opacity: 0.3,
        }} aria-hidden="true">
          <span style={{ fontSize: '0.58rem' }}>✦</span>
          <span style={{ fontSize: '0.5rem'  }}>✦</span>
          <span style={{ fontSize: '0.62rem' }}>✦</span>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ── Detail panel — normal flow, sits ABOVE cards in stack ── */}
      {renderDetailPanel()}

      {/*
        ── Card layer ──────────────────────────────────────────────
        position:relative so absolute cards are offset from here.
        pointer-events:auto so clicks reach the cards.
        height:0 / width:0 so it doesn't push the character down.
      */}
      <div
        role="group"
        aria-label="Gate selection"
        style={{
          position: 'relative',
          width: 0,
          height: 0,
          pointerEvents: 'none', /* re-enabled per card via CSS */
        }}
      >
        {CARDS.map((card) => (
          <GateCard
            key={card.gateId}
            {...card}
            closing={closing}
            onClick={handleCardClick}
            onHoverEnter={(id) => onGateHover?.(id)}
            onHoverLeave={() => onGateHover?.(null)}
          />
        ))}
      </div>
    </>
  );
};

export default FloatingGateMenu;