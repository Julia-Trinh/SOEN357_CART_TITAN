import React from 'react'
import { useParams } from 'react-router-dom';
import RecipeFinderApp from '../../components/RecipeFinderApp.tsx';
import './RecipePage.css';
import { MultiSelect, Select } from '@mantine/core';
//import { IGA_dict } from "../../../../backend/mapping.py";

function RecipePage() {
  const { store } = useParams();

  const [storeChoice, setStoreChoice] = React.useState(store || "metro");
  const [dietaryChoices, setDietaryChoices] = React.useState<string | null >("");
  const [allergies, setAllergies] = React.useState<string[]>([]);


  return (
    <>
      <div className="bigDiv">
        <div className="images">
          <img src="/metro.png" alt="Metro" className="stores_image" onClick={() => { setStoreChoice("metro") }} />
          <img src="/maxi.png" alt="Maxi" className="stores_image" onClick={() => { setStoreChoice("maxi") }} />
          <img src="/superC.png" alt="Super C" className="stores_image" onClick={() => { setStoreChoice("superC") }} />
          <img src="/iga.png" alt="IGA" className="stores_image" onClick={() => { setStoreChoice("iga") }} />
        </div>
      </div>
      < RecipeFinderApp />
    </>
  )
}

export default RecipePage
