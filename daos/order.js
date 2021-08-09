const Order = require('../models/order');
module.exports = {};

module.exports.createOrder = async (orderObj) => {
  const order = await Order.create(orderObj);
  return order;
}

module.exports.getAllOrders = async () => {
  const orders = await Order.find().lean();
  return orders;
}

module.exports.getOrderByUserId = async (userId) => {
  const order = await Order.find({ userId: userId }).lean();
  return order;
}

module.exports.getOrderByOrderId = async (orderId) => {
  const order = await Order.aggregate([

  ]);
  return order;
}

