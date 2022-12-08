import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";

var app = express();

const port = process.env.PORT || 8080;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("coffee-server is running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xfw1t3g.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("successfully connected to MongoDB!");

    // create a database
    const db = client.db("coffee-store");
    const coffeeCollection = db.collection("coffee");

    // insert into databasde
    app.post("/add", async (req, res) => {
      const coffee = req.body;
      // const {name, chef, taste, category, supplier, photo, jk}
      const result = await coffeeCollection.insertOne(coffee);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

var listener = app.listen(port, function () {
  console.log("Listening on port " + listener.address().port);
});
