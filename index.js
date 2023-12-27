require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7grn8zj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  // await client.connect();
  console.log("📍Database connection established");
  try {
    const db = client.db("elara-elegance");
    const categoriesCollection = db.collection("categories");
    const productCollection = db.collection("product");
    // get all product
    app.get("/all-product", async (req, res) => {
      const allProducts = await productCollection.find({}).toArray();
      res.send({ status: true, message: "success", data: allProducts });
    });

    // get specific product
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const product = await productCollection.findOne({ _id: ObjectId(id) });
      res.send({ status: true, message: "success", data: product });
    });

    // get all categories
    app.get("/categories", async (req, res) => {
      const categories = await categoriesCollection.find({}).toArray();
      res.send({ status: true, message: "success", data: categories });
    });

    // get specific categories
    app.get("/product", async (req, res) => {
      const name = req.query.category;
      let productes = [];
      if (name == "all-product") {
        productes = await productCollection.find({}).toArray();
        return res.send({ status: true, message: "success", data: productes });
      }
      productes = await productCollection
        .find({ category: { $regex: name, $options: "i" } })
        .toArray();
      res.send({ status: true, message: "success", data: productes });
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Welcome to the Elara Elegance Server!");
});

app.listen(port, () => {
  console.log(`🚀 Server is listening on port ${port}`);
});