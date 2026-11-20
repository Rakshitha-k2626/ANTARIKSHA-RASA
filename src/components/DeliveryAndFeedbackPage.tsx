import {
  Check,
  MessageSquarePlus,
  Package,
  Rocket,
  Search,
  Star,
  Truck,
} from 'lucide-react';
import {type FormEvent, useEffect, useState} from 'react';
import {
  type CustomerFeedback,
  DELIVERY_TIERS,
  ORBITAL_PODS,
  type SubmittedOrder,
} from '../data/cosmicData';
import {type PageRoute} from './Navbar';

interface DeliveryAndFeedbackPageProps {
  onNavigate: (route: PageRoute) => void;
  onStartDeliveryOrder: (tierName: string) => void;
}

export function DeliveryAndFeedbackPage({
  onNavigate,
  onStartDeliveryOrder,
}: DeliveryAndFeedbackPageProps) {
  const [selectedTierId, setSelectedTierId] = useState(DELIVERY_TIERS[0].id);
  const [recentOrders, setRecentOrders] = useState<SubmittedOrder[]>([]);
  const [trackingQuery, setTrackingQuery] = useState('');
  const [feedbackList, setFeedbackList] = useState<CustomerFeedback[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  // Feedback form state
  const [authorName, setAuthorName] = useState('');
  const [roleOrMission, setRoleOrMission] = useState('');
  const [experienceType, setExperienceType] = useState(ORBITAL_PODS[0].name);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersRes, fbRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/feedback'),
        ]);
        if (ordersRes.ok) {
          const ordersData = (await ordersRes.json()) as {
            orders?: SubmittedOrder[];
          };
          if (Array.isArray(ordersData.orders)) {
            setRecentOrders(ordersData.orders);
          }
        }
        if (fbRes.ok) {
          const fbData = (await fbRes.json()) as {
            feedback?: CustomerFeedback[];
          };
          if (Array.isArray(fbData.feedback)) {
            setFeedbackList(fbData.feedback);
          }
        }
      } catch {
        // Ignore transient load failures cleanly
      } finally {
        setLoadingFeedback(false);
      }
    };
    loadData();
  }, []);

  const selectedTier =
    DELIVERY_TIERS.find((t) => t.id === selectedTierId) ?? DELIVERY_TIERS[0];

  const matchedOrder = trackingQuery.trim()
    ? recentOrders.find(
        (o) =>
          o.orderId.toLowerCase() === trackingQuery.trim().toLowerCase() ||
          o.guestName.toLowerCase().includes(trackingQuery.trim().toLowerCase()),
      )
    : recentOrders[0];

  const handleSubmitFeedback = async (e: FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);
    setFeedbackSuccess(false);

    if (!authorName.trim() || authorName.trim().length < 2) {
      setFeedbackError('Please enter your full name.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 8) {
      setFeedbackError('Please share at least a brief sentence of feedback.');
      return;
    }

    setSubmittingFeedback(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          authorName: authorName.trim(),
          roleOrMission: roleOrMission.trim() || 'Orbital Guest',
          experienceType,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = (await response.json()) as {
        feedback?: CustomerFeedback;
        error?: string;
      };

      if (!response.ok || !data.feedback) {
        setFeedbackError(data.error || 'Unable to post feedback right now.');
        return;
      }

      setFeedbackList((prev) => [data.feedback!, ...prev]);
      setAuthorName('');
      setRoleOrMission('');
      setComment('');
      setRating(5);
      setFeedbackSuccess(true);
      window.setTimeout(() => setFeedbackSuccess(false), 4000);
    } catch {
      setFeedbackError('Network error while submitting feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="relative z-20 mx-auto max-w-[1200px] px-5 pt-28 pb-24 sm:px-8 lg:pt-32 lg:pb-28">
      {/* SECTION 1: DELIVERY SERVICE */}
      <section aria-labelledby="delivery-service-heading">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-10 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-[0.24em] text-cyan-300 uppercase">
              Orbital & Terrestrial Dispatch · वितरण सेवा
            </p>
            <h1
              id="delivery-service-heading"
              className="font-display mt-3 text-[clamp(2rem,4vw,3.4rem)] leading-tight font-semibold tracking-wide text-balance text-white">
              Galley Delivery Service
            </h1>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
            From co-orbiting station airlocks to Earth cryo-capsule ports, our
            phase-change vessels preserve temperature and spice aromatics across
            every trajectory.
          </p>
        </div>

        {/* Delivery Tiers */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {DELIVERY_TIERS.map((tier) => {
            const active = tier.id === selectedTierId;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedTierId(tier.id)}
                aria-pressed={active}
                className={`flex cursor-pointer flex-col justify-between rounded-2xl p-6 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
                  active
                    ? 'iridescent-border bg-[#0c1328]/95 shadow-[0_14px_40px_rgba(34,211,238,0.14)]'
                    : 'border border-white/10 bg-[#080d1d]/80 hover:border-white/25'
                }`}>
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-devanagari text-amber-200/90">
                      {tier.sanskritName}
                    </span>
                    <span className="font-mono text-cyan-300 tabular-nums">
                      {tier.window}
                    </span>
                  </div>

                  <h2 className="font-display mt-3 text-xl font-semibold text-white">
                    {tier.name}
                  </h2>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                    {tier.description}
                  </p>
                </div>

                <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-xs">
                  <p className="text-slate-400">
                    Coverage: <span className="text-slate-200">{tier.range}</span>
                  </p>
                  <p className="text-slate-400">
                    Capsule:{' '}
                    <span className="text-cyan-200">{tier.packaging}</span>
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Delivery Action + Order Tracker */}
        <div className="iridescent-border glass-surface mt-8 grid grid-cols-1 gap-8 rounded-2xl p-6 sm:p-8 lg:grid-cols-12">
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-cyan-300">
                <Truck className="h-4 w-4" aria-hidden="true" />
                <span className="font-mono tracking-wider uppercase">
                  Selected Channel · {selectedTier.window}
                </span>
              </div>
              <h3 className="font-display mt-2 text-2xl font-semibold text-white">
                {selectedTier.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {selectedTier.packaging} · {selectedTier.range}. Select dishes
                from the Cosmic Menu and dispatch directly to your docking module
                or terrestrial hub.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onStartDeliveryOrder(selectedTier.name)}
                className="prismatic-gradient inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold tracking-wider whitespace-nowrap text-slate-950 uppercase">
                <Rocket className="h-4 w-4" aria-hidden="true" />
                <span>Order for Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/menu')}
                className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-semibold tracking-wider whitespace-nowrap text-white uppercase hover:bg-white/10">
                <span>Browse 84 Menu Dishes</span>
              </button>
            </div>
          </div>

          {/* Live Galley Dispatch Tracker */}
          <div className="border-t border-white/10 pt-6 lg:col-span-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-200">
              <Package className="h-4 w-4" aria-hidden="true" />
              <span className="font-mono tracking-wider uppercase">
                Track Galley Dispatch
              </span>
            </div>

            <div className="relative mt-3">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="text"
                value={trackingQuery}
                onChange={(e) => setTrackingQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. AR-...) or Guest Name"
                aria-label="Track order by ID or guest name"
                className="w-full rounded-xl border border-white/15 bg-[#060a17] py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {matchedOrder ? (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-cyan-300 tabular-nums">
                    {matchedOrder.orderId}
                  </span>
                  <span className="text-xs font-medium text-emerald-300">
                    {matchedOrder.status}
                  </span>
                </div>
                <p className="mt-1.5 text-sm font-medium text-white">
                  {matchedOrder.guestName} ·{' '}
                  <span className="text-slate-300">
                    {matchedOrder.serviceMode === 'Delivery Service'
                      ? `${matchedOrder.deliveryTier} → ${matchedOrder.deliveryDestination}`
                      : matchedOrder.diningPod}
                  </span>
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  {matchedOrder.items
                    .map((i) => `${i.quantity}x ${i.dishName}`)
                    .join(', ')}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-xs text-slate-400">
                No dispatched orders found yet. Place an order from the Cosmic
                Menu to track its capsule status here.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: CUSTOMER FEEDBACK */}
      <section
        aria-labelledby="customer-feedback-heading"
        className="mt-24 border-t border-white/10 pt-20">
        <div className="flex flex-col justify-between gap-6 pb-10 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-[0.24em] text-violet-300 uppercase">
              Explorer Voices · अतिथि अनुभव
            </p>
            <h2
              id="customer-feedback-heading"
              className="font-display mt-3 text-[clamp(1.85rem,3.5vw,3rem)] leading-tight font-semibold tracking-wide text-balance text-white">
              Customer Feedback
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
            Verified impressions from astronauts, orbital researchers, and
            delivery guests. Share your own dining or capsule delivery review.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* Reviews Feed */}
          <div className="space-y-4 lg:col-span-7">
            {loadingFeedback ? (
              <p className="py-8 text-sm text-slate-400">
                Loading explorer feedback...
              </p>
            ) : (
              feedbackList.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-2xl border border-white/10 bg-[#080d1d]/85 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-base font-semibold text-white">
                        {entry.authorName}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {entry.roleOrMission} ·{' '}
                        <span className="text-cyan-300">
                          {entry.experienceType}
                        </span>
                      </p>
                    </div>

                    <div
                      aria-label={`Rated ${entry.rating} out of 5 stars`}
                      className="flex items-center gap-1 text-amber-300">
                      {Array.from({length: 5}).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < entry.rating
                              ? 'fill-amber-300 text-amber-300'
                              : 'text-slate-600'
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-slate-200">
                    “{entry.comment}”
                  </p>
                </article>
              ))
            )}
          </div>

          {/* Submit Feedback Form */}
          <form
            onSubmit={handleSubmitFeedback}
            className="iridescent-border glass-surface rounded-2xl p-6 sm:p-7 lg:sticky lg:top-24 lg:col-span-5">
            <div className="flex items-center gap-2 text-xs font-medium text-cyan-300">
              <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
              <span className="font-mono tracking-wider uppercase">
                Share Your Feedback
              </span>
            </div>
            <h3 className="font-display mt-2 text-xl font-semibold text-white">
              Leave a Review
            </h3>

            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="fb-author"
                  className="block text-xs font-medium text-slate-300">
                  Your Name *
                </label>
                <input
                  id="fb-author"
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Rohan Kulkarni"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#060a17] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="fb-role"
                  className="block text-xs font-medium text-slate-300">
                  Mission, Role, or City
                </label>
                <input
                  id="fb-role"
                  type="text"
                  value={roleOrMission}
                  onChange={(e) => setRoleOrMission(e.target.value)}
                  placeholder="e.g. Orbital Guest · Bengaluru"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#060a17] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="fb-experience"
                  className="block text-xs font-medium text-slate-300">
                  Deck or Delivery Service
                </label>
                <select
                  id="fb-experience"
                  value={experienceType}
                  onChange={(e) => setExperienceType(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#060a17] px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none">
                  {ORBITAL_PODS.map((pod) => (
                    <option key={pod.id} value={pod.name}>
                      {pod.name}
                    </option>
                  ))}
                  {DELIVERY_TIERS.map((tier) => (
                    <option key={tier.id} value={tier.name}>
                      {tier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-xs font-medium text-slate-300">
                  Rating
                </span>
                <div className="mt-1.5 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-label={`Rate ${value} stars`}
                      onClick={() => setRating(value)}
                      className="cursor-pointer rounded-lg p-1.5 transition-transform hover:scale-110">
                      <Star
                        className={`h-5 w-5 ${
                          value <= rating
                            ? 'fill-amber-300 text-amber-300'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-mono ml-2 text-xs text-slate-300 tabular-nums">
                    {rating} / 5
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="fb-comment"
                  className="block text-xs font-medium text-slate-300">
                  Your Review *
                </label>
                <textarea
                  id="fb-comment"
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How were the dishes, zero-gravity service, or capsule delivery?"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#060a17] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {feedbackError && (
                <p
                  role="alert"
                  className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-200">
                  {feedbackError}
                </p>
              )}

              {feedbackSuccess && (
                <p
                  role="status"
                  className="flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-200">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>Thank you! Your feedback has been published.</span>
                </p>
              )}

              <button
                type="submit"
                disabled={submittingFeedback}
                className="prismatic-gradient flex min-h-[44px] w-full cursor-pointer items-center justify-center rounded-full px-6 py-2.5 text-xs font-bold tracking-wider whitespace-nowrap text-slate-950 uppercase disabled:opacity-60">
                {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
