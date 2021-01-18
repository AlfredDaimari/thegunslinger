// file for review schema
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    productName: {
      required: true,
      type: String,
    },
    profilePic: {
      required: true,
      type: String,
    },
    rating: {
      required: true,
      type: Number,
    },
    review: {
      required: true,
      type: String,
    },
    reviewedBy: {
      required: true,
      type: String,
    },
    reviewSentiment: {
      required: true,
      type: Number,
    },
    verifiedBuyer: {
      default: false,
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("reviews", reviewSchema, "reviews");

module.exports = Review;
