// Function to fetch recipes from the backend
const fetchRecipes = async () => {
    const loadingMessage = document.querySelector('.loading');
    loadingMessage.textContent = "Loading Recipes...";
    try {
        const response = await fetch('http://127.0.0.1:5000/recipes');
        if (!response.ok) throw new Error('Failed to fetch recipes');
        
        const recipes = await response.json();
        loadingMessage.style.display = 'none';  // Hide loading message
        displayRecipes(recipes);
    } catch (error) {
        loadingMessage.textContent = "Error loading recipes. Please try again.";
        console.error("Error fetching recipes:", error);
    }
};

// Function to display recipes
const displayRecipes = (recipes) => {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';  // Clear the current list

    if (recipes.length === 0) {
        recipeList.innerHTML = "<p>No recipes available at the moment. Please try again later.</p>";
        return;
    }

    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.classList.add('recipe-card');
        card.innerHTML = `
            <img src="${recipe.imageUrl || 'https://via.placeholder.com/150'}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
        `;
        card.onclick = () => showRecipeDetails(recipe);  // Show recipe details when clicked
        recipeList.appendChild(card);
    });
};

// Function to show the details of a selected recipe
const showRecipeDetails = (recipe) => {
    const detailsSection = document.getElementById('recipe-details');
    document.getElementById('recipe-title').textContent = recipe.title;
    
    const ingredientsList = document.getElementById('recipe-ingredients');
    ingredientsList.innerHTML = '';
    recipe.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });

    const instructionsList = document.getElementById('recipe-instructions');
    instructionsList.innerHTML = '';
    recipe.instructions.forEach(instruction => {
        const li = document.createElement('li');
        li.textContent = instruction;
        instructionsList.appendChild(li);
    });

    detailsSection.classList.remove('hidden');  // Show recipe details section
};

// Function to hide the recipe details and go back to the recipe list
const hideRecipeDetails = () => {
    const detailsSection = document.getElementById('recipe-details');
    detailsSection.classList.add('hidden');  // Hide recipe details section
};

// Function to add a new recipe
const addRecipe = async () => {
    const title = document.getElementById('recipe-title-input').value;
    const ingredients = document.getElementById('recipe-ingredients-input').value.split(',');
    const instructions = document.getElementById('recipe-instructions-input').value.split(',');

    // Validate inputs
    if (!title || ingredients.length === 0 || instructions.length === 0) {
        alert("Please fill in all fields.");
        return;
    }

    const newRecipe = { title, ingredients, instructions };

    try {
        const response = await fetch('http://127.0.0.1:5000/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRecipe),
        });
        
        if (!response.ok) throw new Error('Failed to add recipe');
        
        const result = await response.json();
        alert("Recipe added successfully!");
        fetchRecipes();  // Refresh the recipe list
    } catch (error) {
        alert("Error adding recipe. Please try again.");
        console.error("Error adding recipe:", error);
    }
};

// Load recipes when the page loads
window.onload = fetchRecipes;
