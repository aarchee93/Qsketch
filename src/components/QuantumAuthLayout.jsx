/**
 * QuantumAuthLayout
 * Wraps auth pages with an animated quantum field background
 * Similar to landing but with distinct design for auth context
 */

function QuantumField() {
  return (
    <svg
      className="quantum-auth-field"
      viewBox="0 0 920 920"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="quantum-auth-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#111" stopOpacity=".18" />
          <stop offset="72%" stopColor="#111" stopOpacity=".05" />
          <stop offset="100%" stopColor="#111" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="quantum-auth-line" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#111" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#111" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#111" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      
      {/* Main circle haze */}
      <circle
        className="field-haze"
        cx="460"
        cy="460"
        r="440"
        fill="url(#quantum-auth-fade)"
      />
      
      {/* Orbital rings */}
      <g className="field-orbits" fill="none" stroke="url(#quantum-auth-line)" strokeWidth="1.5">
        <circle cx="460" cy="460" r="200" opacity="0.4" />
        <circle cx="460" cy="460" r="300" opacity="0.3" />
        <circle cx="460" cy="460" r="380" opacity="0.2" />
      </g>
      
      {/* Quantum web structure */}
      <g className="field-web" fill="none" stroke="url(#quantum-auth-line)" strokeWidth="1.2" opacity="0.5">
        <path d="M460 80 L620 200 L700 380 L620 560 L460 680 L300 560 L220 380 L300 200 Z" />
        <path d="M460 460 L620 200 M460 460 L700 380 M460 460 L620 560 M460 460 L300 560 M460 460 L220 380 M460 460 L300 200" />
      </g>
      
      {/* Central node cluster */}
      <g className="field-nodes" fill="#111" opacity="0.6">
        <circle cx="460" cy="460" r="8" />
        <circle cx="540" cy="380" r="4" opacity="0.7" />
        <circle cx="580" cy="500" r="4" opacity="0.7" />
        <circle cx="380" cy="500" r="4" opacity="0.7" />
        <circle cx="340" cy="380" r="4" opacity="0.7" />
      </g>
    </svg>
  );
}

/**
 * Quantum state indicator dots
 * Animated circles that pulse and orbit to show quantum superposition concept
 */
function QuantumStateIndicator() {
  return (
    <div className="quantum-state-indicator">
      <div className="indicator-dot dot-1" />
      <div className="indicator-dot dot-2" />
      <div className="indicator-dot dot-3" />
    </div>
  );
}

const QuantumAuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white flex items-center justify-center">
      {/* Animated quantum atmosphere background */}
      <div className="quantum-atmosphere fixed inset-0 -z-10">
        <QuantumField />
      </div>

      {/* Main content area */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Page content */}
        {children}

        {/* Subtle quantum grid overlay */}
        <div className="quantum-grid-overlay" />
      </div>
    </div>
  );
};

export default QuantumAuthLayout;
