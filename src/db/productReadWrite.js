// file for reading products
const Order = require("./orderSchema");
const Product = require("./productSchema");

// function for adding the buyer to product's buyer list array
async function addToBuyerList(productId, buyerId) {
  const product = await Product.findById(productId);
  product.buyerList.push({
    _id: buyerId,
  });
  await product.save();
}

// function for decreasing product's wishlist counter
async function decreaseWishlistCounter(productId) {
  await Product.findByIdAndUpdate(productId, {
    $inc: {
      wishlistCounter: -1,
    },
  });
}

// function for getting all info for a product - info, reviews, average review rating
async function getProductInfo(productId) {
  const prod = await Product.findById(productId);

  // destructuring product, to avoid sending sensitive data
  const product = {
    _id: prod._id,
    category: prod.category,
    description: prod.description,
    imgs: prod.imgs,
    name: prod.name,
    price: prod.price,
    properties: prod.properties,
    wishlistCounter: prod.wishlistCounter,
  };

  const simProds = []; // list for similar products
  for (let prdId of prod.similarProducts) {
    const { _id, imgs, name, price } = await Product.findById(prdId);
    simProds.push({
      _id,
      img: imgs[0],
      name,
      price,
    });
  }

  const buyerList = []; // list of buyers
  for (buyer of prod.buyerList) {
    buyerList.push({
      orderedById: buyer._id,
    });
  }

  // if the list has buyers, aggregate for what others buyers have also bought
  let recom = []; // products that other buyer's bought
  if (buyerList.length != 0) {
    recom = await Order.aggregate([
      {
        $match: {
          $or: buyerList,
        },
      },
      {
        $group: {
          _id: "$productId",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: 1,
        },
      },
      {
        $limit: 5,
      },
    ]);
  }

  const recomProds = []; //list of recommendations, based on buyer list
  for (prd of recom) {
    const { _id, imgs, name, price } = await Product.findById(prd._id);
    recomProds.push({
      _id,
      img: imgs[0],
      name: name,
      price: price,
    });
  }
  return {
    product,
    simProds,
    recomProds,
  };
}

async function getProdByQuery(query) {
  query = { name: { $regex: new RegExp(query, "i") } };
  let products = await Product.find(query);
  let prodList = [];
  for (prod of products) {
    const prd = prod.toObject();
    prodList.push({
      _id: prd._id,
      category: prd.category,
      img: prd.imgs[0],
      name: prd.name,
      price: prd.price,
      properties: prd.properties,
    });
  }
  return prodList;
}

// function for getting products using category
async function getProdByCat(category) {
  let products = await Product.find({ category });
  let prodList = [];
  for (prod of products) {
    const prd = prod.toObject();
    prodList.push({
      _id: prd._id,
      category: prd.category,
      img: prd.imgs[0],
      name: prd.name,
      price: prd.price,
      properties: prd.properties,
    });
  }
  return prodList;
}

async function increaseWishlistCounter(productId) {
  await Product.findByIdAndUpdate(productId, {
    $inc: {
      wishlistCounter: 1,
    },
  });
}

const productDB_ = {
  addToBuyerList,
  decreaseWishlistCounter,
  getProductInfo,
  getProdByQuery,
  getProdByCat,
  increaseWishlistCounter,
};

module.exports = productDB_;
