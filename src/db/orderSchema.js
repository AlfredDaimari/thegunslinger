// file for order schema
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    currentStatus: {
      default: "Order has been received",
      type: String,
    },
    deliveryAddress: {
      line1: { required: true, type: String },
      line2: { required: true, type: String },
      landmark: String,
      pincode: { required: true, type: Number },
      state: { required: true, type: String },
    },
    orderedBy: {
      required: true,
      type: String,
    },
    orderedById: {
      required: true, // need to change
      type: mongoose.Schema.Types.ObjectId,
    },
    paymentMethod: {
      required: true,
      type: String,
    },
    productName: {
      required: true,
      type: String,
    },
    productId: {
      required: false, // need to change
      type: mongoose.Schema.Types.ObjectId,
    },
    quantity: {
      default: 1,
      type: Number,
    },
    totalPrice: {
      required: true,
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("orders", orderSchema, "orders");

module.exports = Order;
