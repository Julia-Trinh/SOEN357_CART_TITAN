import React, { useState, useEffect } from 'react';
import Ingredient from '../interface/Ingredient';
import Recipe from '../interface/Recipe';
import './RecipeComponent.css';

interface MarketItem {
  name: string;
  price: number;
  onSale: boolean;
}

interface RecipeComponentProps {
  marketData?: Record<string, number>;
  apiKey?: string;
}

const RecipeComponent: React.FC<RecipeComponentProps> = ({
  marketData = {},
  apiKey = "34a7dac016c6479c9c30c16be772b3d8" // Use env variable in production
}) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'sale'>('sale');
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [debugMode, setDebugMode] = useState<boolean>(false);

  // Home ingredients list
  const homeIngredients = [
    'Apple',
    'Lemon',
    'Lettuce',
    'Tomato',
    'Cucumber',
    'Chicken Breast',
    'Garlic',
    'Onion',
    'Olive Oil',
    'Cheese'
  ];

  // Convert home ingredients to the proper format
  const homeIngredientsFormatted = homeIngredients.map(name => ({
    name: name.toLowerCase(),
    cost: 0 // We don't know the cost of home ingredients
  }));

  // Process market data into a more usable format
  useEffect(() => {
    if (Object.keys(marketData).length > 0) {
      const processedItems = Object.entries(marketData as Record<string, number>).map(([name, price]) => {
        // Now TypeScript knows price is a number because Record<string, number> was specified
        const onSale = price < 5.00;
        return { name: normalizeItemName(name), price, onSale };
      });

      setMarketItems(processedItems);
    }
  }, [marketData]);

  // Normalize item names for better matching with recipe ingredients
  const normalizeItemName = (name: string): string => {
    // Remove price information and common prefixes
    let normalizedName = name.replace(/\$\d+\.\d+|\d+\.\d+\$/, '').trim();

    // Remove store-specific prefixes
    normalizedName = normalizedName.replace(/^(S |EST |COMPLIMENTS |MARCANGELO |MAPLE LEAF )/, '');

    // Convert to lowercase for consistent matching
    return normalizedName.toLowerCase();
  };

  // Convert market items to ingredients that can be used in recipes
  const convertToIngredients = (items: MarketItem[]): Ingredient[] => {
    return items.map(item => ({
      name: item.name,
      cost: item.price
    }));
  };

  // Filter ingredients based on user selection
  const filterIngredients = () => {
    let filteredItems;

    if (selectedFilter === 'sale') {
      filteredItems = marketItems.filter(item => item.onSale);
    } else {
      filteredItems = [...marketItems];
    }

    // Convert to ingredients format
    setIngredients(convertToIngredients(filteredItems));
  };

  // When filter changes or market items update, refresh ingredients
  useEffect(() => {
    filterIngredients();
  }, [selectedFilter, marketItems]);

  // Format ingredients for API call
  const formatIngredients = (ingredients: Ingredient[]): string => {
    return ingredients.map(ing => ing.name).join(",+");
  };

  // Calculate total cost based on used ingredients
  const calculateTotalCost = (usedIngredients: Ingredient[]): number => {
    return usedIngredients.reduce((sum, ing) => sum + ing.cost, 0);
  };

  // Handle clicking on an ingredient to select/deselect it
  const handleIngredientClick = (ingredient: Ingredient) => {
    setSelectedIngredients(prev => {
      // If ingredient is already selected, remove it
      const isSelected = prev.some(item => item.name === ingredient.name);
      if (isSelected) {
        return prev.filter(item => item.name !== ingredient.name);
      }
      // Otherwise add it to selected ingredients
      return [...prev, ingredient];
    });
  };

  // Find ingredient from selected ingredients that matches the API ingredient name
  const findMatchingSelectedIngredient = (apiIngName: string): Ingredient | undefined => {
    // First try to find exact matches
    const exactMatch = selectedIngredients.find(ing =>
      ing.name === apiIngName.toLowerCase() ||
      apiIngName.toLowerCase() === ing.name
    );

    if (exactMatch) return exactMatch;

    // Then try to find ingredients that contain each other
    return selectedIngredients.find(ing =>
      ing.name.includes(apiIngName.toLowerCase()) ||
      apiIngName.toLowerCase().includes(ing.name)
    );
  };

  // Get detailed information about a recipe
  const getRecipeDetails = async (recipeId: string): Promise<{usedIngredients: Ingredient[], instructions: string, apiIngredients: string[]}> => {
    const urlRecipe = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

    try {
      const response = await fetch(urlRecipe);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      // Get all ingredients from the API
      const apiIngredients = data.extendedIngredients.map((ingredient: any) =>
        ingredient.name.toLowerCase()
      );

      // Find which of our selected ingredients match the recipe ingredients
      const matchedIngredients: Ingredient[] = [];

      // For each API ingredient, try to find a match in our selected ingredients
      apiIngredients.forEach((apiIngName: string) => {
        const match = findMatchingSelectedIngredient(apiIngName);
        if (match && !matchedIngredients.some(ing => ing.name === match.name)) {
          matchedIngredients.push(match);
        }
      });

      return {
        usedIngredients: matchedIngredients,
        instructions: data.instructions || "No instructions available",
        apiIngredients
      };
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      return { usedIngredients: [], instructions: "", apiIngredients: [] };
    }
  };

  // Fetch recipes from API
  const fetchRecipes = async () => {
    setError(null);
    setLoading(true);

    if (selectedIngredients.length === 0) {
      setError("Please select at least one ingredient.");
      setLoading(false);
      return;
    }

    const formattedIngredients = formatIngredients(selectedIngredients);
    const ranking = 2; // Option 2 maximizes used ingredients
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${formattedIngredients}&number=4&ranking=${ranking}&apiKey=${apiKey}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        setError("No recipes found with selected ingredients.");
        setLoading(false);
        return;
      }

      const newRecipes = await Promise.all(data.map(async (recipe: any) => {
        const details = await getRecipeDetails(recipe.id.toString());

        // Only include recipes that actually use at least one of our selected ingredients
        if (details.usedIngredients.length === 0) {
          if (debugMode) {
            console.log(`Recipe ${recipe.title} doesn't use any selected ingredients`);
            console.log('API ingredients:', details.apiIngredients);
            console.log('Selected ingredients:', selectedIngredients.map(ing => ing.name));
          }
        }

        return {
          id: recipe.id,
          title: recipe.title,
          img: recipe.image,
          cost: calculateTotalCost(details.usedIngredients),
          content: details.instructions,
          usedIngredients: details.usedIngredients,
          missedIngredients: recipe.missedIngredients.map((ingredient: any) => ingredient.name),
          apiIngredients: details.apiIngredients
        };
      }));

      // Filter out recipes that don't use any of the selected ingredients
      const filteredRecipes = newRecipes.filter(recipe => recipe.usedIngredients.length > 0);

      if (filteredRecipes.length === 0) {
        setError("No recipes found that use your selected ingredients.");
      } else {
        setRecipes(filteredRecipes);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError(`Error retrieving recipes: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  // Check if an ingredient is selected
  const isIngredientSelected = (ingredient: Ingredient): boolean => {
    return selectedIngredients.some(item => item.name === ingredient.name);
  };

  return (
    <div className="recipe-container">
      <h1>Weekly Special Recipes</h1>

      <div className="filters">
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'sale')}
          className="filter-select"
        >
          <option value="sale">On Sale Items</option>
          <option value="all">All Items</option>
        </select>

        <button
          onClick={fetchRecipes}
          className="recipe-button"
          disabled={loading || selectedIngredients.length === 0}
        >
          {loading ? 'Searching...' : 'Find Recipes'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {/* Main grid layout */}
      <div className="main-grid">
        {/* Ingredient Columns Container */}
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
              {homeIngredientsFormatted.map((ingredient, index) => (
                <div
                  key={index}
                  className={`ingredient-item ${isIngredientSelected(ingredient) ? 'selected' : ''}`}
                  onClick={() => handleIngredientClick(ingredient)}
                >
                  <span className="ingredient-icon">🥕</span>
                  <span className="ingredient-name">{ingredient.name}</span>
                </div>
              ))}
            </div>
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

        {/* Column 3: Recipes */}
        <div className="recipes-column">
          <h3>Recipes</h3>
          <div className="recipes-list">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div key={recipe.id} className="recipe-card">
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

                  <button
                    className="view-details-button"
                    onClick={() => window.open(`https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}`, '_blank')}
                  >
                    View Full Recipe
                  </button>
                </div>
              ))
            ) : (
              <p className="no-results">Select ingredients and click "Find Recipes" to discover meals</p>
            )}
          </div>
        </div>
      </div>

      <footer className="recipe-footer">
        <p>Prices updated weekly. Recipes powered by Spoonacular API.</p>
      </footer>
    </div>
  );
};

export default RecipeComponent;