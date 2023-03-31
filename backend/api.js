const express = require("express");
const fs = require("fs");
const app = express();
const http = require("http");
const cors = require("cors");
const server = http.createServer(app);
app.use(express.json());
app.use(cors());

server.listen(3000, async () => {
  console.log("Server is live on port 3000");
});

app.get("/api/health", (req, res) => {
  res.sendStatus(200);
});

app.get("/api/products", (req, res) => {
  /* Reads the products from products.json, parses and returns it */
  try {
    const products = JSON.parse(fs.readFileSync("products.json"));
    res.status(200).json({ products: products });
  } catch (err) {
    res.status(400).json({ Error: err });
  }
});

app.post("/api/product", (req, res) => {
  /* 
  Reads the new product and writes to the JSON file 
  
  Calculates the productId based on the total elements in the JSON file and returns it to the frontend
  */

  try {
    const newProduct = req.body;
    const products = JSON.parse(fs.readFileSync("products.json"));
    const productId = products.length + 1;
    newProduct["productId"] = productId;
    products.push(newProduct);
    fs.writeFileSync("products.json", JSON.stringify(products));
    res.status(200).json({ productId: productId });
  } catch (err) {
    res.status(400).json({ Error: err });
  }
});

app.put("/api/edit", async (req, res) => {
  /* Finds the ID of the edited product and updates its content in the JSON file */

  try {
    const { productId } = req.body;
    const products = JSON.parse(fs.readFileSync("products.json"));
    // find the product ID that was edited
    const idxOfEditedProduct = products.findIndex(
      (product) => product.productId === productId
    );

    if (idxOfEditedProduct === -1) {
      // no product was found corresponding to this ID
      // send an error message back
      res
        .status(200)
        .json({ Error: `No product was found with ID ${productId}` });
      return;
    }

    products[idxOfEditedProduct] = req.body;
    fs.writeFileSync("products.json", JSON.stringify(products));
    res.status(200).json({ Message: "Successfully updated product" });
  } catch (err) {
    res.status(400).json({ Error: err });
  }
});
