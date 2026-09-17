import React, { useState } from 'react';
import { KidProfile, DayPlan, MealSlot, FoodItem } from './types';
import { INITIAL_KIDS, DEFAULT_WEEK_PLAN } from './data/nutritionData';
import { Header } from './components/Header';
import { DayMealPlanner } from './components/DayMealPlanner';
import { PulseAndFoodSimulator } from './components/PulseAndFoodSimulator';
import { NutritionDashboard } from './components/NutritionDashboard';
import { MonthlyGroceryDashboard } from './components/MonthlyGroceryDashboard';
import { PediatricAIChatbot } from './components/PediatricAIChatbot';
import { KidProfileManager } from './components/KidProfileManager';
import { AddFoodModal } from './components/AddFoodModal';
import { ShieldCheck, Sparkles, Heart, Apple, CheckCircle2, ChevronRight } from 'lucide-react';

export default function App() {
  const [kids, setKids] = useState<KidProfile[]>(INITIAL_KIDS);
  const [weekPlans, setWeekPlans] = useState<DayPlan[]>(DEFAULT_WEEK_PLAN);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'planner' | 'simulator' | 'nutrition' | 'grocery' | 'chat'>('planner');

  // Modals state
  const [isKidsModalOpen, setIsKidsModalOpen] = useState(false);
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [targetSlotForModal, setTargetSlotForModal] = useState<MealSlot>('lunch');
  const [initialChatQuestion, setInitialChatQuestion] = useState<string | undefined>(undefined);

  const currentPlan = weekPlans[selectedDayIndex] || weekPlans[0];

  // Handler: Remove food item from a meal slot
  const handleRemoveFood = (slot: MealSlot, foodId: string) => {
    setWeekPlans((prev) => {
      const updated = [...prev];
      const dayCopy = { ...updated[selectedDayIndex] };
      dayCopy.meals = {
        ...dayCopy.meals,
        [slot]: dayCopy.meals[slot].filter((item) => item.id !== foodId),
      };
      updated[selectedDayIndex] = dayCopy;
      return updated;
    });
  };

  // Handler: Add food item to a meal slot
  const handleAddFoodToSlot = (slot: MealSlot, food: FoodItem) => {
    setWeekPlans((prev) => {
      const updated = [...prev];
      const dayCopy = { ...updated[selectedDayIndex] };
      dayCopy.meals = {
        ...dayCopy.meals,
        [slot]: [...dayCopy.meals[slot], food],
      };
      updated[selectedDayIndex] = dayCopy;
      return updated;
    });
  };

  // Open add food modal from a specific slot in planner
  const handleOpenAddModal = (slot: MealSlot) => {
    setTargetSlotForModal(slot);
    setIsAddFoodModalOpen(true);
  };

  // Trigger chatbot with targeted context
  const handleAskAIAboutItem = (food: FoodItem) => {
    setInitialChatQuestion(`How should I prepare and serve "${food.name}" (${food.localName || ''}) for my ${kids.map(k => `${k.ageYears}yo ${k.name}`).join(' and ')}? Any specific Indian cooking techniques to make it soft and tasty for toddlers?`);
    setActiveTab('chat');
  };

  const handleAskAIAboutMeal = (mealSlotName: string, items: FoodItem[]) => {
    const itemNames = items.map((i) => i.name).join(', ');
    setInitialChatQuestion(`For ${currentPlan.day} ${mealSlotName} (${itemNames || 'custom meal'}), what is the best way to cook and serve this to a 4-year-old girl and 3-year-old boy to ensure all nutrients are preserved?`);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* App Header & Navigation */}
      <Header
        kids={kids}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenKidsModal={() => setIsKidsModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Context Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <Apple className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">
                Active Meal Plan: <span className="text-amber-800">{currentPlan.day} • {currentPlan.theme}</span>
              </p>
              <p className="text-[11px] text-stone-500">
                Children: {kids.map((k) => `${k.name} (${k.ageYears} yrs, ${k.weightKg}kg)`).join(' & ')} • Diet: Non-Veg (Eggs, Fish, Prawns, Crab, Chicken, Mutton) • <span className="text-rose-700 font-semibold">No Beef/Pork</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
            <button
              onClick={() => setIsKidsModalOpen(true)}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 underline underline-offset-2"
            >
              Adjust Ages
            </button>
            <span className="text-stone-300">|</span>
            <button
              onClick={() => setActiveTab('simulator')}
              className="inline-flex items-center gap-1 text-xs font-bold text-stone-800 hover:text-amber-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Simulate Pulses</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Weekly Meal Plan */}
        {activeTab === 'planner' && (
          <DayMealPlanner
            currentPlan={currentPlan}
            selectedDayIndex={selectedDayIndex}
            allDays={weekPlans}
            onSelectDay={(idx) => setSelectedDayIndex(idx)}
            onRemoveFood={handleRemoveFood}
            onOpenAddModal={handleOpenAddModal}
            onViewNutritionTab={() => setActiveTab('nutrition')}
            onAskAIAboutMeal={handleAskAIAboutMeal}
          />
        )}

        {/* Tab 2: Nutrition & RDA Coverage */}
        {activeTab === 'nutrition' && (
          <NutritionDashboard
            currentPlan={currentPlan}
            kids={kids}
            onOpenSimulator={() => setActiveTab('simulator')}
          />
        )}

        {/* Tab 3: Pulse & Indian Food Simulator */}
        {activeTab === 'simulator' && (
          <PulseAndFoodSimulator
            onAddFoodToSlot={handleAddFoodToSlot}
            onAskAIAboutItem={handleAskAIAboutItem}
          />
        )}

        {/* Tab 4: 1-Month Grocery List */}
        {activeTab === 'grocery' && (
          <MonthlyGroceryDashboard />
        )}

        {/* Tab 5: Interactive Pediatric AI Chatbot */}
        {activeTab === 'chat' && (
          <PediatricAIChatbot
            kids={kids}
            currentPlan={currentPlan}
            initialQuestion={initialChatQuestion}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-stone-200/80 bg-white/60 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-700 font-semibold">
            <span className="text-base">🌱</span>
            <span>NourishKids Indian Pediatric Nutrition Planner</span>
            <span className="text-stone-300">•</span>
            <span className="text-[11px] font-normal text-stone-500">
              ICMR-NIN (National Institute of Nutrition, India) Standard Grounded
            </span>
          </div>
          <div className="text-[11px] text-stone-500 text-center sm:text-right">
            Designed for 3 & 4 year old toddlers and preschoolers. Always consult your pediatrician for individual clinical food allergies.
          </div>
        </div>
      </footer>

      {/* Kids Profile Management Modal */}
      <KidProfileManager
        isOpen={isKidsModalOpen}
        onClose={() => setIsKidsModalOpen(false)}
        kids={kids}
        onUpdateKids={(newKids) => setKids(newKids)}
      />

      {/* Add Food Quick Modal */}
      <AddFoodModal
        isOpen={isAddFoodModalOpen}
        onClose={() => setIsAddFoodModalOpen(false)}
        targetSlot={targetSlotForModal}
        onAddFood={handleAddFoodToSlot}
      />
    </div>
  );
}
