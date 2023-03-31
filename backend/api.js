const express = require("express");
const fs = require("fs");
const app = express();
const http = require("http");
const cors = require("cors");
const server = http.createServer(app);
app.use(express.json());
app.use(cors());

server.listen(5000, async () => {
  console.log("Server is live on port 5000");
});

app.get("/health", async (req, res) => {});

app.get("/products", async (req, res) => {
  /* Reads the products from products.json, parses and returns it*/
  try {
    const products = JSON.parse(fs.readFileSync("products.json"));
    res.status(200).json({ products: products });
  } catch (err) {
    res.status(400).json({ Error: err.content });
  }
});
