import { playClickSound } from '../utils/soundUtils';

// Button styled for the "doodley" aesthetic with black and white theme
const SketchButton = ({ onClick, children, className = '', disabled, type, variant = 'default' }) => {
  const handleClick = (e) => {
    if (!disabled && onClick) {
      playClickSound();
      onClick(e);
    }
  };

  // Black and white variants
  const getVariantClasses = () => {
    switch (variant) {
      case 'inverted':
        return 'bg-black text-white hover:bg-gray-900';
      case 'outlined':
        return 'bg-white text-black border-2 border-black';
      default:
        return 'bg-white text-black';
    }
  };

  return (
    <button
      type={type || 'button'}
      onClick={handleClick}
      disabled={disabled}
      className={`
        px-4 py-2 border-2 border-black shadow-[4px_4px_0_0_#000000] 
        font-bold transition-all duration-100 ease-out 
        hover:shadow-[2px_2px_0_0_#000000] hover:translate-x-[2px] hover:translate-y-[2px]
        active:shadow-none active:translate-x-[4px] active:translate-y-[4px] 
        text-sm md:text-base whitespace-nowrap
        disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed
        ${getVariantClasses()}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default SketchButton;

