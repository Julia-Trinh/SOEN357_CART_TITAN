import Ingredient from "./Ingredient";
interface Recipe{
    id : string;
    content : string;
    title : string;
    img : string;
    cost : number;
    usedIngredients : Ingredient[];
    missedIngredients : string[];
  }

  export default Recipe;