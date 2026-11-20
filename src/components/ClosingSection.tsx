import {ArrowUpRight} from 'lucide-react';
import {CLOSING_EARTH_IMAGE} from '../data/cosmicData';
import {ResilientImage} from './ResilientImage';

interface ClosingSectionProps {
  onOpenVoyagePreview: () => void;
}

export function ClosingSection({onOpenVoyagePreview}: ClosingSectionProps) {
  return (
    <section
      id="reserve"
      className="relative z-20 flex min-h-[78vh] items-center justify-center overflow-hidden border-t border-white/10 py-28">
      {/* Earth Horizon Backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <ResilientImage
          src={CLOSING_EARTH_IMAGE}
          alt="Earth's glowing horizon at orbital sunrise seen from the Antariksha Rasa observation deck"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Measured Contrast Scrim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#04060e] via-[#04060e]/60 to-[#04060e]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(4,6,14,0.35)_0%,rgba(4,6,14,0.82)_100%)]"
      />

      <div className="relative z-20 mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="font-mono text-xs tracking-[0.26em] text-cyan-300 uppercase">
          Orbital Horizon · आमन्त्रण
        </p>

        <h2 className="font-display mt-4 text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.12] font-bold tracking-[0.06em] text-balance text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
          YOUR TABLE IS WAITING AMONG THE STARS.
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
          “Some journeys are measured in kilometres. Others are measured in
          unforgettable experiences.”
        </p>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onOpenVoyagePreview}
            className="prismatic-gradient inline-flex min-h-[50px] cursor-pointer items-center justify-center gap-2.5 rounded-full px-8 py-3.5 text-xs font-bold tracking-[0.18em] whitespace-nowrap text-slate-950 uppercase shadow-[0_0_40px_rgba(168,85,247,0.35)] transition-transform duration-150 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
            <span>BEGIN YOUR COSMIC JOURNEY.</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
