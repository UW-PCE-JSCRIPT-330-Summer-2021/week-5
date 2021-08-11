const mongoose = require('mongoose');
const Order = require('../models/order');

const itemDao = require('./item');

module.exports = {};

// The orderObj received here is processed (e.g. calculation of total), processing of orderObj occur in routes/order.js.
// The function below can directly post orderObj into the db.
module.exports.createOrder = async (orderObj) => {
  try {
    const orderCreated = await Order.create(orderObj);
    return orderCreated;
  } catch (e) {
    throw e;
  }
}

module.exports.getUserOrders = async (userId) => {
  try {
    const userOrders = await Order.find({ userId: userId }).lean();
    return userOrders;
  } catch (e) {
    throw e;
  }
}

module.exports.getOrderById = async (orderId) => {
  try {
    const foundOrder = await Order.findOne({ _id: orderId }).lean();
    let foundItems = [];
    for (let i = 0; i < foundOrder.items.length; i++) {
      let oneItem = await itemDao.getItem(foundOrder.items[i]);
      let item = {
        title: oneItem.title,
        price: oneItem.price
      }
      foundItems.push(item);
    }
    foundOrder.items = foundItems;
    return foundOrder;
  } catch (e) {
    throw e;
  }
}

module.exports.getAll = async () => {
  try {
    const allOrders = await Order.find().lean();
    return allOrders;
  } catch (e) {
    throw e;
  }
}
