import { useEffect, useRef, useState } from 'react';

/**
 * A tiny ambient "breathing" qubit icon. Pulses gently when idle, and gives
 * a quick brighter flash right after an action, so the page never looks
 * frozen even before the user does anything.
 *
 * activityKey: pass any value that changes whenever an action happens
 * (e.g. circuit.length, or a lastAction string) to trigger the flash.
 */
const IdleQubit = ({ activityKey }) => {
  const [flash, setFlash] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return undefined;
    }
    setFlash(true);
    const timeout = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(timeout);
  }, [activityKey]);

  return (
    <div className="flex items-center gap-2 text-xs font-mono text-black/60" title="System is live">
      <span className="relative flex h-3 w-3 items-center justify-center">
        <span
          className={`absolute inline-flex h-full w-full rounded-full bg-black ${
            flash ? 'opacity-40 animate-ping' : 'opacity-20 animate-pulse'
          }`}
        />
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 bg-black ${flash ? 'scale-125' : ''} transition-transform`} />
      </span>
      <span>{flash ? 'state recalculated' : 'system idle · ready'}</span>
    </div>
  );
};

export default IdleQubit;
