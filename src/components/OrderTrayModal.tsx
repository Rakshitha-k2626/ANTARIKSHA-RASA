import {
  Check,
  Copy,
  History,
  Mail,
  Minus,
  Plus,
  Send,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import {type FormEvent, useEffect, useState} from 'react';
import {
  type DishItem,
  ORBITAL_PODS,
  type SubmittedOrder,
} from '../data/cosmicData';
import {ResilientImage} from './ResilientImage';

interface OrderTrayModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishes: DishItem[];
  orderCounts: Record<string, number>;
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onClearOrder: () => void;
}

export function OrderTrayModal({
  isOpen,
  onClose,
  dishes,
  orderCounts,
  onUpdateQuantity,
  onClearOrder,
}: OrderTrayModalProps) {
  const [activeTab, setActiveTab] = useState<'tray' | 'history'>('tray');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [diningPod, setDiningPod] = useState(ORBITAL_PODS[0].name);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<SubmittedOrder | null>(
    null,
  );
  const [sentOrders, setSentOrders] = useState<SubmittedOrder[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchOrders = async () => {
      setLoadingHistory(true);
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = (await res.json()) as {orders?: SubmittedOrder[]};
          if (Array.isArray(data.orders)) {
            setSentOrders(data.orders);
          }
        }
      } catch {
        // Ignore transient history fetch errors
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchOrders();
  }, [isOpen]);

  if (!isOpen) return null;

  const trayItems = dishes
    .map((dish) => ({
      dish,
      quantity: orderCounts[dish.id] || 0,
    }))
    .filter((entry) => entry.quantity > 0);

  const totalDishes = trayItems.reduce((sum, entry) => sum + entry.quantity, 0);

  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (trayItems.length === 0) {
      setErrorMessage('Please add at least one dish from the Cosmic Menu.');
      return;
    }

    if (!guestName.trim()) {
      setErrorMessage('Please enter your name for the galley order.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          diningPod,
          notes: notes.trim(),
          items: trayItems.map(({dish, quantity}) => ({
            dishId: dish.id,
            dishName: dish.name,
            category: dish.category,
            quantity,
          })),
        }),
      });

      const data = (await response.json()) as {
        order?: SubmittedOrder;
        error?: string;
      };

      if (!response.ok || !data.order) {
        setErrorMessage(data.error || 'Unable to send order right now.');
        return;
      }

      setConfirmedOrder(data.order);
      setSentOrders((prev) => [data.order!, ...prev]);
      onClearOrder();
      setNotes('');
    } catch {
      setErrorMessage('Network error while contacting the orbital galley.');
    } finally {
      setSubmitting(false);
    }
  };

  const buildOrderSummaryText = (order: SubmittedOrder | null) => {
    if (order) {
      return [
        `ANTARIKSHA RASA — Order ${order.orderId}`,
        `Guest: ${order.guestName} (${order.guestEmail})`,
        `Dining Deck: ${order.diningPod}`,
        `Items: ${order.items
          .map((item) => `${item.quantity}x ${item.dishName}`)
          .join(', ')}`,
        order.notes ? `Notes: ${order.notes}` : '',
      ]
        .filter(Boolean)
        .join('\n');
    }

    return [
      'ANTARIKSHA RASA — Menu Order Request',
      guestName.trim() ? `Guest: ${guestName.trim()}` : '',
      `Dining Deck: ${diningPod}`,
      `Selected Dishes: ${
        trayItems.length > 0
          ? trayItems.map((t) => `${t.quantity}x ${t.dish.name}`).join(', ')
          : 'None'
      }`,
      notes.trim() ? `Dietary / Notes: ${notes.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleCopySummary = async (order: SubmittedOrder | null) => {
    try {
      await navigator.clipboard.writeText(buildOrderSummaryText(order));
      setCopiedReceipt(true);
      window.setTimeout(() => setCopiedReceipt(false), 2200);
    } catch {
      setCopiedReceipt(false);
    }
  };

  const activeSummaryText = buildOrderSummaryText(confirmedOrder);
  const mailtoHref = `mailto:concierge@antariksharasa.space?subject=${encodeURIComponent(
    confirmedOrder
      ? `Antariksha Rasa Order ${confirmedOrder.orderId}`
      : 'Antariksha Rasa — Cosmic Menu Order',
  )}&body=${encodeURIComponent(activeSummaryText)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-tray-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#04060e]/85 p-4 backdrop-blur-md">
      <div className="iridescent-border glass-surface relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-300">
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span className="font-mono tracking-wider uppercase">
                Orbital Galley Dispatch · भोजन आदेश
              </span>
            </div>
            <h2
              id="order-tray-title"
              className="font-display mt-2 text-2xl font-semibold tracking-wide text-white">
              Your Cosmic Order
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close order tray"
            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1">
          <button
            type="button"
            onClick={() => setActiveTab('tray')}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'tray'
                ? 'prismatic-gradient text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}>
            <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Order Tray ({totalDishes})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'history'
                ? 'prismatic-gradient text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}>
            <History className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Sent Orders ({sentOrders.length})</span>
          </button>
        </div>

        {activeTab === 'tray' ? (
          <div className="mt-6">
            {/* Confirmed Order State */}
            {confirmedOrder && (
              <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
                    <Check className="h-4 w-4" aria-hidden="true" />
                    <span>Order Sent to Orbital Galley</span>
                  </div>
                  <span className="font-mono text-xs text-emerald-200 tabular-nums">
                    {confirmedOrder.orderId}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-200">
                  Prepared for{' '}
                  <span className="font-semibold text-white">
                    {confirmedOrder.guestName}
                  </span>{' '}
                  at{' '}
                  <span className="text-cyan-200">
                    {confirmedOrder.diningPod}
                  </span>
                  :{' '}
                  {confirmedOrder.items
                    .map((item) => `${item.quantity}x ${item.dishName}`)
                    .join(', ')}
                  .
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleCopySummary(confirmedOrder)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/15">
                    {copiedReceipt ? (
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-cyan-300" />
                    )}
                    <span>
                      {copiedReceipt ? 'Receipt Copied' : 'Copy Order Receipt'}
                    </span>
                  </button>
                  <a
                    href={mailtoHref}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/15">
                    <Mail className="h-3.5 w-3.5 text-amber-300" />
                    <span>Email Copy</span>
                  </a>
                </div>
              </div>
            )}

            {/* Selected Food Items */}
            {trayItems.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
                <p className="text-sm text-slate-300">
                  Your order tray is currently empty.
                </p>
                <p className="mt-1.5 text-xs text-slate-400">
                  Click <span className="text-cyan-300">Add to Order</span> on any
                  dish in the Cosmic Menu to build your meal.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="prismatic-gradient mt-5 inline-flex cursor-pointer items-center rounded-full px-5 py-2 text-xs font-bold tracking-wider text-slate-950 uppercase">
                  Browse Cosmic Menu
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.02]">
                  {trayItems.map(({dish, quantity}) => (
                    <div
                      key={dish.id}
                      className="flex flex-wrap items-center justify-between gap-4 p-3.5 sm:flex-nowrap">
                      <div className="flex items-center gap-3.5">
                        <div className="h-14 w-16 shrink-0 overflow-hidden rounded-lg">
                          <ResilientImage
                            src={dish.image}
                            alt={dish.imageAlt}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-display text-sm font-semibold text-white">
                            {dish.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {dish.sanskritName} · {dish.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Decrease ${dish.name} quantity`}
                          onClick={() => onUpdateQuantity(dish.id, -1)}
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-mono w-7 text-center text-sm font-medium text-white tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase ${dish.name} quantity`}
                          onClick={() => onUpdateQuantity(dish.id, 1)}
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove ${dish.name} from order`}
                          onClick={() => onUpdateQuantity(dish.id, -quantity)}
                          className="ml-1 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:border-rose-400/40 hover:text-rose-300">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Guest & Dining Pod Details */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="order-guest-name"
                      className="block text-xs font-medium text-slate-300">
                      Guest Name *
                    </label>
                    <input
                      id="order-guest-name"
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#060a17] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="order-guest-email"
                      className="block text-xs font-medium text-slate-300">
                      Email Address *
                    </label>
                    <input
                      id="order-guest-email"
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="explorer@example.com"
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#060a17] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="order-dining-pod"
                    className="block text-xs font-medium text-slate-300">
                    Orbital Dining Deck
                  </label>
                  <select
                    id="order-dining-pod"
                    value={diningPod}
                    onChange={(e) => setDiningPod(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#060a17] px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none">
                    {ORBITAL_PODS.map((pod) => (
                      <option key={pod.id} value={pod.name}>
                        {pod.name} ({pod.gravityMode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="order-notes"
                    className="block text-xs font-medium text-slate-300">
                    Dietary or Spice Preferences (Optional)
                  </label>
                  <textarea
                    id="order-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Allergies, spice level, or orbital sunrise timing request..."
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#060a17] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {errorMessage && (
                  <p
                    role="alert"
                    className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-200">
                    {errorMessage}
                  </p>
                )}

                <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopySummary(null)}
                      className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/10">
                      {copiedReceipt ? (
                        <Check className="h-3.5 w-3.5 text-emerald-300" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-cyan-300" />
                      )}
                      <span>{copiedReceipt ? 'Copied' : 'Copy List'}</span>
                    </button>

                    <a
                      href={mailtoHref}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/10">
                      <Mail className="h-3.5 w-3.5 text-amber-300" />
                      <span>Send via Email</span>
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="prismatic-gradient inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-2.5 text-xs font-bold tracking-wider whitespace-nowrap text-slate-950 uppercase transition-transform duration-150 hover:scale-[1.02] disabled:opacity-60">
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>{submitting ? 'Sending Order...' : 'Send Order'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {loadingHistory ? (
              <p className="py-8 text-center text-xs text-slate-400">
                Loading sent orders...
              </p>
            ) : sentOrders.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
                <p className="text-sm text-slate-300">No orders sent yet.</p>
                <p className="mt-1 text-xs text-slate-400">
                  Orders submitted from your tray appear here with their galley
                  reference code.
                </p>
              </div>
            ) : (
              sentOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-cyan-300 tabular-nums">
                      {order.orderId}
                    </span>
                    <span className="text-xs text-emerald-300">
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-white">
                    {order.guestName} ·{' '}
                    <span className="text-slate-300">{order.diningPod}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    {order.items
                      .map((item) => `${item.quantity}x ${item.dishName}`)
                      .join(', ')}
                  </p>
                  {order.notes && (
                    <p className="mt-1.5 text-xs text-slate-400">
                      Notes: {order.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
