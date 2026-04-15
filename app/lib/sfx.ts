"use client";

interface SfxHandle {
  tick: () => void;
  subtick: () => void;
  combo: (n: number) => void;
  dayClear: () => void;
  levelUp: () => void;
  addTask: () => void;
  removeTask: () => void;
  markImportant: () => void;
  swoosh: (dir: number) => void;
  expand: () => void;
  setEnabled: (v: boolean) => void;
}

export const SFX: SfxHandle = (() => {
  let enabled = true;
  let ctx: AudioContext | null = null;
  const gc = (): AudioContext => {
    if (!ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      ctx = new AudioCtx!();
    }
    return ctx;
  };
  const beep = (freq: number, dur: number, vol = 0.12, type: OscillatorType = "sine", ramp = freq * 0.75): void => {
    if (!enabled) return;
    try {
      const c = gc(), o = c.createOscillator(), g = c.createGain();
      o.type = type; o.connect(g); g.connect(c.destination);
      o.frequency.setValueAtTime(freq, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(ramp, c.currentTime + dur);
      g.gain.setValueAtTime(vol, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      o.start(); o.stop(c.currentTime + dur);
    } catch { /* ignore audio errors */ }
  };
  const chord = (freqs: number[], spacing = 0.07, vol = 0.13): void =>
    freqs.forEach((f, i) => setTimeout(() => beep(f, 0.4, vol, "sine", f), i * spacing * 1000));
  return {
    setEnabled: (v: boolean) => { enabled = v; },
    addTask:    () => beep(440, 0.15, 0.07, "sine", 560),
    removeTask:    () => beep(320, 0.18, 0.07, "sine", 220),
    markImportant: () => beep(660, 0.1, 0.08, "sine", 880),
    swoosh: (dir: number) => beep(dir > 0 ? 180 : 320, 0.28, 0.03, "sine", dir > 0 ? 320 : 180),
    expand: () => beep(520, 0.12, 0.04, "sine", 580),
    tick:     () => beep(880, 0.12, 0.14, "sine", 660),
    subtick:  () => beep(1200, 0.08, 0.08, "sine", 1200),
    combo:    (n: number) => chord([523, 659, 784, 1047, 1319].slice(0, Math.min(n, 5)), 0.06, 0.12),
    dayClear: () => chord([523, 659, 784, 1047, 1319], 0.07, 0.15),
    levelUp:  () => chord([392, 494, 587, 784], 0.12, 0.18),
  };
})();
