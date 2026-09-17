import { FoodItem, DayMeals, NutritionBreakdown, RDAStandard, KidProfile } from '../types';
import { ICMR_RDA_BY_AGE } from '../data/nutritionData';

export function calculateMealsNutrition(meals: DayMeals): NutritionBreakdown {
  const totals: NutritionBreakdown = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    vitaminA: 0,
    vitaminC: 0,
    vitaminD: 0,
    vitaminB12: 0,
    folate: 0,
    iron: 0,
    calcium: 0,
    zinc: 0,
    dhaOmega3: 0,
  };

  const allItems: FoodItem[] = [
    ...meals.breakfast,
    ...meals.midMorningSnack,
    ...meals.lunch,
    ...meals.eveningSnack,
    ...meals.dinner,
  ];

  for (const item of allItems) {
    totals.calories += item.nutrition.calories;
    totals.protein += item.nutrition.protein;
    totals.carbs += item.nutrition.carbs;
    totals.fats += item.nutrition.fats;
    totals.fiber += item.nutrition.fiber;
    totals.vitaminA += item.nutrition.vitaminA;
    totals.vitaminC += item.nutrition.vitaminC;
    totals.vitaminD += item.nutrition.vitaminD;
    totals.vitaminB12 += item.nutrition.vitaminB12;
    totals.folate += item.nutrition.folate;
    totals.iron += item.nutrition.iron;
    totals.calcium += item.nutrition.calcium;
    totals.zinc += item.nutrition.zinc;
    totals.dhaOmega3 += item.nutrition.dhaOmega3;
  }

  // Round values cleanly
  return {
    calories: Math.round(totals.calories),
    protein: Number(totals.protein.toFixed(1)),
    carbs: Math.round(totals.carbs),
    fats: Number(totals.fats.toFixed(1)),
    fiber: Number(totals.fiber.toFixed(1)),
    vitaminA: Math.round(totals.vitaminA),
    vitaminC: Math.round(totals.vitaminC),
    vitaminD: Math.round(totals.vitaminD),
    vitaminB12: Number(totals.vitaminB12.toFixed(2)),
    folate: Math.round(totals.folate),
    iron: Number(totals.iron.toFixed(1)),
    calcium: Math.round(totals.calcium),
    zinc: Number(totals.zinc.toFixed(1)),
    dhaOmega3: Math.round(totals.dhaOmega3),
  };
}

export function getCombinedRDA(kids: KidProfile[]): RDAStandard {
  if (!kids || kids.length === 0) {
    return ICMR_RDA_BY_AGE[4];
  }

  // Compute average or reference RDA standard across active kids
  const rdas = kids.map(k => ICMR_RDA_BY_AGE[k.ageYears] || ICMR_RDA_BY_AGE[4]);

  const count = rdas.length;
  return {
    calories: Math.round(rdas.reduce((acc, r) => acc + r.calories, 0) / count),
    protein: Number((rdas.reduce((acc, r) => acc + r.protein, 0) / count).toFixed(1)),
    calcium: Math.round(rdas.reduce((acc, r) => acc + r.calcium, 0) / count),
    iron: Number((rdas.reduce((acc, r) => acc + r.iron, 0) / count).toFixed(1)),
    zinc: Number((rdas.reduce((acc, r) => acc + r.zinc, 0) / count).toFixed(1)),
    vitaminA: Math.round(rdas.reduce((acc, r) => acc + r.vitaminA, 0) / count),
    vitaminC: Math.round(rdas.reduce((acc, r) => acc + r.vitaminC, 0) / count),
    vitaminD: Math.round(rdas.reduce((acc, r) => acc + r.vitaminD, 0) / count),
    vitaminB12: Number((rdas.reduce((acc, r) => acc + r.vitaminB12, 0) / count).toFixed(2)),
    folate: Math.round(rdas.reduce((acc, r) => acc + r.folate, 0) / count),
    dhaOmega3: Math.round(rdas.reduce((acc, r) => acc + r.dhaOmega3, 0) / count),
    fiber: Number((rdas.reduce((acc, r) => acc + r.fiber, 0) / count).toFixed(1)),
  };
}

export interface NutrientComparison {
  key: keyof RDAStandard;
  label: string;
  unit: string;
  actual: number;
  target: number;
  percent: number;
  status: 'optimal' | 'good' | 'low';
  category: 'Vitamins' | 'Minerals & Brain' | 'Macronutrients';
  functionInBody: string;
  topSourcesInPlan: string[];
}

export function compareNutritionToRDA(
  actual: NutritionBreakdown,
  target: RDAStandard,
  meals: DayMeals
): NutrientComparison[] {
  const allItems: FoodItem[] = [
    ...meals.breakfast,
    ...meals.midMorningSnack,
    ...meals.lunch,
    ...meals.eveningSnack,
    ...meals.dinner,
  ];

  const getTopSources = (nutrientKey: keyof NutritionBreakdown): string[] => {
    return [...allItems]
      .sort((a, b) => b.nutrition[nutrientKey] - a.nutrition[nutrientKey])
      .filter(item => item.nutrition[nutrientKey] > 0)
      .slice(0, 3)
      .map(item => `${item.name}`);
  };

  const list: {
    key: keyof RDAStandard;
    label: string;
    unit: string;
    category: 'Vitamins' | 'Minerals & Brain' | 'Macronutrients';
    functionInBody: string;
  }[] = [
    { key: 'protein', label: 'Protein (Growth & Muscle)', unit: 'g', category: 'Macronutrients', functionInBody: 'Linear height growth, tissue repair, and enzyme synthesis' },
    { key: 'calories', label: 'Energy (Calories)', unit: 'kcal', category: 'Macronutrients', functionInBody: 'Fuels daily playful running, brain cognition, and baseline metabolism' },
    { key: 'fiber', label: 'Dietary Fiber', unit: 'g', category: 'Macronutrients', functionInBody: 'Prevents constipation, fosters diverse beneficial gut microbiome' },
    { key: 'calcium', label: 'Calcium (Teeth & Bones)', unit: 'mg', category: 'Minerals & Brain', functionInBody: 'Dense bone matrix calcification and permanent tooth buds' },
    { key: 'iron', label: 'Iron (Hemoglobin & Energy)', unit: 'mg', category: 'Minerals & Brain', functionInBody: 'Carries oxygen to brain neurons, prevents toddler anemia and irritability' },
    { key: 'zinc', label: 'Zinc (Immunity & Appetite)', unit: 'mg', category: 'Minerals & Brain', functionInBody: 'Thymus gland defense, fighting nursery daycare bugs, and appetite regulation' },
    { key: 'dhaOmega3', label: 'DHA & Omega-3 (Brain Wiring)', unit: 'mg', category: 'Minerals & Brain', functionInBody: 'Synaptogenesis, visual acuity in retina, and cognitive concentration' },
    { key: 'vitaminA', label: 'Vitamin A (Vision & Epithelium)', unit: 'mcg', category: 'Vitamins', functionInBody: 'Corneal integrity, night vision adaptation, and respiratory mucosal barrier' },
    { key: 'vitaminC', label: 'Vitamin C (Immunity & Iron Uptake)', unit: 'mg', category: 'Vitamins', functionInBody: 'Multiplies plant iron absorption by 300%, collagen formation for gums' },
    { key: 'vitaminD', label: 'Vitamin D3 (Sun Vitamin)', unit: 'IU', category: 'Vitamins', functionInBody: 'Enables intestine to absorb calcium and prevents childhood rickets' },
    { key: 'vitaminB12', label: 'Vitamin B12 (Nerve & RBC)', unit: 'mcg', category: 'Vitamins', functionInBody: 'Myelin sheath maintenance around nerves and red cell maturation' },
    { key: 'folate', label: 'Folate / Vitamin B9', unit: 'mcg', category: 'Vitamins', functionInBody: 'Rapid cellular replication during growth spurts and DNA synthesis' },
  ];

  return list.map(item => {
    const actVal = actual[item.key as keyof NutritionBreakdown];
    const tgtVal = target[item.key];
    const percent = Math.min(Math.round((actVal / (tgtVal || 1)) * 100), 250);

    let status: 'optimal' | 'good' | 'low' = 'low';
    if (percent >= 100) {
      status = 'optimal';
    } else if (percent >= 70) {
      status = 'good';
    }

    return {
      key: item.key,
      label: item.label,
      unit: item.unit,
      actual: actVal,
      target: tgtVal,
      percent,
      status,
      category: item.category,
      functionInBody: item.functionInBody,
      topSourcesInPlan: getTopSources(item.key as keyof NutritionBreakdown),
    };
  });
}
