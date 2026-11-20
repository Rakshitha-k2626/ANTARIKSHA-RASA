import {ArrowUpRight, Check, Copy, Mail, Orbit, ShoppingBag} from 'lucide-react';
import {useState} from 'react';
import {
  CLOSING_EARTH_IMAGE,
  type DishItem,
  ORBITAL_PODS,
} from '../data/cosmicData';
import {type PageRoute} from './Navbar';
import {ResilientImage} from './ResilientImage';

interface ClosingSectionProps {
  dishes: DishItem[];
  totalOrderCount: number;
  onOpenOrderTray: () => void;
  onNavigate: (route: PageRoute) => void;
}

export function ClosingSection({
  dishes,
  totalOrderCount,
  onOpenOrderTray,
  onNavigate,
}: ClosingSectionProps) {
  const [selectedPodId, setSelectedPodId] = useState(ORBITAL_PODS[0].id);
  const [selectedDishIds, setSelectedDishIds] = useState<string[]>(() =>
    dishes.slice(0, 4).map((d) => d.id),
  );
  const [copied, setCopied] = useState(false);

  const selectedPod =
    ORBITAL_PODS.find((pod) => pod.id === selectedPodId) ?? ORBITAL_PODS[0];

  const toggleDish = (id: string) => {
    setSelectedDishIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const selectedDishNames = dishes
    .filter((d) => selectedDishIds.includes(d.id))
    .map((d) => d.name);

  const briefSummary = [
    'ANTARIKSHA RASA — Orbital Dining Flight Brief',
    `Preferred Pod: ${selectedPod.name} (${selectedPod.gravityMode})`,
    `Orbital Window: ${selectedPod.orbitalWindow}`,
    `Tasting Flight: ${
      selectedDishNames.length > 0 ? selectedDishNames.join(', ') : 'Chef Calibration'
    }`,
  ].join('\n');

  const handleCopyBrief = async () => {
    try {
      await navigator.clipboard.writeText(briefSummary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const mailtoHref = `mailto:concierge@antariksharasa.space?subject=${encodeURIComponent(
    'Orbital Dining Voyage Inquiry — Antariksha Rasa',
  )}&body=${encodeURIComponent(briefSummary)}`;

  const scrollToPlanner = () => {
    document
      .getElementById('voyage-planner')
      ?.scrollIntoView({behavior: 'smooth'});
  };

  return (
    <div>
      {/* Dramatic Earth Horizon Closing Hero */}
      <section className="relative z-20 flex min-h-[70vh] items-center justify-center overflow-hidden pt-20 pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0">
          <ResilientImage
            src={CLOSING_EARTH_IMAGE}
            alt="Earth's glowing horizon at orbital sunrise seen from the Antariksha Rasa observation deck"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#04060e]/80 via-[#04060e]/55 to-[#04060e]"
        />

        <div className="relative z-20 mx-auto max-w-3xl px-5 text-center sm:px-8">
          <p className="font-mono text-xs tracking-[0.26em] text-cyan-300 uppercase">
            Orbital Horizon · आमन्त्रण
          </p>

          <h1 className="font-display mt-4 text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.12] font-bold tracking-[0.06em] text-balance text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
            YOUR TABLE IS WAITING AMONG THE STARS.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
            “Some journeys are measured in kilometres. Others are measured in
            unforgettable experiences.”
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={scrollToPlanner}
              className="prismatic-gradient inline-flex min-h-[50px] cursor-pointer items-center justify-center gap-2.5 rounded-full px-8 py-3.5 text-xs font-bold tracking-[0.18em] whitespace-nowrap text-slate-950 uppercase shadow-[0_0_40px_rgba(168,85,247,0.35)] transition-transform duration-150 hover:scale-[1.03]">
              <span>BEGIN YOUR COSMIC JOURNEY.</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>

            {totalOrderCount > 0 && (
              <button
                type="button"
                onClick={onOpenOrderTray}
                className="iridescent-border glass-surface inline-flex min-h-[50px] cursor-pointer items-center gap-2 rounded-full px-6 py-3.5 text-xs font-semibold tracking-wider whitespace-nowrap text-white uppercase">
                <ShoppingBag className="h-4 w-4 text-cyan-300" />
                <span>Send Order Tray ({totalOrderCount})</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Inline Voyage & Seating Manifest Preview */}
      <section
        id="voyage-planner"
        className="relative z-20 mx-auto max-w-[960px] px-5 py-16 sm:px-8">
        <div className="iridescent-border glass-surface rounded-2xl p-6 sm:p-8">
          <div className="border-b border-white/10 pb-5">
            <div className="flex items-center gap-2 text-xs text-cyan-300">
              <Orbit className="h-4 w-4" aria-hidden="true" />
              <span className="font-mono tracking-wider uppercase">
                Voyage & Tasting Preview · Launch Manifest
              </span>
            </div>
            <h2 className="font-display mt-2 text-2xl font-semibold tracking-wide text-white">
              Plan Your Orbital Experience
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              Configure your preferred orbital dining deck and signature tasting
              flight brief below. Live seat allocations are coordinated via
              partner orbital flight manifests—no fake reservations or payments
              are processed here.
            </p>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
              1. Select Orbital Dining Deck
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {ORBITAL_PODS.map((pod) => {
                const active = pod.id === selectedPodId;
                return (
                  <button
                    key={pod.id}
                    type="button"
                    onClick={() => setSelectedPodId(pod.id)}
                    className={`cursor-pointer rounded-xl p-4 text-left transition-all duration-150 ${
                      active
                        ? 'iridescent-border bg-white/10'
                        : 'border border-white/10 bg-white/[0.02] hover:border-white/25'
                    }`}>
                    <p className="font-devanagari text-xs text-amber-200/90">
                      {pod.sanskritName}
                    </p>
                    <p className="font-display mt-1 text-sm font-semibold text-white">
                      {pod.name}
                    </p>
                    <p className="font-mono mt-2 text-[11px] text-cyan-300">
                      {pod.gravityMode}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {pod.capacity}
                    </p>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-slate-300">
              {selectedPod.description}{' '}
              <span className="font-mono text-cyan-300">
                ({selectedPod.orbitalWindow})
              </span>
            </p>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
                2. Signature Tasting Flight Highlights
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/menu')}
                className="cursor-pointer text-xs font-medium text-cyan-300 hover:underline">
                Order from all {dishes.length} dishes →
              </button>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {dishes.slice(0, 8).map((dish) => {
                const checked = selectedDishIds.includes(dish.id);
                return (
                  <button
                    key={dish.id}
                    type="button"
                    onClick={() => toggleDish(dish.id)}
                    aria-pressed={checked}
                    className={`flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left transition-colors ${
                      checked
                        ? 'border border-cyan-400/50 bg-cyan-400/10 text-white'
                        : 'border border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/25'
                    }`}>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {dish.name}
                      </p>
                      <p className="text-xs text-slate-400">{dish.category}</p>
                    </div>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                        checked
                          ? 'border-cyan-300 bg-cyan-300 text-slate-950'
                          : 'border-white/25'
                      }`}>
                      {checked && (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-stretch justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleCopyBrief}
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-semibold tracking-wider whitespace-nowrap text-white uppercase transition-colors hover:bg-white/10">
              {copied ? (
                <>
                  <Check
                    className="h-4 w-4 text-emerald-300"
                    aria-hidden="true"
                  />
                  <span>Voyage Brief Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                  <span>Copy Voyage Brief</span>
                </>
              )}
            </button>

            <a
              href={mailtoHref}
              className="prismatic-gradient inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold tracking-wider whitespace-nowrap text-slate-950 uppercase transition-transform duration-150 hover:scale-[1.02]">
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>Draft Concierge Email</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
