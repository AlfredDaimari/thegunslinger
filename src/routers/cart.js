/* 
cart router file
all data will be sent in url params
*/
const express = require("express");

const auth = require("../middleware/auth");
const userDB = require("../lib/user");

const router = express.Router();

router.get("/cart", auth, (req, res) => {
  const info = userDB.getCartInfo(req.user);
  res.status(200).send(info);
});

router.patch("/cart/:productId/:quantity", auth, async (req, res) => {
  try {
    await userDB.addToCart(req.user, req.params.productId, req.params.quantity);
    res.status(201).send();
  } catch {
    res.status(400).send();
  }
});

router.delete("/cart/:productId/:quantity", auth, async (req, res) => {
  try {
    await userDB.deleteFromCart(
      req.user,
      req.params.productId,
      req.params.quantity
    );
    res.status(201).send();
  } catch {
    res.status(400).send();
  }
});

module.exports = router;
