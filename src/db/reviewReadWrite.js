// file for writing reviews
const mongoose = require("mongoose");
const Review = require("./reviewSchema");
const User = require("./userSchema");

async function getAggregate(productId) {
  const rating = await Review.aggregate([
    {
      $match: {
        productId: mongoose.Types.ObjectId(productId),
      },
    },
    {
      $group: {
        _id: "$productId",
        avgRating: {
          $avg: "$rating",
        },
        avgSentiment: {
          $avg: "$reviewSentiment",
        },
      },
    },
  ]);
  if (rating[0]) {
    return {
      avgRating: rating[0].avgRating,
      avgSentiment: rating[0].avgSentiment,
    };
  }
  return {};
}

//function for getting reviews
async function getReviews(productId) {
  const reviews = await Review.aggregate([
    {
      $match: {
        productId: mongoose.Types.ObjectId(productId),
      },
    },
    {
      $project: {
        _id: 1,
        profilePic: 1,
        rating: 1,
        review: 1,
        reviewedBy: 1,
        verifiedBuyer: 1,
      },
    },
  ]);

  return reviews;
}

// function for creating a new review for a product from a user
async function newReview(user, reviewData) {
  //checking if user has ordered the product and the product has actually been delivered

  const userOrders = user.orders.toObject();
  const index = userOrders.findIndex(
    (order) =>
      order.productId == reviewData.productId &&
      order.currentStatus == "order delivered"
  );
  if (index != -1) {
    reviewData.verifiedBuyer = true;
  }
  reviewData.profilePic = user.profilePic;
  const review = new Review(reviewData);
  await review.save();
  return review;
}

// function for creating a review from an unknown source
async function newReviewUnknown(reviewData) {
  reviewData.profilePic = "/img/profilepicunk.png";
  const review = new Review(reviewData);
  await review.save();
  return review;
}

const reviewDB_ = {
  getAggregate,
  getReviews,
  newReview,
  newReviewUnknown,
};

module.exports = reviewDB_;
