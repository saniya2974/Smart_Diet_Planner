let h=document.getElementById('height');
let w=document.getElementById("weight");

let home=document.getElementById("home");
home.addEventListener('click',function(){
    window.location.href="../HTML/dash.html";
})
  // Utility function to show/hide elements
  function showElement(id) {
    document.getElementById(id).classList.remove('hide');
  }
  function hideElement(id) {
    document.getElementById(id).classList.add('hide');
  }


function BMI(w,h){
    const h_met= h/100;
    const bmi= w / ( h_met * h_met);
    let res;
    if(bmi < 18.5){
         res="you are underweight";
    }
    else if(bmi >= 18.5 && bmi < 24.9){
         res='Normal Weight';
    }
    else if(bmi >= 25.0 && bmi< 29.9){
        res="Over-weight";
    }
    else if(bmi >= 30){
        res="Obese";
    }
    else{
        res='None';
    }
    return { bmi: bmi.toFixed(3), category: res };
}

// load data from local storage to display profile locally
function load(){
    const profile = JSON.parse(localStorage.getItem('userProfile'));
    if(profile){
        document.getElementById('Name').innerText="Name: "+profile.name;
        document.getElementById('Age').innerText="Age: "+profile.age +" years";
        document.getElementById('Weight').innerText="Weight: "+profile.weight+" kg";
        document.getElementById('Height').innerText="Height: "+profile.height +" cm";
        document.getElementById('Gender').innerText="Gender: "+profile.gender;
        document.getElementById('bodyfat').innerText="Body-Fat: "+profile['body-fat'];
        document.getElementById('Activity').innerText="Activity Level: "+profile.activity;
        document.getElementById('Goal').innerText="Goal: "+profile.goal;

          // Calculate and display BMI
          const result = BMI(profile.weight, profile.height);
          document.getElementById("BMI").innerText = `BMI: ${result.bmi} (${result.category})`;
  
          showElement('display');
          hideElement('data');

    }
    else{
        // If no profile is saved, show the edit form for initial input
        showElement('data');
        hideElement('display');
     
    }
}

// to save user data to local storage
function save(event){
    event.preventDefault();
    const profile ={
        name: document.querySelector('#name').value,
        age: document.querySelector('#age').value, 
        weight: document.querySelector('#weight').value, 
        height: document.querySelector('#height').value, 
        gender: document.querySelector('input[name="gender"]:checked')?.value || "", 
        "body-fat": document.querySelector('input[name="bodyfat"]:checked')?.value || "", 
        activity: document.querySelector('#drop').value, 
        goal: document.querySelector('#goal-type').value,
    };

    localStorage.setItem('userProfile',JSON.stringify(profile));
   //display profile
    load();

    // 🔹 Hide form section & Show display section
    hideElement("data");
    showElement("display");
}

//Event listener for save form data
let sub= document.querySelector("#sub");
sub.addEventListener('click',save);

//for editing profile when clicked on edit button

let edit=document.querySelector("#editBtn");
edit.addEventListener('click',function(){
    const profile = JSON.parse(localStorage.getItem('userProfile'));
    
    if (profile) {
        document.querySelector("#name").value = profile.name;
        document.querySelector("#age").value = profile.age;
        document.querySelector("#weight").value = profile.weight;
        document.querySelector("#height").value = profile.height;
        
        if (profile.gender) {
            document.querySelector(`input[name="gender"][value="${profile.gender}"]`).checked = true;
        }

        if (profile["body-fat"]) {
            document.querySelector(`input[name="bodyfat"][value="${profile["body-fat"]}"]`).checked = true;
        }

        document.querySelector("#drop").value = profile.activity;
        document.querySelector("#goal-type").value = profile.goal;
    }

        // Show form and hide display section
        showElement('data');
        hideElement('display');
});

// Load the profile on page load
window.onload = load;





