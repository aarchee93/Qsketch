// Sound utility for button clicks using Web Audio API
// Generates a simple "click" sound without requiring audio files

let audioContext = null;

// Initialize audio context (lazy initialization)
const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Plays a click sound using Web Audio API
 * Creates a short, pleasant "click" sound
 */
export const playClickSound = () => {
  try {
    const ctx = getAudioContext();
    
    // Create oscillator for the click sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Configure the sound
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime); // Higher pitch for click
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05); // Quick drop
    
    // Envelope for the sound (quick attack, quick decay)
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.001); // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05); // Quick decay
    
    // Play the sound
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05); // Very short duration
  } catch (error) {
    // Silently fail if audio context is not available
    // This can happen in some browsers or if audio is disabled
    console.debug('Audio not available:', error);
  }
};

/**
 * Plays a slightly different sound for important actions
 */
export const playActionSound = () => {
  try {
    const ctx = getAudioContext();
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.08);
  } catch (error) {
    console.debug('Audio not available:', error);
  }
};

