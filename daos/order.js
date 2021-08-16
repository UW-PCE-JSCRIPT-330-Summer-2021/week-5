const mongoose = require('mongoose');
const Order = require('../models/order');

module.exports = {};

module.exports.createOrder = async (orderObj) => {
  return await Order.create(orderObj);
}

module.exports.getAll = async () => {
  return await Order.find().lean()
}

module.exports.getOrderByUser = async (userId) => {
  return await Order.find({ userId: userId }).lean()
} 

module.exports.getOrderById = async (orderId) => {
  const orderInfo = await Order.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(orderId) }},
    { $unwind: '$items' },
    { $lookup: {
      from: 'items',
      localField: 'items',
      foreignField: '_id',
      as: 'itemInfo'
    }},
    { $unwind: '$itemInfo' },
    { $group: {
      _id: '$_id', 
      userId: { $first: '$userId' }, 
      items: { $push: '$itemInfo' }, 
      total: { $first: '$total' }
    }},
    { $project: {
      _id: 0,
      items: { __v: 0, _id: 0 }
    }}
  ]);
  return orderInfo[0]
}

