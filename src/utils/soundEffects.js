let audioContext = null;
let activeNodes = [];
let sleepModeEnabled = false;

function getAudioContext() {
  if (audioContext) return audioContext;
  if (typeof window === "undefined") return null;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  try {
    audioContext = new AudioContextClass();
    return audioContext;
  } catch {
    return null;
  }
}

function currentVolume(volume) {
  return sleepModeEnabled ? volume * 0.45 : volume;
}

function playTone({
  frequency,
  duration = 0.18,
  delay = 0,
  type = "sine",
  volume = 0.025,
}) {
  const context = getAudioContext();
  if (!context) return;

  try {
    const startTime = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(currentVolume(volume), startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.03);

    activeNodes.push(oscillator, gain);
    oscillator.addEventListener("ended", () => {
      activeNodes = activeNodes.filter((node) => node !== oscillator && node !== gain);
    });
  } catch {
  }
}

export function initializeSoundEffects(options = {}) {
  sleepModeEnabled = Boolean(options.sleepMode);
  const context = getAudioContext();
  if (!context) return;

  try {
    if (context.state === "suspended") {
      context.resume();
    }
  } catch {
  }
}

export function playPageTurnSound(options = {}) {
  sleepModeEnabled = Boolean(options.sleepMode);
  playTone({ frequency: 280, duration: 0.12, type: "triangle", volume: 0.018 });
  playTone({
    frequency: 460,
    duration: 0.16,
    delay: 0.05,
    type: "sine",
    volume: 0.012,
  });
}

export function playMagicSparkleSound(options = {}) {
  sleepModeEnabled = Boolean(options.sleepMode);
  [720, 960, 1220].forEach((frequency, index) => {
    playTone({
      frequency,
      duration: 0.16,
      delay: index * 0.07,
      type: "sine",
      volume: 0.014,
    });
  });
}

export function playFinalSceneSound(options = {}) {
  sleepModeEnabled = Boolean(options.sleepMode);
  [440, 590, 740, 880].forEach((frequency, index) => {
    playTone({
      frequency,
      duration: 0.24,
      delay: index * 0.1,
      type: "triangle",
      volume: 0.016,
    });
  });
}

export function stopAllSoundEffects() {
  activeNodes.forEach((node) => {
    try {
      if (typeof node.stop === "function") node.stop();
      if (typeof node.disconnect === "function") node.disconnect();
    } catch {
    }
  });
  activeNodes = [];
}
