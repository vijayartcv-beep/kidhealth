import React, { useState } from 'react';
import { FoodItem, MealSlot, FoodCategory } from '../types';
import { FOOD_CATALOG } from '../data/nutritionData';
import { X, Search, Plus, Check, CheckCircle2 } from 'lucide-react';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSlot: MealSlot;
  onAddFood: (slot: MealSlot, food: FoodItem) => void;
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  targetSlot,
  onAddFood,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');
  const [addedId, setAddedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const slotLabels: Record<MealSlot, string> = {
    breakfast: 'Breakfast 🌅',
    midMorningSnack: 'Mid-Morning Snack 🍎',
    lunch: 'Lunch ☀️',
    eveningSnack: 'Evening Snack 🪁',
    dinner: 'Dinner 🌙',
  };

  const filteredFoods = FOOD_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      (item.localName && item.localName.toLowerCase().includes(q)) ||
      item.vitaminsRichIn.some((v) => v.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const handleSelect = (item: FoodItem) => {
    onAddFood(targetSlot, item);
    setAddedId(item.id);
    setTimeout(() => {
      setAddedId(null);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-stone-200 shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-stone-200/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Add to {slotLabels[targetSlot]}
            </span>
            <h3 className="text-lg font-bold font-['Playfair_Display',serif] text-stone-900">
              Select Nutritious Indian Food or Pulse
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-stone-100 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pulses, fish, greens, nuts (e.g. toor dal, bangda, moringa, ragi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-amber-600"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            {(['all', 'pulse', 'green', 'non-veg', 'dry-fruit', 'cereal', 'dairy'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {cat === 'all' && 'All'}
                {cat === 'pulse' && 'Pulses/Dals 🥣'}
                {cat === 'green' && 'Greens 🥬'}
                {cat === 'non-veg' && 'Seafood & Non-Veg 🐟'}
                {cat === 'dry-fruit' && 'Nuts 🥜'}
                {cat === 'cereal' && 'Grains/Ragi 🌾'}
                {cat === 'dairy' && 'Dairy/Ghee 🥛'}
              </button>
            ))}
          </div>
        </div>

        {/* List of items */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2.5 bg-stone-50/40">
          {filteredFoods.map((item) => {
            const isAdded = addedId === item.id;

            return (
              <div
                key={item.id}
                className="p-3 bg-white border border-stone-200 rounded-xl hover:border-amber-300 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-stone-100 text-stone-700">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900 truncate">
                      {item.name}
                    </h4>
                  </div>
                  {item.localName && (
                    <p className="text-xs text-amber-800 font-medium truncate mt-0.5">
                      {item.localName}
                    </p>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-stone-500 font-semibold">
                    <span>{item.portion}</span>
                    <span>•</span>
                    <span className="text-stone-800">{item.nutrition.calories} kcal</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">{item.nutrition.protein}g protein</span>
                    <span>•</span>
                    <span className="text-rose-700 font-bold">{item.nutrition.iron}mg iron</span>
                  </div>
                </div>

                <button
                  onClick={() => handleSelect(item)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 hover:bg-amber-700 text-white shadow-2xs'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Select</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
