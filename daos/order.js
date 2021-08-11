const mongoose = require('mongoose');
const Order = require('../models/order');
module.exports = {};


module.exports.createOrder = async (orderObj) => {
  try {
    const newOrder = await Order.create(orderObj);
    return newOrder;
  } catch (e) {
    next (e);
  }
}

module.exports.getAllOrders = async () => {
  try {
    const orders = await Order.find().lean();
    return orders;
  } catch (e) {
    next (e)
  }
}

module.exports.getOrderByOrderId = async (orderId) => {
  try {
    const id = mongoose.Types.ObjectId(orderId);
    const order = await Order.aggregate([
      { $match: { _id: id }},
      { $unwind: '$items' },
      { $lookup: { 
        from: 'items', 
        localField: 'items', 
        foreignField: '_id', 
        as: 'fullItemInfo' 
      }},
      { $unwind: '$fullItemInfo' },
      { $group: { 
        _id: '$_id', 
        userId: { $first: '$userId' }, 
        items: { $push: '$fullItemInfo' }, 
        total: { $first: '$total' }}},
      { $project: {
        _id: 0, items: { __v: 0, _id: 0 }}}
    ]);
    return order[0];
  } catch (e) {
    next (e)
  }
}

module.exports.getOrderByUserId = async (id) => {
  try {
    const order = await Order.find({ userId: id }).lean();
    return order;
  } catch (e) {
    next (e)
  }
}

