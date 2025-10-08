const express = require("express");
const cors = require("cors");
// Required to allow your frontend (the previous HTML/React app) to communicate with this server.
require("dotenv").config();

// --- Configuration ---
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173", // or "*" for all origins (not for production)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.User_Name}:${process.env.User_Pass}@shanjid.wxj1xep.mongodb.net/?retryWrites=true&w=majority&appName=shanjid`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("invoice-generator");
    const osudsCollection = database.collection("osuds");

    // ✅ Define the API route
    app.post("/api/invoices", async (req, res) => {
      try {
        const osuds = req.body;

        const result = await osudsCollection.insertOne(osuds);
        res.status(201).json({ message: "Invoice created", result });
      } catch (error) {
        console.error("Error creating invoice:", error.message);
        res.status(400).json({
          message: "Failed to create invoice.",
          error: error.message,
        });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}
run().catch(console.dir);

// --- Middleware Setup ---
// Enable CORS for all routes
app.use(cors());
// Enable Express to parse JSON bodies
app.use(express.json());

// invoice-app-react

// f46ixK57WEszALaU
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
