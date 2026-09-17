import React, { useState } from 'react';
import { FoodItem, MealSlot, FoodCategory } from '../types';
import { FOOD_CATALOG } from '../data/nutritionData';
import { Search, Filter, Plus, Check, Sparkles, AlertCircle, Info, Flame, ShieldCheck } from 'lucide-react';

interface PulseAndFoodSimulatorProps {
  onAddFoodToSlot: (slot: MealSlot, food: FoodItem) => void;
  targetSlot?: MealSlot;
  onAskAIAboutItem: (food: FoodItem) => void;
}

export const PulseAndFoodSimulator: React.FC<PulseAndFoodSimulatorProps> = ({
  onAddFoodToSlot,
  targetSlot = 'lunch',
  onAskAIAboutItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');
  const [activeSlot, setActiveSlot] = useState<MealSlot>(targetSlot);
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);
  const [simulatedItem, setSimulatedItem] = useState<FoodItem | null>(null);

  const categories: { key: FoodCategory | 'all'; label: string; icon: string }[] = [
    { key: 'all', label: 'All Indian Foods', icon: '🍲' },
    { key: 'pulse', label: 'Pulses & Lentils (Dals)', icon: '🥣' },
    { key: 'green', label: 'Green Leafy Veg (Keerai)', icon: '🥬' },
    { key: 'non-veg', label: 'Seafood & Non-Veg', icon: '🐟' },
    { key: 'dry-fruit', label: 'Nuts & Dry Fruits', icon: '🥜' },
    { key: 'cereal', label: 'Millets & Grains (Ragi/Idli)', icon: '🌾' },
    { key: 'dairy', label: 'Dairy & Desi Ghee', icon: '🥛' },
  ];

  const filteredFoods = FOOD_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      (item.localName && item.localName.toLowerCase().includes(q)) ||
      item.vitaminsRichIn.some((v) => v.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const handleAdd = (item: FoodItem) => {
    onAddFoodToSlot(activeSlot, item);
    setAddedItemIds((prev) => [...prev, item.id]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== item.id));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Introduction Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/80 shadow-2xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="spice">🫘</span>
              <h2 className="text-lg sm:text-xl font-bold font-['Playfair_Display',serif] text-stone-900">
                Interactive Indian Pulse & Nutrition Simulator
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
              Wondering how adding sprouted moong, horse gram (kollu), drumstick leaves (moringa), mackerel fish, or almonds changes your kids&apos; nutrition?
              Select and add items directly into any meal slot below. All items are 100% verified for Indian grocery availability.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-amber-800 text-xs font-semibold shrink-0 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>ICMR-NIN Tested</span>
          </div>
        </div>

        {/* Slot Selector for Adding */}
        <div className="mt-4 pt-3 border-t border-amber-200/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-stone-800">Add selected food into:</span>
          {(['breakfast', 'midMorningSnack', 'lunch', 'eveningSnack', 'dinner'] as MealSlot[]).map((slot) => (
            <button
              key={slot}
              onClick={() => setActiveSlot(slot)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSlot === slot
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {slot === 'breakfast' && 'Breakfast 🌅'}
              {slot === 'midMorningSnack' && 'Mid-Morning 🍎'}
              {slot === 'lunch' && 'Lunch ☀️'}
              {slot === 'eveningSnack' && 'Evening Snack 🪁'}
              {slot === 'dinner' && 'Dinner 🌙'}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Indian pulses, fish, green leaves, dry fruits (e.g. moong, bangda, moringa, ragi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-amber-600 shadow-2xs"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Simulated Live Impact Inspector if user selected one */}
      {simulatedItem && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl animate-in fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              <div>
                <h4 className="text-sm font-bold text-emerald-950">
                  Simulated Impact of Adding: {simulatedItem.name}
                </h4>
                <p className="text-xs text-emerald-800">
                  Portion: {simulatedItem.portion} • Local: {simulatedItem.localName}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSimulatedItem(null)}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
            >
              Dismiss
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <div className="p-2 bg-white/80 rounded-lg text-stone-800">
              <span className="text-[10px] text-stone-500 block">Energy Boost</span>
              <strong className="text-emerald-700 font-bold">+{simulatedItem.nutrition.calories} kcal</strong>
            </div>
            <div className="p-2 bg-white/80 rounded-lg text-stone-800">
              <span className="text-[10px] text-stone-500 block">Protein Boost</span>
              <strong className="text-emerald-700 font-bold">+{simulatedItem.nutrition.protein}g</strong>
            </div>
            <div className="p-2 bg-white/80 rounded-lg text-stone-800">
              <span className="text-[10px] text-stone-500 block">Iron Boost</span>
              <strong className="text-emerald-700 font-bold">+{simulatedItem.nutrition.iron}mg</strong>
            </div>
            <div className="p-2 bg-white/80 rounded-lg text-stone-800">
              <span className="text-[10px] text-stone-500 block">Calcium Boost</span>
              <strong className="text-emerald-700 font-bold">+{simulatedItem.nutrition.calcium}mg</strong>
            </div>
            <div className="p-2 bg-white/80 rounded-lg text-stone-800">
              <span className="text-[10px] text-stone-500 block">DHA / Brain Boost</span>
              <strong className="text-emerald-700 font-bold">+{simulatedItem.nutrition.dhaOmega3}mg</strong>
            </div>
          </div>
        </div>
      )}

      {/* Foods Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFoods.map((item) => {
          const isAdded = addedItemIds.includes(item.id);

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between p-4 rounded-2xl border border-stone-200 bg-white hover:border-amber-300 hover:shadow-xs transition-all"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 mt-1">
                      {item.name}
                    </h3>
                    {item.localName && (
                      <p className="text-xs font-semibold text-amber-800">
                        {item.localName}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-bold text-stone-600 bg-stone-50 border border-stone-200 px-2 py-1 rounded-lg shrink-0">
                    {item.portion}
                  </span>
                </div>

                {/* Market Availability Verification */}
                <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50/80 border border-emerald-200/60 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{item.marketNote || 'Widely available in Indian grocery shops'}</span>
                </div>

                {/* Micro Nutrients Grid */}
                <div className="mt-3 grid grid-cols-4 gap-1.5 text-center text-[10px] font-semibold">
                  <div className="p-1.5 bg-stone-50 rounded-lg">
                    <span className="text-stone-400 block text-[9px]">Calories</span>
                    <span className="text-stone-800 font-bold">{item.nutrition.calories}</span>
                  </div>
                  <div className="p-1.5 bg-emerald-50 rounded-lg">
                    <span className="text-emerald-700 block text-[9px]">Protein</span>
                    <span className="text-emerald-900 font-bold">{item.nutrition.protein}g</span>
                  </div>
                  <div className="p-1.5 bg-rose-50 rounded-lg">
                    <span className="text-rose-700 block text-[9px]">Iron</span>
                    <span className="text-rose-900 font-bold">{item.nutrition.iron}mg</span>
                  </div>
                  <div className="p-1.5 bg-sky-50 rounded-lg">
                    <span className="text-sky-700 block text-[9px]">Calcium</span>
                    <span className="text-sky-900 font-bold">{item.nutrition.calcium}mg</span>
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="mt-2.5 space-y-1">
                  {item.benefits.map((b, i) => (
                    <div key={i} className="text-[11px] text-stone-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                {/* Kid Prep Advice for 3-4yo */}
                {item.kidPrepTip && (
                  <div className="mt-2.5 p-2 bg-stone-50 rounded-lg text-[11px] text-stone-600 border border-stone-200/60 leading-relaxed">
                    <strong className="text-stone-800">Toddler Tip:</strong> {item.kidPrepTip}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSimulatedItem(item)}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline underline-offset-2"
                >
                  Simulate
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onAskAIAboutItem(item)}
                    className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-amber-800 hover:bg-amber-50 transition-all"
                    title="Ask AI Pediatrician about cooking this for 3-4yo"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  </button>

                  <button
                    onClick={() => handleAdd(item)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-98 ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white shadow-2xs'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to {activeSlot.slice(0, 5)}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
