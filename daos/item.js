const mongoose = require('mongoose');

const Item = require('../models/item');

module.exports = {};

module.exports.getById = async (itemId) => {
  return Item.findById( itemId ).lean();
}
  
module.exports.getAll = async () => {
  return Item.find().lean();
}

module.exports.getByIds = async (itemData) => {

  const query = { _id: { $in: itemData }};
  return module.exports.getAll(query);
}
  
module.exports.create = async (itemData) => {
    const created = Item.create(itemData);
    return created;
}

module.exports.updateById = async (itemData) => {
  if (!mongoose.Types.ObjectId.isValid(itemData._id)) {
    return null;
  }
  const updated = Item.updateOne(itemData);
  return updated;
}

class BadDataError extends Error {};
  module.exports.BadDataError = BadDataError;