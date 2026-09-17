import React, { useState } from 'react';
import { KidProfile } from '../types';
import { ICMR_RDA_BY_AGE } from '../data/nutritionData';
import { X, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface KidProfileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  kids: KidProfile[];
  onUpdateKids: (newKids: KidProfile[]) => void;
}

export const KidProfileManager: React.FC<KidProfileManagerProps> = ({
  isOpen,
  onClose,
  kids,
  onUpdateKids,
}) => {
  const [localKids, setLocalKids] = useState<KidProfile[]>(kids);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateKids(localKids);
    onClose();
  };

  const handleUpdate = (id: string, field: keyof KidProfile, value: any) => {
    setLocalKids((prev) =>
      prev.map((k) => (k.id === id ? { ...k, [field]: value } : k))
    );
  };

  const handleAddKid = () => {
    const newId = `kid-${Date.now()}`;
    const newKid: KidProfile = {
      id: newId,
      name: `Kid ${localKids.length + 1}`,
      ageYears: 3,
      gender: 'girl',
      weightKg: 14,
      activityLevel: 'very_active',
      avatar: '👶',
    };
    setLocalKids([...localKids, newKid]);
  };

  const handleRemoveKid = (id: string) => {
    if (localKids.length <= 1) return;
    setLocalKids(localKids.filter((k) => k.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-xl p-5 sm:p-6 text-stone-900">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-xl font-bold font-['Playfair_Display',serif] text-stone-900">
              Kids Nutrition Profiles
            </h2>
            <p className="text-xs text-stone-600">
              Configured for your 4-year-old girl and 3-year-old boy (ICMR-NIN 2024 Standards)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dietary Rules Reminder */}
        <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold">Diet Plan Preferences:</span> Non-vegetarian (Eggs, Chicken, Mutton, Fish, Prawns, Crab, and Seafood). Strictly <span className="font-semibold text-rose-700">NO beef or pork</span>. Balanced with daily green leaves, soaked pulses, nuts (almonds, cashews), and cow ghee.
          </div>
        </div>

        {/* Kid Profiles List */}
        <div className="mt-5 space-y-4">
          {localKids.map((kid, idx) => {
            const rda = ICMR_RDA_BY_AGE[kid.ageYears] || ICMR_RDA_BY_AGE[4];
            return (
              <div
                key={kid.id}
                className="p-4 rounded-xl border border-stone-200 bg-[#FAF8F5] transition-all hover:border-stone-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{kid.avatar}</span>
                    <input
                      type="text"
                      value={kid.name}
                      onChange={(e) => handleUpdate(kid.id, 'name', e.target.value)}
                      className="font-bold text-stone-900 text-sm bg-transparent border-b border-dashed border-stone-300 focus:border-amber-600 focus:outline-hidden py-0.5 px-1"
                    />
                    <span className="text-xs text-stone-600 font-medium">
                      ({kid.gender === 'girl' ? 'Daughter' : 'Son'})
                    </span>
                  </div>

                  {localKids.length > 1 && (
                    <button
                      onClick={() => handleRemoveKid(kid.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 transition-all"
                      title="Remove kid profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-600 text-[11px] font-semibold mb-1">
                      Age (Years)
                    </label>
                    <select
                      value={kid.ageYears}
                      onChange={(e) => handleUpdate(kid.id, 'ageYears', parseInt(e.target.value, 10))}
                      className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 font-semibold focus:outline-hidden focus:border-amber-600"
                    >
                      <option value={3}>3 Years (Toddler)</option>
                      <option value={4}>4 Years (Preschooler)</option>
                      <option value={5}>5 Years (Early School)</option>
                      <option value={6}>6 Years (School Child)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-600 text-[11px] font-semibold mb-1">
                      Gender
                    </label>
                    <select
                      value={kid.gender}
                      onChange={(e) => {
                        const val = e.target.value as 'girl' | 'boy';
                        handleUpdate(kid.id, 'gender', val);
                        handleUpdate(kid.id, 'avatar', val === 'girl' ? '👧' : '👦');
                      }}
                      className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 font-semibold focus:outline-hidden focus:border-amber-600"
                    >
                      <option value="girl">Girl 👧</option>
                      <option value="boy">Boy 👦</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-600 text-[11px] font-semibold mb-1">
                      Weight (Kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="10"
                      max="35"
                      value={kid.weightKg}
                      onChange={(e) => handleUpdate(kid.id, 'weightKg', parseFloat(e.target.value) || 14)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 font-semibold focus:outline-hidden focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 text-[11px] font-semibold mb-1">
                      Activity Level
                    </label>
                    <select
                      value={kid.activityLevel}
                      onChange={(e) => handleUpdate(kid.id, 'activityLevel', e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1.5 text-stone-800 font-semibold focus:outline-hidden focus:border-amber-600"
                    >
                      <option value="very_active">Active (High Play)</option>
                      <option value="moderate">Moderate</option>
                    </select>
                  </div>
                </div>

                {/* Instant ICMR-NIN RDA Benchmarks for this Age */}
                <div className="mt-3 pt-2.5 border-t border-stone-200/70 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-700">
                  <span className="font-semibold text-stone-800">ICMR Daily Target:</span>
                  <span className="bg-amber-100/60 text-amber-800 px-1.5 py-0.5 rounded-sm">
                    {rda.calories} kcal
                  </span>
                  <span className="bg-emerald-100/60 text-emerald-800 px-1.5 py-0.5 rounded-sm">
                    {rda.protein}g Protein
                  </span>
                  <span className="bg-sky-100/60 text-sky-800 px-1.5 py-0.5 rounded-sm">
                    {rda.calcium}mg Calcium
                  </span>
                  <span className="bg-rose-100/60 text-rose-800 px-1.5 py-0.5 rounded-sm">
                    {rda.iron}mg Iron
                  </span>
                  <span className="bg-purple-100/60 text-purple-800 px-1.5 py-0.5 rounded-sm">
                    {rda.dhaOmega3}mg DHA
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Child Option */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={handleAddKid}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 py-1 px-2 rounded-lg hover:bg-amber-50 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Another Child Profile
          </button>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-all"
          >
            Cancel
          </button>
          <button
            id="save-kids-profiles-btn"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-all active:scale-98"
          >
            Apply & Recalculate Nutrition
          </button>
        </div>
      </div>
    </div>
  );
};
