import {
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Thermometer,
  UtensilsCrossed,
} from 'lucide-react';
import {useMemo, useState} from 'react';
import {type DishItem} from '../data/cosmicData';
import {ResilientImage} from './ResilientImage';

type FilterCategory = 'All Courses' | DishItem['category'];

const CATEGORIES: FilterCategory[] = [
  'All Courses',
  'Main Orbital',
  'Micro-G Bites',
  'Elixirs',
  'Celestial Sweet',
];

interface CosmicMenuSectionProps {
  dishes: DishItem[];
  orderCounts: Record<string, number>;
  totalOrderCount: number;
  onUpdateOrder: (dishId: string, delta: number) => void;
  onOpenOrderTray: () => void;
}

export function CosmicMenuSection({
  dishes,
  orderCounts,
  totalOrderCount,
  onUpdateOrder,
  onOpenOrderTray,
}: CosmicMenuSectionProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>('All Courses');
  const [selectedDish, setSelectedDish] = useState<DishItem>(dishes[0]);

  const filteredDishes = useMemo(() => {
    if (selectedCategory === 'All Courses') return dishes;
    return dishes.filter((dish) => dish.category === selectedCategory);
  }, [dishes, selectedCategory]);

  const handleCategoryChange = (category: FilterCategory) => {
    setSelectedCategory(category);
    if (category !== 'All Courses') {
      const firstMatch = dishes.find((d) => d.category === category);
      if (firstMatch) setSelectedDish(firstMatch);
    }
  };

  const selectedDishQty = selectedDish ? orderCounts[selectedDish.id] || 0 : 0;

  return (
    <section
      id="menu"
      className="relative z-20 mx-auto max-w-[1200px] px-5 py-24 sm:px-8 lg:py-32">
      {/* Header + Interactive Filter Controls + Order Tray Button */}
      <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-end">
        <div className="max-w-xl">
          <p className="font-mono text-xs tracking-[0.24em] text-amber-300 uppercase">
            Astronaut Gastronomy · ब्रह्माण्ड व्यंजन
          </p>
          <h2 className="font-display mt-3 text-[clamp(1.85rem,3.5vw,3rem)] leading-tight font-semibold tracking-wide text-balance text-white">
            The Cosmic Menu
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            Modern Indian-inspired cuisine re-engineered for microgravity. Add
            the dishes you want to your tray and send your order straight to
            the orbital galley.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Interactive Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter Cosmic Menu Courses"
            className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-[#080d1d]/90 p-1.5">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => handleCategoryChange(category)}
                  className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
                    active
                      ? 'prismatic-gradient font-semibold text-slate-950'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}>
                  {category}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onOpenOrderTray}
            className="iridescent-border glass-surface inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-wider whitespace-nowrap text-white uppercase transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">
            <ShoppingBag className="h-4 w-4 text-cyan-300" aria-hidden="true" />
            <span className="tabular-nums">Order Tray ({totalOrderCount})</span>
          </button>
        </div>
      </div>

      {/* Dish Cards Grid */}
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredDishes.map((dish) => {
          const isSelected = selectedDish?.id === dish.id;
          const qty = orderCounts[dish.id] || 0;

          return (
            <div
              key={dish.id}
              className={`group flex flex-col overflow-hidden rounded-2xl transition-all duration-200 ${
                isSelected
                  ? 'iridescent-border bg-[#0c1328]/95 shadow-[0_16px_45px_rgba(168,85,247,0.18)]'
                  : 'border border-white/10 bg-[#080d1d]/80 hover:-translate-y-1 hover:border-white/25'
              }`}>
              <button
                type="button"
                onClick={() => setSelectedDish(dish)}
                aria-pressed={isSelected}
                className="flex flex-1 cursor-pointer flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <ResilientImage
                    src={dish.image}
                    alt={dish.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#080d1d] via-transparent to-transparent"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-5 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-devanagari text-amber-200/90">
                        {dish.sanskritName}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{dish.category}</span>
                    </div>

                    <h3 className="font-display mt-2 text-lg font-semibold tracking-wide text-white">
                      {dish.name}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      {dish.shortDescription}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span
                      className={
                        isSelected
                          ? 'font-medium text-cyan-300'
                          : 'text-slate-400'
                      }>
                      {isSelected ? 'Viewing Details' : 'View Details'}
                    </span>
                    <span className="font-mono text-slate-300 tabular-nums">
                      {dish.servingTemp}
                    </span>
                  </div>
                </div>
              </button>

              {/* Direct Add to Order / Quantity Controls */}
              <div className="border-t border-white/10 px-5 py-3.5">
                {qty === 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDish(dish);
                      onUpdateOrder(dish.id, 1);
                    }}
                    className="flex min-h-[40px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wider whitespace-nowrap text-white uppercase transition-colors hover:border-cyan-400/50 hover:bg-cyan-400/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">
                    <Plus className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
                    <span>Add to Order</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label={`Remove one ${dish.name}`}
                        onClick={() => onUpdateOrder(dish.id, -1)}
                        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/10">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="font-mono w-7 text-center text-sm font-semibold text-cyan-300 tabular-nums">
                        {qty}
                      </span>
                      <button
                        type="button"
                        aria-label={`Add one more ${dish.name}`}
                        onClick={() => onUpdateOrder(dish.id, 1)}
                        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/10">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenOrderTray}
                      className="prismatic-gradient cursor-pointer rounded-lg px-3 py-2 text-[11px] font-bold tracking-wider whitespace-nowrap text-slate-950 uppercase">
                      Send
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Dish Culinary & Engineering Showcase */}
      {selectedDish && (
        <div className="iridescent-border glass-surface mt-10 overflow-hidden rounded-2xl">
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
            <div className="relative min-h-[260px] lg:col-span-5">
              <ResilientImage
                src={selectedDish.image}
                alt={selectedDish.imageAlt}
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 hidden bg-gradient-to-r from-transparent via-transparent to-[#0a0f20]/80 lg:block"
              />
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300">
                    <span className="font-devanagari text-sm text-amber-200">
                      {selectedDish.sanskritName}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tracking-wider text-cyan-300 uppercase">
                      {selectedDish.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedDishQty > 0 ? (
                      <button
                        type="button"
                        onClick={onOpenOrderTray}
                        className="prismatic-gradient inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-wider whitespace-nowrap text-slate-950 uppercase">
                        <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>In Tray ({selectedDishQty}) · Send Order</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onUpdateOrder(selectedDish.id, 1)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-400/10 px-4 py-2 text-xs font-semibold tracking-wider whitespace-nowrap text-white uppercase transition-colors hover:bg-cyan-400/20">
                        <Plus className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
                        <span>Add {selectedDish.name}</span>
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="font-display mt-2 text-2xl font-semibold tracking-wide text-white sm:text-3xl">
                  {selectedDish.name}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-slate-200 sm:text-base">
                  {selectedDish.culinaryStory}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-5 border-t border-white/10 pt-6 sm:grid-cols-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <UtensilsCrossed
                      className="h-3.5 w-3.5 text-cyan-300"
                      aria-hidden="true"
                    />
                    <span>Containment</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed font-medium text-slate-100">
                    {selectedDish.containmentMethod}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Sparkles
                      className="h-3.5 w-3.5 text-amber-300"
                      aria-hidden="true"
                    />
                    <span>Flavor Resonance</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed font-medium text-slate-100">
                    {selectedDish.tastingNotes}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Thermometer
                      className="h-3.5 w-3.5 text-violet-300"
                      aria-hidden="true"
                    />
                    <span>Calibration</span>
                  </div>
                  <p className="font-mono mt-1.5 text-xs leading-relaxed font-medium text-slate-100 tabular-nums">
                    {selectedDish.nutritionProfile}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
