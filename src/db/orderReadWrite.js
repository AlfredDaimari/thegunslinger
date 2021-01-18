// file for cancelling, finding, creating and updating orders
const Order = require("./orderSchema");
const User = require("./userSchema");

async function cancelOrder(orderId) {
  const order = await Order.findById(orderId);
  if (order.currentStatus != "order delivered") {
    await order.remove();
  } else {
    throw new Error("order already delivered");
  }
}

async function newOrder(orderDetails) {
  const order = new Order(orderDetails);
  await order.save();
  return order;
}

async function updateOrderStatus(orderId, userId, newStatus) {
  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      currentStatus: newStatus,
    },
    { new: true }
  );
  if (!order) {
    throw new Error(); // order not found, hence order has been cancelled
  }
  await User.findOneAndUpdate(
    {
      _id: userId,
      "orders._id": orderId,
    },
    {
      $set: {
        "orders.$.currentStatus": newStatus,
      },
    }
  );
}

const orderDB_ = {
  cancelOrder,
  newOrder,
  updateOrderStatus,
};

module.exports = orderDB_;
