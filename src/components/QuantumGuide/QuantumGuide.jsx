import { useState, useEffect, useRef, useCallback } from 'react';
import './GuideAnimation.css';
import GuideButton from './GuideButton';
import GuideCharacter from './GuideCharacter';
import GuideSpeechBubble from './GuideSpeechBubble';
import FloatingGateMenu, { GATE_HOVER_HINTS } from './FloatingGateMenu';
import { ACHIEVEMENTS } from '../../constants/achievements';
import { LEVELS } from '../../constants/gameLevels';

/* ─────────────────────────────────────────────────────────────
   SPEECH LINES
   ──────────────────────────────────────────────────────────── */
const SPEECH = {
  OPEN:             "Hi! Which gate would you like to explore?",
  GREAT_CHOICE:     "Great choice! ✦",
  BACK_TO_GATES:    "Pick another gate!",

  HOVER: {
    H0:      'Superposition starts here.',
    H1:      'Superposition starts here.',
    X0:      'This flips the qubit.',
    X1:      'This flips the qubit.',
    CNOT:    'This creates entanglement.',
  },

  SIM_FIRST_VISIT:  "Let's start with Hadamard.",
  SIM_AFTER_H:      'Nice! Now try CNOT.',
  SIM_AFTER_H_CNOT: "You've created entanglement!",
  SIM_BEFORE_MEAS:  'Ready to observe?',
  SIM_AFTER_MEAS:   'The quantum state has collapsed.',
  SIM_AFTER_RESET:  'Fresh experiment!',

  GAME_STEP_H:      'Apply Hadamard on Q0.',
  GAME_STEP_OK:     'Excellent! ',
  GAME_STEP_CNOT:   'Now apply CNOT.',
  GAME_STEP_CNOT_OK:'Perfect! ',
  GAME_STEP_MEAS:   'Measure.',
  GAME_WRONG_GATE:  "That gate won\u2019t help here.",
  GAME_WRONG_ALT:   "Think about superposition first.",
  GAME_WON:         'Challenge completed! \u2726\u2726\u2726',

  ACHIEVEMENT: (name) => `\u2726 Unlocked: ${name}!`,
  LESSON_DONE:      '\u{1F4D8} One more lesson done!',
};

/* Head look angles — toward each card position */
const LOOK = { H0: -12, H1: -12, X0: -22, X1: 18, CNOT: 6, default: 0 };

/* ─────────────────────────────────────────────────────────────
   DUST LINES — sketchy motion marks on landing
   ──────────────────────────────────────────────────────────── */
const DustLines = ({ visible }) => {
  if (!visible) return null;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 90 32"
      width={90} height={32}
      style={{
        position:'absolute', bottom:-4, left:'50%',
        transform:'translateX(-50%)',
        pointerEvents:'none', overflow:'visible', zIndex:1,
      }}
    >
      <line x1="45" y1="16" x2="6"  y2="7"
        stroke="#000" strokeWidth="2" strokeLinecap="round"
        style={{ animation:'guide-dust 0.5s ease-out both', animationDelay:'0ms' }}/>
      <line x1="45" y1="16" x2="84" y2="7"
        stroke="#000" strokeWidth="2" strokeLinecap="round"
        style={{ animation:'guide-dust 0.5s ease-out both', animationDelay:'45ms' }}/>
      <line x1="45" y1="16" x2="45" y2="0"
        stroke="#000" strokeWidth="2" strokeLinecap="round"
        style={{ animation:'guide-dust 0.5s ease-out both', animationDelay:'90ms' }}/>
      <text x="10" y="6" fontSize="9" fill="#000" opacity="0.65"
        style={{ animation:'guide-sparkle 0.6s ease-out both', animationDelay:'55ms' }}>✦</text>
      <text x="72" y="6" fontSize="8" fill="#000" opacity="0.55"
        style={{ animation:'guide-sparkle 0.6s ease-out both', animationDelay:'110ms' }}>✦</text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   QUANTUM GUIDE — MAIN COMPONENT
   ──────────────────────────────────────────────────────────── */
/**
 * Drop-in replacement for HelpPanel.
 *
 * Props
 * ─────
 * onTryInSimulator   {fn}     (config) => void
 * lastAction         {string} 'START'|gate name|'MEASURE'
 * circuit            {Array}
 * measurementOutcome {string|null}
 * gameStatus         {string|null} 'playing'|'won'|'lost'
 * gameLevel          {number}  current level index (0-based)
 * pageContext         {string} 'SIMULATOR'|'GAME'
 */
const QuantumGuide = ({
  onTryInSimulator,
  lastAction         = 'START',
  circuit            = [],
  measurementOutcome = null,
  gameStatus         = null,
  gameLevel          = 0,
  pageContext         = 'SIMULATOR',
}) => {
  const [open,        setOpen]        = useState(false);
  const [charPhase,   setCharPhase]   = useState('idle'); // idle|entering|open|exiting
  const [showDust,    setShowDust]    = useState(false);
  const [closingMenu, setClosingMenu] = useState(false);

  const [mood,        setMood]        = useState('idle');
  const [lookAngle,   setLookAngle]   = useState(0);

  const [bubbleText,  setBubbleText]  = useState(null);
  const [closedBubble,setClosedBubble]= useState(null);

  const bubbleTimer  = useRef(null);
  const closedTimer  = useRef(null);
  const celebTimer   = useRef(null);
  const prevAction   = useRef(lastAction);
  const prevStatus   = useRef(gameStatus);
  const firstVisit   = useRef(true);

  /* ── Helpers ───────────────────────────────────────── */
  const showBubble = useCallback((text, ms = 4000) => {
    clearTimeout(bubbleTimer.current);
    setBubbleText(text);
    if (ms > 0) bubbleTimer.current = setTimeout(() => setBubbleText(null), ms);
  }, []);

  const showClosedBubble = useCallback((text, ms = 5000) => {
    clearTimeout(closedTimer.current);
    setClosedBubble(text);
    closedTimer.current = setTimeout(() => setClosedBubble(null), ms);
  }, []);

  const celebrate = useCallback(() => {
    setMood('celebrate');
    clearTimeout(celebTimer.current);
    celebTimer.current = setTimeout(() => setMood('idle'), 780);
  }, []);

  /* ── Open ──────────────────────────────────────────── */
  const handleOpen = useCallback(() => {
    setOpen(true);
    setClosingMenu(false);
    setCharPhase('entering');
    setClosedBubble(null);

    // Sync prevAction to current value at open-time so the first gate
    // applied after opening always fires a reaction (fixes audit #9.7).
    prevAction.current = lastAction;
    prevStatus.current = gameStatus;

    setTimeout(() => {
      setCharPhase('open');
      setShowDust(true);
      setTimeout(() => setShowDust(false), 580);
    }, 520);

    setTimeout(() => {
      setMood('point');
      showBubble(SPEECH.OPEN, 4500);
      setTimeout(() => setMood('idle'), 1400);
    }, 600);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showBubble]);

  /* ── Close ─────────────────────────────────────────── */
  const handleClose = useCallback(() => {
    setMood('wave');
    setBubbleText(null);
    setClosingMenu(true);

    setTimeout(() => setCharPhase('exiting'), 360);

    setTimeout(() => {
      setOpen(false);
      setCharPhase('idle');
      setMood('idle');
      setLookAngle(0);
      setClosingMenu(false);
      setBubbleText(null);
    }, 800);
  }, []);

  /* ── Gate hover ────────────────────────────────────── */
  const handleGateHover = useCallback((gateId) => {
    if (!gateId) {
      setLookAngle(0);
      setMood('idle');
      showBubble(SPEECH.OPEN, 3500);
      return;
    }
    setLookAngle(LOOK[gateId] ?? 0);
    setMood('point');
    const hint = GATE_HOVER_HINTS[gateId] ?? SPEECH.HOVER[gateId] ?? '';
    showBubble(hint, 0);
  }, [showBubble]);

  /* ── Gate card click ───────────────────────────────── */
  const handleGateClick = useCallback((gateId) => {
    if (!gateId) {
      setMood('idle');
      setLookAngle(0);
      showBubble(SPEECH.BACK_TO_GATES, 3000);
      return;
    }
    celebrate();
    showBubble(SPEECH.GREAT_CHOICE, 2200);
  }, [celebrate, showBubble]);

  /* ── Simulator reactions ───────────────────────────── */
  useEffect(() => {
    if (!open || pageContext !== 'SIMULATOR') return;
    if (lastAction === prevAction.current) return;
    prevAction.current = lastAction;

    if (lastAction === 'START') {
      setMood('excited'); celebrate();
      showBubble(SPEECH.SIM_AFTER_RESET, 3500);
      return;
    }
    if (lastAction === 'MEASURE') {
      setMood('wink');
      setTimeout(() => setMood('idle'), 1200);
      showBubble(SPEECH.SIM_AFTER_MEAS, 4500);
      return;
    }
    const gates = new Set(circuit);
    if ((lastAction === 'H0' || lastAction === 'H1') && circuit.length === 1) {
      celebrate(); showBubble(SPEECH.SIM_AFTER_H, 4000);
    } else if (lastAction === 'CNOT' && gates.has('H0')) {
      celebrate(); showBubble(SPEECH.SIM_AFTER_H_CNOT, 5000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastAction, open]);

  /* Prompt to measure */
  useEffect(() => {
    if (!open || measurementOutcome || pageContext !== 'SIMULATOR') return;
    if (circuit.length >= 2) {
      const t = setTimeout(() => showBubble(SPEECH.SIM_BEFORE_MEAS, 4000), 900);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circuit.length, open]);

  /* First simulator visit */
  useEffect(() => {
    if (open && firstVisit.current && pageContext === 'SIMULATOR') {
      firstVisit.current = false;
      setTimeout(() => showBubble(SPEECH.SIM_FIRST_VISIT, 4500), 750);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* ── Game reactions ────────────────────────────────── */
  useEffect(() => {
    if (!open || pageContext !== 'GAME') return;
    if (gameStatus === prevStatus.current) return;
    prevStatus.current = gameStatus;
    if (gameStatus === 'won') {
      celebrate();
      showBubble(SPEECH.GAME_WON, 5500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus, open]);

  useEffect(() => {
    if (!open || pageContext !== 'GAME' || gameStatus !== 'playing') return;
    const gates = circuit;

    // Level-aware guidance: use the current level's hint rather than
    // hardcoding Bell-Pair steps for every puzzle (fixes audit #9.8).
    const level = LEVELS[gameLevel];
    if (!level) return;

    if (gates.length === 0) {
      showBubble(level.hint || `Goal: ${level.name}`, 5000);
      return;
    }

    const last = gates[gates.length - 1];
    // Detect clearly wrong first move (CNOT before any Hadamard)
    if (gates.length === 1 && last === 'CNOT' && !gates.includes('H0') && !gates.includes('H1')) {
      setMood('think');
      setTimeout(() => setMood('idle'), 900);
      showBubble(SPEECH.GAME_WRONG_ALT, 4000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circuit.length, open, pageContext]);

  /* ── Global events ─────────────────────────────────── */
  useEffect(() => {
    const onAchievement = (e) => {
      const id  = e.detail?.ids?.[0];
      const ach = Object.values(ACHIEVEMENTS).find((a) => a.id === id);
      const msg = ach ? SPEECH.ACHIEVEMENT(ach.name) : '\u2726 Achievement unlocked!';
      if (open) showBubble(msg, 5000); else showClosedBubble(msg, 5500);
      celebrate();
    };
    const onLesson = () => {
      if (open) showBubble(SPEECH.LESSON_DONE, 4000); else showClosedBubble(SPEECH.LESSON_DONE, 4500);
    };
    window.addEventListener('qsketch:achievement', onAchievement);
    window.addEventListener('qsketch:lesson-complete', onLesson);
    return () => {
      window.removeEventListener('qsketch:achievement', onAchievement);
      window.removeEventListener('qsketch:lesson-complete', onLesson);
    };
  }, [open, showBubble, showClosedBubble, celebrate]);

  /* ── Cleanup ───────────────────────────────────────── */
  useEffect(() => () => {
    clearTimeout(bubbleTimer.current);
    clearTimeout(closedTimer.current);
    clearTimeout(celebTimer.current);
  }, []);

  /* ══════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════ */
  return (
    /*
      .guide-anchor  — position:fixed bottom:20px right:20px z-index:9990
      All children have pointer-events:auto via .guide-anchor > *
    */
    <div className="guide-anchor" aria-label="Quantum Guide assistant" aria-modal={open || undefined} role={open ? 'dialog' : undefined}>

      {/* ── CLOSED ─────────────────────────────────── */}
      {!open && (
        <GuideButton onOpen={handleOpen} bubble={closedBubble} />
      )}

      {/* ── OPEN ───────────────────────────────────── */}
      {open && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 6,
          pointerEvents: 'none', /* individual children opt-in */
        }}>

          {/* 1 ── Detail panel (highest z) */}
          {/* Rendered by FloatingGateMenu, but we need pointer-events here */}
          <div style={{ pointerEvents: 'auto', width: '100%', display: 'contents' }}>
            <FloatingGateMenu
              closing={closingMenu}
              onGateHover={handleGateHover}
              onGateClick={handleGateClick}
              onTryInSimulator={(config) => {
                handleClose();
                setTimeout(() => onTryInSimulator?.(config), 320);
              }}
            />
          </div>

          {/* 2 ── Speech bubble */}
          <div style={{
            pointerEvents: 'none',
            alignSelf: 'flex-end',
            position: 'relative',
            zIndex: 25,
          }}>
            <GuideSpeechBubble text={bubbleText} />
          </div>

          {/* 3 ── Character row: character + close button */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            position: 'relative',
            zIndex: 5,
            pointerEvents: 'none',
          }}>
            {/* Dust lines on landing */}
            <DustLines visible={showDust} />

            {/* Character */}
            <div style={{ pointerEvents: 'none' }}>
              <GuideCharacter
                mood={mood}
                size={100}
                lookAngle={lookAngle}
                isEntering={charPhase === 'entering'}
                isExiting={charPhase  === 'exiting'}
              />
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              aria-label="Close Quantum Guide"
              title="Close"
              className="guide-close-btn"
              style={{ pointerEvents: 'auto' }}
            >
              ✕
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default QuantumGuide;