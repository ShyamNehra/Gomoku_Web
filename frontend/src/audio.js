const SOUNDS = {
  click: "/sounds/click.wav",
  place: "/sounds/place.wav",
  win:   "/sounds/win.wav",
  lose:  "/sounds/lose.wav",
};

const AUDIO_INSTANCES = {};

if (typeof window !== "undefined") {
  for (const [key, path] of Object.entries(SOUNDS)) {
    const audio = new Audio(path);
    audio.preload = "auto";
    AUDIO_INSTANCES[key] = audio;
  }
}

/**
 * Plays a preloaded sound effect.
 * @param {string} type - The key of the sound in the SOUNDS object.
 * @param {number} volume - Master volume multiplier (0.0 to 1.0).
 */
export const playSound = (type, volume = 1.0) => {
  const instance = AUDIO_INSTANCES[type];
  if (!instance) return;
  
  // Clone to allow overlapping plays of the same sound
  const audio = instance.cloneNode(true);
  audio.volume = Math.max(0, Math.min(1, volume));
  audio.play().catch((err) => {
    // Autoplay or loading issues - silent failure is preferred for UX
    console.debug(`Audio playback failed for ${type}:`, err);
  });
};
