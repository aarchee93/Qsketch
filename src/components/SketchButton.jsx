import { forwardRef } from 'react';
import { playClickSound } from '../utils/soundUtils';

// Button styled for the "doodley" aesthetic with black and white theme
const SketchButton = forwardRef(({
  onClick,
  children,
  className = '',
  disabled,
  type,
  variant = 'default',
  ...props
}, ref) => {
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
        return 'bg-black text-white hover:bg-black';
      case 'outlined':
        return 'bg-transparent text-black hover:bg-black hover:text-white';
      default:
        return 'bg-white text-black';
    }
  };

  return (
    <button
      ref={ref}
      type={type || 'button'}
      onClick={handleClick}
      disabled={disabled}
      {...props}
      className={`
        px-4 py-2 border-2 border-black shadow-[4px_4px_0_0_#000000] 
        font-bold transition-all duration-100 ease-out 
        hover:shadow-[2px_2px_0_0_#000000] hover:translate-x-[2px] hover:translate-y-[2px]
        active:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:scale-95 active:-rotate-1
        text-sm md:text-base whitespace-nowrap
        disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
        ${getVariantClasses()}
        ${className}
      `}
    >
      {children}
    </button>
  );
});

SketchButton.displayName = 'SketchButton';

export default SketchButton;
