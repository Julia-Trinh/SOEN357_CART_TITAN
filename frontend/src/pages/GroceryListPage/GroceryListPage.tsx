import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './GroceryListPage.css';

interface Ingredient {
  name: string;
  cost: number;
}

interface LocationState {
  ingredients: Ingredient[];
  recipeName: string;
}

function GroceryListPage() {
  const location = useLocation();
  const [groceryList, setGroceryList] = useState<Ingredient[]>([]);
  const [recipeSources, setRecipeSources] = useState<Record<string, string[]>>({});

  useEffect(() => {
    // Check if we have ingredients from navigation state
    if (location.state) {
      const { ingredients, recipeName } = location.state as LocationState;

      // Add new ingredients to the list without duplicates
      setGroceryList(prevList => {
        const updatedList = [...prevList];

        ingredients.forEach(newItem => {
          const existingItemIndex = updatedList.findIndex(
            item => item.name.toLowerCase() === newItem.name.toLowerCase()
          );

          if (existingItemIndex === -1) {
            // Item doesn't exist, add it
            updatedList.push(newItem);
          }
        });

        return updatedList;
      });

      // Track which recipe each ingredient came from
      if (recipeName) {
        setRecipeSources(prevSources => {
          const updatedSources = {...prevSources};
          ingredients.forEach(ingredient => {
            const name = ingredient.name.toLowerCase();
            if (!updatedSources[name]) {
              updatedSources[name] = [];
            }
            if (!updatedSources[name].includes(recipeName)) {
              updatedSources[name].push(recipeName);
            }
          });
          return updatedSources;
        });
      }
    }

    // Load saved grocery list from localStorage
    const savedList = localStorage.getItem('groceryList');
    if (savedList && !location.state) {
      try {
        const parsedList = JSON.parse(savedList);
        setGroceryList(parsedList);
      } catch (e) {
        console.error('Error parsing saved grocery list:', e);
      }
    }

    const savedSources = localStorage.getItem('recipeSources');
    if (savedSources && !location.state) {
      try {
        const parsedSources = JSON.parse(savedSources);
        setRecipeSources(parsedSources);
      } catch (e) {
        console.error('Error parsing saved recipe sources:', e);
      }
    }
  }, [location.state]);

  // Save grocery list to localStorage whenever it changes
  useEffect(() => {
    if (groceryList.length > 0) {
      localStorage.setItem('groceryList', JSON.stringify(groceryList));
    }

    if (Object.keys(recipeSources).length > 0) {
      localStorage.setItem('recipeSources', JSON.stringify(recipeSources));
    }
  }, [groceryList, recipeSources]);

  const removeItem = (index: number) => {
    setGroceryList(prevList => {
      const updatedList = [...prevList];
      // Remove the item's recipe sources
      const removedItem = updatedList[index];
      if (removedItem) {
        setRecipeSources(prevSources => {
          const updatedSources = {...prevSources};
          delete updatedSources[removedItem.name.toLowerCase()];
          return updatedSources;
        });
      }
      // Remove the item from the list
      updatedList.splice(index, 1);
      return updatedList;
    });
  };

  const clearList = () => {
    setGroceryList([]);
    setRecipeSources({});
    localStorage.removeItem('groceryList');
    localStorage.removeItem('recipeSources');
  };

  return (
    <div className="grocery-list-page">
      <h1>My Grocery List</h1>

      {groceryList.length === 0 ? (
        <p className="empty-list-message">Your grocery list is empty. Add ingredients from recipes!</p>
      ) : (
        <>
          <div className="grocery-controls">
            <button className="clear-list-button" onClick={clearList}>
              Clear List
            </button>
          </div>

          <div className="grocery-items-container">
            <table className="grocery-items">
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Price</th>
                  <th>Recipe Source</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {groceryList.map((item, index) => (
                  <tr key={index} className="grocery-item">
                    <td>{item.name}</td>
                    <td>{item.cost > 0 ? `$${item.cost.toFixed(2)}` : 'N/A'}</td>
                    <td>
                      {recipeSources[item.name.toLowerCase()] ?
                        recipeSources[item.name.toLowerCase()].join(', ') :
                        'Added manually'}
                    </td>
                    <td>
                      <button
                        className="remove-button"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}>Total Estimated Cost:</td>
                  <td colSpan={2}>
                    ${groceryList.reduce((total, item) => total + (item.cost || 0), 0).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default GroceryListPage;