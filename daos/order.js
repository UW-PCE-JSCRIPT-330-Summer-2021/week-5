const mongoose = require('mongoose');
const Order = require('../models/order');

module.exports = {};

module.exports.createOrder = async (orderObj) => {
  try {
    const created = await Order.create(orderObj);
    return created;
  } catch (e) {
    throw e;
  }
}

module.exports.getAll = async () => {
  return await Order.find().lean()
}

module.exports.getOrderById = async (orderId) => {
  try {
    const orderDetail = await Order.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(orderId) }},
      { $unwind: '$items' },
      { $lookup: { from: 'items',  localField: 'items',  foreignField: '_id',  as: 'itemDetail' }},
      { $unwind: '$itemDetail' },
      { $group: { _id: '$_id', userId: { $first: '$userId' }, items: { $push: '$itemDetail' }, total: { $first: '$total' }}},
      { $project: { _id: 0, items: { __v: 0, _id: 0} }}
    ]);
    return orderDetail[0];
  } catch (e) {
    throw e;
  }
}

module.exports.getOrderByUser = async (userId) => {
  return await Order.find({ userId: userId }).lean();
}