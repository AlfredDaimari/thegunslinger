const autoRecom = require("./autorecom");
const productDB_ = require("../db/productReadWrite");
const reviewDB_ = require("../db/reviewReadWrite");
const levDis = require("./levdis");

async function getProductByQuery(query) {
  var products = await productDB_.getProdByQuery(query);
  if (products.length == 0) {
    querySplit = query.split(" "); // removing spaces from query and searching again
    for (let i of querySplit) {
      const prods = await productDB_.getProdByQuery(i);
      products = prods;
    }
  }

  // if products is still empty even after removing spaces, use levenshtein distance
  // don't forget to add did you mean
  if (products.length == 0) {
    query = levDis(query);
    const prods = await productDB_.getProdByQuery(query);
    products = prods;
  }

  return products;
}

async function getProductByCategory(category) {
  const products = await productDB_.getProdByCat(category);
  return products;
}

async function getProductInfo(productId) {
  const { product, simProds, recomProds } = await productDB_.getProductInfo(
    productId
  );
  const rating = await reviewDB_.getAggregate(productId);
  const review = await reviewDB_.getReviews(productId);
  return {
    product,
    review,
    rating,
    simProds,
    recomProds,
  };
}

function getStrRecom(str) {
  //calls function in autorecom.js file
  const recoms = autoRecom(str);
  return recoms;
}

const productDB = {
  getProductByCategory,
  getProductByQuery,
  getProductInfo,
  getStrRecom,
};

module.exports = productDB;
