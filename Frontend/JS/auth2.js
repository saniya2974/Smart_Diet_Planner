const formTitle = document.getElementById('formTitle');
const usernameField = document.getElementById('username');
const toggleText = document.querySelector('.toggle');
const authForm = document.getElementById('authForm');

port = 3000

// Toggle between Login and Sign Up forms
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

// Handle form submission
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = usernameField.value;
    const isSignup = formTitle.innerText === "Sign Up";

    const endpoint = isSignup ? `http://localhost:${port}/signup` : `http://localhost:${port}/login`;
    const data = isSignup ? { username, email, password } : { email, password };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            if (isSignup) {
                toggleForm();  // Switch to login form on successful signup
            } else {
                // Check if admin
                if (
                    email === "admin@gmail.com" &&
                    password === "admin@123"
                ) {
                    window.location.href = "../HTML/admin_user_list.html";
                } else {
                    window.location.href = "../HTML/dash.html";
                }
            }
        } else {
            const error = await response.text();
            console.error("Error:", error);
        }
    } catch (err) {
        console.error('Error:', err);
    }
});

