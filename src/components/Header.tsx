import React from 'react';
import { KidProfile } from '../types';
import { Sparkles, Calendar, ShoppingCart, Activity, MessageSquareHeart, Users, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  kids: KidProfile[];
  activeTab: 'planner' | 'simulator' | 'nutrition' | 'grocery' | 'chat';
  setActiveTab: (tab: 'planner' | 'simulator' | 'nutrition' | 'grocery' | 'chat') => void;
  onOpenKidsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  kids,
  activeTab,
  setActiveTab,
  onOpenKidsModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 shadow-xs">
              <span className="text-2xl" role="img" aria-label="sprout">🌱</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-['Playfair_Display',serif]">
                  NourishKids
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  ICMR-NIN Compliant
                </span>
              </div>
              <p className="text-xs text-stone-600 font-medium">
                Indian Pediatric Meal & Nutrition Planner (Ages 3 & 4)
              </p>
            </div>
          </div>

          {/* Kids Personas Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="kids-profile-btn"
              onClick={onOpenKidsModal}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 shadow-2xs transition-all active:scale-98"
              title="Click to adjust kids ages and weight"
            >
              <div className="flex -space-x-1.5 overflow-hidden">
                {kids.map((kid) => (
                  <span
                    key={kid.id}
                    className="inline-block w-6 h-6 rounded-full bg-amber-50 border border-white text-xs flex items-center justify-center"
                  >
                    {kid.avatar}
                  </span>
                ))}
              </div>
              <div className="text-left hidden xs:block">
                <p className="text-xs font-semibold text-stone-800 leading-tight">
                  {kids.map((k) => `${k.name} (${k.ageYears}y)`).join(', ')}
                </p>
                <p className="text-[10px] text-stone-600">
                  Non-Veg • No Beef/Pork • Indian
                </p>
              </div>
              <Users className="w-3.5 h-3.5 text-stone-500 group-hover:text-stone-700" />
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-2 -mb-px border-t border-stone-200/60">
          <button
            id="nav-tab-planner"
            onClick={() => setActiveTab('planner')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'planner'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Weekly Meal Plan</span>
          </button>

          <button
            id="nav-tab-nutrition"
            onClick={() => setActiveTab('nutrition')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'nutrition'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Nutrition & RDA Coverage</span>
          </button>

          <button
            id="nav-tab-simulator"
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'simulator'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Pulse & Food Simulator</span>
          </button>

          <button
            id="nav-tab-grocery"
            onClick={() => setActiveTab('grocery')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'grocery'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>1-Month Grocery List</span>
          </button>

          <button
            id="nav-tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'chat'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
            }`}
          >
            <MessageSquareHeart className="w-4 h-4 text-rose-400" />
            <span>Ask Pediatric AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>
        </nav>
      </div>
    </header>
  );
};
