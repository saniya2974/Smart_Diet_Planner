const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//const uri = "mongodb+srv://Marinette:abc@mycluster1.1padp.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster1";
const uri= "mongodb+srv://Anhira:hello@testserver.zsorp.mongodb.net/?retryWrites=true&w=majority&appName=testServer";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToDB() {
    await client.connect();
    return client.db("User_data").collection("users");
}

async function connectToUserDetails() {
    await client.connect();
    return client.db("User_data").collection("user_details");
}

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const usersCollection = await connectToDB();

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
        return res.status(409).send('Email already registered!');
    }

    await usersCollection.insertOne({ username, email, password });
    res.status(201).send('Signup successful!');
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const usersCollection = await connectToDB();

    const user = await usersCollection.findOne({ email });
    if (user && user.password === password) {
        return res.status(200).send(`Welcome back, ${user.username}!`);
    }

    res.status(401).send('Invalid email or password!');
});

app.post('/save_profile', async (req, res) => {
    const profileData = req.body;
    const userDetailsCollection = await connectToUserDetails();

    try {
        await userDetailsCollection.insertOne(profileData);
        res.status(200).json({ message: "Profile saved to user_details collection!" });
    } catch (err) {
        console.error("Error saving profile:", err);
        res.status(500).json({ error: "Failed to save profile" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});