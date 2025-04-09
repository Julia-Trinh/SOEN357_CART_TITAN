import { useEffect, useState } from 'react';

// Define types
export interface MarketItem {
  name: string;
  price: number;
  store: string;
  onSale: boolean;
}

export interface ProcessedMarketData {
  allItems: MarketItem[];
  saleItems: MarketItem[];
  storeComparison: Record<string, number>;
  cheapestStore: string;
  loading: boolean;
  error: string | null;
}

// Mapping store names to their respective data files
const storeDataFiles = {
  'IGA': '/data/IGA_data.json',
  'MAXI': '/data/MAXI_data.json',
  'Metro': '/data/Metro_data.json',
  'SuperC': '/data/SuperC_data.json'
};

/**
 * Normalize product names to make them easier to match with recipe ingredients
 */
function normalizeProductName(name: string): string {
  let normalized = name.replace(/\$\d+\.\d+|\d+\.\d+\$/, '').trim();
  /*
  const prefixesToRemove = [
    'S ', 'EST ', 'COMPLIMENTS ', 'MARCANGELO ', 'MAPLE LEAF ',
    'LAFLEUR ', 'FRESH ', 'FROZEN '
  ];

  prefixesToRemove.forEach(prefix => {
    normalized = normalized.replace(new RegExp(`^${prefix}`, 'i'), '');
  });

  normalized = normalized.replace(/\d+\s*(ML|G|KG|OZ|LB)/, '').trim();

  const foodCategories = [
    'APPLE', 'CHICKEN', 'PORK', 'BEEF', 'CHEESE', 'BREAD', 'MILK',
    'YOGURT', 'PASTA', 'RICE', 'TOMATO', 'POTATO', 'ONION', 'CARROT',
    'BROCCOLI', 'CAULIFLOWER', 'PEPPER', 'CUCUMBER', 'LETTUCE', 'SPINACH',
    'FISH', 'SHRIMP', 'BEAN', 'EGG', 'BUTTER', 'CREAM', 'SOUP'
  ];

  for (const category of foodCategories) {
    if (normalized.toUpperCase().includes(category)) {
      return category.toLowerCase();
    }
  }
  */
  return normalized.toLowerCase();
}

/**
 * Custom hook to fetch and process market data from all stores
 */
export function useMarketData(): ProcessedMarketData {
  const [allItems, setAllItems] = useState<MarketItem[]>([]);
  const [saleItems, setSaleItems] = useState<MarketItem[]>([]);
  const [storeComparison, setStoreComparison] = useState<Record<string, number>>({});
  const [cheapestStore, setCheapestStore] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllStoreData() {
      try {
        setLoading(true);
        // Fetch data from all stores
        const allStoreItems: MarketItem[] = [];

        for (const [storeName, dataFile] of Object.entries(storeDataFiles)) {
          try {
            const response = await fetch(dataFile);
            const data = await response.json();

            // Process each item from this store
            Object.entries(data).forEach(([name, priceValue]: [string, any]) => {
              // Make sure we have a number price
              const price = typeof priceValue === 'number' ? priceValue : parseFloat(priceValue);

              // Determine if item is on sale (this logic could be improved)
              // Simple example: items under certain price point or with specific markers
              const hasDiscountMarker = name.includes('SPECIAL') || name.includes('SALE');
              const isLowPrice = price < 3.00;
              const onSale = hasDiscountMarker || isLowPrice;

              allStoreItems.push({
                name: normalizeProductName(name),
                price: price,
                store: storeName,
                onSale
              });
            });

          } catch (storeError) {
            console.error(`Error loading data for ${storeName}:`, storeError);
          }

        }
        // Calculate store statistics
        const storeStats: Record<string, number> = {};
        Object.keys(storeDataFiles).forEach(store => {
          const storeItems = allStoreItems.filter(item => item.store === store);
          const saleItemsCount = storeItems.filter(item => item.onSale).length;
          storeStats[store] = saleItemsCount;
        });

        // Find cheapest store based on sale items count
        const bestStore = Object.entries(storeStats)
          .sort(([,a], [,b]) => b - a)[0][0];

        setAllItems(allStoreItems);
        setSaleItems(allStoreItems.filter(item => item.onSale));
        setStoreComparison(storeStats);
        setCheapestStore(bestStore);
        setLoading(false);

      } catch (err) {
        console.error("Error processing market data:", err);
        setError("Failed to load supermarket data");
        setLoading(false);
      }
    }

    fetchAllStoreData();
  }, []);

  return {
    allItems,
    saleItems,
    storeComparison,
    cheapestStore,
    loading,
    error
  };
}