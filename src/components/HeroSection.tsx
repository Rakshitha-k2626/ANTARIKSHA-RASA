import {ArrowDownRight, Compass, Utensils} from 'lucide-react';
import {useEffect, useState} from 'react';
import {HERO_IMAGE} from '../data/cosmicData';
import {ResilientImage} from './ResilientImage';

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      setScrollY(Math.min(window.scrollY, 800));
    };
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({behavior: 'smooth'});
    }
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      {/* Panoramic Orbital Background with GPU Parallax */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 will-change-transform"
        style={{
          transform: `translate3d(0, ${scrollY * 0.16}px, 0) scale(${
            1.04 + scrollY * 0.00012
          })`,
        }}>
        <ResilientImage
          src={HERO_IMAGE}
          alt="Panoramic view of Earth and colorful cosmic nebulae from inside the Antariksha Rasa orbital dining station"
          loading="eager"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Measured Contrast Scrims & Atmospheric Nebula Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#04060e]/85 via-[#04060e]/50 to-[#04060e]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,rgba(4,6,14,0.22)_0%,rgba(4,6,14,0.78)_100%)]"
      />

      {/* Subtle Ambient Floating Culinary Element Highlights (Desktop) */}
      <div
        aria-hidden="true"
        className="animate-gentle-float pointer-events-none absolute top-[24%] left-8 z-20 hidden xl:block">
        <div className="iridescent-border glass-surface w-48 rounded-2xl p-3 opacity-85">
          <div className="aspect-[4/3] overflow-hidden rounded-xl">
            <img
              src="/src/assets/images/dish_nebula_bites_1795167844544.jpg"
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-2.5 text-xs font-medium text-slate-200">
            Nebula Bites · 0.00g
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="animate-gentle-float pointer-events-none absolute right-8 bottom-[22%] z-20 hidden xl:block"
        style={{animationDelay: '1.8s'}}>
        <div className="iridescent-border glass-surface w-48 rounded-2xl p-3 opacity-85">
          <div className="aspect-[4/3] overflow-hidden rounded-xl">
            <img
              src="/src/assets/images/dish_galaxy_smoothie_1795167844798.jpg"
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-2.5 text-xs font-medium text-slate-200">
            Galaxy Smoothie · Spiral
          </p>
        </div>
      </div>

      {/* Central Cinematic Focal Content */}
      <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center px-5 py-20 text-center sm:px-8">
        {/* Animated Scanning Indicator (No pulsing dot cliché — prismatic sweep bar) */}
        <div className="mb-7 inline-flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="animate-slow-orbit h-4 w-4 text-cyan-300">
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <polygon
                points="12,5 19,12 12,19 5,12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            <span className="font-mono text-xs tracking-[0.28em] text-cyan-200/95 uppercase">
              SCANNING THE UNIVERSE...
            </span>
          </div>
          <div className="relative h-[2px] w-48 overflow-hidden rounded-full bg-white/15">
            <div className="prismatic-gradient animate-scan-sweep absolute inset-y-0 left-0 w-20 rounded-full" />
          </div>
        </div>

        {/* Display Brand Lockup */}
        <h1 className="font-display text-[clamp(2.5rem,5.5vw,4.75rem)] leading-[1.06] font-bold tracking-[0.12em] text-balance text-white drop-shadow-[0_6px_32px_rgba(0,0,0,0.65)]">
          ANTARIKSHA RASA
        </h1>

        <p
          lang="sa"
          className="font-devanagari prismatic-text mt-3 text-2xl font-medium tracking-[0.18em] sm:text-3xl">
          अन्तरिक्ष रस
        </p>

        <p className="mt-5 text-sm font-semibold tracking-[0.34em] text-amber-200/95 uppercase sm:text-base">
          THE TASTE OF THE UNIVERSE
        </p>

        <p className="mt-5 max-w-xl text-base leading-relaxed font-normal text-slate-200/95 sm:text-lg">
          “Beyond Earth. Beyond Imagination. Beyond Taste.”
        </p>

        {/* Functional Action Pair */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => scrollToSection('#experience')}
            className="prismatic-gradient inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2.5 rounded-full px-7 py-3 text-xs font-bold tracking-[0.16em] whitespace-nowrap text-slate-950 uppercase shadow-[0_0_36px_rgba(56,189,248,0.34)] transition-transform duration-150 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
            <Compass className="h-4 w-4" aria-hidden="true" />
            <span>EXPLORE THE EXPERIENCE</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('#menu')}
            className="iridescent-border glass-surface inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2.5 rounded-full px-7 py-3 text-xs font-semibold tracking-[0.16em] whitespace-nowrap text-white uppercase transition-all duration-150 hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
            <Utensils className="h-4 w-4 text-cyan-300" aria-hidden="true" />
            <span>DISCOVER OUR MENU</span>
          </button>
        </div>

        {/* Scroll Cue */}
        <button
          type="button"
          onClick={() => scrollToSection('#experience')}
          aria-label="Scroll to Orbital Experiences"
          className="mt-14 inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-slate-300/80 uppercase transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400">
          <span>Low Earth Orbit · 408 km</span>
          <ArrowDownRight className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
