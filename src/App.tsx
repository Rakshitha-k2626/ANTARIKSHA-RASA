/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {ShoppingBag} from 'lucide-react';
import {useCallback, useEffect, useState} from 'react';
import {ClosingSection} from './components/ClosingSection';
import {CosmicLoader} from './components/CosmicLoader';
import {CosmicMenuSection} from './components/CosmicMenuSection';
import {DeliveryAndFeedbackPage} from './components/DeliveryAndFeedbackPage';
import {ExperienceSection} from './components/ExperienceSection';
import {Footer} from './components/Footer';
import {HeroSection} from './components/HeroSection';
import {Navbar, type PageRoute} from './components/Navbar';
import {OrderTrayModal} from './components/OrderTrayModal';
import {StarfieldCanvas} from './components/StarfieldCanvas';
import {WhySection} from './components/WhySection';
import {DELIVERY_TIERS, MENU_DISHES} from './data/cosmicData';

const ORDER_STORAGE_KEY = 'antariksha_order_tray_v1';

const VALID_ROUTES: PageRoute[] = [
  '/',
  '/experience',
  '/menu',
  '/delivery',
  '/story',
  '/reserve',
];

function normalizeRoute(pathname: string): PageRoute {
  if (VALID_ROUTES.includes(pathname as PageRoute)) {
    return pathname as PageRoute;
  }
  return '/';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(() =>
    normalizeRoute(window.location.pathname),
  );
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderServiceMode, setOrderServiceMode] = useState<
    'Orbital Dine-In' | 'Delivery Service'
  >('Orbital Dine-In');
  const [orderDeliveryTier, setOrderDeliveryTier] = useState(
    DELIVERY_TIERS[0].name,
  );
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

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(normalizeRoute(window.location.pathname));
      window.scrollTo({top: 0, behavior: 'auto'});
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = useCallback((route: PageRoute) => {
    if (window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }
    setCurrentRoute(route);
    window.scrollTo({top: 0, behavior: 'smooth'});
  }, []);

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

  const handleStartDeliveryOrder = (tierName: string) => {
    setOrderServiceMode('Delivery Service');
    setOrderDeliveryTier(tierName);
    if (Object.keys(orderCounts).length === 0) {
      handleNavigate('/menu');
    } else {
      setOrderModalOpen(true);
    }
  };

  const totalOrderCount = Object.values(orderCounts).reduce(
    (sum, qty) => sum + qty,
    0,
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#04060e] text-slate-100">
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

      <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />

      <main className="relative z-10 flex-1">
        {currentRoute === '/' && <HeroSection onNavigate={handleNavigate} />}
        {currentRoute === '/experience' && (
          <ExperienceSection onNavigate={handleNavigate} />
        )}
        {currentRoute === '/menu' && (
          <CosmicMenuSection
            dishes={MENU_DISHES}
            orderCounts={orderCounts}
            totalOrderCount={totalOrderCount}
            onUpdateOrder={handleUpdateOrder}
            onOpenOrderTray={() => setOrderModalOpen(true)}
          />
        )}
        {currentRoute === '/delivery' && (
          <DeliveryAndFeedbackPage
            onNavigate={handleNavigate}
            onStartDeliveryOrder={handleStartDeliveryOrder}
          />
        )}
        {currentRoute === '/story' && (
          <WhySection onNavigate={handleNavigate} />
        )}
        {currentRoute === '/reserve' && (
          <ClosingSection
            dishes={MENU_DISHES}
            totalOrderCount={totalOrderCount}
            onOpenOrderTray={() => setOrderModalOpen(true)}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

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
        initialServiceMode={orderServiceMode}
        initialDeliveryTier={orderDeliveryTier}
        onUpdateQuantity={handleUpdateOrder}
        onClearOrder={handleClearOrder}
      />
    </div>
  );
}
