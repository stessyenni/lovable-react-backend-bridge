import ndoleFish from "@/assets/meals/ndole-fish.jpg";
import safou from "@/assets/meals/safou.jpg";
import okraSoup from "@/assets/meals/okra-soup.jpg";
import koki from "@/assets/meals/koki.jpg";
import plantainGroundnut from "@/assets/meals/plantain-groundnut.jpg";
import avocado from "@/assets/meals/avocado.jpg";
import bitterKola from "@/assets/meals/bitter-kola.jpg";
import eruStockfish from "@/assets/meals/eru-stockfish.jpg";
import fufuSoup from "@/assets/meals/fufu-soup.jpg";
import gardenEgg from "@/assets/meals/garden-egg.jpg";

export interface DietRecommendation {
  id: string;
  name: string;
  description: string;
  category: 'weight-loss' | 'weight-gain' | 'maintain' | 'health';
  type: 'food' | 'fruit' | 'vegetable' | 'delicacy';
  benefits: string[];
  preparation?: string;
  image: string;
  nutritionalInfo: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  isLocal: boolean;
}

export const cameroonRecommendations: DietRecommendation[] = [
  {
    id: "1",
    name: "Ndolé with Lean Fish and Egussi",
    description:
      "Traditional Cameroonian dish with bitter leaves, lean fish, and minimal palm oil",
    category: "weight-loss",
    type: "delicacy",
    image: ndoleFish,
    benefits: [
      "High protein",
      "Low calories",
      "Rich in vitamins",
      "Satisfying",
    ],
    preparation:
      "Steam fish, sauté bitter leaves with minimal oil, combine with vegetables",
    nutritionalInfo: {
      calories: 280,
      protein: "25g",
      carbs: "15g",
      fat: "12g",
      fiber: "8g",
    },
    isLocal: true,
  },
  {
    id: "2",
    name: "African Plum (Safou)",
    description: "Local fruit rich in healthy fats and fiber",
    category: "weight-loss",
    type: "fruit",
    image: safou,
    benefits: ["Healthy fats", "High fiber", "Natural appetite suppressant"],
    nutritionalInfo: {
      calories: 120,
      protein: "3g",
      carbs: "8g",
      fat: "9g",
      fiber: "5g",
    },
    isLocal: true,
  },
  {
    id: "3",
    name: "Okra Soup (Gombo)",
    description: "Light okra soup with minimal palm oil and lean protein",
    category: "weight-loss",
    type: "delicacy",
    image: okraSoup,
    benefits: ["Low calorie", "High fiber", "Aids digestion"],
    preparation: "Boil okra with lean meat/fish, season with local spices",
    nutritionalInfo: {
      calories: 180,
      protein: "15g",
      carbs: "12g",
      fat: "8g",
      fiber: "6g",
    },
    isLocal: true,
  },
  {
    id: "4",
    name: "Koki with Palm Oil",
    description: "High-calorie cowpea pudding with palm oil and spices",
    category: "weight-gain",
    type: "delicacy",
    image: koki,
    benefits: [
      "High calories",
      "Plant protein",
      "Healthy fats",
      "Energy dense",
    ],
    preparation: "Blend cowpeas, add palm oil, wrap in leaves and steam",
    nutritionalInfo: {
      calories: 450,
      protein: "18g",
      carbs: "35g",
      fat: "28g",
      fiber: "12g",
    },
    isLocal: true,
  },
  {
    id: "5",
    name: "Plantain with Groundnut Sauce",
    description: "Fried plantain with rich groundnut (peanut) sauce",
    category: "weight-gain",
    type: "delicacy",
    image: plantainGroundnut,
    benefits: ["High calories", "Healthy fats", "Complex carbs", "Protein"],
    preparation: "Fry ripe plantain, prepare groundnut sauce with palm oil",
    nutritionalInfo: {
      calories: 520,
      protein: "15g",
      carbs: "45g",
      fat: "32g",
      fiber: "8g",
    },
    isLocal: true,
  },
  {
    id: "6",
    name: "Avocado (Local Variety)",
    description:
      "Cameroonian avocados - larger and creamier than regular varieties",
    category: "weight-gain",
    type: "fruit",
    image: avocado,
    benefits: ["Healthy fats", "High calories", "Vitamins", "Minerals"],
    nutritionalInfo: {
      calories: 380,
      protein: "4g",
      carbs: "20g",
      fat: "35g",
      fiber: "15g",
    },
    isLocal: true,
  },
  {
    id: "7",
    name: "Bitter Kola",
    description: "Traditional medicinal nut with health benefits",
    category: "health",
    type: "food",
    image: bitterKola,
    benefits: ["Antioxidants", "Immune support", "Digestive health"],
    nutritionalInfo: {
      calories: 45,
      protein: "2g",
      carbs: "8g",
      fat: "1g",
      fiber: "3g",
    },
    isLocal: true,
  },
  {
    id: "8",
    name: "Eru with Stockfish",
    description: "Wild vegetable dish with stockfish - rich in nutrients",
    category: "health",
    type: "delicacy",
    image: eruStockfish,
    benefits: ["Iron rich", "Protein", "Vitamins", "Minerals"],
    preparation: "Steam eru leaves with stockfish, season with crayfish",
    nutritionalInfo: {
      calories: 220,
      protein: "20g",
      carbs: "10g",
      fat: "12g",
      fiber: "6g",
    },
    isLocal: true,
  },
  {
    id: "9",
    name: "Fufu with Light Vegetable Soup",
    description: "Moderate portions of cassava fufu with vegetable soup",
    category: "maintain",
    type: "delicacy",
    image: fufuSoup,
    benefits: ["Balanced nutrition", "Satisfying", "Cultural significance"],
    preparation: "Pound cassava/plantain, serve with light vegetable soup",
    nutritionalInfo: {
      calories: 350,
      protein: "12g",
      carbs: "55g",
      fat: "10g",
      fiber: "8g",
    },
    isLocal: true,
  },
  {
    id: "10",
    name: "Garden Egg with Groundnut Paste",
    description: "Local eggplant variety with protein-rich groundnut paste",
    category: "maintain",
    type: "vegetable",
    image: gardenEgg,
    benefits: ["Fiber", "Antioxidants", "Balanced nutrition"],
    nutritionalInfo: {
      calories: 180,
      protein: "8g",
      carbs: "15g",
      fat: "10g",
      fiber: "7g",
    },
    isLocal: true,
  },
];

export const quantitySuggestions: Record<string, string> = {
  'Ndolé with Lean Fish': '1 cup ndolé (~200g) + 1 small fufu ball (about 100g)',
  'African Plum (Safou)': '3–4 plums (medium size)',
  'Okra Soup (Gombo)': '1.5 cups soup (~300g) + 1 small fufu ball',
  'Koki with Palm Oil': '1 slice (~150g)',
  'Plantain with Groundnut Sauce': '1 medium plantain + 2 tbsp groundnut sauce',
  'Avocado (Local Variety)': '1/2 large avocado',
  'Bitter Kola': '1–2 nuts',
  'Eru with Stockfish': '1 cup eru (~200g) + small portion garri or fufu',
  'Fufu with Light Vegetable Soup': '1 small fufu ball + 1 cup soup',
  'Garden Egg with Groundnut Paste': '3 small garden eggs + 2 tbsp paste'
};
