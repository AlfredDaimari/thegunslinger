// function for review sentiment
const Sen = require("sentiment");

function reviewSentiment(review) {
  const sen = new Sen();
  return sen.analyze(review);
}

module.exports = reviewSentiment;
