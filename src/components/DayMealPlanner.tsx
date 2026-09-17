import React from 'react';
import { DayPlan, FoodItem, MealSlot } from '../types';
import { calculateMealsNutrition } from '../utils/nutritionCalculator';
import { Plus, Trash2, Info, Sparkles, CheckCircle2, ChevronRight, Flame, ShieldAlert } from 'lucide-react';

interface DayMealPlannerProps {
  currentPlan: DayPlan;
  selectedDayIndex: number;
  allDays: DayPlan[];
  onSelectDay: (index: number) => void;
  onRemoveFood: (slot: MealSlot, foodId: string) => void;
  onOpenAddModal: (slot: MealSlot) => void;
  onViewNutritionTab: () => void;
  onAskAIAboutMeal: (mealSlotName: string, items: FoodItem[]) => void;
}

export const DayMealPlanner: React.FC<DayMealPlannerProps> = ({
  currentPlan,
  selectedDayIndex,
  allDays,
  onSelectDay,
  onRemoveFood,
  onOpenAddModal,
  onViewNutritionTab,
  onAskAIAboutMeal,
}) => {
  const nutrition = calculateMealsNutrition(currentPlan.meals);

  const mealSlots: { key: MealSlot; title: string; subtitle: string; icon: string; time: string }[] = [
    { key: 'breakfast', title: 'Breakfast', subtitle: 'Energy kickstart & brain fuel', icon: '🌅', time: '8:00 AM' },
    { key: 'midMorningSnack', title: 'Mid-Morning Snack', subtitle: 'Soaked dry fruits & hydrating seasonal fruit', icon: '🍎', time: '11:00 AM' },
    { key: 'lunch', title: 'Lunch', subtitle: 'Main protein, seafood/meat, greens & lentils', icon: '☀️', time: '1:00 PM' },
    { key: 'eveningSnack', title: 'Evening Snack', subtitle: 'Post-nap play fuel, pulses & makhana crunch', icon: '🪁', time: '5:00 PM' },
    { key: 'dinner', title: 'Dinner', subtitle: 'Light digestible carbs, soothing dal & cow ghee', icon: '🌙', time: '7:30 PM' },
  ];

  return (
    <div className="space-y-6">
      {/* Day Selector Chips */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          {allDays.map((dp, idx) => {
            const isSelected = idx === selectedDayIndex;
            return (
              <button
                key={dp.id}
                id={`day-tab-${dp.day.toLowerCase()}`}
                onClick={() => onSelectDay(idx)}
                className={`flex-1 min-w-[105px] py-2.5 px-3 rounded-xl text-center transition-all ${
                  isSelected
                    ? 'bg-amber-600 text-white font-bold shadow-xs scale-102'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 font-semibold border border-stone-200/60'
                }`}
              >
                <div className="text-xs uppercase tracking-wider opacity-85">{dp.day.slice(0, 3)}</div>
                <div className="text-sm font-extrabold truncate">{dp.day}</div>
              </button>
            );
          })}
        </div>

        {/* Current Day Theme Headline */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                {currentPlan.day} Focus:
              </span>
              <span className="text-xs sm:text-sm font-semibold text-stone-900">
                {currentPlan.theme}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Highlight: <span className="font-semibold text-stone-700">{currentPlan.highlightNutrient}</span>
            </p>
          </div>

          <button
            onClick={onViewNutritionTab}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/70 border border-amber-200/70 px-3 py-1.5 rounded-lg transition-all self-start sm:self-auto"
          >
            <span>View Full RDA Meters</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Nutrition Highlights Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            Calories
          </div>
          <div className="text-lg font-bold text-stone-900 mt-0.5">
            {nutrition.calories} <span className="text-xs font-normal text-stone-500">kcal</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold">ICMR Met 100%</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-500">Protein</div>
          <div className="text-lg font-bold text-stone-900 mt-0.5">
            {nutrition.protein} <span className="text-xs font-normal text-stone-500">g</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold">Target: 14-16g</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-500">Calcium (Bones)</div>
          <div className="text-lg font-bold text-stone-900 mt-0.5">
            {nutrition.calcium} <span className="text-xs font-normal text-stone-500">mg</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold">Target: 500mg</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-500">Iron (Anemia)</div>
          <div className="text-lg font-bold text-stone-900 mt-0.5">
            {nutrition.iron} <span className="text-xs font-normal text-stone-500">mg</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold">Target: 8.5mg</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-500">DHA (Brain)</div>
          <div className="text-lg font-bold text-stone-900 mt-0.5">
            {nutrition.dhaOmega3} <span className="text-xs font-normal text-stone-500">mg</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold">High Brain Focus</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-500">Vitamin A</div>
          <div className="text-lg font-bold text-stone-900 mt-0.5">
            {nutrition.vitaminA} <span className="text-xs font-normal text-stone-500">mcg</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold">Eyes & Immunity</div>
        </div>
      </div>

      {/* Meal Slots List */}
      <div className="space-y-5">
        {mealSlots.map((slot) => {
          const items = currentPlan.meals[slot.key] || [];

          return (
            <div
              key={slot.key}
              id={`meal-slot-container-${slot.key}`}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all"
            >
              {/* Slot Header */}
              <div className="px-5 py-3.5 bg-[#FAF8F5] border-b border-stone-200/70 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl" role="img" aria-label={slot.title}>{slot.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-stone-900">
                        {slot.title}
                      </h3>
                      <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                        {slot.time}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">{slot.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAskAIAboutMeal(slot.title, items)}
                    className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:text-amber-800 bg-white hover:bg-amber-50 border border-stone-200 transition-all shadow-2xs"
                    title="Ask AI Pediatrician tips for this meal"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Ask AI Prep Tip</span>
                  </button>

                  <button
                    id={`add-food-btn-${slot.key}`}
                    onClick={() => onOpenAddModal(slot.key)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-2xs transition-all active:scale-98"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add / Swap Food</span>
                  </button>
                </div>
              </div>

              {/* Items List in this slot */}
              <div className="p-4 sm:p-5">
                {items.length === 0 ? (
                  <div className="text-center py-6 text-stone-400 text-xs">
                    No items in this meal slot. Click &quot;Add / Swap Food&quot; to include nutritious Indian dishes!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="relative group p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-amber-300/80 transition-all shadow-2xs"
                      >
                        {/* Remove button */}
                        <button
                          onClick={() => onRemoveFood(slot.key, item.id)}
                          className="absolute top-3 right-3 opacity-60 hover:opacity-100 text-stone-400 hover:text-rose-600 p-1 transition-all"
                          title="Remove from meal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="pr-6">
                          {/* Category Badge */}
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                item.category === 'pulse'
                                  ? 'bg-amber-100 text-amber-800'
                                  : item.category === 'green'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.category === 'non-veg'
                                  ? 'bg-rose-100 text-rose-800'
                                  : item.category === 'dry-fruit'
                                  ? 'bg-orange-100 text-orange-800'
                                  : item.category === 'cereal'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {item.category.toUpperCase()}
                            </span>
                            {item.isIndianMarketAvailable && (
                              <span className="text-[10px] font-medium text-stone-500">
                                🇮🇳 Local Indian Market
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-stone-900 leading-snug">
                            {item.name}
                          </h4>
                          {item.localName && (
                            <p className="text-xs text-amber-800 font-medium mt-0.5">
                              {item.localName}
                            </p>
                          )}
                          <p className="text-[11px] text-stone-500 font-semibold mt-1">
                            Portion: {item.portion}
                          </p>
                        </div>

                        {/* Nutrition Micro-Pills */}
                        <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex flex-wrap items-center gap-1.5 text-[10px]">
                          <span className="bg-stone-200/70 text-stone-800 font-bold px-1.5 py-0.5 rounded-sm">
                            {item.nutrition.calories} kcal
                          </span>
                          <span className="bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm">
                            {item.nutrition.protein}g Protein
                          </span>
                          {item.nutrition.iron > 1 && (
                            <span className="bg-rose-50 text-rose-800 font-bold px-1.5 py-0.5 rounded-sm">
                              {item.nutrition.iron}mg Iron
                            </span>
                          )}
                          {item.nutrition.calcium > 30 && (
                            <span className="bg-sky-50 text-sky-800 font-bold px-1.5 py-0.5 rounded-sm">
                              {item.nutrition.calcium}mg Ca
                            </span>
                          )}
                          {item.nutrition.dhaOmega3 > 20 && (
                            <span className="bg-purple-50 text-purple-800 font-bold px-1.5 py-0.5 rounded-sm">
                              {item.nutrition.dhaOmega3}mg DHA
                            </span>
                          )}
                        </div>

                        {/* Toddler Preparation Tip */}
                        {item.kidPrepTip && (
                          <div className="mt-2.5 p-2 bg-amber-50/60 rounded-lg text-[11px] text-stone-700 leading-relaxed flex items-start gap-1.5">
                            <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-stone-800">Kid Prep (3-4y):</strong> {item.kidPrepTip}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
