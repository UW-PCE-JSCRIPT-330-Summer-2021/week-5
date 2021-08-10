const Order = require('../models/order');
const mongoose = require('mongoose');

module.exports = {};

module.exports.createOrder = async (orderObj) => {
  return await Order.create(orderObj);
}

module.exports.getAllOrders = async () => {
  return await Order.find().lean();
} 

module.exports.getUserOrder = async (userId) => {
  return await Order.find({ userId: userId }).lean();
}

module.exports.getOrderById = async (orderId) => {
  try {
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
        total: { $first: '$total' }}},
      { $project: { 
        _id: 0,
        items: { __v: 0, _id: 0 }
      }}
    ]);
    return orderInfo[0];
  }
  catch (e) {
    next(e);
  }
}