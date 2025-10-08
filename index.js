const express = require("express");
const cors = require("cors"); // Required to allow your frontend (the previous HTML/React app) to communicate with this server.
require("dotenv").config();

// --- Configuration ---
const app = express();
const PORT = 3000;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("invoice-generator");
    const osudsCollection = database.collection("osuds");
    // 1. CREATE an Invoice (POST /api/invoices)
    app.post("/api/invoices", async (req, res) => {
      try {
        const osuds = req.body;
        console.log(osuds)
        // Send a 201 Created status
        res.status(201).json(savedInvoice);
      } catch (error) {
        console.error("Error creating invoice:", error.message);
        // Error 400 Bad Request indicates client-side data validation failed (e.g., missing required field)
        res
          .status(400)
          .json({ message: "Failed to create invoice.", error: error.message });
      }
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
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
