import React from 'react';
import Ingredient from '../interface/Ingredient';
import './RecipeComponent.css';

interface IngredientsPanelProps {
  ingredients: Ingredient[];
  homeIngredients: Ingredient[];
  selectedIngredients: Ingredient[];
  handleIngredientClick: (ingredient: Ingredient) => void;
  isIngredientSelected: (ingredient: Ingredient) => boolean;
}

const IngredientsPanel: React.FC<IngredientsPanelProps> = ({
  ingredients,
  homeIngredients,
  selectedIngredients,
  handleIngredientClick,
  isIngredientSelected
}) => {
  return (
    <div className="ingredients-container">
      {/* Column 1: Market Ingredients */}
      <div className="ingredient-column market-column">
        <h3>Market Ingredients ({ingredients.length})</h3>
        <div className="ingredient-list">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className={`ingredient-item ${isIngredientSelected(ingredient) ? 'selected' : ''}`}
              onClick={() => handleIngredientClick(ingredient)}
            >
              <span className="ingredient-icon">🥕</span>
              <span className="ingredient-name">{ingredient.name} - ${ingredient.cost.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Column 2: Home Ingredients */}
      <div className="ingredient-column home-column">
        <h3>Home Ingredients ({homeIngredients.length})</h3>
        <div className="ingredient-list">
          {homeIngredients.map((ingredient, index) => (
            <div
              key={index}
              className={`ingredient-item ${isIngredientSelected(ingredient) ? 'selected' : ''}`}
              onClick={() => handleIngredientClick(ingredient)}
            >
              <span className="ingredient-icon">🥕</span>
              <span className="ingredient-name">{ingredient.name}</span>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent clicking from triggering ingredient click

                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
              <button
                className="add-button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent clicking from triggering ingredient click

                }}
              >
                Add an Ingredient
              </button>
      </div>

      {/* Selected Ingredients - Spans both columns */}
      <div className="selected-ingredients-container">
        <h3>Selected Ingredients ({selectedIngredients.length})</h3>
        <div className="selected-ingredients-list">
          {selectedIngredients.length > 0 ? (
            selectedIngredients.map((ingredient, index) => (
              <div
                key={index}
                className="selected-ingredient"
                onClick={() => handleIngredientClick(ingredient)}
              >
                {ingredient.name}
                {ingredient.cost > 0 && ` - $${ingredient.cost.toFixed(2)}`}
              </div>
            ))
          ) : (
            <p>No ingredients selected yet. Click on ingredients to select them.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientsPanel;