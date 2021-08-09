const mongoose = require('mongoose');

const Item = require('../models/item');

module.exports = {};

module.exports.getById = async (itemId) => {
  //  if (!mongoose.Types.ObjectId.isValid(userId)) {
  //   return null;
  // }
  return Item.findById( itemId ).lean();
}
  
module.exports.getAll = async () => {
  return Item.find().lean();
}
  
  module.exports.create = async (itemData) => {
    try {
      const created = Item.create(itemData);
      return created;
    } catch (e) {
      if (e.message.includes('validation failed') || e.message.includes('duplicate key')) {
        throw new BadDataError(e.message);
      }
      throw e;
    }
  }


class BadDataError extends Error {};
  module.exports.BadDataError = BadDataError;