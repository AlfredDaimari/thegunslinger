// function for setting up an order
const orderDB_ = require("../db/orderReadWrite");
const productDB_ = require("../db/productReadWrite");
const delivery = require("./delivery");

// function that creates a new order and mocks the delivery function
async function newOrder(user, deliveryAddress, paymentMethod) {
  const address = user.address[deliveryAddress];
  // looping through the entire cart of the user
  while (user.cart.length != 0) {
    // creating new order
    let item = user.cart[0];
    const order = await orderDB_.newOrder({
      deliveryAddress: {
        line1: address.line1,
        line2: address.line2,
        landmark: address.landmark,
        pincode: address.pincode,
        state: address.state,
      },
      orderedBy: user.firstName,
      orderedById: user._id,
      paymentMethod,
      productId: item._id,
      productName: item.productName,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    });

    // adding to user's order array
    user.orders.push({
      _id: order._id,
      currentStatus: "order has been received",
      paymentMethod,
      productId: item._id,
      productName: item.productName,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    });
    user.cart.pull(order.productId.toString()); // deleting item from user's cart
    await user.save();

    await productDB_.addToBuyerList(order.productId.toString(), user._id); // adding to product's buyerlist array
    console.log(`Delivery for order ${order._id} underway.`);
    delivery(order._id, user._id, -1); // starting delivery once order has been placed
  }
}

async function cancelOrder(user, orderId) {
  try {
    await orderDB_.cancelOrder(orderId);
    user.orders.pull(orderId); // deleting from user's order list
    await user.save();
  } catch {
    console.log(`order ${orderId} has been delivered, cannot cancel`);
  }
}

const orderDB = {
  cancelOrder,
  newOrder,
};
module.exports = orderDB;
