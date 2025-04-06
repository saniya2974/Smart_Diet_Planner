// Get elements from the DOM
const formTitle = document.getElementById('formTitle');
const usernameField = document.getElementById('username');
const toggleText = document.querySelector('.toggle');
const authForm = document.getElementById('authForm');


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Anhira:hello@testserver.zsorp.mongodb.net/?retryWrites=true&w=majority&appName=testServer";

// Create a MongoClient
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Function to connect to MongoDB
async function connectToDB() {
    try {
        await client.connect();
        const db = client.db("User_data");  // Replace with your database name
        const usersCollection = db.collection("users");  // Replace with your collection name
        return usersCollection;
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

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

    const usersCollection = await connectToDB();

    if (isSignup) {
        // Handle Sign Up
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            alert('Email already registered! Please login.');
        } else {
            const newUser = { username, email, password };
            await usersCollection.insertOne(newUser);
            alert('Signup successful! You can now login.');
            toggleForm();  // Switch to login form
        }
    } else {
        // Handle Login
        const user = await usersCollection.findOne({ email });
        if (user) {
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
