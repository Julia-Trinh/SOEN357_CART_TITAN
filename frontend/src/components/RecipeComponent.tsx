import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Ingredient from '../interface/Ingredient';
import Recipe from '../interface/Recipe';
import IngredientsPanel from './IngredientsPanel.tsx';
import RecipesList from './RecipeList.tsx';
import FilterControls from './FilterControl.tsx';
import { hardcodedRecipes } from './hardcodedRecipes.ts';
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
  apiKey = "c8124f08aac54de3a9baaf9fed43b4b9", // Use env variable in production
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
  const [apiRecipesLoaded, setApiRecipesLoaded] = useState<boolean>(false);
  const [selectedAllergy, setSelectedAllergy] = useState<string>('None');
  const [selectedDiet, setSelectedDiet] = useState<string>('None');

  // Home ingredients list
  const homeIngredients = [
    'Apple', 'Lemon', 'Lettuce', 'Tomato', 'Cucumber',
    'Chicken Breast', 'Garlic', 'Onion', 'Olive Oil', 'Cheese'
  ];

  // Initialize with hard-coded recipes on component mount
  useEffect(() => {
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
    return ingredients.map(ing => ing.name).join(",");
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

  // Check if a recipe meets dietary preferences
  const matchesDietaryPreferences = (recipe: Recipe): boolean => {
    // If no preferences selected, show all recipes
    if (selectedAllergy === 'None' && selectedDiet === 'None') {
      return true;
    }

    // Filter by allergies
    if (selectedAllergy !== 'None') {
      // Check if recipe contains selected allergen
      if (recipe.allergens && recipe.allergens.includes(selectedAllergy.toLowerCase())) {
        return false;
      }
    }

    // Filter by dietary preference
    if (selectedDiet !== 'None') {
      // For API recipes without diet info, make best guess
      if (!recipe.diet) {
        // For vegan/vegetarian, check for common animal products
        if (selectedDiet.toLowerCase() === 'vegetarian') {
          const meatIngredients = ['chicken', 'beef', 'pork', 'meat', 'fish', 'seafood'];
          if (recipe.apiIngredients && recipe.apiIngredients.some(ing =>
            meatIngredients.some(meat => ing.includes(meat)))) {
            return false;
          }
        }
        // For API recipes, we can't reliably determine other diets
        return true;
      }

      // For hardcoded recipes with diet info
      return recipe.diet && recipe.diet.includes(selectedDiet.toLowerCase());
    }

    return true;
  };

  // Enhanced fetchRecipes function using complexSearch endpoint
  const fetchRecipes = async () => {
    setError(null);
    setLoading(true);

    if (selectedIngredients.length === 0) {
      setError("Please select at least one ingredient.");
      setLoading(false);
      return;
    }

    // Build query parameters for complexSearch endpoint
    const ingredients = formatIngredients(selectedIngredients);

    // Initialize query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('apiKey', apiKey);
    queryParams.append('number', '4');
    queryParams.append('addRecipeInformation', 'true');  // Get detailed recipe information
    queryParams.append('fillIngredients', 'true');       // Get ingredient information
    queryParams.append('sort', 'max-used-ingredients');  // Sort by max used ingredients

    // Add ingredients
    if (ingredients) {
      queryParams.append('includeIngredients', ingredients);
    }

    // Add diet filter if selected
    if (selectedDiet !== 'None') {
      queryParams.append('diet', selectedDiet.toLowerCase());
    }

    // Add allergy/intolerance filter if selected
    if (selectedAllergy !== 'None') {
      queryParams.append('intolerances', selectedAllergy.toLowerCase());
    }

    // Construct the URL with all parameters
    const url = `https://api.spoonacular.com/recipes/complexSearch?${queryParams.toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      // Handle the case when no API recipes are found
      if (!data.results || data.results.length === 0) {
        // Fall back to filtered hardcoded recipes
        // First filter hardcoded recipes based on selected ingredients
        const relevantHardcodedRecipes = hardcodedRecipes.map(recipe => {
          // Count how many selected ingredients are used in this recipe
          const matchedIngredients: Ingredient[] = [];
          let totalRelevance = 0;

          selectedIngredients.forEach(selIng => {
            const matchFound = recipe.apiIngredients.some(apiIng =>
              apiIng.includes(selIng.name) || selIng.name.includes(apiIng)
            );

            if (matchFound) {
              totalRelevance++;
              matchedIngredients.push(selIng);
            }
          });

          // Create a new recipe object with matched ingredients
          return {
            ...recipe,
            relevance: totalRelevance,
            usedIngredients: matchedIngredients
          };
        }).filter(recipe => recipe.relevance > 0 && matchesDietaryPreferences(recipe));

        if (relevantHardcodedRecipes.length > 0) {
          setRecipes(relevantHardcodedRecipes.sort((a, b) => b.relevance - a.relevance));
        } else {
          // Filter hardcoded recipes just by dietary preferences if no ingredient matches
          const dietFilteredRecipes = hardcodedRecipes.filter(recipe => matchesDietaryPreferences(recipe));
          setRecipes(dietFilteredRecipes.length > 0 ? dietFilteredRecipes : hardcodedRecipes);
        }

        setApiRecipesLoaded(false);
        setLoading(false);
        return;
      }

      // Process API results into our recipe format
      const apiRecipes = await Promise.all(data.results.map(async (recipe: any) => {
        // Get more detailed information about each recipe
        const details = await getRecipeDetails(recipe.id.toString());

        // Extract missed ingredients from the recipe
        const missedIngredients = recipe.missedIngredients
          ? recipe.missedIngredients.map((ingredient: any) => ingredient.name)
          : [];

        return {
          id: recipe.id,
          title: recipe.title,
          img: recipe.image || "https://via.placeholder.com/300", // Fallback image
          cost: calculateTotalCost(details.usedIngredients),
          content: details.instructions,
          usedIngredients: details.usedIngredients,
          missedIngredients: missedIngredients,
          apiIngredients: details.apiIngredients,
          link: `https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}`,
          allergens: [],
          diet: recipe.diets || [] // Use diets provided by API
        };
      }));

      // Filter API recipes that actually use at least one selected ingredient
      const filteredApiRecipes = apiRecipes.filter(recipe => recipe.usedIngredients.length > 0);

      // If we have API recipes, use them
      if (filteredApiRecipes.length > 0) {
        setRecipes(filteredApiRecipes);
        setApiRecipesLoaded(true);
      } else {
        // Fall back to relevant hardcoded recipes
        const relevantHardcodedRecipes = hardcodedRecipes.map(recipe => {
          // Count how many selected ingredients are used in this recipe
          const matchedIngredients: Ingredient[] = [];
          let totalRelevance = 0;

          selectedIngredients.forEach(selIng => {
            const matchFound = recipe.apiIngredients.some(apiIng =>
              apiIng.includes(selIng.name) || selIng.name.includes(apiIng)
            );

            if (matchFound) {
              totalRelevance++;
              matchedIngredients.push(selIng);
            }
          });

          return {
            ...recipe,
            relevance: totalRelevance,
            usedIngredients: matchedIngredients
          };
        }).filter(recipe => recipe.relevance > 0 && matchesDietaryPreferences(recipe));

        if (relevantHardcodedRecipes.length > 0) {
          setRecipes(relevantHardcodedRecipes.sort((a, b) => b.relevance - a.relevance));
        } else {
          // Only filter by dietary preferences
          const dietFilteredRecipes = hardcodedRecipes.filter(recipe => matchesDietaryPreferences(recipe));
          setRecipes(dietFilteredRecipes.length > 0 ? dietFilteredRecipes : hardcodedRecipes);
        }

        setApiRecipesLoaded(false);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError(`Error retrieving recipes: ${error instanceof Error ? error.message : 'Unknown error'}`);

      // Fall back to hardcoded recipes
      const relevantHardcodedRecipes = hardcodedRecipes.map(recipe => {
        // Count how many selected ingredients are used in this recipe
        const matchedIngredients: Ingredient[] = [];
        let totalRelevance = 0;

        selectedIngredients.forEach(selIng => {
          const matchFound = recipe.apiIngredients.some(apiIng =>
            apiIng.includes(selIng.name) || selIng.name.includes(apiIng)
          );

          if (matchFound) {
            totalRelevance++;
            matchedIngredients.push(selIng);
          }
        });

        return {
          ...recipe,
          relevance: totalRelevance,
          usedIngredients: matchedIngredients
        };
      }).filter(recipe => recipe.relevance > 0 && matchesDietaryPreferences(recipe));

      if (relevantHardcodedRecipes.length > 0) {
        setRecipes(relevantHardcodedRecipes.sort((a, b) => b.relevance - a.relevance));
      } else {
        // Filter hardcoded recipes just by dietary preferences
        const dietFilteredRecipes = hardcodedRecipes.filter(recipe => matchesDietaryPreferences(recipe));
        setRecipes(dietFilteredRecipes.length > 0 ? dietFilteredRecipes : hardcodedRecipes);
      }

      setApiRecipesLoaded(false);
      setLoading(false);
    }
  };

  // Calculate total cost based on used ingredients
  const calculateTotalCost = (usedIngredients: Ingredient[]): number => {
    return usedIngredients.reduce((sum, ing) => sum + ing.cost, 0);
  };

  // Check if an ingredient is selected
  const isIngredientSelected = (ingredient: Ingredient): boolean => {
    return selectedIngredients.some(item => item.name === ingredient.name);
  };

  return (
    <div className="recipe-container">
      <h1>Weekly Special Recipes</h1>

      <FilterControls
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        selectedAllergy={selectedAllergy}
        setSelectedAllergy={setSelectedAllergy}
        selectedDiet={selectedDiet}
        setSelectedDiet={setSelectedDiet}
        fetchRecipes={fetchRecipes}
        loading={loading}
        apiRecipesLoaded={apiRecipesLoaded}
        resetToHardcodedRecipes={resetToHardcodedRecipes}
        selectedIngredientsCount={selectedIngredients.length}
      />

      {error && <p className="error-message">{error}</p>}

      <div className="main-grid">
        <IngredientsPanel
          ingredients={ingredients}
          homeIngredients={homeIngredientsFormatted}
          selectedIngredients={selectedIngredients}
          handleIngredientClick={handleIngredientClick}
          isIngredientSelected={isIngredientSelected}
        />

        <RecipesList
          recipes={recipes}
          apiRecipesLoaded={apiRecipesLoaded}
          addToGroceryList={addToGroceryList}
        />
      </div>

      <footer className="recipe-footer">
        <p>Prices updated weekly. Recipes powered by Spoonacular API.</p>
      </footer>
    </div>
  );
};

export default RecipeComponent;