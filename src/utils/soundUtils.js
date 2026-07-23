// Sound utility for lab feedback sounds using Web Audio API.
// Generates short synthesized tones without requiring audio files, so
// every sound below shares the same lightweight oscillator approach.

let audioContext = null;
let muted = false;

const MUTE_STORAGE_KEY = 'qubitSketchpadMuted';

// Restore mute preference (best-effort — falls back to unmuted).
try {
  muted = window.localStorage?.getItem(MUTE_STORAGE_KEY) === 'true';
} catch {
  muted = false;
}

export const isMuted = () => muted;

export const setMuted = (value) => {
  muted = !!value;
  try {
    window.localStorage?.setItem(MUTE_STORAGE_KEY, String(muted));
  } catch {
    // ignore storage errors — mute state just won't persist
  }
};

// Initialize audio context (lazy initialization)
const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

const playTone = (steps) => {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    steps(ctx, oscillator, gainNode);
  } catch (error) {
    // Silently fail if audio context is not available
    // (can happen in some browsers or if audio is disabled)
    console.debug('Audio not available:', error);
  }
};

/**
 * Plays a click sound using Web Audio API.
 * Creates a short, pleasant "click" sound — used for general button presses.
 */
export const playClickSound = () => {
  playTone((ctx, oscillator, gainNode) => {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  });
};

/**
 * Plays a slightly different sound for important actions (gate applied).
 */
export const playActionSound = () => {
  playTone((ctx, oscillator, gainNode) => {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.08);
  });
};

/**
 * A short descending "collapse" tone played on measurement.
 */
export const playMeasureSound = () => {
  playTone((ctx, oscillator, gainNode) => {
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(900, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.25);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.25);
  });
};

/**
 * A bright two-note "success" chime.
 */
export const playSuccessSound = () => {
  playTone((ctx, oscillator, gainNode) => {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  });
};

/**
 * A short ascending three-note "achievement" fanfare.
 */
export const playAchievementSound = () => {
  playTone((ctx, oscillator, gainNode) => {
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
    oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24); // G5

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.45);
  });
};

/**
 * A short low "error" buzz.
 */
export const playErrorSound = () => {
  playTone((ctx, oscillator, gainNode) => {
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(180, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  });
};
