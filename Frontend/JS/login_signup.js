// auth.js

const authForm = document.getElementById('authForm');
const formTitle = document.getElementById('formTitle');
const usernameField = document.getElementById('username');
const toggleText = document.querySelector('.toggle');

// Function to toggle between Login and Sign Up forms
function toggleForm() {
    if (formTitle.innerText === "Login") {
        formTitle.innerText = "Sign Up";
        usernameField.style.display = "block";
        toggleText.innerText = "Already have an account? Login";
    } else {
        formTitle.innerText = "Login";
        usernameField.style.display = "none";
        toggleText.innerText = "Don't have an account? Sign Up";
    }
}

// Function to handle form submission
authForm.addEventListener('submit', (e) => {
    e.preventDefault();  // Prevent the default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = usernameField.value;
    const isSignup = formTitle.innerText === "Sign Up";

    if (isSignup) {
        // Handle Sign Up
        if (localStorage.getItem(email)) {
            alert('Email already registered! Please login.');
        } else {
            const userData = { username, email, password };
            localStorage.setItem(email, JSON.stringify(userData));
            alert('Signup successful! You can now login.');
            toggleForm();  // Switch to login form
        }
    } else {
        // Handle Login
        const storedUser = localStorage.getItem(email);
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.password === password) {
                alert(`Welcome back, ${user.username}!`);
                // Redirect to dashboard or another page if needed
                // window.location.href = '/dashboard.html';
            } else {
                alert('Incorrect password!');
            }
        } else {
            alert('Email not registered! Please sign up.');
        }
    }
});
