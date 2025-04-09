import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  updateGroceryList?: (ingredients: Ingredient[]) => void;
}

const RecipeComponent: React.FC<RecipeComponentProps> = ({
  marketData = {},
  apiKey = "34a7dac016c6479c9c30c16be772b3d8", // Use env variable in production
  updateGroceryList
}) => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'sale'>('sale');
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [apiRecipesLoaded, setApiRecipesLoaded] = useState<boolean>(false);

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

  // Hard-coded recipes with common ingredients
  const hardcodedRecipes: Recipe[] = [
    {
      id: "hc001",
      title: "Quick Chicken Stir Fry",
      img: "https://www.simplyrecipes.com/thmb/YSlSLYrnOBfHOGOYMnN8l_eUFzs=/2000x1125/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Chicken-Stir-Fry-LEAD-6-47b5da1a92b644be86918c528169f059.jpg",
      cost: 12.75,
      content: "1. Slice chicken into thin strips. 2. Chop vegetables. 3. Stir-fry chicken until cooked through. 4. Add vegetables and sauté. 5. Add sauce and toss to coat.",
      usedIngredients: [
        { name: "chicken breast", cost: 7.99 },
        { name: "onion", cost: 0.79 },
        { name: "garlic", cost: 0.49 },
        { name: "olive oil", cost: 0 },
      ],
      missedIngredients: ["bell pepper", "broccoli", "soy sauce", "ginger", "sesame oil"],
      apiIngredients: ["chicken breast", "onion", "garlic", "olive oil", "bell pepper", "broccoli", "soy sauce", "ginger", "sesame oil"],
      link: "https://www.simplyrecipes.com/recipes/quick_easy_chicken_stir_fry/"
    },
    {
      id: "hc002",
      title: "Classic Caesar Salad",
      img: "https://www.seriouseats.com/thmb/Fi_FEyVa3_-_uzfXiCZ0ShYwht8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2013__10__20131009-caesar-salad-how-17-66824dc8c0a8453293b0b8c74cdad20d.jpg",
      cost: 8.25,
      content: "1. Wash and tear romaine lettuce. 2. Make dressing with egg, garlic, anchovy paste, lemon juice, and olive oil. 3. Toast bread for croutons. 4. Toss lettuce with dressing and top with parmesan.",
      usedIngredients: [
        { name: "lettuce", cost: 2.49 },
        { name: "garlic", cost: 0.49 },
        { name: "lemon", cost: 0.79 },
        { name: "olive oil", cost: 0 },
        { name: "cheese", cost: 3.99 }
      ],
      missedIngredients: ["anchovy paste", "eggs", "crusty bread"],
      apiIngredients: ["romaine lettuce", "garlic", "lemon", "olive oil", "parmesan cheese", "anchovy paste", "eggs", "bread"],
      link: "https://www.seriouseats.com/the-best-caesar-salad-recipe"
    },
    {
      id: "hc003",
      title: "Mediterranean Cucumber Tomato Salad",
      img: "https://www.acouplecooks.com/wp-content/uploads/2021/07/Cucumber-Tomato-Onion-Salad-007.jpg",
      cost: 7.50,
      content: "1. Dice cucumber, tomato, and red onion. 2. Mix with olives and feta cheese. 3. Dress with olive oil, lemon juice, salt, and herbs.",
      usedIngredients: [
        { name: "cucumber", cost: 1.29 },
        { name: "tomato", cost: 1.99 },
        { name: "onion", cost: 0.79 },
        { name: "lemon", cost: 0.79 },
        { name: "olive oil", cost: 0 },
        { name: "cheese", cost: 3.99 }
      ],
      missedIngredients: ["kalamata olives", "fresh herbs"],
      apiIngredients: ["cucumber", "tomato", "red onion", "lemon", "olive oil", "feta cheese", "kalamata olives", "fresh herbs"],
      link: "https://www.acouplecooks.com/cucumber-tomato-onion-salad/"
    },
    {
      id: "hc004",
      title: "Simple Roast Chicken with Vegetables",
      img: "https://www.wellplated.com/wp-content/uploads/2020/12/Baked-Chicken-and-Vegetables-recipe.jpg",
      cost: 11.99,
      content: "1. Season chicken with herbs, salt, and pepper. 2. Arrange vegetables around chicken in roasting pan. 3. Drizzle with olive oil. 4. Roast at 425°F until chicken is cooked through and vegetables are tender.",
      usedIngredients: [
        { name: "chicken breast", cost: 7.99 },
        { name: "garlic", cost: 0.49 },
        { name: "onion", cost: 0.79 },
        { name: "olive oil", cost: 0 },
        { name: "lemon", cost: 0.79 },
        { name: "apple", cost: 1.99 }
      ],
      missedIngredients: ["potatoes", "carrots", "rosemary", "thyme"],
      apiIngredients: ["chicken breast", "garlic", "onion", "olive oil", "lemon", "apple", "potatoes", "carrots", "rosemary", "thyme"],
      link: "https://www.wellplated.com/roasted-chicken-and-vegetables/"
    }
  ];

  // Initialize with hard-coded recipes on component mount
  useEffect(() => {
    // Only set hard-coded recipes initially if no recipes are loaded yet
    if (recipes.length === 0) {
      setRecipes(hardcodedRecipes);
    }
  }, []);

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

  // Add missing ingredients to grocery list
  const addToGroceryList = (recipe: Recipe) => {
    // Extract ingredients that are needed but not in home ingredients
    const missingIngredients = recipe.missedIngredients.filter(ingName =>
      !homeIngredients.some(homeIng => homeIng.toLowerCase() === ingName.toLowerCase())
    );

    // Convert to Ingredient objects with costs if available from market
    const missingIngredientsFormatted = missingIngredients.map(ingName => {
      const marketItem = marketItems.find(item =>
        item.name.includes(ingName.toLowerCase()) ||
        ingName.toLowerCase().includes(item.name)
      );

      return {
        name: ingName.toLowerCase(),
        cost: marketItem ? marketItem.price : 0
      };
    });

    // If we have a callback to update the grocery list, use it
    if (updateGroceryList) {
      updateGroceryList(missingIngredientsFormatted);
    }

    // Navigate to the grocery list page
    navigate('/grocery', {
      state: {
        ingredients: missingIngredientsFormatted,
        recipeName: recipe.title
      }
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

  // Reset to default recommended recipes
  const resetToHardcodedRecipes = () => {
    setApiRecipesLoaded(false);
    setRecipes(hardcodedRecipes);
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
        // If no API recipes found, just show hard-coded recipes
        setRecipes(hardcodedRecipes);
        setApiRecipesLoaded(false);
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
          apiIngredients: details.apiIngredients,
          link: `https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}`
        };
      }));

      // Filter out recipes that don't use any of the selected ingredients
      const filteredApiRecipes = newRecipes.filter(recipe => recipe.usedIngredients.length > 0);

      // Generate a relevance score for hard-coded recipes based on matching ingredients
      const relevantHardcodedRecipes = hardcodedRecipes.map(recipe => {
        // Count how many selected ingredients are used in this recipe
        const matchCount = selectedIngredients.reduce((count, selIng) => {
          const isUsed = recipe.apiIngredients.some(apiIng =>
            apiIng.includes(selIng.name) || selIng.name.includes(apiIng)
          );
          return isUsed ? count + 1 : count;
        }, 0);

        // If at least one ingredient matches, include this recipe
        return { ...recipe, relevance: matchCount };
      }).filter(recipe => recipe.relevance > 0);

      // Combine API recipes with relevant hard-coded recipes
      const combinedRecipes = [...filteredApiRecipes];

      // Only add hard-coded recipes if there are fewer than 4 API recipes or if the user has no recipes
      if (filteredApiRecipes.length === 0) {
        // Show all hard-coded recipes if no API results
        combinedRecipes.push(...hardcodedRecipes);
      } else if (filteredApiRecipes.length < 4) {
        // Add most relevant hard-coded recipes to fill the grid
        const neededCount = 4 - filteredApiRecipes.length;
        const sortedHardcodedRecipes = relevantHardcodedRecipes
          .sort((a, b) => b.relevance - a.relevance)
          .slice(0, neededCount);
        combinedRecipes.push(...sortedHardcodedRecipes);
      }

      if (combinedRecipes.length === 0) {
        setError("No recipes found that use your selected ingredients.");
        // Fallback to hard-coded recipes
        setRecipes(hardcodedRecipes);
        setApiRecipesLoaded(false);
      } else {
        setRecipes(combinedRecipes);
        setApiRecipesLoaded(true);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError(`Error retrieving recipes: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Show hard-coded recipes as fallback
      setRecipes(hardcodedRecipes);
      setApiRecipesLoaded(false);
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

        {/* Column 3: Recipes - Now displaying in a 2x2 grid */}
        <div className="recipes-column">
          <h3>{apiRecipesLoaded ? 'Custom Recipes' : 'Recommended Recipes'}</h3>
          <div className="recipes-grid">
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
                  </div>
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