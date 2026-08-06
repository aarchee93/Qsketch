// Shared mascot — "The Nucleus". Black & white only, matches site's flat sketch style.
// Reused across HelpPanel, Resources, and Simulator guided mode.
const MascotCharacter = ({ mood = 'idle', size = 90, pointing = false }) => (
  <svg viewBox="0 0 100 140" width={size} height={size * 1.4} aria-hidden="true">
    {/* antenna */}
    <line x1="50" y1="4" x2="50" y2="16" stroke="#000" strokeWidth="3" strokeLinecap="round" />
    <circle cx="50" cy="4" r="4.5" fill="#000" />

    {/* head */}
    <rect x="24" y="14" width="52" height="38" rx="19" fill="#fff" stroke="#000" strokeWidth="3.5" />
    {/* ears */}
    <circle cx="22" cy="34" r="5" fill="#fff" stroke="#000" strokeWidth="3" />
    <circle cx="78" cy="34" r="5" fill="#fff" stroke="#000" strokeWidth="3" />

    {/* face screen */}
    <rect x="34" y="23" width="32" height="20" rx="8" fill="#000" />
    {mood === 'excited' ? (
      <>
        <circle cx="43" cy="33" r="3" fill="#fff" />
        <circle cx="57" cy="33" r="3" fill="#fff" />
        <path d="M41 37 Q50 42 59 37" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
      </>
    ) : mood === 'wink' ? (
      <>
        <path d="M40 33 L46 33" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="57" cy="33" r="3" fill="#fff" />
        <path d="M42 37 Q50 40 58 37" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx="43" cy="33" r="3" fill="#fff" />
        <circle cx="57" cy="33" r="3" fill="#fff" />
        <path d="M42 38 Q50 41 58 38" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
      </>
    )}

    {/* neck */}
    <rect x="44" y="50" width="12" height="6" fill="#fff" stroke="#000" strokeWidth="2.5" />

    {/* body */}
    <ellipse cx="50" cy="84" rx="30" ry="28" fill="#fff" stroke="#000" strokeWidth="3.5" />
    <circle cx="50" cy="84" r="11" fill="#fff" stroke="#000" strokeWidth="3" />
    <circle cx="50" cy="84" r="4" fill="#000" />

    {/* left arm — stays neutral */}
    <path d="M22 76 Q6 80 8 96" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round" />
    <circle cx="8" cy="98" r="6" fill="#fff" stroke="#000" strokeWidth="3" />

    {/* right arm — neutral or raised/pointing */}
    {pointing ? (
      <g className="mascot-point">
        <path d="M78 74 Q100 60 108 40" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round" />
        <g transform="translate(108,40) rotate(-35)">
          <ellipse cx="0" cy="0" rx="7" ry="6" fill="#fff" stroke="#000" strokeWidth="3" />
          <rect x="4" y="-2" width="10" height="4" rx="2" fill="#fff" stroke="#000" strokeWidth="2.5" />
        </g>
      </g>
    ) : (
      <>
        <path d="M78 76 Q94 80 92 96" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="92" cy="98" r="6" fill="#fff" stroke="#000" strokeWidth="3" />
      </>
    )}

    {/* legs + feet */}
    <rect x="34" y="108" width="12" height="20" rx="4" fill="#fff" stroke="#000" strokeWidth="3" />
    <rect x="54" y="108" width="12" height="20" rx="4" fill="#fff" stroke="#000" strokeWidth="3" />
    <ellipse cx="40" cy="132" rx="10" ry="5" fill="#000" />
    <ellipse cx="60" cy="132" rx="10" ry="5" fill="#000" />
  </svg>
);

export default MascotCharacter;