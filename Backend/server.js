const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

require('dotenv').config();

const Groq = require("groq-sdk");

const app = express();
const port = 3000;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'df0lmqoj9',
  api_key: '398739466626194',
  api_secret: 'd11lVqiR7j0BizLkons8Cr-J3dQ'
});


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

app.get('/users', async (req, res) => {
    try {
        const usersCollection = await connectToDB();
        const users = await usersCollection.find({}).toArray();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving users');
    }
});

app.post('/', async (req, res) => {
    const dish = req.body.dish;

    if (!dish) {
        return res.status(400).json({ error: "Dish name is required" });
    }

    try {
        const completion = await groq.chat.completions.create({
        messages: [
            {
            role: "system",
            content: `You are a professional chef who provides easy-to-follow, step-by-step recipes for a wide range of global dishes. Your instructions should be clear, beginner-friendly, and include ingredients, quantities, and cooking time.`
            },
            {
            role: "user",
            content: `Please provide a detailed recipe for making "${dish}". Include ingredients and cooking steps.`
            }
        ],
        model: "llama-3.3-70b-versatile", // or "llama-3-70b"
        });

        const recipeText = completion.choices[0]?.message?.content || "No recipe found.";
        res.json({ recipe: recipeText });

    } catch (error) {
        console.error("Groq API error:", error);
        res.status(500).json({ error: "Failed to generate recipe." });
    }
});
  
// app.post('/analyze', async (req, res) => {
//     const { image_url } = req.body;
//     console.log(`image_url = ${image_url}`);
  
//     if (!image_url) {
//       return res.status(400).json({ error: 'No image URL provided.' });
//     }
  
//     try {
//       // Send request to Groq API
//       const chatCompletion = await groq.chat.completions.create({
//         model: "meta-llama/llama-4-scout-17b-16e-instruct",
//         messages: [
//           {
//             role: "system",
//             content: "You are an expert nutritionist. Given an image of a prepared dish, analyze and estimate its nutritional content."
//           },
//           {
//             role: "user",
//             content: [
//               {
//                 type: "text",
//                 text: "Please list out all the foods you see in the image and analyze the nutrition content of this food."
//               },
//               {
//                 type: "image_url",
//                 image_url: { url: image_url }
//               }
//             ]
//           }
//         ]
//       });

//       // Log the entire Groq API response for debugging
//       console.log("Groq API Response:", chatCompletion);
      
//       // Ensure you're accessing the correct structure in the Groq API response
//       const nutrition = chatCompletion.choices[0]?.message?.content || "No nutrition information available.";

//       // Send the nutrition information back to the client
//       res.json({ nutrition });
//     } catch (error) {
//       console.error('Error in Groq API request:', error);
//       res.status(500).json({ error: 'Failed to fetch nutrition information.' });
//     }
// });

// const cloudinary = require('cloudinary').v2;

// // Helper to upload base64 image to Cloudinary
// async function uploadBase64Image(base64String) {
//   const uploadResponse = await cloudinary.uploader.upload(base64String, {
//     folder: 'nutrition_images'
//   });
//   return uploadResponse.secure_url;
// }

// Upload base64 to Cloudinary
async function uploadBase64Image(base64Image) {
    console.log('Uploading base64 image to Cloudinary...');
    console.log(`base64 image = ${base64Image}`)
    if (!base64Image) {
        console.log('No image to upload.');
        return;
    }
    
    try {
        const response = await cloudinary.uploader.upload(base64Image, {
            upload_preset: 'unsigned_upload', // Use your Cloudinary preset
          });
      return response.secure_url;
    } catch (err) {
      console.error('Cloudinary upload failed:', err);
      throw new Error('Image upload failed.');
    }
}

app.post('/analyze', async (req, res) => {
  let { image_url, base64_image } = req.body;
//   console.log(`base64 image = ${base64Image}`)
  console.log(`Received image_url: ${image_url}`);
  console.log(`Received base64_image: ${base64_image ? '[base64 string]' : 'null'}`);

  try {
    // If base64 image is provided but no image URL, upload to Cloudinary
    if (!image_url && base64_image) {
      try {
        console.log("Uploading base64 image to Cloudinary...");
        console.log(`************base64 image = ${base64_image}`)
        image_url = await uploadBase64Image(base64_image);
        console.log("Image successfully uploaded. URL:", image_url);
      } catch (uploadErr) {
        console.error("Cloudinary upload failed:", uploadErr);
        return res.status(500).json({ error: "Image upload failed." });
      }
    }

    if (!image_url) {
      return res.status(400).json({ error: 'No image URL or base64 image provided.' });
    }

    // Send request to Groq API
    const chatCompletion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "system",
          content: "You are an expert nutritionist. Given an image of a prepared dish, analyze and estimate its nutritional content."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please list out all the foods you see in the image and analyze the nutrition content of this food."
            },
            {
              type: "image_url",
              image_url: {
                url: image_url
              }
            }
          ]
        }
      ]
    });

    // Log the response for debugging
    console.log("Groq API Response:", chatCompletion);

    const nutrition = chatCompletion.choices[0]?.message?.content || "No nutrition information available.";

    res.json({ nutrition });

  } catch (error) {
    console.error('Error in Groq API request:', error);
    res.status(500).json({ error: 'Failed to fetch nutrition information.' });
  }
});

  

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});