/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {ShoppingBag} from 'lucide-react';
import {useEffect, useState} from 'react';
import {ClosingSection} from './components/ClosingSection';
import {CosmicLoader} from './components/CosmicLoader';
import {CosmicMenuSection} from './components/CosmicMenuSection';
import {ExperienceSection} from './components/ExperienceSection';
import {Footer} from './components/Footer';
import {HeroSection} from './components/HeroSection';
import {Navbar} from './components/Navbar';
import {OrderTrayModal} from './components/OrderTrayModal';
import {StarfieldCanvas} from './components/StarfieldCanvas';
import {VoyagePreviewModal} from './components/VoyagePreviewModal';
import {WhySection} from './components/WhySection';
import {MENU_DISHES} from './data/cosmicData';

const ORDER_STORAGE_KEY = 'antariksha_order_tray_v1';

export default function App() {
  const [voyageModalOpen, setVoyageModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderCounts, setOrderCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = window.localStorage.getItem(ORDER_STORAGE_KEY);
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(
        ORDER_STORAGE_KEY,
        JSON.stringify(orderCounts),
      );
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [orderCounts]);

  const handleUpdateOrder = (dishId: string, delta: number) => {
    setOrderCounts((prev) => {
      const nextCount = Math.max(0, Math.min(20, (prev[dishId] || 0) + delta));
      if (nextCount === 0) {
        const rest = {...prev};
        delete rest[dishId];
        return rest;
      }
      return {...prev, [dishId]: nextCount};
    });
  };

  const handleClearOrder = () => {
    setOrderCounts({});
  };

  const totalOrderCount = Object.values(orderCounts).reduce(
    (sum, qty) => sum + qty,
    0,
  );

  return (
    <div className="relative min-h-screen bg-[#04060e] text-slate-100">
      <CosmicLoader />
      <StarfieldCanvas />

      {/* Subtle Soft Nebula Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[520px] w-[520px] rounded-full bg-cyan-500/[0.06] blur-[140px]" />
        <div className="absolute top-[42%] -right-32 h-[540px] w-[540px] rounded-full bg-violet-600/[0.07] blur-[160px]" />
        <div className="absolute bottom-[12%] -left-24 h-[460px] w-[460px] rounded-full bg-amber-500/[0.05] blur-[140px]" />
      </div>

      <Navbar onOpenVoyagePreview={() => setVoyageModalOpen(true)} />

      <main className="relative z-10">
        <HeroSection />
        <ExperienceSection />
        <CosmicMenuSection
          dishes={MENU_DISHES}
          orderCounts={orderCounts}
          totalOrderCount={totalOrderCount}
          onUpdateOrder={handleUpdateOrder}
          onOpenOrderTray={() => setOrderModalOpen(true)}
        />
        <WhySection />
        <ClosingSection onOpenVoyagePreview={() => setVoyageModalOpen(true)} />
      </main>

      <Footer onOpenVoyagePreview={() => setVoyageModalOpen(true)} />

      {/* Floating Order Tray Action when dishes are selected */}
      {totalOrderCount > 0 && !orderModalOpen && (
        <button
          type="button"
          onClick={() => setOrderModalOpen(true)}
          className="prismatic-gradient fixed right-5 bottom-5 z-40 inline-flex min-h-[46px] cursor-pointer items-center gap-2.5 rounded-full px-5 py-2.5 text-xs font-bold tracking-wider whitespace-nowrap text-slate-950 uppercase shadow-[0_12px_36px_rgba(34,211,238,0.35)] transition-transform duration-150 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          <span className="tabular-nums">
            Order Tray ({totalOrderCount}) · Send Order
          </span>
        </button>
      )}

      <OrderTrayModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        dishes={MENU_DISHES}
        orderCounts={orderCounts}
        onUpdateQuantity={handleUpdateOrder}
        onClearOrder={handleClearOrder}
      />

      <VoyagePreviewModal
        isOpen={voyageModalOpen}
        onClose={() => setVoyageModalOpen(false)}
        dishes={MENU_DISHES}
      />
    </div>
  );
}
