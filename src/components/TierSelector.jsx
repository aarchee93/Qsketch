import { useState } from 'react';
import { playClickSound } from '../utils/soundUtils';

/**
 * SVG Icons for Tier Selector
 */
const BookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const ToolIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 1 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const ZapIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

/**
 * TierSelector
 * Three-button toggle for selecting game difficulty tier
 * Tier 1: Tutorial-paced, heavy guidance
 * Tier 2: Multi-gate puzzles, lighter guidance
 * Tier 3: Open-ended sandbox, minimal hand-holding
 */
const TierSelector = ({ selectedTier, onChange }) => {
  const [hoveredTier, setHoveredTier] = useState(null);

  const tiers = [
    {
      id: 'tier_1',
      label: 'Tier 1',
      icon: BookIcon,
      description: 'Tutorial-paced, heavy guidance',
      subtitle: '3 levels',
      feedbackText: '💡 Perfect for beginners! Each step is explained.'
    },
    {
      id: 'tier_2',
      label: 'Tier 2',
      icon: ToolIcon,
      description: 'Multi-gate puzzles, lighter guidance',
      subtitle: '4 levels',
      feedbackText: '🔧 Good balance. You\'ll learn new patterns.'
    },
    {
      id: 'tier_3',
      label: 'Tier 3',
      icon: ZapIcon,
      description: 'Open-ended sandbox, minimal hand-holding',
      subtitle: '4 levels',
      feedbackText: '🚀 Challenge yourself! Minimal hints, full freedom.'
    },
  ];

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold mb-2">Choose Your Challenge Level</h2>
        <p className="text-sm text-black/60">Select how much guidance you want while solving quantum puzzles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier) => {
          const isSelected = selectedTier === tier.id;
          const isHovered = hoveredTier === tier.id;
          const IconComponent = tier.icon;
          return (
            <button
              key={tier.id}
              onClick={() => {
                playClickSound();
                onChange(tier.id);
              }}
              onMouseEnter={() => setHoveredTier(tier.id)}
              onMouseLeave={() => setHoveredTier(null)}
              className={`
                p-6 rounded-lg border-2 transition-all duration-150 h-full
                ${isSelected
                  ? 'border-black bg-white text-black shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]'
                  : isHovered
                  ? 'border-black bg-white text-black shadow-[2px_2px_0_0_#000000]'
                  : 'border-black/30 bg-white text-black'
                }
              `}
            >
              <div className="h-16 mb-3 flex items-center justify-center">
                <IconComponent className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-xl font-extrabold mb-1">{tier.label}</h3>
              <p className="text-xs font-semibold mb-3 text-black/60">
                {tier.subtitle}
              </p>
              <p className="text-sm leading-tight text-black/70">
                {tier.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className={`
        p-4 rounded-lg border-2 border-black bg-black/5
        text-center text-sm font-semibold transition-all duration-200
      `}>
        {hoveredTier
          ? tiers.find(t => t.id === hoveredTier)?.feedbackText
          : selectedTier
          ? tiers.find(t => t.id === selectedTier)?.feedbackText
          : 'Hover or select a tier to see what awaits you!'
        }
      </div>
    </div>
  );
};

export default TierSelector;
