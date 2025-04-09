import React from 'react';
import Recipe from '../interface/Recipe';
import RecipeCard from './RecipeCard.tsx';
import './RecipeComponent.css';

interface RecipesListProps {
  recipes: Recipe[];
  apiRecipesLoaded: boolean;
  addToGroceryList: (recipe: Recipe) => void;
}

const RecipesList: React.FC<RecipesListProps> = ({
  recipes,
  apiRecipesLoaded,
  addToGroceryList
}) => {
  return (
    <div className="recipes-column">
      <h3>{apiRecipesLoaded ? 'Custom Recipes' : 'Recommended Recipes'}</h3>
      <div className="recipes-grid">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              addToGroceryList={addToGroceryList}
            />
          ))
        ) : (
          <p className="no-results">Select ingredients and click "Find Recipes" to discover meals</p>
        )}
      </div>
    </div>
  );
};

export default RecipesList;