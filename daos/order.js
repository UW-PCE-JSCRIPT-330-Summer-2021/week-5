const mongoose = require('mongoose');

const { update } = require('../models/order');
const Order = require('../models/order');
const orderDAO = require('../daos/item');
const itemDao = require('../daos/item');

module.exports = {};

module.exports.getById = async (orderId) => {
    //  if (!mongoose.Types.ObjectId.isValid(userId)) {
    //   return null;
    // }
    return Order.findById( orderId ).lean();
  }
    
  module.exports.getAll = async () => {
    return Order.find().lean();
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