const recipeResult = document.getElementById('recipeResult');
const recipeSteps = document.getElementById('recipeSteps');
const recipeImage = document.getElementById('recipeImage');
const suggestions = document.getElementById('suggestions');
const home = document.getElementById('home');
const port = 3000;

const unsplashAccessKey = "si4TRipqJF96tXXmZkBtm7c0Clj-Hg8cg4cyis2SikQ";

async function fetchDishImage(dishName) {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(dishName)}&client_id=${unsplashAccessKey}&orientation=landscape&per_page=1`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0].urls.regular;
      return imageUrl;
    } else {
      console.warn("No image found for dish:", dishName);
      return null;
    }
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return null;
  }
}


async function suggestRecipes() {
    const dishName = document.getElementById('ingredient').value.trim();

    // Clear previous results
    recipeResult.innerText = '';
    recipeSteps.innerHTML = '';
    recipeImage.style.display = "none";
    suggestions.innerText = '';

    if (!dishName) {
        recipeResult.innerText = "Please enter a dish name.";
        return;
    }

    recipeResult.innerText = "Fetching recipe...";

    try {
        const response = await fetch(`http://localhost:${port}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dish: dishName })
        });

        const data = await response.json();

        recipeResult.innerText = `🍽️ Recipe for ${dishName.charAt(0).toUpperCase() + dishName.slice(1)}:`;

        // Render HTML by preserving Markdown-style formatting
        const beautifiedHTML = data.recipe
        .replace(/\*\*(.*?)\*\*/g, '<h3>$1</h3>')                      // Convert **bold** to <h3>
        .replace(/\n\s*\*/g, '<li>')                                   // List items
        .replace(/<\/h3>\s*<li>/g, '</h3><ul><li>')                    // Start list after heading
        .replace(/(\n\d+\.\s+)/g, '<li>')                              // Numbered steps to <li>
        .replace(/<\/li>\s*<li>/g, '</li><li>')                        // Clean duplicate tags
        .replace(/<\/li>\s*<\/h3>/g, '</li></ul></h3>')                // Close lists
        .replace(/\n/g, '<br>');                                       // Fallback line breaks

        recipeSteps.innerHTML = `<div style="text-align: left; max-width: 700px; margin: 20px auto; font-size: 16px; line-height: 1.7;">${beautifiedHTML}</div>`;

        // if (data.image) {
        // recipeImage.src = data.image;
        // recipeImage.style.display = "block";
        // }

        const unsplashImage = await fetchDishImage(dishName);
        if (unsplashImage) {
            recipeImage.src = unsplashImage;
            recipeImage.style.display = "block";
        } else {
            recipeImage.style.display = "none";
        }

    } catch (error) {
        console.error(error);
        recipeResult.innerText = "⚠️ Failed to fetch recipe. Please try again later.";
    }
}
  

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

function showSuggestions(event) {
  const input = event.target.value.toLowerCase();
  const availableIngredients = ["egg", "tomato", "paneer", "pasta"];
  const matches = availableIngredients.filter(ing => ing.startsWith(input));
  suggestions.innerText = matches.length ? "Suggestions: " + matches.join(", ") : "";
}

home.addEventListener("click", function () {
  window.location.href = "../HTML/dash.html";
});
