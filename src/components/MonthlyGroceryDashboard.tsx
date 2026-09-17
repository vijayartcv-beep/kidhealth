import React, { useState } from 'react';
import { GroceryItem } from '../types';
import { MONTHLY_GROCERY_LIST } from '../data/nutritionData';
import { ShoppingCart, Check, Copy, Printer, CheckCircle2, ShieldCheck, Sparkles, Filter, ChevronDown, ChevronUp } from 'lucide-react';

export const MonthlyGroceryDashboard: React.FC = () => {
  const [items, setItems] = useState<GroceryItem[]>(MONTHLY_GROCERY_LIST);
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copied, setCopied] = useState<boolean>(false);
  const [expandedStorageId, setExpandedStorageId] = useState<string | null>(null);

  const categories = [
    'All',
    'Pulses & Lentils',
    'Grains & Millets',
    'Nuts & Dry Fruits',
    'Non-Veg & Eggs',
    'Dairy & Fats',
    'Green Leaves & Fresh Produce',
    'Healthy Spices & Seeds',
  ];

  const handleToggleCheck = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it))
    );
  };

  const handleCopyWhatsApp = () => {
    let text = `🛒 *NourishKids - 30-Day Indian Kids Grocery List*\n`;
    text += `Family: 4yo Girl & 3yo Boy (Non-Veg, No Beef/Pork)\n`;
    text += `--------------------------------------------------\n\n`;

    const groups: Record<string, GroceryItem[]> = {};
    items.forEach((it) => {
      if (!groups[it.category]) groups[it.category] = [];
      groups[it.category].push(it);
    });

    Object.entries(groups).forEach(([cat, catItems]) => {
      text += `📦 *${cat.toUpperCase()}*:\n`;
      catItems.forEach((it) => {
        const qty = viewMode === 'monthly' ? it.monthlyQty : it.weeklyQty;
        text += `• ${it.name} (${it.localName}): *${qty}*\n`;
      });
      text += `\n`;
    });

    text += `🌱 *Storage Note*: Sun-dry pulses, keep nuts refrigerated, freeze fish/meat in weekly portions.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter((it) => it.category === selectedCategory);

  const checkedCount = items.filter((it) => it.checked).length;
  const totalCount = items.length;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="p-5 sm:p-6 bg-white rounded-2xl border border-stone-200/90 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="cart">🛍️</span>
              <h2 className="text-xl font-bold font-['Playfair_Display',serif] text-stone-900">
                1-Month Indian Grocery & Provision List
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Tailored specifically for feeding your 4-year-old and 3-year-old for 30 days. Includes accurate quantities of pulses, local grains, nuts, seafood, eggs, greens, and pure cow ghee.
            </p>
          </div>

          {/* Controls: Monthly/Weekly toggle & WhatsApp Copy */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Monthly / Weekly toggle */}
            <div className="bg-[#FAF8F5] p-1 rounded-xl border border-stone-200 flex items-center text-xs font-bold">
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'monthly'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                30-Day Monthly
              </button>
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'weekly'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                7-Day Weekly
              </button>
            </div>

            <button
              id="copy-whatsapp-btn"
              onClick={handleCopyWhatsApp}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-2xs transition-all active:scale-98"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied WhatsApp List!' : 'Share / Copy List'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>

        {/* Shopping Progress Bar */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">
              Purchased: {checkedCount} of {totalCount} items
            </span>
            <span className="text-stone-400">({Math.round((checkedCount / totalCount) * 100)}%)</span>
          </div>
          <div className="w-36 h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${(checkedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const qty = viewMode === 'monthly' ? item.monthlyQty : item.weeklyQty;
          const isExpanded = expandedStorageId === item.id;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.checked
                  ? 'bg-emerald-50/40 border-emerald-200 opacity-75'
                  : 'bg-white border-stone-200 hover:border-amber-300 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={!!item.checked}
                    onChange={() => handleToggleCheck(item.id)}
                    className="mt-1 w-4 h-4 rounded-sm text-emerald-600 focus:ring-emerald-500 border-stone-300 cursor-pointer"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      {item.category}
                    </span>
                    <h4
                      className={`text-sm font-bold text-stone-900 leading-snug ${
                        item.checked ? 'line-through text-stone-400' : ''
                      }`}
                    >
                      {item.name}
                    </h4>
                    <p className="text-xs text-amber-800 font-semibold mt-0.5">
                      {item.localName}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-extrabold text-stone-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                    {qty}
                  </div>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    for 2 kids
                  </span>
                </div>
              </div>

              {/* Nutrients Provided */}
              <div className="mt-3 flex flex-wrap gap-1">
                {item.keyNutrients.map((n, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-stone-100 text-stone-700 font-medium px-1.5 py-0.5 rounded-sm"
                  >
                    {n}
                  </span>
                ))}
              </div>

              {/* Why needed for kids */}
              <p className="mt-2.5 text-[11px] text-stone-600 leading-relaxed">
                <strong className="text-stone-800">Child Benefit:</strong> {item.whyForKids}
              </p>

              {/* Storage Tip Drawer */}
              <div className="mt-3 pt-2 border-t border-stone-100">
                <button
                  onClick={() => setExpandedStorageId(isExpanded ? null : item.id)}
                  className="flex items-center justify-between w-full text-[11px] font-semibold text-stone-500 hover:text-stone-800"
                >
                  <span>Indian Climate Storage Tip</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {isExpanded && (
                  <div className="mt-1.5 p-2 bg-stone-50 rounded-lg text-[11px] text-stone-700 leading-relaxed border border-stone-200/60 animate-in fade-in">
                    {item.storageTip}
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
