import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IGA_dict, MAXI_dict, metro_dict, superC_dict } from '../../Dictionaries/dictionaries';
import './HomePage.css';

function HomePage() {
  const [currentIngredients, setCurrentIngredients] = useState([]);
  const [activeStore, setActiveStore] = useState(null);
  const [animation, setAnimation] = useState(false);

  const navigate = useNavigate();

  const stores = [
    { name: "metro", displayName: "Metro", dict: metro_dict, logo: "/metro.png" },
    { name: "maxi", displayName: "Maxi", dict: MAXI_dict, logo: "/maxi.png" },
    { name: "superC", displayName: "Super C", dict: superC_dict, logo: "/superC.png" },
    { name: "iga", displayName: "IGA", dict: IGA_dict, logo: "/iga.png" }
  ];

  useEffect(() => {
    // Trigger entrance animation when component mounts
    setAnimation(true);
  }, []);

  const handleStoreClick = (store, dict) => {
    setActiveStore(store);

    // Convert dictionary to array of Ingredient objects
    const ingredients = Object.entries(dict).map(([name, cost]) => ({
      name,
      cost: typeof cost === 'number' ? cost : 0
    }));

    setCurrentIngredients(ingredients);

    // Add small delay before navigation for transition effect
    setTimeout(() => {
      navigate(`/recipe/${store}`);
    }, 300);
  };

  return (
    <div className={`homeContainer ${animation ? 'fade-in' : ''}`}>
      <div className="heroSection">
        <h1 className="headline shrikhand_regular">Turn Flyer Specials Into Special Meals</h1>
        <p className="subheading">Select your favorite grocery store to discover recipes based on this week's deals!</p>
      </div>

      <div className="storesGrid">
        {stores.map((store) => (
          <div
            key={store.name}
            className={`storeCard ${activeStore === store.name ? 'active' : ''}`}
            onClick={() => navigate("/recipe/metro")}
          >
            <div className="storeImageContainer">
              <img src={store.logo} alt={store.displayName} className="storeLogo" />
            </div>
            <div className="storeInfo">
              <h3>{store.displayName}</h3>
              <p>Browse {Object.keys(store.dict).length}+ ingredients on sale</p>
              <span className="exploreButton">Explore Recipes</span>
            </div>
          </div>
        ))}
      </div>

      <div className="featuredSection">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="stepIcon">1</div>
            <p>Choose your grocery store</p>
          </div>
          <div className="step">
            <div className="stepIcon">2</div>
            <p>Discover recipes using sale items</p>
          </div>
          <div className="step">
            <div className="stepIcon">3</div>
            <p>Save money while creating delicious meals</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
