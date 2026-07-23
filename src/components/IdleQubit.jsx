import { useEffect, useRef, useState } from 'react';

/**
 * A tiny ambient qubit status icon. Breathes gently when idle, flashes when
 * a gate lands, plays a collapse animation during measurement, and spins
 * through a reset animation when the circuit is cleared.
 *
 * activityKey: pass any value that changes whenever a gate commits
 * (e.g. circuit.length) to trigger the brighter "state recalculated" flash.
 * mode: 'idle' | 'pulse' | 'collapse' | 'reset' — drives the qubit's reaction.
 */
const IdleQubit = ({ activityKey, mode = 'idle' }) => {
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

  const statusText = {
    pulse: 'applying gate…',
    collapse: 'collapsing…',
    reset: 'resetting…',
    idle: flash ? 'state recalculated' : 'system idle · ready',
  }[mode];

  const animationClass = {
    pulse: 'animate-pulse',
    collapse: 'animate-qubit-collapse',
    reset: 'animate-qubit-reset',
    idle: '',
  }[mode];

  return (
    <div className="flex items-center gap-2 text-xs font-mono text-black/60" title="System is live">
      <span className={`relative flex h-3 w-3 items-center justify-center ${animationClass}`}>
        <span
          className={`absolute inline-flex h-full w-full rounded-full bg-black ${
            flash || mode !== 'idle' ? 'opacity-40 animate-ping' : 'opacity-20 animate-pulse'
          }`}
        />
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 bg-black ${flash ? 'scale-125' : ''} transition-transform`} />
      </span>
      <span>{statusText}</span>
    </div>
  );
};

export default IdleQubit;
