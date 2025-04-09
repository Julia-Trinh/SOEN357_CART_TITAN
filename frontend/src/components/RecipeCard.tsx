import React from 'react';
import Recipe from '../interface/Recipe';
import './RecipeComponent.css';

interface RecipeCardProps {
  recipe: Recipe;
  addToGroceryList: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, addToGroceryList }) => {
  return (
    <div className="recipe-card">
      <h3>{recipe.title}</h3>
      <img src={recipe.img} alt={recipe.title} />
      <h3 className="recipe-cost">${recipe.cost.toFixed(2)}</h3>

      <div className="used-ingredients">
        <h4>Selected Items Used:</h4>
        <div className="ingredient-tags">
          {recipe.usedIngredients.map((ingredient, index) => (
            <div key={index} className="ing">
              <p>{ingredient.name}{ingredient.cost > 0 ? ` - $${ingredient.cost.toFixed(2)}` : ''}</p>
            </div>
          ))}
          {recipe.usedIngredients.length === 0 && <p>No selected items used</p>}
        </div>
      </div>

      {/* Display dietary info if available */}
      {(recipe.diet && recipe.diet.length > 0) && (
        <div className="dietary-info">
          <span className="diet-tag">
      Dietary Preference: {recipe.diet.join(', ')}
    </span>
  </div>
)}

      <div className="recipe-buttons">
        <button
          className="view-details-button"
          onClick={() => window.open(recipe.link || `https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}`, '_blank')}
        >
          View Full Recipe
        </button>

        <button
          className="add-to-grocery-button"
          onClick={() => addToGroceryList(recipe)}
        >
          Add to Grocery List
        </button>
        <button className="bookmark-button">
           Bookmark
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;