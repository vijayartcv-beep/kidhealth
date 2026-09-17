export type MealSlot = 'breakfast' | 'midMorningSnack' | 'lunch' | 'eveningSnack' | 'dinner';

export interface NutritionBreakdown {
  calories: number; // kcal
  protein: number; // g
  carbs: number; // g
  fats: number; // g
  fiber: number; // g
  vitaminA: number; // mcg RAE (Eye & Immunity)
  vitaminC: number; // mg (Immunity & Iron absorption)
  vitaminD: number; // IU (Bone calcification)
  vitaminB12: number; // mcg (Brain, RBC formation)
  folate: number; // mcg (Cell growth)
  iron: number; // mg (Hemoglobin, energy, cognitive)
  calcium: number; // mg (Teeth & Bone development)
  zinc: number; // mg (Growth, appetite, healing)
  dhaOmega3: number; // mg (Brain wiring, eye health)
}

export type FoodCategory =
  | 'pulse'
  | 'green'
  | 'non-veg'
  | 'dairy'
  | 'cereal'
  | 'dry-fruit'
  | 'fruit'
  | 'veg';

export interface FoodItem {
  id: string;
  name: string;
  localName?: string; // Regional name (Hindi, Tamil, etc.)
  category: FoodCategory;
  portion: string;
  nutrition: NutritionBreakdown;
  vitaminsRichIn: string[];
  benefits: string[];
  kidPrepTip: string;
  isIndianMarketAvailable: boolean;
  marketNote?: string;
}

export interface DayMeals {
  breakfast: FoodItem[];
  midMorningSnack: FoodItem[];
  lunch: FoodItem[];
  eveningSnack: FoodItem[];
  dinner: FoodItem[];
}

export interface DayPlan {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  theme: string;
  highlightNutrient: string;
  meals: DayMeals;
}

export interface KidProfile {
  id: string;
  name: string;
  ageYears: number;
  gender: 'girl' | 'boy';
  weightKg: number;
  activityLevel: 'moderate' | 'very_active';
  avatar: string;
}

export interface RDAStandard {
  calories: number;
  protein: number;
  calcium: number;
  iron: number;
  zinc: number;
  vitaminA: number;
  vitaminC: number;
  vitaminD: number;
  vitaminB12: number;
  folate: number;
  dhaOmega3: number;
  fiber: number;
}

export interface GroceryItem {
  id: string;
  category: 'Pulses & Lentils' | 'Grains & Millets' | 'Nuts & Dry Fruits' | 'Non-Veg & Eggs' | 'Dairy & Fats' | 'Green Leaves & Fresh Produce' | 'Healthy Spices & Seeds';
  name: string;
  localName: string;
  monthlyQty: string;
  weeklyQty: string;
  keyNutrients: string[];
  whyForKids: string;
  storageTip: string;
  checked?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    itemToAdd?: FoodItem;
    mealSlot?: MealSlot;
  };
}
