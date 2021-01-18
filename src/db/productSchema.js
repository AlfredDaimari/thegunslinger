// file for product schema
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    buyerList: [
      {
        _id: mongoose.Schema.Types.ObjectId,
      },
    ],
    category: {
      required: true,
      type: String, // guns, outfits and horses
    },
    description: String,
    imgs: [String], // img links of the product, eg: img/thequinton1.jpg
    name: {
      required: true,
      type: String,
    },
    price: Number,
    properties: {
      type_: String, // eg: for outfits, men and women
      colour: [String],
    },
    similarProducts: [mongoose.Schema.Types.ObjectId],
    wishlistCounter: {
      default: 0,
      type: Number,
    },
  },
  { versionKey: false }
);

const Product = mongoose.model("products", productSchema, "products");

module.exports = Product;
