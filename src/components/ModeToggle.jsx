import { playClickSound } from '../utils/soundUtils';

/**
 * ModeToggle
 * Segmented toggle control (Guided / Free)
 * Matches SketchButton styling with hard shadow on press
 * Uses SVG icons (no emojis)
 */
const ModeToggle = ({ mode, onChange }) => {
  const isGuided = mode === 'guided';
  
  return (
    <div className="flex items-center gap-1 border-2 border-black rounded-lg p-1 bg-white shadow-[4px_4px_0_0_#000000] inline-flex">
      {/* Guided Button */}
      <button
        onClick={() => {
          playClickSound();
          onChange('guided');
        }}
        className={`
          px-3 py-2 font-bold text-sm transition-all duration-100 flex items-center gap-2
          ${isGuided
            ? 'bg-black text-white border-2 border-black rounded-md shadow-[2px_2px_0_0_rgba(0,0,0,0.3)]'
            : 'bg-white text-black border-2 border-transparent hover:bg-black/5'
          }
        `}
        aria-pressed={isGuided}
        title="Guided mode: step-by-step prompts and gate restrictions"
      >
        <svg className={`w-4 h-4 ${isGuided ? 'fill-white' : 'fill-black'}`} viewBox="0 0 24 24">
          <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
        </svg>
        Guided
      </button>

      {/* Free Button */}
      <button
        onClick={() => {
          playClickSound();
          onChange('free');
        }}
        className={`
          px-3 py-2 font-bold text-sm transition-all duration-100 flex items-center gap-2
          ${!isGuided
            ? 'bg-black text-white border-2 border-black rounded-md shadow-[2px_2px_0_0_rgba(0,0,0,0.3)]'
            : 'bg-white text-black border-2 border-transparent hover:bg-black/5'
          }
        `}
        aria-pressed={!isGuided}
        title="Free mode: experiment without restrictions"
      >
        <svg className={`w-4 h-4 ${!isGuided ? 'fill-white' : 'fill-black'}`} viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
        </svg>
        Free
      </button>
    </div>
  );
};

export default ModeToggle;
