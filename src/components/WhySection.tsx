import {ArrowRight} from 'lucide-react';
import {WHY_PILLARS} from '../data/cosmicData';
import {type PageRoute} from './Navbar';

interface WhySectionProps {
  onNavigate: (route: PageRoute) => void;
}

export function WhySection({onNavigate}: WhySectionProps) {
  return (
    <section className="relative z-20 mx-auto max-w-[1200px] px-5 pt-28 pb-24 sm:px-8 lg:pt-32 lg:pb-28">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Sticky Narrative & Sacred Cosmic Mandala */}
        <div className="lg:sticky lg:top-24 lg:col-span-5">
          <p className="font-mono text-xs tracking-[0.24em] text-violet-300 uppercase">
            Our Philosophy · अन्तरिक्ष दर्शन
          </p>
          <h1 className="font-display mt-3 text-[clamp(2rem,4vw,3.4rem)] leading-tight font-semibold tracking-wide text-balance text-white">
            Why Antariksha Rasa?
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-slate-300 sm:text-base">
            In Sanskrit, <span className="font-medium text-white">Antariksha</span>{' '}
            signifies the boundless expanse between worlds, while{' '}
            <span className="font-medium text-white">Rasa</span> embodies the
            pure essence of taste, warmth, and emotion. Built for astronauts,
            explorers, and dreamers, our orbital sanctuary transforms
            microgravity nourishment into ceremonial fine dining.
          </p>

          <div className="iridescent-border glass-surface mt-8 rounded-2xl p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="font-display text-sm font-semibold tracking-wider text-white">
                  ORBITAL TELEMETRY
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Calibrated hospitality parameters
                </p>
              </div>
              <svg
                aria-hidden="true"
                viewBox="0 0 64 64"
                className="animate-slow-orbit h-11 w-11 text-amber-200/80">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <polygon
                  points="32,8 56,32 32,56 8,32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <circle cx="32" cy="32" r="4" fill="currentColor" />
              </svg>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-6">
              <div>
                <p className="font-mono text-2xl font-semibold text-white tabular-nums">
                  408 <span className="text-xs font-normal text-cyan-300">km</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">Orbital Altitude</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-semibold text-white tabular-nums">
                  92 <span className="text-xs font-normal text-amber-300">min</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">Earth Orbit Period</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-semibold text-white tabular-nums">
                  16 <span className="text-xs font-normal text-violet-300">/ day</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">Orbital Sunrises</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-semibold text-white tabular-nums">
                  100 <span className="text-xs font-normal text-emerald-300">%</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">Zero-G Containment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Five Numbered Pillars */}
        <div className="lg:col-span-7">
          <div className="divide-y divide-white/10 border-y border-white/10">
            {WHY_PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="group flex flex-col justify-between gap-4 py-7 transition-colors sm:flex-row sm:items-start sm:gap-8">
                <div className="flex items-start gap-5">
                  <span className="font-mono mt-1 text-sm font-medium text-cyan-300 tabular-nums">
                    {pillar.number}.
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-semibold tracking-wide text-white transition-colors group-hover:text-cyan-200 sm:text-xl">
                      {pillar.title}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-9 text-left sm:pl-0 sm:text-right">
                  <p className="font-mono text-2xl font-semibold text-white tabular-nums">
                    {pillar.metricValue}
                  </p>
                  <p className="mt-0.5 text-xs whitespace-nowrap text-slate-400">
                    {pillar.metricUnit}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('/delivery')}
              className="prismatic-gradient inline-flex min-h-[46px] cursor-pointer items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold tracking-wider whitespace-nowrap text-slate-950 uppercase">
              <span>Delivery & Guest Reviews</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/reserve')}
              className="inline-flex min-h-[46px] cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-xs font-semibold tracking-wider whitespace-nowrap text-white uppercase hover:bg-white/10">
              <span>Begin Your Cosmic Journey</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
