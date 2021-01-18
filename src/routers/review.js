/* 
review route file
all data will be sent in url params
*/
const express = require("express");

const auth = require("../middleware/auth");
const reviewDB = require("../lib/review");

const router = express.Router();

router.post(
  "/review/:productId/:productName/:rating/:review",
  auth,
  async (req, res) => {
    try {
      await reviewDB.newReview(req.user, req.params);
      res.status(201).send();
    } catch {
      res.status(400).send();
    }
  }
);

// review from an unknown source, reviewedBy has to be unknown

router.post(
  "/review/:productId/:productName/:rating/:review/unknown",
  async (req, res) => {
    try {
      await reviewDB.newReviewUnknown(req.params);
      res.status(201).send();
    } catch {
      res.status(400).send();
    }
  }
);

module.exports = router;
