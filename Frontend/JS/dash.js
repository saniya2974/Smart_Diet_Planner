let menu = document.querySelector("#menu-btn");
let sidebar = document.querySelector(".sidebar");
let recipe = document.querySelector(".recipe");
let mealCont = document.querySelector(".meals");


recipe.addEventListener("click",function(){
   window.location.href="../HTML/Meal_planner.html";

});

// Update dashboard greeting
function updateDashboardGreeting() {
    const profile = JSON.parse(localStorage.getItem("userProfile"));
    console.log("User Profile Data:", profile);

    if (profile && profile.name) {
        document.querySelector(".heading h2").innerText = `Welcome Dear ${profile.name}!!`;
    }
}

// Update dashboard picture
function updateDashboardPicture() {
    const profile = JSON.parse(localStorage.getItem("userProfile"));

    if (profile && profile.gender) {
        if(profile.gender == "male"){
        document.querySelector("#user img").src="../HTML/img/man.jpg" ;
        console.log("Male Picture updated");
        }
        else {
            document.querySelector("#user img").src ="../HTML/img/woman.png"; // Default for female
        }
    }
}

menu.addEventListener("click", function () {
    sidebar.classList.toggle("active");
    console.log("Menu button clicked");

    let close = document.querySelector("#close-btn");
    if (!close && sidebar.classList.contains("active")) {
        close = document.createElement("button");
        close.id = "close-btn";
        close.innerText = "✖ Close";
        sidebar.appendChild(close);

        close.addEventListener("click", function () {
            sidebar.classList.remove("active");
            close.remove();
        });
    } else if (!sidebar.classList.contains("active")) {
        close?.remove();
    }
});

// Function to generate meal sections
function generateMeal(mealType, mealData) {
    if (!mealData) return '<div class="meal"><h2>' + mealType + '</h2><p>No plans to show</p></div>';

    return `
        <div class="meal">
            <h2>${mealType}</h2>
            <p>${mealData.calories} Calories</p>
            <ul>
                ${mealData.items.map(item => `
                    <li>
                        <img src="${item.image}" alt="${item.name}" class="meal-image">
                        <strong>${item.name}</strong> - ${item.servings} servings
                    </li>`).join('')}
            </ul>
        </div>
    `;
}

// Function to update UI with the stored meal plan
function updateMealPlan() {
    let dietPlan = JSON.parse(localStorage.getItem("dietPlan")) || {};
    mealCont.innerHTML = `
        ${generateMeal("Breakfast", dietPlan.Breakfast)}
        ${generateMeal("Lunch", dietPlan.Lunch)}
        ${generateMeal("Dinner", dietPlan.Dinner)}
    `;
    console.log("Updated Diet Plan:", dietPlan);
}

async function fetchMealPlan() {
    try {
        let response = await fetch("http://127.0.0.1:5000/generate-diet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                goal: "weight loss", 
                target: "reduce fat",
                exclusion: "sugar, junk food"
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        
        if (data.dietPlan) {
            localStorage.setItem("dietPlan", JSON.stringify(data.dietPlan)); // Store data
            updateMealPlan();  // Call function to update UI
        } else {
            console.error("❌ Error: No meal plan received", data);
        }
    } catch (error) {
        console.error("❌ Failed to fetch meal plan:", error);
    }
}

// Call the function on page load
window.onload = function(){
    updateDashboardGreeting();
    updateDashboardPicture();
    fetchMealPlan(); 
};
