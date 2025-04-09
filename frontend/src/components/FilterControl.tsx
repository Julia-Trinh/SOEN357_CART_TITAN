import React from 'react';
import './RecipeComponent.css';

// Add common allergies and dietary preferences
const commonAllergies = [
  'None',
  'Dairy',
  'Eggs',
  'Peanuts',
  'Soy'
];

const dietaryChoices = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten Free'
];

interface FilterControlsProps {
  selectedFilter: 'all' | 'sale';
  setSelectedFilter: (filter: 'all' | 'sale') => void;
  selectedAllergy: string;
  setSelectedAllergy: (allergy: string) => void;
  selectedDiet: string;
  setSelectedDiet: (diet: string) => void;
  fetchRecipes: () => void;
  loading: boolean;
  apiRecipesLoaded: boolean;
  resetToHardcodedRecipes: () => void;
  selectedIngredientsCount: number;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  selectedFilter,
  setSelectedFilter,
  selectedAllergy,
  setSelectedAllergy,
  selectedDiet,
  setSelectedDiet,
  fetchRecipes,
  loading,
  apiRecipesLoaded,
  resetToHardcodedRecipes,
  selectedIngredientsCount
}) => {
  return (
    <div className="filters">
        <div className="filter-group">
    <label>Item Options:  </label>
    <select
      value={selectedFilter}
      onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'sale')}
      className="filter-select"
    >
      <option value="sale">On Sale Items</option>
      <option value="all">All Items</option>
    </select>
  </div>

  {/* Allergies label */}
  <div className="filter-group">
    <label>Allergies:  </label>
    <select
      value={selectedAllergy}
      onChange={(e) => setSelectedAllergy(e.target.value)}
      className="filter-select"
    >
      {commonAllergies.map(allergy => (
        <option key={allergy} value={allergy}>{allergy}</option>
      ))}
    </select>
  </div>

  {/* Dietary preferences label */}
  <div className="filter-group">
    <label>Dietary Preferences:  </label>
    <select
      value={selectedDiet}
      onChange={(e) => setSelectedDiet(e.target.value)}
      className="filter-select"
    >
      {dietaryChoices.map(diet => (
        <option key={diet} value={diet}>{diet}</option>
      ))}
    </select>
       </div>


      <button
        onClick={fetchRecipes}
        className="recipe-button"
        disabled={loading || selectedIngredientsCount === 0}
      >
        {loading ? 'Searching...' : 'Find Recipes'}
      </button>

      {/* Toggle between API and recommended recipes */}
      {apiRecipesLoaded && (
        <button
          className="recipe-button secondary"
          onClick={resetToHardcodedRecipes}
        >
          Show Recommended Recipes
        </button>
      )}
    </div>
  );
};

export default FilterControls;