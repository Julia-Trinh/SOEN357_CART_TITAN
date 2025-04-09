import Ingredient from "./Ingredient";
interface Recipe {
  id: string;
  title: string;
  img: string;
  cost: number;
  content: string;
  usedIngredients: Ingredient[];
  missedIngredients: string[];
  apiIngredients: string[];
  link?: string;
  relevance?: number;
  allergens?: string[];  // Added for filtering by allergies
  diet?: string[];       // Added for filtering by dietary preferences
}
  export default Recipe;