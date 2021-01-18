/*
order route file
all data will be sent in url params
*/

const express = require("express");

const orderDB = require("../lib/order");
const auth = require("../middleware/auth");

const router = express.Router();

// order will be created using the current cart
router.post(
  "/order/:deliveryAddress/:paymentMethod",
  auth,
  async (req, res) => {
    try {
      await orderDB.newOrder(
        req.user,
        req.params.deliveryAddress,
        req.params.paymentMethod
      );
      res.status(201).send();
    } catch {
      res.status(400).send();
    }
  }
);

router.delete("/order/:orderId", auth, async (req, res) => {
  try {
    await orderDB.cancelOrder(req.user, req.params.orderId);
    res.status(201).send();
  } catch {
    res.status(400).send();
  }
});

module.exports = router;
