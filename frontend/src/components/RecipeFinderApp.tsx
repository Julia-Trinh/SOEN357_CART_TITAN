import React, { useState } from 'react';
import { useMarketData } from '../utils/marketDataProcessor.ts';
import RecipeComponent from './RecipeComponent.tsx';
import './RecipeFinderApp.css';

const RecipeFinderApp: React.FC = () => {
  const {
    allItems,
    saleItems,
    storeComparison,
    cheapestStore,
    loading,
    error
  } = useMarketData();

  const [selectedStore, setSelectedStore] = useState<string>('all');

  // Convert market items to the format RecipeComponent expects
  const getMarketDataForStore = () => {
    // If all stores selected, merge all items
    const itemsToUse = selectedStore === 'all'
      ? allItems
      : allItems.filter(item => item.store === selectedStore);

    // Convert to dictionary format
    return itemsToUse.reduce((acc, item) => {
      acc[item.name] = item.price;
      return acc;
    }, {} as Record<string, number>);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Weekly Specials Recipe Finder</h1>
        <p>Find recipes using on-sale ingredients from your favorite supermarkets</p>
      </header>

      {loading ? (
        <div className="loading">
          <p>Loading supermarket specials...</p>
        </div>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="store-stats">
            <h2>This Week's Specials</h2>

            <div className="store-selector">
              <label htmlFor="store-select">Choose a store:</label>
              <select
                id="store-select"
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
              >
                <option value="all">All Stores</option>
                {Object.keys(storeComparison).map(store => (
                  <option key={store} value={store}>
                    {store} ({storeComparison[store]} items on sale)
                  </option>
                ))}
              </select>
            </div>

            <div className="recommendation">
              <p>
                <strong>Best deals this week:</strong> {cheapestStore} has the most items on sale
              </p>
            </div>
          </div>

          <RecipeComponent marketData={getMarketDataForStore()} />
        </>
      )}

      <footer className="app-footer">
        <p>Prices updated weekly. Recipes powered by Spoonacular API.</p>
      </footer>
    </div>
  );
};

export default RecipeFinderApp;
