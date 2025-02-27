let menu = document.querySelector("#menu-btn");
let sidebar = document.querySelector(".sidebar");

let recipe= document.querySelector(".recipe");

recipe.addEventListener("click",function(){
   window.location.href="../HTML/Meal_planner.html";
});

// to update dashboard greeting
function updateDashboardGreeting() {
    const profile = JSON.parse(localStorage.getItem("userProfile"));

    if (profile && profile.name) {
        document.querySelector(".heading h2").innerText = `Welcome Dear ${profile.name}!!`;
    }
}


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

    if (!close) {
        if (sidebar.classList.contains("active")) {
            close = document.createElement("button");
            close.id = "close-btn";
            close.innerText = "✖ Close";

            // Append close button inside sidebar
            sidebar.appendChild(close);

            close.addEventListener("click", function () {
                sidebar.classList.remove("active");
                close.remove(); // Remove the close button
            });
        }
    } else {
        // Remove close button when sidebar is closed
        if (!sidebar.classList.contains("active")) {
            close.remove();
        }
    }
});



// Call the function on page load
window.onload = function(){
updateDashboardGreeting();
// Call the function on page load
updateDashboardPicture();
};
