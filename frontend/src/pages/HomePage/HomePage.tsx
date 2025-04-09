import React, { useState } from 'react'
import { Text } from '@mantine/core';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import RecipeComponent from '../../components/RecipeComponent';
import { IGA_dict, MAXI_dict, metro_dict, superC_dict } from '../../Dictionaries/dictionaries';
import Ingredient from '../../interface/Ingredient';



function HomePage() {
  const [currentIngredients, setCurrentIngredients] = useState<Ingredient[]>([]);


  const navigate = useNavigate();

  const handleStoreClick = (store: string, dict: Record<string, unknown>) => {
    const ingredients: Ingredient[] = Object.entries(dict).map(([name, cost]) => ({
      name,
      cost: typeof cost === 'number' ? cost : 0
    }));
    setCurrentIngredients(ingredients);
    navigate(`/recipe/${store}`);
  };
  

  return (
    <div className="homeStack">
      <div className="headline shrikhand_regular">
        Turn flyer specials into special meals
      </div>
      <div className="stores">
        <div className="stores_image" onClick={() => handleStoreClick("metro",metro_dict)
        }>
          <img src="/metro.png" alt="Metro" />
        </div>
        <div className="stores_image" onClick={() => handleStoreClick("maxi",MAXI_dict)
        }>
          <img src="/maxi.png" alt="Maxi" />
        </div>
        <div className="stores_image" onClick={() => handleStoreClick("superC",superC_dict)
        }>
          <img src="/superC.png" alt="Super C" />
        </div>
        <div className="stores_image" onClick={() => handleStoreClick("iga",IGA_dict)
         
        }>
          <img src="/iga.png" alt="IGA" />
        </div>
      </div>
    </div>
  )
}

export default HomePage
