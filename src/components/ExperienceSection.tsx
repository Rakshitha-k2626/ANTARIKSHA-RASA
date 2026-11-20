import {ArrowRight, Check, ChevronRight, Globe2} from 'lucide-react';
import {useState} from 'react';
import {EXPERIENCES, type ExperienceItem} from '../data/cosmicData';
import {type PageRoute} from './Navbar';
import {ResilientImage} from './ResilientImage';

interface ExperienceSectionProps {
  onNavigate: (route: PageRoute) => void;
}

export function ExperienceSection({onNavigate}: ExperienceSectionProps) {
  const [activeExp, setActiveExp] = useState<ExperienceItem>(EXPERIENCES[0]);

  return (
    <section className="relative z-20 mx-auto max-w-[1200px] px-5 pt-28 pb-24 sm:px-8 lg:pt-32 lg:pb-28">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-10 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-[0.24em] text-cyan-300 uppercase">
            Orbital Architecture · अनुभव
          </p>
          <h1 className="font-display mt-3 text-[clamp(2rem,4vw,3.4rem)] leading-tight font-semibold tracking-wide text-balance text-white">
            The Experience Above the Horizon
          </h1>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
          Three engineered environments blending classical Indian spatial
          harmony with orbital aerospace craft. Select any deck to inspect its
          dining environment.
        </p>
      </div>

      {/* Three Interactive Experience Cards */}
      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {EXPERIENCES.map((exp) => {
          const isSelected = activeExp.id === exp.id;
          return (
            <button
              key={exp.id}
              type="button"
              onClick={() => setActiveExp(exp)}
              aria-pressed={isSelected}
              className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
                isSelected
                  ? 'iridescent-border bg-[#0c1328]/90 shadow-[0_18px_50px_rgba(34,211,238,0.14)]'
                  : 'border border-white/10 bg-[#080d1d]/80 hover:-translate-y-1 hover:border-white/25'
              }`}>
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <ResilientImage
                  src={exp.image}
                  alt={exp.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#080d1d] via-[#080d1d]/25 to-transparent"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono text-cyan-300">{exp.index}</span>
                    <span aria-hidden="true">·</span>
                    <span>{exp.sanskritSubtitle}</span>
                  </div>

                  <h2 className="font-display mt-3 text-xl font-semibold tracking-wider text-white">
                    {exp.title}
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {exp.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-medium">
                  <span
                    className={
                      isSelected
                        ? 'text-cyan-300'
                        : 'text-slate-300 group-hover:text-white'
                    }>
                    {isSelected ? 'Viewing Deck Specs' : 'Inspect Environment'}
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-150 ${
                      isSelected
                        ? 'translate-x-0.5 text-cyan-300'
                        : 'text-slate-400 group-hover:translate-x-1 group-hover:text-white'
                    }`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Deck Specification Panel */}
      <div className="iridescent-border glass-surface mt-8 rounded-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2.5 text-xs font-medium text-cyan-300">
              <Globe2 className="h-4 w-4" aria-hidden="true" />
              <span className="font-mono tracking-wider uppercase">
                Deck Dossier · {activeExp.sanskritSubtitle}
              </span>
            </div>
            <h2 className="font-display mt-2 text-2xl font-semibold tracking-wide text-white">
              {activeExp.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {activeExp.extendedDetail}
            </p>

            <ul className="mt-5 space-y-2.5">
              {activeExp.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-slate-200">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-white/10 pt-6 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <div>
              <p className="text-xs tracking-wider text-slate-400 uppercase">
                Orbital Altitude
              </p>
              <p className="font-mono mt-1 text-lg font-medium text-white tabular-nums">
                {activeExp.altitude}
              </p>
            </div>
            <div>
              <p className="text-xs tracking-wider text-slate-400 uppercase">
                Gravity Profile
              </p>
              <p className="font-mono mt-1 text-lg font-medium text-cyan-300 tabular-nums">
                {activeExp.gravityProfile}
              </p>
            </div>
            <div>
              <p className="text-xs tracking-wider text-slate-400 uppercase">
                Viewport Field
              </p>
              <p className="font-mono mt-1 text-lg font-medium text-amber-200 tabular-nums">
                {activeExp.panoramicArc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Page Navigation */}
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
        <button
          type="button"
          onClick={() => onNavigate('/menu')}
          className="prismatic-gradient inline-flex min-h-[46px] cursor-pointer items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold tracking-wider whitespace-nowrap text-slate-950 uppercase">
          <span>Explore Cosmic Menu (84 Dishes)</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('/reserve')}
          className="inline-flex min-h-[46px] cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-xs font-semibold tracking-wider whitespace-nowrap text-white uppercase hover:bg-white/10">
          <span>Reserve Orbital Table</span>
        </button>
      </div>
    </section>
  );
}
