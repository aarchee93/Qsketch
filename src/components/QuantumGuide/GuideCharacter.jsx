import { useEffect, useRef, useState } from 'react';

/**
 * GuideCharacter — full-body hand-drawn scientist companion
 *
 * B&W sketch style: thick outlines, white fill, notebook-doodle proportions.
 * Character wears a hoodie/lab coat, has large expressive eyes, messy hair.
 *
 * Moods
 * ─────
 * 'idle'       default — gentle breathing float, normal eyes
 * 'excited'    wide eyes, big smile, raised brows
 * 'wink'       one eye winking, slight smirk
 * 'wave'       right arm raised and waving
 * 'point'      right arm extended pointing left (toward cards)
 * 'celebrate'  both arms up, big smile, hop animation
 * 'think'      hand on chin, tilted head
 *
 * Props
 * ─────
 * mood        {string}   see above
 * size        {number}   width in px (height = size × 1.6)
 * lookAngle   {number}   –25..25 degrees, head turns toward hovered card
 * isEntering  {boolean}  plays jump-in animation
 * isExiting   {boolean}  plays jump-out animation
 */
const GuideCharacter = ({
  mood       = 'idle',
  size       = 96,
  lookAngle  = 0,
  isEntering = false,
  isExiting  = false,
  className  = '',
}) => {
  const [blinking, setBlinking] = useState(false);
  const blinkTimer = useRef(null);

  /* Random blink every 2.5–5 s */
  useEffect(() => {
    const schedule = () => {
      blinkTimer.current = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 160);
        schedule();
      }, 2500 + Math.random() * 2500);
    };
    schedule();
    return () => clearTimeout(blinkTimer.current);
  }, []);

  /* Root CSS animation class */
  const rootClass = [
    isEntering           ? 'guide-char-entering'   :
    isExiting            ? 'guide-char-exiting'    :
    mood === 'celebrate' ? 'guide-char-celebrating':
    'guide-char-idle',
    className,
  ].filter(Boolean).join(' ');

  /* Head tilt toward hovered card */
  const clampedAngle = Math.max(-22, Math.min(22, lookAngle));
  const headGroupStyle = {
    transformOrigin: '60px 52px',
    transform: `rotate(${clampedAngle * 0.4}deg)`,
    transition: 'transform 0.32s cubic-bezier(0.34,1.56,0.64,1)',
  };

  /* ── EYES ── */
  const renderEyes = () => {
    if (blinking) {
      return (
        <>
          <line x1="46" y1="51" x2="56" y2="51" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
          <line x1="64" y1="51" x2="74" y2="51" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
        </>
      );
    }
    if (mood === 'wink') {
      return (
        <>
          {/* Left eye — winking (closed arc) */}
          <path d="M46 51 Q51 47 56 51" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          {/* Right eye — open, bright */}
          <circle cx="69" cy="51" r="6" fill="#fff" stroke="#000" strokeWidth="2.5"/>
          <circle cx="71" cy="49" r="2.5" fill="#000"/>
          <circle cx="72" cy="48" r="1" fill="#fff"/>
        </>
      );
    }
    if (mood === 'excited' || mood === 'celebrate') {
      return (
        <>
          {/* Big sparkle eyes */}
          <circle cx="51" cy="51" r="7" fill="#fff" stroke="#000" strokeWidth="2.5"/>
          <circle cx="53" cy="49" r="3" fill="#000"/>
          <circle cx="55" cy="47" r="1.2" fill="#fff"/>
          <circle cx="69" cy="51" r="7" fill="#fff" stroke="#000" strokeWidth="2.5"/>
          <circle cx="71" cy="49" r="3" fill="#000"/>
          <circle cx="73" cy="47" r="1.2" fill="#fff"/>
          {/* Raised excited brows */}
          <path d="M45 42 Q51 38 57 42" stroke="#000" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <path d="M63 42 Q69 38 75 42" stroke="#000" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          {/* Rosy cheeks — sketch dots */}
          <circle cx="42" cy="57" r="3" fill="none" stroke="#000" strokeWidth="1" opacity="0.35" strokeDasharray="1 1.5"/>
          <circle cx="78" cy="57" r="3" fill="none" stroke="#000" strokeWidth="1" opacity="0.35" strokeDasharray="1 1.5"/>
        </>
      );
    }
    if (mood === 'think') {
      return (
        <>
          <circle cx="51" cy="51" r="5.5" fill="#fff" stroke="#000" strokeWidth="2.5"/>
          <circle cx="52" cy="50" r="2" fill="#000"/>
          {/* Right eye looking up-left in thought */}
          <circle cx="69" cy="51" r="5.5" fill="#fff" stroke="#000" strokeWidth="2.5"/>
          <circle cx="68" cy="49" r="2" fill="#000"/>
          {/* Furrowed brow */}
          <path d="M45 43 Q51 40 57 43" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M63 44 Q69 41 75 44" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </>
      );
    }
    /* idle / default */
    return (
      <>
        <circle cx="51" cy="51" r="6" fill="#fff" stroke="#000" strokeWidth="2.5"/>
        <circle cx="53" cy="49" r="2.5" fill="#000"/>
        <circle cx="55" cy="48" r="1" fill="#fff"/>
        <circle cx="69" cy="51" r="6" fill="#fff" stroke="#000" strokeWidth="2.5"/>
        <circle cx="71" cy="49" r="2.5" fill="#000"/>
        <circle cx="73" cy="48" r="1" fill="#fff"/>
      </>
    );
  };

  /* ── MOUTH ── */
  const renderMouth = () => {
    if (mood === 'excited' || mood === 'celebrate') {
      return <path d="M47 62 Q60 72 73 62" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round"/>;
    }
    if (mood === 'wink') {
      return <path d="M49 63 Q60 68 71 63" stroke="#000" strokeWidth="2.2" fill="none" strokeLinecap="round"/>;
    }
    if (mood === 'think') {
      return <path d="M51 65 Q60 63 69 65" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"/>;
    }
    /* idle / wave / point */
    return <path d="M50 63 Q60 68 70 63" stroke="#000" strokeWidth="2.2" fill="none" strokeLinecap="round"/>;
  };

  /* ── ARMS ── */
  const renderArms = () => {
    if (mood === 'celebrate') {
      return (
        <>
          {/* Both arms raised jubilantly */}
          <line x1="38" y1="118" x2="18" y2="88" stroke="#000" strokeWidth="7" strokeLinecap="round"/>
          <ellipse cx="16" cy="84" rx="7" ry="7" fill="#fff" stroke="#000" strokeWidth="3"/>
          {/* Left hand fingers */}
          <line x1="16" y1="77" x2="13" y2="70" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="16" y1="77" x2="19" y2="69" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>

          <line x1="82" y1="118" x2="102" y2="88" stroke="#000" strokeWidth="7" strokeLinecap="round"/>
          <ellipse cx="104" cy="84" rx="7" ry="7" fill="#fff" stroke="#000" strokeWidth="3"/>
          <line x1="104" y1="77" x2="101" y2="70" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="104" y1="77" x2="107" y2="69" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
        </>
      );
    }
    if (mood === 'wave') {
      return (
        <>
          {/* Left arm — relaxed down */}
          <line x1="38" y1="118" x2="24" y2="148" stroke="#000" strokeWidth="7" strokeLinecap="round"/>
          <ellipse cx="22" cy="153" rx="7" ry="6" fill="#fff" stroke="#000" strokeWidth="3"/>

          {/* Right arm — raised and waving */}
          <g style={{ transformOrigin: '82px 118px', animation: 'guide-wave-arm 0.9s ease-in-out 3' }}>
            <line x1="82" y1="118" x2="104" y2="86" stroke="#000" strokeWidth="7" strokeLinecap="round"/>
            <ellipse cx="107" cy="81" rx="7" ry="7" fill="#fff" stroke="#000" strokeWidth="3"/>
            {/* Wave motion lines */}
            <line x1="114" y1="72" x2="118" y2="66" stroke="#000" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
            <line x1="112" y1="68" x2="117" y2="63" stroke="#000" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
          </g>
        </>
      );
    }
    if (mood === 'point') {
      return (
        <>
          {/* Left arm — relaxed */}
          <line x1="38" y1="118" x2="24" y2="148" stroke="#000" strokeWidth="7" strokeLinecap="round"/>
          <ellipse cx="22" cy="153" rx="7" ry="6" fill="#fff" stroke="#000" strokeWidth="3"/>

          {/* Right arm — extended pointing LEFT (toward cards) */}
          <g style={{ transformOrigin: '82px 118px', animation: 'guide-point-arm 1.6s ease-in-out infinite' }}>
            <line x1="82" y1="118" x2="108" y2="108" stroke="#000" strokeWidth="7" strokeLinecap="round"/>
            <ellipse cx="112" cy="106" rx="7" ry="6" fill="#fff" stroke="#000" strokeWidth="3"/>
            {/* Extended pointing finger */}
            <line x1="118" y1="103" x2="128" y2="98" stroke="#000" strokeWidth="3.5" strokeLinecap="round"/>
            {/* Pointer motion dashes */}
            <line x1="131" y1="96" x2="136" y2="94" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
          </g>
        </>
      );
    }
    if (mood === 'think') {
      return (
        <>
          {/* Left arm — hand raised to chin */}
          <line x1="38" y1="118" x2="30" y2="98" stroke="#000" strokeWidth="7" strokeLinecap="round"/>
          <ellipse cx="28" cy="93" rx="7" ry="6" fill="#fff" stroke="#000" strokeWidth="3"/>
          {/* Thought bubble dots */}
          <circle cx="88" cy="28" r="2" fill="#000" opacity="0.4"/>
          <circle cx="94" cy="20" r="3" fill="#000" opacity="0.4"/>
          <circle cx="102" cy="13" r="4.5" fill="#fff" stroke="#000" strokeWidth="2" opacity="0.6"/>
          <text x="99" y="17" fontSize="5" fill="#000" fontFamily="sans-serif" opacity="0.7">?</text>

          {/* Right arm — relaxed */}
          <line x1="82" y1="118" x2="96" y2="148" stroke="#000" strokeWidth="7" strokeLinecap="round"/>
          <ellipse cx="98" cy="153" rx="7" ry="6" fill="#fff" stroke="#000" strokeWidth="3"/>
        </>
      );
    }
    /* idle / excited — both arms relaxed at sides */
    return (
      <>
        <line x1="38" y1="118" x2="24" y2="150" stroke="#000" strokeWidth="7" strokeLinecap="round"/>
        <ellipse cx="22" cy="155" rx="7" ry="6" fill="#fff" stroke="#000" strokeWidth="3"/>

        <line x1="82" y1="118" x2="96" y2="150" stroke="#000" strokeWidth="7" strokeLinecap="round"/>
        <ellipse cx="98" cy="155" rx="7" ry="6" fill="#fff" stroke="#000" strokeWidth="3"/>
      </>
    );
  };

  const w = size;
  const h = Math.round(size * 1.65);

  return (
    <svg
      viewBox="0 0 120 198"
      width={w}
      height={h}
      aria-hidden="true"
      className={rootClass}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* ════════════════════════════════════════
          LEGS & FEET  (drawn first, behind body)
          ════════════════════════════════════════ */}
      {/* Left leg */}
      <rect x="36" y="162" width="18" height="28" rx="6" fill="#fff" stroke="#000" strokeWidth="3"/>
      {/* Right leg */}
      <rect x="66" y="162" width="18" height="28" rx="6" fill="#fff" stroke="#000" strokeWidth="3"/>
      {/* Left shoe — chunky sketch shoe */}
      <ellipse cx="42" cy="192" rx="14" ry="6" fill="#000"/>
      <ellipse cx="38" cy="190" rx="6" ry="4" fill="#fff" opacity="0.15"/>
      {/* Right shoe */}
      <ellipse cx="78" cy="192" rx="14" ry="6" fill="#000"/>
      <ellipse cx="74" cy="190" rx="6" ry="4" fill="#fff" opacity="0.15"/>

      {/* ════════════════════════════════════════
          BODY — hoodie / lab coat
          ════════════════════════════════════════ */}
      {/* Main torso */}
      <rect x="28" y="100" width="64" height="68" rx="14" fill="#fff" stroke="#000" strokeWidth="3.5"/>

      {/* Hoodie front pocket */}
      <path
        d="M44 138 Q60 132 76 138 L74 158 Q60 162 46 158 Z"
        fill="#fff" stroke="#000" strokeWidth="2.5"
      />
      {/* Pocket crease doodles */}
      <line x1="54" y1="142" x2="52" y2="156" stroke="#000" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
      <line x1="66" y1="142" x2="68" y2="156" stroke="#000" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>

      {/* Hoodie drawstring */}
      <path d="M54 106 Q60 110 66 106" stroke="#000" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <line x1="57" y1="110" x2="56" y2="118" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="63" y1="110" x2="64" y2="118" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Collar / hoodie opening */}
      <path d="M46 100 Q60 112 74 100" fill="#fff" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>

      {/* Shirt bottom hem stitching */}
      <line x1="34" y1="165" x2="86" y2="165" stroke="#000" strokeWidth="1.2" strokeDasharray="3 2" strokeLinecap="round" opacity="0.4"/>

      {/* Shoulder seams */}
      <line x1="28" y1="112" x2="35" y2="108" stroke="#000" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
      <line x1="92" y1="112" x2="85" y2="108" stroke="#000" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>

      {/* ════════════════════════════════════════
          ARMS
          ════════════════════════════════════════ */}
      {renderArms()}

      {/* ════════════════════════════════════════
          NECK
          ════════════════════════════════════════ */}
      <rect x="52" y="84" width="16" height="20" rx="4" fill="#fff" stroke="#000" strokeWidth="2.5"/>

      {/* ════════════════════════════════════════
          HEAD GROUP (rotates toward hovered card)
          ════════════════════════════════════════ */}
      <g style={headGroupStyle}>

        {/* ── HAIR ── messy sketch hair */}
        {/* Base hair shape */}
        <ellipse cx="60" cy="38" rx="30" ry="26" fill="#000"/>
        {/* Hair highlight / inner face cutout */}
        <ellipse cx="60" cy="44" rx="24" ry="22" fill="#fff"/>
        {/* Messy hair tufts */}
        <path d="M32 30 Q28 18 36 14 Q34 24 40 26" fill="#000" stroke="#000" strokeWidth="1"/>
        <path d="M42 18 Q44 8 52 10 Q48 18 50 24" fill="#000" stroke="#000" strokeWidth="1"/>
        <path d="M60 14 Q62 4 70 8 Q66 16 64 20" fill="#000" stroke="#000" strokeWidth="1"/>
        <path d="M72 18 Q80 10 86 16 Q80 20 78 26" fill="#000" stroke="#000" strokeWidth="1"/>
        <path d="M84 30 Q92 22 90 34 Q86 30 82 32" fill="#000" stroke="#000" strokeWidth="1"/>

        {/* ── FACE ── */}
        {/* Face oval */}
        <ellipse cx="60" cy="52" rx="26" ry="28" fill="#fff" stroke="#000" strokeWidth="3"/>

        {/* Ear left */}
        <ellipse cx="34" cy="52" rx="5" ry="7" fill="#fff" stroke="#000" strokeWidth="2.5"/>
        <path d="M36 47 Q33 52 36 57" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Ear right */}
        <ellipse cx="86" cy="52" rx="5" ry="7" fill="#fff" stroke="#000" strokeWidth="2.5"/>
        <path d="M84 47 Q87 52 84 57" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

        {/* Eyebrows */}
        <path d="M43 42 Q51 39 57 43" stroke="#000" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
        <path d="M63 43 Q69 39 77 42" stroke="#000" strokeWidth="2.8" fill="none" strokeLinecap="round"/>

        {/* Eyes */}
        {renderEyes()}

        {/* Nose — simple sketch bump */}
        <path d="M57 55 Q59 61 63 59" stroke="#000" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

        {/* Mouth */}
        {renderMouth()}

        {/* Freckles — notebook detail */}
        <circle cx="50" cy="58" r="1.2" fill="#000" opacity="0.25"/>
        <circle cx="53" cy="60" r="1" fill="#000" opacity="0.2"/>
        <circle cx="70" cy="58" r="1.2" fill="#000" opacity="0.25"/>
        <circle cx="67" cy="60" r="1" fill="#000" opacity="0.2"/>

        {/* Hair strand falling over forehead */}
        <path d="M44 28 Q46 38 42 44" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M50 22 Q55 32 52 40" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"/>

      </g>{/* end head group */}

      {/* ════════════════════════════════════════
          NOTEBOOK / CLIPBOARD accessory
          Small detail tucked under left arm in idle
          ════════════════════════════════════════ */}
      {(mood === 'idle' || mood === 'think') && (
        <g opacity="0.7">
          <rect x="10" y="130" width="22" height="28" rx="2" fill="#fff" stroke="#000" strokeWidth="2"/>
          {/* Notebook lines */}
          <line x1="13" y1="137" x2="29" y2="137" stroke="#000" strokeWidth="1" strokeLinecap="round"/>
          <line x1="13" y1="141" x2="29" y2="141" stroke="#000" strokeWidth="1" strokeLinecap="round"/>
          <line x1="13" y1="145" x2="25" y2="145" stroke="#000" strokeWidth="1" strokeLinecap="round"/>
          {/* Notebook binding */}
          <line x1="14" y1="130" x2="14" y2="158" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
        </g>
      )}
    </svg>
  );
};

export default GuideCharacter;
