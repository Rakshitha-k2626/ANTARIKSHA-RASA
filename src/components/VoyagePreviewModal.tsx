import {Check, Copy, Mail, Orbit, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {type DishItem, ORBITAL_PODS} from '../data/cosmicData';

interface VoyagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishes: DishItem[];
}

export function VoyagePreviewModal({
  isOpen,
  onClose,
  dishes,
}: VoyagePreviewModalProps) {
  const [selectedPodId, setSelectedPodId] = useState(ORBITAL_PODS[0].id);
  const [selectedDishIds, setSelectedDishIds] = useState<string[]>(() =>
    dishes.length >= 3 ? [dishes[0].id, dishes[2].id] : dishes.map((d) => d.id),
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voyage-preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#04060e]/85 p-4 backdrop-blur-md">
      <div className="iridescent-border glass-surface relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-300">
              <Orbit className="h-4 w-4" aria-hidden="true" />
              <span className="font-mono tracking-wider uppercase">
                Voyage & Tasting Preview · Launch Manifest
              </span>
            </div>
            <h2
              id="voyage-preview-title"
              className="font-display mt-2 text-2xl font-semibold tracking-wide text-white">
              Plan Your Orbital Experience
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close voyage preview"
            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Transparent Notice: No fake booking */}
        <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-slate-300">
          This interactive preview lets you configure your preferred orbital
          dining pod and tasting flight. Live seat allocations are coordinated
          exclusively through partner orbital flight manifests—no payment or
          reservation is processed on this site.
        </p>

        {/* Pod Selection */}
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
                  className={`cursor-pointer rounded-xl p-4 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
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

        {/* Dish Tasting Selection */}
        <div className="mt-6">
          <p className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
            2. Curate Your Tasting Flight
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {dishes.map((dish) => {
              const checked = selectedDishIds.includes(dish.id);
              return (
                <button
                  key={dish.id}
                  type="button"
                  onClick={() => toggleDish(dish.id)}
                  aria-pressed={checked}
                  className={`flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
                    checked
                      ? 'border border-cyan-400/50 bg-cyan-400/10 text-white'
                      : 'border border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/25'
                  }`}>
                  <div>
                    <p className="text-sm font-medium text-white">{dish.name}</p>
                    <p className="text-xs text-slate-400">{dish.category}</p>
                  </div>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                      checked
                        ? 'border-cyan-300 bg-cyan-300 text-slate-950'
                        : 'border-white/25'
                    }`}>
                    {checked && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Row: Copy Brief or Draft Email */}
        <div className="mt-8 flex flex-col items-stretch justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleCopyBrief}
            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-semibold tracking-wider whitespace-nowrap text-white uppercase transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-300" aria-hidden="true" />
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
            className="prismatic-gradient inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold tracking-wider whitespace-nowrap text-slate-950 uppercase transition-transform duration-150 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span>Draft Concierge Email</span>
          </a>
        </div>
      </div>
    </div>
  );
}
