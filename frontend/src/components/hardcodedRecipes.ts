import Recipe from '../interface/Recipe';

// Hard-coded recipes with common ingredients
export const hardcodedRecipes: Recipe[] = [
    {
      id: "hc001",
      title: "Quick Chicken Stir Fry",
      img: "https://www.momontimeout.com/wp-content/uploads/2018/11/chicken-broccoli-stir-fry-733x490.jpg",
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
      link: "https://www.momontimeout.com/easy-chicken-stir-fry-recipe/",
      allergens: ["soy"],
      diet: ["gluten free"]
    },
    {
      id: "hc002",
      title: "Classic Caesar Salad",
      img: "https://www.seriouseats.com/thmb/CI40mF5sQEuUr1voWRdbA2bjscs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/the-best-caesar-salad-recipe-06-40e70f549ba2489db09355abd62f79a9.jpg",
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
      link: "https://www.seriouseats.com/the-best-caesar-salad-recipe",
      allergens: ["dairy", "eggs", "wheat", "fish"],
      diet: []
    },
    {
      id: "hc003",
      title: "Mediterranean Cucumber Tomato Salad",
      img: "https://www.acouplecooks.com/wp-content/uploads/2019/08/Cucumber-Tomato-and-Onion-Salad-004.jpg",
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
      link: "https://www.acouplecooks.com/cucumber-tomato-onion-salad/",
      allergens: ["dairy"],
      diet: ["vegetarian", "gluten free"]
    },
    {
      id: "hc004",
      title: "Simple Roast Chicken with Vegetables",
      img: "https://www.jocooks.com/wp-content/uploads/2020/03/roasted-chicken-and-vegetables-1-9-1229x1536.jpg",
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
      link: "https://www.jocooks.com/recipes/hit-run-baked-chicken-and-veggies/",
      allergens: [],
      diet: ["gluten free"]
    }
  ];