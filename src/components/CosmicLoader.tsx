import {useEffect, useState} from 'react';

export function CosmicLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      setVisible(false);
      return;
    }

    const fadeTimer = window.setTimeout(() => setFading(true), 950);
    const hideTimer = window.setTimeout(() => setVisible(false), 1450);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-label="Loading Antariksha Rasa"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#04060e] transition-opacity duration-500 ${
        fading ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}>
      <div className="relative flex h-28 w-28 items-center justify-center">
        <svg
          viewBox="0 0 120 120"
          aria-hidden="true"
          className="animate-slow-orbit h-28 w-28">
          <defs>
            <linearGradient id="loader-prism" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4d8d" />
              <stop offset="25%" stopColor="#facc15" />
              <stop offset="55%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="url(#loader-prism)"
            strokeWidth="1.2"
            strokeDasharray="10 6"
          />
          <polygon
            points="60,14 106,60 60,106 14,60"
            fill="none"
            stroke="url(#loader-prism)"
            strokeWidth="1"
            opacity="0.7"
          />
          <circle
            cx="60"
            cy="60"
            r="30"
            fill="none"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="1"
          />
        </svg>
        <span className="font-devanagari absolute text-lg font-medium tracking-wider text-white">
          रस
        </span>
      </div>

      <p className="font-display mt-6 text-sm tracking-[0.28em] text-slate-200 uppercase">
        ANTARIKSHA RASA
      </p>
      <p className="font-mono mt-2 text-xs tracking-[0.2em] text-cyan-300/80">
        ORBITAL APPROACH
      </p>

      <button
        type="button"
        onClick={() => {
          setFading(true);
          window.setTimeout(() => setVisible(false), 200);
        }}
        className="mt-8 rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">
        Enter Orbit
      </button>
    </div>
  );
}
