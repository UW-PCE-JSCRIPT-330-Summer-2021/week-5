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
      { $project: {
        userId: '$userId', item: '$item', total: '$total'
      }},
      { $group: { 
        _id: '$_id', 
        userId: { $first: '$userId' }, 
        items: { $push: '$fullItemInfo' }, 
        total: { $first: '$total' }}},
    ]);
    return order[0];
  } catch (e) {
    next (e)
  }
}

