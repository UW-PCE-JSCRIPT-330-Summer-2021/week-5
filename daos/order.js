const mongoose = require('mongoose');

const Order = require('../models/order');

module.exports = {};

module.exports.getById = async (orderId) => {
  return Order.findOne({ _id: orderId }).populate("items").lean();
}
    
  module.exports.getAll = async () => {
    return Order.find().lean();
  }
  
  module.exports.getAllByUserId = async (userId) => {
    return Order.find({userId: userId}).lean();
  }
    
  module.exports.create = async (itemData) => {
    try {
        const created = Order.create(itemData);
        return created;
    } catch (e) {
      if (e.message.includes('validation failed') || e.message.includes('duplicate key')) {
        throw new BadDataError(e.message);
      }
      throw e;
    }
  }

  module.exports.updateById = async (orderData) => {
    
    if (!mongoose.Types.ObjectId.isValid(orderData._id)) {
      return null;
    }
    const updated = Order.updateOne(orderData);
    return updated;
  }
  

class BadDataError extends Error {};
  module.exports.BadDataError = BadDataError;