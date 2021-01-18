// function for mocking delivery,
const orderDB_ = require("../db/orderReadWrite");

// mock delivery function
function delivery(orderId, userId, currentStatus) {
  async function deliver(orderId, userId, currentStatus) {
    const statuses = ["has been processed", "undergoing delivery", "delivered"];
    const status = statuses[currentStatus];
    try {
      await orderDB_.updateOrderStatus(orderId, userId, `order ${status}`);
      console.log(`order ${orderId} ${status}`);
    } catch {
      console.log(`order ${orderId} is returning back to the warehouse`);
    }
  }

  setTimeout(deliver, 1 * 30 * 60 * 1000, orderId, userId, ++currentStatus); //after 30 mins
  setTimeout(deliver, 2 * 30 * 60 * 1000, orderId, userId, ++currentStatus); //after 1hr
  setTimeout(deliver, 3 * 30 * 60 * 1000, orderId, userId, ++currentStatus); //after 1 and half hr
}

module.exports = delivery;
