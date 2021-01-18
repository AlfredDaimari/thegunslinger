// for handling review logic
const reviewDB_ = require("../db/reviewReadWrite");
const productDB_ = require("../db/productReadWrite");
const revsen = require("./revsen");

async function newReview(user, reviewData) {
  reviewData.reviewedBy = user.firstName + " " + user.lastName;
  const revSen = revsen(reviewData.review); // getting the review's sentiment score
  reviewData.reviewSentiment = revSen.score;
  const review = await reviewDB_.newReview(user, reviewData); // saving to the review database

  // adding to the user's review array
  user.reviews.push({
    _id: review.productId,
    rating: review.rating,
    review: review.review,
    productName: review.productName,
  });
  await user.save();
}

async function newReviewUnknown(reviewData) {
  reviewData.reviewedBy = "Unknown";
  const revSen = revsen(reviewData.review); // getting the review's sentiment score
  reviewData.reviewSentiment = revSen.score;
  await reviewDB_.newReviewUnknown(reviewData);
}

const reviewDB = {
  newReview,
  newReviewUnknown,
};

module.exports = reviewDB;
