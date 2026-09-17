import React, { useState } from 'react';
import { DayPlan, KidProfile, RDAStandard } from '../types';
import { calculateMealsNutrition, getCombinedRDA, compareNutritionToRDA, NutrientComparison } from '../utils/nutritionCalculator';
import { CheckCircle2, AlertTriangle, Info, Sparkles, Activity, ShieldCheck, HeartPulse } from 'lucide-react';

interface NutritionDashboardProps {
  currentPlan: DayPlan;
  kids: KidProfile[];
  onOpenSimulator: () => void;
}

export const NutritionDashboard: React.FC<NutritionDashboardProps> = ({
  currentPlan,
  kids,
  onOpenSimulator,
}) => {
  const [selectedKidId, setSelectedKidId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Vitamins' | 'Minerals & Brain' | 'Macronutrients'>('All');

  // Compute active target
  const activeKids = selectedKidId === 'all' ? kids : kids.filter(k => k.id === selectedKidId);
  const targetRDA: RDAStandard = getCombinedRDA(activeKids);
  const actualNutrition = calculateMealsNutrition(currentPlan.meals);

  const comparisons = compareNutritionToRDA(actualNutrition, targetRDA, currentPlan.meals);

  const filteredComparisons = selectedCategory === 'All'
    ? comparisons
    : comparisons.filter(c => c.category === selectedCategory);

  const optimalCount = comparisons.filter(c => c.status === 'optimal').length;
  const totalNutrients = comparisons.length;
  const overallScorePercent = Math.round((optimalCount / totalNutrients) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner: ICMR-NIN Compliance Score */}
      <div className="p-5 sm:p-6 bg-white rounded-2xl border border-stone-200/90 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="stethoscope">🩺</span>
              <h2 className="text-xl font-bold font-['Playfair_Display',serif] text-stone-900">
                ICMR-NIN Pediatric Nutrition Coverage
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
              Calculated against the National Institute of Nutrition (India) guidelines for your {kids.map(k => `${k.name} (${k.ageYears}y)`).join(' and ')}.
            </p>
          </div>

          {/* Child View Selector */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-semibold text-stone-500">View for:</span>
            <select
              value={selectedKidId}
              onChange={(e) => setSelectedKidId(e.target.value)}
              className="bg-[#FAF8F5] border border-stone-200 text-stone-800 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-hidden focus:border-amber-600"
            >
              <option value="all">Both Kids (Averaged Targets)</option>
              {kids.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.avatar} {k.name} ({k.ageYears}y - {k.gender})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Overall Score Meter */}
        <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              {overallScorePercent}%
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950">Daily Coverage Rating</div>
              <div className="text-[11px] text-emerald-800">
                {optimalCount} of {totalNutrients} key nutrients fully met 100%+
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <div className="text-[11px] font-semibold text-stone-500">Day Selected</div>
            <div className="text-sm font-bold text-stone-900 mt-0.5">{currentPlan.day} Plan</div>
            <div className="text-[11px] text-amber-800 font-semibold">{currentPlan.theme}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-stone-500">Missing Any Nutrients?</div>
              <div className="text-xs font-bold text-stone-800 mt-0.5">Add Sprouted Pulses or Fish</div>
            </div>
            <button
              onClick={onOpenSimulator}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-all active:scale-98"
            >
              Add Pulses
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200 pb-2">
        {(['All', 'Vitamins', 'Minerals & Brain', 'Macronutrients'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Nutrients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredComparisons.map((c: NutrientComparison) => {
          const isOptimal = c.status === 'optimal';
          const isGood = c.status === 'good';

          return (
            <div
              key={c.key}
              className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-300 transition-all shadow-2xs"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    {c.category}
                  </span>
                  <h3 className="text-sm font-bold text-stone-900 mt-0.5">
                    {c.label}
                  </h3>
                </div>

                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    isOptimal
                      ? 'bg-emerald-100 text-emerald-800'
                      : isGood
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {isOptimal ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  <span>{c.percent}%</span>
                </span>
              </div>

              {/* Numerical stats */}
              <div className="mt-3 flex items-baseline justify-between text-xs">
                <div>
                  <span className="text-stone-400 text-[11px]">Current Plan: </span>
                  <strong className="text-stone-900 text-sm">{c.actual} {c.unit}</strong>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px]">ICMR Target: </span>
                  <span className="text-stone-600 font-semibold">{c.target} {c.unit}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2 w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOptimal
                      ? 'bg-emerald-500'
                      : isGood
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(c.percent, 100)}%` }}
                ></div>
              </div>

              {/* Pediatric Function */}
              <p className="mt-3 text-[11px] text-stone-600 leading-relaxed">
                <strong className="text-stone-800">Why for kids:</strong> {c.functionInBody}
              </p>

              {/* Top Indian food sources contributing in this plan */}
              <div className="mt-2.5 pt-2 border-t border-stone-100">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Top Sources in Today&apos;s Meals:
                </span>
                {c.topSourcesInPlan.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {c.topSourcesInPlan.map((src, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-stone-100 text-stone-700 font-medium px-1.5 py-0.5 rounded-sm"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[10px] text-stone-400 italic">
                    Add moong dal, moringa or fish to boost!
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
