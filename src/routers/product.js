/*
product route file
one will use url query and the other will use url params
*/

const express = require("express");
const productDB = require("../lib/product");

const router = express.Router();

// ?search= or ?category=
router.get("/products", async (req, res) => {
  try {
    const search = req.query.search;
    const category = req.query.category;
    let products;
    if (search) {
      products = await productDB.getProductByQuery(search);
    } else {
      products = await productDB.getProductByCategory(category);
    }
    res.status(200).send(products);
  } catch {
    res.status(400).send();
  }
});

// route for getting auto recommendations
router.get("/products/:search/query", (req, res) => {
  try {
    const recoms = productDB.getStrRecom(req.params.search);
    res.status(200).send(recoms);
  } catch {
    res.status.send(400);
  }
});

router.get("/products/:productId", async (req, res) => {
  try {
    const productDetails = await productDB.getProductInfo(req.params.productId);
    res.status(200).send(productDetails);
  } catch {
    res.status(400).send();
  }
});

module.exports = router;
