/**
 * GateTooltip
 * Reuses GuideSpeechBubble styling but positioned for gate buttons
 * Shows hint text on hover/tap with fade+scale animation
 * Can be disabled (e.g., in free mode)
 * 
 * Props:
 * - gateId: gate identifier
 * - text: tooltip text (show when non-null)
 * - enabled: whether to show tooltip (default true)
 */

const GateTooltip = ({ gateId, text, enabled = true }) => {
  const isVisible = !!text && enabled;

  return (
    <div
      className={`
        absolute left-1/2 transform -translate-x-1/2
        z-50
        transition-all duration-120 ease-out
        pointer-events-none
        ${isVisible
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-75'
        }
      `}
      style={{
        bottom: '100%',
        marginBottom: '8px',
        transformOrigin: 'bottom center',
      }}
      role="tooltip"
      aria-hidden={!isVisible}
    >
      {/* Tooltip bubble — reuses GuideSpeechBubble styling */}
      <div
        className="
          bg-white border-2 border-black rounded-lg
          shadow-[4px_4px_0_0_#000000]
          px-3 py-2 text-sm font-semibold text-black
          whitespace-nowrap
          relative
        "
      >
        {text}
        
        {/* Triangle pointer (down) pointing to gate button */}
        <svg
          aria-hidden="true"
          viewBox="0 0 20 10"
          width={20}
          height={10}
          className="absolute top-full left-1/2 transform -translate-x-1/2"
          style={{ display: 'block', overflow: 'visible', pointerEvents: 'none' }}
        >
          <polygon
            points="0,0 20,0 10,10"
            fill="#fff"
            stroke="#000"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <polygon points="1.5,0 18.5,0 10,8.5" fill="#fff" stroke="none" />
        </svg>
      </div>
    </div>
  );
};

export default GateTooltip;
