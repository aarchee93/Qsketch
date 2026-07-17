import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number counting up/down toward `value` instead of snapping.
 * Cheap way to make the UI feel alive on every state change.
 */
const AnimatedNumber = ({ value, duration = 400, formatter = (v) => Math.round(v) }) => {
  const [display, setDisplay] = useState(value);
  const frameRef = useRef(null);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return undefined;

    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      setDisplay(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        fromRef.current = to;
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      fromRef.current = to;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <>{formatter(display)}</>;
};

export default AnimatedNumber;
